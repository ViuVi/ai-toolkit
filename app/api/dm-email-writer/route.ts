import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJSONWithGroq, checkAndDeductCredits } from '@/lib/groq'

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
        { error: language === 'tr' ? 'Amaç gerekli' : 'Purpose required' },
        { status: 400 }
      )
    }

    if (userId) {
      const creditCheck = await checkAndDeductCredits(supabase, userId, CREDIT_COST, language)
      if (!creditCheck.success) {
        return NextResponse.json({ error: creditCheck.error }, { status: 403 })
      }
    }

    const typeInfo = type || 'dm'
    const recipientInfo = recipient || (language === 'tr' ? 'potansiyel müşteri' : 'potential client')

    const systemPrompt = language === 'tr'
      ? `Sen profesyonel iletişim uzmanısın.
         İkna edici, samimi ve profesyonel mesajlar yazıyorsun.
         Her mesaj amacına uygun ve alıcıya özel olmalı.`
      : `You are a professional communication expert.
         You write persuasive, friendly, and professional messages.
         Each message should be purpose-appropriate and personalized.`

    const userPrompt = language === 'tr'
      ? `${recipientInfo} için "${purpose}" amacıyla ${typeInfo === 'email' ? 'e-posta' : 'DM'} yaz.

${context ? `Ek bağlam: ${context}` : ''}

3 farklı versiyon yaz:
1. Kısa ve öz
2. Orta uzunlukta, detaylı
3. Resmi ve profesyonel

JSON formatında yanıt ver:
{
  "messages": [
    {
      "version": "kısa",
      "subject": "${typeInfo === 'email' ? 'e-posta konusu' : ''}",
      "text": "mesaj metni",
      "tone": "ton açıklaması",
      "cta": "call-to-action"
    }
  ],
  "tips": ["ipucu 1", "ipucu 2"],
  "best_time_to_send": "gönderim için en iyi zaman"
}`
      : `Write a ${typeInfo === 'email' ? 'email' : 'DM'} for ${recipientInfo} with purpose: "${purpose}".

${context ? `Additional context: ${context}` : ''}

Write 3 different versions:
1. Short and concise
2. Medium length, detailed
3. Formal and professional

Respond in JSON format:
{
  "messages": [
    {
      "version": "short",
      "subject": "${typeInfo === 'email' ? 'email subject' : ''}",
      "text": "message text",
      "tone": "tone description",
      "cta": "call-to-action"
    }
  ],
  "tips": ["tip 1", "tip 2"],
  "best_time_to_send": "best time to send"
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.75,
      maxTokens: 2000
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('DM/Email Writer Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
