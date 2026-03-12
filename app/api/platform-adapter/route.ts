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
    const { content, sourcePlatform, targetPlatforms, userId, language = 'en' } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: language === 'tr' ? 'İçerik gerekli' : 'Content is required' },
        { status: 400 }
      )
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const targets = targetPlatforms || ['Instagram', 'Twitter', 'LinkedIn', 'TikTok']

    const systemPrompt = language === 'tr'
      ? `Sen içerik adaptasyon uzmanısın. İçeriği farklı platformlara uyarlıyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a content adaptation expert. You adapt content for different platforms. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `Şu içeriği ${targets.join(', ')} platformlarına uyarla:

"${content}"

JSON formatında yanıt ver:
{
  "adaptations": [
    {"id": 1, "platform": "Instagram", "content": "uyarlanmış içerik", "characterCount": 150, "hashtags": ["hashtag1"]},
    {"id": 2, "platform": "Twitter", "content": "uyarlanmış içerik", "characterCount": 280, "hashtags": ["hashtag1"]}
  ]
}

Sadece JSON döndür.`
      : `Adapt this content for ${targets.join(', ')} platforms:

"${content}"

Respond in JSON format:
{
  "adaptations": [
    {"id": 1, "platform": "Instagram", "content": "adapted content", "characterCount": 150, "hashtags": ["hashtag1"]},
    {"id": 2, "platform": "Twitter", "content": "adapted content", "characterCount": 280, "hashtags": ["hashtag1"]}
  ]
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.75,
      maxTokens: 2500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json({ adaptations: parsed.adaptations || parsed })

  } catch (error: any) {
    console.error('Platform Adapter Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
