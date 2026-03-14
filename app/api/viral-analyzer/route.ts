import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content, platform, niche, language = 'tr' } = await request.json()
    if (!content?.trim()) return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen viral içerik uzmanısın. İçeriği detaylı analiz et ve samimi, yapıcı öneriler sun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "score": 0-100,
  "verdict": "Düşük/Orta/İyi/Yüksek Potansiyel veya Viral Adayı",
  "summary": "2-3 cümlelik samimi değerlendirme",
  "breakdown": {
    "hook_power": { "score": 0-100, "analysis": "Hook analizi" },
    "emotional_trigger": { "score": 0-100, "analysis": "Duygusal etki" },
    "shareability": { "score": 0-100, "analysis": "Paylaşılabilirlik" },
    "platform_fit": { "score": 0-100, "analysis": "Platform uyumu" },
    "originality": { "score": 0-100, "analysis": "Özgünlük" }
  },
  "strengths": ["Güçlü yön 1", "Güçlü yön 2", "Güçlü yön 3"],
  "weaknesses": ["Zayıf yön 1", "Zayıf yön 2"],
  "improvements": [
    { "priority": "high", "suggestion": "Öneri", "example": "Örnek uygulama" },
    { "priority": "medium", "suggestion": "Öneri", "example": "Örnek" }
  ],
  "rewritten_hook": "Yeniden yazılmış viral hook",
  "best_hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "predicted_performance": { "views": "10K-50K", "likes": "500-2K", "comments": "50-200", "shares": "20-100" }
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Platform: ${platform || 'Instagram'}\nNiş: ${niche || 'Genel'}\n\nİÇERİK:\n${content}` }
        ],
        temperature: 0.7,
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
