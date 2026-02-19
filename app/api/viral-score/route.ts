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

    // Kredi kontrolü (3 kredi)
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

    // AI ile analiz yap
    const analysis = await analyzeWithAI(caption, hashtags, media, platform, postTime, targetAudience, language)

    // Kredi düşür
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
            output_preview: `Score: ${analysis.viralScore}%`,
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
  
  // Temel metrikleri hesapla
  const captionLength = caption.length
  const hashtagList = hashtags ? hashtags.split(/[,\s#]+/).filter(h => h.length > 0) : []
  const hashtagCount = hashtagList.length
  const emojiCount = (caption.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length
  const hasQuestion = caption.includes('?')
  const hasCTA = /follow|like|share|comment|subscribe|link|bio|dm|takip|beğen|paylaş|yorum|abone/i.test(caption)

  // AI ile derin analiz
  let aiInsights: string[] = []
  let aiScore = 0

  try {
    const prompt = language === 'tr'
      ? `Bu sosyal medya içeriğini viral potansiyeli açısından analiz et:

Platform: ${platform}
Caption: "${caption}"
Hashtag sayısı: ${hashtagCount}
Medya tipi: ${media}

1-100 arası bir viral skor ver ve 3 öneride bulun. Sadece şu formatta cevap ver:
SKOR: [sayı]
ÖNERİ1: [öneri]
ÖNERİ2: [öneri]  
ÖNERİ3: [öneri]`
      : `Analyze this social media content for viral potential:

Platform: ${platform}
Caption: "${caption}"
Hashtag count: ${hashtagCount}
Media type: ${media}

Give a viral score from 1-100 and 3 suggestions. Only respond in this format:
SCORE: [number]
TIP1: [suggestion]
TIP2: [suggestion]
TIP3: [suggestion]`

    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
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
      const text = data[0]?.generated_text || ''
      
      // Skoru parse et
      const scoreMatch = text.match(/SCORE?:\s*(\d+)/i)
      if (scoreMatch) {
        aiScore = Math.min(100, Math.max(0, parseInt(scoreMatch[1])))
      }

      // Önerileri parse et
      const tipMatches = text.match(/(TIP|ÖNERİ)\d?:\s*([^\n]+)/gi)
      if (tipMatches) {
        aiInsights = tipMatches.map(m => m.replace(/(TIP|ÖNERİ)\d?:\s*/i, '').trim()).slice(0, 3)
      }
    }
  } catch (error) {
    console.log('AI analysis failed, using rule-based')
  }

  // Kural bazlı skor hesapla
  let ruleScore = 0
  const factors: any[] = []

  // Caption analizi (25 puan)
  if (captionLength >= 80 && captionLength <= 200) {
    ruleScore += 25
    factors.push({ factor: language === 'tr' ? 'Caption Uzunluğu' : 'Caption Length', score: 25, status: 'perfect', message: language === 'tr' ? 'Mükemmel uzunluk!' : 'Perfect length!' })
  } else if (captionLength < 80) {
    ruleScore += 10
    factors.push({ factor: language === 'tr' ? 'Caption Uzunluğu' : 'Caption Length', score: 10, status: 'warning', message: language === 'tr' ? 'Biraz daha uzun olabilir' : 'Could be a bit longer' })
  } else {
    ruleScore += 15
    factors.push({ factor: language === 'tr' ? 'Caption Uzunluğu' : 'Caption Length', score: 15, status: 'good', message: language === 'tr' ? 'Biraz uzun ama iyi' : 'A bit long but okay' })
  }

  // Hashtag analizi (20 puan)
  if (hashtagCount >= 5 && hashtagCount <= 15) {
    ruleScore += 20
    factors.push({ factor: 'Hashtags', score: 20, status: 'perfect', message: language === 'tr' ? 'İdeal hashtag sayısı' : 'Ideal hashtag count' })
  } else if (hashtagCount > 0) {
    ruleScore += 10
    factors.push({ factor: 'Hashtags', score: 10, status: 'warning', message: language === 'tr' ? '5-15 arası hashtag önerilir' : '5-15 hashtags recommended' })
  } else {
    factors.push({ factor: 'Hashtags', score: 0, status: 'error', message: language === 'tr' ? 'Hashtag ekleyin!' : 'Add hashtags!' })
  }

  // Emoji analizi (15 puan)
  if (emojiCount >= 2 && emojiCount <= 5) {
    ruleScore += 15
    factors.push({ factor: 'Emojis', score: 15, status: 'perfect', message: language === 'tr' ? 'Harika emoji kullanımı' : 'Great emoji usage' })
  } else if (emojiCount > 0) {
    ruleScore += 8
    factors.push({ factor: 'Emojis', score: 8, status: 'good', message: language === 'tr' ? 'Emoji var ama daha fazla olabilir' : 'Has emojis but could use more' })
  } else {
    ruleScore += 3
    factors.push({ factor: 'Emojis', score: 3, status: 'warning', message: language === 'tr' ? 'Emoji ekleyin' : 'Add emojis' })
  }

  // Soru analizi (15 puan)
  if (hasQuestion) {
    ruleScore += 15
    factors.push({ factor: language === 'tr' ? 'Etkileşim' : 'Engagement', score: 15, status: 'perfect', message: language === 'tr' ? 'Soru ile etkileşimi artırıyor' : 'Question boosts engagement' })
  } else {
    ruleScore += 5
    factors.push({ factor: language === 'tr' ? 'Etkileşim' : 'Engagement', score: 5, status: 'warning', message: language === 'tr' ? 'Soru ekleyin' : 'Add a question' })
  }

  // CTA analizi (15 puan)
  if (hasCTA) {
    ruleScore += 15
    factors.push({ factor: 'CTA', score: 15, status: 'perfect', message: language === 'tr' ? 'Aksiyon çağrısı var' : 'Has call to action' })
  } else {
    ruleScore += 5
    factors.push({ factor: 'CTA', score: 5, status: 'warning', message: language === 'tr' ? 'CTA ekleyin' : 'Add CTA' })
  }

  // Medya tipi (10 puan)
  if (media === 'video' || media === 'reel') {
    ruleScore += 10
    factors.push({ factor: language === 'tr' ? 'Medya Tipi' : 'Media Type', score: 10, status: 'perfect', message: language === 'tr' ? 'Video en yüksek erişim sağlar' : 'Video gets highest reach' })
  } else {
    ruleScore += 5
    factors.push({ factor: language === 'tr' ? 'Medya Tipi' : 'Media Type', score: 5, status: 'good', message: language === 'tr' ? 'Video/Reel daha iyi performans gösterir' : 'Video/Reel performs better' })
  }

  // Final skor (AI ve kural bazlı ortalaması)
  const viralScore = aiScore > 0 ? Math.round((aiScore + ruleScore) / 2) : ruleScore

  // Önerileri birleştir
  const defaultRecommendations = language === 'tr' ? [
    !hasQuestion ? 'Takipçilerinize bir soru sorarak etkileşimi artırın' : null,
    hashtagCount < 5 ? 'Daha fazla ilgili hashtag ekleyin (5-15 arası ideal)' : null,
    emojiCount < 2 ? 'İçeriğinizi görsel olarak zenginleştirmek için emoji ekleyin' : null,
    !hasCTA ? 'Takipçilerinizi aksiyona çağıran bir CTA ekleyin' : null,
    media !== 'video' ? 'Video içerikler daha yüksek erişim sağlar' : null,
  ].filter(Boolean) : [
    !hasQuestion ? 'Ask your followers a question to boost engagement' : null,
    hashtagCount < 5 ? 'Add more relevant hashtags (5-15 is ideal)' : null,
    emojiCount < 2 ? 'Add emojis to make your content more visually appealing' : null,
    !hasCTA ? 'Add a call-to-action to encourage followers to engage' : null,
    media !== 'video' ? 'Video content gets higher reach' : null,
  ].filter(Boolean)

  const recommendations = aiInsights.length > 0 ? aiInsights : defaultRecommendations.slice(0, 3)

  return {
    viralScore,
    rating: viralScore >= 80 ? (language === 'tr' ? 'Mükemmel 🔥' : 'Excellent 🔥') :
            viralScore >= 60 ? (language === 'tr' ? 'İyi 👍' : 'Good 👍') :
            viralScore >= 40 ? (language === 'tr' ? 'Orta 😐' : 'Average 😐') :
            (language === 'tr' ? 'Geliştirilebilir 📈' : 'Needs Work 📈'),
    factors,
    recommendations,
    metrics: {
      captionLength,
      hashtagCount,
      emojiCount,
      hasQuestion,
      hasCTA
    },
    estimatedReach: {
      min: Math.floor(viralScore * 8),
      max: Math.floor(viralScore * 25),
      unit: language === 'tr' ? 'kişi' : 'people'
    },
    aiPowered: aiScore > 0
  }
}
