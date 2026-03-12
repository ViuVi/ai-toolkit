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
    const { purpose, recipient, context, type, userId, language = 'en' } = await request.json()

    if (!purpose) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Amaç gerekli' : 'Purpose is required' },
        { status: 400 }
      )
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const messageType = type || 'dm'

    const systemPrompt = language === 'tr'
      ? `Sen profesyonel iletişim uzmanısın. İkna edici mesajlar yazıyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a professional communication expert. You write persuasive messages. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `${recipient || 'alıcı'} için "${purpose}" amacıyla ${messageType === 'email' ? 'e-posta' : 'DM'} yaz.
${context ? 'Bağlam: ' + context : ''}

JSON formatında yanıt ver:
{
  "messages": [
    {"id": 1, "version": "kısa", "subject": "${messageType === 'email' ? 'konu' : ''}", "text": "mesaj", "tone": "profesyonel"},
    {"id": 2, "version": "detaylı", "subject": "${messageType === 'email' ? 'konu' : ''}", "text": "mesaj", "tone": "samimi"}
  ]
}

Sadece JSON döndür.`
      : `Write a ${messageType === 'email' ? 'email' : 'DM'} for ${recipient || 'recipient'} with purpose: "${purpose}".
${context ? 'Context: ' + context : ''}

Respond in JSON format:
{
  "messages": [
    {"id": 1, "version": "short", "subject": "${messageType === 'email' ? 'subject' : ''}", "text": "message", "tone": "professional"},
    {"id": 2, "version": "detailed", "subject": "${messageType === 'email' ? 'subject' : ''}", "text": "message", "tone": "friendly"}
  ]
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.75,
      maxTokens: 1500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json({ messages: parsed.messages || parsed })

  } catch (error: any) {
    console.error('DM Email Writer Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
