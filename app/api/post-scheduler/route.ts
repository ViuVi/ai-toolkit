import { NextRequest, NextResponse } from 'next/server'
import { generateJSONWithGroq } from '@/lib/groq'

// Bu ücretsiz bir araç

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, timezone, language = 'en' } = await request.json()

    const nicheInfo = niche || 'general'
    const platformList = platforms || ['Instagram', 'Twitter', 'TikTok', 'YouTube']
    const tz = timezone || 'UTC+3'

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya zamanlama uzmanısın.
         Farklı platformlar için en iyi paylaşım zamanlarını biliyorsun.
         Niş ve hedef kitleye göre özelleştirilmiş öneriler sunuyorsun.`
      : `You are a social media scheduling expert.
         You know the best posting times for different platforms.
         You provide customized recommendations based on niche and target audience.`

    const userPrompt = language === 'tr'
      ? `"${nicheInfo}" nişi için ${platformList.join(', ')} platformlarında en iyi paylaşım zamanlarını öner. Zaman dilimi: ${tz}

JSON formatında yanıt ver:
{
  "schedule": {
    "platforms": [
      {
        "platform": "platform adı",
        "best_times": {
          "weekdays": ["09:00", "12:00", "18:00"],
          "weekends": ["10:00", "14:00", "20:00"]
        },
        "peak_days": ["Salı", "Perşembe"],
        "avoid_times": ["02:00-06:00"],
        "reasoning": "neden bu zamanlar"
      }
    ],
    "general_tips": ["ipucu 1", "ipucu 2"],
    "frequency_recommendation": {
      "daily_posts": "önerilen günlük paylaşım sayısı",
      "weekly_posts": "haftalık toplam"
    }
  }
}`
      : `Suggest the best posting times for "${nicheInfo}" niche on ${platformList.join(', ')} platforms. Timezone: ${tz}

Respond in JSON format:
{
  "schedule": {
    "platforms": [
      {
        "platform": "platform name",
        "best_times": {
          "weekdays": ["09:00", "12:00", "18:00"],
          "weekends": ["10:00", "14:00", "20:00"]
        },
        "peak_days": ["Tuesday", "Thursday"],
        "avoid_times": ["02:00-06:00"],
        "reasoning": "why these times"
      }
    ],
    "general_tips": ["tip 1", "tip 2"],
    "frequency_recommendation": {
      "daily_posts": "recommended daily posts",
      "weekly_posts": "weekly total"
    }
  }
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.6,
      maxTokens: 2000
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Post Scheduler Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
