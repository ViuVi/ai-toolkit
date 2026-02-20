import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, includeEmojis, includeHashtags, userId, language = 'en' } = await request.json()

    if (!topic || !platform) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Konu ve platform gerekli' : 'Topic and platform required' 
      }, { status: 400 })
    }

    // Kredi kontrolü
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

    console.log('✍️ Caption Writer AI - Topic:', topic, 'Platform:', platform, 'Tone:', tone, 'Lang:', language)

    // AI İLE CAPTİON OLUŞTUR
    const captions = await generateCaptionsWithAI(topic, platform, tone, includeEmojis, includeHashtags, language)

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
            tool_name: 'caption-writer',
            tool_display_name: language === 'tr' ? 'Caption Writer' : 'Caption Writer',
            credits_used: 2,
            input_preview: `${topic} - ${platform}`,
            output_preview: `${captions.length} captions generated`,
          })
      }
    }

    return NextResponse.json({ captions })

  } catch (error) {
    console.error('❌ Caption Writer Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

async function generateCaptionsWithAI(topic: string, platform: string, tone: string, includeEmojis: boolean, includeHashtags: boolean, language: string): Promise<string[]> {
  
  const toneDescriptions: {[key: string]: {tr: string, en: string}} = {
    casual: { tr: 'samimi ve rahat', en: 'casual and friendly' },
    professional: { tr: 'profesyonel ve ciddi', en: 'professional and serious' },
    inspirational: { tr: 'ilham verici ve motive edici', en: 'inspirational and motivating' },
    funny: { tr: 'komik ve eğlenceli', en: 'funny and entertaining' }
  }

  const platformGuidelines: {[key: string]: {tr: string, en: string}} = {
    instagram: { 
      tr: 'Instagram için 150-200 karakter, görsel odaklı, etkileşim çağrısı ile', 
      en: 'For Instagram: 150-200 chars, visual-focused, with engagement call' 
    },
    tiktok: { 
      tr: 'TikTok için kısa, enerjik, trend odaklı, 80-100 karakter', 
      en: 'For TikTok: short, energetic, trend-focused, 80-100 chars' 
    },
    twitter: { 
      tr: 'Twitter için özlü, 240 karakterin altında', 
      en: 'For Twitter: concise, under 240 chars' 
    },
    linkedin: { 
      tr: 'LinkedIn için profesyonel, değer odaklı, 200-300 karakter', 
      en: 'For LinkedIn: professional, value-focused, 200-300 chars' 
    },
    youtube: { 
      tr: 'YouTube için açıklayıcı, anahtar kelime içeren', 
      en: 'For YouTube: descriptive, keyword-rich' 
    }
  }

  const toneDesc = toneDescriptions[tone] || toneDescriptions.casual
  const platformGuide = platformGuidelines[platform] || platformGuidelines.instagram

  const prompt = language === 'tr'
    ? `Sen yaratıcı bir sosyal medya uzmanısın. "${topic}" konusu için ${platform} platformuna uygun 3 farklı caption yaz.

TON: ${toneDesc.tr}
PLATFORM: ${platformGuide.tr}
${includeEmojis ? 'Her caption\'a uygun emojiler ekle' : 'Emoji kullanma'}
${includeHashtags ? 'Her caption\'a 3-5 alakalı hashtag ekle' : 'Hashtag kullanma'}

Her caption\'ı ayrı bir satırda yaz. Her biri tamamen farklı ve özgün olsun.
Sonunda bir Call-to-Action (yorum yap, kaydet, paylaş vb.) olsun.

3 caption yaz (her biri yeni satırda):`
    : `You are a creative social media expert. Write 3 different captions for "${topic}" suitable for ${platform}.

TONE: ${toneDesc.en}
PLATFORM: ${platformGuide.en}
${includeEmojis ? 'Include appropriate emojis in each caption' : 'Do not use emojis'}
${includeHashtags ? 'Add 3-5 relevant hashtags to each caption' : 'Do not use hashtags'}

Write each caption on a separate line. Each should be completely different and unique.
End with a Call-to-Action (comment, save, share, etc.)

Write 3 captions (each on a new line):`

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.9,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          },
        }),
      }
    )

    if (!response.ok) {
      console.error('Llama API failed, using enhanced fallback')
      return generateEnhancedCaptions(topic, platform, tone, includeEmojis, includeHashtags, language)
    }

    const result = await response.json()
    
    if (result.error && result.error.includes('loading')) {
      console.log('Model loading, using fallback')
      return generateEnhancedCaptions(topic, platform, tone, includeEmojis, includeHashtags, language)
    }

    const generatedText = result[0]?.generated_text || result.generated_text || ''
    console.log('AI Generated Captions (first 300):', generatedText.substring(0, 300))
    
    // Parse captions
    const captions = parseCaptions(generatedText, topic, platform, tone, includeEmojis, includeHashtags, language)
    
    if (captions.length < 2) {
      return generateEnhancedCaptions(topic, platform, tone, includeEmojis, includeHashtags, language)
    }

    return captions.slice(0, 3)

  } catch (error) {
    console.error('AI caption generation failed:', error)
    return generateEnhancedCaptions(topic, platform, tone, includeEmojis, includeHashtags, language)
  }
}

function parseCaptions(text: string, topic: string, platform: string, tone: string, includeEmojis: boolean, includeHashtags: boolean, language: string): string[] {
  // Split by numbered items, newlines, or dashes
  const splitLines = text.split(/\n+/)
  const mappedLines = splitLines.map(function(l: string) { return l.replace(/^\d+[\.\)]\s*|^[-•]\s*/, '').trim() })
  let lines = mappedLines.filter(function(l: string) { return l.length > 30 && l.length < 500 })
  
  // Filter out lines that look like instructions
  lines = lines.filter(function(l: string) { 
    return !l.toLowerCase().includes('caption') && 
           !l.toLowerCase().includes('write') &&
           !l.toLowerCase().includes('here are')
  })
  
  // Ensure each caption has proper structure
  const processedCaptions: string[] = []
  const captionsToProcess = lines.slice(0, 3)
  
  for (let i = 0; i < captionsToProcess.length; i++) {
    let processed = captionsToProcess[i]
    
    // Add hashtags if needed and not present
    if (includeHashtags && !processed.includes('#')) {
      const topicHash = topic.toLowerCase().replace(/\s+/g, '')
      const platformHashes: {[key: string]: string[]} = {
        instagram: ['instagood', 'explore', 'viral'],
        tiktok: ['fyp', 'viral', 'trending'],
        youtube: ['youtube', 'subscribe', 'video'],
        twitter: ['trending', 'viral', 'thread'],
        linkedin: ['business', 'success', 'growth']
      }
      const hashes = platformHashes[platform] || platformHashes.instagram
      const shuffledHashes = hashes.sort(function() { return Math.random() - 0.5 })
      const selectedHashes = shuffledHashes.slice(0, 3)
      processed += '\n\n#' + topicHash + ' #' + selectedHashes.join(' #')
    }
    
    processedCaptions.push(processed)
  }
  
  return processedCaptions
}

function generateEnhancedCaptions(topic: string, platform: string, tone: string, includeEmojis: boolean, includeHashtags: boolean, language: string): string[] {
  
  const topicLower = topic.toLowerCase()
  
  // Çok daha zengin ve dinamik template sistemi
  const templates: {[key: string]: {[key: string]: {[key: string]: string[]}}} = {
    instagram: {
      casual: {
        tr: [
          `${topic} ile günümü renklendirdim ${includeEmojis ? '✨' : ''}\n\nBu kadar güzel bir an paylaşmadan geçemezdim. Sizin ${topic} deneyimleriniz nasıl?\n\n${includeEmojis ? '💬' : ''} Yorumlarda buluşalım!`,
          `Bugün ${topic} hakkında fark ettiğim şey: Küçük detaylar büyük fark yaratıyor ${includeEmojis ? '🌟' : ''}\n\nSiz de bunu deneyimlediniz mi?\n\n${includeEmojis ? '👇' : ''} Düşüncelerinizi merak ediyorum`,
          `${topic} ${includeEmojis ? '💫' : ''}\n\nHer gün yeni bir şey öğreniyorum ve bunu sizlerle paylaşmak istiyorum.\n\n${includeEmojis ? '🔖' : ''} Kaydetmeyi unutmayın!`
        ],
        en: [
          `${topic} made my day ${includeEmojis ? '✨' : ''}\n\nCouldn't pass without sharing this beautiful moment. How's your ${topic} experience?\n\n${includeEmojis ? '💬' : ''} Let's chat in the comments!`,
          `What I noticed about ${topic} today: Small details make a big difference ${includeEmojis ? '🌟' : ''}\n\nHave you experienced this too?\n\n${includeEmojis ? '👇' : ''} I'm curious about your thoughts`,
          `${topic} ${includeEmojis ? '💫' : ''}\n\nLearning something new every day and I want to share it with you.\n\n${includeEmojis ? '🔖' : ''} Don't forget to save!`
        ]
      },
      professional: {
        tr: [
          `${topic} konusunda profesyonel yaklaşım ${includeEmojis ? '📊' : ''}\n\nBu alanda başarılı olmak için dikkat edilmesi gereken 3 temel faktör var.\n\nDetaylar için kaydedin ${includeEmojis ? '💼' : ''}`,
          `${topic} sektöründe oyunun kuralları değişiyor ${includeEmojis ? '🎯' : ''}\n\nAdaptasyon yeteneğiniz başarınızı belirleyecek.\n\n${includeEmojis ? '🔗' : ''} Bio'daki linkten daha fazlasına ulaşın`,
          `${topic} ile ilgili stratejik düşünceler ${includeEmojis ? '💡' : ''}\n\nDoğru planlama ile hedeflerinize daha hızlı ulaşabilirsiniz.\n\n${includeEmojis ? '📈' : ''} Takipte kalın`
        ],
        en: [
          `Professional approach to ${topic} ${includeEmojis ? '📊' : ''}\n\nThere are 3 key factors to pay attention to for success in this field.\n\nSave for details ${includeEmojis ? '💼' : ''}`,
          `The rules of the game are changing in ${topic} ${includeEmojis ? '🎯' : ''}\n\nYour adaptability will determine your success.\n\n${includeEmojis ? '🔗' : ''} Find more at the link in bio`,
          `Strategic thoughts on ${topic} ${includeEmojis ? '💡' : ''}\n\nWith proper planning, you can reach your goals faster.\n\n${includeEmojis ? '📈' : ''} Stay tuned`
        ]
      },
      inspirational: {
        tr: [
          `${topic} yolculuğunda her adım değerli ${includeEmojis ? '🚀' : ''}\n\nBugün attığın küçük adım, yarının büyük başarısının temelidir.\n\n${includeEmojis ? '💪' : ''} Asla vazgeçme!`,
          `${topic} ile hayallerinin peşinden git ${includeEmojis ? '⭐' : ''}\n\nSınırlar sadece zihninde var. Onları aş ve parlak geleceğini inşa et.\n\n${includeEmojis ? '✨' : ''} Sen bunu hak ediyorsun`,
          `Her gün ${topic} konusunda biraz daha ileri ${includeEmojis ? '🌟' : ''}\n\nİlerleme mükemmellikten daha önemli. Adım adım devam et.\n\n${includeEmojis ? '🙌' : ''} Seninle gurur duyuyorum`
        ],
        en: [
          `Every step in the ${topic} journey matters ${includeEmojis ? '🚀' : ''}\n\nThe small step you take today is the foundation of tomorrow's great success.\n\n${includeEmojis ? '💪' : ''} Never give up!`,
          `Chase your dreams with ${topic} ${includeEmojis ? '⭐' : ''}\n\nLimits exist only in your mind. Break them and build your bright future.\n\n${includeEmojis ? '✨' : ''} You deserve this`,
          `Getting better at ${topic} every single day ${includeEmojis ? '🌟' : ''}\n\nProgress matters more than perfection. Keep moving forward.\n\n${includeEmojis ? '🙌' : ''} I'm proud of you`
        ]
      },
      funny: {
        tr: [
          `${topic} planım: Yok ${includeEmojis ? '😅' : ''}\n\nAma yine de bir şekilde hallolacak... değil mi?\n\n${includeEmojis ? '🤷‍♂️' : ''} Siz de böyle misiniz?`,
          `Ben: ${topic} ile uğraşmayacağım\nAlso ben: *${topic}* ${includeEmojis ? '😂' : ''}\n\nKendimi kandırmakta üstüme yok.\n\n${includeEmojis ? '👇' : ''} Beni anlayan var mı?`,
          `${topic} deneyimim: Beklenti vs Gerçeklik ${includeEmojis ? '🤡' : ''}\n\nHiçbir şey planlandığı gibi gitmiyor ama en azından eğlenceli.\n\n${includeEmojis ? '💀' : ''} Relate eden etiketlesin`
        ],
        en: [
          `My ${topic} plan: Non-existent ${includeEmojis ? '😅' : ''}\n\nBut somehow it'll work out... right?\n\n${includeEmojis ? '🤷‍♂️' : ''} Anyone else like this?`,
          `Me: I won't deal with ${topic}\nAlso me: *does ${topic}* ${includeEmojis ? '😂' : ''}\n\nI'm a pro at fooling myself.\n\n${includeEmojis ? '👇' : ''} Anyone relate?`,
          `My ${topic} experience: Expectation vs Reality ${includeEmojis ? '🤡' : ''}\n\nNothing goes as planned but at least it's fun.\n\n${includeEmojis ? '💀' : ''} Tag someone who relates`
        ]
      }
    },
    tiktok: {
      casual: {
        tr: [
          `${topic} check ${includeEmojis ? '✨' : ''} Beklediğiniz içerik geldi!`,
          `POV: ${topic} keşfettin ${includeEmojis ? '🔥' : ''} Part 2 gelsin mi?`,
          `${topic} ama farklı ${includeEmojis ? '💫' : ''} Beğen + kaydet = part 2`
        ],
        en: [
          `${topic} check ${includeEmojis ? '✨' : ''} The content you've been waiting for!`,
          `POV: You discovered ${topic} ${includeEmojis ? '🔥' : ''} Want part 2?`,
          `${topic} but different ${includeEmojis ? '💫' : ''} Like + save = part 2`
        ]
      },
      professional: {
        tr: [
          `${topic} hakkında bilmeniz gereken tek şey ${includeEmojis ? '📚' : ''} Kaydet!`,
          `3 saniyede ${topic} öğren ${includeEmojis ? '⚡' : ''} Takip et`,
          `${topic} masterclass ${includeEmojis ? '🎯' : ''} Daha fazlası için takipte kal`
        ],
        en: [
          `The one thing you need to know about ${topic} ${includeEmojis ? '📚' : ''} Save this!`,
          `Learn ${topic} in 3 seconds ${includeEmojis ? '⚡' : ''} Follow for more`,
          `${topic} masterclass ${includeEmojis ? '🎯' : ''} Follow for more tips`
        ]
      },
      inspirational: {
        tr: [
          `${topic} ile başarı ${includeEmojis ? '🚀' : ''} Bunu denemelisin!`,
          `${topic} yolculuğun bugün başlıyor ${includeEmojis ? '✨' : ''} Yapabilirsin!`,
          `${topic} güç veriyor ${includeEmojis ? '💪' : ''} Devam et!`
        ],
        en: [
          `Success with ${topic} ${includeEmojis ? '🚀' : ''} You need to try this!`,
          `Your ${topic} journey starts today ${includeEmojis ? '✨' : ''} You got this!`,
          `${topic} gives you power ${includeEmojis ? '💪' : ''} Keep going!`
        ]
      },
      funny: {
        tr: [
          `${topic} ama kaotik ${includeEmojis ? '😭' : ''} Anlayan anladı`,
          `Ben ${topic} anladığımı sanıyorum ${includeEmojis ? '🤡' : ''}`,
          `${topic} neden böyle ${includeEmojis ? '💀' : ''} Birisi açıklasın`
        ],
        en: [
          `${topic} but chaotic ${includeEmojis ? '😭' : ''} IYKYK`,
          `Me thinking I understand ${topic} ${includeEmojis ? '🤡' : ''}`,
          `Why is ${topic} like this ${includeEmojis ? '💀' : ''} Someone explain`
        ]
      }
    }
  }

  // Get templates for platform and tone
  const platformTemplates = templates[platform] || templates.instagram
  const toneTemplates = platformTemplates[tone] || platformTemplates.casual
  const langTemplates = language === 'tr' ? toneTemplates.tr : toneTemplates.en

  // Shuffle and select
  const shuffled = [...langTemplates].sort(function() { return Math.random() - 0.5 })
  
  // Add hashtags if needed
  if (includeHashtags) {
    const topicHash = topic.toLowerCase().replace(/\s+/g, '')
    const platformHashes: {[key: string]: string[]} = {
      instagram: ['instagood', 'explore', 'viral', 'trending', 'reels'],
      tiktok: ['fyp', 'foryou', 'viral', 'trending', 'xyzbca'],
      twitter: ['trending', 'viral', 'mustread'],
      linkedin: ['business', 'success', 'growth', 'professional'],
      youtube: ['youtube', 'subscribe', 'video', 'shorts']
    }
    
    const hashes = platformHashes[platform] || platformHashes.instagram
    const selectedHashes = hashes.sort(function() { return Math.random() - 0.5 }).slice(0, 3)
    
    return shuffled.map(function(caption: string) { return `${caption}\n\n#${topicHash} #${selectedHashes.join(' #')}`)
  }
  
  return shuffled
}