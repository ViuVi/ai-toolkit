import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

const styleGuide: Record<string, Record<string, string>> = {
  question: { tr: 'Soru sorarak merak uyandır, izleyiciyi düşündür', en: 'Create curiosity with questions, make viewer think' },
  shocking: { tr: 'Şok edici ve dikkat çekici açılış', en: 'Shocking and attention-grabbing opening' },
  storytelling: { tr: 'Hikaye anlatımı ile duygusal bağ kur', en: 'Connect emotionally through storytelling' }
}

const platformGuide: Record<string, Record<string, string>> = {
  tiktok: { tr: 'Kısa, enerjik, trend odaklı, hızlı geçişler', en: 'Short, energetic, trend-focused, quick transitions' },
  youtube: { tr: 'Detaylı, bilgilendirici, değer odaklı', en: 'Detailed, informative, value-focused' },
  instagram: { tr: 'Görsel odaklı, estetik, kısa ve öz', en: 'Visual-focused, aesthetic, short and concise' }
}

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration, style, userId, language = 'en' } = await request.json()

    if (!topic || !platform) {
      return NextResponse.json({ error: language === 'tr' ? 'Konu ve platform gerekli' : 'Topic and platform required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 4) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const styleDesc = styleGuide[style]?.[language === 'tr' ? 'tr' : 'en'] || styleGuide.question.en
    const platformDesc = platformGuide[platform]?.[language === 'tr' ? 'tr' : 'en'] || platformGuide.tiktok.en
    const seed = Date.now()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] Sen profesyonel bir video script yazarısın. "${topic}" konusu için ${platform} platformunda ${duration} saniyelik bir video scripti yaz.

PLATFORM TARZI: ${platformDesc}
HOOK STİLİ: ${styleDesc}

ZORUNLU FORMAT:
1. HOOK (0:00-0:03): İlk 3 saniyede izleyiciyi yakala. Güçlü, merak uyandırıcı bir açılış.
2. ANA İÇERİK (0:03-${duration === '30' ? '0:22' : duration === '60' ? '0:50' : '2:40'}): Ana mesajı akıcı bir şekilde anlat. Madde madde değil, doğal konuşma gibi.
3. CTA (son 8 saniye): Güçlü bir eylem çağrısı ile bitir.

KURALLAR:
- Samimi ve doğal konuşma dili kullan
- Klişelerden kaçın, özgün ol
- Her cümle değer katsın
- Platform için uygun uzunlukta tut

JSON formatında yanıt ver:
{
  "sections": [
    {"timestamp": "0:00", "title": "Hook", "content": "hook metni"},
    {"timestamp": "0:03", "title": "Ana İçerik", "content": "ana içerik metni"},
    {"timestamp": "${duration === '30' ? '0:22' : duration === '60' ? '0:50' : '2:40'}", "title": "CTA", "content": "kapanış metni"}
  ]
}`
      : `[SEED:${seed}] You are a professional video script writer. Write a ${duration}-second video script for ${platform} about "${topic}".

PLATFORM STYLE: ${platformDesc}
HOOK STYLE: ${styleDesc}

REQUIRED FORMAT:
1. HOOK (0:00-0:03): Capture viewer in first 3 seconds. Strong, curiosity-inducing opening.
2. MAIN CONTENT (0:03-${duration === '30' ? '0:22' : duration === '60' ? '0:50' : '2:40'}): Deliver main message in flowing narrative. Not bullet points, natural speech.
3. CTA (last 8 seconds): End with strong call to action.

RULES:
- Use friendly, natural conversational tone
- Avoid clichés, be original
- Every sentence should add value
- Keep appropriate length for platform

Respond in JSON format:
{
  "sections": [
    {"timestamp": "0:00", "title": "Hook", "content": "hook text"},
    {"timestamp": "0:03", "title": "Main Content", "content": "main content text"},
    {"timestamp": "${duration === '30' ? '0:22' : duration === '60' ? '0:50' : '2:40'}", "title": "CTA", "content": "closing text"}
  ]
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1500, temperature: 0.85, top_p: 0.9, return_full_text: false } })
    })

    let script: any = null
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try { script = JSON.parse(match[0]) } catch (e) { console.error('Parse error:', e) }
      }
    }

    if (!script || !script.sections || script.sections.length < 2) {
      script = {
        sections: language === 'tr' ? [
          { timestamp: "0:00", title: "Hook", content: `${topic} hakkında bilmediğiniz bir şey söyleyeceğim...` },
          { timestamp: "0:03", title: "Ana İçerik", content: `${topic} konusunda çoğu kişi bunu atlıyor. Ama aslında en önemli nokta şu: Temel prensipleri anlamadan ilerlemeye çalışmak, temelsiz bir bina inşa etmek gibi. Size tam olarak nasıl yapmanız gerektiğini göstereceğim.` },
          { timestamp: duration === '30' ? "0:22" : "0:50", title: "CTA", content: "Videoyu kaydedin ve daha fazlası için takipte kalın!" }
        ] : [
          { timestamp: "0:00", title: "Hook", content: `I'm going to tell you something about ${topic} you didn't know...` },
          { timestamp: "0:03", title: "Main Content", content: `Most people skip this when it comes to ${topic}. But the most important thing is: trying to progress without understanding the basics is like building a house without a foundation. Let me show you exactly how to do it right.` },
          { timestamp: duration === '30' ? "0:22" : "0:50", title: "CTA", content: "Save this video and follow for more!" }
        ]
      }
    }

    const totalWords = script.sections.reduce((acc: number, s: any) => acc + (s.content?.split(' ').length || 0), 0)
    script.topic = topic
    script.platform = platform
    script.duration = `${duration}s`
    script.style = style
    script.totalWords = totalWords
    script.estimatedReadingTime = `${Math.ceil(totalWords / 150)} min`

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 4, total_used: c.total_used + 4 }).eq('user_id', userId)
    }

    return NextResponse.json({ script })
  } catch (error) {
    console.error('Video Script Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
