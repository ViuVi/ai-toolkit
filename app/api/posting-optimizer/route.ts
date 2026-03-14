import { NextRequest, NextResponse } from 'next/server'

const TIMEZONE_DATA: { [key: string]: { utc: string; name: string } } = {
  'TR': { utc: 'UTC+3', name: 'Türkiye' },
  'US': { utc: 'UTC-5', name: 'Amerika (Doğu)' },
  'US_WEST': { utc: 'UTC-8', name: 'Amerika (Batı)' },
  'UK': { utc: 'UTC+0', name: 'İngiltere' },
  'DE': { utc: 'UTC+1', name: 'Almanya' },
  'FR': { utc: 'UTC+1', name: 'Fransa' },
  'RU': { utc: 'UTC+3', name: 'Rusya' },
  'JP': { utc: 'UTC+9', name: 'Japonya' },
  'KR': { utc: 'UTC+9', name: 'Güney Kore' },
  'CN': { utc: 'UTC+8', name: 'Çin' },
  'IN': { utc: 'UTC+5:30', name: 'Hindistan' },
  'BR': { utc: 'UTC-3', name: 'Brezilya' },
  'AU': { utc: 'UTC+10', name: 'Avustralya' },
  'AE': { utc: 'UTC+4', name: 'BAE' },
}

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, targetCountry, userCountry, audienceType, language = 'tr' } = await request.json()
    if (!niche?.trim()) return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const targetTz = TIMEZONE_DATA[targetCountry] || TIMEZONE_DATA['TR']
    const userTz = TIMEZONE_DATA[userCountry] || TIMEZONE_DATA['TR']
    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen sosyal medya zamanlama uzmanısın. Hedef ülke ve kullanıcı konumuna göre optimal paylaşım saatlerini belirle.

Hedef Ülke: ${targetTz.name} (${targetTz.utc})
Kullanıcı Konumu: ${userTz.name} (${userTz.utc})

Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "analysis_summary": "Genel analiz özeti",
  "target_info": { "country": "${targetTz.name}", "utc_offset": "${targetTz.utc}" },
  "user_info": { "country": "${userTz.name}", "utc_offset": "${userTz.utc}" },
  "golden_hours": [
    { "target_time": "19:00", "your_time": "Hesaplanmış saat", "day": "Her gün", "why": "Neden altın saat" }
  ],
  "schedule": [
    {
      "day": "Pazartesi",
      "slots": [
        { "target_time": "09:00", "your_time": "Senin saatin", "priority": "high", "reason": "Neden", "content_type": "Reel" }
      ],
      "daily_tip": "Günün ipucu"
    }
  ],
  "timezone_tips": ["Saat dilimi ipucu 1", "İpucu 2"],
  "content_timing_matrix": { "reels": "En iyi saatler", "carousels": "Saatler", "stories": "Saatler" },
  "pro_tips": ["Pro ipucu 1", "Pro ipucu 2"]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Niş: ${niche}\nPlatform: ${platform || 'Instagram'}\nHedef Kitle: ${audienceType || 'Genel'}\n\nHem hedef ülke saatlerini hem de kullanıcının yerel saatlerini göster.` }
        ],
        temperature: 0.6,
        max_tokens: 6000,
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
