import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { content, niche, platform, goal, language = 'tr' } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen sosyal medya engagement uzmanısın. İçeriklerin etkileşim oranlarını katlayan stratejiler geliştiriyorsun.

ENGAGEMENT PSİKOLOJİSİ:

1. YORUM TETİKLEYİCİLER
   - Tartışmalı sorular
   - "Hangisi?" seçenekleri
   - Boşluk doldurma
   - Deneyim paylaşımı isteme
   - Unpopular opinion
   - "Tag someone who..."

2. KAYDETME TETİKLEYİCİLER
   - Değerli bilgi/liste
   - "Bunu kaydet, lazım olacak"
   - Referans materyali
   - Adım adım rehber

3. PAYLAŞMA TETİKLEYİCİLER
   - Relatable içerik
   - "Arkadaşını etiketle"
   - Komik/duygusal
   - Faydalı bilgi

4. HOOK ÇEŞİTLERİ
   - Soru hook
   - İstatistik hook
   - Hikaye hook
   - Kontrovers hook
   - Fayda hook

PLATFORM: ${platform || 'Instagram'}
HEDEF: ${goal || 'Genel engagement artışı'}

YANIT DİLİ: ${lang}

JSON formatında engagement stratejisi ver:
{
  "content_analysis": "Mevcut içerik analizi",
  "engagement_potential": "Mevcut engagement potansiyeli (1-10)",
  "hooks": [
    {
      "type": "Soru/İstatistik/Hikaye/vb.",
      "hook": "Hook metni",
      "why_works": "Neden işe yarar",
      "best_for": "En uygun platform/durum"
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
      "expected_response": "Beklenen tepki türü",
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
    {
      "technique": "Teknik adı",
      "example": "Örnek uygulama"
    }
  ],
  "share_triggers": [
    {
      "technique": "Teknik adı",
      "example": "Örnek uygulama"
    }
  ],
  "caption_rewrite": {
    "original_issue": "Mevcut caption'ın sorunu",
    "improved_version": "İyileştirilmiş versiyon",
    "changes_made": "Yapılan değişiklikler"
  },
  "hashtag_strategy": {
    "engagement_hashtags": ["Engagement artıran hashtagler"],
    "community_hashtags": ["Topluluk hashtagleri"],
    "avoid": ["Kaçınılması gereken hashtagler"]
  },
  "timing_tips": "Engagement için zamanlama önerileri",
  "reply_strategy": "Yorumlara yanıt stratejisi",
  "follow_up_content": ["Engagement'ı sürdürmek için takip içerikleri"]
}`

    const userPrompt = `İÇERİK:
"""
${content}
"""

Niş: ${niche || 'Genel'}
Platform: ${platform || 'Instagram'}
Hedef: ${goal || 'Genel engagement artışı'}

Bu içerik için engagement artırıcı stratejiler, hook'lar, CTA'lar ve sorular üret.`

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
      result = { hooks: [], ctas: [], questions: [], error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
