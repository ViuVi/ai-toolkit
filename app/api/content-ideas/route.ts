import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callGroqAI, parseJSONResponse, checkCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 3

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, count, userId, language = 'en' } = await request.json()

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

    const ideaCount = count || 10

    const systemPrompt = language === 'tr'
      ? `Sen içerik stratejistisin. Viral potansiyeli yüksek içerik fikirleri üretiyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a content strategist. You generate content ideas with high viral potential. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `"${niche}" nişi için ${platform || 'sosyal medya'} platformunda ${ideaCount} içerik fikri üret.

JSON formatında yanıt ver:
{
  "ideas": [
    {"id": 1, "title": "fikir başlığı", "description": "açıklama", "format": "video/carousel/reel", "difficulty": "kolay/orta/zor"},
    {"id": 2, "title": "fikir başlığı", "description": "açıklama", "format": "video", "difficulty": "kolay"}
  ]
}

Sadece JSON döndür.`
      : `Generate ${ideaCount} content ideas for "${niche}" niche on ${platform || 'social media'} platform.

Respond in JSON format:
{
  "ideas": [
    {"id": 1, "title": "idea title", "description": "description", "format": "video/carousel/reel", "difficulty": "easy/medium/hard"},
    {"id": 2, "title": "idea title", "description": "description", "format": "video", "difficulty": "easy"}
  ]
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.9,
      maxTokens: 2500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json({ ideas: parsed.ideas || parsed })

  } catch (error: any) {
    console.error('Content Ideas Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
