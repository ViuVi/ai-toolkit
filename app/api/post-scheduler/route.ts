import { NextRequest, NextResponse } from 'next/server'
import { callGroqAI, parseJSONResponse } from '@/lib/groq'

// Ücretsiz araç

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, timezone, language = 'en' } = await request.json()

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya zamanlama uzmanısın. En iyi paylaşım zamanlarını öneriyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a social media scheduling expert. You suggest best posting times. Respond only in JSON format.`

    const platformList = platforms || ['Instagram', 'Twitter', 'TikTok']

    const userPrompt = language === 'tr'
      ? `"${niche || 'genel'}" nişi için ${platformList.join(', ')} platformlarında en iyi paylaşım zamanlarını öner. Zaman dilimi: ${timezone || 'UTC+3'}

JSON formatında yanıt ver:
{
  "schedule": [
    {"platform": "Instagram", "bestTimes": ["09:00", "12:00", "19:00"], "bestDays": ["Salı", "Perşembe"], "frequency": "günde 1-2"},
    {"platform": "Twitter", "bestTimes": ["08:00", "13:00", "18:00"], "bestDays": ["Pazartesi", "Çarşamba"], "frequency": "günde 3-5"}
  ],
  "tips": ["ipucu 1", "ipucu 2"]
}

Sadece JSON döndür.`
      : `Suggest best posting times for "${niche || 'general'}" niche on ${platformList.join(', ')} platforms. Timezone: ${timezone || 'UTC+3'}

Respond in JSON format:
{
  "schedule": [
    {"platform": "Instagram", "bestTimes": ["09:00", "12:00", "19:00"], "bestDays": ["Tuesday", "Thursday"], "frequency": "1-2 per day"},
    {"platform": "Twitter", "bestTimes": ["08:00", "13:00", "18:00"], "bestDays": ["Monday", "Wednesday"], "frequency": "3-5 per day"}
  ],
  "tips": ["tip 1", "tip 2"]
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.6,
      maxTokens: 1500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Post Scheduler Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
