import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "ContentArchitect" - a strategic content planner who has built content calendars for creators generating $10M+/year. You understand how to balance consistency, variety, and strategic timing for maximum growth.

YOUR CONTENT PLANNING PHILOSOPHY:

1. THE CONTENT PILLAR SYSTEM
   - 3-5 core pillars that define your brand
   - Each pillar serves a purpose: educate, entertain, inspire, sell
   - Rotation prevents fatigue while building recognition

2. THE 4-1-1 POSTING FRAMEWORK
   - 4 Value posts (educate, entertain, inspire)
   - 1 Personal/behind-the-scenes
   - 1 Promotional/CTA
   - Ratio keeps audience engaged without feeling sold to

3. STRATEGIC TIMING
   - Platform-specific peak times
   - Content type timing (educational AM, entertainment PM)
   - Trend-jacking windows
   - Launch and campaign timing

4. CONTENT BATCHING
   - Batch similar content types
   - Create content clusters around themes
   - Repurposing strategy built-in

5. THE MOMENTUM FORMULA
   - Consistent posting builds algorithm trust
   - Quality > quantity, but consistency is non-negotiable
   - Rest days planned, not random

6. CONTENT CALENDAR ARCHITECTURE
   - Weekly themes for focus
   - Daily content type rotation
   - Flex slots for trending content
   - Buffer content for emergencies

Think strategically in English, deliver comprehensive calendars in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, duration, postsPerWeek, goals, language } = await request.json()

    const langMap: Record<string, string> = {
      'tr': 'Provide the entire content calendar with all titles, hooks, and descriptions in fluent Turkish.',
      'en': 'Provide in English.',
      'ru': 'Provide all content in fluent Russian.',
      'de': 'Provide all content in fluent German.',
      'fr': 'Provide all content in fluent French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create a comprehensive content calendar:

Niche: ${niche}
Platforms: ${platforms}
Duration: ${duration || '2 weeks'}
Posts per week: ${postsPerWeek || '5'}
Goals: ${goals || 'Grow audience and engagement'}

${langInstruction}

BUILD A STRATEGIC CONTENT CALENDAR:

Return as JSON:
{
  "content_strategy": {
    "pillars": [
      {
        "name": "Pillar name",
        "purpose": "What it achieves",
        "content_types": ["Type 1", "Type 2"],
        "frequency": "How often"
      }
    ],
    "posting_schedule": {
      "optimal_times": {"monday": "time", "tuesday": "time"},
      "rationale": "Why these times"
    },
    "content_mix": {
      "educational": "30%",
      "entertaining": "30%",
      "personal": "20%",
      "promotional": "20%"
    }
  },
  "calendar": [
    {
      "week": 1,
      "theme": "Weekly theme",
      "days": [
        {
          "day": "Monday",
          "date": "Example date",
          "platform": "Platform",
          "content_type": "Type",
          "pillar": "Which pillar",
          "topic": "Content topic",
          "title": "Video/post title",
          "hook": "Opening hook",
          "key_points": ["Point 1", "Point 2"],
          "cta": "Call to action",
          "hashtags": ["#tag1", "#tag2"],
          "best_time": "Posting time",
          "content_status": "To create",
          "notes": "Additional notes"
        }
      ]
    }
  ],
  "content_batching_plan": {
    "batch_1": {
      "theme": "Batch theme",
      "contents": ["Content 1", "Content 2"],
      "filming_time": "Estimated time",
      "batch_day": "Recommended day"
    }
  },
  "trending_slots": [
    {
      "day": "Day",
      "purpose": "React to trends",
      "guidelines": "How to use this slot"
    }
  ],
  "repurposing_strategy": [
    {
      "original": "Original content",
      "repurpose_to": ["Format 1", "Format 2"],
      "platforms": ["Platform 1", "Platform 2"]
    }
  ],
  "kpis_to_track": [
    {
      "metric": "Metric name",
      "target": "Target value",
      "why": "Why this matters"
    }
  ],
  "monthly_review_questions": [
    "Question 1 to ask yourself",
    "Question 2"
  ],
  "emergency_content_bank": [
    {
      "type": "Evergreen content type",
      "ideas": ["Idea 1", "Idea 2"],
      "when_to_use": "Low engagement days"
    }
  ]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    let result
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content }
    } catch {
      result = { raw: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Content Planner Error:', error)
    return NextResponse.json({ error: 'Failed to create content plan' }, { status: 500 })
  }
}
