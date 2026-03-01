import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

const platformLimits: Record<string, number> = { instagram: 2200, tiktok: 300, twitter: 280, linkedin: 3000, facebook: 500 }
const platformNames: Record<string, string> = { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook' }

const toneGuide: Record<string, Record<string, string>> = {
  professional: { tr: 'profesyonel, güvenilir ve otoriter ama samimi', en: 'professional, trustworthy, authoritative yet approachable' },
  casual: { tr: 'samimi, arkadaşça, doğal ve rahat', en: 'casual, friendly, natural and relaxed' },
  humorous: { tr: 'eğlenceli, espritüel ve eğlendirici', en: 'funny, witty and entertaining' },
  inspirational: { tr: 'ilham verici, motive edici ve güçlendirici', en: 'inspiring, motivating and empowering' }
}

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, includeEmojis, includeHashtags, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: language === 'tr' ? 'Konu gerekli' : 'Topic required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const maxChars = platformLimits[platform] || 500
    const platformName = platformNames[platform] || 'Instagram'
    const toneDesc = toneGuide[tone]?.[language === 'tr' ? 'tr' : 'en'] || toneGuide.casual.en

    // Benzersiz ve özgün içerik için rastgele seed
    const seed = Date.now() + Math.random()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] Sen dünyaca ünlü bir sosyal medya içerik yazarısın. Her caption benzersiz, yaratıcı ve viral olmalı.

GÖREV: "${topic}" konusu için ${platformName} platformunda 3 TAMAMEN FARKLI ve ÖZGÜn caption yaz.

PLATFORM: ${platformName}
TON: ${toneDesc}
KARAKTER LİMİTİ: ${maxChars}

ZORUNLU KURALLAR:
1. Her caption TAMAMEN FARKLI bir yaklaşımla yazılmalı (farklı hook, farklı yapı, farklı CTA)
2. İlk caption: Soru veya şok edici bir ifadeyle başla
3. İkinci caption: Kişisel hikaye veya deneyimle başla  
4. Üçüncü caption: Liste veya adım adım formatında yaz
5. ${includeEmojis ? 'Her caption\'a 2-4 uygun emoji ekle, başına ve sonuna yerleştir' : 'Emoji KULLANMA'}
6. ${includeHashtags ? 'Her caption sonuna 3-5 alakalı ve trending hashtag ekle' : 'Hashtag EKLEME'}
7. Her caption\'da güçlü bir CTA (yorum, kaydet, paylaş, takip et) olsun
8. Klişe ve sıkıcı ifadelerden KAÇIN, özgün ve akılda kalıcı ol

JSON formatında yanıt ver:
{
  "captions": [
    {"id": 1, "caption": "birinci caption (soru/şok hook)", "hookType": "Question/Shock", "cta": "kullanılan CTA"},
    {"id": 2, "caption": "ikinci caption (hikaye hook)", "hookType": "Story/Personal", "cta": "kullanılan CTA"},
    {"id": 3, "caption": "üçüncü caption (liste format)", "hookType": "List/Steps", "cta": "kullanılan CTA"}
  ]
}`
      : `[SEED:${seed}] You are a world-renowned social media content writer. Every caption must be unique, creative, and viral-worthy.

TASK: Write 3 COMPLETELY DIFFERENT and UNIQUE captions about "${topic}" for ${platformName}.

PLATFORM: ${platformName}
TONE: ${toneDesc}
CHARACTER LIMIT: ${maxChars}

MANDATORY RULES:
1. Each caption must use a COMPLETELY DIFFERENT approach (different hook, structure, CTA)
2. First caption: Start with a question or shocking statement
3. Second caption: Start with a personal story or experience
4. Third caption: Use list or step-by-step format
5. ${includeEmojis ? 'Add 2-4 relevant emojis to each caption, place at beginning and end' : 'DO NOT use emojis'}
6. ${includeHashtags ? 'Add 3-5 relevant trending hashtags at the end of each caption' : 'DO NOT add hashtags'}
7. Include a strong CTA (comment, save, share, follow) in each caption
8. AVOID clichés and boring phrases, be original and memorable

Respond in JSON format:
{
  "captions": [
    {"id": 1, "caption": "first caption (question/shock hook)", "hookType": "Question/Shock", "cta": "CTA used"},
    {"id": 2, "caption": "second caption (story hook)", "hookType": "Story/Personal", "cta": "CTA used"},
    {"id": 3, "caption": "third caption (list format)", "hookType": "List/Steps", "cta": "CTA used"}
  ]
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 2000, temperature: 0.9, top_p: 0.95, return_full_text: false } })
    })

    let captions: { id: number; caption: string; hookType: string; cta: string; characterCount: number }[] = []
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          captions = parsed.captions?.map((c: { id: number; caption: string; hookType: string; cta: string }) => ({ ...c, characterCount: c.caption?.length || 0 })) || []
        } catch (e) {
          console.error('Parse error:', e)
        }
      }
    }

    // Fallback with unique variations
    if (captions.length === 0) {
      const emoji = includeEmojis ? '✨' : ''
      const emoji2 = includeEmojis ? '🔥' : ''
      const emoji3 = includeEmojis ? '💡' : ''
      const topicWord = topic.split(' ')[0].toLowerCase()
      const hashtags = includeHashtags ? `\n\n#${topicWord} #viral #trending #fyp #content` : ''
      
      captions = language === 'tr' ? [
        { id: 1, caption: `${emoji} "${topic}" hakkında bilmediğiniz şok edici gerçek:\n\nÇoğu kişi bunu tamamen yanlış anlıyor.\n\nGerçek şu ki...\n\nSen ne düşünüyorsun? Yorumlarda tartışalım ${emoji2}${hashtags}`, hookType: "Şok/Soru", cta: "Yorum", characterCount: 0 },
        { id: 2, caption: `${emoji2} 6 ay önce ${topic} konusunda sıfırdım.\n\nBugün? Tamamen farklı biriyim.\n\nBu yolculukta öğrendiğim en önemli şey:\n\n"Başlamak için mükemmel zamanı bekleme, şimdi başla."\n\nKaydet ve hatırla ${emoji}${hashtags}`, hookType: "Hikaye", cta: "Kaydet", characterCount: 0 },
        { id: 3, caption: `${emoji3} ${topic} için 3 altın kural:\n\n1️⃣ Tutarlı ol\n2️⃣ Değer kat\n3️⃣ Özgün kal\n\nBu kuralları uygula, farkı gör.\n\nHangisi senin için en zor? ${emoji}${hashtags}`, hookType: "Liste", cta: "Etkileşim", characterCount: 0 }
      ] : [
        { id: 1, caption: `${emoji} The shocking truth about "${topic}" nobody talks about:\n\nMost people get this completely wrong.\n\nHere's the reality...\n\nWhat do you think? Let's discuss in comments ${emoji2}${hashtags}`, hookType: "Shock/Question", cta: "Comment", characterCount: 0 },
        { id: 2, caption: `${emoji2} 6 months ago, I knew nothing about ${topic}.\n\nToday? I'm a completely different person.\n\nThe most important lesson from this journey:\n\n"Don't wait for the perfect moment, start now."\n\nSave this for later ${emoji}${hashtags}`, hookType: "Story", cta: "Save", characterCount: 0 },
        { id: 3, caption: `${emoji3} 3 golden rules for ${topic}:\n\n1️⃣ Be consistent\n2️⃣ Add value\n3️⃣ Stay authentic\n\nApply these rules, see the difference.\n\nWhich one is hardest for you? ${emoji}${hashtags}`, hookType: "List", cta: "Engage", characterCount: 0 }
      ]
      captions = captions.map(c => ({ ...c, characterCount: c.caption.length }))
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2 }).eq('user_id', userId)
    }

    return NextResponse.json({ captions })
  } catch (error) {
    console.error('Caption Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
