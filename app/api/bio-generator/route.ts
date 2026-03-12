import { NextRequest, NextResponse } from 'next/server'
import { generateJSONWithGroq } from '@/lib/groq'

// Bu ücretsiz bir araç - kredi almıyor

export async function POST(request: NextRequest) {
  try {
    const { profession, personality, platform, language = 'en' } = await request.json()

    if (!profession) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Meslek/alan gerekli' : 'Profession required' },
        { status: 400 }
      )
    }

    const platformInfo = platform || 'Instagram'
    const personalityInfo = personality || (language === 'tr' ? 'profesyonel' : 'professional')

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya bio yazarısın.
         Kısa, öz ve etkileyici biolar yazıyorsun.
         Her bio platforma uygun karakter limitinde olmalı.`
      : `You are a social media bio writer.
         You write short, concise, and impactful bios.
         Each bio should be within platform character limits.`

    const userPrompt = language === 'tr'
      ? `"${profession}" alanında, ${personalityInfo} kişilikte biri için ${platformInfo} platformuna uygun 5 farklı bio yaz.

Her bio:
- Platforma uygun uzunlukta
- Dikkat çekici
- Profesyonel ama kişilikli
- Uygun emojiler içermeli

JSON formatında yanıt ver:
{
  "bios": [
    {
      "text": "bio metni",
      "style": "stil açıklaması",
      "character_count": sayı,
      "emojis_used": ["emoji1", "emoji2"]
    }
  ]
}`
      : `Write 5 different bios for someone in "${profession}" field with ${personalityInfo} personality for ${platformInfo} platform.

Each bio:
- Platform-appropriate length
- Attention-grabbing
- Professional but with personality
- Include appropriate emojis

Respond in JSON format:
{
  "bios": [
    {
      "text": "bio text",
      "style": "style description",
      "character_count": number,
      "emojis_used": ["emoji1", "emoji2"]
    }
  ]
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.85,
      maxTokens: 1500
    })

    return NextResponse.json({ bios: result.bios || [] })

  } catch (error: any) {
    console.error('Bio Generator Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
