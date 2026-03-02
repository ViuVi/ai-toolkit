import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

const platformRules: Record<string, Record<string, string>> = {
  instagram: { tr: 'görsel odaklı, 2200 karakter, 30 hashtag, emoji kullan, estetik', en: 'visual-focused, 2200 chars, 30 hashtags, use emojis, aesthetic' },
  tiktok: { tr: 'kısa ve enerjik, 300 karakter, trend hashtag, genç dil', en: 'short and energetic, 300 chars, trending hashtags, young language' },
  twitter: { tr: 'özlü ve net, 280 karakter, 2-3 hashtag, direkt mesaj', en: 'concise and clear, 280 chars, 2-3 hashtags, direct message' },
  linkedin: { tr: 'profesyonel, 3000 karakter, iş odaklı, değer kat', en: 'professional, 3000 chars, business-focused, add value' },
  youtube: { tr: 'açıklayıcı, SEO odaklı, anahtar kelimeler, CTA', en: 'descriptive, SEO-focused, keywords, CTA' },
  facebook: { tr: 'samimi, 500 karakter, hikaye anlat, etkileşim iste', en: 'friendly, 500 chars, storytelling, ask for engagement' }
}

export async function POST(request: NextRequest) {
  try {
    const { content, userId, language = 'en' } = await request.json()

    if (!content) {
      return NextResponse.json({ error: language === 'tr' ? 'İçerik gerekli' : 'Content required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 3) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const seed = Date.now()
    const platforms = ['instagram', 'tiktok', 'twitter', 'linkedin', 'youtube', 'facebook']

    const prompt = language === 'tr'
      ? `[SEED:${seed}] Aşağıdaki içeriği 6 farklı sosyal medya platformuna uyarla.

ORİJİNAL İÇERİK:
"${content}"

HER PLATFORM İÇİN KURALLAR:
- Instagram: ${platformRules.instagram.tr}
- TikTok: ${platformRules.tiktok.tr}
- Twitter: ${platformRules.twitter.tr}
- LinkedIn: ${platformRules.linkedin.tr}
- YouTube: ${platformRules.youtube.tr}
- Facebook: ${platformRules.facebook.tr}

JSON formatında yanıt ver:
{
  "instagram": "Instagram için uyarlanmış içerik",
  "tiktok": "TikTok için uyarlanmış içerik",
  "twitter": "Twitter için uyarlanmış içerik",
  "linkedin": "LinkedIn için uyarlanmış içerik",
  "youtube": "YouTube için uyarlanmış içerik",
  "facebook": "Facebook için uyarlanmış içerik"
}`
      : `[SEED:${seed}] Adapt the following content to 6 different social media platforms.

ORIGINAL CONTENT:
"${content}"

RULES FOR EACH PLATFORM:
- Instagram: ${platformRules.instagram.en}
- TikTok: ${platformRules.tiktok.en}
- Twitter: ${platformRules.twitter.en}
- LinkedIn: ${platformRules.linkedin.en}
- YouTube: ${platformRules.youtube.en}
- Facebook: ${platformRules.facebook.en}

Respond in JSON format:
{
  "instagram": "adapted content for Instagram",
  "tiktok": "adapted content for TikTok",
  "twitter": "adapted content for Twitter",
  "linkedin": "adapted content for LinkedIn",
  "youtube": "adapted content for YouTube",
  "facebook": "adapted content for Facebook"
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 2000, temperature: 0.8, top_p: 0.9, return_full_text: false } })
    })

    let adapted: Record<string, string> = {}
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try { adapted = JSON.parse(match[0]) } catch (e) { console.error('Parse error:', e) }
      }
    }

    if (Object.keys(adapted).length < 3) {
      const shortContent = content.substring(0, 100)
      adapted = {
        instagram: `✨ ${content}\n\n#content #viral #instagood #explore`,
        tiktok: `${shortContent}... 🔥 #fyp #viral`,
        twitter: shortContent.substring(0, 250),
        linkedin: `${content}\n\nWhat are your thoughts on this?`,
        youtube: `📺 ${content}\n\n👇 Share your thoughts in the comments!`,
        facebook: `${content}\n\n💬 What do you think? Let me know below!`
      }
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 3, total_used: c.total_used + 3 }).eq('user_id', userId)
    }

    return NextResponse.json({ adapted, originalContent: content })
  } catch (error) {
    console.error('Platform Adapter Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
