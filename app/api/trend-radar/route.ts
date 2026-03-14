import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callAI, checkCredits, deductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 5

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, region, userId, language = 'tr' } = await request.json()

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })
    }

    // TEST MODE: const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    // TEST MODE: if (!creditCheck.ok) {
      // TEST MODE: return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    // TEST MODE: }

    const systemPrompt = `Sen sosyal medya trend analisti ve içerik stratejistisin. Verilen niş için güncel trendleri ve içerik fırsatlarını analiz et.

JSON formatında yanıt ver:
{
  "trend_overview": {
    "market_sentiment": "Pazar durumu analizi",
    "content_direction": "İçerik yönü tahmini",
    "opportunity_level": "Yüksek/Orta/Düşük"
  },
  "hot_trends": [
    {
      "trend": "Trend adı",
      "platform": "En popüler olduğu platform",
      "status": "🔥 Sıcak / 📈 Yükseliş / ⚡ Patlama",
      "lifespan": "Bu hafta / Bu ay / Uzun vadeli",
      "saturation": "Düşük/Orta/Yüksek",
      "your_angle": "Bu trende nasıl girmelisin",
      "content_ideas": ["Fikir 1", "Fikir 2", "Fikir 3"]
    }
  ],
  "rising_topics": [
    {
      "topic": "Yükselen konu",
      "growth_rate": "+150%",
      "why_rising": "Neden yükseliyor",
      "peak_prediction": "Ne zaman zirve yapar",
      "action": "Ne yapmalısın"
    }
  ],
  "audio_trends": {
    "tiktok": [
      { "sound": "Ses adı", "status": "Trending/Yeni/Peak", "usage_tip": "Kullanım önerisi" }
    ],
    "instagram_reels": [
      { "sound": "Ses adı", "status": "Trending/Yeni/Peak", "usage_tip": "Kullanım önerisi" }
    ]
  },
  "format_trends": [
    {
      "format": "Format adı (örn: POV, Get Ready With Me)",
      "platform": "Platform",
      "popularity": "Yükseliş/Stabil/Düşüş",
      "how_to_use": "Nasıl kullanmalısın",
      "example_hook": "Örnek hook"
    }
  ],
  "hashtag_trends": {
    "trending_now": ["#trend1", "#trend2", "#trend3"],
    "rising_fast": ["#rising1", "#rising2"],
    "niche_specific": ["#niche1", "#niche2"]
  },
  "content_opportunities": [
    {
      "opportunity": "Fırsat açıklaması",
      "difficulty": "Kolay/Orta/Zor",
      "potential_reach": "10K-50K / 50K-200K / 200K+",
      "time_sensitive": true,
      "action_steps": ["Adım 1", "Adım 2", "Adım 3"]
    }
  ],
  "avoid_list": [
    { "trend": "Kaçınılması gereken", "reason": "Neden kaçınmalısın" }
  ],
  "next_week_predictions": [
    "Tahmin 1",
    "Tahmin 2",
    "Tahmin 3"
  ],
  "action_priority": {
    "do_today": ["Bugün yap 1", "Bugün yap 2"],
    "do_this_week": ["Bu hafta yap 1", "Bu hafta yap 2"],
    "prepare_for": ["Hazırlan 1", "Hazırlan 2"]
  }
}`

    const userPrompt = `Niş: ${niche}
Platformlar: ${platforms?.join(', ') || 'Instagram, TikTok, Twitter'}
Bölge: ${region || 'Türkiye'}
Tarih: Mart 2026

Bu niş için güncel trendleri, yükselen konuları ve içerik fırsatlarını analiz et. Kullanıcının hemen harekete geçebileceği somut öneriler sun.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.75, maxTokens: 5000 })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // TEST MODE: await deductCredits(supabase, userId, CREDIT_COST)

    return NextResponse.json({ 
      success: true, 
      trends: result.data,
      creditsUsed: CREDIT_COST 
    })

  } catch (error: any) {
    console.error('Trend Radar Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
