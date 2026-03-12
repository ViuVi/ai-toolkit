import { NextRequest, NextResponse } from 'next/server'
import { callGroqAI, parseJSONResponse } from '@/lib/groq'

// Ücretsiz araç

export async function POST(request: NextRequest) {
  try {
    const { niche, duration, platforms, goals, language = 'en' } = await request.json()

    const systemPrompt = language === 'tr'
      ? `Sen içerik planlama stratejistisin. İçerik takvimleri oluşturuyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a content planning strategist. You create content calendars. Respond only in JSON format.`

    const platformList = platforms || ['Instagram', 'Twitter']
    const durationInfo = duration || '1 hafta'

    const userPrompt = language === 'tr'
      ? `"${niche || 'genel'}" nişi için ${durationInfo} süreli ${platformList.join(' ve ')} platformlarında içerik takvimi oluştur.
${goals ? 'Hedef: ' + goals : ''}

JSON formatında yanıt ver:
{
  "calendar": {
    "overview": "genel strateji",
    "days": [
      {"day": "Pazartesi", "posts": [{"time": "09:00", "platform": "Instagram", "type": "carousel", "topic": "konu", "caption": "caption fikri"}]},
      {"day": "Salı", "posts": [{"time": "12:00", "platform": "Twitter", "type": "thread", "topic": "konu", "caption": "caption fikri"}]}
    ],
    "themes": ["haftalık tema 1", "haftalık tema 2"]
  }
}

Sadece JSON döndür.`
      : `Create a ${durationInfo} content calendar for "${niche || 'general'}" niche on ${platformList.join(' and ')} platforms.
${goals ? 'Goal: ' + goals : ''}

Respond in JSON format:
{
  "calendar": {
    "overview": "general strategy",
    "days": [
      {"day": "Monday", "posts": [{"time": "09:00", "platform": "Instagram", "type": "carousel", "topic": "topic", "caption": "caption idea"}]},
      {"day": "Tuesday", "posts": [{"time": "12:00", "platform": "Twitter", "type": "thread", "topic": "topic", "caption": "caption idea"}]}
    ],
    "themes": ["weekly theme 1", "weekly theme 2"]
  }
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 3000
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Content Calendar Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
