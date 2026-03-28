import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, count, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'video-ideas')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const now = new Date()
    const month = now.toLocaleString('en-US', { month: 'long' })
    const season = [11,0,1].includes(now.getMonth()) ? 'Winter' : [2,3,4].includes(now.getMonth()) ? 'Spring' : [5,6,7].includes(now.getMonth()) ? 'Summer' : 'Fall'

    const langMap: Record<string, string> = {
      'tr': 'Write ALL ideas in Turkish.',
      'en': 'Write all ideas in English.',
      'ru': 'Write all ideas in Russian.',
      'de': 'Write all ideas in German.',
      'fr': 'Write all ideas in French.'
    }

    const systemPrompt = `You are a viral video strategist. You create specific, shoot-ready video ideas based on current trends, seasonal events, and the creator's niche.

Return ONLY valid JSON:
{
  "ideas": [
    {
      "title": "video title/concept",
      "hook": "opening hook (first 3 seconds)",
      "script_outline": "brief 3-step script outline",
      "format": "tutorial/storytime/challenge/duet/trend/educational/behind-the-scenes",
      "duration": "15s/30s/60s/3min",
      "viral_potential": 8,
      "best_time": "Tuesday 9AM",
      "why_now": "why this video works right now",
      "hashtags": ["#tag1", "#tag2"]
    }
  ],
  "seasonal_bonus": {
    "event": "current/upcoming event or holiday",
    "idea": "specific video idea tied to this event",
    "urgency": "post within X days"
  },
  "weekly_plan": {
    "monday": "idea type",
    "wednesday": "idea type",
    "friday": "idea type"
  }
}`

    const userPrompt = `Generate ${count || 10} shoot-ready video ideas for: "${niche}"

Platform: ${platform || 'tiktok'}
Current month: ${month} (${season})
Today: ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
${langMap[language as string] || langMap['en']}

Consider:
- Current seasonal events and holidays
- Platform-specific trends
- Mix of content types (educational, entertaining, storytelling)
- Each idea should be specific enough to film TODAY
${brandContext}

Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.9, max_tokens: 5000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    let result
    try {
      let clean = content.trim()
      if (clean.startsWith('```json')) clean = clean.slice(7)
      else if (clean.startsWith('```')) clean = clean.slice(3)
      if (clean.endsWith('```')) clean = clean.slice(0, -3)
      result = JSON.parse(clean.trim())
    } catch { result = { raw: content } }

    await saveContent(userId, 'video-ideas', niche, result)

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Video Ideas Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
