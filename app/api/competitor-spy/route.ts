import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { competitor, platform, yourNiche, language = 'tr' } = await request.json()
    if (!competitor?.trim()) return NextResponse.json({ error: 'Rakip bilgisi gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen rekabet analizi uzmanısın. Rakiplerin stratejilerini deşifre edip aksiyon alınabilir içgörüler sun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "competitor_overview": {
    "name": "${competitor}",
    "platform": "${platform || 'Instagram'}",
    "estimated_followers": "Tahmini takipçi",
    "niche": "Faaliyet alanı",
    "brand_positioning": "Marka konumlandırması"
  },
  "content_analysis": {
    "content_pillars": ["Tema 1", "Tema 2"],
    "posting_frequency": "Paylaşım sıklığı",
    "best_performing_content": ["İçerik tipi 1", "İçerik tipi 2"],
    "visual_style": "Görsel stil",
    "caption_style": "Caption stili"
  },
  "swot": {
    "strengths": [
      { "point": "Güçlü yön", "detail": "Detay", "learn_from": "Bundan ne öğrenebilirsin" }
    ],
    "weaknesses": [
      { "point": "Zayıf yön", "detail": "Detay", "your_opportunity": "Senin fırsatın" }
    ],
    "opportunities": [
      { "point": "Fırsat", "detail": "Detay", "action_item": "Ne yapmalısın" }
    ],
    "threats": [
      { "point": "Tehdit", "detail": "Detay", "mitigation": "Nasıl önlem alabilirsin" }
    ]
  },
  "strategy_recommendations": {
    "differentiation": "Farklılaşma stratejisi",
    "content_gaps": ["Rakibin kapsamadığı alan 1", "Alan 2"],
    "quick_wins": ["Hemen uygulayabileceğin taktik 1", "Taktik 2"],
    "long_term_plays": ["Uzun vadeli strateji 1"]
  },
  "action_plan": [
    { "priority": 1, "action": "Aksiyon", "timeline": "Bu hafta", "expected_impact": "Yüksek" }
  ]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Rakip: ${competitor}\nPlatform: ${platform || 'Instagram'}\nBenim Nişim: ${yourNiche || 'Belirtilmedi'}` }
        ],
        temperature: 0.7,
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
