import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, duration, platform, style, targetAudience, language = 'tr' } = await request.json()
    if (!topic?.trim()) return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'
    const dur = duration || '30'

    const systemPrompt = `Sen viral video scripti yazma uzmanısın. TikTok, Reels ve Shorts için retention odaklı scriptler yazıyorsun. Yanıt dili: ${lang}

Script yapısı (zorunlu):
1. HOOK (ilk 3 saniye - scroll durdurucu)
2. PROBLEM (izleyicinin ağrı noktası)
3. BUILD-UP (gerilim/merak artırma)
4. SOLUTION (değer/çözüm)
5. CTA (aksiyon çağrısı)

JSON formatında yanıt ver:
{
  "title": "Video başlığı önerisi",
  "duration": "${dur} saniye",
  "hook_options": [
    { "type": "Pattern Interrupt", "script": "Hook scripti", "visual": "Görsel öneri", "why_works": "Neden etkili" },
    { "type": "Curiosity Gap", "script": "Alternatif hook", "visual": "Görsel", "why_works": "Neden etkili" },
    { "type": "Shock Statement", "script": "Başka hook", "visual": "Görsel", "why_works": "Neden etkili" }
  ],
  "main_script": {
    "hook": {
      "text": "HOOK metni - scroll durdurucu",
      "duration": "0-3 saniye",
      "delivery_tip": "Söyleyiş: hızlı, enerjik, kameraya direkt bak",
      "visual": "Görsel önerisi",
      "text_overlay": "Ekran yazısı"
    },
    "problem": {
      "text": "PROBLEM - izleyicinin ağrı noktası",
      "duration": "3-8 saniye",
      "visual": "Görsel",
      "emotional_hook": "Duygusal bağ kurma"
    },
    "buildup": {
      "text": "BUILD-UP - gerilim artırma, merak",
      "duration": "8-20 saniye",
      "visual": "Görsel",
      "retention_tactic": "Retention taktiği"
    },
    "solution": {
      "text": "SOLUTION - değer/çözüm",
      "duration": "20-${parseInt(dur)-5} saniye",
      "visual": "Görsel",
      "value_delivery": "Değer nasıl sunuluyor"
    },
    "cta": {
      "text": "CTA metni",
      "duration": "Son 3-5 saniye",
      "visual": "Görsel",
      "cta_type": "Follow/Save/Comment/Share"
    }
  },
  "scene_breakdown": [
    {
      "scene": 1,
      "timestamp": "0:00-0:03",
      "script_line": "Söylenecek metin",
      "visual_action": "Görsel aksiyon",
      "text_overlay": "Ekran yazısı",
      "camera": "Kamera açısı",
      "energy_level": "Yüksek/Orta"
    }
  ],
  "full_script": "HOOK: ...\n\nPROBLEM: ...\n\nBUILD-UP: ...\n\nSOLUTION: ...\n\nCTA: ...",
  "production_notes": {
    "camera_angles": ["Close-up yüz", "B-roll"],
    "transitions": ["Jump cut", "Zoom"],
    "text_overlays": ["Anahtar kelimeler bold"],
    "sound_suggestions": ["Trending ses / Voiceover"],
    "pacing": "Hızlı kesimler, 2-3 sn/sahne"
  },
  "hashtags": ["#hashtag1", "#hashtag2"],
  "caption": "Video açıklaması",
  "viral_checklist": ["✓ İlk 1 sn dikkat çekiyor", "✓ Problem net tanımlandı", "✓ Değer sağlandı", "✓ CTA var"]
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Konu: ${topic}\nPlatform: ${platform || 'TikTok'}\nSüre: ${dur} saniye\nStil: ${style || 'Eğitici'}\nHedef Kitle: ${targetAudience || 'Genel'}` }
        ],
        temperature: 0.85,
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
