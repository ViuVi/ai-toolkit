import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { niche, goals, platform, language = 'tr' } = await request.json()
    if (!niche?.trim()) return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen içerik stratejistisin. ${niche} nişi için 30 günlük detaylı içerik planı oluştur. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "strategy_overview": "Genel strateji özeti",
  "weekly_themes": [
    { "week": 1, "theme": "Hafta teması", "focus": "Odak" },
    { "week": 2, "theme": "Tema", "focus": "Odak" },
    { "week": 3, "theme": "Tema", "focus": "Odak" },
    { "week": 4, "theme": "Tema", "focus": "Odak" },
    { "week": 5, "theme": "Tema", "focus": "Odak" }
  ],
  "days": [
    {
      "day": 1,
      "weekday": "Pazartesi",
      "content_type": "Carousel/Reel/Post/Story/Live",
      "topic": "Spesifik konu",
      "hook": "Dikkat çekici açılış",
      "description": "İçerik açıklaması",
      "cta": "Call-to-action",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "best_time": "09:00",
      "engagement_tip": "Etkileşim ipucu"
    }
  ],
  "bonus_ideas": ["Bonus fikir 1", "Bonus fikir 2", "Bonus fikir 3"],
  "content_tips": ["İpucu 1", "İpucu 2"]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Niş: ${niche}\nPlatform: ${platform || 'Instagram'}\nHedefler: ${goals || 'Organik büyüme'}\n\n30 günlük plan oluştur, her gün için detaylı içerik fikirleri sun.` }
        ],
        temperature: 0.8,
        max_tokens: 8000,
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
