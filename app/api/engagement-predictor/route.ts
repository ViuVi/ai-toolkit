import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { content, platform, postTime, userId, language = 'en' } = await request.json()
    if (!content) return NextResponse.json({ error: language === 'tr' ? 'İçerik gerekli' : 'Content required' }, { status: 400 })

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 5) return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
    }

    const prediction = predictEngagement(content, platform, postTime, language)

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 5, total_used: c.total_used + 5, updated_at: new Date().toISOString() }).eq('user_id', userId)
    }

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error('Engagement Predictor Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

function predictEngagement(content: string, platform: string, postTime: string, language: string) {
  const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(content)
  const hasQuestion = content.includes('?')
  const hasHashtag = content.includes('#')
  const wordCount = content.split(' ').length
  const isOptimalLength = wordCount > 10 && wordCount < 100

  let baseScore = 50
  if (hasEmoji) baseScore += 15
  if (hasQuestion) baseScore += 10
  if (hasHashtag) baseScore += 5
  if (isOptimalLength) baseScore += 10

  const likeRange = { min: Math.floor(baseScore * 10), max: Math.floor(baseScore * 30) }
  const commentRange = { min: Math.floor(baseScore * 0.5), max: Math.floor(baseScore * 2) }
  const shareRange = { min: Math.floor(baseScore * 0.2), max: Math.floor(baseScore * 0.8) }

  return {
    overallScore: Math.min(100, baseScore + Math.floor(Math.random() * 10)),
    predictions: {
      likes: `${likeRange.min}-${likeRange.max}`,
      comments: `${commentRange.min}-${commentRange.max}`,
      shares: `${shareRange.min}-${shareRange.max}`
    },
    factors: {
      emojiImpact: hasEmoji ? '+15%' : '0%',
      questionImpact: hasQuestion ? '+10%' : '0%',
      hashtagImpact: hasHashtag ? '+5%' : '0%',
      lengthImpact: isOptimalLength ? '+10%' : '-5%'
    },
    bestTimeToPost: ['09:00', '12:00', '18:00', '21:00'][Math.floor(Math.random() * 4)],
    platform,
    tips: language === 'tr'
      ? ['Hook ile başlayın', 'CTA ekleyin', 'Trend hashtag kullanın']
      : ['Start with a hook', 'Add CTA', 'Use trending hashtags']
  }
}
