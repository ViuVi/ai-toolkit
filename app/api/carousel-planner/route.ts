import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, slideCount, platform, goal, language = 'tr' } = await request.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'
    const count = parseInt(slideCount) || 10

    const systemPrompt = `Sen carousel içerik tasarımı uzmanısın. Swipe-through oranı yüksek carouseller oluşturuyorsun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "carousel_title": "Carousel başlığı",
  "carousel_goal": "Hedef",
  "target_action": "Kaydet/Paylaş/Takip",
  "slides": [
    {
      "number": 1,
      "type": "cover",
      "headline": "Ana başlık (büyük yazı)",
      "subheadline": "Alt başlık",
      "body": "Gövde metni",
      "visual_suggestion": "Görsel önerisi",
      "icon_suggestion": "İkon önerisi",
      "color_mood": "Renk tonu",
      "design_tip": "Tasarım ipucu"
    }
  ],
  "caption": {
    "hook": "Caption hook cümlesi",
    "body": "Caption gövdesi",
    "cta": "Call-to-action",
    "hashtags": ["#hashtag1", "#hashtag2"]
  },
  "design_guidelines": {
    "color_palette": "Önerilen renkler",
    "font_pairing": "Font önerisi",
    "overall_style": "Genel stil"
  },
  "a_b_test_ideas": ["Cover alternatifi"],
  "engagement_tips": ["Engagement ipucu 1", "İpucu 2"]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Konu: ${topic}\nSlide Sayısı: ${count}\nPlatform: ${platform || 'Instagram'}\nHedef: ${goal || 'Kaydetme ve paylaşım'}` }
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
