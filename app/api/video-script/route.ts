import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJSONWithGroq, checkAndDeductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 4

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration, style, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Konu gerekli' : 'Topic required' },
        { status: 400 }
      )
    }

    // Kredi kontrolü
    if (userId) {
      const creditCheck = await checkAndDeductCredits(supabase, userId, CREDIT_COST, language)
      if (!creditCheck.success) {
        return NextResponse.json({ error: creditCheck.error }, { status: 403 })
      }
    }

    const platformInfo = platform || 'YouTube'
    const durationInfo = duration || '60 seconds'
    const styleInfo = style || (language === 'tr' ? 'eğitici' : 'educational')

    const systemPrompt = language === 'tr'
      ? `Sen profesyonel bir video script yazarısın. ${platformInfo} için viral olabilecek scriptler yazıyorsun.
         Hook, gövde ve CTA bölümlerini net ayır.
         İzleyiciyi ilk 3 saniyede yakala, sonuna kadar tut.`
      : `You are a professional video script writer. You write scripts that can go viral on ${platformInfo}.
         Clearly separate hook, body, and CTA sections.
         Capture the viewer in the first 3 seconds, keep them until the end.`

    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için ${platformInfo} platformunda ${durationInfo} süreli, ${styleInfo} tarzında bir video scripti yaz.

Script şunları içermeli:
1. Hook (ilk 3 saniye) - izleyiciyi yakala
2. Giriş - konuyu tanıt
3. Ana içerik - 3-5 madde
4. Sonuç ve CTA

JSON formatında yanıt ver:
{
  "script": {
    "title": "video başlığı önerisi",
    "hook": "dikkat çekici açılış (ilk 3 saniye)",
    "intro": "giriş bölümü",
    "main_points": [
      {"point": "madde 1", "script": "bu bölüm için script"},
      {"point": "madde 2", "script": "bu bölüm için script"},
      {"point": "madde 3", "script": "bu bölüm için script"}
    ],
    "conclusion": "sonuç bölümü",
    "cta": "call-to-action",
    "thumbnail_idea": "thumbnail önerisi",
    "tags": ["tag1", "tag2", "tag3"]
  }
}`
      : `Write a video script for "${topic}" on ${platformInfo} platform, ${durationInfo} long, in ${styleInfo} style.

Script should include:
1. Hook (first 3 seconds) - capture the viewer
2. Intro - introduce the topic
3. Main content - 3-5 points
4. Conclusion and CTA

Respond in JSON format:
{
  "script": {
    "title": "suggested video title",
    "hook": "attention-grabbing opening (first 3 seconds)",
    "intro": "introduction section",
    "main_points": [
      {"point": "point 1", "script": "script for this section"},
      {"point": "point 2", "script": "script for this section"},
      {"point": "point 3", "script": "script for this section"}
    ],
    "conclusion": "conclusion section",
    "cta": "call-to-action",
    "thumbnail_idea": "thumbnail suggestion",
    "tags": ["tag1", "tag2", "tag3"]
  }
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 3000
    })

    return NextResponse.json({ script: result.script || result })

  } catch (error: any) {
    console.error('Video Script Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
