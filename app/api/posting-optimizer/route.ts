import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "TimingGuru" - a data scientist who has analyzed 50 million social media posts to crack the code of optimal posting times. You understand how platform algorithms, audience behavior, and content type intersect to determine reach.

YOUR TIMING INTELLIGENCE:

1. PLATFORM ALGORITHM WINDOWS
   - Each platform has "high distribution" windows
   - First-hour engagement critical for reach
   - Algorithm evaluates velocity, not just volume

2. AUDIENCE BEHAVIOR PATTERNS
   - Wake-up scrolling (6-9 AM)
   - Commute consumption (8-9 AM, 5-7 PM)
   - Lunch break browsing (12-2 PM)
   - Evening relaxation (7-10 PM)
   - Late night deep dives (10 PM-12 AM)

3. CONTENT TYPE TIMING
   - Educational: Morning (learning mindset)
   - Entertainment: Evening (relaxation mode)
   - News/Trending: As it happens + morning recap
   - Inspirational: Sunday evening, Monday morning
   - Promotional: Tuesday-Thursday midday

4. GEOGRAPHIC CONSIDERATIONS
   - Multiple timezone strategy
   - Peak overlap windows
   - Regional behavior differences

5. COMPETITION ANALYSIS
   - When competitors post
   - When audience is underserved
   - Blue ocean time slots

ADVANCED FACTORS:
- Day of week patterns
- Seasonal variations
- Current events impact
- Platform-specific quirks

Think analytically in English, deliver timing strategies in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, timezone, contentType, audienceLocation, language } = await request.json()

    const langMap: Record<string, string> = {
      'tr': 'Provide all posting time recommendations in Turkish, with times adjusted appropriately.',
      'en': 'Provide in English.',
      'ru': 'Provide all content in fluent Russian.',
      'de': 'Provide all content in fluent German.',
      'fr': 'Provide all content in fluent French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Optimize posting times for:

Niche: ${niche}
Platforms: ${platforms}
Timezone: ${timezone || 'Not specified - provide general guidance'}
Content Type: ${contentType || 'Mixed'}
Audience Location: ${audienceLocation || 'Global'}

${langInstruction}

CREATE A COMPREHENSIVE POSTING SCHEDULE:

Return as JSON:
{
  "executive_summary": {
    "best_overall_time": "The single best time to post",
    "why": "Data-backed reasoning",
    "key_insight": "Most important thing to know"
  },
  "platform_specific": {
    "instagram": {
      "best_times": [
        {"time": "Time", "day": "Day(s)", "reason": "Why this works"}
      ],
      "avoid_times": ["Time to avoid and why"],
      "content_type_timing": {
        "reels": "Best time for Reels",
        "carousels": "Best time for carousels",
        "stories": "Best posting rhythm"
      }
    },
    "tiktok": {
      "best_times": [
        {"time": "Time", "day": "Day(s)", "reason": "Why"}
      ],
      "algorithm_notes": "TikTok-specific timing insights",
      "fyp_windows": "When FYP distribution peaks"
    },
    "youtube": {
      "shorts_timing": "Best for Shorts",
      "long_form_timing": "Best for long videos",
      "premiere_strategy": "When to premiere"
    },
    "twitter": {
      "best_times": [
        {"time": "Time", "day": "Day(s)", "reason": "Why"}
      ],
      "thread_timing": "When threads perform best",
      "engagement_windows": "When replies are highest"
    },
    "linkedin": {
      "best_times": [
        {"time": "Time", "day": "Day(s)", "reason": "Why"}
      ],
      "b2b_considerations": "Professional audience notes"
    }
  },
  "weekly_schedule": {
    "monday": {"best_time": "Time", "content_type": "What to post", "reasoning": "Why"},
    "tuesday": {"best_time": "Time", "content_type": "What", "reasoning": "Why"},
    "wednesday": {"best_time": "Time", "content_type": "What", "reasoning": "Why"},
    "thursday": {"best_time": "Time", "content_type": "What", "reasoning": "Why"},
    "friday": {"best_time": "Time", "content_type": "What", "reasoning": "Why"},
    "saturday": {"best_time": "Time", "content_type": "What", "reasoning": "Why"},
    "sunday": {"best_time": "Time", "content_type": "What", "reasoning": "Why"}
  },
  "content_type_matrix": {
    "educational": {"best_time": "Time", "best_day": "Day", "reason": "Why"},
    "entertaining": {"best_time": "Time", "best_day": "Day", "reason": "Why"},
    "promotional": {"best_time": "Time", "best_day": "Day", "reason": "Why"},
    "trending": {"strategy": "How to time trending content"}
  },
  "audience_insights": {
    "peak_active_hours": ["Hour 1", "Hour 2"],
    "engagement_patterns": "When they engage most",
    "timezone_strategy": "How to handle multiple timezones"
  },
  "advanced_tactics": {
    "consistency_rule": "How consistency affects algorithm",
    "frequency_recommendation": "How often to post",
    "rest_days": "Whether to take days off"
  },
  "testing_framework": {
    "how_to_test": "How to find YOUR best times",
    "metrics_to_track": ["Metric 1", "Metric 2"],
    "iteration_approach": "How to optimize over time"
  },
  "common_mistakes": [
    {"mistake": "Common timing mistake", "fix": "How to fix it"}
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
        temperature: 0.7,
        max_tokens: 3500,
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
    console.error('Posting Optimizer Error:', error)
    return NextResponse.json({ error: 'Failed to optimize posting times' }, { status: 500 })
  }
}
