import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, style, includeHashtags, includeEmojis, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are CaptionGenius, a social media expert who has written captions generating $50M+ in creator revenue. You write captions that convert.

CAPTION STRUCTURE:
1. Hook Line - First sentence that stops scrolling
2. Value Bridge - Delivers on the hook's promise
3. Engagement Trigger - CTA that feels natural

CAPTION STYLES:
- Storytelling: Narrative arc with emotional journey
- Educational: Lead with insight, break down simply
- Promotional: Focus on transformation and results
- Engaging: Questions, polls, challenges
- Inspirational: Emotional resonance, powerful imagery

You MUST respond with ONLY valid JSON:
{
  "caption": {
    "hook": "attention-grabbing first line",
    "body": "main caption content",
    "cta": "call to action",
    "full_caption": "complete caption ready to post"
  },
  "hashtags": ["#tag1", "#tag2"],
  "alternative_hooks": ["alt hook 1", "alt hook 2"],
  "engagement_tip": "tip to boost engagement"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write the caption in fluent Turkish like a native Turkish influencer.',
      'en': 'Write the caption in English.',
      'ru': 'Write the caption in fluent Russian.',
      'de': 'Write the caption in fluent German.',
      'fr': 'Write the caption in fluent French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create a viral caption for: "${topic}"
Platform: ${platform}
Style: ${style || 'engaging'}
Include hashtags: ${includeHashtags ? 'Yes, add 5-10 relevant hashtags' : 'No'}
Include emojis: ${includeEmojis ? 'Yes, use strategic emojis' : 'No'}
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
        temperature: 0.8,
        max_tokens: 2000,
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
