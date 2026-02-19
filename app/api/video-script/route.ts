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

    console.log('🎬 Video Script AI - Topic:', topic, 'Platform:', platform, 'Style:', style)

    // GERÇEK AI İLE SCRİPT OLUŞTUR
    const script = await generateScriptWithAI(topic, platform, duration, style, language)

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
            output_preview: `${duration}s script generated`,
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

async function generateScriptWithAI(topic: string, platform: string, duration: string, style: string, language: string) {
  
  const durationText = duration === '30' ? '30 saniye / 30 seconds' : duration === '60' ? '1 dakika / 1 minute' : '3 dakika / 3 minutes'
  
  const styleDescriptions: {[key: string]: {tr: string, en: string}} = {
    question: { tr: 'Soru sorarak merak uyandır', en: 'Create curiosity with questions' },
    shocking: { tr: 'Şok edici ve dikkat çekici', en: 'Shocking and attention-grabbing' },
    storytelling: { tr: 'Hikaye anlatımı ile bağ kur', en: 'Connect through storytelling' }
  }
  
  const styleDesc = styleDescriptions[style] || styleDescriptions.question

  const prompt = language === 'tr'
    ? `Sen profesyonel bir video script yazarısın. ${platform} için ${durationText} uzunluğunda, "${topic}" konulu bir video scripti yaz.

STIL: ${styleDesc.tr}

KURALLAR:
1. Hook (ilk 3 saniye) çok güçlü olmalı - izleyiciyi yakala
2. Ana içerik net ve akıcı olmalı
3. Call-to-action ile bitir
4. ${platform === 'tiktok' ? 'Kısa, enerjik, trend odaklı' : platform === 'youtube' ? 'Detaylı, bilgilendirici' : 'Görsel odaklı'}
5. Konuşma dili kullan, samimi ol

FORMAT (bu formatı kullan):
[0:00-0:03] HOOK:
(Güçlü açılış cümlesi)

[0:03-${duration === '30' ? '0:20' : duration === '60' ? '0:45' : '2:30'}] ANA İÇERİK:
(Ana mesaj ve bilgiler - madde madde değil akıcı anlatım)

[${duration === '30' ? '0:20-0:30' : duration === '60' ? '0:45-1:00' : '2:30-3:00'}] KAPANIŞ & CTA:
(Çağrı ve kapanış)

Şimdi "${topic}" için scripti yaz:`
    : `You are a professional video script writer. Write a ${durationText} video script for ${platform} about "${topic}".

STYLE: ${styleDesc.en}

RULES:
1. Hook (first 3 seconds) must be powerful - grab the viewer
2. Main content should be clear and flowing
3. End with a call-to-action
4. ${platform === 'tiktok' ? 'Short, energetic, trend-focused' : platform === 'youtube' ? 'Detailed, informative' : 'Visual-focused'}
5. Use conversational language, be authentic

FORMAT (use this format):
[0:00-0:03] HOOK:
(Strong opening line)

[0:03-${duration === '30' ? '0:20' : duration === '60' ? '0:45' : '2:30'}] MAIN CONTENT:
(Main message and info - flowing narrative, not bullet points)

[${duration === '30' ? '0:20-0:30' : duration === '60' ? '0:45-1:00' : '2:30-3:00'}] CLOSING & CTA:
(Call to action and closing)

Now write the script for "${topic}":`

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
            max_new_tokens: 1500,
            temperature: 0.8,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          },
        }),
      }
    )

    if (!response.ok) {
      console.error('Llama API failed, using enhanced fallback')
      return generateEnhancedFallback(topic, platform, duration, style, language)
    }

    const result = await response.json()
    
    if (result.error && result.error.includes('loading')) {
      console.log('Model loading, using fallback')
      return generateEnhancedFallback(topic, platform, duration, style, language)
    }

    const generatedText = result[0]?.generated_text || result.generated_text || ''
    console.log('AI Generated Script (first 300):', generatedText.substring(0, 300))
    
    // Parse script sections
    const sections = parseAIScript(generatedText, duration, language)
    
    if (sections.length < 2) {
      return generateEnhancedFallback(topic, platform, duration, style, language)
    }

    // Kelime ve süre hesapla
    const totalWords = sections.reduce((acc, s) => acc + s.content.split(' ').length, 0)
    
    return {
      topic,
      platform,
      duration: `${duration}s`,
      style,
      sections,
      totalWords,
      estimatedReadingTime: `${Math.ceil(totalWords / 150)} min`,
      generatedBy: 'AI'
    }

  } catch (error) {
    console.error('AI script generation failed:', error)
    return generateEnhancedFallback(topic, platform, duration, style, language)
  }
}

function parseAIScript(text: string, duration: string, language: string): Array<{timestamp: string, title: string, content: string}> {
  const sections: Array<{timestamp: string, title: string, content: string}> = []
  
  // Try to parse formatted sections
  const hookMatch = text.match(/\[0:00[^\]]*\]\s*(?:HOOK:?)?\s*\n?([\s\S]*?)(?=\[0:|$)/i)
  const mainMatch = text.match(/\[0:0[35][^\]]*\]\s*(?:ANA İÇERİK:|MAIN CONTENT:?)?\s*\n?([\s\S]*?)(?=\[0:|$)/i)
  const ctaMatch = text.match(/\[(?:0:[234]|[123]:)[^\]]*\]\s*(?:KAPANIŞ|CLOSING|CTA)[^\n]*\n?([\s\S]*?)$/i)
  
  if (hookMatch && hookMatch[1].trim().length > 10) {
    sections.push({
      timestamp: '0:00',
      title: language === 'tr' ? 'Giriş (Hook)' : 'Intro (Hook)',
      content: hookMatch[1].trim().substring(0, 300)
    })
  }
  
  if (mainMatch && mainMatch[1].trim().length > 20) {
    sections.push({
      timestamp: duration === '30' ? '0:05' : duration === '60' ? '0:10' : '0:15',
      title: language === 'tr' ? 'Ana İçerik' : 'Main Content',
      content: mainMatch[1].trim().substring(0, 800)
    })
  }
  
  if (ctaMatch && ctaMatch[1].trim().length > 10) {
    sections.push({
      timestamp: duration === '30' ? '0:20' : duration === '60' ? '0:45' : '2:30',
      title: language === 'tr' ? 'Sonuç & CTA' : 'Conclusion & CTA',
      content: ctaMatch[1].trim().substring(0, 300)
    })
  }
  
  // If parsing failed, try splitting by newlines
  if (sections.length < 2) {
    const lines = text.split('\n').filter(l => l.trim().length > 20)
    if (lines.length >= 3) {
      sections.push({
        timestamp: '0:00',
        title: language === 'tr' ? 'Giriş (Hook)' : 'Intro (Hook)',
        content: lines[0].trim()
      })
      sections.push({
        timestamp: duration === '30' ? '0:05' : '0:10',
        title: language === 'tr' ? 'Ana İçerik' : 'Main Content',
        content: lines.slice(1, -1).join(' ').trim()
      })
      sections.push({
        timestamp: duration === '30' ? '0:20' : '0:45',
        title: language === 'tr' ? 'Sonuç & CTA' : 'Conclusion & CTA',
        content: lines[lines.length - 1].trim()
      })
    }
  }
  
  return sections
}

function generateEnhancedFallback(topic: string, platform: string, duration: string, style: string, language: string) {
  
  // Konuyu kısalt
  const shortTopic = topic.length > 30 ? topic.substring(0, 30) : topic
  
  // Rastgele varyasyonlar
  const num = Math.floor(Math.random() * 5) + 3
  const days = Math.floor(Math.random() * 20) + 5
  
  const hooks: {[key: string]: {tr: string[], en: string[]}} = {
    question: {
      tr: [
        `${topic} hakkında hiç düşündünüz mü?`,
        `Neden herkes ${topic} konusunda yanılıyor?`,
        `${topic} ile ilgili bu gerçeği biliyor musunuz?`,
        `${topic} hakkında size bir sır vereyim...`
      ],
      en: [
        `Have you ever thought about ${topic}?`,
        `Why is everyone wrong about ${topic}?`,
        `Did you know this truth about ${topic}?`,
        `Let me tell you a secret about ${topic}...`
      ]
    },
    shocking: {
      tr: [
        `${topic} hakkında az önce öğrendiğim şey beni şok etti!`,
        `${topic} ile ilgili kimsenin söylemediği gerçek`,
        `Bu ${topic} stratejisi her şeyi değiştirdi`,
        `${topic} hakkında ${days} gündür denediğim şeyin sonucu`
      ],
      en: [
        `What I just learned about ${topic} shocked me!`,
        `The truth about ${topic} nobody tells you`,
        `This ${topic} strategy changed everything`,
        `The result of what I tried for ${days} days about ${topic}`
      ]
    },
    storytelling: {
      tr: [
        `${topic} yolculuğum böyle başladı...`,
        `${topic} ile ilgili başımdan geçen hikaye`,
        `${topic} benim için her şeyi nasıl değiştirdi`,
        `${days} gün önce ${topic} ile tanışmasaydım...`
      ],
      en: [
        `This is how my ${topic} journey started...`,
        `My story with ${topic}`,
        `How ${topic} changed everything for me`,
        `If I hadn't discovered ${topic} ${days} days ago...`
      ]
    }
  }
  
  const mainContents: {[key: string]: string[]} = {
    tr: [
      `${topic} konusunda dikkat etmeniz gereken ${num} önemli nokta var. Birincisi, temel prensipleri anlamak çok önemli. İkincisi, düzenli pratik yapmadan sonuç alamazsınız. Üçüncüsü, sabırlı olmalısınız çünkü bu bir süreç. Ve son olarak, başkalarının deneyimlerinden öğrenmeyi ihmal etmeyin.`,
      `Şimdi size ${topic} hakkında çoğu kişinin bilmediği bir şey söyleyeceğim. Bu stratejiyi uyguladığınızda sonuçları hemen görmeye başlayacaksınız. Ama önce mevcut alışkanlıklarınızı gözden geçirmeniz gerekiyor.`,
      `${topic} ile ilgili en büyük yanılgı şu: Herkes bunun zor olduğunu düşünüyor. Ama aslında doğru yaklaşımla çok basit. Size tam olarak nasıl yapacağınızı göstereyim.`
    ],
    en: [
      `There are ${num} important points you need to pay attention to about ${topic}. First, understanding the basic principles is very important. Second, you can't get results without regular practice. Third, you need to be patient because this is a process. And finally, don't neglect learning from others' experiences.`,
      `Now I'm going to tell you something about ${topic} that most people don't know. When you apply this strategy, you'll start seeing results immediately. But first, you need to review your current habits.`,
      `The biggest misconception about ${topic} is this: Everyone thinks it's difficult. But it's actually very simple with the right approach. Let me show you exactly how to do it.`
    ]
  }
  
  const ctas: {[key: string]: string[]} = {
    tr: [
      'Videoyu beğendiyseniz like atmayı ve abone olmayı unutmayın! Yorumlarda düşüncelerinizi paylaşın.',
      'Bu stratejiyi deneyecek misiniz? Yorumlarda bana söyleyin! Takipte kalın daha fazlası için.',
      'Kaydedin ve daha sonra tekrar izleyin. Arkadaşlarınızla paylaşmayı unutmayın!'
    ],
    en: [
      'If you enjoyed this video, don\'t forget to like and subscribe! Share your thoughts in the comments.',
      'Will you try this strategy? Tell me in the comments! Follow for more content.',
      'Save this and watch it again later. Don\'t forget to share with your friends!'
    ]
  }
  
  const hookList = hooks[style]?.[language] || hooks.question[language] || hooks.question.en
  const mainList = mainContents[language] || mainContents.en
  const ctaList = ctas[language] || ctas.en
  
  const sections = [
    {
      timestamp: '0:00',
      title: language === 'tr' ? 'Giriş (Hook)' : 'Intro (Hook)',
      content: hookList[Math.floor(Math.random() * hookList.length)]
    },
    {
      timestamp: duration === '30' ? '0:05' : duration === '60' ? '0:10' : '0:15',
      title: language === 'tr' ? 'Ana İçerik' : 'Main Content',
      content: mainList[Math.floor(Math.random() * mainList.length)]
    },
    {
      timestamp: duration === '30' ? '0:20' : duration === '60' ? '0:45' : '2:30',
      title: language === 'tr' ? 'Sonuç & CTA' : 'Conclusion & CTA',
      content: ctaList[Math.floor(Math.random() * ctaList.length)]
    }
  ]

  return {
    topic,
    platform,
    duration: `${duration}s`,
    style,
    sections,
    totalWords: sections.reduce((acc, s) => acc + s.content.split(' ').length, 0),
    estimatedReadingTime: `${Math.ceil(sections.reduce((acc, s) => acc + s.content.split(' ').length, 0) / 150)} min`,
    generatedBy: 'Enhanced Template'
  }
}