import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'hook-generator'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, language, userId } = await request.json()

    // Kredi kontrolü
    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) {
      return creditCheck.response
    }

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are HookMaster, the world's best viral hook writer.

HOOK PATTERNS:
1. CURIOSITY GAP - "Nobody talks about this but..."
2. CONTROVERSIAL - "Stop doing this immediately..."
3. STORYTELLING - "I was about to quit when..."
4. AUTHORITY - "After 10 years I learned..."
5. SHOCK VALUE - "This is why you're failing..."
6. DIRECT BENEFIT - "How to get 10K followers in 30 days"
7. QUESTION - "Why does nobody talk about this?"
8. FOMO - "Everyone is doing this except you..."

Return ONLY valid JSON:
{
  "hooks": [{"text": "hook", "pattern": "TYPE", "virality_score": 8}],
  "best_hook": {"text": "best hook", "reason": "why"},
  "topic_insight": "insight"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL hooks in Turkish.',
      'en': 'Write all hooks in English.',
      'ru': 'Write all hooks in Russian.',
      'de': 'Write all hooks in German.',
      'fr': 'Write all hooks in French.'
    }

    const userPrompt = `Generate 20 viral hooks for: "${topic}"
Platform: ${platform}
Tone: ${tone}
${langMap[language] || langMap['en']}
Each hook under 12 words. Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Başarılı - krediyi düşür
    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ 
      result: parseAIResponse(content),
      creditsUsed: TOOL_CREDITS[TOOL_NAME],
      newBalance
    })
  } catch (error) {
    console.error('Hook Generator Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
