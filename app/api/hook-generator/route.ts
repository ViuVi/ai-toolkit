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

    // Llama 3.2 ile hook üret
    const hooks = await generateHooksWithLlama(topic, language)

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
            tool_display_name: language === 'tr' ? 'Hook Üretici' : 'Hook Generator',
            credits_used: 2,
            input_preview: topic.substring(0, 200),
            output_preview: hooks[0]?.text.substring(0, 100) || 'Hooks generated',
          })
      }
    }

    return NextResponse.json({ hooks })

  } catch (error) {
    console.error('❌ Hook Generator Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

async function generateHooksWithLlama(topic: string, language: string): Promise<Array<{type: string, emoji: string, text: string, reason: string}>> {
  
  const prompt = language === 'tr'
    ? `Sen yaratıcı bir içerik yazarısısın. Konu: "${topic}"

Bu konu için 8 farklı viral başlık (hook) yaz. Her biri farklı bir psikolojik tetikleyici kullanmalı. Her satıra bir hook yaz, şu formatla:

[TİP]|[EMOJİ]|[BAŞLIK]|[NEDEN ETKİLİ]

Örnekler:
curiosity|🤔|${topic} hakkında kimsenin bilmediği 7 şey|Merak boşluğu yaratır
shocking|😱|${topic} ile ilgili az önce öğrendiklerim şok etti|Sürpriz dikkat çeker
question|❓|${topic} konusunda gerçekten ne kadar biliyorsunuz?|Kendini test ettir
story|📖|${topic} sayesinde hayatım değişti. İşte nasıl...|Dönüşüm hikayesi

Şimdi 8 hook yaz (curiosity, shocking, question, story, curiosity, shocking, question, statistic):`
    : `You are a creative content writer. Topic: "${topic}"

Write 8 different viral hooks for this topic. Each should use a different psychological trigger. Write one hook per line in this format:

[TYPE]|[EMOJI]|[HOOK TEXT]|[WHY IT WORKS]

Examples:
curiosity|🤔|7 things nobody tells you about ${topic}|Creates information gap
shocking|😱|What I learned about ${topic} just shocked me|Surprise grabs attention
question|❓|How much do you really know about ${topic}?|Makes you self-test
story|📖|${topic} changed my life. Here's how...|Transformation story

Now write 8 hooks (curiosity, shocking, question, story, curiosity, shocking, question, statistic):`

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
            max_new_tokens: 1000,
            temperature: 0.9,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          },
        }),
      }
    )

    if (!response.ok) {
      console.error('Llama API failed, status:', response.status)
      throw new Error('Llama API failed')
    }

    const result = await response.json()
    
    // Model yükleniyorsa bekle
    if (result.error && result.error.includes('loading')) {
      console.log('Model loading, waiting 20s...')
      await new Promise(resolve => setTimeout(resolve, 20000))
      return generateHooksWithLlama(topic, language) // Retry
    }

    const generatedText = result[0]?.generated_text || result.generated_text || ''
    console.log('Generated hooks:', generatedText.substring(0, 200))
    
    // Parse hooks
    const hooks = parseHooks(generatedText, language)
    
    if (hooks.length < 4) {
      console.log('Not enough hooks parsed, using enhanced fallback')
      return getEnhancedFallbackHooks(topic, language)
    }
    
    return hooks.slice(0, 8)

  } catch (error) {
    console.error('Llama generation failed:', error)
    return getEnhancedFallbackHooks(topic, language)
  }
}

function parseHooks(text: string, language: string): Array<{type: string, emoji: string, text: string, reason: string}> {
  const hooks: Array<{type: string, emoji: string, text: string, reason: string}> = []
  const lines = text.split('\n').filter(line => line.trim())
  
  for (const line of lines) {
    // Format: TYPE|EMOJI|TEXT|REASON
    const parts = line.split('|')
    if (parts.length >= 4) {
      const [type, emoji, hookText, reason] = parts.map(p => p.trim())
      
      if (hookText && hookText.length > 10 && hookText.length < 200) {
        hooks.push({
          type: type.toLowerCase() || 'curiosity',
          emoji: emoji || '💡',
          text: hookText,
          reason: reason || (language === 'tr' ? 'Dikkat çeker' : 'Grabs attention')
        })
      }
    }
  }
  
  return hooks
}

function getEnhancedFallbackHooks(topic: string, language: string): Array<{type: string, emoji: string, text: string, reason: string}> {
  // Rastgele değişkenler - her seferinde farklı
  const num1 = Math.floor(Math.random() * 7) + 3 // 3-10
  const num2 = Math.floor(Math.random() * 9) + 2 // 2-11
  const days = Math.floor(Math.random() * 25) + 5 // 5-30
  const percent = Math.floor(Math.random() * 40) + 50 // 50-90
  const year = 2020 + Math.floor(Math.random() * 5) // 2020-2025
  
  // Konuyu kısalt
  const words = topic.trim().split(' ')
  const shortTopic = words.length > 5 ? words.slice(0, 5).join(' ') : topic
  
  if (language === 'tr') {
    const hooks = [
      {
        type: 'curiosity',
        emoji: '🤔',
        text: `${topic} hakkında kimsenin söylemediği ${num1} gerçek`,
        reason: 'Bilgi boşluğu yaratarak merak uyandırır'
      },
      {
        type: 'shocking',
        emoji: '😱',
        text: `${topic} konusunda ${days} gün önce öğrendiklerim beni şok etti`,
        reason: 'Yakın zamanlı keşif güncellik hissi verir'
      },
      {
        type: 'question',
        emoji: '❓',
        text: `${shortTopic} hakkında gerçekten ne kadar şey biliyorsunuz?`,
        reason: 'Kendini test etme içgüdüsünü tetikler'
      },
      {
        type: 'story',
        emoji: '📖',
        text: `${topic} konusunda başarısız oldum. Ta ki bunu keşfedene kadar...`,
        reason: 'Başarısızlıktan başarıya dönüşüm hikayesi ilham verir'
      },
      {
        type: 'curiosity',
        emoji: '🤔',
        text: `${topic} ile ilgili herkesin yaptığı ${num2} büyük hata`,
        reason: 'Hata yapmaktan kaçınma güdüsü güçlüdür'
      },
      {
        type: 'shocking',
        emoji: '😱',
        text: `%${percent} insanın ${shortTopic} hakkında yanıldığı ortaya çıktı`,
        reason: 'İstatistik ve sürpriz kombinasyonu etkilidir'
      },
      {
        type: 'question',
        emoji: '❓',
        text: `Ya ${topic} hakkında bildiğiniz her şey tamamen yanlışsa?`,
        reason: 'Mevcut inançları sorgulatarak düşündürür'
      },
      {
        type: 'statistic',
        emoji: '📊',
        text: `${topic} üzerine ${days} günlük deneyimin sonuçları`,
        reason: 'Deneysel kanıt güvenilirlik ve merak yaratır'
      },
    ]
    
    // Karıştır - her seferinde farklı sıralama
    return hooks.sort(() => Math.random() - 0.5)
  }
  
  // English hooks
  const hooks = [
    {
      type: 'curiosity',
      emoji: '🤔',
      text: `${num1} things nobody tells you about ${topic}`,
      reason: 'Creates powerful information gap'
    },
    {
      type: 'shocking',
      emoji: '😱',
      text: `What I learned about ${topic} ${days} days ago shocked me`,
      reason: 'Recent discovery creates urgency'
    },
    {
      type: 'question',
      emoji: '❓',
      text: `How much do you really know about ${shortTopic}?`,
      reason: 'Triggers self-testing instinct'
    },
    {
      type: 'story',
      emoji: '📖',
      text: `I failed at ${topic}. Until I discovered this...`,
      reason: 'Transformation story inspires hope'
    },
    {
      type: 'curiosity',
      emoji: '🤔',
      text: `${num2} biggest mistakes everyone makes with ${topic}`,
      reason: 'Fear of making mistakes drives engagement'
    },
    {
      type: 'shocking',
      emoji: '😱',
      text: `${percent}% of people are wrong about ${shortTopic}`,
      reason: 'Statistics combined with surprise is powerful'
    },
    {
      type: 'question',
      emoji: '❓',
      text: `What if everything you know about ${topic} is completely wrong?`,
      reason: 'Challenges core beliefs, makes you think'
    },
    {
      type: 'statistic',
      emoji: '📊',
      text: `My ${days}-day ${topic} experiment results`,
      reason: 'Experimental proof builds credibility'
    },
  ]
  
  return hooks.sort(() => Math.random() - 0.5)
}