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
    const { topic, platform, duration, style, userId, language = 'en' } = await request.json()

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

    const systemPrompt = language === 'tr'
      ? `Sen video script yazarısın. Viral video scriptleri yazıyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a video script writer. You write viral video scripts. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için ${platform || 'YouTube'} platformunda ${duration || '60 saniye'} süreli ${style || 'eğitici'} bir video scripti yaz.

JSON formatında yanıt ver:
{
  "script": {
    "title": "video başlığı",
    "hook": "ilk 3 saniye - dikkat çekici açılış",
    "intro": "giriş bölümü",
    "mainPoints": [
      {"point": "ana nokta 1", "content": "içerik"},
      {"point": "ana nokta 2", "content": "içerik"}
    ],
    "conclusion": "sonuç",
    "cta": "call to action",
    "duration": "${duration || '60 saniye'}"
  }
}

Sadece JSON döndür.`
      : `Write a ${style || 'educational'} video script for "${topic}" on ${platform || 'YouTube'} platform, ${duration || '60 seconds'} long.

Respond in JSON format:
{
  "script": {
    "title": "video title",
    "hook": "first 3 seconds - attention grabbing opening",
    "intro": "introduction section",
    "mainPoints": [
      {"point": "main point 1", "content": "content"},
      {"point": "main point 2", "content": "content"}
    ],
    "conclusion": "conclusion",
    "cta": "call to action",
    "duration": "${duration || '60 seconds'}"
  }
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 2500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json({ script: parsed.script || parsed })

  } catch (error: any) {
    console.error('Video Script Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
