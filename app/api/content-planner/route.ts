import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callAI, checkCredits, deductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 10

export async function POST(request: NextRequest) {
  try {
    const { niche, goals, platforms, contentPillars, userId, language = 'tr' } = await request.json()

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })
    }

    // TEST MODE: const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    // TEST MODE: if (!creditCheck.ok) {
      // TEST MODE: return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    // TEST MODE: }

    const systemPrompt = `Sen içerik stratejistisin. 30 günlük profesyonel içerik takvimi oluştur.

JSON formatında yanıt ver:
{
  "strategy_overview": {
    "main_goal": "Ana hedef",
    "content_pillars": ["Pillar 1", "Pillar 2", "Pillar 3", "Pillar 4"],
    "posting_frequency": "Günlük paylaşım sayısı",
    "key_themes": ["Tema 1", "Tema 2", "Tema 3"]
  },
  "weekly_themes": {
    "week_1": { "theme": "Tema", "focus": "Odak noktası" },
    "week_2": { "theme": "Tema", "focus": "Odak noktası" },
    "week_3": { "theme": "Tema", "focus": "Odak noktası" },
    "week_4": { "theme": "Tema", "focus": "Odak noktası" }
  },
  "calendar": [
    {
      "day": 1,
      "date_label": "1. Gün - Pazartesi",
      "posts": [
        {
          "platform": "Instagram",
          "time": "10:00",
          "type": "Carousel",
          "topic": "İçerik konusu",
          "hook": "Dikkat çekici hook",
          "caption_idea": "Caption fikri",
          "hashtag_count": 15,
          "pillar": "Eğitim"
        },
        {
          "platform": "TikTok",
          "time": "19:00",
          "type": "Video",
          "topic": "İçerik konusu",
          "hook": "İlk 3 saniye hook",
          "script_outline": "Kısa script özeti",
          "pillar": "Eğlence"
        }
      ]
    }
  ],
  "content_ideas_bank": [
    { "pillar": "Eğitim", "ideas": ["Fikir 1", "Fikir 2", "Fikir 3", "Fikir 4", "Fikir 5"] },
    { "pillar": "İlham", "ideas": ["Fikir 1", "Fikir 2", "Fikir 3", "Fikir 4", "Fikir 5"] },
    { "pillar": "Eğlence", "ideas": ["Fikir 1", "Fikir 2", "Fikir 3", "Fikir 4", "Fikir 5"] },
    { "pillar": "Satış", "ideas": ["Fikir 1", "Fikir 2", "Fikir 3", "Fikir 4", "Fikir 5"] }
  ],
  "special_days": [
    { "day": 14, "event": "Sevgililer Günü (örnek)", "content_idea": "İçerik fikri" }
  ],
  "kpis": {
    "expected_reach": "Tahmini erişim",
    "expected_engagement": "Tahmini etkileşim",
    "growth_target": "Takipçi artış hedefi"
  }
}`

    const userPrompt = `Niş: ${niche}
Hedefler: ${goals || 'Takipçi artışı ve etkileşim'}
Platformlar: ${platforms?.join(', ') || 'Instagram, TikTok'}
İçerik Direkleri: ${contentPillars?.join(', ') || 'Eğitim, İlham, Eğlence, Satış'}

30 günlük detaylı içerik takvimi oluştur. Her gün için en az 1-2 içerik önerisi olsun.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.8, maxTokens: 8000 })

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
    console.error('Content Planner Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
