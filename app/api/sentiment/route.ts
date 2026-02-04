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

      if (credits.balance < 1) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
      }
    }

    console.log('🎭 Analyzing sentiment...')

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/nlptown/bert-base-multilingual-uncased-sentiment',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    )

    const result = await response.json()

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const scores = result[0] || result
    let maxScore = 0
    let sentiment = ''

    for (const item of scores) {
      if (item.score > maxScore) {
        maxScore = item.score
        sentiment = item.label
      }
    }

    const starToSentiment: { [key: string]: { emoji: string; text: string } } = {
      '1 star': { emoji: '😠', text: 'Very Negative' },
      '2 stars': { emoji: '😕', text: 'Negative' },
      '3 stars': { emoji: '😐', text: 'Neutral' },
      '4 stars': { emoji: '🙂', text: 'Positive' },
      '5 stars': { emoji: '😍', text: 'Very Positive' },
    }

    const analysis = starToSentiment[sentiment] || { emoji: '🤔', text: 'Unknown' }

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
            balance: currentCredits.balance - 1,
            total_used: currentCredits.total_used + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'sentiment',
            tool_display_name: 'Sentiment Analysis',
            credits_used: 1,
            input_preview: text.substring(0, 200),
            output_preview: `${analysis.emoji} ${analysis.text} (${Math.round(maxScore * 100)}%)`,
          })
      }
    }

    return NextResponse.json({
      sentiment: analysis.text,
      emoji: analysis.emoji,
      confidence: Math.round(maxScore * 100),
      details: scores
    })

  } catch (error) {
    console.log('❌ Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}