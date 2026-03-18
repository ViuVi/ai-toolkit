import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { originalContent, contentType, targetPlatforms, language } = await request.json()

    if (!originalContent) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const systemPrompt = `You are RepurposeGuru, a content multiplication expert. You turn one piece of content into 10+ variations across platforms.

REPURPOSING MATRIX:
- Format: Long → Short clips, Video → Text, Text → Visual
- Platform: Same content, platform-native format
- Angle: Same topic, different perspective
- Depth: Overview → Deep dive, Tutorial → Tips

PRINCIPLES:
- Each piece must stand alone
- Add value, don't just resize
- Platform-native feel is essential

You MUST respond with ONLY valid JSON:
{
  "analysis": {
    "core_message": "main takeaway",
    "key_points": ["point 1", "point 2"],
    "repurpose_potential": "high/medium/low"
  },
  "repurposed": [
    {
      "format": "Short video (TikTok/Reels)",
      "platform": "TikTok, Instagram",
      "hook": "new hook",
      "content": "adapted content",
      "cta": "call to action"
    },
    {
      "format": "Twitter Thread",
      "platform": "Twitter/X",
      "tweets": ["tweet 1", "tweet 2", "tweet 3", "tweet 4"]
    },
    {
      "format": "Instagram Carousel",
      "platform": "Instagram",
      "slides": ["slide 1 text", "slide 2 text", "slide 3 text"],
      "caption": "carousel caption"
    },
    {
      "format": "LinkedIn Post",
      "platform": "LinkedIn",
      "post": "full linkedin post"
    }
  ],
  "quote_graphics": ["quotable line 1", "quotable line 2"],
  "scheduling": {"order": "which to post first", "spacing": "time between posts"}
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all repurposed content in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Repurpose this content:
"""
${originalContent}
"""

Original type: ${contentType || 'video script'}
Target platforms: ${targetPlatforms || 'all major platforms'}
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
        max_tokens: 3500,
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
