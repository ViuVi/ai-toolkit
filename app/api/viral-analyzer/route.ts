import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'viral-analyzer'

export async function POST(request: NextRequest) {
  try {
    const { content, platform, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const systemPrompt = `You are ViralAnalyst, expert at predicting content virality.

Return ONLY valid JSON:
{
  "viral_score": 75,
  "analysis": {
    "hook_strength": {"score": 8, "feedback": "feedback"},
    "emotional_trigger": {"score": 7, "emotion": "curiosity", "feedback": "feedback"},
    "shareability": {"score": 8, "feedback": "feedback"},
    "engagement_potential": {"score": 7, "feedback": "feedback"}
  },
  "improvements": [{"issue": "issue", "suggestion": "fix", "impact": "high/medium/low"}],
  "optimized_version": "improved content",
  "prediction": "viral potential summary"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Analyze viral potential: "${content}"
Platform: ${platform}
${langMap[language] || langMap['en']}
Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.7, max_tokens: 3000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content2 = data.choices?.[0]?.message?.content
    if (!content2) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content2), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Viral Analyzer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
