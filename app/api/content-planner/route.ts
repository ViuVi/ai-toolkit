import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, postsPerWeek, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are ContentArchitect, expert at creating content calendars that drive consistent growth.

CALENDAR RULES:
1. Never repeat same format consecutively
2. Mix content types for variety
3. Include trending + evergreen content
4. Plan for engagement peaks

CONTENT TYPES TO ROTATE:
- Educational (how-to, tips)
- Entertaining (humor, relatable)
- Storytelling (personal, journey)
- Trending (current topics)
- Behind-the-scenes
- User-generated/Interactive

For each day provide:
- Topic
- Hook
- Format type
- Best posting time

Return ONLY valid JSON:
{
  "strategy": {
    "posting_frequency": "X times per week",
    "content_pillars": ["pillar 1", "pillar 2", "pillar 3"],
    "format_rotation": ["format 1", "format 2", "format 3"]
  },
  "calendar": [
    {
      "day": 1,
      "date": "Day 1",
      "topic": "content topic",
      "hook": "scroll-stopping hook",
      "format": "EDUCATIONAL/ENTERTAINING/STORYTELLING/TRENDING/BTS/INTERACTIVE",
      "content_pillar": "which pillar",
      "best_time": "optimal posting time",
      "hashtags": ["#tag1", "#tag2", "#tag3"],
      "notes": "additional tips"
    }
  ],
  "weekly_themes": [
    {"week": 1, "theme": "theme name", "focus": "what to focus on"},
    {"week": 2, "theme": "theme name", "focus": "what to focus on"},
    {"week": 3, "theme": "theme name", "focus": "what to focus on"},
    {"week": 4, "theme": "theme name", "focus": "what to focus on"}
  ],
  "content_batching": {
    "batch_day": "best day to batch create",
    "batch_groups": [
      {"type": "content type", "quantity": 5, "time_needed": "2 hours"}
    ]
  },
  "engagement_strategy": {
    "respond_within": "time to respond to comments",
    "engagement_times": ["time 1", "time 2"],
    "community_building": "strategy for community"
  },
  "monthly_goals": {
    "content_goal": "how many posts",
    "engagement_goal": "target engagement",
    "growth_goal": "follower target"
  }
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL content topics and hooks in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create a 30-day content calendar for:
Niche: ${niche}
Platforms: ${platforms || 'Instagram, TikTok'}
Posts per week: ${postsPerWeek || '5'}
${langInstruction}

Create a complete 30-day calendar with topics, hooks, and formats.
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
        max_tokens: 6000,
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
