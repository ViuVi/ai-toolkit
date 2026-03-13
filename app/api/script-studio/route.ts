import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callAI, checkCredits, deductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 6

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration, style, targetEmotion, userId, language = 'tr' } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const systemPrompt = `Sen profesyonel video script yazarı ve içerik stratejistisin. Viral video scripti ve tüm detayları oluştur.

JSON formatında yanıt ver:
{
  "video_concept": {
    "title": "Video başlığı",
    "subtitle": "Alt başlık",
    "one_liner": "Tek cümlelik özet",
    "target_emotion": "Hedef duygu",
    "content_pillar": "İçerik direği"
  },
  "hook_options": [
    {
      "type": "Soru",
      "text": "Hook metni",
      "duration": "3 saniye",
      "visual_suggestion": "Görsel öneri"
    },
    {
      "type": "Şok",
      "text": "Hook metni",
      "duration": "3 saniye",
      "visual_suggestion": "Görsel öneri"
    },
    {
      "type": "Merak",
      "text": "Hook metni",
      "duration": "3 saniye",
      "visual_suggestion": "Görsel öneri"
    }
  ],
  "full_script": {
    "total_duration": "60 saniye",
    "sections": [
      {
        "section": "Hook",
        "timestamp": "0:00-0:03",
        "script": "Söylenecek metin",
        "text_overlay": "Ekran yazısı",
        "visual_notes": "Görsel notlar",
        "energy_level": "Yüksek"
      },
      {
        "section": "Problem",
        "timestamp": "0:03-0:10",
        "script": "Problem tanımı",
        "text_overlay": "Ekran yazısı",
        "visual_notes": "Görsel notlar",
        "energy_level": "Orta"
      },
      {
        "section": "Çözüm/İçerik",
        "timestamp": "0:10-0:45",
        "script": "Ana içerik scripti",
        "key_points": ["Nokta 1", "Nokta 2", "Nokta 3"],
        "text_overlays": ["Overlay 1", "Overlay 2", "Overlay 3"],
        "visual_notes": "Görsel notlar",
        "energy_level": "Değişken"
      },
      {
        "section": "CTA",
        "timestamp": "0:45-0:60",
        "script": "Call to action scripti",
        "text_overlay": "CTA yazısı",
        "visual_notes": "Görsel notlar",
        "energy_level": "Yüksek"
      }
    ]
  },
  "thumbnail_concepts": [
    {
      "style": "Yüz + Metin",
      "main_text": "Thumbnail ana yazısı (max 5 kelime)",
      "subtext": "Alt yazı",
      "expression": "Yüz ifadesi önerisi",
      "colors": ["Ana renk", "Vurgu renk"],
      "elements": ["Element 1", "Element 2"]
    },
    {
      "style": "Before/After",
      "main_text": "Ana yazı",
      "layout": "Sol: Before, Sağ: After",
      "colors": ["Renk 1", "Renk 2"]
    },
    {
      "style": "Merak Uyandırıcı",
      "main_text": "Soru veya merak",
      "blur_element": "Neyi bulanıklaştırmalı",
      "colors": ["Renk 1", "Renk 2"]
    }
  ],
  "title_options": [
    { "title": "Başlık 1", "style": "Merak", "ctr_prediction": "Yüksek" },
    { "title": "Başlık 2", "style": "Değer", "ctr_prediction": "Orta-Yüksek" },
    { "title": "Başlık 3", "style": "Şok", "ctr_prediction": "Çok Yüksek" }
  ],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "caption": "Video açıklaması/caption",
  "posting_strategy": {
    "best_time": "Önerilen paylaşım saati",
    "best_day": "Önerilen gün",
    "cross_post": ["Crosspost önerileri"]
  },
  "production_tips": [
    "Çekim ipucu 1",
    "Çekim ipucu 2",
    "Düzenleme ipucu"
  ]
}`

    const userPrompt = `Konu: ${topic}
Platform: ${platform || 'TikTok/Reels'}
Süre: ${duration || '60 saniye'}
Stil: ${style || 'Eğitici'}
Hedef Duygu: ${targetEmotion || 'Merak + Değer'}

Bu konu için profesyonel video scripti, thumbnail konseptleri ve başlık seçenekleri oluştur.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.8, maxTokens: 5000 })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await deductCredits(supabase, userId, CREDIT_COST)

    return NextResponse.json({ 
      success: true, 
      script: result.data,
      creditsUsed: CREDIT_COST 
    })

  } catch (error: any) {
    console.error('Script Studio Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
