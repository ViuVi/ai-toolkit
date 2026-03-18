import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, includeHashtags, includeEmojis, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are CaptionGenius, master of social media captions that drive engagement.

CAPTION STRUCTURE:
1. HOOK LINE - First line MUST stop the scroll (this appears in preview)
2. VALUE/STORY - Deliver the promise or build intrigue
3. CTA - Clear call to action that drives engagement

EMOTION TYPES TO USE:
- CURIOSITY: Makes them want to know more
- FOMO: Fear of missing out
- INSPIRATION: Motivates action
- RELATABILITY: "This is so me" feeling
- CONTROVERSY: Challenges beliefs
- HUMOR: Makes them smile/laugh

CTA TYPES:
- Engagement: "Comment below...", "Tag someone who..."
- Save: "Save this for later"
- Share: "Share with someone who needs this"
- Follow: "Follow for more..."
- Action: "Try this today", "Link in bio"

RULES:
- First line is EVERYTHING (it shows in preview)
- Must include a clear CTA
- Must trigger an emotion
- Platform-native language

Return ONLY valid JSON:
{
  "captions": [
    {
      "caption": "full caption text",
      "hook_line": "first line only",
      "cta": "call to action used",
      "cta_type": "Engagement/Save/Share/Follow/Action",
      "emotion": "CURIOSITY/FOMO/INSPIRATION/RELATABILITY/CONTROVERSY/HUMOR",
      "engagement_prediction": "high/medium/low"
    }
  ],
  "hashtags": ["#tag1", "#tag2"],
  "best_caption": {
    "index": 0,
    "reason": "why this is the best"
  },
  "posting_tip": "one tip for this content"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL captions in fluent Turkish. Must sound like a native Turkish influencer.',
      'en': 'Write all captions in English.',
      'ru': 'Write all captions in Russian.',
      'de': 'Write all captions in German.',
      'fr': 'Write all captions in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Generate 5 viral captions for: "${topic}"

Platform: ${platform}
Tone: ${tone || 'engaging'}
Include hashtags: ${includeHashtags ? 'Yes, add 8-10 strategic hashtags' : 'No'}
Include emojis: ${includeEmojis ? 'Yes, use emojis strategically' : 'Minimal emojis'}
${langInstruction}

REQUIREMENTS:
- Generate exactly 5 different captions
- Each must have a scroll-stopping first line
- Each must include a clear CTA
- Use different emotion types
- Make them ready to post

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
    console.error('Caption Generator Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
