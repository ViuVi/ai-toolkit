import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration, style, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: language === 'tr' ? 'Konu gerekli' : 'Topic required' }, { status: 400 })
    }

    // Kredi kontrolü
    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 4) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const script = await generateScript(topic, platform, duration, style, language)

    // Kredi düş
    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) {
        await supabase.from('credits').update({ 
          balance: c.balance - 4, 
          total_used: c.total_used + 4, 
          updated_at: new Date().toISOString() 
        }).eq('user_id', userId)
      }
    }

    return NextResponse.json({ script })
  } catch (error) {
    console.error('Video Script Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function generateScript(topic: string, platform: string, duration: string, style: string, language: string) {
  const secs = parseInt(duration) || 30
  
  const prompt = language === 'tr'
    ? `${platform} için ${secs} saniyelik "${topic}" konulu viral video scripti yaz. Hook, ana içerik ve CTA bölümleri olsun. Kısa, net ve etkileyici yaz.`
    : `Write a ${secs}-second viral video script for ${platform} about "${topic}". Include hook, main content, and CTA sections. Keep it short, clear, and impactful.`

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 500, temperature: 0.7, return_full_text: false }
      }),
    })

    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      if (text.length > 50) {
        return formatScript(text, topic, platform, secs, language)
      }
    }
  } catch (e) { 
    console.error('AI Error:', e) 
  }

  return generateFallbackScript(topic, platform, secs, style, language)
}

function formatScript(text: string, topic: string, platform: string, secs: number, language: string) {
  const cleanText = text.replace(/```[\s\S]*?```/g, '').replace(/\*\*/g, '').replace(/^\s*[-•]\s*/gm, '').trim()
  const lines = cleanText.split('\n').filter(l => l.trim().length > 10)
  
  const hookTime = '0:00-0:03'
  const mainTime = secs === 15 ? '0:03-0:12' : secs === 30 ? '0:03-0:25' : '0:03-0:50'
  const ctaTime = secs === 15 ? '0:12-0:15' : secs === 30 ? '0:25-0:30' : '0:50-1:00'

  let hookContent = ''
  let mainContent = ''
  let ctaContent = ''

  if (lines.length >= 3) {
    hookContent = lines[0].replace(/^(hook|giriş|açılış)[:\s]*/i, '').trim()
    mainContent = lines.slice(1, -1).join(' ').replace(/^(ana içerik|main|content)[:\s]*/i, '').trim()
    ctaContent = lines[lines.length - 1].replace(/^(cta|kapanış|call)[:\s]*/i, '').trim()
  } else if (lines.length > 0) {
    const allText = lines.join(' ')
    const words = allText.split(' ')
    const third = Math.floor(words.length / 3)
    hookContent = words.slice(0, third).join(' ')
    mainContent = words.slice(third, third * 2).join(' ')
    ctaContent = words.slice(third * 2).join(' ')
  }

  return {
    topic,
    platform,
    duration: `${secs}s`,
    sections: [
      { timestamp: hookTime, title: language === 'tr' ? '🎯 Hook' : '🎯 Hook', content: hookContent || topic },
      { timestamp: mainTime, title: language === 'tr' ? '📝 Ana İçerik' : '📝 Main Content', content: mainContent || `${topic} hakkında bilmeniz gerekenler...` },
      { timestamp: ctaTime, title: language === 'tr' ? '🚀 CTA' : '🚀 CTA', content: ctaContent || (language === 'tr' ? 'Takip et!' : 'Follow for more!') }
    ],
    totalWords: cleanText.split(' ').length,
    readingTime: `~${secs}s`
  }
}

function generateFallbackScript(topic: string, platform: string, secs: number, style: string, language: string) {
  const hookTime = '0:00-0:03'
  const mainTime = secs === 15 ? '0:03-0:12' : secs === 30 ? '0:03-0:25' : '0:03-0:50'
  const ctaTime = secs === 15 ? '0:12-0:15' : secs === 30 ? '0:25-0:30' : '0:50-1:00'

  const hooks: Record<string, Record<string, string[]>> = {
    question: {
      tr: [`${topic} hakkında hiç düşündün mü?`, `Neden herkes ${topic} konusunda yanılıyor?`],
      en: [`Have you ever thought about ${topic}?`, `Why is everyone wrong about ${topic}?`]
    },
    shocking: {
      tr: [`${topic} hakkında kimsenin bilmediği gerçek...`, `Bu ${topic} bilgisi her şeyi değiştirecek!`],
      en: [`The truth about ${topic} nobody knows...`, `This ${topic} info will change everything!`]
    },
    story: {
      tr: [`${topic} hikayem böyle başladı...`, `${topic} ile tanışmam...`],
      en: [`My ${topic} story began like this...`, `How I discovered ${topic}...`]
    }
  }

  const mains: Record<string, string[]> = {
    tr: [`${topic} konusunda en önemli nokta şu: Doğru strateji ile başarı kaçınılmaz. Adım adım ilerleyerek, tutarlı bir şekilde çalışarak sonuç alabilirsin.`],
    en: [`The key point about ${topic} is this: With the right strategy, success is inevitable. By progressing step by step and working consistently, you can achieve results.`]
  }

  const ctas: Record<string, string[]> = {
    tr: ['Beğen + Kaydet + Takip Et! 🔥', 'Yorumlarda düşünceni yaz! 👇'],
    en: ['Like + Save + Follow! 🔥', 'Comment your thoughts below! 👇']
  }

  const hookList = hooks[style]?.[language] || hooks.question[language] || hooks.question.en
  const mainList = mains[language] || mains.en
  const ctaList = ctas[language] || ctas.en

  return {
    topic,
    platform,
    duration: `${secs}s`,
    sections: [
      { timestamp: hookTime, title: language === 'tr' ? '🎯 Hook' : '🎯 Hook', content: hookList[Math.floor(Math.random() * hookList.length)] },
      { timestamp: mainTime, title: language === 'tr' ? '📝 Ana İçerik' : '📝 Main Content', content: mainList[0] },
      { timestamp: ctaTime, title: language === 'tr' ? '🚀 CTA' : '🚀 CTA', content: ctaList[Math.floor(Math.random() * ctaList.length)] }
    ],
    totalWords: 60,
    readingTime: `~${secs}s`
  }
}
