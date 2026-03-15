import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { videoDescription, platform, yourNiche, language = 'tr' } = await request.json()
    if (!videoDescription?.trim()) return NextResponse.json({ error: 'Video açıklaması gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen viral video reverse engineering uzmanısın. Viral videoları analiz edip, kullanıcının kendi nişine uyarlayabileceği yeni içerikler oluşturuyorsun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "original_analysis": {
    "why_viral": "Neden viral oldu - detaylı analiz",
    "hook_type": "Hook tipi",
    "content_structure": "İçerik yapısı",
    "emotional_triggers": ["Tetikleyici 1", "Tetikleyici 2"],
    "retention_tactics": ["Taktik 1", "Taktik 2"],
    "virality_score": 85
  },
  "rewritten_hooks": [
    { "hook": "Yeni hook", "style": "Stil", "why_works": "Neden işe yarar" }
  ],
  "new_script": {
    "hook": { "text": "Hook (0-3sn)", "visual": "Görsel", "delivery": "Söyleyiş" },
    "problem": { "text": "Problem (3-10sn)", "visual": "Görsel" },
    "buildup": { "text": "Build-up (10-20sn)", "visual": "Görsel" },
    "solution": { "text": "Çözüm (20-25sn)", "visual": "Görsel" },
    "cta": { "text": "CTA (son 5sn)", "visual": "Görsel" },
    "full_script": "Tam script"
  },
  "caption": { "main": "Caption", "hook_line": "Hook", "cta": "CTA" },
  "hashtags": { "primary": ["#tag1"], "secondary": ["#tag2"], "trending": ["#trend"] },
  "shot_list": [
    { "shot_number": 1, "duration": "0-3sn", "description": "Açıklama", "camera_angle": "Açı", "text_overlay": "Yazı", "audio_note": "Ses" }
  ],
  "filming_tips": ["Çekim ipucu"],
  "editing_tips": ["Kurgu ipucu"],
  "sound_suggestions": ["Ses önerisi"],
  "posting_strategy": { "best_time": "Zaman", "first_comment": "Yorum", "engagement_hook": "Engagement" }
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `VİRAL VİDEO:\n${videoDescription}\n\nPlatform: ${platform || 'TikTok'}\nBenim Nişim: ${yourNiche || 'Genel'}\n\nAnaliz et ve benim nişime uygun yeni versiyon oluştur.` }
        ],
        temperature: 0.85,
        max_tokens: 6000,
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
