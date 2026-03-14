import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: NextRequest) {
  try {
    const { niche, goals, platform, language = 'tr' } = await request.json()

    if (!niche?.trim()) {
      return NextResponse.json({ error: 'Niş gerekli' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const lang = language === 'tr' ? 'Türkçe' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'ru' ? 'Русский' : 'English'

    const systemPrompt = `Sen 15 yıllık deneyime sahip bir içerik stratejisti ve sosyal medya planlama uzmanısın. Fortune 500 şirketleri ve viral influencer'lar için içerik takvimleri oluşturdun.

Görevin: ${niche} nişi için 30 günlük kapsamlı ve stratejik içerik planı oluşturmak.

PLANLAMA PRENSİPLERİN:
1. İçerik Çeşitliliği: Eğitici (%40), Eğlenceli (%30), İlham Verici (%20), Satış/CTA (%10)
2. Format Çeşitliliği: Carousel, Reel/Video, Tek Görsel, Story serisi, Canlı yayın
3. Haftalık Tema: Her haftanın tutarlı bir alt teması olmalı
4. Engagement Stratejisi: Soru günleri, anket günleri, takipçi içeriği günleri
5. Trend Entegrasyonu: Güncel trendlere açık alanlar bırak
6. Tutarlı Paylaşım: Optimal saat ve gün dağılımı

HEDEFLER: ${goals || 'Organik büyüme ve engagement artışı'}
PLATFORM: ${platform || 'Instagram'}

YANIT DİLİ: ${lang}

JSON formatında 30 günlük plan ver:
{
  "strategy_overview": "Genel strateji özeti ve hedefler",
  "weekly_themes": [
    { "week": 1, "theme": "Hafta teması", "focus": "Odak noktası" }
  ],
  "days": [
    {
      "day": 1,
      "weekday": "Pazartesi",
      "theme": "Günün teması",
      "content_type": "Carousel / Reel / Post / Story / Live",
      "topic": "Spesifik içerik konusu",
      "hook": "Dikkat çekici açılış cümlesi",
      "description": "İçerik açıklaması ve ne anlatılacağı",
      "cta": "Call-to-action önerisi",
      "hashtags": ["5 hashtag"],
      "best_time": "Paylaşım saati",
      "engagement_tip": "Etkileşim artırma ipucu",
      "content_pillar": "Eğitici / Eğlenceli / İlham Verici / Satış"
    }
  ],
  "bonus_ideas": ["5 adet bonus içerik fikri"],
  "content_tips": ["Genel içerik üretim ipuçları"],
  "engagement_strategy": "30 günlük engagement stratejisi",
  "success_metrics": ["Takip edilmesi gereken metrikler"]
}`

    const userPrompt = `Niş: ${niche}
Platform: ${platform || 'Instagram'}  
Hedefler: ${goals || 'Organik büyüme, takipçi artışı, engagement yükseltme'}

30 günlük profesyonel ve uygulanabilir içerik planı oluştur. Her gün için spesifik, yaratıcı ve özgün fikirler sun.`

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
        temperature: 0.8,
        max_tokens: 8000,
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
      result = { days: [], error: true }
    }

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
