import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { content, platform, userId, language = 'en' } = await request.json()
    if (!content) return NextResponse.json({ error: language === 'tr' ? 'İçerik gerekli' : 'Content required' }, { status: 400 })

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 3) return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
    }

    const analysis = await analyzeViralPotential(content, platform, language)

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 3, total_used: c.total_used + 3, updated_at: new Date().toISOString() }).eq('user_id', userId)
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Viral Score Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function analyzeViralPotential(content: string, platform: string, language: string) {
  const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(content)
  const hasQuestion = content.includes('?')
  const hasHashtag = content.includes('#')
  const wordCount = content.split(' ').length
  const hasHook = content.toLowerCase().includes('bu') || content.toLowerCase().includes('this') || content.toLowerCase().includes('?')

  let score = 50
  if (hasEmoji) score += 10
  if (hasQuestion) score += 10
  if (hasHashtag) score += 5
  if (wordCount < 50) score += 10
  if (wordCount > 20 && wordCount < 100) score += 5
  if (hasHook) score += 10
  score = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 15)))

  const factors = []
  if (hasEmoji) factors.push(language === 'tr' ? '✅ Emoji kullanımı' : '✅ Emoji usage')
  else factors.push(language === 'tr' ? '❌ Emoji eksik' : '❌ Missing emojis')
  if (hasQuestion) factors.push(language === 'tr' ? '✅ Soru içeriyor' : '✅ Contains question')
  if (hasHook) factors.push(language === 'tr' ? '✅ Hook mevcut' : '✅ Has hook')
  else factors.push(language === 'tr' ? '❌ Hook eksik' : '❌ Missing hook')
  if (wordCount < 50) factors.push(language === 'tr' ? '✅ Kısa ve öz' : '✅ Short and concise')
  else factors.push(language === 'tr' ? '⚠️ Biraz uzun' : '⚠️ A bit long')

  const improvements = language === 'tr'
    ? ['İlk cümleyi daha dikkat çekici yap', 'Daha fazla emoji ekle', 'Soru ile aç', 'CTA ekle', 'Trend hashtag kullan']
    : ['Make first sentence more attention-grabbing', 'Add more emojis', 'Open with a question', 'Add CTA', 'Use trending hashtags']

  return {
    score,
    rating: score >= 80 ? '🔥 Viral Potential!' : score >= 60 ? '👍 Good' : score >= 40 ? '📈 Average' : '📉 Needs Work',
    factors,
    improvements: improvements.slice(0, 3),
    platform,
    wordCount
  }
}
