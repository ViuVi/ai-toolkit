import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { caption, hashtags, media, platform, postTime, targetAudience, userId, language = 'en' } = await request.json()

    if (!caption || !platform) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Caption ve platform gerekli' : 'Caption and platform required' 
      }, { status: 400 })
    }

    console.log('🚀 Viral Score - Platform:', platform)

    const analysis = analyzeViralPotential(caption, hashtags, media, platform, postTime, targetAudience, language)

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Viral Score Error:', error)
    return NextResponse.json({ 
      error: language === 'tr' ? 'Bir hata oluştu' : 'An error occurred' 
    }, { status: 500 })
  }
}

function analyzeViralPotential(caption: string, hashtags: string, media: string, platform: string, postTime: string, targetAudience: string, language: string) {
  
  let viralScore = 0
  const factors: any[] = []

  // 1. Caption Analizi (25 puan)
  const captionLength = caption.length
  let captionScore = 0
  
  if (captionLength >= 80 && captionLength <= 200) {
    captionScore = 25
    factors.push({ 
      factor: language === 'tr' ? 'Caption Uzunluğu' : 'Caption Length', 
      score: 25, 
      status: 'perfect',
      message: language === 'tr' ? 'Mükemmel uzunluk!' : 'Perfect length!'
    })
  } else if (captionLength < 80) {
    captionScore = 15
    factors.push({ 
      factor: language === 'tr' ? 'Caption Uzunluğu' : 'Caption Length', 
      score: 15, 
      status: 'warning',
      message: language === 'tr' ? 'Biraz daha uzun olmalı (80-200 karakter)' : 'Should be longer (80-200 characters)'
    })
  } else {
    captionScore = 20
    factors.push({ 
      factor: language === 'tr' ? 'Caption Uzunluğu' : 'Caption Length', 
      score: 20, 
      status: 'good',
      message: language === 'tr' ? 'İyi ama biraz uzun' : 'Good but a bit long'
    })
  }
  viralScore += captionScore

  // 2. Emoji Kullanımı (10 puan)
  const emojiCount = (caption.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length
  let emojiScore = 0
  
  if (emojiCount >= 2 && emojiCount <= 5) {
    emojiScore = 10
    factors.push({ 
      factor: language === 'tr' ? 'Emoji Kullanımı' : 'Emoji Usage', 
      score: 10, 
      status: 'perfect',
      message: language === 'tr' ? `Mükemmel! ${emojiCount} emoji` : `Perfect! ${emojiCount} emojis`
    })
  } else if (emojiCount === 0) {
    emojiScore = 0
    factors.push({ 
      factor: language === 'tr' ? 'Emoji Kullanımı' : 'Emoji Usage', 
      score: 0, 
      status: 'error',
      message: language === 'tr' ? 'Emoji ekleyin! (2-5 arası ideal)' : 'Add emojis! (2-5 ideal)'
    })
  } else {
    emojiScore = 5
    factors.push({ 
      factor: language === 'tr' ? 'Emoji Kullanımı' : 'Emoji Usage', 
      score: 5, 
      status: 'warning',
      message: language === 'tr' ? 'Çok fazla emoji' : 'Too many emojis'
    })
  }
  viralScore += emojiScore

  // 3. Call-to-Action (15 puan)
  const ctaKeywords = {
    tr: ['tıkla', 'beğen', 'yorum', 'paylaş', 'takip', 'kaydır', 'izle', 'linke', 'başla', 'öğren'],
    en: ['click', 'like', 'comment', 'share', 'follow', 'swipe', 'watch', 'link', 'start', 'learn', 'try', 'get', 'download']
  }
  
  const keywords = ctaKeywords[language as keyof typeof ctaKeywords] || ctaKeywords.en
  const hasCTA = keywords.some(word => caption.toLowerCase().includes(word))
  const hasQuestion = caption.includes('?')
  
  let ctaScore = 0
  if (hasCTA && hasQuestion) {
    ctaScore = 15
    factors.push({ 
      factor: 'Call-to-Action', 
      score: 15, 
      status: 'perfect',
      message: language === 'tr' ? 'CTA ve soru var - harika!' : 'CTA and question - great!'
    })
  } else if (hasCTA || hasQuestion) {
    ctaScore = 10
    factors.push({ 
      factor: 'Call-to-Action', 
      score: 10, 
      status: 'good',
      message: language === 'tr' ? 'CTA veya soru ekleyin' : 'Add CTA or question'
    })
  } else {
    ctaScore = 0
    factors.push({ 
      factor: 'Call-to-Action', 
      score: 0, 
      status: 'error',
      message: language === 'tr' ? 'CTA eksik! Etkileşim çağrısı ekleyin' : 'Missing CTA! Add call-to-action'
    })
  }
  viralScore += ctaScore

  // 4. Hashtag Analizi (20 puan)
  const hashtagCount = hashtags ? hashtags.split('#').filter(h => h.trim()).length : 0
  let hashtagScore = 0
  
  const optimalHashtags = {
    instagram: { min: 8, max: 15 },
    tiktok: { min: 3, max: 5 },
    twitter: { min: 1, max: 3 },
    linkedin: { min: 3, max: 5 },
    youtube: { min: 5, max: 10 }
  }
  
  const optimal = optimalHashtags[platform as keyof typeof optimalHashtags] || { min: 5, max: 10 }
  
  if (hashtagCount >= optimal.min && hashtagCount <= optimal.max) {
    hashtagScore = 20
    factors.push({ 
      factor: 'Hashtag', 
      score: 20, 
      status: 'perfect',
      message: language === 'tr' ? `Mükemmel! ${hashtagCount} hashtag` : `Perfect! ${hashtagCount} hashtags`
    })
  } else if (hashtagCount < optimal.min) {
    hashtagScore = 10
    factors.push({ 
      factor: 'Hashtag', 
      score: 10, 
      status: 'warning',
      message: language === 'tr' ? `Daha fazla ekleyin (${optimal.min}-${optimal.max} arası)` : `Add more (${optimal.min}-${optimal.max} range)`
    })
  } else {
    hashtagScore = 15
    factors.push({ 
      factor: 'Hashtag', 
      score: 15, 
      status: 'good',
      message: language === 'tr' ? 'Biraz fazla' : 'Slightly too many'
    })
  }
  viralScore += hashtagScore

  // 5. Medya Tipi (15 puan)
  const mediaScores = {
    instagram: { video: 15, carousel: 12, photo: 8 },
    tiktok: { video: 15, photo: 5 },
    youtube: { video: 15, short: 15 },
    twitter: { video: 12, photo: 8, gif: 10 },
    linkedin: { video: 15, document: 12, photo: 8 }
  }
  
  const platformMedia = mediaScores[platform as keyof typeof mediaScores] || { video: 15, photo: 8 }
  const mediaScore = (platformMedia as any)[media] || 8
  
  factors.push({ 
    factor: language === 'tr' ? 'Medya Tipi' : 'Media Type', 
    score: mediaScore, 
    status: mediaScore >= 12 ? 'perfect' : 'good',
    message: language === 'tr' 
      ? (mediaScore >= 12 ? 'Video içerik - mükemmel!' : 'İyi ama video daha iyi olurdu') 
      : (mediaScore >= 12 ? 'Video content - excellent!' : 'Good but video performs better')
  })
  viralScore += mediaScore

  // 6. Timing (15 puan)
  const hour = postTime ? parseInt(postTime.split(':')[0]) : 12
  const isPeakTime = (hour >= 9 && hour <= 11) || (hour >= 17 && hour <= 21)
  const timingScore = isPeakTime ? 15 : 8
  
  factors.push({ 
    factor: 'Timing', 
    score: timingScore, 
    status: isPeakTime ? 'perfect' : 'warning',
    message: language === 'tr' 
      ? (isPeakTime ? 'Prime time!' : 'Peak saatlerde paylaş (9-11 veya 17-21)') 
      : (isPeakTime ? 'Prime time!' : 'Post during peak hours (9-11 AM or 5-9 PM)')
  })
  viralScore += timingScore

  // Viral kategorisi belirle
  let viralCategory = ''
  let viralColor = ''
  let viralIcon = ''
  
  if (viralScore >= 80) {
    viralCategory = language === 'tr' ? '🔥 Viral Olma Olasılığı Çok Yüksek!' : '🔥 Very High Viral Potential!'
    viralColor = 'green'
    viralIcon = '🚀'
  } else if (viralScore >= 60) {
    viralCategory = language === 'tr' ? '⭐ İyi Viral Potansiyel' : '⭐ Good Viral Potential'
    viralColor = 'blue'
    viralIcon = '📈'
  } else if (viralScore >= 40) {
    viralCategory = language === 'tr' ? '⚠️ Orta Viral Potansiyel' : '⚠️ Medium Viral Potential'
    viralColor = 'yellow'
    viralIcon = '📊'
  } else {
    viralCategory = language === 'tr' ? '❌ Düşük Viral Potansiyel' : '❌ Low Viral Potential'
    viralColor = 'red'
    viralIcon = '📉'
  }

  // İyileştirme önerileri
  const improvements = factors
    .filter(f => f.status !== 'perfect')
    .map(f => f.message)

  // Rakip benchmark (rastgele ama gerçekçi)
  const competitorAverage = Math.floor(50 + Math.random() * 20) // 50-70 arası

  return {
    viralScore,
    maxScore: 100,
    viralCategory,
    viralColor,
    viralIcon,
    factors,
    improvements,
    competitorAverage,
    estimatedReach: {
      min: Math.floor(viralScore * 50),
      max: Math.floor(viralScore * 150),
      unit: language === 'tr' ? 'kişi' : 'people'
    },
    estimatedEngagement: `${Math.floor(viralScore / 10)}%`
  }
}