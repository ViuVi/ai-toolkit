import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { topic, slideCount, platform, language = 'tr' } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })
    }

    const count = parseInt(slideCount) || 7

    const systemPrompt = `Sen carousel içerik uzmanısın. Swipe-worthy carousel planla.

SADECE bu JSON formatında yanıt ver:
{
  "slides": [
    { "type": "cover", "headline": "Dikkat çekici başlık", "body": "Alt metin", "visual": "Görsel önerisi" },
    { "type": "content", "headline": "Slide başlığı", "body": "İçerik", "visual": "Görsel önerisi" },
    { "type": "cta", "headline": "CTA başlığı", "body": "Call to action", "visual": "Görsel önerisi" }
  ]
}`

    const userPrompt = `Platform: ${platform || 'Instagram'}
Konu: ${topic}
Slide sayısı: ${count}
Dil: ${language}

Bu konu için carousel planla.`

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
        max_tokens: 3000,
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
      result = { slides: [] }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
