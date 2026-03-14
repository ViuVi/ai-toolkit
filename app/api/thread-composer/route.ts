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
    const { topic, threadType, tweetCount, goal, userId, language = 'tr' } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    // TEST MODE: const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    // TEST MODE: if (!creditCheck.ok) {
      // TEST MODE: return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    // TEST MODE: }

    const count = tweetCount || 10

    const systemPrompt = `Sen viral Twitter/X thread yazarısın. Yüksek etkileşim alan thread'ler yazıyorsun.

KURALLAR:
- Her tweet MAX 280 karakter
- İlk tweet hook olmalı
- Her tweet bir öncekiyle bağlantılı
- Son tweet güçlü CTA içermeli

JSON formatında yanıt ver:
{
  "thread_concept": {
    "title": "Thread başlığı",
    "angle": "Bakış açısı",
    "target_audience": "Hedef kitle",
    "viral_elements": ["Viral element 1", "Viral element 2"]
  },
  "hook_options": [
    {
      "style": "Soru",
      "tweet": "Hook tweet (max 280 karakter)",
      "engagement_prediction": "Yüksek/Orta"
    },
    {
      "style": "Şok İstatistik",
      "tweet": "Hook tweet (max 280 karakter)",
      "engagement_prediction": "Çok Yüksek"
    },
    {
      "style": "Kişisel Hikaye",
      "tweet": "Hook tweet (max 280 karakter)",
      "engagement_prediction": "Yüksek"
    }
  ],
  "thread": [
    {
      "number": 1,
      "type": "Hook",
      "tweet": "Tweet metni (MAX 280 karakter)",
      "character_count": 250,
      "purpose": "Dikkat çekme",
      "emoji_suggestion": "🔥"
    },
    {
      "number": 2,
      "type": "Context",
      "tweet": "Tweet metni (MAX 280 karakter)",
      "character_count": 270,
      "purpose": "Bağlam oluşturma"
    }
  ],
  "engagement_boosters": {
    "best_tweet_to_quote": 3,
    "best_tweet_for_screenshot": 5,
    "reply_bait_tweet": 7,
    "save_worthy_tweet": 4
  },
  "posting_strategy": {
    "best_day": "Salı veya Çarşamba",
    "best_time": "09:00-10:00 veya 20:00-21:00",
    "spacing": "Her tweet arası 1-2 dakika",
    "first_reply": "İlk yanıtta ne yazmalısın"
  },
  "amplification_tactics": [
    { "tactic": "Taktik 1", "how": "Nasıl yapılacak" },
    { "tactic": "Taktik 2", "how": "Nasıl yapılacak" }
  ],
  "repurpose_ideas": {
    "carousel": "Carousel için nasıl uyarlanır",
    "linkedin": "LinkedIn için nasıl uyarlanır",
    "newsletter": "Newsletter için nasıl uyarlanır"
  },
  "metrics_to_track": ["Metrik 1", "Metrik 2", "Metrik 3"]
}`

    const userPrompt = `Konu: ${topic}
Thread Tipi: ${threadType || 'Eğitici'}
Tweet Sayısı: ${count}
Hedef: ${goal || 'Viral olmak ve takipçi kazanmak'}

Bu konu için ${count} tweetlik viral bir thread oluştur. Her tweet MAX 280 karakter olmalı.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.85, maxTokens: 5000 })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // TEST MODE: await deductCredits(supabase, userId, CREDIT_COST)

    return NextResponse.json({ 
      success: true, 
      thread: result.data,
      creditsUsed: CREDIT_COST 
    })

  } catch (error: any) {
    console.error('Thread Composer Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
