import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { caption, hashtags, postTime, platform, contentType, userTimezone, targetTimezone, userId, language = 'en' } = await request.json()

    if (!caption || !platform) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Caption ve platform gerekli' : 'Caption and platform required' 
      }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (!credits || credits.balance < 5) {
        return NextResponse.json({ 
          error: language === 'tr' ? 'Yetersiz kredi (5 kredi gerekli)' : 'Insufficient credits (5 credits required)' 
        }, { status: 403 })
      }
    }

    const prediction = predictEngagement(caption, hashtags, postTime, platform, contentType, userTimezone, targetTimezone, language)

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
            balance: currentCredits.balance - 5,
            total_used: currentCredits.total_used + 5,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'engagement-predictor',
            tool_display_name: language === 'tr' ? 'Engagement Predictor' : 'Engagement Predictor',
            credits_used: 5,
            input_preview: platform,
            output_preview: `${prediction.overallScore}% score`,
          })
      }
    }

    return NextResponse.json({ prediction })

  } catch (error) {
    console.error('Engagement Predictor Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

function predictEngagement(caption: string, hashtags: string, postTime: string, platform: string, contentType: string, userTimezone: string, targetTimezone: string, language: string) {
  
  const timezones: {[key: string]: number} = {
    'UTC': 0,
    'Europe/London': 0,
    'Europe/Paris': 1,
    'Europe/Berlin': 1,
    'Europe/Istanbul': 3,
    'Asia/Dubai': 4,
    'Asia/Karachi': 5,
    'Asia/Kolkata': 5.5,
    'Asia/Shanghai': 8,
    'Asia/Tokyo': 9,
    'Australia/Sydney': 11,
    'America/New_York': -5,
    'America/Chicago': -6,
    'America/Los_Angeles': -8,
    'America/Sao_Paulo': -3
  }

  // Kullanıcı saatini hedef bölge saatine çevir
  const userOffset = timezones[userTimezone] || 0
  const targetOffset = timezones[targetTimezone] || 0
  const hourDifference = targetOffset - userOffset

  const [userHours, minutes] = postTime.split(':').map(Number)
  let targetHour = userHours + hourDifference
  
  if (targetHour < 0) targetHour += 24
  if (targetHour >= 24) targetHour -= 24

  let score = 50

  const captionLength = caption.length
  if (captionLength >= 100 && captionLength <= 300) score += 10
  if (caption.includes('?')) score += 5
  if (caption.includes('!')) score += 3
  
  const emojiCount = (caption.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length
  if (emojiCount > 0 && emojiCount <= 5) score += 8

  const hashtagCount = hashtags ? hashtags.split('#').length - 1 : 0
  if (platform === 'instagram' && hashtagCount >= 5 && hashtagCount <= 15) score += 12
  if (platform === 'tiktok' && hashtagCount >= 3 && hashtagCount <= 5) score += 10

  // Hedef bölge saatine göre timing skorla
  if ((targetHour >= 9 && targetHour <= 11) || (targetHour >= 17 && targetHour <= 21)) score += 10

  if (platform === 'instagram' && contentType === 'reel') score += 15
  if (platform === 'tiktok') score += 10
  if (platform === 'youtube' && contentType === 'short') score += 12

  score = Math.min(95, Math.max(20, score))

  const metrics = {
    captionQuality: Math.min(100, captionLength >= 100 ? 85 : 60),
    hashtagOptimization: hashtagCount > 0 ? Math.min(100, hashtagCount * 8) : 30,
    timingScore: (targetHour >= 9 && targetHour <= 11) || (targetHour >= 17 && targetHour <= 21) ? 90 : 60,
    contentTypeScore: contentType === 'reel' || contentType === 'short' ? 95 : 75
  }

  const recommendations = {
    tr: [
      captionLength < 100 ? 'Caption çok kısa, en az 100 karakter öneririz' : null,
      hashtagCount < 5 ? 'Daha fazla hashtag ekleyin (5-15 arası)' : null,
      !caption.includes('?') ? 'Soru ekleyerek etkileşimi artırabilirsiniz' : null,
      emojiCount === 0 ? 'Emoji kullanarak caption\'ı zenginleştirin' : null,
      targetHour < 9 || (targetHour > 11 && targetHour < 17) ? `Hedef bölge (${targetTimezone}) için daha iyi etkileşim: 9-11 veya 17-21 saatleri` : null,
      hourDifference !== 0 ? `Saat farkı: ${Math.abs(hourDifference)} saat ${hourDifference > 0 ? 'ileri' : 'geri'}` : null
    ],
    en: [
      captionLength < 100 ? 'Caption too short, recommend at least 100 characters' : null,
      hashtagCount < 5 ? 'Add more hashtags (5-15 range)' : null,
      !caption.includes('?') ? 'Add a question to boost engagement' : null,
      emojiCount === 0 ? 'Use emojis to make caption visually appealing' : null,
      targetHour < 9 || (targetHour > 11 && targetHour < 17) ? `Better engagement in target region (${targetTimezone}): 9-11 AM or 5-9 PM` : null,
      hourDifference !== 0 ? `Time difference: ${Math.abs(hourDifference)} hours ${hourDifference > 0 ? 'ahead' : 'behind'}` : null
    ]
  }

  const targetTime = `${String(targetHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

  return {
    overallScore: score,
    rating: score >= 80 ? (language === 'tr' ? 'Mükemmel' : 'Excellent') :
            score >= 60 ? (language === 'tr' ? 'İyi' : 'Good') :
            score >= 40 ? (language === 'tr' ? 'Orta' : 'Average') :
            (language === 'tr' ? 'Zayıf' : 'Poor'),
    metrics,
    recommendations: (language === 'tr' ? recommendations.tr : recommendations.en).filter(Boolean),
    estimatedReach: {
      min: Math.floor(score * 10),
      max: Math.floor(score * 20),
      unit: language === 'tr' ? 'kişi' : 'people'
    },
    timezoneInfo: {
      userTime: postTime,
      targetTime: targetTime,
      userTimezone,
      targetTimezone,
      difference: hourDifference
    }
  }
}