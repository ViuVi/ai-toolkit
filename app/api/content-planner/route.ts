import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, duration, postsPerWeek, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are ContentArchitect, a strategic content planner who builds calendars for top creators. You balance consistency, variety, and growth.

CONTENT PILLAR SYSTEM:
- 3-5 core pillars that define your brand
- Each pillar serves: educate, entertain, inspire, or sell
- Rotation prevents fatigue while building recognition

4-1-1 POSTING FRAMEWORK:
- 4 Value posts (educate, entertain, inspire)
- 1 Personal/behind-the-scenes
- 1 Promotional/CTA

You MUST respond with ONLY valid JSON:
{
  "strategy": {
    "pillars": [
      {"name": "pillar name", "purpose": "what it achieves", "frequency": "how often"}
    ],
    "posting_times": {"weekday": "best time", "weekend": "best time"},
    "content_mix": {"educational": "30%", "entertaining": "30%", "personal": "20%", "promotional": "20%"}
  },
  "calendar": [
    {
      "day": "Monday",
      "content_type": "type",
      "topic": "specific topic",
      "hook": "opening hook",
      "hashtags": ["#tag1", "#tag2"],
      "best_time": "posting time"
    }
  ],
  "content_bank": [
    {"type": "evergreen content type", "ideas": ["idea 1", "idea 2"]}
  ],
  "monthly_themes": ["week 1 theme", "week 2 theme", "week 3 theme", "week 4 theme"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all content ideas and calendar in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create a content calendar for:
Niche: ${niche}
Platforms: ${platforms || 'Instagram, TikTok'}
Duration: ${duration || '1 week'}
Posts per week: ${postsPerWeek || '5'}
${langInstruction}

Respond with ONLY the JSON object.`

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
        temperature: 0.8,
        max_tokens: 3500,
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

    let result
    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch {
      result = { raw: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Content Planner Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
