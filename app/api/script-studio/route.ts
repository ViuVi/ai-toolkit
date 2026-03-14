import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { topic, duration, platform, style, targetAudience, language = 'tr' } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'
    const dur = duration || '30'

    const systemPrompt = `Sen viral video scripti yazma konusunda uzman bir içerik yaratıcısısın. TikTok, Reels ve Shorts için milyonlarca izlenme alan scriptler yazdın.

VİRAL SCRİPT FORMÜLÜ:

1. HOOK (0-3 saniye) - %80 izleyici burada karar verir
   - Pattern interrupt: Beklenmedik açılış
   - Merak uyandırma: "Bunu bilmiyordun..."
   - Şok/Sürpriz: "İnanamayacaksın ama..."
   - Doğrudan fayda: "30 saniyede öğreneceksin..."
   - Soru: "Hiç merak ettin mi...?"

2. RETENTION (3-15 saniye) - İzleyiciyi tutma
   - Hızlı değer vermeye başla
   - Görsel değişimler öner
   - "Ama bekle, dahası var" kalıbı

3. BODY (15-45 saniye) - Ana içerik
   - Listeye dök (3-5 madde ideal)
   - Her 3-5 saniyede yeni bilgi
   - Görsel destekler öner

4. CLIMAX (son 5-10 saniye) - Doruk noktası
   - En güçlü bilgi/reveal
   - CTA'ya geçiş

5. CTA (son 3 saniye) - Aksiyon
   - Takip et, beğen, kaydet
   - Yorum bırak (soru sor)
   - Paylaş

PLATFORM: ${platform || 'TikTok'}
SÜRE: ${dur} saniye
STİL: ${style || 'Eğitici ve eğlenceli'}

YANIT DİLİ: ${lang}

JSON formatında detaylı script ver:
{
  "title": "Video başlığı önerisi",
  "duration": "${dur} saniye",
  "hook_options": [
    { "type": "Pattern Interrupt", "script": "Hook scripti", "visual": "Görsel öneri" },
    { "type": "Merak", "script": "Alternatif hook", "visual": "Görsel öneri" },
    { "type": "Şok", "script": "Başka alternatif", "visual": "Görsel öneri" }
  ],
  "main_script": {
    "hook": {
      "text": "Hook metni (kelime kelime)",
      "duration": "0-3 saniye",
      "delivery_tip": "Söyleyiş tarzı önerisi",
      "visual": "Görsel/çekim önerisi"
    },
    "retention": {
      "text": "Geçiş ve tutma metni",
      "duration": "3-10 saniye",
      "visual": "Görsel önerisi"
    },
    "body": [
      {
        "point": "1. nokta",
        "text": "Ne söylenecek",
        "duration": "Saniye aralığı",
        "visual": "Görsel önerisi",
        "transition": "Geçiş önerisi"
      }
    ],
    "climax": {
      "text": "Doruk noktası",
      "duration": "Saniye",
      "visual": "Görsel önerisi"
    },
    "cta": {
      "text": "CTA metni",
      "duration": "Son 3 saniye",
      "visual": "Görsel önerisi"
    }
  },
  "full_script": "Baştan sona düz metin olarak tüm script",
  "production_notes": {
    "camera_angles": ["Kamera açısı önerileri"],
    "transitions": ["Geçiş efekti önerileri"],
    "text_overlays": ["Ekranda gösterilecek yazılar"],
    "sound_suggestions": ["Ses/müzik önerileri"],
    "props_needed": ["Gerekli materyaller"]
  },
  "hashtags": ["10 hashtag önerisi"],
  "caption": "Video açıklaması önerisi",
  "best_posting_time": "En iyi paylaşım zamanı",
  "viral_potential_tips": ["Viral olma şansını artıracak ipuçları"]
}`

    const userPrompt = `Konu: ${topic}
Platform: ${platform || 'TikTok'}
Süre: ${dur} saniye
Stil: ${style || 'Eğitici ve eğlenceli'}
Hedef Kitle: ${targetAudience || 'Genel'}

Bu konu için viral video scripti yaz. Hook çok güçlü olmalı, izleyiciyi 3 saniyede yakalamalı.`

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
        temperature: 0.85,
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
      result = { main_script: {}, error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
