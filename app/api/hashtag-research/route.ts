import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, targetAudience, language = 'tr' } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen hashtag stratejisi ve sosyal medya SEO konusunda uzman bir araştırmacısın. Hashtag'lerin erişim, keşfedilebilirlik ve engagement üzerindeki etkisini derinlemesine analiz ediyorsun.

HASHTAG KATEGORİLERİ:
1. High Volume (1M+ posts) - Geniş erişim, yüksek rekabet
2. Medium Volume (100K-1M posts) - Dengeli erişim/rekabet
3. Low Volume (10K-100K posts) - Niş, düşük rekabet
4. Micro/Niche (<10K posts) - Çok spesifik, topluluk odaklı
5. Trending - Anlık trend olan hashtagler
6. Evergreen - Her zaman geçerli hashtagler
7. Branded - Marka/kişisel hashtagler
8. Community - Topluluk hashtagleri

PLATFORM: ${platform || 'Instagram'}

OPTİMAL STRATEJİ:
- Instagram: 25-30 hashtag, mix strateji
- TikTok: 3-5 hashtag, trend odaklı
- Twitter: 1-2 hashtag, konuşma odaklı
- LinkedIn: 3-5 hashtag, profesyonel

YANIT DİLİ: ${lang}

JSON formatında kapsamlı hashtag araştırması ver:
{
  "topic_analysis": "Konu ve niş analizi",
  "strategy_overview": "Hashtag stratejisi özeti",
  "hashtag_sets": {
    "high_volume": [
      { "tag": "#hashtag", "estimated_posts": "1M+", "competition": "high", "relevance": 95, "tip": "Kullanım önerisi" }
    ],
    "medium_volume": [
      { "tag": "#hashtag", "estimated_posts": "500K", "competition": "medium", "relevance": 90, "tip": "Kullanım önerisi" }
    ],
    "low_volume": [
      { "tag": "#hashtag", "estimated_posts": "50K", "competition": "low", "relevance": 85, "tip": "Kullanım önerisi" }
    ],
    "micro_niche": [
      { "tag": "#hashtag", "estimated_posts": "5K", "competition": "very low", "relevance": 80, "tip": "Kullanım önerisi" }
    ],
    "trending": [
      { "tag": "#hashtag", "trend_level": "rising/peak/declining", "tip": "Trend kullanım önerisi" }
    ]
  },
  "ready_to_use_sets": {
    "maximum_reach": ["30 hashtag for max reach"],
    "balanced": ["20 hashtag balanced approach"],
    "engagement_focused": ["15 hashtag for engagement"],
    "niche_community": ["10 niche hashtags"]
  },
  "banned_hashtags": ["Kaçınılması gereken hashtagler"],
  "hashtag_placement_tips": "Hashtag yerleştirme önerileri",
  "rotation_strategy": "Hashtag rotasyon stratejisi",
  "tracking_tips": "Hashtag performans takip önerileri",
  "pro_tips": ["5 profesyonel hashtag ipucu"]
}`

    const userPrompt = `Konu/Niş: ${topic}
Platform: ${platform || 'Instagram'}
Hedef Kitle: ${targetAudience || 'Genel'}

Bu konu için kapsamlı hashtag araştırması yap. Farklı hacim ve rekabet seviyelerinde hashtagler öner. Kullanıma hazır hashtag setleri oluştur.`

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
      result = { hashtag_sets: {}, error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
