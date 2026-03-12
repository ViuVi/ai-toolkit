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
    const { text, style, length, userId, language = 'en' } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Metin gerekli' : 'Text is required' },
        { status: 400 }
      )
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const systemPrompt = language === 'tr'
      ? `Sen metin özetleme uzmanısın. Ana fikirleri koruyarak özet yazıyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a text summarization expert. You write summaries preserving main ideas. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `Şu metni ${style || 'profesyonel'} tarzda, ${length || 'orta'} uzunlukta özetle:

"${text}"

JSON formatında yanıt ver:
{
  "summary": {
    "short": "1-2 cümlelik özet",
    "medium": "paragraf özet",
    "bullets": ["madde 1", "madde 2", "madde 3"],
    "wordCount": 50
  }
}

Sadece JSON döndür.`
      : `Summarize this text in ${style || 'professional'} style, ${length || 'medium'} length:

"${text}"

Respond in JSON format:
{
  "summary": {
    "short": "1-2 sentence summary",
    "medium": "paragraph summary",
    "bullets": ["point 1", "point 2", "point 3"],
    "wordCount": 50
  }
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.5,
      maxTokens: 1500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json({ summary: parsed.summary || parsed })

  } catch (error: any) {
    console.error('Summarize Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
