import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { text, length, style, userId, language = 'en' } = await request.json()
    if (!text) return NextResponse.json({ error: language === 'tr' ? 'Metin gerekli' : 'Text required' }, { status: 400 })

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
    }

    const summary = await summarizeText(text, length, style, language)

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2, updated_at: new Date().toISOString() }).eq('user_id', userId)
    }

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summarize Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function summarizeText(text: string, length: string, style: string, language: string) {
  const lengthDesc = length === 'short' ? '1-2 cümle' : length === 'medium' ? '3-4 cümle' : '5-6 cümle'
  const prompt = language === 'tr'
    ? `Bu metni ${lengthDesc} ile özetle:\n\n"${text.substring(0, 2000)}"`
    : `Summarize this text in ${length === 'short' ? '1-2' : length === 'medium' ? '3-4' : '5-6'} sentences:\n\n"${text.substring(0, 2000)}"`

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.5, return_full_text: false } }),
    })
    if (response.ok) {
      const result = await response.json()
      const summary = (result[0]?.generated_text || '').replace(/^["']|["']$/g, '').trim()
      if (summary.length > 30) {
        return { summary, originalLength: text.length, summaryLength: summary.length, reduction: Math.round((1 - summary.length / text.length) * 100) + '%' }
      }
    }
  } catch (e) { console.error('AI Error:', e) }

  const words = text.split(' ')
  const targetLen = length === 'short' ? 30 : length === 'medium' ? 60 : 100
  const summary = words.slice(0, targetLen).join(' ') + '...'
  return { summary, originalLength: text.length, summaryLength: summary.length, reduction: Math.round((1 - summary.length / text.length) * 100) + '%' }
}
