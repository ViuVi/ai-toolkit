import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content, niche, platform, goal, language = 'tr' } = await request.json()
    if (!content?.trim()) return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen sosyal medya engagement uzmanısın. İçeriklerin etkileşim oranlarını katlayan stratejiler geliştiriyorsun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "content_analysis": "Mevcut içerik analizi",
  "engagement_potential": 7,
  "hooks": [
    {
      "type": "Soru/İstatistik/Hikaye",
      "hook": "Hook metni",
      "why_works": "Neden işe yarar",
      "best_for": "En uygun durum"
    }
  ],
  "ctas": [
    {
      "type": "Yorum/Kaydet/Paylaş/Takip",
      "cta": "CTA metni",
      "placement": "Nereye konulmalı",
      "psychology": "Psikolojik tetikleyici"
    }
  ],
  "questions": [
    {
      "question": "Soru metni",
      "type": "Açık uçlu/Seçenekli/Tartışmalı",
      "expected_response": "Beklenen tepki",
      "controversy_level": "low/medium/high"
    }
  ],
  "comment_bait": [
    {
      "technique": "Teknik adı",
      "example": "Örnek uygulama",
      "expected_comments": "Tahmini yorum artışı"
    }
  ],
  "save_triggers": [
    { "technique": "Teknik", "example": "Örnek" }
  ],
  "share_triggers": [
    { "technique": "Teknik", "example": "Örnek" }
  ],
  "caption_rewrite": {
    "original_issue": "Mevcut sorun",
    "improved_version": "İyileştirilmiş versiyon",
    "changes_made": "Yapılan değişiklikler"
  },
  "hashtag_strategy": {
    "engagement_hashtags": ["#hashtag1", "#hashtag2"],
    "community_hashtags": ["#hashtag"],
    "avoid": ["Kaçınılacak"]
  },
  "timing_tips": "Zamanlama önerileri",
  "reply_strategy": "Yorumlara yanıt stratejisi"
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `İÇERİK:\n${content}\n\nNiş: ${niche || 'Genel'}\nPlatform: ${platform || 'Instagram'}\nHedef: ${goal || 'Genel engagement'}` }
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
