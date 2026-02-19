import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { caption, hashtags, media, platform, postTime, targetAudience, userId, language = 'en' } = await request.json()

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

      if (!credits || credits.balance < 3) {
        return NextResponse.json({ 
          error: language === 'tr' ? 'Yetersiz kredi (3 kredi gerekli)' : 'Insufficient credits (3 credits required)' 
        }, { status: 403 })
      }
    }

    console.log('🚀 Viral Score AI - Platform:', platform)

    const analysis = await analyzeWithAI(caption, hashtags || '', media || 'photo', platform, postTime || '', targetAudience || '', language)

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
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'viral-score',
            tool_display_name: language === 'tr' ? 'Viral Skor' : 'Viral Score',
            credits_used: 3,
            input_preview: caption.substring(0, 50) + '...',
            output_preview: 'Score: ' + String(analysis.viralScore) + '%',
          })
      }
    }

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Viral Score Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

async function analyzeWithAI(caption: string, hashtags: string, media: string, platform: string, postTime: string, targetAudience: string, language: string) {
  
  const captionLength = caption.length
  const hashtagArray = hashtags.split(/[,\s#]+/).filter(function(h: string) { return h.length > 0 })
  const hashtagCount = hashtagArray.length
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
  const emojiMatches = caption.match(emojiRegex)
  const emojiCount = emojiMatches ? emojiMatches.length : 0
  const hasQuestion = caption.includes('?')
  const ctaRegex = /follow|like|share|comment|subscribe|link|bio|dm|takip|beğen|paylaş|yorum|abone/i
  const hasCTA = ctaRegex.test(caption)

  let aiInsights: string[] = []
  let aiScore = 0

  try {
    const prompt = language === 'tr'
      ? 'Bu sosyal medya icerigini viral potansiyeli acisindan analiz et:\n\nPlatform: ' + platform + '\nCaption: "' + caption + '"\nHashtag sayisi: ' + hashtagCount + '\nMedya tipi: ' + media + '\n\n1-100 arasi bir viral skor ver ve 3 oneride bulun. Sadece su formatta cevap ver:\nSKOR: [sayi]\nONERI1: [oneri]\nONERI2: [oneri]\nONERI3: [oneri]'
      : 'Analyze this social media content for viral potential:\n\nPlatform: ' + platform + '\nCaption: "' + caption + '"\nHashtag count: ' + hashtagCount + '\nMedia type: ' + media + '\n\nGive a viral score from 1-100 and 3 suggestions. Only respond in this format:\nSCORE: [number]\nTIP1: [suggestion]\nTIP2: [suggestion]\nTIP3: [suggestion]'

    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + HUGGINGFACE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      const text: string = data[0]?.generated_text || ''
      
      const scoreMatch = text.match(/SCORE?:\s*(\d+)/i)
      if (scoreMatch && scoreMatch[1]) {
        const parsedScore = parseInt(scoreMatch[1])
        aiScore = Math.min(100, Math.max(0, parsedScore))
      }

      const tipMatches = text.match(/(TIP|ONERI)\d?:\s*([^\n]+)/gi)
      if (tipMatches) {
        for (let i = 0; i < Math.min(tipMatches.length, 3); i++) {
          const tip = tipMatches[i].replace(/(TIP|ONERI)\d?:\s*/i, '').trim()
          aiInsights.push(tip)
        }
      }
    }
  } catch (error) {
    console.log('AI analysis failed, using rule-based')
  }

  let ruleScore = 0
  const factors: Array<{factor: string, score: number, status: string, message: string}> = []

  if (captionLength >= 80 && captionLength <= 200) {
    ruleScore += 25
    factors.push({ factor: language === 'tr' ? 'Caption Uzunlugu' : 'Caption Length', score: 25, status: 'perfect', message: language === 'tr' ? 'Mukemmel uzunluk!' : 'Perfect length!' })
  } else if (captionLength < 80) {
    ruleScore += 10
    factors.push({ factor: language === 'tr' ? 'Caption Uzunlugu' : 'Caption Length', score: 10, status: 'warning', message: language === 'tr' ? 'Biraz daha uzun olabilir' : 'Could be a bit longer' })
  } else {
    ruleScore += 15
    factors.push({ factor: language === 'tr' ? 'Caption Uzunlugu' : 'Caption Length', score: 15, status: 'good', message: language === 'tr' ? 'Biraz uzun ama iyi' : 'A bit long but okay' })
  }

  if (hashtagCount >= 5 && hashtagCount <= 15) {
    ruleScore += 20
    factors.push({ factor: 'Hashtags', score: 20, status: 'perfect', message: language === 'tr' ? 'Ideal hashtag sayisi' : 'Ideal hashtag count' })
  } else if (hashtagCount > 0) {
    ruleScore += 10
    factors.push({ factor: 'Hashtags', score: 10, status: 'warning', message: language === 'tr' ? '5-15 arasi hashtag onerilir' : '5-15 hashtags recommended' })
  } else {
    factors.push({ factor: 'Hashtags', score: 0, status: 'error', message: language === 'tr' ? 'Hashtag ekleyin!' : 'Add hashtags!' })
  }

  if (emojiCount >= 2 && emojiCount <= 5) {
    ruleScore += 15
    factors.push({ factor: 'Emojis', score: 15, status: 'perfect', message: language === 'tr' ? 'Harika emoji kullanimi' : 'Great emoji usage' })
  } else if (emojiCount > 0) {
    ruleScore += 8
    factors.push({ factor: 'Emojis', score: 8, status: 'good', message: language === 'tr' ? 'Emoji var ama daha fazla olabilir' : 'Has emojis but could use more' })
  } else {
    ruleScore += 3
    factors.push({ factor: 'Emojis', score: 3, status: 'warning', message: language === 'tr' ? 'Emoji ekleyin' : 'Add emojis' })
  }

  if (hasQuestion) {
    ruleScore += 15
    factors.push({ factor: language === 'tr' ? 'Etkilesim' : 'Engagement', score: 15, status: 'perfect', message: language === 'tr' ? 'Soru ile etkilesimi artiriyor' : 'Question boosts engagement' })
  } else {
    ruleScore += 5
    factors.push({ factor: language === 'tr' ? 'Etkilesim' : 'Engagement', score: 5, status: 'warning', message: language === 'tr' ? 'Soru ekleyin' : 'Add a question' })
  }

  if (hasCTA) {
    ruleScore += 15
    factors.push({ factor: 'CTA', score: 15, status: 'perfect', message: language === 'tr' ? 'Aksiyon cagrisi var' : 'Has call to action' })
  } else {
    ruleScore += 5
    factors.push({ factor: 'CTA', score: 5, status: 'warning', message: language === 'tr' ? 'CTA ekleyin' : 'Add CTA' })
  }

  if (media === 'video' || media === 'reel') {
    ruleScore += 10
    factors.push({ factor: language === 'tr' ? 'Medya Tipi' : 'Media Type', score: 10, status: 'perfect', message: language === 'tr' ? 'Video en yuksek erisim saglar' : 'Video gets highest reach' })
  } else {
    ruleScore += 5
    factors.push({ factor: language === 'tr' ? 'Medya Tipi' : 'Media Type', score: 5, status: 'good', message: language === 'tr' ? 'Video/Reel daha iyi performans gosterir' : 'Video/Reel performs better' })
  }

  const viralScore = aiScore > 0 ? Math.round((aiScore + ruleScore) / 2) : ruleScore

  const defaultRecommendations: string[] = []
  if (!hasQuestion) {
    defaultRecommendations.push(language === 'tr' ? 'Takipcilerinize bir soru sorarak etkilesimi artirin' : 'Ask your followers a question to boost engagement')
  }
  if (hashtagCount < 5) {
    defaultRecommendations.push(language === 'tr' ? 'Daha fazla ilgili hashtag ekleyin (5-15 arasi ideal)' : 'Add more relevant hashtags (5-15 is ideal)')
  }
  if (emojiCount < 2) {
    defaultRecommendations.push(language === 'tr' ? 'Iceriginizi gorsel olarak zenginlestirmek icin emoji ekleyin' : 'Add emojis to make your content more visually appealing')
  }
  if (!hasCTA) {
    defaultRecommendations.push(language === 'tr' ? 'Takipcilerinizi aksiyona cagiran bir CTA ekleyin' : 'Add a call-to-action to encourage followers to engage')
  }

  const recommendations = aiInsights.length > 0 ? aiInsights : defaultRecommendations.slice(0, 3)

  let rating = ''
  if (viralScore >= 80) {
    rating = language === 'tr' ? 'Mukemmel' : 'Excellent'
  } else if (viralScore >= 60) {
    rating = language === 'tr' ? 'Iyi' : 'Good'
  } else if (viralScore >= 40) {
    rating = language === 'tr' ? 'Orta' : 'Average'
  } else {
    rating = language === 'tr' ? 'Gelistirilebilir' : 'Needs Work'
  }

  return {
    viralScore: viralScore,
    rating: rating,
    factors: factors,
    recommendations: recommendations,
    metrics: {
      captionLength: captionLength,
      hashtagCount: hashtagCount,
      emojiCount: emojiCount,
      hasQuestion: hasQuestion,
      hasCTA: hasCTA
    },
    estimatedReach: {
      min: Math.floor(viralScore * 8),
      max: Math.floor(viralScore * 25),
      unit: language === 'tr' ? 'kisi' : 'people'
    },
    aiPowered: aiScore > 0
  }
}
