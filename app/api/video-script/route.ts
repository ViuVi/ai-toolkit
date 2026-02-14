import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration, style, userId, language = 'en' } = await request.json()

    if (!topic || !platform) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Konu ve platform gerekli' : 'Topic and platform required' 
      }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (!credits || credits.balance < 4) {
        return NextResponse.json({ 
          error: language === 'tr' ? 'Yetersiz kredi (4 kredi gerekli)' : 'Insufficient credits (4 credits required)' 
        }, { status: 403 })
      }
    }

    const script = generateVideoScript(topic, platform, duration, style, language)

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
            balance: currentCredits.balance - 4,
            total_used: currentCredits.total_used + 4,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'video-script-writer',
            tool_display_name: language === 'tr' ? 'Video Script Writer' : 'Video Script Writer',
            credits_used: 4,
            input_preview: `${topic} - ${platform}`,
            output_preview: `${duration}s script`,
          })
      }
    }

    return NextResponse.json({ script })

  } catch (error) {
    console.error('Video Script Error:', error)
    return NextResponse.json({ 
      error: language === 'tr' ? 'Bir hata oluştu' : 'An error occurred' 
    }, { status: 500 })
  }
}

function generateVideoScript(topic: string, platform: string, duration: string, style: string, language: string) {
  
  const hooks = {
    tr: {
      question: [
        `${topic} hakkında bilmediğiniz şey nedir?`,
        `${topic} gerçekten işe yarıyor mu?`,
        `${topic} ile ilgili en büyük sır ne?`
      ],
      shocking: [
        `${topic} hakkında kimsenin söylemediği gerçek`,
        `${topic} ile hayatınız değişebilir`,
        `${topic} hakkında şok edici gerçekler`
      ],
      storytelling: [
        `${topic} ile ilgili başımdan geçen olay`,
        `${topic} benim için her şeyi değiştirdi`,
        `${topic} yolculuğum böyle başladı`
      ]
    },
    en: {
      question: [
        `What you don't know about ${topic}?`,
        `Does ${topic} really work?`,
        `What's the biggest secret about ${topic}?`
      ],
      shocking: [
        `The truth about ${topic} nobody tells you`,
        `${topic} can change your life`,
        `Shocking truths about ${topic}`
      ],
      storytelling: [
        `My ${topic} story`,
        `How ${topic} changed everything for me`,
        `My ${topic} journey started like this`
      ]
    }
  }

  const bodies = {
    tr: [
      `İlk olarak, ${topic} nedir ve neden önemli? Basitçe açıklayalım.`,
      `${topic} konusunda bilmeniz gereken 3 temel nokta var.`,
      `${topic} ile ilgili deneyimlerimi paylaşmak istiyorum.`
    ],
    en: [
      `First, what is ${topic} and why is it important? Let's break it down.`,
      `There are 3 key things you need to know about ${topic}.`,
      `I want to share my experience with ${topic}.`
    ]
  }

  const ctas = {
    tr: [
      'Videoyu beğendiyseniz like atmayı unutmayın!',
      'Abone olarak bizi destekleyebilirsiniz.',
      'Yorumlarda düşüncelerinizi paylaşın.'
    ],
    en: [
      'Don\'t forget to like if you enjoyed this video!',
      'Subscribe to support us.',
      'Share your thoughts in the comments.'
    ]
  }

  const lang = language === 'tr' ? 'tr' : 'en'
  const hookList = hooks[lang][style as keyof typeof hooks['tr']] || hooks[lang].question
  const bodyList = bodies[lang]
  const ctaList = ctas[lang]

  const randomHook = hookList[Math.floor(Math.random() * hookList.length)]
  const randomBody = bodyList[Math.floor(Math.random() * bodyList.length)]
  const randomCTA = ctaList[Math.floor(Math.random() * ctaList.length)]

  const sections = [
    {
      timestamp: '0:00',
      title: language === 'tr' ? 'Giriş (Hook)' : 'Intro (Hook)',
      content: randomHook
    },
    {
      timestamp: duration === '30' ? '0:05' : duration === '60' ? '0:10' : '0:15',
      title: language === 'tr' ? 'Ana İçerik' : 'Main Content',
      content: randomBody
    },
    {
      timestamp: duration === '30' ? '0:20' : duration === '60' ? '0:45' : '2:30',
      title: language === 'tr' ? 'Sonuç & CTA' : 'Conclusion & CTA',
      content: randomCTA
    }
  ]

  return {
    topic,
    platform,
    duration: `${duration}s`,
    style,
    sections,
    totalWords: sections.reduce((acc, s) => acc + s.content.split(' ').length, 0),
    estimatedReadingTime: `${Math.ceil(sections.reduce((acc, s) => acc + s.content.split(' ').length, 0) / 150)}min`
  }
}