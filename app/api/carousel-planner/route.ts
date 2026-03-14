import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { topic, slideCount, platform, goal, language = 'tr' } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'
    const count = parseInt(slideCount) || 10

    const systemPrompt = `Sen carousel içerik tasarımı ve copywriting uzmanısın. Swipe-through oranı yüksek, kaydet ve paylaş alan carouseller oluşturuyorsun.

VİRAL CAROUSEL FORMÜLÜ:

1. COVER SLIDE (1. slide) - İlk izlenim
   - Güçlü başlık (büyük font)
   - Alt başlık (değer vaadi)
   - Görsel dikkat çekici
   - "Swipe →" işareti

2. HOOK SLIDE (2. slide) - Neden okumalı
   - Problem tanımı veya
   - Büyük vaat veya
   - İlginç istatistik

3. CONTENT SLIDES (3-8. slide) - Değer
   - Her slide = 1 ana fikir
   - Başlık + 2-3 satır açıklama
   - İkon veya görsel öneri
   - Numaralandırma

4. BONUS SLIDE (9. slide) - Ekstra değer
   - "Bonus tip"
   - "Pro insight"
   - Sürpriz bilgi

5. CTA SLIDE (Son slide) - Aksiyon
   - "Kaydet" iste
   - "Takip et" için sebep
   - Sonraki içerik teaser

PLATFORM: ${platform || 'Instagram'}
HEDEF: ${goal || 'Kaydetme ve paylaşım'}

YANIT DİLİ: ${lang}

JSON formatında carousel planı ver:
{
  "carousel_title": "Carousel başlığı",
  "carousel_goal": "Bu carousel ne amaçlıyor",
  "target_action": "Hedef aksiyon (kaydet/paylaş/takip)",
  "slides": [
    {
      "number": 1,
      "type": "cover/hook/content/bonus/cta",
      "headline": "Ana başlık (büyük yazı)",
      "subheadline": "Alt başlık",
      "body": "Gövde metni (varsa)",
      "visual_suggestion": "Görsel/tasarım önerisi",
      "icon_suggestion": "İkon önerisi",
      "color_mood": "Renk tonu önerisi",
      "design_tip": "Tasarım ipucu",
      "text_placement": "Yazı yerleşimi önerisi"
    }
  ],
  "caption": {
    "hook": "Caption hook cümlesi",
    "body": "Caption gövdesi",
    "cta": "Caption CTA",
    "hashtags": ["20 hashtag"]
  },
  "design_guidelines": {
    "color_palette": "Önerilen renk paleti",
    "font_pairing": "Font önerisi",
    "overall_style": "Genel stil (minimal/bold/playful vb.)",
    "brand_consistency_tips": "Tutarlılık ipuçları"
  },
  "a_b_test_ideas": ["A/B test için cover alternatifi"],
  "repurpose_ideas": ["Bu carouseli nasıl başka formatlara çevirirsin"],
  "engagement_tips": ["Engagement artırma ipuçları"]
}`

    const userPrompt = `Konu: ${topic}
Slide Sayısı: ${count}
Platform: ${platform || 'Instagram'}
Hedef: ${goal || 'Kaydetme ve paylaşım'}

Bu konu için swipe-worthy carousel planla. Her slide değer vermeli.`

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
      result = { slides: [], error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
