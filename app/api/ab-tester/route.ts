import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'ab-tester'

export async function POST(request: NextRequest) {
  try {
    const { contentA, contentB, platform, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!contentA || !contentB) {
      return NextResponse.json({ error: 'Both contents are required' }, { status: 400 })
    }

    const systemPrompt = `You are ABTestExpert, analyzing content performance potential.

Return ONLY valid JSON:
{
  "winner": "A" or "B",
  "confidence": 85,
  "analysis": {
    "content_a": {"score": 75, "strengths": ["str"], "weaknesses": ["weak"]},
    "content_b": {"score": 82, "strengths": ["str"], "weaknesses": ["weak"]}
  },
  "comparison": [{"aspect": "Hook", "winner": "B", "reason": "why"}],
  "recommendations": {"for_a": ["improve"], "for_b": ["improve"]},
  "combined_best": "optimal version combining best of both"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Compare these contents:
A: "${contentA}"
B: "${contentB}"
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
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('AB Tester Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
