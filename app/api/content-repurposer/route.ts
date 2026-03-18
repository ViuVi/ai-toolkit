import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { originalContent, contentType, language } = await request.json()

    if (!originalContent) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const systemPrompt = `You are RepurposeGuru, expert at multiplying content across platforms while keeping each version platform-native.

REPURPOSING RULES:
1. Each platform version must feel NATIVE, not copied
2. Adapt tone and format to platform culture
3. Optimize length for each platform
4. Keep core message but change delivery

PLATFORM REQUIREMENTS:
- TikTok: 15-60 sec, fast-paced, trendy hooks
- Instagram Reels: Similar to TikTok but slightly more polished
- YouTube Shorts: Can be slightly more educational
- Twitter/X Threads: Text-based, punchy, quotable
- LinkedIn: Professional, value-driven, longer form
- Instagram Carousel: Visual, slide-by-slide breakdown

OUTPUT:
For each platform, provide COMPLETE ready-to-use content.

Return ONLY valid JSON:
{
  "original_analysis": {
    "core_message": "main takeaway",
    "key_points": ["point 1", "point 2", "point 3"],
    "best_elements": ["element to keep", "element to keep"]
  },
  "tiktok_scripts": [
    {
      "version": 1,
      "hook": "tiktok-native hook",
      "script": "full script for tiktok",
      "duration": "30 sec",
      "trend_suggestion": "trending sound/format to use"
    },
    {
      "version": 2,
      "hook": "alternative hook",
      "script": "alternative script",
      "duration": "15 sec",
      "trend_suggestion": "trend to use"
    }
  ],
  "twitter_threads": [
    {
      "version": 1,
      "tweets": [
        {"number": 1, "text": "hook tweet (under 280 chars)"},
        {"number": 2, "text": "point 1"},
        {"number": 3, "text": "point 2"},
        {"number": 4, "text": "point 3"},
        {"number": 5, "text": "CTA tweet"}
      ]
    }
  ],
  "linkedin_posts": [
    {
      "version": 1,
      "hook": "professional hook",
      "post": "full linkedin post with line breaks",
      "hashtags": ["#tag1", "#tag2"]
    }
  ],
  "instagram_carousel": {
    "slides": [
      {"slide": 1, "type": "Hook", "text": "attention-grabbing headline"},
      {"slide": 2, "type": "Point 1", "text": "key point"},
      {"slide": 3, "type": "Point 2", "text": "key point"},
      {"slide": 4, "type": "Point 3", "text": "key point"},
      {"slide": 5, "type": "CTA", "text": "call to action"}
    ],
    "caption": "carousel caption"
  },
  "youtube_short": {
    "hook": "youtube-optimized hook",
    "script": "full script",
    "title": "SEO-friendly title",
    "description": "video description"
  },
  "content_calendar": {
    "day_1": {"platform": "TikTok", "content": "version 1"},
    "day_2": {"platform": "Instagram", "content": "carousel"},
    "day_3": {"platform": "Twitter", "content": "thread"},
    "day_4": {"platform": "LinkedIn", "content": "post"},
    "day_5": {"platform": "YouTube", "content": "short"}
  }
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL repurposed content in Turkish, native to each platform.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Repurpose this content for all major platforms:
"""
${originalContent}
"""

Original type: ${contentType || 'video script'}
${langInstruction}

Create platform-native versions for: TikTok (2 versions), Twitter Thread, LinkedIn Post, Instagram Carousel, YouTube Short.
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
        max_tokens: 5000,
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
    console.error('Content Repurposer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
