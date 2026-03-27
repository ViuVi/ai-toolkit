import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'content-planner'

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, postsPerWeek, duration, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are ContentStrategist, expert at content planning.

Return ONLY valid JSON:
{
  "content_pillars": [{"pillar": "name", "description": "desc", "content_ratio": "30%"}],
  "weekly_schedule": [
    {"day": "Monday", "content_type": "type", "topic_idea": "idea", "best_time": "9:00 AM"}
  ],
  "content_ideas": [{"title": "title", "format": "format", "pillar": "pillar", "hook": "hook"}],
  "hashtag_strategy": {"primary": ["#tag"], "secondary": ["#tag"], "niche": ["#tag"]},
  "growth_tips": ["tip1", "tip2"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Create ${duration || '4 week'} content plan for: "${niche}"
Platform: ${platform}, Posts/week: ${postsPerWeek || 5}
${langMap[language] || langMap['en']}
Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.8, max_tokens: 5000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Content Planner Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
