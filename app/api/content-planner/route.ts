import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { niche, goals, language = 'tr' } = await request.json()

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })
    }

    const systemPrompt = `Sen içerik planlama uzmanısın. 7 günlük içerik planı oluştur.

SADECE bu JSON formatında yanıt ver:
{
  "days": [
    { "day": 1, "topic": "Konu", "format": "Carousel", "time": "10:00" },
    { "day": 2, "topic": "Konu", "format": "Reel", "time": "19:00" }
  ]
}`

    const userPrompt = `Niş: ${niche}
Hedefler: ${goals || 'Genel büyüme'}
Dil: ${language}

7 günlük içerik planı oluştur.`

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
        temperature: 0.7,
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
      result = { days: [] }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
