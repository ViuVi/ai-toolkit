import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { product, objections, userId, language } = await request.json()

    if (!objections) {
      return NextResponse.json({ error: 'Objections are required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits, error: creditsError } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (creditsError || !credits) {
        return NextResponse.json({ error: 'Credits not found' }, { status: 403 })
      }

      if (credits.balance < 3) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
      }
    }

    const prompt = language === 'tr'
      ? `Bir SaaS satış koçu gibi davran. Ürün: ${product || 'SaaS ürünü'}. Müşteri itirazları: ${objections}. Her itiraz için kısa, ikna edici ve empatik bir cevap yaz. Cevapları madde imleriyle listele.`
      : `Act as a SaaS sales coach. Product: ${product || 'a SaaS product'}. Customer objections: ${objections}. For each objection, write a short, persuasive, and empathetic reply. List the replies as bullets.`

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/Qwen/Qwen2.5-7B-Instruct',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 350,
            temperature: 0.6,
          },
        }),
      }
    )

    const rawText = await response.text()
    let result: any = null
    try {
      result = rawText ? JSON.parse(rawText) : null
    } catch {
      result = null
    }

    if (!response.ok || result?.error) {
      const errorMessage = result?.error || rawText || 'Hugging Face request failed'
      if (errorMessage.includes('loading')) {
        return NextResponse.json({ error: 'Model is loading. Please try again in 20 seconds.' }, { status: 503 })
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status || 500 })
    }

    const responses = Array.isArray(result)
      ? result[0]?.generated_text
      : result?.generated_text
    const output = responses || 'Could not generate responses'

    if (userId) {
      const { data: currentCredits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (currentCredits) {
        await supabase
          .from('credits')
          .update({
            balance: currentCredits.balance - 3,
            total_used: currentCredits.total_used + 3,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'objection-crusher',
            tool_display_name: 'Objection Crusher',
            credits_used: 3,
            input_preview: `${product || ''} ${objections}`.trim().substring(0, 200),
            output_preview: output.substring(0, 200),
          })
      }
    }

    return NextResponse.json({ responses: output })
  } catch (error) {
    console.log('❌ Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
