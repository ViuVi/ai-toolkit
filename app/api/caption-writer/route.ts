import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callGroqAI, parseJSONResponse, checkCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 2

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, platform, tone, includeEmojis, includeHashtags, userId, language = 'en' } = body

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Konu gerekli' : 'Topic is required' },
        { status: 400 }
      )
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya içerik uzmanısın. Profesyonel caption'lar yazıyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a social media content expert. You write professional captions. Respond only in JSON format.`

    const emojiNote = includeEmojis 
      ? (language === 'tr' ? 'Emoji kullan.' : 'Include emojis.') 
      : (language === 'tr' ? 'Emoji kullanma.' : 'No emojis.')
    
    const hashtagNote = includeHashtags 
      ? (language === 'tr' ? 'Hashtag ekle.' : 'Include hashtags.') 
      : (language === 'tr' ? 'Hashtag ekleme.' : 'No hashtags.')

    const userPrompt = language === 'tr'
      ? `"${topic}" konusu için ${platform} platformunda ${tone} tonunda 4 caption yaz.
${emojiNote} ${hashtagNote}

JSON formatında yanıt ver:
{
  "captions": [
    {"id": 1, "caption": "caption metni", "characterCount": 150, "hookType": "soru/şok/hikaye", "cta": "takip et/yorum yap"},
    {"id": 2, "caption": "caption metni", "characterCount": 120, "hookType": "merak", "cta": "kaydet"}
  ]
}

Sadece JSON döndür.`
      : `Write 4 captions for "${topic}" on ${platform} platform in ${tone} tone.
${emojiNote} ${hashtagNote}

Respond in JSON format:
{
  "captions": [
    {"id": 1, "caption": "caption text", "characterCount": 150, "hookType": "question/shock/story", "cta": "follow/comment"},
    {"id": 2, "caption": "caption text", "characterCount": 120, "hookType": "curiosity", "cta": "save"}
  ]
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.85,
      maxTokens: 2000
    })

    const parsed = parseJSONResponse(aiResponse)
    const captions = parsed.captions || parsed

    return NextResponse.json({ captions })

  } catch (error: any) {
    console.error('Caption Writer Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
