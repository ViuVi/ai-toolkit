import { NextRequest, NextResponse } from 'next/server'
import { generateJSONWithGroq } from '@/lib/groq'

// Bu ücretsiz bir araç

export async function POST(request: NextRequest) {
  try {
    const { niche, duration, platforms, goals, language = 'en' } = await request.json()

    const nicheInfo = niche || 'general'
    const durationInfo = duration || '1 week'
    const platformList = platforms || ['Instagram', 'Twitter']
    const goalInfo = goals || (language === 'tr' ? 'etkileşim artırma' : 'increase engagement')

    const systemPrompt = language === 'tr'
      ? `Sen içerik planlama stratejistisin.
         Kapsamlı ve uygulanabilir içerik takvimleri oluşturuyorsun.
         Her gün için spesifik içerik önerileri sunuyorsun.`
      : `You are a content planning strategist.
         You create comprehensive and actionable content calendars.
         You provide specific content suggestions for each day.`

    const userPrompt = language === 'tr'
      ? `"${nicheInfo}" nişi için ${durationInfo} süreli, ${platformList.join(' ve ')} platformlarında "${goalInfo}" hedefli içerik takvimi oluştur.

Her gün için:
- İçerik tipi
- Konu önerisi
- Platform
- Paylaşım zamanı
- Hashtag önerileri

JSON formatında yanıt ver:
{
  "calendar": {
    "overview": "genel strateji özeti",
    "days": [
      {
        "day": "Pazartesi",
        "date": "Gün 1",
        "posts": [
          {
            "time": "09:00",
            "platform": "Instagram",
            "content_type": "carousel/reel/post",
            "topic": "içerik konusu",
            "caption_idea": "caption fikri",
            "hashtags": ["hashtag1", "hashtag2"],
            "notes": "ek notlar"
          }
        ]
      }
    ],
    "themes": ["haftalık tema 1", "haftalık tema 2"],
    "content_pillars": ["içerik direği 1", "içerik direği 2"],
    "tips": ["uygulama ipucu 1", "uygulama ipucu 2"]
  }
}`
      : `Create a content calendar for "${nicheInfo}" niche for ${durationInfo}, on ${platformList.join(' and ')} platforms with "${goalInfo}" goal.

For each day:
- Content type
- Topic suggestion
- Platform
- Posting time
- Hashtag suggestions

Respond in JSON format:
{
  "calendar": {
    "overview": "general strategy summary",
    "days": [
      {
        "day": "Monday",
        "date": "Day 1",
        "posts": [
          {
            "time": "09:00",
            "platform": "Instagram",
            "content_type": "carousel/reel/post",
            "topic": "content topic",
            "caption_idea": "caption idea",
            "hashtags": ["hashtag1", "hashtag2"],
            "notes": "additional notes"
          }
        ]
      }
    ],
    "themes": ["weekly theme 1", "weekly theme 2"],
    "content_pillars": ["content pillar 1", "content pillar 2"],
    "tips": ["implementation tip 1", "implementation tip 2"]
  }
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 4000
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Content Calendar Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
