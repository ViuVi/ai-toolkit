import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callGroqAI, parseJSONResponse, checkCredits } from '@/lib/groq'

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
        { error: language === 'tr' ? 'Niş gerekli' : 'Niche is required' },
        { status: 400 }
      )
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya trend analistsin. Güncel trendleri analiz ediyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a social media trend analyst. You analyze current trends. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `"${niche}" nişi için ${platform || 'tüm platformlarda'} ${region || 'global'} trendleri analiz et.

JSON formatında yanıt ver:
{
  "trends": [
    {"id": 1, "trend": "trend adı", "platform": "TikTok", "growth": "yükselen", "opportunity": "fırsat açıklaması"},
    {"id": 2, "trend": "trend adı", "platform": "Instagram", "growth": "stabil", "opportunity": "fırsat açıklaması"}
  ],
  "hashtags": ["trend hashtag 1", "trend hashtag 2"],
  "contentIdeas": ["içerik fikri 1", "içerik fikri 2"]
}

Sadece JSON döndür.`
      : `Analyze trends for "${niche}" niche on ${platform || 'all platforms'} in ${region || 'global'} region.

Respond in JSON format:
{
  "trends": [
    {"id": 1, "trend": "trend name", "platform": "TikTok", "growth": "rising", "opportunity": "opportunity description"},
    {"id": 2, "trend": "trend name", "platform": "Instagram", "growth": "stable", "opportunity": "opportunity description"}
  ],
  "hashtags": ["trending hashtag 1", "trending hashtag 2"],
  "contentIdeas": ["content idea 1", "content idea 2"]
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 2000
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Trend Detector Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
