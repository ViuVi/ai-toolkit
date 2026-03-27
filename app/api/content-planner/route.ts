import { NextRequest, NextResponse } from 'next/server'
import { checkAndDeductCredits } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, frequency, weeks, language, userId } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const creditResult = await checkAndDeductCredits(userId, 'content-planner')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const langMap: Record<string, string> = {
      'tr': 'Respond entirely in Turkish.',
      'en': 'Respond in English.',
      'ru': 'Respond in Russian.',
      'de': 'Respond in German.',
      'fr': 'Respond in French.'
    }

    const systemPrompt = `You are a content strategist creating comprehensive content calendars.

You MUST return ONLY valid JSON:
{
  "calendar": [
    {
      "week": 1,
      "days": [
        {
          "day": "Monday",
          "posts": [
            {
              "platform": "tiktok",
              "type": "video",
              "topic": "content topic",
              "hook": "opening hook",
              "best_time": "9:00 AM",
              "hashtags": ["#tag1", "#tag2"]
            }
          ]
        }
      ]
    }
  ],
  "content_pillars": ["pillar 1", "pillar 2", "pillar 3"],
  "monthly_themes": ["theme 1", "theme 2"],
  "engagement_strategy": "how to boost engagement",
  "growth_tips": ["tip 1", "tip 2"]
}`

    const userPrompt = `Create a ${weeks || 2}-week content calendar for: "${niche}"

Platforms: ${platforms?.join(', ') || 'tiktok, instagram'}
Posting frequency: ${frequency || '1 post per day'}
${langMap[language as string] || langMap['en']}

Create variety with different content types and themes.
Respond with ONLY JSON.`

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

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Content Planner Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
