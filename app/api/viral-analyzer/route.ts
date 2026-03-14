import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { content, platform, niche, language = 'tr' } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: language === 'tr' ? 'İçerik gerekli' : 'Content required' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen dünya çapında tanınmış bir viral içerik stratejisti ve sosyal medya analistisin. 10 yılı aşkın deneyiminle milyonlarca takipçiye ulaşan içerikler oluşturdun.

Görevin: Verilen içeriği derinlemesine analiz ederek viral potansiyelini değerlendirmek.

ANALİZ KRİTERLERİN:
1. Hook Gücü (İlk 3 saniye/satır) - Dikkat çekme kapasitesi
2. Duygusal Tetikleyiciler - Merak, şok, empati, nostalji, FOMO
3. Paylaşılabilirlik - İnsanlar neden paylaşır?
4. Tartışma Potansiyeli - Yorum ve etkileşim tetikleyici mi?
5. Platform Uyumu - ${platform || 'Instagram'} algoritması ve kullanıcı davranışlarına uygunluk
6. Trend Uyumu - Güncel akımlarla örtüşme
7. Özgünlük - Benzersizlik ve farklılaşma

YANIT DİLİ: ${lang}

JSON formatında detaylı analiz ver:
{
  "score": 0-100 arası puan,
  "verdict": "Düşük Potansiyel" / "Orta Potansiyel" / "İyi Potansiyel" / "Yüksek Potansiyel" / "Viral Adayı",
  "summary": "2-3 cümlelik samimi ve yapıcı genel değerlendirme",
  "breakdown": {
    "hook_power": { "score": 0-100, "analysis": "Detaylı hook analizi" },
    "emotional_trigger": { "score": 0-100, "analysis": "Hangi duyguları tetikliyor?" },
    "shareability": { "score": 0-100, "analysis": "Neden paylaşılır/paylaşılmaz?" },
    "controversy": { "score": 0-100, "analysis": "Tartışma ve yorum potansiyeli" },
    "platform_fit": { "score": 0-100, "analysis": "Platform uyumu değerlendirmesi" },
    "originality": { "score": 0-100, "analysis": "Özgünlük değerlendirmesi" }
  },
  "strengths": ["En az 3 güçlü yön - spesifik ve detaylı"],
  "weaknesses": ["Zayıf yönler - yapıcı eleştiri"],
  "improvements": [
    { "priority": "high", "suggestion": "En önemli iyileştirme önerisi", "impact": "Tahmini etki", "example": "Örnek uygulama" },
    { "priority": "medium", "suggestion": "Orta öncelikli öneri", "impact": "Tahmini etki", "example": "Örnek" },
    { "priority": "low", "suggestion": "Ek öneri", "impact": "Tahmini etki", "example": "Örnek" }
  ],
  "rewritten_hook": "İçeriğin hook'unu yeniden yazılmış viral versiyonu",
  "best_hashtags": ["5 adet önerilen hashtag"],
  "predicted_performance": {
    "views": "Tahmini görüntülenme aralığı",
    "likes": "Tahmini beğeni aralığı", 
    "comments": "Tahmini yorum aralığı",
    "shares": "Tahmini paylaşım aralığı"
  }
}`

    const userPrompt = `Platform: ${platform || 'Instagram'}
Niş/Sektör: ${niche || 'Genel'}

İÇERİK:
"""
${content}
"""

Bu içeriği profesyonel bir viral içerik uzmanı gözüyle analiz et. Samimi, yapıcı ve aksiyon alınabilir öneriler sun.`

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
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq Error:', response.status, errorText)
      return NextResponse.json({ error: 'AI servisi hatası' }, { status: 500 })
    }

    const data = await response.json()
    const aiContent = data.choices?.[0]?.message?.content

    if (!aiContent) {
      return NextResponse.json({ error: 'Boş yanıt' }, { status: 500 })
    }

    let result
    try {
      result = JSON.parse(aiContent)
    } catch {
      result = { score: 0, verdict: 'Analiz yapılamadı', error: true }
    }

    return NextResponse.json({ success: true, result })

  } catch (error: any) {
    console.error('Viral Analyzer Error:', error)
    return NextResponse.json({ error: error.message || 'Bir hata oluştu' }, { status: 500 })
  }
}
