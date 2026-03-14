import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, tweetCount, tone, platform, language = 'tr' } = await request.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'
    const count = parseInt(tweetCount) || 10

    const systemPrompt = `Sen viral Twitter/X thread yazarısın. Binlerce RT alan threadler yazıyorsun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "thread_title": "Thread başlığı",
  "hook_options": [
    { "version": "A", "tweet": "Hook versiyon A", "style": "Stil açıklaması" },
    { "version": "B", "tweet": "Hook versiyon B", "style": "Stil" }
  ],
  "tweets": [
    {
      "number": 1,
      "type": "hook",
      "content": "Tweet içeriği (280 karakter max, emoji dahil)",
      "purpose": "Bu tweetin amacı",
      "tip": "Yazım ipucu"
    },
    {
      "number": 2,
      "type": "context",
      "content": "Tweet içeriği",
      "purpose": "Amaç"
    }
  ],
  "full_thread": "Tüm thread kopyalamaya hazır format",
  "engagement_boosters": {
    "best_time_to_post": "En iyi paylaşım zamanı",
    "reply_to_self_tip": "Kendi tweetine yanıt stratejisi",
    "quote_tweet_bait": "QRT teşvik edici cümle"
  },
  "hashtags": ["#hashtag1", "#hashtag2"],
  "follow_up_ideas": ["Takip içerik fikri 1", "Fikir 2"],
  "repurpose_tips": ["Başka platformlara nasıl uyarlarsın"]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Konu: ${topic}\nTweet Sayısı: ${count}\nTon: ${tone || 'Bilgilendirici'}\nPlatform: ${platform || 'Twitter/X'}` }
        ],
        temperature: 0.8,
        max_tokens: 5000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) return NextResponse.json({ error: 'AI servisi hatası' }, { status: 500 })
    const data = await response.json()
    const result = JSON.parse(data.choices?.[0]?.message?.content || '{}')
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
