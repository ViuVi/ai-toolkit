import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callAI, checkCredits, deductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 8

export async function POST(request: NextRequest) {
  try {
    const { content, sourceType, userId, language = 'tr' } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })
    }

    // TEST MODE: const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    // TEST MODE: if (!creditCheck.ok) {
      // TEST MODE: return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    // TEST MODE: }

    const systemPrompt = `Sen içerik dönüştürme uzmanısın. Bir içeriği 7 farklı platforma profesyonelce uyarla.

JSON formatında yanıt ver:
{
  "original_summary": "Orijinal içeriğin özeti",
  "platforms": {
    "instagram_post": {
      "content": "Instagram post metni (max 2200 karakter, emojiler dahil)",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
      "best_time": "19:00-21:00",
      "content_type": "Carousel önerisi",
      "hook": "Dikkat çekici ilk cümle"
    },
    "instagram_reels": {
      "hook": "İlk 1 saniye hook",
      "script": "15-30 saniyelik script",
      "text_overlays": ["Overlay 1", "Overlay 2", "Overlay 3"],
      "trending_audio": "Önerilen ses türü",
      "cta": "Call to action"
    },
    "tiktok": {
      "hook": "Şok edici açılış",
      "script": "15-60 saniyelik script",
      "text_overlays": ["Text 1", "Text 2"],
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
      "trend_connection": "Hangi trend'e bağlanabilir"
    },
    "twitter": {
      "thread": [
        "Tweet 1 (hook) - max 280 karakter",
        "Tweet 2 - max 280 karakter",
        "Tweet 3 - max 280 karakter",
        "Tweet 4 (CTA) - max 280 karakter"
      ],
      "single_tweet": "Tek tweet versiyonu - max 280 karakter",
      "best_time": "08:00-10:00, 17:00-19:00"
    },
    "linkedin": {
      "content": "Profesyonel LinkedIn post (storytelling formatında)",
      "hook": "Profesyonel hook",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
      "cta": "Profesyonel CTA"
    },
    "youtube_shorts": {
      "title": "Kısa başlık",
      "hook": "İlk 2 saniye",
      "script": "60 saniyelik script",
      "thumbnail_text": "Thumbnail yazısı"
    },
    "pinterest": {
      "title": "Pin başlığı",
      "description": "Pin açıklaması (500 karakter)",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "board_suggestion": "Önerilen pano"
    }
  },
  "content_calendar": {
    "day_1": { "platform": "Instagram Post", "time": "10:00" },
    "day_2": { "platform": "TikTok", "time": "19:00" },
    "day_3": { "platform": "Twitter Thread", "time": "08:00" },
    "day_4": { "platform": "LinkedIn", "time": "09:00" },
    "day_5": { "platform": "Instagram Reels", "time": "20:00" },
    "day_6": { "platform": "YouTube Shorts", "time": "18:00" },
    "day_7": { "platform": "Pinterest", "time": "21:00" }
  }
}`

    const userPrompt = `Kaynak içerik tipi: ${sourceType || 'Blog yazısı'}

ORİJİNAL İÇERİK:
"""
${content}
"""

Bu içeriği 7 farklı platforma profesyonelce uyarla. Her platform için o platformun özelliklerine uygun format kullan.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.75, maxTokens: 6000 })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // TEST MODE: await deductCredits(supabase, userId, CREDIT_COST)

    return NextResponse.json({ 
      success: true, 
      repurposed: result.data,
      creditsUsed: CREDIT_COST 
    })

  } catch (error: any) {
    console.error('Content Repurposer Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
