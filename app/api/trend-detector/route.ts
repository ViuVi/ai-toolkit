import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { niche, userId, language = 'en' } = await request.json()

    if (!niche || niche.trim().length === 0) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Niş/konu gerekli' : 'Niche/topic is required' 
      }, { status: 400 })
    }

    // Kredi kontrolü
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

    console.log('🔥 AI Trend Detector V2 - Niche:', niche, 'Language:', language)

    // Gerçek AI ile trend analizi - HER SEFERINDE FARKLI
    const trends = await generateRealTrendsWithAI(niche, language)

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
            balance: currentCredits.balance - 5,
            total_used: currentCredits.total_used + 5,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'trend-detector',
            tool_display_name: language === 'tr' ? 'Trend Dedektörü' : 'Trend Detector',
            credits_used: 5,
            input_preview: niche.substring(0, 200),
            output_preview: `${trends.length} trends analyzed`,
          })
      }
    }

    return NextResponse.json({ trends })

  } catch (error) {
    console.error('❌ Trend Detector Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

async function generateRealTrendsWithAI(niche: string, language: string) {
  
  // Gerçek zamanlı context ekle
  const currentDate = new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  
  // Sezona göre context
  let seasonalContext = ''
  if (language === 'tr') {
    if (currentMonth >= 12 || currentMonth <= 2) seasonalContext = 'Kış sezonu, yılbaşı, yeni yıl hedefleri aktif.'
    else if (currentMonth >= 3 && currentMonth <= 5) seasonalContext = 'İlkbahar, yenilenme, bahar temizliği, Ramazan dönemi.'
    else if (currentMonth >= 6 && currentMonth <= 8) seasonalContext = 'Yaz tatili, seyahat, açık hava aktiviteleri yoğun.'
    else seasonalContext = 'Sonbahar, okul dönemi, yeni başlangıçlar.'
  } else {
    if (currentMonth >= 12 || currentMonth <= 2) seasonalContext = 'Winter season, New Year resolutions, holiday season.'
    else if (currentMonth >= 3 && currentMonth <= 5) seasonalContext = 'Spring, renewal, spring cleaning, fresh starts.'
    else if (currentMonth >= 6 && currentMonth <= 8) seasonalContext = 'Summer vacation, travel, outdoor activities.'
    else seasonalContext = 'Fall, back to school, new beginnings.'
  }

  const prompt = language === 'tr'
    ? `Bugünün tarihi: ${currentDate}
Dönem: ${seasonalContext}
Niş: "${niche}"

Sen bir trend analisti ve içerik stratejistisin. Bu niş için ŞU AN (${currentDate}) gerçekten trend olan 5 konuyu tespit et.

ÖNEMLİ KURALLAR:
1. Her konu FARKLI ve ÖZGÜN olmalı
2. Güncel olaylara, sezona ve zamana göre özelleştir
3. ${currentYear} yılına özel trendleri dahil et
4. Gerçek platformlarda (TikTok, Instagram, LinkedIn) popüler olan konuları tercih et
5. Sayıları ve yüzdeleri her seferinde RASTGELE ve GERÇEKÇİ yap

Her konu için bu formatı kullan:

KONU: [Çok spesifik trend konusu - ${niche} ile ilgili ama özgün]
TREND SKORU: [75-98 arası]
İÇERİK ÖNERİLERİ:
- [Spesifik, uygulanabilir öneri 1]
- [Spesifik, uygulanabilir öneri 2]  
- [Spesifik, uygulanabilir öneri 3]
PLATFORMLAR: [En uygun 2-3 platform]
EN İYİ ZAMAN: [Gün + spesifik saat aralığı]
NEDEN TREND: [${currentDate} itibariyle neden trend olduğunu açıkla, güncel olay/sezon referansı ver]

---

Şimdi ${niche} için 5 trend konu analiz et (her biri tamamen farklı olsun):`
    : `Today's date: ${currentDate}
Period: ${seasonalContext}
Niche: "${niche}"

You are a trend analyst and content strategist. Identify 5 topics that are ACTUALLY trending RIGHT NOW (${currentDate}) in this niche.

CRITICAL RULES:
1. Each topic must be DIFFERENT and UNIQUE
2. Customize based on current events, season, and timing
3. Include trends specific to ${currentYear}
4. Prefer topics popular on real platforms (TikTok, Instagram, LinkedIn)
5. Make numbers and percentages RANDOM and REALISTIC each time

Use this format for each topic:

TOPIC: [Very specific trending topic - related to ${niche} but unique]
TREND SCORE: [Between 75-98]
CONTENT IDEAS:
- [Specific, actionable idea 1]
- [Specific, actionable idea 2]
- [Specific, actionable idea 3]
PLATFORMS: [Most suitable 2-3 platforms]
BEST TIME: [Day + specific time range]
WHY TRENDING: [Explain why it's trending as of ${currentDate}, reference current events/season]

---

Now analyze 5 trending topics for ${niche} (make each completely different):`

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2500,
            temperature: 0.9, // YÜKSEK = daha yaratıcı, her seferinde farklı
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          },
        }),
      }
    )

    if (!response.ok) {
      console.error('Llama API failed')
      return getIntelligentTrends(niche, language, currentDate, seasonalContext)
    }

    const result = await response.json()
    
    if (result.error && result.error.includes('loading')) {
      console.log('Model loading, using enhanced fallback')
      return getIntelligentTrends(niche, language, currentDate, seasonalContext)
    }

    const generatedText = result[0]?.generated_text || result.generated_text || ''
    console.log('Generated trends (first 500 chars):', generatedText.substring(0, 500))
    
    const trends = parseTrends(generatedText, language)
    
    if (trends.length < 3) {
      console.log('Not enough trends parsed, using intelligent fallback')
      return getIntelligentTrends(niche, language, currentDate, seasonalContext)
    }
    
    return trends.slice(0, 5)

  } catch (error) {
    console.error('AI trend generation failed:', error)
    return getIntelligentTrends(niche, language, currentDate, seasonalContext)
  }
}

function parseTrends(text: string, language: string): any[] {
  const trends: any[] = []
  const sections = text.split(/(?:KONU:|TOPIC:)/i).filter(function(s: string) { return s.trim() })
  
  for (const section of sections) {
    const topicMatch = section.match(/^([^\n]+)/i)
    const scoreMatch = section.match(/(?:TREND SKORU:|TREND SCORE:)\s*(%?\d+)/i)
    const ideasMatch = section.match(/(?:İÇERİK ÖNERİLERİ:|CONTENT IDEAS:)\s*((?:[-•*]\s*.+\n?)+)/i)
    const platformsMatch = section.match(/(?:PLATFORMLAR:|PLATFORMS:)\s*([^\n]+)/i)
    const timeMatch = section.match(/(?:EN İYİ ZAMAN:|BEST TIME:)\s*([^\n]+)/i)
    const whyMatch = section.match(/(?:NEDEN TREND:|WHY TRENDING:)\s*([^\n]+)/i)
    
    if (topicMatch) {
      let ideas: string[] = []
      if (ideasMatch && ideasMatch[1]) {
        const splitIdeas = ideasMatch[1].split('\n')
        const cleanedIdeas = splitIdeas.map(function(l: string) { return l.replace(/^[-•*]\s*/, '').trim() })
        const filteredIdeas = cleanedIdeas.filter(function(l: string) { return l.length > 10 })
        ideas = filteredIdeas.slice(0, 3)
      }
      
      if (ideas.length >= 2) {
        trends.push({
          topic: topicMatch[1].trim(),
          trendScore: parseInt(scoreMatch?.[1]?.replace('%', '') || String(Math.floor(Math.random() * 23) + 76)),
          contentIdeas: ideas,
          platforms: platformsMatch?.[1].trim() || 'Instagram, TikTok',
          bestTime: timeMatch?.[1].trim() || 'Evening 19:00-21:00',
          whyTrending: whyMatch?.[1].trim() || 'High current engagement'
        })
      }
    }
  }
  
  return trends
}

function getIntelligentTrends(niche: string, language: string, currentDate: string, seasonalContext: string): any[] {
  // Rastgele ama gerçekçi trend skorları
  const scores = Array.from({length: 5}, () => Math.floor(Math.random() * 23) + 76) // 76-98
  
  // Rastgele günler
  const days = language === 'tr' 
    ? ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  const timeSlots = [
    '08:00-10:00', '09:00-11:00', '12:00-14:00', 
    '14:00-16:00', '17:00-19:00', '19:00-21:00', '20:00-22:00'
  ]
  
  const platformSets = [
    'LinkedIn, Twitter',
    'Instagram, TikTok',
    'YouTube, Instagram',
    'TikTok, YouTube Shorts',
    'LinkedIn, Medium',
    'Instagram Reels, TikTok',
    'Twitter, LinkedIn'
  ]
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  if (language === 'tr') {
    // Niş'e ve sezona göre özelleştirilmiş trendler
    const trendTemplates = [
      {
        topic: `${niche} ve yapay zeka entegrasyonu (${currentYear} güncel)`,
        ideas: [
          `ChatGPT ve diğer AI araçları ile ${niche} süreçlerini otomatikleştirme`,
          `${niche} alanında AI kullanarak verimlilik artışı sağlama`,
          `${currentYear}'da ${niche} için en etkili AI araçları`
        ],
        why: `${currentYear} yılında AI dönüşümü her sektörü etkiliyor, ${niche} da bu dalgada`
      },
      {
        topic: `${niche} için kısa video içerik stratejileri`,
        ideas: [
          `60 saniyede ${niche} konusunda viral içerik yaratma formülü`,
          `Reels ve Shorts ile ${niche} kitlenize ulaşma taktikleri`,
          `${niche} konusunda hangi video formatı daha çok izleniyor (vaka analizi)`
        ],
        why: `${seasonalContext} Kısa video formatları tüm platformlarda dominant`
      },
      {
        topic: `${niche} + kişisel marka oluşturma (${currentYear} trendleri)`,
        ideas: [
          `${niche} uzmanı olarak LinkedIn'de thought leader olma yol haritası`,
          `Instagram'da ${niche} influencer'lığına başlama rehberi`,
          `${niche} alanında ${currentYear}'da kişisel markanızı nasıl farklılaştırırsınız`
        ],
        why: `${currentYear}'da kişisel marka değeri artıyor, herkes kendi niş'inde expert olmak istiyor`
      },
      {
        topic: `${niche} için mikro-niş içerik stratejisi`,
        ideas: [
          `Genel ${niche} yerine spesifik alt-konulara odaklanarak daha fazla engagement`,
          `${niche} içinde hangi mikro-nişler şu an daha az rekabetli`,
          `Dar hedef kitle ile derin bağ kurarak ${niche}'de otorite olma`
        ],
        why: `Generic içerik çağı bitti, spesifik ve derinlemesine içerik daha fazla değer görüyor`
      },
      {
        topic: `${niche} vaka çalışmaları ve gerçek sonuçlar`,
        ideas: [
          `${niche} stratejimizi değiştirdik, 90 günde elde ettiğimiz sonuçlar`,
          `${niche} başarı hikayesi: Sıfırdan nasıl büyüdük (sayılarla)`,
          `${niche} deneyimimizden 5 kritik ders (data-driven)`
        ],
        why: `${currentYear}'da insanlar teori değil gerçek sonuçlar ve kanıt görmek istiyor`
      }
    ]
    
    // Shuffle and randomize
    const shuffled = trendTemplates.sort(function() { return Math.random() - 0.5 })
    const selected = shuffled.slice(0, 5)
    const result: any[] = []
    for (let idx = 0; idx < selected.length; idx++) {
      const template = selected[idx]
      result.push({
        topic: template.topic,
        trendScore: scores[idx],
        contentIdeas: template.ideas,
        platforms: platformSets[Math.floor(Math.random() * platformSets.length)],
        bestTime: days[Math.floor(Math.random() * days.length)] + ' ' + timeSlots[Math.floor(Math.random() * timeSlots.length)],
        whyTrending: template.why
      })
    }
    return result
  }
  
  // English trends
  const trendTemplates = [
    {
      topic: `${niche} and AI integration (${currentYear} update)`,
      ideas: [
        `Automating ${niche} workflows with ChatGPT and AI tools`,
        `Boosting ${niche} productivity with artificial intelligence`,
        `Top AI tools for ${niche} professionals in ${currentYear}`
      ],
      why: `AI transformation is impacting every sector in ${currentYear}, ${niche} included`
    },
    {
      topic: `Short-form video strategy for ${niche}`,
      ideas: [
        `Creating viral ${niche} content in 60 seconds formula`,
        `Reaching your ${niche} audience with Reels and Shorts tactics`,
        `Which video format performs best for ${niche} (case study)`
      ],
      why: `${seasonalContext} Short-form video dominates all platforms`
    },
    {
      topic: `${niche} + personal branding (${currentYear} trends)`,
      ideas: [
        `Becoming a ${niche} thought leader on LinkedIn roadmap`,
        `Starting your ${niche} influencer journey on Instagram`,
        `How to differentiate your personal brand in ${niche} in ${currentYear}`
      ],
      why: `In ${currentYear}, personal brand value is rising, everyone wants to be an expert in their niche`
    },
    {
      topic: `Micro-niche content strategy for ${niche}`,
      ideas: [
        `Getting more engagement by focusing on specific sub-topics instead of general ${niche}`,
        `Which micro-niches within ${niche} are less competitive right now`,
        `Building authority in ${niche} through deep connections with narrow audiences`
      ],
      why: `Generic content era is over, specific and in-depth content gets more value`
    },
    {
      topic: `${niche} case studies and real results`,
      ideas: [
        'We changed our ' + niche + ' strategy, results we got in 90 days',
        niche + ' success story: How we grew from zero (with numbers)',
        '5 critical lessons from our ' + niche + ' experience (data-driven)'
      ],
      why: 'In ' + currentYear + ', people want real results and proof, not just theory'
    }
  ]
  
  const shuffledEn = trendTemplates.sort(function() { return Math.random() - 0.5 })
  const selectedEn = shuffledEn.slice(0, 5)
  const resultEn: any[] = []
  for (let idx = 0; idx < selectedEn.length; idx++) {
    const template = selectedEn[idx]
    resultEn.push({
      topic: template.topic,
      trendScore: scores[idx],
      contentIdeas: template.ideas,
      platforms: platformSets[Math.floor(Math.random() * platformSets.length)],
      bestTime: days[Math.floor(Math.random() * days.length)] + ' ' + timeSlots[Math.floor(Math.random() * timeSlots.length)],
      whyTrending: template.why
    })
  }
  return resultEn
}