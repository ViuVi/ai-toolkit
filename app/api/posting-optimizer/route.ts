import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, timezone, targetAudience, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are TimingGuru, expert at finding the optimal posting times for maximum reach and engagement.

TIMING FACTORS:
1. Platform algorithm behavior
2. Audience active hours
3. Content type timing
4. Competition analysis
5. Engagement patterns

GENERAL PATTERNS:
- Morning (6-9 AM): Commute scrolling, news catching
- Midday (11 AM-1 PM): Lunch break browsing
- Afternoon (3-5 PM): Work break, boredom scrolling
- Evening (7-9 PM): Prime time, relaxation mode
- Night (9-11 PM): Late scrolling, deeper engagement

PLATFORM-SPECIFIC:
- TikTok: 7 PM - 9 PM peak, late night performs well
- Instagram: 11 AM - 1 PM and 7 PM - 9 PM
- YouTube: 2 PM - 4 PM for algorithm pickup before evening
- Twitter: 8 AM - 10 AM and 12 PM - 1 PM
- LinkedIn: 7 AM - 8 AM and 5 PM - 6 PM (work hours edge)

CONTENT TYPE TIMING:
- Educational: Morning (learning mindset)
- Entertainment: Evening (relaxation mode)
- Motivational: Monday morning, Sunday evening
- Promotional: Tuesday-Thursday midday

Return ONLY valid JSON:
{
  "optimal_times": {
    "best_overall": {
      "day": "best day",
      "time": "best time",
      "reasoning": "why this works"
    },
    "runner_up": {
      "day": "second best day",
      "time": "second best time",
      "reasoning": "why this works"
    }
  },
  "by_platform": {
    "tiktok": {
      "best_times": [
        {"day": "day", "time": "time", "engagement_level": "high/medium"}
      ],
      "avoid_times": ["time to avoid"],
      "reasoning": "platform-specific insight"
    },
    "instagram": {
      "best_times": [
        {"day": "day", "time": "time", "engagement_level": "high/medium"}
      ],
      "reels_specific": "best time for reels",
      "stories_specific": "best times for stories"
    },
    "youtube": {
      "best_times": [
        {"day": "day", "time": "time", "engagement_level": "high/medium"}
      ],
      "shorts_timing": "best for shorts",
      "long_form_timing": "best for long videos"
    },
    "twitter": {
      "best_times": [
        {"day": "day", "time": "time", "engagement_level": "high/medium"}
      ],
      "thread_timing": "best for threads"
    }
  },
  "weekly_schedule": {
    "monday": {"time": "posting time", "content_type": "best content type", "reasoning": "why"},
    "tuesday": {"time": "posting time", "content_type": "best content type", "reasoning": "why"},
    "wednesday": {"time": "posting time", "content_type": "best content type", "reasoning": "why"},
    "thursday": {"time": "posting time", "content_type": "best content type", "reasoning": "why"},
    "friday": {"time": "posting time", "content_type": "best content type", "reasoning": "why"},
    "saturday": {"time": "posting time", "content_type": "best content type", "reasoning": "why"},
    "sunday": {"time": "posting time", "content_type": "best content type", "reasoning": "why"}
  },
  "content_type_timing": {
    "educational": {"best_time": "time", "best_day": "day"},
    "entertaining": {"best_time": "time", "best_day": "day"},
    "promotional": {"best_time": "time", "best_day": "day"},
    "personal": {"best_time": "time", "best_day": "day"}
  },
  "audience_insights": {
    "peak_active_hours": ["hour 1", "hour 2", "hour 3"],
    "low_activity_hours": ["hour 1", "hour 2"],
    "weekend_vs_weekday": "insight"
  },
  "pro_tips": [
    {"tip": "timing tip", "impact": "expected improvement"},
    {"tip": "timing tip", "impact": "expected improvement"},
    {"tip": "timing tip", "impact": "expected improvement"}
  ],
  "testing_plan": {
    "week_1": "what to test",
    "week_2": "what to test",
    "how_to_measure": "metrics to track"
  }
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL recommendations in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Find optimal posting times for:
Niche: ${niche}
Platforms: ${platforms || 'TikTok, Instagram, YouTube'}
Timezone: ${timezone || 'general guidance (mention timezone considerations)'}
Target audience: ${targetAudience || 'general audience'}
${langInstruction}

Provide comprehensive posting schedule with reasoning.
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
        temperature: 0.7,
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
    console.error('Posting Optimizer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
