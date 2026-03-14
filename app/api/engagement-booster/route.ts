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
    const { accountInfo, currentEngagement, niche, platforms, userId, language = 'tr' } = await request.json()

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })
    }

    // TEST MODE: const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    // TEST MODE: if (!creditCheck.ok) {
      // TEST MODE: return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    // TEST MODE: }

    const systemPrompt = `Sen sosyal medya büyüme uzmanı ve etkileşim stratejistisin. Düşük etkileşim sorunlarını analiz et ve somut çözümler sun.

JSON formatında yanıt ver:
{
  "diagnosis": {
    "likely_issues": [
      { "issue": "Sorun 1", "severity": "Yüksek/Orta/Düşük", "explanation": "Açıklama" }
    ],
    "algorithm_status": "Algoritma durumu tahmini",
    "content_health": "İçerik sağlığı analizi",
    "audience_connection": "Kitle bağlantısı analizi"
  },
  "quick_wins": [
    {
      "action": "Hemen yapılacak aksiyon",
      "expected_impact": "+20% etkileşim",
      "time_to_result": "1-3 gün",
      "how_to": "Nasıl yapılacak"
    }
  ],
  "content_fixes": {
    "hook_improvements": [
      { "before": "Mevcut hook tipi", "after": "Önerilen hook tipi", "example": "Örnek" }
    ],
    "cta_improvements": [
      { "current_issue": "Mevcut sorun", "fix": "Çözüm", "example": "Örnek CTA" }
    ],
    "format_changes": [
      { "current": "Mevcut format", "recommended": "Önerilen format", "reason": "Neden" }
    ]
  },
  "posting_fixes": {
    "timing_issues": "Zamanlama sorunları",
    "frequency_issues": "Sıklık sorunları",
    "recommended_schedule": {
      "posts_per_day": 2,
      "best_times": ["09:00", "19:00"],
      "content_mix": { "educational": "40%", "entertaining": "30%", "promotional": "20%", "personal": "10%" }
    }
  },
  "engagement_tactics": [
    {
      "tactic": "Taktik adı",
      "description": "Detaylı açıklama",
      "implementation": ["Adım 1", "Adım 2", "Adım 3"],
      "expected_result": "Beklenen sonuç"
    }
  ],
  "community_building": {
    "reply_strategy": "Yorum yanıtlama stratejisi",
    "dm_strategy": "DM stratejisi",
    "collab_ideas": ["Collab fikri 1", "Collab fikri 2"],
    "engagement_pods": "Engagement pod önerisi"
  },
  "content_series_ideas": [
    {
      "series_name": "Seri adı",
      "description": "Açıklama",
      "frequency": "Sıklık",
      "engagement_hook": "Etkileşim kancası"
    }
  ],
  "30_day_action_plan": {
    "week_1": {
      "focus": "Odak",
      "actions": ["Aksiyon 1", "Aksiyon 2", "Aksiyon 3"],
      "kpis": ["KPI 1", "KPI 2"]
    },
    "week_2": {
      "focus": "Odak",
      "actions": ["Aksiyon 1", "Aksiyon 2", "Aksiyon 3"],
      "kpis": ["KPI 1", "KPI 2"]
    },
    "week_3": {
      "focus": "Odak",
      "actions": ["Aksiyon 1", "Aksiyon 2", "Aksiyon 3"],
      "kpis": ["KPI 1", "KPI 2"]
    },
    "week_4": {
      "focus": "Odak",
      "actions": ["Aksiyon 1", "Aksiyon 2", "Aksiyon 3"],
      "kpis": ["KPI 1", "KPI 2"]
    }
  },
  "metrics_to_track": {
    "primary": ["Ana metrik 1", "Ana metrik 2"],
    "secondary": ["İkincil metrik 1", "İkincil metrik 2"],
    "tools": ["Araç önerisi 1", "Araç önerisi 2"]
  },
  "mindset_shifts": [
    "Bakış açısı değişikliği 1",
    "Bakış açısı değişikliği 2"
  ]
}`

    const userPrompt = `Hesap Bilgisi: ${accountInfo || 'Genel içerik üreticisi'}
Mevcut Etkileşim: ${currentEngagement || 'Düşük (<%2)'}
Niş: ${niche}
Platformlar: ${platforms?.join(', ') || 'Instagram, TikTok'}

Bu hesabın etkileşimini artırmak için kapsamlı strateji oluştur.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 6000 })

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
    console.error('Engagement Booster Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
