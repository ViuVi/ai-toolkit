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
    const body = await request.json()
    const { topic, platform, hookType, count, userId, language = 'en' } = body

    // Validasyon
    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Konu gerekli' : 'Topic is required' },
        { status: 400 }
      )
    }

    // Kredi kontrolü
    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    // AI'ya gönderilecek prompt
    const systemPrompt = language === 'tr'
      ? `Sen viral içerik uzmanısın. Dikkat çekici hook'lar (açılış cümleleri) yazıyorsun. Yanıtını sadece JSON formatında ver.`
      : `You are a viral content expert. You write attention-grabbing hooks. Respond only in JSON format.`

    const hookCount = count || 5
    
    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için ${platform || 'sosyal medya'} platformunda ${hookCount} adet ${hookType || 'çeşitli'} tarzında hook yaz.

JSON formatında yanıt ver:
{
  "hooks": [
    {"id": 1, "hook": "hook metni buraya"},
    {"id": 2, "hook": "hook metni buraya"}
  ]
}

Sadece JSON döndür, başka bir şey yazma.`
      : `Write ${hookCount} ${hookType || 'various'} style hooks for "${topic}" on ${platform || 'social media'} platform.

Respond in JSON format:
{
  "hooks": [
    {"id": 1, "hook": "hook text here"},
    {"id": 2, "hook": "hook text here"}
  ]
}

Return only JSON, nothing else.`

    // AI çağrısı
    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.9,
      maxTokens: 1500
    })

    console.log('Hook Generator - AI responded')

    // JSON parse
    const parsed = parseJSONResponse(aiResponse)
    
    // hooks array'ini döndür
    let hooks = parsed.hooks || parsed
    
    // Eğer hooks array değilse, array yap
    if (!Array.isArray(hooks)) {
      console.log('Hooks is not array, wrapping:', typeof hooks)
      hooks = [hooks]
    }

    console.log('Returning hooks count:', hooks.length)
    
    return NextResponse.json({ hooks })

  } catch (error: any) {
    console.error('Hook Generator Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
