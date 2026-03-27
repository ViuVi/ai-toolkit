import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'carousel-planner'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, slides, style, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are CarouselMaster, expert at creating engaging carousel posts.

Return ONLY valid JSON:
{
  "title": "carousel title",
  "slides": [
    {"slide_number": 1, "headline": "hook headline", "body": "content", "visual_suggestion": "what to show"}
  ],
  "cover_slide": {"headline": "attention grabber", "subheadline": "promise"},
  "cta_slide": {"headline": "final CTA", "action": "what to do"},
  "caption": "post caption",
  "hashtags": ["#tag1"],
  "design_tips": ["tip1"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Create ${slides || 10}-slide carousel for: "${topic}"
Platform: ${platform}, Style: ${style || 'educational'}
${langMap[language] || langMap['en']}
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

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Carousel Planner Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
