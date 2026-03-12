import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJSONWithGroq, checkAndDeductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 2

export async function POST(request: NextRequest) {
  try {
    const { topic, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Konu gerekli' : 'Topic required' },
        { status: 400 }
      )
    }

    // Kredi kontrolü
    if (userId) {
      const creditCheck = await checkAndDeductCredits(supabase, userId, CREDIT_COST, language)
      if (!creditCheck.success) {
        return NextResponse.json({ error: creditCheck.error }, { status: 403 })
      }
    }

    const systemPrompt = language === 'tr'
      ? `Sen viral içerik uzmanısın. Dikkat çekici, ilgi uyandıran hook'lar (açılış cümleleri) yazıyorsun.
         Her hook farklı bir psikolojik tetikleyici kullanmalı ve tamamen özgün olmalı.
         Klişelerden kaçın, yaratıcı ol.`
      : `You are a viral content expert. You write attention-grabbing, engaging hooks (opening lines).
         Each hook should use a different psychological trigger and be completely original.
         Avoid clichés, be creative.`

    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için 8 farklı ve özgün hook yaz.

Her hook farklı bir strateji kullansın:
1. Merak uyandırıcı (bilgi boşluğu)
2. Şok edici (sürpriz unsur)
3. Soru soran (kendini test)
4. Hikaye başlatan (dönüşüm)
5. FOMO yaratan (kaçırma korkusu)
6. Tartışmalı (unpopular opinion)
7. İstatistik kullanan (sayılar)
8. Kişisel deneyim (bağ kurma)

JSON formatında yanıt ver:
{
  "hooks": [
    {"type": "curiosity", "emoji": "🤔", "text": "hook metni", "reason": "neden etkili"},
    {"type": "shocking", "emoji": "😱", "text": "hook metni", "reason": "neden etkili"},
    {"type": "question", "emoji": "❓", "text": "hook metni", "reason": "neden etkili"},
    {"type": "story", "emoji": "📖", "text": "hook metni", "reason": "neden etkili"},
    {"type": "fomo", "emoji": "⚡", "text": "hook metni", "reason": "neden etkili"},
    {"type": "controversy", "emoji": "🔥", "text": "hook metni", "reason": "neden etkili"},
    {"type": "statistic", "emoji": "📊", "text": "hook metni", "reason": "neden etkili"},
    {"type": "personal", "emoji": "💭", "text": "hook metni", "reason": "neden etkili"}
  ]
}`
      : `Write 8 different and unique hooks for "${topic}".

Each hook should use a different strategy:
1. Curiosity-inducing (information gap)
2. Shocking (surprise element)
3. Question-asking (self-test)
4. Story-starting (transformation)
5. FOMO-creating (fear of missing out)
6. Controversial (unpopular opinion)
7. Statistic-using (numbers)
8. Personal experience (connection)

Respond in JSON format:
{
  "hooks": [
    {"type": "curiosity", "emoji": "🤔", "text": "hook text", "reason": "why it works"},
    {"type": "shocking", "emoji": "😱", "text": "hook text", "reason": "why it works"},
    {"type": "question", "emoji": "❓", "text": "hook text", "reason": "why it works"},
    {"type": "story", "emoji": "📖", "text": "hook text", "reason": "why it works"},
    {"type": "fomo", "emoji": "⚡", "text": "hook text", "reason": "why it works"},
    {"type": "controversy", "emoji": "🔥", "text": "hook text", "reason": "why it works"},
    {"type": "statistic", "emoji": "📊", "text": "hook text", "reason": "why it works"},
    {"type": "personal", "emoji": "💭", "text": "hook text", "reason": "why it works"}
  ]
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.9,
      maxTokens: 2000
    })

    return NextResponse.json({ hooks: result.hooks || [] })

  } catch (error: any) {
    console.error('Hook Generator Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
