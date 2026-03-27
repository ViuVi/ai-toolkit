import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'video-finder'

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, contentType, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are TrendSpotter, expert at finding viral video ideas.

Return ONLY valid JSON:
{
  "video_ideas": [
    {
      "title": "video title",
      "concept": "brief concept",
      "hook": "opening hook",
      "viral_potential": "high/medium",
      "why_it_works": "reason",
      "best_time_to_post": "timing"
    }
  ],
  "trending_formats": ["format 1", "format 2"],
  "content_gaps": ["gap 1", "gap 2"],
  "niche_insight": "insight about this niche"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Find 10 viral video ideas for: "${niche}"
Platform: ${platform}, Content Type: ${contentType}
${langMap[language] || langMap['en']}
Respond with ONLY JSON.`

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
    console.error('Video Finder Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
