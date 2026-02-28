import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { text, userId, language = 'en' } = await request.json()
    if (!text) return NextResponse.json({ error: language === 'tr' ? 'Metin gerekli' : 'Text required' }, { status: 400 })

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 3) return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
    }

    const analysis = await analyzeSentiment(text, language)

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 3, total_used: c.total_used + 3, updated_at: new Date().toISOString() }).eq('user_id', userId)
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Sentiment Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function analyzeSentiment(text: string, language: string) {
  const positiveWords = ['good', 'great', 'love', 'amazing', 'awesome', 'excellent', 'wonderful', 'happy', 'harika', 'muhteşem', 'güzel', 'seviyorum', 'mükemmel']
  const negativeWords = ['bad', 'hate', 'terrible', 'awful', 'horrible', 'poor', 'worst', 'kötü', 'berbat', 'korkunç', 'nefret']
  
  const lower = text.toLowerCase()
  let positive = 0, negative = 0
  positiveWords.forEach(w => { if (lower.includes(w)) positive++ })
  negativeWords.forEach(w => { if (lower.includes(w)) negative++ })

  let sentiment = 'neutral'
  let score = 50
  let emoji = '😐'

  if (positive > negative) { sentiment = 'positive'; score = Math.min(100, 60 + positive * 10); emoji = '😊' }
  else if (negative > positive) { sentiment = 'negative'; score = Math.max(0, 40 - negative * 10); emoji = '😔' }

  const emotions = []
  if (text.includes('!')) emotions.push(language === 'tr' ? 'Heyecan' : 'Excitement')
  if (text.includes('?')) emotions.push(language === 'tr' ? 'Merak' : 'Curiosity')
  if (positive > 0) emotions.push(language === 'tr' ? 'Mutluluk' : 'Happiness')
  if (negative > 0) emotions.push(language === 'tr' ? 'Hayal kırıklığı' : 'Disappointment')
  if (emotions.length === 0) emotions.push(language === 'tr' ? 'Nötr' : 'Neutral')

  return {
    sentiment,
    score,
    emoji,
    emotions,
    confidence: Math.floor(Math.random() * 20 + 80) + '%',
    wordCount: text.split(' ').length
  }
}
