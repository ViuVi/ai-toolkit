import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJSONWithGroq, checkAndDeductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 3

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, contentType, userId, language = 'en' } = await request.json()

    if (!niche) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Niş/konu gerekli' : 'Niche required' },
        { status: 400 }
      )
    }

    if (userId) {
      const creditCheck = await checkAndDeductCredits(supabase, userId, CREDIT_COST, language)
      if (!creditCheck.success) {
        return NextResponse.json({ error: creditCheck.error }, { status: 403 })
      }
    }

    const platformInfo = platform || 'all platforms'
    const typeInfo = contentType || 'mixed'

    const systemPrompt = language === 'tr'
      ? `Sen içerik stratejisti ve trend analistsin.
         Viral olma potansiyeli yüksek, özgün içerik fikirleri üretiyorsun.
         Her fikir uygulanabilir ve detaylı olmalı.`
      : `You are a content strategist and trend analyst.
         You generate original content ideas with high viral potential.
         Each idea should be actionable and detailed.`

    const userPrompt = language === 'tr'
      ? `"${niche}" nişi için ${platformInfo} platformlarında paylaşılacak 10 özgün içerik fikri üret.

Her fikir için:
- Başlık/konsept
- Neden viral olabilir
- Hangi formatta olmalı (video, carousel, story vb.)
- Tahmini etkileşim potansiyeli

JSON formatında yanıt ver:
{
  "ideas": [
    {
      "title": "içerik başlığı",
      "concept": "detaylı açıklama",
      "format": "video/carousel/image/story/reel",
      "platform": "en uygun platform",
      "viral_reason": "neden viral olabilir",
      "engagement_potential": "yüksek/orta/düşük",
      "difficulty": "kolay/orta/zor",
      "trending_hook": "trend ile bağlantı"
    }
  ]
}`
      : `Generate 10 original content ideas for "${niche}" niche to post on ${platformInfo}.

For each idea:
- Title/concept
- Why it could go viral
- What format it should be (video, carousel, story, etc.)
- Estimated engagement potential

Respond in JSON format:
{
  "ideas": [
    {
      "title": "content title",
      "concept": "detailed description",
      "format": "video/carousel/image/story/reel",
      "platform": "best platform",
      "viral_reason": "why it could go viral",
      "engagement_potential": "high/medium/low",
      "difficulty": "easy/medium/hard",
      "trending_hook": "connection to trends"
    }
  ]
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.9,
      maxTokens: 3000
    })

    return NextResponse.json({ ideas: result.ideas || [] })

  } catch (error: any) {
    console.error('Content Ideas Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
