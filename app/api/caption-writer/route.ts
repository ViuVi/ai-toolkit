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

    console.log('✍️ Caption Writer - Topic:', topic, 'Platform:', platform, 'Tone:', tone, 'Lang:', language)

    // DİNAMİK caption oluştur
    const captions = generateDynamicCaptions(topic, platform, tone, includeEmojis, includeHashtags, language)

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
            output_preview: `${captions.length} captions`,
          })
      }
    }

    return NextResponse.json({ captions })

  } catch (error) {
    console.error('❌ Caption Writer Error:', error)
    return NextResponse.json({ 
      error: language === 'tr' ? 'Bir hata oluştu' : 'An error occurred' 
    }, { status: 500 })
  }
}

function generateDynamicCaptions(topic: string, platform: string, tone: string, includeEmojis: boolean, includeHashtags: boolean, language: string) {
  
  // DİL BAZLI TEMPLATE'LER (Her seferinde farklı kombinasyonlar)
  const templates = {
    instagram: {
      casual: {
        tr: [
          `${topic} ile ilgili bu anı sizlerle paylaşmak istedim`,
          `Bugün ${topic} keşfettim ve bayıldım`,
          `${topic} hakkında düşüncelerinizi merak ediyorum`,
          `Hayatımda ${topic} olmasına çok şükrediyorum`,
          `${topic} beni her zaman mutlu ediyor`,
          `Kim ${topic} sevdalısı burada?`,
          `${topic} anlarım >>> Her şey`,
          `Bi' ${topic} bi' ben, mükemmel kombinasyon`,
          `${topic} enerjisiyle güne başlamak`,
          `Siz de ${topic} tutkunu musunuz?`
        ],
        en: [
          `Sharing this ${topic} moment with you all`,
          `Just discovered ${topic} and I'm obsessed`,
          `Curious about your thoughts on ${topic}`,
          `So grateful for ${topic} in my life`,
          `${topic} always brings me joy`,
          `Who else is a ${topic} enthusiast?`,
          `${topic} moments >>> everything`,
          `Me and ${topic}, perfect combo`,
          `Starting my day with ${topic} energy`,
          `Are you a ${topic} lover too?`
        ]
      },
      professional: {
        tr: [
          `${topic} alanında edindiğim deneyimlerimi paylaşıyorum`,
          `${topic} konusunda bilmeniz gereken 3 önemli nokta`,
          `${topic} stratejilerini derinlemesine inceliyoruz`,
          `${topic} ile ilgili uzman görüşleri`,
          `${topic} trendleri ve gelecek öngörüleri`,
          `Başarılı ${topic} için ipuçları`,
          `${topic} dünyasında yenilikler`,
          `${topic} hakkında sık sorulan sorular`,
          `${topic} ile profesyonel gelişim`,
          `${topic} alanında uzmanlaşma yolculuğum`
        ],
        en: [
          `Sharing my experience in ${topic}`,
          `3 crucial points you need to know about ${topic}`,
          `Deep dive into ${topic} strategies`,
          `Expert insights on ${topic}`,
          `${topic} trends and future predictions`,
          `Tips for successful ${topic}`,
          `Innovation in the world of ${topic}`,
          `Frequently asked questions about ${topic}`,
          `Professional growth through ${topic}`,
          `My journey to mastering ${topic}`
        ]
      },
      inspirational: {
        tr: [
          `${topic} hayallerinizin peşinden gitmenizi sağlasın`,
          `Her gün ${topic} ile daha güçlü oluyorum`,
          `${topic} bana imkansızı mümkün kıldı`,
          `Siz de ${topic} ile hayatınızı değiştirebilirsiniz`,
          `${topic} yolculuğum beni bugünlere getirdi`,
          `Asla vazgeçme, ${topic} seni bekliyor`,
          `${topic} ile her şey mümkün`,
          `Başarı ${topic} ile başlar`,
          `${topic} tutkunu olduğum için şanslıyım`,
          `${topic} ile sınırları zorla`
        ],
        en: [
          `Let ${topic} inspire you to chase your dreams`,
          `Growing stronger with ${topic} every day`,
          `${topic} showed me nothing is impossible`,
          `You can transform your life with ${topic} too`,
          `My ${topic} journey brought me here`,
          `Never give up, ${topic} is waiting for you`,
          `Everything is possible with ${topic}`,
          `Success begins with ${topic}`,
          `Grateful to be passionate about ${topic}`,
          `Push boundaries with ${topic}`
        ]
      },
      funny: {
        tr: [
          `${topic} planım: Yok`,
          `Ben: ${topic} yapmayacağım. Also ben: ${topic}`,
          `${topic} beklenti vs gerçeklik`,
          `Arkadaşlarıma ${topic} anlatmaya çalışırken ben`,
          `${topic} dedikleri tam da böyle bir şey olmalı`,
          `POV: ${topic} keşfettin ve hayatın değişti`,
          `Kimse: ... Ben: ${topic}!`,
          `${topic} sevgisi gerçek mi değil mi tartışması`,
          `${topic} yaparken ben vs normalde ben`,
          `Neden ${topic} bu kadar ilişkilendirilebilir ki?`
        ],
        en: [
          `My ${topic} plan: Nonexistent`,
          `Me: Won't do ${topic}. Also me: Does ${topic}`,
          `${topic} expectations vs reality`,
          `Me trying to explain ${topic} to my friends`,
          `${topic} really be like that`,
          `POV: You discovered ${topic} and life changed`,
          `Nobody: ... Me: ${topic}!`,
          `The ${topic} love is real debate`,
          `Me doing ${topic} vs me normally`,
          `Why is ${topic} so relatable though?`
        ]
      }
    },
    tiktok: {
      casual: {
        tr: [
          `${topic} trendine atlıyorum`,
          `Siz de ${topic} denediniz mi?`,
          `${topic} challenge kabul edildi`,
          `Beklediğiniz ${topic} içeriği`,
          `${topic} ama eğlenceli versiyonu`,
          `Keşfet'e düşsün diye ${topic}`,
          `Viral ${topic} denemesi`,
          `${topic} ile günümü kurtarıyorum`,
          `Part 2 gelsin mi? ${topic} edition`,
          `${topic} hakkında kimsenin söylemediği gerçek`
        ],
        en: [
          `Jumping on the ${topic} trend`,
          `Have you tried ${topic} yet?`,
          `${topic} challenge accepted`,
          `The ${topic} content you've been waiting for`,
          `${topic} but make it fun`,
          `${topic} for the algorithm`,
          `Viral ${topic} attempt`,
          `Saving my day with ${topic}`,
          `Part 2? ${topic} edition`,
          `The truth about ${topic} nobody tells you`
        ]
      },
      professional: {
        tr: [
          `${topic} hakkında bilmeniz gereken 5 şey`,
          `${topic} ile 60 saniyede başarı`,
          `Herkesin yaptığı ${topic} hatası`,
          `${topic} ile oyunun kurallarını değiştir`,
          `${topic} 101: Başlangıç rehberi`,
          `${topic} stratejinizi seviyeye taşıyın`,
          `${topic} uzmanlığına giden yol`,
          `${topic} ile para kazanma yolları`,
          `${topic} trendlerini kaçırmayın`,
          `${topic} ile profesyonelleşin`
        ],
        en: [
          `5 things you must know about ${topic}`,
          `Master ${topic} in 60 seconds`,
          `The ${topic} mistake everyone makes`,
          `Change the game with ${topic}`,
          `${topic} 101: Beginner's guide`,
          `Level up your ${topic} strategy`,
          `Path to ${topic} mastery`,
          `Ways to monetize ${topic}`,
          `Don't miss ${topic} trends`,
          `Go pro with ${topic}`
        ]
      },
      inspirational: {
        tr: [
          `${topic} yolculuğunuz bugün başlıyor`,
          `${topic} ile hayallerinize ulaşın`,
          `${topic} denemek için işaret bu`,
          `${topic} gücüne inanın`,
          `${topic} ile sınırları aşın`,
          `Başarıya ${topic} ile ulaş`,
          `${topic} tutkunu ol, başarılı ol`,
          `${topic} ile imkansız diye bir şey yok`,
          `${topic} seni bekliyor, harekete geç`,
          `${topic} ile değişim zamanı`
        ],
        en: [
          `Your ${topic} journey starts today`,
          `Reach your dreams through ${topic}`,
          `This is your sign to try ${topic}`,
          `Believe in the power of ${topic}`,
          `Break limits with ${topic}`,
          `Achieve success with ${topic}`,
          `Be passionate about ${topic}, be successful`,
          `Nothing is impossible with ${topic}`,
          `${topic} is waiting, take action`,
          `Time to transform with ${topic}`
        ]
      },
      funny: {
        tr: [
          `${topic} enerjisiyle geliyorum`,
          `Ben ${topic} hakkında dramatik olmuyorum değil mi?`,
          `${topic} ama kaotik yap`,
          `${topic} neden böyle ya`,
          `Ben ${topic} anladığımı sanıyorum`,
          `${topic} farklı vuruyor`,
          `${topic} beni şaşırtmayı bırakmıyor`,
          `${topic} açıklaması ama komik`,
          `${topic} seven var mı burda?`,
          `Plot twist: ${topic}`
        ],
        en: [
          `Coming in with ${topic} energy`,
          `I'm not being dramatic about ${topic} right?`,
          `${topic} but make it chaotic`,
          `Why is ${topic} like this`,
          `Thinking I understand ${topic}`,
          `${topic} hits different`,
          `${topic} never stops surprising me`,
          `Explaining ${topic} but funny`,
          `${topic} lovers where you at?`,
          `Plot twist: ${topic}`
        ]
      }
    }
  }

  // CTA'lar (Call to Action)
  const ctas = {
    tr: [
      'Katılıyor musun? 💭',
      'Düşüncelerini yaz! 👇',
      'Etiketle arkadaşını',
      'Kaydet sonra için',
      'Takipte kal daha fazlası için',
      'Beğenmeyi unutma ❤️',
      'Paylaş sevdiklerinle',
      'Senin fikrin ne?',
      'Deneyimlerini paylaş',
      'Bu sana göre mi?'
    ],
    en: [
      'Do you agree? 💭',
      'Drop your thoughts! 👇',
      'Tag a friend',
      'Save for later',
      'Follow for more',
      "Don't forget to like ❤️",
      'Share with friends',
      "What's your take?",
      'Share your experience',
      'Is this you?'
    ]
  }

  // Emoji pool
  const emojisByTone: {[key: string]: string[]} = {
    casual: ['✨', '💫', '🌟', '⭐', '💭', '🔥', '💯', '👀', '💬', '✌️'],
    professional: ['📊', '💼', '🎯', '📈', '✅', '💡', '🔍', '📚', '🎓', '🏆'],
    inspirational: ['🌟', '💪', '🚀', '✨', '🌈', '💫', '🔮', '⚡', '🎯', '💎'],
    funny: ['😂', '🤣', '😅', '😆', '💀', '🤪', '😭', '🤡', '🙃', '😬']
  }

  const platformTemplates = templates[platform.toLowerCase()] || templates['instagram']
  const toneTemplates = platformTemplates[tone.toLowerCase()] || platformTemplates['casual']
  const langTemplates = toneTemplates[language] || toneTemplates['en']
  
  // RASTGELE SEÇ (her seferinde farklı)
  const shuffled = [...langTemplates].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 3)

  const ctaList = ctas[language] || ctas['en']
  const emojis = emojisByTone[tone.toLowerCase()] || emojisByTone['casual']

  return selected.map(template => {
    // Rastgele CTA
    const randomCTA = ctaList[Math.floor(Math.random() * ctaList.length)]
    
    // Rastgele emoji (eğer isteniyorsa)
    let caption = template
    if (includeEmojis && !template.includes('✨') && !template.includes('💫')) {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
      caption = `${randomEmoji} ${template}`
    }

    // Hashtag ekle (eğer isteniyorsa)
    let hashtags = ''
    if (includeHashtags) {
      const topicHash = topic.toLowerCase().replace(/\s+/g, '')
      const extraHashes = language === 'tr'
        ? ['keşfet', 'viral', 'trend', 'instagram', 'tiktok']
        : ['explore', 'viral', 'trending', 'fyp', 'foryou']
      
      const selectedHashes = extraHashes
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
      
      hashtags = `\n\n#${topicHash} #${selectedHashes.join(' #')}`
    }

    return `${caption}\n\n${randomCTA}${hashtags}`
  })
}