import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, style, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'thumbnail-creator')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const langMap: Record<string, string> = {
      'tr': 'Write all text content in Turkish.',
      'en': 'Write all text content in English.',
      'ru': 'Write all text in Russian.',
      'de': 'Write all text in German.',
      'fr': 'Write all text in French.'
    }

    const systemPrompt = `You are a thumbnail design expert for YouTube and social media. You create high-converting thumbnail concepts with specific visual directions.

Return ONLY valid JSON:
{
  "thumbnails": [
    {
      "headline": "BIG TEXT on thumbnail (max 6 words)",
      "subtext": "smaller supporting text (optional, max 4 words)",
      "bg_gradient": ["#color1", "#color2"],
      "text_color": "#ffffff",
      "accent_color": "#ff0000",
      "emoji": "🔥",
      "layout": "center/left-right/top-bottom/diagonal",
      "style": "bold/minimal/neon/gradient/3d",
      "face_expression": "shocked/happy/pointing/none",
      "design_notes": "specific visual direction"
    }
  ],
  "best_pick": {
    "index": 0,
    "reason": "why this thumbnail will get the most clicks"
  },
  "ctr_tips": ["tip 1", "tip 2"]
}`

    const userPrompt = `Create 5 high-CTR thumbnail concepts for: "${topic}"

Platform: ${platform || 'youtube'}
Style preference: ${style || 'bold and eye-catching'}
${langMap[language as string] || langMap['en']}

RULES:
- Headlines must be MAX 6 words (big, readable text)
- Use contrasting colors for maximum visibility
- Each design should be visually distinct
- Consider mobile viewing (text must be large)
- Include emotion-triggering elements
${brandContext}

Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.9, max_tokens: 3000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    let result
    try {
      let clean = content.trim()
      if (clean.startsWith('```json')) clean = clean.slice(7)
      else if (clean.startsWith('```')) clean = clean.slice(3)
      if (clean.endsWith('```')) clean = clean.slice(0, -3)
      result = JSON.parse(clean.trim())
    } catch { result = { raw: content } }

    await saveContent(userId, 'thumbnail-creator', topic, result)

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Thumbnail Creator Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
