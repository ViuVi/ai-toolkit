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
    const { topic, platform, tone, userId, language = 'en' } = await request.json()

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

    const platformInfo = platform || 'Instagram'
    const toneInfo = tone || (language === 'tr' ? 'profesyonel' : 'professional')

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya içerik uzmanısın. ${platformInfo} için mükemmel caption'lar yazıyorsun.
         Her caption özgün, ilgi çekici ve platforma uygun olmalı.
         Emoji kullanımına dikkat et, doğal ve akıcı ol.`
      : `You are a social media content expert. You write perfect captions for ${platformInfo}.
         Each caption should be original, engaging, and platform-appropriate.
         Pay attention to emoji usage, be natural and fluent.`

    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için ${platformInfo} platformuna uygun, ${toneInfo} tonunda 5 farklı caption yaz.

Her caption:
- Dikkat çekici bir açılış
- Ana mesaj
- Call-to-action (CTA)
- Uygun emojiler

JSON formatında yanıt ver:
{
  "captions": [
    {
      "text": "caption metni",
      "length": "kısa/orta/uzun",
      "engagement_tip": "etkileşim ipucu",
      "best_time": "paylaşım için en iyi zaman"
    }
  ]
}`
      : `Write 5 different captions for "${topic}" suitable for ${platformInfo} platform with ${toneInfo} tone.

Each caption should have:
- Attention-grabbing opening
- Main message
- Call-to-action (CTA)
- Appropriate emojis

Respond in JSON format:
{
  "captions": [
    {
      "text": "caption text",
      "length": "short/medium/long",
      "engagement_tip": "engagement tip",
      "best_time": "best time to post"
    }
  ]
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.85,
      maxTokens: 2000
    })

    return NextResponse.json({ captions: result.captions || [] })

  } catch (error: any) {
    console.error('Caption Writer Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
