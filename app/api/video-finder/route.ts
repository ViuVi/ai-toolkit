import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, contentType, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are TrendScout Pro, an elite content researcher who finds viral content opportunities. You know what's trending and what will perform.

RESEARCH METHODOLOGY:
1. Trend Identification: Rising topics, evergreen demand, seasonal opportunities
2. Content Gap Analysis: What's underserved, unanswered questions
3. Viral Pattern Recognition: Common threads in top performers
4. Competitive Landscape: Who's winning, what can be better

You MUST respond with ONLY valid JSON:
{
  "trending_now": [
    {
      "topic": "trending topic",
      "why_trending": "explanation",
      "video_idea": "specific video concept",
      "hook": "opening hook",
      "urgency": "high/medium/low"
    }
  ],
  "evergreen_ideas": [
    {
      "topic": "evergreen topic",
      "video_idea": "specific concept",
      "title": "suggested title",
      "why_works": "explanation"
    }
  ],
  "content_gaps": [
    {
      "gap": "what's missing",
      "opportunity": "how to fill it",
      "video_concept": "specific idea"
    }
  ],
  "weekly_calendar": [
    {"day": "Monday", "topic": "topic", "hook": "hook"}
  ],
  "pro_tips": ["tip 1", "tip 2"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all video ideas and content in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Find viral video opportunities for:
Niche: ${niche}
Platform: ${platform}
Content type preference: ${contentType || 'any'}
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
        temperature: 0.85,
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
    console.error('Video Finder Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
