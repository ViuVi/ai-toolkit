import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJSONWithGroq, checkAndDeductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 2

export async function POST(request: NextRequest) {
  try {
    const { text, style, length, userId, language = 'en' } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: language === 'tr' ? 'Metin gerekli' : 'Text required' },
        { status: 400 }
      )
    }

    if (userId) {
      const creditCheck = await checkAndDeductCredits(supabase, userId, CREDIT_COST, language)
      if (!creditCheck.success) {
        return NextResponse.json({ error: creditCheck.error }, { status: 403 })
      }
    }

    const styleInfo = style || (language === 'tr' ? 'profesyonel' : 'professional')
    const lengthInfo = length || (language === 'tr' ? 'orta' : 'medium')

    const systemPrompt = language === 'tr'
      ? `Sen metin özetleme uzmanısın.
         Ana fikirleri koruyarak özlü özetler yazıyorsun.
         Özet, orijinal metnin en önemli noktalarını içermeli.`
      : `You are a text summarization expert.
         You write concise summaries while preserving main ideas.
         Summary should contain the most important points of the original text.`

    const userPrompt = language === 'tr'
      ? `Aşağıdaki metni ${styleInfo} tarzda, ${lengthInfo} uzunlukta özetle.

Metin:
"""
${text}
"""

JSON formatında yanıt ver:
{
  "summary": {
    "short": "1-2 cümlelik özet",
    "medium": "paragraf özet",
    "bullet_points": ["madde 1", "madde 2", "madde 3"],
    "key_takeaways": ["ana çıkarım 1", "ana çıkarım 2"],
    "word_count_original": orijinal kelime sayısı,
    "word_count_summary": özet kelime sayısı
  }
}`
      : `Summarize the following text in ${styleInfo} style, ${lengthInfo} length.

Text:
"""
${text}
"""

Respond in JSON format:
{
  "summary": {
    "short": "1-2 sentence summary",
    "medium": "paragraph summary",
    "bullet_points": ["point 1", "point 2", "point 3"],
    "key_takeaways": ["key takeaway 1", "key takeaway 2"],
    "word_count_original": original word count,
    "word_count_summary": summary word count
  }
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.5,
      maxTokens: 2000
    })

    return NextResponse.json({ summary: result.summary || result })

  } catch (error: any) {
    console.error('Summarize Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
