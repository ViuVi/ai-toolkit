import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callGroqAI, parseJSONResponse, checkCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 2

export async function POST(request: NextRequest) {
  try {
    const { text, userId, language = 'en' } = await request.json()

    if (!text) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Metin gerekli' : 'Text required' 
      }, { status: 400 })
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const systemPrompt = language === 'tr'
      ? `Sen duygu analizi uzmanısın. Metinlerin duygusal tonunu analiz ediyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a sentiment analysis expert. You analyze emotional tone of texts. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `Şu metnin duygu analizini yap:

"${text}"

JSON formatında yanıt ver:
{
  "sentiment": {
    "overall": "pozitif/negatif/nötr",
    "score": 0.75,
    "emotions": [
      {"emotion": "mutluluk", "intensity": 0.8},
      {"emotion": "heyecan", "intensity": 0.6}
    ],
    "keywords": ["anahtar kelime 1", "anahtar kelime 2"],
    "summary": "kısa özet"
  }
}

Sadece JSON döndür.`
      : `Analyze the sentiment of this text:

"${text}"

Respond in JSON format:
{
  "sentiment": {
    "overall": "positive/negative/neutral",
    "score": 0.75,
    "emotions": [
      {"emotion": "happiness", "intensity": 0.8},
      {"emotion": "excitement", "intensity": 0.6}
    ],
    "keywords": ["keyword 1", "keyword 2"],
    "summary": "brief summary"
  }
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.5,
      maxTokens: 1000
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Sentiment Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
