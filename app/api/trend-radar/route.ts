import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, region, language = 'tr' } = await request.json()

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen sosyal medya trendleri, viral içerik kalıpları ve kültürel akımlar konusunda uzman bir trend analistsin. Global ve lokal trendleri takip edip, içerik üreticileri için fırsatları belirliyorsun.

GÖREV: ${niche} nişi için güncel ve yaklaşan trendleri analiz et.

TREND KATEGORİLERİ:
1. Viral Formatlar - Popüler içerik formatları
2. Ses/Müzik Trendleri - Trend sesler ve müzikler
3. Hashtag Trendleri - Yükselen hashtagler
4. Konu Trendleri - Gündemdeki konular
5. Görsel Trendler - Estetik ve tasarım trendleri
6. Engagement Trendleri - Etkileşim artıran kalıplar
7. Platform Özellikleri - Yeni özellik trendleri
8. Mevsimsel Fırsatlar - Dönemsel içerik fırsatları

TREND SEVİYELERİ:
- 🔥 Hot (Zirvedeki)
- 📈 Rising (Yükselen)
- 🌱 Emerging (Yeni çıkan)
- ♻️ Evergreen (Her zaman geçerli)

YANIT DİLİ: ${lang}

JSON formatında kapsamlı trend analizi ver:
{
  "trend_overview": "Genel trend analizi özeti",
  "niche_insights": "Niş özelinde içgörüler",
  "hot_trends": [
    {
      "trend": "Trend adı",
      "category": "Format/Ses/Konu/Görsel",
      "status": "hot/rising/emerging",
      "description": "Trend açıklaması",
      "why_trending": "Neden trend?",
      "content_ideas": ["3 içerik fikri"],
      "how_to_use": "Nasıl kullanılır",
      "best_for": "En uygun içerik tipi",
      "lifespan": "Tahmini trend ömrü",
      "difficulty": "easy/medium/hard",
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
      "content_ideas": ["3 içerik fikri"],
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
    {
      "event": "Etkinlik/Dönem",
      "dates": "Tarihler",
      "content_angles": ["İçerik açıları"],
      "hashtags": ["İlgili hashtagler"]
    }
  ],
  "trend_calendar": {
    "this_week": ["Bu hafta üretilecek trendler"],
    "next_week": ["Gelecek hafta için hazırlanılacak trendler"],
    "this_month": ["Bu ay değerlendirilecek fırsatlar"]
  },
  "avoid_list": ["Düşüşte olan veya kaçınılması gereken trendler"],
  "pro_tips": ["Trend yakalama ipuçları"],
  "tools_to_track": ["Trend takip araçları önerileri"]
}`

    const userPrompt = `Niş: ${niche}
Platform: ${platform || 'Instagram & TikTok'}
Bölge: ${region || 'Global + Türkiye'}

Bu niş için güncel trendleri, yükselen akımları ve içerik fırsatlarını analiz et. Uygulanabilir ve spesifik içerik fikirleri sun.`

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
        temperature: 0.8,
        max_tokens: 5000,
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
      result = { hot_trends: [], error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
