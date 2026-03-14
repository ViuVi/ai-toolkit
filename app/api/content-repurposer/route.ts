import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { content, platforms, language = 'tr' } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })
    }

    const targetPlatforms = platforms?.join(', ') || 'Instagram, TikTok, Twitter, LinkedIn'

    const systemPrompt = `Sen içerik dönüştürme uzmanısın. Verilen içeriği farklı platformlara uyarla.

SADECE bu JSON formatında yanıt ver:
{
  "Instagram": "Instagram için uyarlanmış içerik...",
  "TikTok": "TikTok için uyarlanmış içerik...",
  "Twitter": "Twitter için uyarlanmış içerik...",
  "LinkedIn": "LinkedIn için uyarlanmış içerik..."
}`

    const userPrompt = `Hedef platformlar: ${targetPlatforms}
Dil: ${language}

Orijinal içerik:
${content}

Bu içeriği her platforma özel olarak uyarla.`

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
      result = { error: 'Parse hatası' }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
