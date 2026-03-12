import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJSONWithGroq, checkAndDeductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 5

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, region, userId, language = 'en' } = await request.json()

    if (!niche) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Niş gerekli' : 'Niche required' },
        { status: 400 }
      )
    }

    if (userId) {
      const creditCheck = await checkAndDeductCredits(supabase, userId, CREDIT_COST, language)
      if (!creditCheck.success) {
        return NextResponse.json({ error: creditCheck.error }, { status: 403 })
      }
    }

    const platformInfo = platform || 'all'
    const regionInfo = region || (language === 'tr' ? 'Türkiye' : 'Global')

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya trend analistsin.
         Güncel trendleri, viral içerikleri ve yükselen konuları analiz ediyorsun.
         İçerik üreticilere uygulanabilir trend önerileri sunuyorsun.`
      : `You are a social media trend analyst.
         You analyze current trends, viral content, and rising topics.
         You provide actionable trend recommendations to content creators.`

    const userPrompt = language === 'tr'
      ? `"${niche}" nişi için ${platformInfo} platformlarında ${regionInfo} bölgesindeki güncel trendleri analiz et.

Şunları belirle:
1. Yükselen trendler (şu an büyüyen)
2. Viral formatlar (popüler içerik tipleri)
3. Trending ses/müzikler
4. Hashtag trendleri
5. İçerik fırsatları

JSON formatında yanıt ver:
{
  "trends": {
    "rising_topics": [
      {"topic": "trend konusu", "growth": "yükseliş oranı", "opportunity": "fırsat açıklaması"}
    ],
    "viral_formats": [
      {"format": "format adı", "description": "açıklama", "example_idea": "örnek fikir"}
    ],
    "trending_sounds": ["ses/müzik önerisi"],
    "hashtags": {
      "trending": ["hashtag1", "hashtag2"],
      "rising": ["hashtag1", "hashtag2"]
    },
    "content_opportunities": [
      {"opportunity": "fırsat", "timing": "zamanlama", "potential": "potansiyel"}
    ]
  },
  "recommendations": ["öneri 1", "öneri 2", "öneri 3"],
  "avoid": ["kaçınılması gereken 1", "kaçınılması gereken 2"]
}`
      : `Analyze current trends for "${niche}" niche on ${platformInfo} platforms in ${regionInfo} region.

Identify:
1. Rising trends (currently growing)
2. Viral formats (popular content types)
3. Trending sounds/music
4. Hashtag trends
5. Content opportunities

Respond in JSON format:
{
  "trends": {
    "rising_topics": [
      {"topic": "trend topic", "growth": "growth rate", "opportunity": "opportunity description"}
    ],
    "viral_formats": [
      {"format": "format name", "description": "description", "example_idea": "example idea"}
    ],
    "trending_sounds": ["sound/music suggestion"],
    "hashtags": {
      "trending": ["hashtag1", "hashtag2"],
      "rising": ["hashtag1", "hashtag2"]
    },
    "content_opportunities": [
      {"opportunity": "opportunity", "timing": "timing", "potential": "potential"}
    ]
  },
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "avoid": ["thing to avoid 1", "thing to avoid 2"]
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 3000
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Trend Detector Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
