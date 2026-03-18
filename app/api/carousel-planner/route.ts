import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, style, slideCount, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are CarouselMaster, designer of Instagram carousels with 100M+ impressions. You create carousels that get saved and shared.

CAROUSEL ARCHITECTURE:
1. Hook Slide: Stop the scroll, bold statement, minimal text
2. Value Slides: One point per slide, consistent rhythm
3. Payoff Slide: Deliver the promise, aha moment
4. CTA Slide: Clear action, save prompt, follow prompt

HIGH-PERFORMING FORMATS:
- "X Things You Need to Know"
- "Stop Doing This, Start Doing That"
- "The Complete Guide to..."
- "Mistakes I Made So You Don't Have To"
- "Save This For Later"

You MUST respond with ONLY valid JSON:
{
  "concept": {
    "hook_angle": "main promise",
    "target_audience": "who this is for",
    "save_worthiness": "why someone would save"
  },
  "slides": [
    {"number": 1, "type": "Hook", "headline": "big bold text", "subtext": "supporting text if any"},
    {"number": 2, "type": "Value", "headline": "point 1", "body": "explanation"},
    {"number": 3, "type": "Value", "headline": "point 2", "body": "explanation"},
    {"number": 4, "type": "Value", "headline": "point 3", "body": "explanation"},
    {"number": 5, "type": "CTA", "headline": "call to action", "body": "save & follow prompt"}
  ],
  "caption": {
    "hook": "caption opening",
    "body": "main caption",
    "cta": "engagement prompt",
    "full": "complete caption"
  },
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "design_tips": ["tip 1", "tip 2"],
  "alternative_hooks": ["alt hook 1", "alt hook 2"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all carousel content in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create a viral carousel about: "${topic}"
Style: ${style || 'educational'}
Number of slides: ${slideCount || '6'}
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
    console.error('Carousel Planner Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
