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
    const { comment, tone, platform, userId, language = 'en' } = await request.json()

    if (!comment) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Yorum gerekli' : 'Comment required' },
        { status: 400 }
      )
    }

    if (userId) {
      const creditCheck = await checkAndDeductCredits(supabase, userId, CREDIT_COST, language)
      if (!creditCheck.success) {
        return NextResponse.json({ error: creditCheck.error }, { status: 403 })
      }
    }

    const toneInfo = tone || (language === 'tr' ? 'samimi' : 'friendly')
    const platformInfo = platform || 'Instagram'

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya yöneticisisin.
         Yorumlara profesyonel, samimi ve marka imajına uygun yanıtlar yazıyorsun.
         Yanıtlar etkileşimi artırmalı ve pozitif bir izlenim bırakmalı.`
      : `You are a social media manager.
         You write professional, friendly responses to comments that fit brand image.
         Responses should increase engagement and leave a positive impression.`

    const userPrompt = language === 'tr'
      ? `Şu yoruma ${toneInfo} tonunda, ${platformInfo} platformuna uygun 3 farklı yanıt yaz:

Yorum: "${comment}"

Her yanıt:
- Platforma uygun uzunlukta
- Samimi ama profesyonel
- Etkileşimi teşvik edici

JSON formatında yanıt ver:
{
  "replies": [
    {
      "text": "yanıt metni",
      "tone": "ton açıklaması",
      "emoji_suggestion": "önerilen emojiler",
      "engagement_tip": "etkileşim ipucu"
    }
  ],
  "comment_sentiment": "olumlu/olumsuz/nötr",
  "priority": "yüksek/orta/düşük"
}`
      : `Write 3 different replies to this comment in ${toneInfo} tone, appropriate for ${platformInfo}:

Comment: "${comment}"

Each reply:
- Platform-appropriate length
- Friendly but professional
- Encourages engagement

Respond in JSON format:
{
  "replies": [
    {
      "text": "reply text",
      "tone": "tone description",
      "emoji_suggestion": "suggested emojis",
      "engagement_tip": "engagement tip"
    }
  ],
  "comment_sentiment": "positive/negative/neutral",
  "priority": "high/medium/low"
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 1500
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Comment Reply Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
