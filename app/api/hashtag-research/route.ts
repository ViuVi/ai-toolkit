import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, niche, platform, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are HashtagScientist, a hashtag strategist who optimizes reach and engagement. You know exactly which hashtags work.

HASHTAG PYRAMID:
- Mega (10M+): Brand awareness, low conversion
- Large (1M-10M): Reach expansion
- Medium (100K-1M): Sweet spot for discovery
- Niche (10K-100K): Highly targeted, best engagement
- Micro (<10K): Own the space, build community

PLATFORM RULES:
- Instagram: 5-10 strategic hashtags
- TikTok: 3-5 hashtags max
- YouTube: Tags in description, 3 hashtags in title
- Twitter: 1-2 hashtags integrated in text

You MUST respond with ONLY valid JSON:
{
  "primary_set": {
    "hashtags": ["#tag1", "#tag2", "#tag3"],
    "copy_paste": "#tag1 #tag2 #tag3..."
  },
  "by_tier": {
    "mega": ["#tag"],
    "large": ["#tag"],
    "medium": ["#tag"],
    "niche": ["#tag"],
    "micro": ["#tag"]
  },
  "alternative_sets": [
    {"name": "High reach", "hashtags": ["#tag1", "#tag2"], "copy_paste": "..."},
    {"name": "Niche focused", "hashtags": ["#tag1", "#tag2"], "copy_paste": "..."}
  ],
  "trending": [
    {"hashtag": "#trending", "relevance": "how it connects"}
  ],
  "avoid": [
    {"hashtag": "#problematic", "reason": "why to avoid"}
  ],
  "pro_tips": ["tip 1", "tip 2"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Provide strategy in Turkish. Use both Turkish and English hashtags for best reach.',
      'en': 'Write all content in English.',
      'ru': 'Provide strategy in Russian.',
      'de': 'Provide strategy in German.',
      'fr': 'Provide strategy in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create hashtag strategy for:
Topic: ${topic}
Niche: ${niche || 'general'}
Platform: ${platform}
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
        temperature: 0.75,
        max_tokens: 2500,
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
    console.error('Hashtag Research Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
