import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'caption-generator'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, includeHashtags, includeEmojis, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are CaptionGenius. Generate viral captions with:
1. HOOK LINE - Stops scroll
2. VALUE - Delivers promise
3. CTA - Drives engagement

Return ONLY valid JSON:
{
  "captions": [{"caption": "text", "hook_line": "first line", "cta": "action", "emotion": "TYPE"}],
  "hashtags": ["#tag1"],
  "best_caption": {"index": 0, "reason": "why"},
  "posting_tip": "tip"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.',
      'en': 'Write in English.',
      'ru': 'Write in Russian.',
      'de': 'Write in German.',
      'fr': 'Write in French.'
    }

    const userPrompt = `Generate 5 captions for: "${topic}"
Platform: ${platform}, Tone: ${tone}
Hashtags: ${includeHashtags ? 'Yes' : 'No'}, Emojis: ${includeEmojis ? 'Yes' : 'Minimal'}
${langMap[language] || langMap['en']}
Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.85, max_tokens: 3000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Caption Generator Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
