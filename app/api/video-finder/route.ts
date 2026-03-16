import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "TrendScout Pro" - an elite content researcher who has helped creators find trending content opportunities worth millions of views. You have deep knowledge of what's currently performing across all major platforms.

YOUR RESEARCH METHODOLOGY:

1. TREND IDENTIFICATION
   - Rising topics before they peak
   - Evergreen topics with consistent demand
   - Seasonal opportunities coming up
   - News-jacking potential

2. CONTENT GAP ANALYSIS
   - What's being searched but underserved?
   - What questions aren't being answered well?
   - What formats are missing in this niche?

3. VIRAL PATTERN RECOGNITION
   - What's the common thread in top performers?
   - Which formats are dominating right now?
   - What audience emotions are trending?

4. COMPETITIVE LANDSCAPE
   - Who's winning in this space?
   - What can be done better?
   - Where's the whitespace?

PLATFORM-SPECIFIC INSIGHTS:
- TikTok: Sound trends, challenges, duet opportunities, trending effects
- Instagram: Reel trends, carousel opportunities, story formats
- YouTube: Search trends, suggested video patterns, shorts vs long-form
- Twitter/X: Conversation trends, viral tweet formats, thread opportunities

Always provide ACTIONABLE video ideas, not just observations.
Think strategically in English, deliver in user's language with native fluency.`

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, contentType, language } = await request.json()

    const langMap: Record<string, string> = {
      'tr': 'Provide all video ideas, titles, and descriptions in fluent Turkish. Make them sound native and trending.',
      'en': 'Provide in English.',
      'ru': 'Provide all content in fluent Russian.',
      'de': 'Provide all content in fluent German.',
      'fr': 'Provide all content in fluent French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Find viral video opportunities for:

Niche: ${niche}
Platform: ${platform}
Content Type Preference: ${contentType || 'Any'}

${langInstruction}

RESEARCH AND DELIVER:

1. What's currently trending in this niche?
2. What evergreen topics consistently perform?
3. What gaps exist that can be filled?
4. What would YOU make if you were in this niche?

Return as JSON:
{
  "trending_now": [
    {
      "topic": "Trending topic",
      "why_trending": "Explanation",
      "urgency": "High/Medium - how time-sensitive",
      "video_idea": "Specific video concept",
      "hook_suggestion": "Opening hook for this video",
      "estimated_potential": "View potential estimate"
    }
  ],
  "evergreen_opportunities": [
    {
      "topic": "Evergreen topic",
      "search_demand": "High/Medium/Low",
      "competition_level": "High/Medium/Low",
      "video_idea": "Specific video concept",
      "title_options": ["Title 1", "Title 2"],
      "why_it_works": "Explanation"
    }
  ],
  "content_gaps": [
    {
      "gap": "What's missing",
      "opportunity": "How to fill it",
      "video_concept": "Specific idea",
      "differentiation": "How to stand out"
    }
  ],
  "top_performer_analysis": {
    "what_works": "Common patterns in top content",
    "formats_winning": ["Format 1", "Format 2"],
    "avoid": "What's oversaturated or dying"
  },
  "your_content_calendar": [
    {
      "day": "Day 1",
      "content_type": "Type",
      "topic": "Topic",
      "hook": "Hook",
      "reasoning": "Why this day/order"
    }
  ],
  "pro_tips": [
    "Insider tip 1 for this niche",
    "Insider tip 2 for this niche"
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
        temperature: 0.85,
        max_tokens: 3000,
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
    console.error('Video Finder Error:', error)
    return NextResponse.json({ error: 'Failed to find videos' }, { status: 500 })
  }
}
