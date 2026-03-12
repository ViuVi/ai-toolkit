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
    const { comment, tone, platform, userId, language = 'en' } = await request.json()

    if (!comment) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Yorum gerekli' : 'Comment is required' },
        { status: 400 }
      )
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya yöneticisisin. Yorumlara profesyonel yanıtlar yazıyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a social media manager. You write professional replies to comments. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `Şu yoruma ${tone || 'samimi'} tonunda ${platform || 'Instagram'} için 3 farklı yanıt yaz:

"${comment}"

JSON formatında yanıt ver:
{
  "replies": [
    {"id": 1, "reply": "yanıt metni", "tone": "samimi"},
    {"id": 2, "reply": "yanıt metni", "tone": "profesyonel"},
    {"id": 3, "reply": "yanıt metni", "tone": "eğlenceli"}
  ]
}

Sadece JSON döndür.`
      : `Write 3 different replies to this comment in ${tone || 'friendly'} tone for ${platform || 'Instagram'}:

"${comment}"

Respond in JSON format:
{
  "replies": [
    {"id": 1, "reply": "reply text", "tone": "friendly"},
    {"id": 2, "reply": "reply text", "tone": "professional"},
    {"id": 3, "reply": "reply text", "tone": "fun"}
  ]
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.8,
      maxTokens: 1000
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json({ replies: parsed.replies || parsed })

  } catch (error: any) {
    console.error('Comment Reply Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
