import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { topic, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Kredi kontrolü
    if (userId) {
      const { data: credits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
      }
    }

    console.log('🎣 Generating hooks for:', topic, 'Language:', language)

    // Gerçek AI ile özet al (içeriği anlamak için)
    let aiInsight = ''
    try {
      const summaryResponse = await fetch(
        'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Create engaging hooks about: ${topic}`,
            parameters: { max_length: 50, min_length: 10 },
          }),
        }
      )
      const summaryResult = await summaryResponse.json()
      aiInsight = summaryResult[0]?.summary_text || ''
    } catch (e) {
      console.log('AI insight failed, using fallback')
    }

    // Dile göre hook'lar oluştur
    const hooks = generateHooks(topic, language, aiInsight)

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
            balance: currentCredits.balance - 2,
            total_used: currentCredits.total_used + 2,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'hook-generator',
            tool_display_name: 'Hook Generator',
            credits_used: 2,
            input_preview: topic.substring(0, 200),
            output_preview: hooks[0]?.text.substring(0, 100) || 'Hooks generated',
          })
      }
    }

    return NextResponse.json({ hooks })

  } catch (error) {
    console.log('❌ Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

function generateHooks(topic: string, language: string, aiInsight: string): Array<{type: string, emoji: string, text: string, reason: string}> {
  const topicClean = topic.trim()
  const keywords = extractKeywords(topicClean)
  const mainKeyword = keywords[0] || topicClean.split(' ').slice(0, 3).join(' ')
  
  // Rastgele varyasyonlar için
  const randomNum = () => Math.floor(Math.random() * 90) + 10
  const randomYear = () => 2020 + Math.floor(Math.random() * 5)
  const randomDays = () => Math.floor(Math.random() * 25) + 5
  const randomPercent = () => Math.floor(Math.random() * 40) + 60

  if (language === 'tr') {
    return shuffleArray([
      // Merak
      {
        type: 'curiosity',
        emoji: '🤔',
        text: `${topicClean} hakkında kimsenin bilmediği ${randomNum()} gerçek...`,
        reason: 'Bilgi boşluğu yaratır, insanlar öğrenmek ister'
      },
      {
        type: 'curiosity',
        emoji: '🤔',
        text: `${mainKeyword} konusunda herkesin yaptığı en büyük hata`,
        reason: 'Kendilerini kontrol etmek isterler'
      },
      {
        type: 'curiosity',
        emoji: '🤔',
        text: `${randomYear()} yılında ${mainKeyword} hakkında öğrendiğim şey her şeyi değiştirdi`,
        reason: 'Kişisel hikaye + dönüşüm vaat eder'
      },
      
      // Şok Edici
      {
        type: 'shocking',
        emoji: '😱',
        text: `${topicClean} hakkında ${randomDays()} gün önce öğrendiklerim beni şok etti`,
        reason: 'Yakın zamanlı keşif = güncel ve alakalı'
      },
      {
        type: 'shocking',
        emoji: '😱',
        text: `%${randomPercent()} insanın ${mainKeyword} konusunda yanıldığı ortaya çıktı`,
        reason: 'İstatistik + sürpriz = güçlü dikkat çekici'
      },
      {
        type: 'shocking',
        emoji: '😱',
        text: `${mainKeyword} yapmayı bırakın. İşte nedeni:`,
        reason: 'Ters psikoloji dikkat çeker'
      },
      
      // Soru
      {
        type: 'question',
        emoji: '❓',
        text: `${topicClean} konusunda neden herkes aynı hatayı yapıyor?`,
        reason: 'Soru formatı beynin yanıt aramasını tetikler'
      },
      {
        type: 'question',
        emoji: '❓',
        text: `${mainKeyword} hakkında gerçekten ne kadar biliyorsunuz?`,
        reason: 'Özgüveni test eder, merak uyandırır'
      },
      {
        type: 'question',
        emoji: '❓',
        text: `Ya ${topicClean} hakkında bildiğiniz her şey yanlışsa?`,
        reason: 'Mevcut inançları sorgulatır'
      },
      
      // Hikaye
      {
        type: 'story',
        emoji: '📖',
        text: `${randomDays()} gün önce ${mainKeyword} hakkında bir şey keşfettim. Hayatım değişti.`,
        reason: 'Kişisel dönüşüm hikayesi duygusal bağ kurar'
      },
      {
        type: 'story',
        emoji: '📖',
        text: `${topicClean} konusunda başarısız oldum. Ta ki bunu öğrenene kadar...`,
        reason: 'Başarısızlıktan başarıya = ilham verici'
      },
      
      // İstatistik
      {
        type: 'statistic',
        emoji: '📊',
        text: `${randomNum()}+ saat araştırma sonucu: ${mainKeyword} hakkındaki gerçek`,
        reason: 'Emek = değerli içerik algısı'
      },
      {
        type: 'statistic',
        emoji: '📊',
        text: `${mainKeyword} konusunda ${randomDays()} günlük test sonuçlarım sizi şaşırtacak`,
        reason: 'Deneysel kanıt güvenilirlik sağlar'
      },
    ]).slice(0, 8)
  }

  // English hooks
  return shuffleArray([
    // Curiosity
    {
      type: 'curiosity',
      emoji: '🤔',
      text: `The ${randomNum()} things nobody tells you about ${topicClean}...`,
      reason: 'Creates an information gap people want to fill'
    },
    {
      type: 'curiosity',
      emoji: '🤔',
      text: `What everyone gets wrong about ${mainKeyword}`,
      reason: 'Challenges assumptions, triggers self-check'
    },
    {
      type: 'curiosity',
      emoji: '🤔',
      text: `I discovered something about ${mainKeyword} in ${randomYear()} that changed everything`,
      reason: 'Personal story + transformation promise'
    },
    
    // Shocking
    {
      type: 'shocking',
      emoji: '😱',
      text: `What I learned about ${topicClean} ${randomDays()} days ago shocked me`,
      reason: 'Recent discovery = current and relevant'
    },
    {
      type: 'shocking',
      emoji: '😱',
      text: `${randomPercent()}% of people are wrong about ${mainKeyword}. Are you?`,
      reason: 'Statistics + surprise = powerful attention grabber'
    },
    {
      type: 'shocking',
      emoji: '😱',
      text: `Stop doing ${mainKeyword} this way. Here's why:`,
      reason: 'Contrarian take grabs attention'
    },
    
    // Question
    {
      type: 'question',
      emoji: '❓',
      text: `Why does everyone make the same mistake with ${topicClean}?`,
      reason: 'Question format triggers brain to seek answer'
    },
    {
      type: 'question',
      emoji: '❓',
      text: `How much do you really know about ${mainKeyword}?`,
      reason: 'Tests confidence, sparks curiosity'
    },
    {
      type: 'question',
      emoji: '❓',
      text: `What if everything you know about ${topicClean} is wrong?`,
      reason: 'Challenges existing beliefs'
    },
    
    // Story
    {
      type: 'story',
      emoji: '📖',
      text: `${randomDays()} days ago I discovered something about ${mainKeyword}. It changed my life.`,
      reason: 'Personal transformation creates emotional connection'
    },
    {
      type: 'story',
      emoji: '📖',
      text: `I failed at ${topicClean}. Until I learned this...`,
      reason: 'Failure to success = inspirational arc'
    },
    
    // Statistic
    {
      type: 'statistic',
      emoji: '📊',
      text: `After ${randomNum()}+ hours of research: The truth about ${mainKeyword}`,
      reason: 'Effort = valuable content perception'
    },
    {
      type: 'statistic',
      emoji: '📊',
      text: `My ${randomDays()}-day test results on ${mainKeyword} will surprise you`,
      reason: 'Experimental proof builds credibility'
    },
  ]).slice(0, 8)
}

function extractKeywords(text: string): string[] {
  const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'about', 'how', 'what', 'why', 'when', 'where', 'which', 'who', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'and', 'or', 'but', 'if', 'then', 'so', 'than', 'too', 'very', 'just', 'also', 'only', 'own', 'same', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'nasıl', 'neden', 'ne', 'hangi', 'kim', 'nerede', 've', 'veya', 'ama', 'için', 'ile', 'bir', 'bu', 'şu', 'o', 'ben', 'sen', 'biz', 'onlar']
  
  return text.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5)
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}