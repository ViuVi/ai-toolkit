import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, hookType, count, userId, language = 'en' } = await request.json()
    if (!topic) return NextResponse.json({ error: language === 'tr' ? 'Konu gerekli' : 'Topic required' }, { status: 400 })

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
    }

    const hooks = await generateHooks(topic, platform, hookType, count || 5, language)

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2, updated_at: new Date().toISOString() }).eq('user_id', userId)
    }

    return NextResponse.json({ hooks })
  } catch (error) {
    console.error('Hook Generator Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function generateHooks(topic: string, platform: string, hookType: string, count: number, language: string) {
  const prompt = language === 'tr'
    ? `"${topic}" konusu için ${count} farklı dikkat çekici hook yaz. Her biri kısa ve vurucu olsun. Sadece hook'ları yaz, numaralandırma yapma.`
    : `Write ${count} different attention-grabbing hooks for "${topic}". Each should be short and punchy. Only write the hooks, no numbering.`

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.8, return_full_text: false } }),
    })
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const lines = text.split('\n').filter((l: string) => l.trim().length > 10).slice(0, count)
      if (lines.length >= 2) {
        return lines.map((hook: string, i: number) => ({ id: i + 1, hook: hook.replace(/^\d+[\.\):\-]\s*/, '').replace(/^["']|["']$/g, '').trim(), type: hookType }))
      }
    }
  } catch (e) { console.error('AI Error:', e) }

  const templates: Record<string, string[]> = {
    tr: [`${topic} hakkında kimsenin bilmediği şey...`, `Dur! ${topic} hakkında bunu bilmen lazım`, `${topic} ile ilgili en büyük hata`, `Neden herkes ${topic} konusunda yanılıyor?`, `${topic} için 3 saniyende çözüm`],
    en: [`What nobody tells you about ${topic}...`, `Stop! You need to know this about ${topic}`, `The biggest mistake with ${topic}`, `Why everyone is wrong about ${topic}?`, `${topic} solution in 3 seconds`]
  }
  return (templates[language] || templates.en).slice(0, count).map((hook, i) => ({ id: i + 1, hook, type: hookType }))
}
