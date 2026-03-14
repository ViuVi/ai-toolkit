import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { content, platforms, niche, language = 'tr' } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const targetPlatforms = platforms?.length > 0 ? platforms : ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube', 'Facebook']
    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen içerik dönüştürme ve çok platformlu strateji konusunda uzman bir dijital pazarlama gurusun. Her platformun kendine özgü dilini, formatını ve kültürünü mükemmel biliyorsun.

PLATFORM ÖZELLİKLERİ:

INSTAGRAM:
- Görsel odaklı, estetik önemli
- Hashtag stratejisi kritik (20-30 hashtag)
- Carousel ve Reel çok etkili
- CTA: "Link in bio", kaydet, paylaş

TIKTOK:
- Hook ilk 1 saniyede
- Trend sesleri ve efektler
- Ham, otantik içerik
- Hashtag: 3-5 trend hashtag
- CTA: Duet, stitch, follow

TWITTER/X:
- 280 karakter limiti
- Thread formatı güçlü
- Tartışma başlatıcı
- Hashtag: 1-2 maksimum
- CTA: RT, reply, quote

LINKEDIN:
- Profesyonel ton
- Storytelling etkili
- 3000 karakter ideal
- Emoji minimal
- CTA: Connect, comment, share insight

YOUTUBE (Shorts/Community):
- Hook ilk 3 saniye
- Değer önerisi net
- Shorts: 60 saniye max
- CTA: Subscribe, bell, comment

FACEBOOK:
- Topluluk odaklı
- Paylaşım teşviki
- Video öncelikli
- CTA: Share, tag friends

YANIT DİLİ: ${lang}

JSON formatında her platform için özelleştirilmiş içerik ver:
{
  "original_analysis": "Orijinal içeriğin kısa analizi",
  "platforms": {
    "Instagram": {
      "caption": "Instagram için uyarlanmış caption (emoji dahil)",
      "hashtags": ["30 adet etkili hashtag"],
      "format_suggestion": "Önerilen format (Carousel/Reel/Post)",
      "visual_tip": "Görsel önerisi",
      "cta": "Call-to-action",
      "posting_tip": "Paylaşım ipucu"
    },
    "TikTok": {
      "script": "TikTok video scripti (hook dahil)",
      "hashtags": ["5 trend hashtag"],
      "sound_suggestion": "Önerilen ses tipi",
      "hook": "Dikkat çekici açılış",
      "cta": "Call-to-action",
      "trend_tip": "Trend entegrasyon önerisi"
    },
    "Twitter": {
      "tweet": "Ana tweet (280 karakter)",
      "thread": ["Thread halinde 5 tweet"],
      "hashtags": ["1-2 hashtag"],
      "engagement_hook": "Tartışma başlatıcı soru",
      "cta": "Call-to-action"
    },
    "LinkedIn": {
      "post": "LinkedIn post (profesyonel ton)",
      "hook": "Dikkat çekici açılış",
      "hashtags": ["5 profesyonel hashtag"],
      "cta": "Call-to-action",
      "engagement_question": "Yorum çekici soru"
    },
    "YouTube": {
      "shorts_script": "YouTube Shorts scripti",
      "community_post": "Community tab postu",
      "title_suggestion": "Video başlık önerisi",
      "thumbnail_tip": "Thumbnail önerisi",
      "cta": "Call-to-action"
    },
    "Facebook": {
      "post": "Facebook postu",
      "hashtags": ["5 hashtag"],
      "group_version": "Facebook grupları için versiyon",
      "share_hook": "Paylaşım teşviki",
      "cta": "Call-to-action"
    }
  },
  "cross_platform_strategy": "Platformlar arası strateji önerisi",
  "repurposing_calendar": "İçeriği ne zaman hangi platformda paylaşmalı"
}`

    const userPrompt = `ORİJİNAL İÇERİK:
"""
${content}
"""

Niş: ${niche || 'Genel'}
Hedef Platformlar: ${targetPlatforms.join(', ')}

Bu içeriği her platform için optimize et. Her platformun kendine özgü dilini, formatını ve kullanıcı beklentilerini göz önünde bulundur.`

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
        temperature: 0.75,
        max_tokens: 6000,
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
      result = { platforms: {}, error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
