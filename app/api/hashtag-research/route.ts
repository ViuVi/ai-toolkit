import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callAI, checkCredits, deductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 3

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, niche, userId, language = 'tr' } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const systemPrompt = `Sen hashtag araştırma uzmanısın. Verilen konu için detaylı hashtag analizi yap.

JSON formatında yanıt ver:
{
  "topic_analysis": "Konu hakkında kısa analiz",
  "hashtag_strategy": "Önerilen hashtag stratejisi açıklaması",
  "hashtag_sets": {
    "high_volume": {
      "description": "Yüksek hacimli, geniş erişim (1M+ post)",
      "hashtags": [
        { "tag": "#hashtag1", "estimated_posts": "5M+", "competition": "Yüksek", "trend": "Stabil" },
        { "tag": "#hashtag2", "estimated_posts": "2M+", "competition": "Yüksek", "trend": "Yükseliş" }
      ]
    },
    "medium_volume": {
      "description": "Orta hacimli, dengeli erişim (100K-1M post)",
      "hashtags": [
        { "tag": "#hashtag3", "estimated_posts": "500K", "competition": "Orta", "trend": "Stabil" },
        { "tag": "#hashtag4", "estimated_posts": "300K", "competition": "Orta", "trend": "Yükseliş" }
      ]
    },
    "niche": {
      "description": "Niş, hedefli erişim (10K-100K post)",
      "hashtags": [
        { "tag": "#hashtag5", "estimated_posts": "50K", "competition": "Düşük", "trend": "Yükseliş" },
        { "tag": "#hashtag6", "estimated_posts": "30K", "competition": "Düşük", "trend": "Yeni" }
      ]
    },
    "trending": {
      "description": "Şu an trend olan hashtagler",
      "hashtags": [
        { "tag": "#trending1", "reason": "Neden trend", "expires": "Bu hafta" },
        { "tag": "#trending2", "reason": "Neden trend", "expires": "Bu ay" }
      ]
    },
    "branded": {
      "description": "Marka/kişisel hashtagler önerisi",
      "suggestions": ["#YourBrand", "#YourSlogan"]
    }
  },
  "recommended_combinations": [
    {
      "name": "Maksimum Erişim",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
      "total_count": 5,
      "strategy": "Geniş kitleye ulaşmak için"
    },
    {
      "name": "Hedefli Büyüme",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7"],
      "total_count": 7,
      "strategy": "Niş kitleye odaklanmak için"
    },
    {
      "name": "Viral Potansiyel",
      "hashtags": ["#trending1", "#tag1", "#tag2", "#tag3"],
      "total_count": 4,
      "strategy": "Trend yakalamak için"
    }
  ],
  "avoid_hashtags": [
    { "tag": "#banned", "reason": "Shadowban riski" },
    { "tag": "#overused", "reason": "Çok genel, kaybolursun" }
  ],
  "pro_tips": [
    "İpucu 1",
    "İpucu 2",
    "İpucu 3"
  ]
}`

    const userPrompt = `Konu: ${topic}
Platform: ${platform || 'Instagram'}
Niş: ${niche || 'Genel'}

Bu konu için kapsamlı hashtag araştırması yap. Türkiye pazarına uygun hashtagler öner.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.65 })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await deductCredits(supabase, userId, CREDIT_COST)

    return NextResponse.json({ 
      success: true, 
      research: result.data,
      creditsUsed: CREDIT_COST 
    })

  } catch (error: any) {
    console.error('Hashtag Research Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
