import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'steal-video'

export async function POST(request: NextRequest) {
  try {
    const { videoDescription, platform, yourNiche, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!videoDescription) {
      return NextResponse.json({ error: 'Video description is required' }, { status: 400 })
    }

    const systemPrompt = `You are ContentRemixer, expert at ethically adapting viral content.

Return ONLY valid JSON:
{
  "analysis": {"original_hook": "hook", "viral_elements": ["elem1"], "target_emotion": "emotion"},
  "adaptations": [
    {
      "title": "adapted title",
      "new_angle": "your unique angle",
      "hook": "new hook",
      "script_outline": "brief outline",
      "differentiation": "how it's different"
    }
  ],
  "content_tips": ["tip1", "tip2"],
  "legal_notes": "reminder about originality"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Analyze and create adaptations for: "${videoDescription}"
Platform: ${platform}, Your Niche: ${yourNiche}
${langMap[language] || langMap['en']}
Create 5 unique adaptations. Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.85, max_tokens: 4000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Steal Video Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
