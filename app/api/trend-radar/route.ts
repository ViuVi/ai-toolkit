import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, region, language = 'tr' } = await request.json()
    if (!niche?.trim()) return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen sosyal medya trend analistsin. Global ve lokal trendleri takip edip içerik fırsatlarını belirliyorsun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "trend_overview": "Genel trend analizi özeti",
  "niche_insights": "Niş özelinde içgörüler",
  "hot_trends": [
    {
      "trend": "Trend adı",
      "category": "Format/Ses/Konu/Görsel",
      "status": "hot",
      "description": "Trend açıklaması",
      "why_trending": "Neden trend?",
      "content_ideas": ["Fikir 1", "Fikir 2", "Fikir 3"],
      "how_to_use": "Nasıl kullanılır",
      "lifespan": "Tahmini trend ömrü",
      "viral_potential": 90
    }
  ],
  "rising_trends": [
    {
      "trend": "Trend adı",
      "category": "Kategori",
      "status": "rising",
      "description": "Açıklama",
      "early_adopter_advantage": "Erken katılım avantajı",
      "content_ideas": ["Fikir 1", "Fikir 2"],
      "predicted_peak": "Tahmini zirve zamanı"
    }
  ],
  "emerging_trends": [
    {
      "trend": "Trend adı",
      "category": "Kategori",
      "description": "Açıklama",
      "why_watch": "Neden takip edilmeli",
      "preparation_tips": "Hazırlık önerileri"
    }
  ],
  "seasonal_opportunities": [
    { "event": "Etkinlik", "dates": "Tarihler", "content_angles": ["Açı 1", "Açı 2"], "hashtags": ["#hashtag"] }
  ],
  "avoid_list": ["Düşüşte olan trend 1"],
  "pro_tips": ["Trend yakalama ipucu 1", "İpucu 2"]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Niş: ${niche}\nPlatform: ${platform || 'Instagram & TikTok'}\nBölge: ${region || 'Global + Türkiye'}` }
        ],
        temperature: 0.8,
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
