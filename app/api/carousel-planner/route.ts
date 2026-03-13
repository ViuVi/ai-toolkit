import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callAI, checkCredits, deductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 4

export async function POST(request: NextRequest) {
  try {
    const { topic, slideCount, style, platform, userId, language = 'tr' } = await request.json()

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Konu gerekli' }, { status: 400 })
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const count = slideCount || 10

    const systemPrompt = `Sen carousel içerik tasarımcısısın. Yüksek kaydırma oranı ve etkileşim alan carousel'ler planlıyorsun.

JSON formatında yanıt ver:
{
  "carousel_concept": {
    "title": "Carousel başlığı",
    "hook": "Kapak slide hook",
    "value_proposition": "Ne öğrenecekler",
    "target_save_rate": "Hedef kaydetme oranı"
  },
  "cover_slide_options": [
    {
      "headline": "Ana başlık (max 8 kelime)",
      "subheadline": "Alt başlık",
      "visual_style": "Görsel öneri",
      "color_scheme": "Renk önerisi"
    }
  ],
  "slides": [
    {
      "slide_number": 1,
      "type": "Cover",
      "headline": "Dikkat çekici başlık",
      "subtext": "Merak uyandıran alt metin",
      "visual_suggestion": "Görsel öneri",
      "design_notes": "Tasarım notları",
      "swipe_trigger": "Kaydırma tetikleyicisi"
    },
    {
      "slide_number": 2,
      "type": "Problem/Hook",
      "headline": "Problem tanımı",
      "body_text": "Açıklama metni",
      "visual_suggestion": "Görsel öneri",
      "design_notes": "Tasarım notları"
    },
    {
      "slide_number": 3,
      "type": "Content",
      "headline": "İçerik başlığı",
      "key_point": "Ana nokta",
      "supporting_text": "Destekleyici metin",
      "icon_suggestion": "İkon önerisi",
      "visual_suggestion": "Görsel öneri"
    }
  ],
  "caption": {
    "hook": "Caption hook",
    "body": "Caption gövdesi",
    "cta": "Call to action",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
  },
  "design_guidelines": {
    "font_pairing": "Font önerisi",
    "color_palette": ["#renk1", "#renk2", "#renk3"],
    "image_style": "Fotoğraf/İllüstrasyon stili",
    "consistency_tips": ["Tutarlılık ipucu 1", "Tutarlılık ipucu 2"]
  },
  "engagement_tactics": {
    "save_trigger_slide": 5,
    "share_trigger_slide": 8,
    "comment_trigger": "Yorum tetikleyici soru",
    "last_slide_cta": "Son slide CTA"
  },
  "repurpose_options": {
    "thread": "Twitter thread'e nasıl çevrilir",
    "reel": "Reel'e nasıl çevrilir",
    "blog": "Blog yazısına nasıl çevrilir"
  }
}`

    const userPrompt = `Konu: ${topic}
Slide Sayısı: ${count}
Stil: ${style || 'Eğitici'}
Platform: ${platform || 'Instagram'}

Bu konu için ${count} slide'lık profesyonel carousel planı oluştur.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.8, maxTokens: 5000 })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await deductCredits(supabase, userId, CREDIT_COST)

    return NextResponse.json({ 
      success: true, 
      carousel: result.data,
      creditsUsed: CREDIT_COST 
    })

  } catch (error: any) {
    console.error('Carousel Planner Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
