import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { captionA, captionB, platform, goal, language = 'tr' } = await request.json()

    if (!captionA?.trim() || !captionB?.trim()) {
      return NextResponse.json({ error: 'İki caption gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen A/B test uzmanı ve copywriting analistsin. İçerikleri psikoloji, pazarlama ve platform algoritmaları açısından değerlendiriyorsun.

DEĞERLENDİRME KRİTERLERİ:
1. Hook Gücü (30%) - İlk cümlenin dikkat çekme kapasitesi
2. Duygusal Bağ (20%) - Okuyucuyla kurulan duygusal bağlantı
3. Okunabilirlik (15%) - Akıcılık ve anlaşılırlık
4. CTA Gücü (15%) - Aksiyon aldırma potansiyeli
5. Platform Uyumu (10%) - ${platform || 'Instagram'} için uygunluk
6. Özgünlük (10%) - Farklılık ve yaratıcılık

HEDEF: ${goal || 'Engagement artışı'}

YANIT DİLİ: ${lang}

JSON formatında detaylı karşılaştırma ver:
{
  "winner": "A veya B",
  "confidence": "Kazanma güven yüzdesi (örn: 75%)",
  "score_a": 0-100,
  "score_b": 0-100,
  "verdict": "Samimi ve yapıcı genel değerlendirme",
  "analysis_a": {
    "overall_impression": "Genel izlenim",
    "hook_score": 0-100,
    "hook_analysis": "Hook analizi",
    "emotional_score": 0-100,
    "emotional_analysis": "Duygusal etki analizi",
    "readability_score": 0-100,
    "readability_analysis": "Okunabilirlik analizi",
    "cta_score": 0-100,
    "cta_analysis": "CTA analizi",
    "strengths": ["Güçlü yönler"],
    "weaknesses": ["Zayıf yönler"],
    "predicted_engagement": "Tahmini engagement"
  },
  "analysis_b": {
    "overall_impression": "Genel izlenim",
    "hook_score": 0-100,
    "hook_analysis": "Hook analizi",
    "emotional_score": 0-100,
    "emotional_analysis": "Duygusal etki analizi",
    "readability_score": 0-100,
    "readability_analysis": "Okunabilirlik analizi",
    "cta_score": 0-100,
    "cta_analysis": "CTA analizi",
    "strengths": ["Güçlü yönler"],
    "weaknesses": ["Zayıf yönler"],
    "predicted_engagement": "Tahmini engagement"
  },
  "head_to_head": {
    "hook": { "winner": "A/B", "margin": "Fark açıklaması" },
    "emotional": { "winner": "A/B", "margin": "Fark açıklaması" },
    "cta": { "winner": "A/B", "margin": "Fark açıklaması" }
  },
  "hybrid_suggestion": "İki caption'ın en iyi özelliklerini birleştiren yeni versiyon",
  "improvement_tips": ["Her iki caption için de geçerli iyileştirme önerileri"],
  "test_recommendation": "Gerçek A/B test önerisi"
}`

    const userPrompt = `CAPTION A:
"""
${captionA}
"""

CAPTION B:
"""
${captionB}
"""

Platform: ${platform || 'Instagram'}
Hedef: ${goal || 'Engagement artışı'}

Bu iki caption'ı profesyonelce karşılaştır ve kazananı belirle.`

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
        temperature: 0.6,
        max_tokens: 4000,
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
      result = { winner: 'A', score_a: 50, score_b: 50, error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
