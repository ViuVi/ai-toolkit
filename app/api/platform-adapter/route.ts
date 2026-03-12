import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJSONWithGroq, checkAndDeductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 3

export async function POST(request: NextRequest) {
  try {
    const { content, sourcePlatform, targetPlatforms, userId, language = 'en' } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: language === 'tr' ? 'İçerik gerekli' : 'Content required' },
        { status: 400 }
      )
    }

    if (userId) {
      const creditCheck = await checkAndDeductCredits(supabase, userId, CREDIT_COST, language)
      if (!creditCheck.success) {
        return NextResponse.json({ error: creditCheck.error }, { status: 403 })
      }
    }

    const targets = targetPlatforms || ['Instagram', 'Twitter', 'LinkedIn', 'TikTok']
    const source = sourcePlatform || 'general'

    const systemPrompt = language === 'tr'
      ? `Sen çok platformlu içerik stratejistisin.
         Bir içeriği farklı platformlara uygun şekilde adapte ediyorsun.
         Her platformun kendine özgü formatını, tonunu ve karakter limitlerini biliyorsun.`
      : `You are a multi-platform content strategist.
         You adapt content for different platforms appropriately.
         You know each platform's unique format, tone, and character limits.`

    const userPrompt = language === 'tr'
      ? `Şu içeriği ${targets.join(', ')} platformlarına uyarla:

Orijinal içerik:
"""
${content}
"""

Her platform için:
- O platforma özgü format
- Uygun karakter limiti
- Platform tonu
- Hashtag/mention önerileri

JSON formatında yanıt ver:
{
  "adaptations": [
    {
      "platform": "platform adı",
      "content": "uyarlanmış içerik",
      "character_count": sayı,
      "format": "post/reel/story/thread vb.",
      "hashtags": ["hashtag1", "hashtag2"],
      "best_time": "paylaşım zamanı",
      "tips": ["ipucu"]
    }
  ],
  "repurpose_ideas": ["ek fikir 1", "ek fikir 2"]
}`
      : `Adapt this content for ${targets.join(', ')} platforms:

Original content:
"""
${content}
"""

For each platform:
- Platform-specific format
- Appropriate character limit
- Platform tone
- Hashtag/mention suggestions

Respond in JSON format:
{
  "adaptations": [
    {
      "platform": "platform name",
      "content": "adapted content",
      "character_count": number,
      "format": "post/reel/story/thread etc.",
      "hashtags": ["hashtag1", "hashtag2"],
      "best_time": "posting time",
      "tips": ["tip"]
    }
  ],
  "repurpose_ideas": ["additional idea 1", "additional idea 2"]
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.75,
      maxTokens: 3000
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Platform Adapter Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
