import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callAI, checkCredits, deductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 2

export async function POST(request: NextRequest) {
  try {
    const { niche, targetAudience, platforms, region, userId, language = 'tr' } = await request.json()

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })
    }

    // TEST MODE: const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    // TEST MODE: if (!creditCheck.ok) {
      // TEST MODE: return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    // TEST MODE: }

    const systemPrompt = `Sen sosyal medya zamanlama uzmanısın. Verilen niş ve hedef kitleye göre optimal paylaşım zamanlarını analiz et.

JSON formatında yanıt ver:
{
  "analysis": {
    "niche_insight": "Bu niş hakkında zamanlama analizi",
    "audience_behavior": "Hedef kitle davranış analizi"
  },
  "platforms": {
    "instagram": {
      "best_times": {
        "weekdays": [
          { "time": "07:00-09:00", "reason": "İşe gidiş", "engagement_boost": "+25%" },
          { "time": "12:00-13:00", "reason": "Öğle molası", "engagement_boost": "+30%" },
          { "time": "19:00-21:00", "reason": "Akşam dinlenme", "engagement_boost": "+45%" }
        ],
        "weekends": [
          { "time": "10:00-12:00", "reason": "Geç kahvaltı", "engagement_boost": "+35%" },
          { "time": "20:00-22:00", "reason": "Akşam eğlence", "engagement_boost": "+40%" }
        ]
      },
      "best_days": ["Salı", "Çarşamba", "Pazar"],
      "worst_times": ["02:00-06:00", "Pazartesi sabah"],
      "content_type_timing": {
        "reels": "19:00-21:00",
        "carousel": "12:00-13:00",
        "stories": "Gün boyunca, 3-4 saatte bir"
      }
    },
    "tiktok": {
      "best_times": {
        "weekdays": [
          { "time": "12:00-15:00", "reason": "Öğlen molası", "engagement_boost": "+35%" },
          { "time": "19:00-22:00", "reason": "Prime time", "engagement_boost": "+50%" }
        ],
        "weekends": [
          { "time": "11:00-14:00", "reason": "Geç uyanış", "engagement_boost": "+40%" },
          { "time": "19:00-23:00", "reason": "Eğlence saati", "engagement_boost": "+55%" }
        ]
      },
      "best_days": ["Salı", "Perşembe", "Cumartesi"],
      "posting_frequency": "Günde 1-3 video"
    },
    "twitter": {
      "best_times": {
        "weekdays": [
          { "time": "08:00-10:00", "reason": "Haber saati", "engagement_boost": "+30%" },
          { "time": "17:00-18:00", "reason": "İşten çıkış", "engagement_boost": "+25%" }
        ]
      },
      "best_days": ["Çarşamba", "Perşembe"],
      "posting_frequency": "Günde 3-5 tweet"
    },
    "linkedin": {
      "best_times": {
        "weekdays": [
          { "time": "07:30-08:30", "reason": "İşe başlamadan", "engagement_boost": "+40%" },
          { "time": "12:00-13:00", "reason": "Öğle molası", "engagement_boost": "+35%" },
          { "time": "17:00-18:00", "reason": "İş bitimi", "engagement_boost": "+30%" }
        ]
      },
      "best_days": ["Salı", "Çarşamba", "Perşembe"],
      "avoid": "Hafta sonu"
    },
    "youtube": {
      "best_times": {
        "shorts": { "time": "17:00-21:00", "reason": "Mobil kullanım" },
        "long_form": { "time": "14:00-16:00 veya 20:00-22:00", "reason": "İzleme saatleri" }
      },
      "best_days": ["Cuma", "Cumartesi", "Pazar"]
    }
  },
  "weekly_schedule": {
    "pazartesi": [{ "platform": "Instagram Story", "time": "12:00" }, { "platform": "Twitter", "time": "08:00" }],
    "sali": [{ "platform": "Instagram Post", "time": "19:00" }, { "platform": "TikTok", "time": "20:00" }],
    "carsamba": [{ "platform": "LinkedIn", "time": "08:00" }, { "platform": "Twitter", "time": "17:00" }],
    "persembe": [{ "platform": "Instagram Reels", "time": "19:30" }, { "platform": "TikTok", "time": "12:00" }],
    "cuma": [{ "platform": "YouTube", "time": "15:00" }, { "platform": "Instagram", "time": "20:00" }],
    "cumartesi": [{ "platform": "TikTok", "time": "21:00" }, { "platform": "Instagram", "time": "11:00" }],
    "pazar": [{ "platform": "Instagram Carousel", "time": "19:00" }, { "platform": "Twitter Thread", "time": "20:00" }]
  },
  "pro_tips": [
    "Zamanlama ipucu 1",
    "Zamanlama ipucu 2",
    "Zamanlama ipucu 3"
  ]
}`

    const userPrompt = `Niş: ${niche}
Hedef Kitle: ${targetAudience || 'Genel'}
Platformlar: ${platforms?.join(', ') || 'Tüm platformlar'}
Bölge: ${region || 'Türkiye'}

Bu bilgilere göre optimal paylaşım zamanlarını analiz et.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.5 })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // TEST MODE: await deductCredits(supabase, userId, CREDIT_COST)

    return NextResponse.json({ 
      success: true, 
      result: result.data,
      creditsUsed: CREDIT_COST 
    })

  } catch (error: any) {
    console.error('Posting Optimizer Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
