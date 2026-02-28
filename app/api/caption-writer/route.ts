import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, includeEmojis, includeHashtags, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: language === 'tr' ? 'Konu gerekli' : 'Topic required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const captions = await generateCaptions(topic, platform, tone, includeEmojis, includeHashtags, language)

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) {
        await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2, updated_at: new Date().toISOString() }).eq('user_id', userId)
      }
    }

    return NextResponse.json({ captions })
  } catch (error) {
    console.error('Caption Writer Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function generateCaptions(topic: string, platform: string, tone: string, includeEmojis: boolean, includeHashtags: boolean, language: string) {
  const prompt = language === 'tr'
    ? `${platform} için "${topic}" hakkında ${tone} tonda 3 farklı caption yaz. ${includeEmojis ? 'Emoji kullan.' : 'Emoji kullanma.'} Her birini ayrı satırda ver. Sadece caption metinlerini yaz, açıklama ekleme.`
    : `Write 3 different captions for ${platform} about "${topic}" in ${tone} tone. ${includeEmojis ? 'Include emojis.' : 'No emojis.'} Put each on a new line. Only write the caption text, no explanations.`

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 400, temperature: 0.8, return_full_text: false }
      }),
    })

    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const lines = text.split('\n').filter((l: string) => l.trim().length > 15 && !l.startsWith('#') && !l.includes('Caption'))
      
      if (lines.length >= 2) {
        return lines.slice(0, 3).map((caption: string, index: number) => {
          let finalCaption = caption.replace(/^\d+[\.\):\-]\s*/, '').replace(/^["']|["']$/g, '').trim()
          if (includeHashtags) {
            const hashtags = generateHashtags(topic, language)
            finalCaption += '\n\n' + hashtags
          }
          return { id: index + 1, caption: finalCaption, platform, tone, characterCount: finalCaption.length }
        })
      }
    }
  } catch (e) { console.error('AI Error:', e) }

  return generateFallbackCaptions(topic, platform, tone, includeEmojis, includeHashtags, language)
}

function generateFallbackCaptions(topic: string, platform: string, tone: string, includeEmojis: boolean, includeHashtags: boolean, language: string) {
  const templates: Record<string, Record<string, string[]>> = {
    tr: {
      professional: [`${topic} hakkında bilmeniz gerekenler.`, `${topic} konusunda profesyonel çözümler.`, `${topic} ile başarıya ulaşın.`],
      casual: [`${topic} hakkında konuşalım mı? ${includeEmojis ? '😊' : ''}`, `Hey! ${topic} ile ilgili harika bir şey ${includeEmojis ? '✨' : ''}`, `${topic} sevenlere ${includeEmojis ? '🔥' : ''}`],
      humorous: [`${topic} benim hayatım ${includeEmojis ? '😂' : ''}`, `${topic} olmadan bir gün bile geçmiyor ${includeEmojis ? '😅' : ''}`, `POV: ${topic} keşfediyorsun ${includeEmojis ? '🤯' : ''}`],
      inspirational: [`${topic} ile hayallerine bir adım daha yaklaş ${includeEmojis ? '💫' : ''}`, `Başarı küçük adımlarla başlar. ${topic} yolculuğun bugün başlıyor ${includeEmojis ? '🚀' : ''}`, `${topic} ile potansiyelini keşfet ${includeEmojis ? '✨' : ''}`]
    },
    en: {
      professional: [`Everything you need to know about ${topic}.`, `Professional solutions for ${topic}.`, `Achieve success with ${topic}.`],
      casual: [`Let's talk about ${topic}? ${includeEmojis ? '😊' : ''}`, `Hey! Something amazing about ${topic} ${includeEmojis ? '✨' : ''}`, `For ${topic} lovers ${includeEmojis ? '🔥' : ''}`],
      humorous: [`${topic} is my whole life ${includeEmojis ? '😂' : ''}`, `Can't go a day without ${topic} ${includeEmojis ? '😅' : ''}`, `POV: You discover ${topic} ${includeEmojis ? '🤯' : ''}`],
      inspirational: [`Get closer to your dreams with ${topic} ${includeEmojis ? '💫' : ''}`, `Success starts with small steps. Your ${topic} journey begins today ${includeEmojis ? '🚀' : ''}`, `Discover your potential with ${topic} ${includeEmojis ? '✨' : ''}`]
    }
  }

  const lang = templates[language] || templates.en
  const toneTemplates = lang[tone] || lang.casual

  return toneTemplates.map((caption, index) => {
    let finalCaption = caption
    if (includeHashtags) finalCaption += '\n\n' + generateHashtags(topic, language)
    return { id: index + 1, caption: finalCaption, platform, tone, characterCount: finalCaption.length }
  })
}

function generateHashtags(topic: string, language: string) {
  const words = topic.toLowerCase().replace(/[^a-zğüşıöç0-9\s]/g, '').split(' ').filter(w => w.length > 2).slice(0, 2)
  const base = language === 'tr' ? ['içerik', 'keşfet', 'viral', 'trend'] : ['content', 'explore', 'viral', 'trending']
  return `#${words.join('')} #${base[0]} #${base[1]} #${base[2]}`
}
