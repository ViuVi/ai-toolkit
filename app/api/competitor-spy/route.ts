import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { competitor, platform, yourNiche, language = 'tr' } = await request.json()

    if (!competitor?.trim()) {
      return NextResponse.json({ error: 'Rakip bilgisi gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen rekabet analizi ve sosyal medya stratejisi konusunda uzman bir iş analistsin. Rakiplerin stratejilerini deşifre edip, aksiyon alınabilir içgörüler sunuyorsun.

GÖREV: ${competitor} hesabını/markasını derinlemesine analiz et.

ANALİZ ÇERÇEVESİ:
1. İçerik Stratejisi - Ne tür içerikler üretiyorlar?
2. Paylaşım Sıklığı - Ne kadar sık paylaşıyorlar?
3. Engagement Taktikleri - Nasıl etkileşim alıyorlar?
4. Görsel Kimlik - Estetik ve marka dili
5. Hashtag Stratejisi - Hangi hashtagleri kullanıyorlar?
6. CTA Stratejisi - Nasıl aksiyon aldırıyorlar?
7. Topluluk Yönetimi - Yorumlara nasıl yanıt veriyorlar?
8. Büyüme Taktikleri - Nasıl büyüyorlar?

SWOT ANALİZİ YAPACAKSIN:
- Strengths (Güçlü Yönler)
- Weaknesses (Zayıf Yönler)  
- Opportunities (Fırsatlar - Senin için)
- Threats (Tehditler)

YANIT DİLİ: ${lang}

JSON formatında kapsamlı rakip analizi ver:
{
  "competitor_overview": {
    "name": "Rakip adı",
    "platform": "${platform || 'Instagram'}",
    "estimated_followers": "Tahmini takipçi",
    "niche": "Faaliyet alanı",
    "brand_positioning": "Marka konumlandırması"
  },
  "content_analysis": {
    "content_pillars": ["Ana içerik temaları"],
    "posting_frequency": "Paylaşım sıklığı",
    "best_performing_content": ["En iyi performans gösteren içerik tipleri"],
    "content_mix": {
      "educational": "Yüzde",
      "entertaining": "Yüzde",
      "promotional": "Yüzde",
      "behind_scenes": "Yüzde"
    },
    "visual_style": "Görsel stil analizi",
    "caption_style": "Caption yazım stili"
  },
  "engagement_analysis": {
    "estimated_engagement_rate": "Tahmini engagement oranı",
    "engagement_tactics": ["Kullandıkları engagement taktikleri"],
    "community_response": "Topluluk tepkisi",
    "response_strategy": "Yorum yanıt stratejisi"
  },
  "swot": {
    "strengths": [
      { "point": "Güçlü yön", "detail": "Detaylı açıklama", "learn_from": "Bundan ne öğrenebilirsin" }
    ],
    "weaknesses": [
      { "point": "Zayıf yön", "detail": "Detaylı açıklama", "your_opportunity": "Senin fırsatın" }
    ],
    "opportunities": [
      { "point": "Fırsat", "detail": "Detaylı açıklama", "action_item": "Ne yapmalısın" }
    ],
    "threats": [
      { "point": "Tehdit", "detail": "Detaylı açıklama", "mitigation": "Nasıl önlem alabilirsin" }
    ]
  },
  "strategy_recommendations": {
    "differentiation": "Farklılaşma stratejisi",
    "content_gaps": ["Rakibin kapsamadığı içerik fırsatları"],
    "quick_wins": ["Hemen uygulayabileceğin taktikler"],
    "long_term_plays": ["Uzun vadeli stratejiler"]
  },
  "action_plan": [
    { "priority": 1, "action": "Aksiyon", "timeline": "Zaman çizelgesi", "expected_impact": "Beklenen etki" }
  ],
  "spy_tips": ["Rakip takibi için ipuçları"]
}`

    const userPrompt = `Rakip: ${competitor}
Platform: ${platform || 'Instagram'}
Benim Nişim: ${yourNiche || 'Belirtilmedi'}

Bu rakibi derinlemesine analiz et. Güçlü/zayıf yönlerini, benim için fırsatları ve uygulanabilir stratejiler öner.`

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
      result = { swot: {}, error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
