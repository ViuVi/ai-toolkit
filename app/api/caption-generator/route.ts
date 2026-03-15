import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, contentType, language = 'tr' } = await request.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen viral sosyal medya caption yazarısın. Engagement oranı yüksek, save ve share tetikleyen caption'lar yazıyorsun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "topic_insight": "Konu hakkında içgörü",
  "captions": [
    {
      "caption": "Tam caption metni (emoji dahil)",
      "hook": "Açılış cümlesi",
      "body": "Ana metin",
      "cta": "Call-to-action",
      "style": "Stil açıklaması",
      "engagement_prediction": "high/medium/low",
      "best_for": "En uygun içerik tipi",
      "character_count": 150
    }
  ],
  "cta_variations": [
    { "cta": "CTA metni", "type": "save/comment/share/follow", "strength": 85 }
  ],
  "hashtag_suggestions": ["#hashtag1", "#hashtag2"],
  "emoji_guide": "Emoji kullanım önerisi",
  "formatting_tips": ["Formatlama ipucu 1", "İpucu 2"],
  "platform_specific_tips": "Platform özel öneriler"
}`

    const toneMap: any = {
      'casual': 'Günlük, samimi, arkadaş gibi',
      'professional': 'Profesyonel, güvenilir, uzman',
      'humorous': 'Eğlenceli, komik, espirili',
      'inspirational': 'İlham verici, motive edici',
      'educational': 'Eğitici, bilgi veren'
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Konu: ${topic}\nPlatform: ${platform || 'Instagram'}\nTon: ${toneMap[tone] || 'Genel'}\nİçerik Tipi: ${contentType || 'Video'}\n\n5 farklı viral caption üret. Her biri farklı yaklaşım kullansın.` }
        ],
        temperature: 0.85,
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
