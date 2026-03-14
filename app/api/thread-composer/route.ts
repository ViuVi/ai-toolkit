import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { topic, tweetCount, tone, platform, language = 'tr' } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'
    const count = parseInt(tweetCount) || 10

    const systemPrompt = `Sen viral Twitter/X thread yazarısın. Binlerce RT ve like alan threadler yazdın.

VİRAL THREAD FORMÜLÜ:

1. HOOK TWEET (1. tweet) - En kritik
   - Büyük bir iddia veya vaat
   - Merak uyandırıcı
   - "🧵" thread emoji
   - 280 karakteri maksimum kullan

2. CONTEXT (2-3. tweet)
   - Neden önemli?
   - Neden şimdi?
   - Credibility/kaynak

3. BODY (4-8. tweet)
   - Her tweet bir değer
   - Numaralandırma kullan
   - Kısa paragraflar
   - Emoji ile görsellik

4. CLIMAX (9. tweet)
   - En güçlü nokta
   - "Plot twist" veya reveal

5. CTA (Son tweet)
   - RT/Like iste
   - Takip et
   - Bookmark yap
   - Yorum iste

TON: ${tone || 'Bilgilendirici ve samimi'}
PLATFORM: ${platform || 'Twitter/X'}

YANIT DİLİ: ${lang}

JSON formatında viral thread ver:
{
  "thread_title": "Thread başlığı",
  "hook_options": [
    { "version": "A", "tweet": "Hook versiyon A", "style": "Stil açıklaması" },
    { "version": "B", "tweet": "Hook versiyon B", "style": "Stil açıklaması" }
  ],
  "tweets": [
    {
      "number": 1,
      "type": "hook",
      "content": "Tweet içeriği (emoji dahil)",
      "char_count": 280,
      "purpose": "Bu tweetin amacı",
      "tip": "Yazım/paylaşım ipucu"
    }
  ],
  "full_thread": "Tüm threadı kopyalamaya hazır formatta",
  "engagement_boosters": {
    "best_time_to_post": "En iyi paylaşım zamanı",
    "reply_to_self_tip": "Kendi tweetine yanıt stratejisi",
    "quote_tweet_bait": "QRT teşvik edici cümle",
    "controversy_hook": "Tartışma başlatıcı (opsiyonel)"
  },
  "hashtags": ["Önerilen hashtagler (1-2 max)"],
  "follow_up_ideas": ["Thread sonrası içerik fikirleri"],
  "repurpose_tips": ["Bu threadi başka platformlara nasıl uyarlarsın"]
}`

    const userPrompt = `Konu: ${topic}
Tweet Sayısı: ${count}
Ton: ${tone || 'Bilgilendirici ve samimi'}
Platform: ${platform || 'Twitter/X'}

Bu konu hakkında viral bir thread yaz. İlk tweet çok dikkat çekici olmalı.`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 5000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI servisi hatası' }, { status: 500 })
    }

    const data = await response.json()
    const aiContent = data.choices?.[0]?.message?.content

    let result
    try {
      result = JSON.parse(aiContent)
    } catch {
      result = { tweets: [], error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
