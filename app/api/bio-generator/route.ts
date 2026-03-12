import { NextRequest, NextResponse } from 'next/server'
import { callGroqAI, parseJSONResponse } from '@/lib/groq'

// Ücretsiz araç - kredi almıyor

export async function POST(request: NextRequest) {
  try {
    const { name, profession, platform, style, language = 'en' } = await request.json()

    if (!profession) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Meslek gerekli' : 'Profession is required' },
        { status: 400 }
      )
    }

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya bio yazarısın. Kısa, etkileyici biolar yazıyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a social media bio writer. You write short, impactful bios. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `${name ? name + ' için ' : ''}${profession} mesleği için ${platform} platformunda ${style} tarzında bir bio yaz.

JSON formatında yanıt ver:
{
  "bio": "bio metni buraya",
  "characterCount": 120
}

Sadece JSON döndür.`
      : `Write a ${style} style bio for ${name ? name + ', a ' : 'a '}${profession} on ${platform} platform.

Respond in JSON format:
{
  "bio": "bio text here",
  "characterCount": 120
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.85,
      maxTokens: 500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json({ bio: parsed })

  } catch (error: any) {
    console.error('Bio Generator Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
