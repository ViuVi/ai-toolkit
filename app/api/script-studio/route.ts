import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, duration, platform, style, targetAudience, language = 'tr' } = await request.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'
    const dur = duration || '30'

    const systemPrompt = `Sen viral video scripti yazma uzmanısın. TikTok, Reels ve Shorts için scriptler yazıyorsun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "title": "Video başlığı önerisi",
  "duration": "${dur} saniye",
  "hook_options": [
    { "type": "Pattern Interrupt", "script": "Hook scripti", "visual": "Görsel öneri" },
    { "type": "Merak", "script": "Alternatif hook", "visual": "Görsel" },
    { "type": "Şok", "script": "Başka hook", "visual": "Görsel" }
  ],
  "main_script": {
    "hook": {
      "text": "Hook metni",
      "duration": "0-3 saniye",
      "delivery_tip": "Söyleyiş tarzı",
      "visual": "Görsel önerisi"
    },
    "retention": {
      "text": "Geçiş metni",
      "duration": "3-10 saniye",
      "visual": "Görsel"
    },
    "body": [
      { "point": "1. nokta", "text": "Metin", "duration": "10-20 sn", "visual": "Görsel", "transition": "Geçiş" }
    ],
    "climax": {
      "text": "Doruk noktası",
      "duration": "Son 5 sn",
      "visual": "Görsel"
    },
    "cta": {
      "text": "CTA metni",
      "duration": "Son 3 saniye",
      "visual": "Görsel"
    }
  },
  "full_script": "Baştan sona tam script metni",
  "production_notes": {
    "camera_angles": ["Açı 1", "Açı 2"],
    "transitions": ["Geçiş 1"],
    "text_overlays": ["Yazı 1"],
    "sound_suggestions": ["Ses önerisi"]
  },
  "hashtags": ["#hashtag1", "#hashtag2"],
  "caption": "Video açıklaması",
  "viral_potential_tips": ["Viral ipucu 1", "İpucu 2"]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Konu: ${topic}\nPlatform: ${platform || 'TikTok'}\nSüre: ${dur} saniye\nStil: ${style || 'Eğitici'}\nHedef Kitle: ${targetAudience || 'Genel'}` }
        ],
        temperature: 0.85,
        max_tokens: 5000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) return NextResponse.json({ error: 'AI servisi hatası' }, { status: 500 })
    const data = await response.json()
    const result = JSON.parse(data.choices?.[0]?.message?.content || '{}')
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
