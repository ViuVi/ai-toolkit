import { NextRequest, NextResponse } from 'next/server'
import { generateJSONWithGroq } from '@/lib/groq'

// Bu ücretsiz bir araç - kredi almıyor

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, count, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Konu gerekli' : 'Topic required' },
        { status: 400 }
      )
    }

    const platformInfo = platform || 'Instagram'
    const hashtagCount = count || 20

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya hashtag uzmanısın.
         Erişimi ve etkileşimi artıracak hashtag'ler öneriyorsun.
         Popüler, orta ve niş hashtag'leri dengeli kullan.`
      : `You are a social media hashtag expert.
         You suggest hashtags that increase reach and engagement.
         Balance popular, medium, and niche hashtags.`

    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için ${platformInfo} platformunda kullanılacak ${hashtagCount} hashtag öner.

Kategorilere ayır:
- Yüksek hacimli (popüler)
- Orta hacimli (dengeli)
- Niş (hedefli)

JSON formatında yanıt ver:
{
  "hashtags": {
    "high_volume": ["hashtag1", "hashtag2", ...],
    "medium_volume": ["hashtag1", "hashtag2", ...],
    "niche": ["hashtag1", "hashtag2", ...]
  },
  "recommended_set": ["en iyi 10 hashtag kombinasyonu"],
  "tips": ["kullanım ipucu 1", "kullanım ipucu 2"]
}`
      : `Suggest ${hashtagCount} hashtags for "${topic}" to use on ${platformInfo} platform.

Categorize them:
- High volume (popular)
- Medium volume (balanced)
- Niche (targeted)

Respond in JSON format:
{
  "hashtags": {
    "high_volume": ["hashtag1", "hashtag2", ...],
    "medium_volume": ["hashtag1", "hashtag2", ...],
    "niche": ["hashtag1", "hashtag2", ...]
  },
  "recommended_set": ["best 10 hashtag combination"],
  "tips": ["usage tip 1", "usage tip 2"]
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 1500
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Hashtag Generator Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
