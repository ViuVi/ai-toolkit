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
      return NextResponse.json({ 
        error: language === 'tr' ? 'İçerik gerekli' : 'Content required' 
      }, { status: 400 })
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const systemPrompt = language === 'tr'
      ? `Sen viral içerik analisti ve etkileşim uzmanısın. İçeriklerin viral potansiyelini değerlendiriyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a viral content analyst and engagement expert. You evaluate viral potential of content. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `Şu içeriğin ${platform || 'Instagram'} platformunda viral potansiyelini değerlendir:

"${content}"

${niche ? 'Niş: ' + niche : ''}

JSON formatında yanıt ver:
{
  "viralScore": {
    "score": 75,
    "potential": "yüksek/orta/düşük",
    "factors": {
      "hook": {"score": 8, "comment": "yorum"},
      "emotion": {"score": 7, "comment": "yorum"},
      "shareability": {"score": 8, "comment": "yorum"},
      "timing": {"score": 6, "comment": "yorum"}
    },
    "strengths": ["güçlü yön 1", "güçlü yön 2"],
    "improvements": ["iyileştirme 1", "iyileştirme 2"],
    "prediction": "tahmini performans açıklaması"
  }
}

Sadece JSON döndür.`
      : `Evaluate the viral potential of this content on ${platform || 'Instagram'}:

"${content}"

${niche ? 'Niche: ' + niche : ''}

Respond in JSON format:
{
  "viralScore": {
    "score": 75,
    "potential": "high/medium/low",
    "factors": {
      "hook": {"score": 8, "comment": "comment"},
      "emotion": {"score": 7, "comment": "comment"},
      "shareability": {"score": 8, "comment": "comment"},
      "timing": {"score": 6, "comment": "comment"}
    },
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "prediction": "predicted performance description"
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
    console.error('Viral Score Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
