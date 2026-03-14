import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, targetAudience, language = 'tr' } = await request.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen hashtag stratejisti ve sosyal medya SEO uzmanısın. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "topic_analysis": "Konu analizi",
  "strategy_overview": "Hashtag stratejisi özeti",
  "hashtag_sets": {
    "high_volume": [
      { "tag": "#hashtag", "estimated_posts": "1M+", "competition": "high", "relevance": 95, "tip": "Kullanım önerisi" }
    ],
    "medium_volume": [
      { "tag": "#hashtag", "estimated_posts": "500K", "competition": "medium", "relevance": 90, "tip": "Öneri" }
    ],
    "low_volume": [
      { "tag": "#hashtag", "estimated_posts": "50K", "competition": "low", "relevance": 85, "tip": "Öneri" }
    ],
    "micro_niche": [
      { "tag": "#hashtag", "estimated_posts": "5K", "competition": "very low", "relevance": 80, "tip": "Öneri" }
    ],
    "trending": [
      { "tag": "#hashtag", "trend_level": "rising", "tip": "Trend kullanım önerisi" }
    ]
  },
  "ready_to_use_sets": {
    "maximum_reach": ["#tag1", "#tag2", "#tag3"],
    "balanced": ["#tag1", "#tag2"],
    "engagement_focused": ["#tag1", "#tag2"],
    "niche_community": ["#tag1", "#tag2"]
  },
  "banned_hashtags": ["Kaçınılması gereken hashtagler"],
  "rotation_strategy": "Hashtag rotasyon stratejisi",
  "pro_tips": ["İpucu 1", "İpucu 2", "İpucu 3"]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Konu/Niş: ${topic}\nPlatform: ${platform || 'Instagram'}\nHedef Kitle: ${targetAudience || 'Genel'}` }
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
