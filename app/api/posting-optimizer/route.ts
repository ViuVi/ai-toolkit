import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

// Ülke bazlı saat dilimi veritabanı
const TIMEZONE_DATA: { [key: string]: { timezone: string; utc_offset: string; country_name: string } } = {
  'TR': { timezone: 'Europe/Istanbul', utc_offset: 'UTC+3', country_name: 'Türkiye' },
  'US': { timezone: 'America/New_York', utc_offset: 'UTC-5 / UTC-4', country_name: 'Amerika (Doğu)' },
  'US_WEST': { timezone: 'America/Los_Angeles', utc_offset: 'UTC-8 / UTC-7', country_name: 'Amerika (Batı)' },
  'UK': { timezone: 'Europe/London', utc_offset: 'UTC+0 / UTC+1', country_name: 'İngiltere' },
  'DE': { timezone: 'Europe/Berlin', utc_offset: 'UTC+1 / UTC+2', country_name: 'Almanya' },
  'FR': { timezone: 'Europe/Paris', utc_offset: 'UTC+1 / UTC+2', country_name: 'Fransa' },
  'RU': { timezone: 'Europe/Moscow', utc_offset: 'UTC+3', country_name: 'Rusya (Moskova)' },
  'JP': { timezone: 'Asia/Tokyo', utc_offset: 'UTC+9', country_name: 'Japonya' },
  'CN': { timezone: 'Asia/Shanghai', utc_offset: 'UTC+8', country_name: 'Çin' },
  'IN': { timezone: 'Asia/Kolkata', utc_offset: 'UTC+5:30', country_name: 'Hindistan' },
  'BR': { timezone: 'America/Sao_Paulo', utc_offset: 'UTC-3', country_name: 'Brezilya' },
  'AU': { timezone: 'Australia/Sydney', utc_offset: 'UTC+10 / UTC+11', country_name: 'Avustralya' },
  'AE': { timezone: 'Asia/Dubai', utc_offset: 'UTC+4', country_name: 'BAE / Dubai' },
  'SA': { timezone: 'Asia/Riyadh', utc_offset: 'UTC+3', country_name: 'Suudi Arabistan' },
  'KR': { timezone: 'Asia/Seoul', utc_offset: 'UTC+9', country_name: 'Güney Kore' },
  'MX': { timezone: 'America/Mexico_City', utc_offset: 'UTC-6', country_name: 'Meksika' },
  'ES': { timezone: 'Europe/Madrid', utc_offset: 'UTC+1 / UTC+2', country_name: 'İspanya' },
  'IT': { timezone: 'Europe/Rome', utc_offset: 'UTC+1 / UTC+2', country_name: 'İtalya' },
  'NL': { timezone: 'Europe/Amsterdam', utc_offset: 'UTC+1 / UTC+2', country_name: 'Hollanda' },
  'CA': { timezone: 'America/Toronto', utc_offset: 'UTC-5 / UTC-4', country_name: 'Kanada (Doğu)' },
}

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, targetCountry, userCountry, audienceType, language = 'tr' } = await request.json()

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const targetTz = TIMEZONE_DATA[targetCountry] || TIMEZONE_DATA['TR']
    const userTz = TIMEZONE_DATA[userCountry] || TIMEZONE_DATA['TR']
    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen sosyal medya algoritmaları ve kullanıcı davranışları konusunda uzman bir veri analistsin. Dünya genelinde farklı ülkelerde optimal paylaşım zamanlarını belirlemek için yıllarca araştırma yaptın.

GÖREV: ${niche} nişi için ${targetTz.country_name} hedef kitlesine yönelik optimal paylaşım zamanlarını belirle.

KULLANICININ DURUMU:
- Kullanıcı ${userTz.country_name}'de yaşıyor (${userTz.utc_offset})
- Hedef kitle ${targetTz.country_name}'de (${targetTz.utc_offset})
- Platform: ${platform || 'Instagram'}
- Hedef kitle tipi: ${audienceType || 'Genel'}

ANALİZ KRİTERLERİN:
1. Hedef ülkedeki günlük rutinler (iş, öğle, akşam)
2. Hafta içi vs hafta sonu davranış farkları
3. Platform algoritmasının favori saatleri
4. Niş'e özel davranışlar (B2B vs B2C, yaş grubu vb.)
5. Rekabet yoğunluğu (az rekabetli saatler)
6. Engagement vs Reach optimizasyonu

YANIT DİLİ: ${lang}

JSON formatında detaylı analiz ver:
{
  "analysis_summary": "Genel analiz özeti",
  "target_info": {
    "country": "${targetTz.country_name}",
    "timezone": "${targetTz.timezone}",
    "utc_offset": "${targetTz.utc_offset}"
  },
  "user_info": {
    "country": "${userTz.country_name}",
    "timezone": "${userTz.timezone}",
    "utc_offset": "${userTz.utc_offset}"
  },
  "schedule": [
    {
      "day": "Pazartesi",
      "slots": [
        {
          "target_time": "Hedef ülke saati",
          "your_time": "Senin yerel saatin",
          "priority": "high/medium/low",
          "reason": "Neden bu saat?",
          "content_type": "Bu saate uygun içerik tipi"
        }
      ],
      "daily_tip": "Günün ipucu"
    }
  ],
  "golden_hours": [
    {
      "target_time": "Hedef ülke saati",
      "your_time": "Yerel saat",
      "day": "Gün",
      "why": "Neden golden hour?"
    }
  ],
  "avoid_times": ["Kaçınılması gereken saatler ve nedenleri"],
  "timezone_tips": ["Saat dilimi farkını yönetme ipuçları"],
  "scheduling_tools": ["Önerilen zamanlama araçları"],
  "content_timing_matrix": {
    "reels": "Reels için en iyi saatler",
    "carousels": "Carousel için en iyi saatler",
    "stories": "Story için en iyi saatler",
    "lives": "Canlı yayın için en iyi saatler"
  },
  "pro_tips": ["Profesyonel zamanlama ipuçları"]
}`

    const userPrompt = `Niş: ${niche}
Platform: ${platform || 'Instagram'}
Hedef Ülke: ${targetTz.country_name} (${targetTz.utc_offset})
Kullanıcının Konumu: ${userTz.country_name} (${userTz.utc_offset})
Hedef Kitle: ${audienceType || 'Genel'}

Hem hedef ülke saatlerini hem de kullanıcının yerel saatlerini göster. Pratik ve uygulanabilir bir zamanlama stratejisi oluştur.`

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
        max_tokens: 6000,
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
      // Ülke listesini de ekle
      result.available_countries = Object.entries(TIMEZONE_DATA).map(([code, data]) => ({
        code,
        name: data.country_name,
        utc_offset: data.utc_offset
      }))
    } catch {
      result = { schedule: [], error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
