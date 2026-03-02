import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

export async function POST(request: NextRequest) {
  try {
    const { purpose, recipient, context, tone, messageType, userId, language = 'en' } = await request.json()

    if (!purpose) {
      return NextResponse.json({ error: language === 'tr' ? 'Amaç gerekli' : 'Purpose required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const purposeGuide: Record<string, Record<string, string>> = {
      collaboration: { tr: 'işbirliği/sponsorluk teklifi', en: 'collaboration/sponsorship proposal' },
      networking: { tr: 'profesyonel networking ve tanışma', en: 'professional networking and introduction' },
      customer: { tr: 'müşteri hizmetleri yanıtı', en: 'customer service response' },
      sales: { tr: 'ürün/hizmet tanıtımı', en: 'product/service pitch' },
      followup: { tr: 'takip mesajı', en: 'follow-up message' },
      thankyou: { tr: 'teşekkür mesajı', en: 'thank you message' }
    }

    const toneGuide: Record<string, Record<string, string>> = {
      professional: { tr: 'profesyonel ve resmi', en: 'professional and formal' },
      friendly: { tr: 'samimi ama profesyonel', en: 'friendly but professional' },
      casual: { tr: 'rahat ve doğal', en: 'casual and natural' }
    }

    const purposeDesc = purposeGuide[purpose]?.[language === 'tr' ? 'tr' : 'en'] || purpose
    const toneDesc = toneGuide[tone]?.[language === 'tr' ? 'tr' : 'en'] || toneGuide.professional[language === 'tr' ? 'tr' : 'en']
    const seed = Date.now()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] Sen profesyonel iletişim uzmanısın. Aşağıdaki amaç için 2 FARKLI ${messageType === 'email' ? 'e-posta' : 'DM mesajı'} yaz.

AMAÇ: ${purposeDesc}
ALICI: ${recipient || 'Belirtilmedi'}
${context ? `EK BİLGİ: ${context}` : ''}
TON: ${toneDesc}
TİP: ${messageType === 'email' ? 'E-posta' : 'DM/Direkt Mesaj'}

KURALLAR:
1. Her mesaj TAMAMEN FARKLI yaklaşımla yazılsın
2. ${messageType === 'email' ? 'E-posta için konu satırı ekle' : 'DM için kısa ve öz ol'}
3. Profesyonel ama samimi ol
4. Net bir CTA (eylem çağrısı) ekle
5. Spam veya satışçı görünme
6. Kişiselleştirilmiş hissettir

JSON formatında yanıt ver:
{
  "messages": [
    {
      "id": 1,
      ${messageType === 'email' ? '"subject": "e-posta konu satırı",' : ''}
      "message": "mesaj içeriği",
      "approach": "kullanılan yaklaşım"
    },
    {
      "id": 2,
      ${messageType === 'email' ? '"subject": "e-posta konu satırı",' : ''}
      "message": "mesaj içeriği",
      "approach": "kullanılan yaklaşım"
    }
  ]
}`
      : `[SEED:${seed}] You are a professional communication expert. Write 2 DIFFERENT ${messageType === 'email' ? 'emails' : 'DM messages'} for the following purpose.

PURPOSE: ${purposeDesc}
RECIPIENT: ${recipient || 'Not specified'}
${context ? `ADDITIONAL INFO: ${context}` : ''}
TONE: ${toneDesc}
TYPE: ${messageType === 'email' ? 'Email' : 'DM/Direct Message'}

RULES:
1. Each message must use a COMPLETELY DIFFERENT approach
2. ${messageType === 'email' ? 'Include a subject line for email' : 'Keep DM short and concise'}
3. Be professional but personable
4. Include a clear CTA (call to action)
5. Don't sound spammy or salesy
6. Make it feel personalized

Respond in JSON format:
{
  "messages": [
    {
      "id": 1,
      ${messageType === 'email' ? '"subject": "email subject line",' : ''}
      "message": "message content",
      "approach": "approach used"
    },
    {
      "id": 2,
      ${messageType === 'email' ? '"subject": "email subject line",' : ''}
      "message": "message content",
      "approach": "approach used"
    }
  ]
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1200, temperature: 0.85, top_p: 0.95, return_full_text: false } })
    })

    let messages: { id: number; subject?: string; message: string; approach: string }[] = []
    
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          messages = parsed.messages || []
        } catch (e) { console.error('Parse error:', e) }
      }
    }

    // Fallback
    if (messages.length === 0) {
      if (messageType === 'email') {
        messages = language === 'tr' ? [
          { id: 1, subject: "İşbirliği Fırsatı - Birlikte Harika İşler Yapabiliriz", message: "Merhaba,\n\nSizin çalışmalarınızı takip ediyorum ve gerçekten etkileyici buluyorum. Birlikte çalışabileceğimiz bir proje fikrim var.\n\nMüsait olduğunuzda kısa bir görüşme yapabilir miyiz?\n\nSaygılarımla", approach: "Direkt ve Profesyonel" },
          { id: 2, subject: "Hızlı bir soru - 2 dakikanızı alabilir miyim?", message: "Merhaba,\n\nKısa tutacağım: Sizinle işbirliği yapmak istiyorum.\n\nNeden mi? Çünkü hedef kitlemiz örtüşüyor ve birlikte daha güçlü olabiliriz.\n\nİlgilenirseniz detayları paylaşayım.\n\nİyi çalışmalar", approach: "Kısa ve Merak Uyandırıcı" }
        ] : [
          { id: 1, subject: "Collaboration Opportunity - Let's Create Something Great Together", message: "Hi,\n\nI've been following your work and I'm genuinely impressed. I have a project idea where we could collaborate.\n\nWould you be available for a quick chat?\n\nBest regards", approach: "Direct and Professional" },
          { id: 2, subject: "Quick question - Can I steal 2 minutes of your time?", message: "Hey,\n\nI'll keep this short: I want to collaborate with you.\n\nWhy? Because our audiences overlap and together we could be stronger.\n\nInterested? Let me share the details.\n\nCheers", approach: "Short and Intriguing" }
        ]
      } else {
        messages = language === 'tr' ? [
          { id: 1, message: "Merhaba! 👋 Sizin içeriklerinizi çok beğeniyorum. Birlikte çalışabileceğimiz bir fikrim var. İlgilenir misiniz?", approach: "Direkt ve Samimi" },
          { id: 2, message: "Selam! Profilinizi inceledim ve gerçekten etkilendim. Sizinle bir işbirliği konuşmak isterim. Uygun musunuz? 🤝", approach: "Övgü ile Başlayan" }
        ] : [
          { id: 1, message: "Hey! 👋 I really love your content. I have an idea for a collaboration. Would you be interested?", approach: "Direct and Friendly" },
          { id: 2, message: "Hi! I checked out your profile and I'm genuinely impressed. Would love to chat about a potential collab. Are you available? 🤝", approach: "Compliment Opener" }
        ]
      }
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2 }).eq('user_id', userId)
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('DM Email Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
