import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { captionA, captionB, platform, goal, language = 'tr' } = await request.json()
    if (!captionA?.trim() || !captionB?.trim()) return NextResponse.json({ error: 'İki caption gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen A/B test uzmanı ve copywriting analistsin. İki caption'ı karşılaştırıp kazananı belirle. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "winner": "A veya B",
  "confidence": "75%",
  "score_a": 72,
  "score_b": 68,
  "verdict": "Samimi ve yapıcı genel değerlendirme",
  "analysis_a": {
    "overall_impression": "Genel izlenim",
    "hook_score": 75,
    "hook_analysis": "Hook analizi",
    "emotional_score": 70,
    "emotional_analysis": "Duygusal etki",
    "readability_score": 80,
    "readability_analysis": "Okunabilirlik",
    "cta_score": 65,
    "cta_analysis": "CTA analizi",
    "strengths": ["Güçlü yön 1", "Güçlü yön 2"],
    "weaknesses": ["Zayıf yön 1"],
    "predicted_engagement": "Orta-Yüksek"
  },
  "analysis_b": {
    "overall_impression": "Genel izlenim",
    "hook_score": 70,
    "hook_analysis": "Hook analizi",
    "emotional_score": 65,
    "emotional_analysis": "Duygusal etki",
    "readability_score": 75,
    "readability_analysis": "Okunabilirlik",
    "cta_score": 70,
    "cta_analysis": "CTA analizi",
    "strengths": ["Güçlü yön 1"],
    "weaknesses": ["Zayıf yön 1", "Zayıf yön 2"],
    "predicted_engagement": "Orta"
  },
  "head_to_head": {
    "hook": { "winner": "A", "margin": "Fark açıklaması" },
    "emotional": { "winner": "A", "margin": "Fark" },
    "cta": { "winner": "B", "margin": "Fark" }
  },
  "hybrid_suggestion": "İki caption'ın en iyi özelliklerini birleştiren yeni versiyon",
  "improvement_tips": ["İyileştirme önerisi 1", "Öneri 2"]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `CAPTION A:\n${captionA}\n\nCAPTION B:\n${captionB}\n\nPlatform: ${platform || 'Instagram'}\nHedef: ${goal || 'Engagement'}` }
        ],
        temperature: 0.6,
        max_tokens: 4000,
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
