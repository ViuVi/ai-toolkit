import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { sampleTexts, brandName, industry, userId, language = 'en' } = await request.json()

    if (!sampleTexts || sampleTexts.length < 3) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'En az 3 örnek metin gerekli' : 'At least 3 sample texts required' 
      }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (!credits || credits.balance < 2) {
        return NextResponse.json({ 
          error: language === 'tr' ? 'Yetersiz kredi (2 kredi gerekli)' : 'Insufficient credits (2 credits required)' 
        }, { status: 403 })
      }
    }

    const analysis = analyzeBrandVoice(sampleTexts, brandName, industry, language)

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
            balance: currentCredits.balance - 2,
            total_used: currentCredits.total_used + 2,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'brand-voice-analyzer',
            tool_display_name: language === 'tr' ? 'Brand Voice Analyzer' : 'Brand Voice Analyzer',
            credits_used: 2,
            input_preview: brandName || 'Brand Analysis',
            output_preview: `${analysis.consistency}% consistency`,
          })
      }
    }

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Brand Voice Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

function analyzeBrandVoice(sampleTexts: string[], brandName: string, industry: string, language: string) {
  
  const combinedText = sampleTexts.join(' ').toLowerCase()
  
  // Ton analizi
  const toneAnalysis = analyzeTone(combinedText, language)
  
  // Kelime seçimi analizi
  const wordChoice = analyzeWordChoice(combinedText, language)
  
  // Tutarlılık skoru
  const consistency = calculateConsistency(sampleTexts)
  
  // Sentiment analizi
  const sentiment = analyzeSentiment(combinedText, language)
  
  // İyileştirme önerileri
  const recommendations = generateRecommendations(toneAnalysis, wordChoice, consistency, language)
  
  // Rakip kıyaslaması (simüle edilmiş)
  const competitorComparison = generateCompetitorComparison(industry, language)
  
  return {
    brandName: brandName || (language === 'tr' ? 'Markanız' : 'Your Brand'),
    industry,
    consistency,
    toneAnalysis,
    wordChoice,
    sentiment,
    recommendations,
    competitorComparison,
    keyPhrases: extractKeyPhrases(combinedText, language)
  }
}

function analyzeTone(text: string, language: string) {
  const toneScores: {[key: string]: number} = {
    professional: 0,
    casual: 0,
    friendly: 0,
    authoritative: 0,
    playful: 0
  }
  
  const toneKeywords = {
    professional: {
      tr: ['profesyonel', 'kalite', 'uzmanlık', 'deneyim', 'hizmet', 'çözüm', 'başarı', 'güvenilir'],
      en: ['professional', 'quality', 'expertise', 'experience', 'service', 'solution', 'success', 'reliable']
    },
    casual: {
      tr: ['hey', 'selam', 'harika', 'süper', 'mükemmel', 'işte', 'tamam'],
      en: ['hey', 'hi', 'awesome', 'cool', 'great', 'yeah', 'okay']
    },
    friendly: {
      tr: ['arkadaş', 'beraber', 'birlikte', 'yardım', 'destek', 'seninle', 'bizimle'],
      en: ['friend', 'together', 'help', 'support', 'with you', 'we', 'our']
    },
    authoritative: {
      tr: ['lider', 'önder', 'uzman', 'kanıtlanmış', 'sertifikalı', 'garantili'],
      en: ['leader', 'expert', 'proven', 'certified', 'guaranteed', 'authority']
    },
    playful: {
      tr: ['eğlenceli', 'heyecanlı', 'şaşırtıcı', 'harika', 'wow'],
      en: ['fun', 'exciting', 'amazing', 'wow', 'playful', 'creative']
    }
  }
  
  Object.keys(toneKeywords).forEach(tone => {
    const toneData = toneKeywords[tone as keyof typeof toneKeywords]
const keywords = (language === 'tr' ? toneData.tr : toneData.en) || toneData.en
    keywords.forEach(keyword => {
      const count = (text.match(new RegExp(keyword, 'gi')) || []).length
      toneScores[tone] += count * 10
    })
  })
  
  // Normalize scores
  const total = Object.values(toneScores).reduce((a, b) => a + b, 0) || 1
  const normalizedScores: {[key: string]: number} = {}
  Object.keys(toneScores).forEach(key => {
    normalizedScores[key] = Math.round((toneScores[key] / total) * 100)
  })
  
  // Dominant tone
  const dominantTone = Object.keys(normalizedScores).reduce((a, b) => 
    normalizedScores[a] > normalizedScores[b] ? a : b
  )
  
  return {
    scores: normalizedScores,
    dominant: dominantTone,
    dominantScore: normalizedScores[dominantTone]
  }
}

function analyzeWordChoice(text: string, language: string) {
  const words = text.split(/\s+/).filter(w => w.length > 3)
  const uniqueWords = new Set(words)
  
  const complexity = uniqueWords.size / words.length
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length
  
  let level = ''
  if (avgWordLength < 5) {
    level = language === 'tr' ? 'Basit & Anlaşılır' : 'Simple & Clear'
  } else if (avgWordLength < 7) {
    level = language === 'tr' ? 'Orta Seviye' : 'Medium Level'
  } else {
    level = language === 'tr' ? 'Karmaşık & Teknik' : 'Complex & Technical'
  }
  
  return {
    vocabularyRichness: Math.round(complexity * 100),
    averageWordLength: Math.round(avgWordLength),
    complexityLevel: level,
    uniqueWordCount: uniqueWords.size,
    totalWordCount: words.length
  }
}

function calculateConsistency(texts: string[]) {
  // Her metnin uzunluğunu karşılaştır
  const lengths = texts.map(t => t.length)
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length
  const stdDev = Math.sqrt(variance)
  
  // Tutarlılık skoru (düşük std dev = yüksek tutarlılık)
  const consistencyScore = Math.max(0, Math.min(100, 100 - (stdDev / avgLength * 100)))
  
  return Math.round(consistencyScore)
}

function analyzeSentiment(text: string, language: string) {
  const positiveWords = {
    tr: ['harika', 'mükemmel', 'başarılı', 'iyi', 'güzel', 'kaliteli', 'mutlu', 'seviyorum', 'en iyi'],
    en: ['great', 'excellent', 'success', 'good', 'beautiful', 'quality', 'happy', 'love', 'best', 'amazing']
  }
  
  const negativeWords = {
    tr: ['kötü', 'başarısız', 'zor', 'problem', 'sorun', 'zayıf', 'yetersiz'],
    en: ['bad', 'failed', 'difficult', 'problem', 'issue', 'weak', 'insufficient', 'poor']
  }
  
  const posWords = positiveWords[language] || positiveWords.en
  const negWords = negativeWords[language] || negativeWords.en
  
  let positiveCount = 0
  let negativeCount = 0
  
  posWords.forEach(word => {
    positiveCount += (text.match(new RegExp(word, 'gi')) || []).length
  })
  
  negWords.forEach(word => {
    negativeCount += (text.match(new RegExp(word, 'gi')) || []).length
  })
  
  const total = positiveCount + negativeCount || 1
  const positiveScore = Math.round((positiveCount / total) * 100)
  
  let sentiment = ''
  if (positiveScore >= 70) {
    sentiment = language === 'tr' ? 'Çok Pozitif' : 'Very Positive'
  } else if (positiveScore >= 50) {
    sentiment = language === 'tr' ? 'Pozitif' : 'Positive'
  } else if (positiveScore >= 30) {
    sentiment = language === 'tr' ? 'Nötr' : 'Neutral'
  } else {
    sentiment = language === 'tr' ? 'Negatif' : 'Negative'
  }
  
  return {
    score: positiveScore,
    label: sentiment,
    positiveCount,
    negativeCount
  }
}

function generateRecommendations(tone: any, wordChoice: any, consistency: number, language: string) {
  const recs = []
  
  if (consistency < 70) {
    recs.push(language === 'tr' 
      ? 'Tutarlılığı artırın - metin uzunluklarını ve formatları standartlaştırın'
      : 'Improve consistency - standardize text lengths and formats'
    )
  }
  
  if (tone.dominantScore < 40) {
    recs.push(language === 'tr'
      ? 'Marka sesinizi netleştirin - daha tutarlı bir ton kullanın'
      : 'Clarify brand voice - use more consistent tone'
    )
  }
  
  if (wordChoice.vocabularyRichness < 30) {
    recs.push(language === 'tr'
      ? 'Kelime dağarcığınızı zenginleştirin - daha çeşitli kelimeler kullanın'
      : 'Enrich vocabulary - use more diverse words'
    )
  }
  
  if (wordChoice.averageWordLength < 4) {
    recs.push(language === 'tr'
      ? 'Daha profesyonel kelimeler ekleyin'
      : 'Add more professional terminology'
    )
  }
  
  if (recs.length === 0) {
    recs.push(language === 'tr'
      ? 'Mükemmel! Marka sesiniz tutarlı ve güçlü'
      : 'Excellent! Your brand voice is consistent and strong'
    )
  }
  
  return recs
}

function generateCompetitorComparison(industry: string, language: string) {
  const industries = ['tech', 'fashion', 'food', 'fitness', 'business', 'travel', 'beauty']
  const ind = industries.includes(industry) ? industry : 'business'
  
  // Simüle edilmiş rakip skorları
  const competitorScore = 50 + Math.floor(Math.random() * 30)
  
  return {
    industry: ind,
    averageConsistency: competitorScore,
    averageToneClarity: 60 + Math.floor(Math.random() * 20),
    topPerformers: [
      { name: language === 'tr' ? 'Rakip A' : 'Competitor A', score: 85 },
      { name: language === 'tr' ? 'Rakip B' : 'Competitor B', score: 78 },
      { name: language === 'tr' ? 'Rakip C' : 'Competitor C', score: 72 }
    ]
  }
}

function extractKeyPhrases(text: string, language: string) {
  const words = text.split(/\s+/).filter(w => w.length > 4)
  const wordFreq: {[key: string]: number} = {}
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  const sorted = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
  
  return sorted
}