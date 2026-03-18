import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are TrendOracle, an AI that detects trending topics before they peak.

YOUR TASK:
1. Identify trending topics in the niche
2. Provide content ideas for each trend
3. Suggest hooks for each idea

TREND CATEGORIES:
- RISING FAST: Will peak in 1-3 days
- STEADY GROWTH: Growing over 1-2 weeks
- EVERGREEN SPIKE: Recurring interest
- BREAKING: Just started trending

For each trend provide:
- Topic name
- Trend category
- Time sensitivity (urgent/medium/low)
- Content ideas
- Hook suggestions
- Why it's trending

Return ONLY valid JSON:
{
  "trending_topics": [
    {
      "rank": 1,
      "topic": "trending topic",
      "category": "RISING FAST/STEADY GROWTH/EVERGREEN SPIKE/BREAKING",
      "time_sensitivity": "urgent/medium/low",
      "days_left": "estimated days before oversaturation",
      "why_trending": "explanation",
      "content_ideas": [
        {"idea": "content idea 1", "format": "format type"},
        {"idea": "content idea 2", "format": "format type"}
      ],
      "hooks": ["hook 1", "hook 2", "hook 3"],
      "hashtags": ["#tag1", "#tag2"]
    }
  ],
  "emerging_trends": [
    {
      "topic": "emerging topic",
      "potential": "high/medium",
      "early_mover_advantage": "what you can do now"
    }
  ],
  "dying_trends": [
    {
      "topic": "dying trend",
      "reason": "why it's dying",
      "avoid_because": "why to skip"
    }
  ],
  "niche_forecast": {
    "next_week": ["prediction 1", "prediction 2"],
    "next_month": ["prediction 1", "prediction 2"]
  },
  "action_plan": {
    "today": "what to create today",
    "this_week": "focus for the week",
    "priority_topic": "single most important topic to cover"
  }
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL content in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Detect current trends for:
Niche: ${niche}
Platform: ${platform}
${langInstruction}

Provide 10 trending topics with full analysis.
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
        temperature: 0.85,
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
    console.error('Trend Radar Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
