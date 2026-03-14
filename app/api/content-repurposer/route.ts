import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content, platforms, niche, language = 'tr' } = await request.json()
    if (!content?.trim()) return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API yapılandırma hatası' }, { status: 500 })

    const targetPlatforms = platforms?.length > 0 ? platforms : ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube', 'Facebook']
    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen içerik dönüştürme uzmanısın. Her platformun kendine özgü dilini ve formatını biliyorsun. Yanıt dili: ${lang}

JSON formatında yanıt ver:
{
  "original_analysis": "Orijinal içeriğin kısa analizi",
  "platforms": {
    "Instagram": {
      "caption": "Instagram caption (emoji dahil)",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "format_suggestion": "Carousel/Reel/Post",
      "visual_tip": "Görsel önerisi",
      "cta": "Call-to-action",
      "posting_tip": "Paylaşım ipucu"
    },
    "TikTok": {
      "script": "TikTok video scripti",
      "hashtags": ["#hashtag1"],
      "sound_suggestion": "Önerilen ses tipi",
      "hook": "Dikkat çekici açılış",
      "cta": "CTA",
      "trend_tip": "Trend önerisi"
    },
    "Twitter": {
      "tweet": "Ana tweet (280 karakter max)",
      "thread": ["Tweet 1", "Tweet 2", "Tweet 3"],
      "hashtags": ["#hashtag"],
      "engagement_hook": "Tartışma başlatıcı",
      "cta": "CTA"
    },
    "LinkedIn": {
      "post": "LinkedIn postu (profesyonel ton)",
      "hook": "Açılış",
      "hashtags": ["#hashtag"],
      "cta": "CTA",
      "engagement_question": "Yorum çekici soru"
    },
    "YouTube": {
      "shorts_script": "Shorts scripti",
      "community_post": "Community postu",
      "title_suggestion": "Başlık önerisi",
      "thumbnail_tip": "Thumbnail önerisi",
      "cta": "CTA"
    },
    "Facebook": {
      "post": "Facebook postu",
      "hashtags": ["#hashtag"],
      "group_version": "Grup versiyonu",
      "share_hook": "Paylaşım teşviki",
      "cta": "CTA"
    }
  },
  "cross_platform_strategy": "Platformlar arası strateji",
  "repurposing_calendar": "Paylaşım takvimi önerisi"
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `ORİJİNAL İÇERİK:\n${content}\n\nNiş: ${niche || 'Genel'}\nHedef Platformlar: ${targetPlatforms.join(', ')}` }
        ],
        temperature: 0.75,
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
