import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

export async function POST(request: NextRequest) {
  try {
    const { text, userId, language = 'en' } = await request.json()

    if (!text) {
      return NextResponse.json({ error: language === 'tr' ? 'Metin gerekli' : 'Text required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const seed = Date.now()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] Aşağıdaki metni özetle. 3 farklı uzunlukta özet ver.

METİN:
"${text}"

JSON formatında yanıt ver:
{
  "short": "1-2 cümlelik çok kısa özet (sosyal medya için)",
  "medium": "1 paragraf özet (email veya rapor için)",
  "detailed": "detaylı özet, ana noktalar dahil",
  "keyPoints": ["ana nokta 1", "ana nokta 2", "ana nokta 3"],
  "wordCount": {
    "original": orijinal kelime sayısı,
    "short": kısa özet kelime sayısı,
    "medium": orta özet kelime sayısı,
    "detailed": detaylı özet kelime sayısı
  }
}`
      : `[SEED:${seed}] Summarize the following text. Provide 3 different length summaries.

TEXT:
"${text}"

Respond in JSON format:
{
  "short": "1-2 sentence very short summary (for social media)",
  "medium": "1 paragraph summary (for email or report)",
  "detailed": "detailed summary including main points",
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "wordCount": {
    "original": original word count,
    "short": short summary word count,
    "medium": medium summary word count,
    "detailed": detailed summary word count
  }
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1500, temperature: 0.7, top_p: 0.9, return_full_text: false } })
    })

    let summary: any = null
    if (response.ok) {
      const result = await response.json()
      const genText = result[0]?.generated_text || ''
      const match = genText.match(/\{[\s\S]*\}/)
      if (match) {
        try { summary = JSON.parse(match[0]) } catch (e) { console.error('Parse error:', e) }
      }
    }

    const originalWords = text.split(/\s+/).length

    if (!summary || !summary.short) {
      const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 10)
      summary = {
        short: sentences[0]?.trim() || text.substring(0, 100),
        medium: sentences.slice(0, 3).join('. ').trim() || text.substring(0, 300),
        detailed: sentences.slice(0, 5).join('. ').trim() || text.substring(0, 500),
        keyPoints: sentences.slice(0, 3).map((s: string) => s.trim().substring(0, 80)),
        wordCount: {
          original: originalWords,
          short: 15,
          medium: 50,
          detailed: 100
        }
      }
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2 }).eq('user_id', userId)
    }

    return NextResponse.json({ summary, originalText: text })
  } catch (error) {
    console.error('Summarize Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
