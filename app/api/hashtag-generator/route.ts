import { NextRequest, NextResponse } from 'next/server'
import { callGroqAI, parseJSONResponse } from '@/lib/groq'

// Ücretsiz araç

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, count, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Konu gerekli' : 'Topic is required' },
        { status: 400 }
      )
    }

    const hashtagCount = count || 20

    const systemPrompt = language === 'tr'
      ? `Sen hashtag uzmanısın. Etkileşim artıran hashtagler öneriyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a hashtag expert. You suggest engagement-boosting hashtags. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için ${platform || 'Instagram'} platformunda ${hashtagCount} hashtag öner.

JSON formatında yanıt ver:
{
  "hashtags": {
    "popular": ["hashtag1", "hashtag2", "hashtag3"],
    "medium": ["hashtag4", "hashtag5", "hashtag6"],
    "niche": ["hashtag7", "hashtag8", "hashtag9"]
  },
  "recommended": ["en iyi 10 hashtag listesi"]
}

Sadece JSON döndür.`
      : `Suggest ${hashtagCount} hashtags for "${topic}" on ${platform || 'Instagram'} platform.

Respond in JSON format:
{
  "hashtags": {
    "popular": ["hashtag1", "hashtag2", "hashtag3"],
    "medium": ["hashtag4", "hashtag5", "hashtag6"],
    "niche": ["hashtag7", "hashtag8", "hashtag9"]
  },
  "recommended": ["best 10 hashtag list"]
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 1000
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Hashtag Generator Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
