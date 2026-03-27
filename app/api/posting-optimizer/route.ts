import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'posting-optimizer'

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, timezone, audience, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are PostingOptimizer, expert at finding best posting times.

Return ONLY valid JSON:
{
  "best_times": [
    {"day": "Monday", "times": ["9:00 AM", "12:00 PM", "6:00 PM"], "reason": "why"}
  ],
  "peak_hours": {"weekdays": ["time"], "weekends": ["time"]},
  "avoid_times": [{"time": "when", "reason": "why"}],
  "frequency_recommendation": {"posts_per_day": 2, "posts_per_week": 10},
  "platform_specific": {"algorithm_tips": ["tip"], "best_practices": ["practice"]},
  "weekly_schedule": {"monday": "time", "tuesday": "time"}
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Optimize posting times for: "${niche}"
Platform: ${platform}, Timezone: ${timezone || 'UTC'}, Audience: ${audience || 'general'}
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
    console.error('Posting Optimizer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
