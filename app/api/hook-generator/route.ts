import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, hookCount, language = 'tr' } = await request.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'
    const count = parseInt(hookCount) || 10

    const systemPrompt = `Sen viral video hook yazarısın. İlk 3 saniyede izleyiciyi yakalayan, scroll durduran hook'lar yazıyorsun. Yanıt dili: ${lang}

Her hook için 3 skor ver (0-100):
- Virality Score: Paylaşılma potansiyeli
- Curiosity Score: Merak uyandırma gücü  
- Retention Score: İzleyiciyi tutma gücü

JSON formatında yanıt ver:
{
  "topic_analysis": "Konu hakkında kısa analiz",
  "platform_tips": "Platform özel ipuçları",
  "hooks": [
    {
      "hook": "Hook metni",
      "type": "question/statement/controversial/statistic/story",
      "virality_score": 85,
      "curiosity_score": 90,
      "retention_score": 80,
      "total_score": 85,
      "why_works": "Neden işe yarar",
      "best_for": "En uygun video tipi",
      "opening_visual": "Önerilen açılış görseli"
    }
  ],
  "top_pick": {
    "hook": "En iyi hook",
    "reason": "Neden en iyi"
  },
  "hook_formulas": [
    { "formula": "Hook formülü", "example": "Örnek uygulama" }
  ],
  "avoid_list": ["Kaçınılması gereken hook tipleri"]
}`

    const toneMap: any = {
      'curiosity': 'Merak uyandıran, "bunu bilmiyordunuz" tarzı',
      'controversial': 'Tartışmalı, cesur, dikkat çekici',
      'educational': 'Eğitici, bilgi veren, değer katan',
      'storytelling': 'Hikaye anlatıcı, kişisel, samimi'
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Konu: ${topic}\nPlatform: ${platform || 'TikTok'}\nTon: ${toneMap[tone] || 'Genel'}\nHook Sayısı: ${count}\n\n${count} adet viral hook üret. Her biri farklı açıdan yaklaşsın.` }
        ],
        temperature: 0.9,
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
