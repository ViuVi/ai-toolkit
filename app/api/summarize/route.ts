import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { text, userId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Kredi kontrolü
    if (userId) {
      const { data: credits, error: creditsError } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      console.log('💳 Credits check:', credits, creditsError)

      if (creditsError || !credits) {
        return NextResponse.json({ error: 'Credits not found' }, { status: 403 })
      }

      if (credits.balance < 2) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
      }
    }

    console.log('📝 Summarizing text...')

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: { max_length: 150, min_length: 30 },
        }),
      }
    )

    const result = await response.json()

    if (result.error) {
      if (result.error.includes('loading')) {
        return NextResponse.json({ error: 'Model is loading. Please try again in 20 seconds.' }, { status: 503 })
      }
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const summary = result[0]?.summary_text || 'Could not generate summary'

    // Kredi düşür ve geçmişe ekle
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
            balance: currentCredits.balance - 2,
            total_used: currentCredits.total_used + 2,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'summarize',
            tool_display_name: 'Text Summarizer',
            credits_used: 2,
            input_preview: text.substring(0, 200),
            output_preview: summary.substring(0, 200),
          })
      }
    }

    return NextResponse.json({ summary })

  } catch (error) {
    console.log('❌ Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}