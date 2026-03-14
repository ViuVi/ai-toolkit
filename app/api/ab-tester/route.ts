import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { captionA, captionB, language = 'tr' } = await request.json()

    if (!captionA?.trim() || !captionB?.trim()) {
      return NextResponse.json({ error: 'İki caption gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })
    }

    const systemPrompt = `Sen caption analiz uzmanısın. İki caption'ı karşılaştır.

SADECE bu JSON formatında yanıt ver:
{
  "winner": "A",
  "scoreA": 75,
  "scoreB": 65,
  "analysisA": "Caption A analizi...",
  "analysisB": "Caption B analizi..."
}`

    const userPrompt = `Caption A:
${captionA}

Caption B:
${captionB}

Dil: ${language}

Bu iki caption'ı karşılaştır ve kazananı belirle.`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI servisi hatası' }, { status: 500 })
    }

    const data = await response.json()
    const aiContent = data.choices?.[0]?.message?.content

    let result
    try {
      result = JSON.parse(aiContent)
    } catch {
      result = { winner: 'A', scoreA: 50, scoreB: 50 }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
