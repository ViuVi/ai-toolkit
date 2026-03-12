import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJSONWithGroq, checkAndDeductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 4

export async function POST(request: NextRequest) {
  try {
    const { topic, tweetCount, style, userId, language = 'en' } = await request.json()

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

    const count = tweetCount || 8
    const styleInfo = style || (language === 'tr' ? 'bilgilendirici' : 'informative')

    const systemPrompt = language === 'tr'
      ? `Sen X/Twitter için viral thread yazarısın. 
         Her tweet maksimum 280 karakter olmalı.
         Thread akıcı ve bağlantılı olmalı.
         İlk tweet hook olmalı, son tweet CTA içermeli.`
      : `You are a viral thread writer for X/Twitter.
         Each tweet must be maximum 280 characters.
         Thread should flow smoothly and be connected.
         First tweet should be a hook, last tweet should contain CTA.`

    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için ${count} tweetlik, ${styleInfo} tarzında viral bir thread yaz.

Kurallar:
- Her tweet maksimum 280 karakter
- İlk tweet dikkat çekici hook
- Her tweet bir öncekiyle bağlantılı
- Son tweet CTA ve özet
- Uygun emojiler kullan

JSON formatında yanıt ver:
{
  "thread": {
    "title": "thread başlığı",
    "tweets": [
      {"number": 1, "content": "tweet içeriği", "type": "hook"},
      {"number": 2, "content": "tweet içeriği", "type": "content"},
      ...
      {"number": ${count}, "content": "tweet içeriği", "type": "cta"}
    ],
    "hashtags": ["hashtag1", "hashtag2"],
    "best_time": "paylaşım için en iyi zaman",
    "engagement_tips": ["ipucu 1", "ipucu 2"]
  }
}`
      : `Write a viral thread of ${count} tweets about "${topic}" in ${styleInfo} style.

Rules:
- Each tweet maximum 280 characters
- First tweet is attention-grabbing hook
- Each tweet connected to the previous
- Last tweet is CTA and summary
- Use appropriate emojis

Respond in JSON format:
{
  "thread": {
    "title": "thread title",
    "tweets": [
      {"number": 1, "content": "tweet content", "type": "hook"},
      {"number": 2, "content": "tweet content", "type": "content"},
      ...
      {"number": ${count}, "content": "tweet content", "type": "cta"}
    ],
    "hashtags": ["hashtag1", "hashtag2"],
    "best_time": "best time to post",
    "engagement_tips": ["tip 1", "tip 2"]
  }
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.85,
      maxTokens: 3000
    })

    return NextResponse.json({ thread: result.thread || result })

  } catch (error: any) {
    console.error('Thread Writer Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
