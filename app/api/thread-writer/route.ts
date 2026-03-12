import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callGroqAI, parseJSONResponse, checkCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 4

export async function POST(request: NextRequest) {
  try {
    const { topic, tweetCount, style, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Konu gerekli' : 'Topic is required' },
        { status: 400 }
      )
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const count = tweetCount || 7

    const systemPrompt = language === 'tr'
      ? `Sen X/Twitter thread yazarısın. Her tweet max 280 karakter. Viral thread'ler yazıyorsun. Sadece JSON formatında yanıt ver.`
      : `You are an X/Twitter thread writer. Each tweet max 280 characters. You write viral threads. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için ${count} tweetlik ${style || 'bilgilendirici'} bir thread yaz.

JSON formatında yanıt ver:
{
  "thread": [
    {"id": 1, "tweet": "tweet metni (max 280 karakter)", "type": "hook"},
    {"id": 2, "tweet": "tweet metni", "type": "content"},
    {"id": ${count}, "tweet": "son tweet", "type": "cta"}
  ]
}

Sadece JSON döndür.`
      : `Write a ${count}-tweet ${style || 'informative'} thread about "${topic}".

Respond in JSON format:
{
  "thread": [
    {"id": 1, "tweet": "tweet text (max 280 chars)", "type": "hook"},
    {"id": 2, "tweet": "tweet text", "type": "content"},
    {"id": ${count}, "tweet": "final tweet", "type": "cta"}
  ]
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.85,
      maxTokens: 2500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json({ thread: parsed.thread || parsed })

  } catch (error: any) {
    console.error('Thread Writer Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
