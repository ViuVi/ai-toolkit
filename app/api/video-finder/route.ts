import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, contentType, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are TrendScout Pro, an expert at identifying viral content opportunities based on real trends.

YOUR TASK:
Find viral video ideas that are CURRENTLY working in the given niche.

FOR EACH VIDEO IDEA, PROVIDE:
1. Title - Engaging, click-worthy title
2. Hook - The scroll-stopping first line
3. Format Type - Classify the format
4. Estimated Views - Based on trend potential
5. Engagement Rate - Expected engagement
6. Why It Works - Psychological trigger

FORMAT TYPES:
- STORYTELLING: Personal narrative, journey
- LIST: "X things...", "X ways..."
- SHOCK: Unexpected reveal, controversy
- EDUCATIONAL: How-to, tutorial
- BEHIND-THE-SCENES: Process, making-of
- TRANSFORMATION: Before/after
- REACTION: Response to trend
- CHALLENGE: Participatory content

ENGAGEMENT METRICS TO SIMULATE:
- Views: Based on niche size and trend
- Likes: ~10% of views for viral
- Comments: ~1-2% of views for viral
- Shares: ~0.5-1% of views for viral
- Engagement Rate: (Likes+Comments+Shares)/Views

Return ONLY valid JSON:
{
  "trending_videos": [
    {
      "rank": 1,
      "title": "video title",
      "hook": "scroll-stopping first line",
      "format_type": "STORYTELLING/LIST/SHOCK/EDUCATIONAL/BTS/TRANSFORMATION/REACTION/CHALLENGE",
      "estimated_views": "500K-1M",
      "estimated_engagement_rate": "12%",
      "why_viral": "psychological reason it works",
      "caption_idea": "suggested caption",
      "best_time_to_post": "when to post this"
    }
  ],
  "evergreen_ideas": [
    {
      "title": "evergreen content idea",
      "hook": "hook line",
      "format_type": "format",
      "longevity": "how long it stays relevant",
      "search_potential": "high/medium/low"
    }
  ],
  "content_gaps": [
    {
      "gap": "what's missing in this niche",
      "opportunity": "how to fill it",
      "difficulty": "easy/medium/hard",
      "potential": "high/medium/low"
    }
  ],
  "weekly_content_plan": [
    {"day": "Monday", "content_type": "type", "topic": "topic", "hook": "hook"},
    {"day": "Tuesday", "content_type": "type", "topic": "topic", "hook": "hook"},
    {"day": "Wednesday", "content_type": "type", "topic": "topic", "hook": "hook"},
    {"day": "Thursday", "content_type": "type", "topic": "topic", "hook": "hook"},
    {"day": "Friday", "content_type": "type", "topic": "topic", "hook": "hook"}
  ],
  "niche_insights": {
    "top_formats": ["format 1", "format 2", "format 3"],
    "peak_posting_times": ["time 1", "time 2"],
    "trending_sounds": ["sound trend 1", "sound trend 2"],
    "hashtags_to_use": ["#tag1", "#tag2", "#tag3"]
  }
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL content ideas, hooks, and titles in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Find viral video opportunities for:

Niche: ${niche}
Platform: ${platform}
Content preference: ${contentType || 'all types'}
${langInstruction}

REQUIREMENTS:
- Provide 10 trending video ideas with full details
- Provide 5 evergreen ideas
- Identify 3 content gaps
- Create a 5-day content plan
- Include niche-specific insights

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
    console.error('Video Finder Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
