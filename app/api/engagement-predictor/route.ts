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
    const { content, platform, niche, userId, language = 'en' } = await request.json()

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

    const systemPrompt = language === 'tr'
      ? `Sen içerik analisti ve etkileşim uzmanısın. İçeriklerin performansını analiz ediyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a content analyst and engagement expert. You analyze content performance. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `Şu içeriğin ${platform || 'Instagram'} platformunda ${niche || 'genel'} nişinde performansını analiz et:

"${content}"

JSON formatında yanıt ver:
{
  "analysis": {
    "overallScore": 75,
    "viralPotential": "orta",
    "scores": {
      "hook": {"score": 8, "feedback": "geri bildirim"},
      "value": {"score": 7, "feedback": "geri bildirim"},
      "cta": {"score": 6, "feedback": "geri bildirim"}
    },
    "strengths": ["güçlü yön 1", "güçlü yön 2"],
    "improvements": ["iyileştirme 1", "iyileştirme 2"],
    "bestPostingTime": "09:00-11:00"
  }
}

Sadece JSON döndür.`
      : `Analyze the performance of this content on ${platform || 'Instagram'} in ${niche || 'general'} niche:

"${content}"

Respond in JSON format:
{
  "analysis": {
    "overallScore": 75,
    "viralPotential": "medium",
    "scores": {
      "hook": {"score": 8, "feedback": "feedback"},
      "value": {"score": 7, "feedback": "feedback"},
      "cta": {"score": 6, "feedback": "feedback"}
    },
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "bestPostingTime": "09:00-11:00"
  }
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.6,
      maxTokens: 1500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Engagement Predictor Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
