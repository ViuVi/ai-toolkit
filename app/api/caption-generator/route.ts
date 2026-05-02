import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, style, tone, includeEmoji, includeEmojis, includeHashtags, language } = await request.json()
    const finalStyle = style || tone || 'engaging'
    const finalEmoji = includeEmoji ?? includeEmojis ?? true

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'caption-generator')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const langMap: Record<string, string> = {
      'tr': 'Write ALL captions in Turkish.',
      'en': 'Write all captions in English.',
      'ru': 'Write all captions in Russian.',
      'de': 'Write all captions in German.',
      'fr': 'Write all captions in French.'
    }

    const systemPrompt = `You are CaptionMaster, expert at writing viral social media captions.

You MUST return ONLY valid JSON:
{
  "captions": [
    {
      "text": "caption text here",
      "style": "style type",
      "engagement_score": 8,
      "best_for": "when to use"
    }
  ],
  "best_caption": {
    "text": "the winner caption",
    "reason": "why it's best"
  },
  "tips": ["tip 1", "tip 2"]
}`

    const userPrompt = `Generate 15 viral captions for: "${topic}"

Platform: ${platform || 'instagram'}
Style: ${finalStyle}
Include emojis: ${includeEmoji !== false ? 'yes' : 'no'}
Include hashtags: ${includeHashtags !== false ? 'yes, add 3-5 relevant hashtags' : 'no'}
${langMap[language as string] || langMap['en']}

Create captions with variety - some short, some story-style, some question-based.
Respond with ONLY JSON.
${brandContext}`

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
        temperature: 0.9,
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
      cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')
      const firstBrace = cleanContent.indexOf('{')
      const lastBrace = cleanContent.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1)
      }
      result = JSON.parse(cleanContent)
    } catch {
      result = { raw: content, captions: [] }
    }

    
    // Auto-save to content library
    await saveContent(userId, 'caption-generator', topic || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Caption Generator Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
