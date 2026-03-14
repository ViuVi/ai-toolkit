import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { content, platform, niche, language = 'tr' } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })
    }

    const systemPrompt = `Sen viral içerik analistisin. Verilen içeriği analiz et ve JSON formatında yanıt ver.

SADECE bu JSON formatında yanıt ver, başka hiçbir şey yazma:
{
  "score": 75,
  "verdict": "İyi potansiyel",
  "breakdown": {
    "hook_power": { "score": 80 },
    "emotional_trigger": { "score": 70 },
    "shareability": { "score": 75 }
  },
  "strengths": ["Güçlü yön 1", "Güçlü yön 2"],
  "weaknesses": ["Zayıf yön 1"],
  "improvements": [
    { "priority": "high", "suggestion": "Öneri 1", "impact": "+10 puan" }
  ]
}`

    const userPrompt = `Platform: ${platform || 'Instagram'}
Niş: ${niche || 'Genel'}
Dil: ${language}

İçerik:
${content}

Bu içeriği analiz et.`

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
      const errorText = await response.text()
      console.error('Groq Error:', response.status, errorText)
      return NextResponse.json({ error: 'AI servisi hatası' }, { status: 500 })
    }

    const data = await response.json()
    const aiContent = data.choices?.[0]?.message?.content

    if (!aiContent) {
      return NextResponse.json({ error: 'Boş yanıt' }, { status: 500 })
    }

    let result
    try {
      result = JSON.parse(aiContent)
    } catch {
      result = { score: 0, verdict: 'Analiz yapılamadı', text: aiContent }
    }

    return NextResponse.json({ 
      success: true, 
      result: result
    })

  } catch (error: any) {
    console.error('Viral Analyzer Error:', error)
    return NextResponse.json({ error: error.message || 'Bir hata oluştu' }, { status: 500 })
  }
}
