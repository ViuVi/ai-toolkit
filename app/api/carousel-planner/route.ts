import { NextRequest, NextResponse } from 'next/server'
import { checkAndDeductCredits } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, slides, platform, style, language, userId } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const creditResult = await checkAndDeductCredits(userId, 'carousel-planner')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const langMap: Record<string, string> = {
      'tr': 'Write ALL slide content in Turkish.',
      'en': 'Write all slide content in English.',
      'ru': 'Write all slide content in Russian.',
      'de': 'Write all slide content in German.',
      'fr': 'Write all slide content in French.'
    }

    const systemPrompt = `You are a carousel content expert. Return ONLY valid JSON:
{
  "carousel": {
    "title": "carousel title",
    "slides": [
      {
        "slide_number": 1,
        "type": "hook/content/cta",
        "headline": "main text",
        "subtext": "supporting text",
        "visual_suggestion": "what to show"
      }
    ],
    "caption": "post caption",
    "hashtags": ["#tag1", "#tag2"]
  },
  "design_tips": ["tip1", "tip2"]
}`

    const userPrompt = `Create a ${slides || 10}-slide carousel about: "${topic}"
Platform: ${platform || 'instagram'}, Style: ${style || 'educational'}
${langMap[language as string] || langMap['en']}
Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.8, max_tokens: 4000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    let result
    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch { result = { raw: content } }

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Carousel Planner Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
