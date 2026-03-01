import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, includeEmojis, includeHashtags, contentType, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: language === 'tr' ? 'Konu gerekli' : 'Topic required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const platformLimits: Record<string, number> = { instagram: 2200, tiktok: 300, twitter: 280, linkedin: 3000, facebook: 500 }
    const maxChars = platformLimits[platform] || 500

    const toneGuide: Record<string, Record<string, string>> = {
      professional: { tr: 'profesyonel, güvenilir, otoriter ama samimi', en: 'professional, trustworthy, authoritative yet approachable' },
      casual: { tr: 'samimi, arkadaşça, doğal ve rahat', en: 'casual, friendly, natural and relaxed' },
      humorous: { tr: 'eğlenceli, espritüel, zeki ve eğlendirici', en: 'funny, witty, clever and entertaining' },
      inspirational: { tr: 'ilham verici, motive edici, güçlendirici', en: 'inspiring, motivating, empowering' }
    }

    const platformName = { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook' }[platform]
    const toneDesc = toneGuide[tone]?.[language === 'tr' ? 'tr' : 'en'] || toneGuide.casual.en

    const prompt = language === 'tr'
      ? `Sen viral sosyal medya içerik yazarısın. ${platformName} için 3 profesyonel caption yaz.

KONU: ${topic}
TON: ${toneDesc}
KARAKTER LİMİTİ: ${maxChars}
${contentType ? `İÇERİK TİPİ: ${contentType}` : ''}

KURALLAR:
1. Her caption benzersiz ve yaratıcı olsun
2. Dikkat çekici hook ile başla
3. Değer kat veya duygu uyandır
4. ${includeEmojis ? 'Uygun emojiler kullan (2-4 adet)' : 'Emoji kullanma'}
5. ${includeHashtags ? 'Sona 3-5 alakalı hashtag ekle' : 'Hashtag ekleme'}
6. Net CTA (eylem çağrısı) ekle
7. ${platform === 'linkedin' ? 'Profesyonel ve iş odaklı ol' : platform === 'tiktok' ? 'Kısa, vurucu ve trend odaklı ol' : 'Platforma uygun ol'}

JSON formatında yanıt ver:
{
  "captions": [
    {"id": 1, "caption": "caption metni", "hookType": "kullanılan hook", "cta": "CTA tipi"},
    {"id": 2, "caption": "caption metni", "hookType": "kullanılan hook", "cta": "CTA tipi"},
    {"id": 3, "caption": "caption metni", "hookType": "kullanılan hook", "cta": "CTA tipi"}
  ]
}`
      : `You are a viral social media content writer. Write 3 professional captions for ${platformName}.

TOPIC: ${topic}
TONE: ${toneDesc}
CHARACTER LIMIT: ${maxChars}
${contentType ? `CONTENT TYPE: ${contentType}` : ''}

RULES:
1. Each caption must be unique and creative
2. Start with attention-grabbing hook
3. Add value or evoke emotion
4. ${includeEmojis ? 'Use appropriate emojis (2-4)' : 'No emojis'}
5. ${includeHashtags ? 'Add 3-5 relevant hashtags at end' : 'No hashtags'}
6. Include clear CTA
7. ${platform === 'linkedin' ? 'Be professional and business-focused' : platform === 'tiktok' ? 'Be short, punchy and trend-focused' : 'Be platform-appropriate'}

Respond in JSON:
{
  "captions": [
    {"id": 1, "caption": "caption text", "hookType": "hook used", "cta": "CTA type"},
    {"id": 2, "caption": "caption text", "hookType": "hook used", "cta": "CTA type"},
    {"id": 3, "caption": "caption text", "hookType": "hook used", "cta": "CTA type"}
  ]
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1500, temperature: 0.8, return_full_text: false } })
    })

    let captions: any[] = []
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          captions = parsed.captions?.map((c: any) => ({ ...c, characterCount: c.caption?.length || 0 })) || []
        } catch {}
      }
    }

    // Fallback
    if (captions.length === 0) {
      const emoji = includeEmojis ? '✨ ' : ''
      const hashtags = includeHashtags ? '\n\n#' + topic.split(' ')[0].toLowerCase() + ' #content #viral' : ''
      captions = [
        { id: 1, caption: `${emoji}${language === 'tr' ? 'Dur ve bunu oku' : 'Stop and read this'}.\n\n${topic}${language === 'tr' ? ' hakkında bilmeniz gereken tek şey bu.' : ' - this is all you need to know.'}\n\n${language === 'tr' ? 'Kaydet ve sonra bana teşekkür et' : 'Save this and thank me later'}.${hashtags}`, hookType: "Pattern interrupt", cta: "Save", characterCount: 0 },
        { id: 2, caption: `${emoji}${language === 'tr' ? 'Çoğu kişi bunu yanlış yapıyor' : 'Most people get this wrong'}:\n\n${topic}\n\n${language === 'tr' ? 'İşte doğrusu' : "Here's the truth"}...\n\n${language === 'tr' ? 'Katılıyor musun? Yorumlarda söyle' : 'Agree? Tell me in comments'}.${hashtags}`, hookType: "Controversy", cta: "Comment", characterCount: 0 },
        { id: 3, caption: `${emoji}${language === 'tr' ? '3 ay önce' : '3 months ago'}, ${topic} ${language === 'tr' ? 'hakkında hiçbir şey bilmiyordum' : 'was a mystery to me'}.\n\n${language === 'tr' ? 'Şimdi? Her şey değişti' : "Now? Everything changed"}.\n\n${language === 'tr' ? 'Nasıl mı? Takip et ve öğren' : 'How? Follow to learn'}.${hashtags}`, hookType: "Transformation", cta: "Follow", characterCount: 0 }
      ].map(c => ({ ...c, characterCount: c.caption.length }))
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
