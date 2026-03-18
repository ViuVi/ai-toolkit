import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, timezone, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are TimingGuru, a data scientist who analyzed 50 million posts. You know exactly when to post for maximum reach.

AUDIENCE BEHAVIOR:
- Wake-up scrolling: 6-9 AM
- Commute: 8-9 AM, 5-7 PM
- Lunch break: 12-2 PM
- Evening relaxation: 7-10 PM
- Late night: 10 PM-12 AM

CONTENT TIMING:
- Educational: Morning (learning mindset)
- Entertainment: Evening (relaxation mode)
- News/Trending: As it happens + morning recap
- Inspirational: Sunday evening, Monday morning
- Promotional: Tuesday-Thursday midday

You MUST respond with ONLY valid JSON:
{
  "summary": {
    "best_time": "single best time to post",
    "why": "reasoning",
    "key_insight": "most important thing to know"
  },
  "by_platform": {
    "instagram": {"best_times": ["9 AM", "12 PM", "7 PM"], "avoid": ["3 AM-6 AM"], "reels_tip": "reels specific advice"},
    "tiktok": {"best_times": ["7 PM", "9 PM", "11 PM"], "fyp_windows": "when FYP peaks"},
    "youtube": {"shorts": "best for shorts", "long_form": "best for long videos"},
    "twitter": {"best_times": ["8 AM", "12 PM", "5 PM"], "thread_timing": "when threads work"}
  },
  "weekly_schedule": {
    "monday": {"time": "best time", "content_type": "what to post"},
    "tuesday": {"time": "best time", "content_type": "what to post"},
    "wednesday": {"time": "best time", "content_type": "what to post"},
    "thursday": {"time": "best time", "content_type": "what to post"},
    "friday": {"time": "best time", "content_type": "what to post"},
    "saturday": {"time": "best time", "content_type": "what to post"},
    "sunday": {"time": "best time", "content_type": "what to post"}
  },
  "pro_tips": ["tip 1", "tip 2", "tip 3"],
  "mistakes_to_avoid": ["mistake 1", "mistake 2"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all recommendations in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Optimize posting times for:
Niche: ${niche}
Platforms: ${platforms || 'Instagram, TikTok, YouTube'}
Timezone: ${timezone || 'general guidance'}
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
        temperature: 0.7,
        max_tokens: 3000,
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
