import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

export async function POST(request: NextRequest) {
  try {
    const { topic, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: language === 'tr' ? 'Konu gerekli' : 'Topic required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const seed = Date.now()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] Sen viral içerik uzmanısın. "${topic}" konusu için 8 FARKLI ve ÖZGÜN hook (açılış cümlesi) yaz.

Her hook farklı bir psikolojik tetikleyici kullanmalı:
1. Merak (bilgi boşluğu)
2. Şok (sürpriz unsur)
3. Soru (kendini test)
4. Hikaye (dönüşüm)
5. Korku (kaçırma korkusu)
6. Tartışma (unpopular opinion)
7. Sayı (istatistik/liste)
8. Kişisel (deneyim)

JSON formatında yanıt ver:
{
  "hooks": [
    {"type": "curiosity", "emoji": "🤔", "text": "hook metni", "reason": "neden etkili"},
    {"type": "shocking", "emoji": "😱", "text": "hook metni", "reason": "neden etkili"},
    {"type": "question", "emoji": "❓", "text": "hook metni", "reason": "neden etkili"},
    {"type": "story", "emoji": "📖", "text": "hook metni", "reason": "neden etkili"},
    {"type": "fomo", "emoji": "⚡", "text": "hook metni", "reason": "neden etkili"},
    {"type": "controversy", "emoji": "🔥", "text": "hook metni", "reason": "neden etkili"},
    {"type": "statistic", "emoji": "📊", "text": "hook metni", "reason": "neden etkili"},
    {"type": "personal", "emoji": "💭", "text": "hook metni", "reason": "neden etkili"}
  ]
}

Klişelerden kaçın, HER HOOK TAMAMEN FARKLI ve ÖZGÜN olsun.`
      : `[SEED:${seed}] You are a viral content expert. Write 8 DIFFERENT and UNIQUE hooks for "${topic}".

Each hook should use a different psychological trigger:
1. Curiosity (information gap)
2. Shock (surprise element)
3. Question (self-test)
4. Story (transformation)
5. FOMO (fear of missing out)
6. Controversy (unpopular opinion)
7. Statistic (numbers/lists)
8. Personal (experience)

Respond in JSON format:
{
  "hooks": [
    {"type": "curiosity", "emoji": "🤔", "text": "hook text", "reason": "why it works"},
    {"type": "shocking", "emoji": "😱", "text": "hook text", "reason": "why it works"},
    {"type": "question", "emoji": "❓", "text": "hook text", "reason": "why it works"},
    {"type": "story", "emoji": "📖", "text": "hook text", "reason": "why it works"},
    {"type": "fomo", "emoji": "⚡", "text": "hook text", "reason": "why it works"},
    {"type": "controversy", "emoji": "🔥", "text": "hook text", "reason": "why it works"},
    {"type": "statistic", "emoji": "📊", "text": "hook text", "reason": "why it works"},
    {"type": "personal", "emoji": "💭", "text": "hook text", "reason": "why it works"}
  ]
}

Avoid clichés, EVERY HOOK must be COMPLETELY DIFFERENT and UNIQUE.`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1500, temperature: 0.9, top_p: 0.95, return_full_text: false } })
    })

    let hooks: any[] = []
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          hooks = parsed.hooks || []
        } catch (e) { console.error('Parse error:', e) }
      }
    }

    if (hooks.length < 4) {
      const num = Math.floor(Math.random() * 5) + 3
      const days = Math.floor(Math.random() * 20) + 5
      const percent = Math.floor(Math.random() * 30) + 60
      
      hooks = language === 'tr' ? [
        { type: 'curiosity', emoji: '🤔', text: `${topic} hakkında kimsenin söylemediği ${num} gerçek`, reason: 'Bilgi boşluğu yaratır' },
        { type: 'shocking', emoji: '😱', text: `${topic} ile ilgili ${days} gün önce öğrendiğim şey beni şok etti`, reason: 'Sürpriz dikkat çeker' },
        { type: 'question', emoji: '❓', text: `${topic} konusunda gerçekten ne kadar biliyorsunuz?`, reason: 'Kendini test ettirme' },
        { type: 'story', emoji: '📖', text: `${topic} sayesinde her şey değişti. İşte hikayem...`, reason: 'Dönüşüm hikayesi ilham verir' },
        { type: 'fomo', emoji: '⚡', text: `${topic} hakkında bunu kaçırırsanız çok pişman olursunuz`, reason: 'Kaçırma korkusu harekete geçirir' },
        { type: 'controversy', emoji: '🔥', text: `Unpopular opinion: ${topic} hakkında herkes yanılıyor`, reason: 'Tartışma etkileşim artırır' },
        { type: 'statistic', emoji: '📊', text: `%${percent} insanın ${topic} hakkında bilmediği istatistik`, reason: 'Sayılar güvenilirlik katar' },
        { type: 'personal', emoji: '💭', text: `${topic} ile ${days} günlük deneyimim: Sonuçlar şaşırtıcı`, reason: 'Kişisel deneyim bağ kurar' }
      ] : [
        { type: 'curiosity', emoji: '🤔', text: `${num} truths about ${topic} nobody tells you`, reason: 'Creates information gap' },
        { type: 'shocking', emoji: '😱', text: `What I learned about ${topic} ${days} days ago shocked me`, reason: 'Surprise grabs attention' },
        { type: 'question', emoji: '❓', text: `How much do you really know about ${topic}?`, reason: 'Self-testing instinct' },
        { type: 'story', emoji: '📖', text: `${topic} changed everything for me. Here's my story...`, reason: 'Transformation inspires' },
        { type: 'fomo', emoji: '⚡', text: `You'll regret missing this about ${topic}`, reason: 'FOMO drives action' },
        { type: 'controversy', emoji: '🔥', text: `Unpopular opinion: Everyone's wrong about ${topic}`, reason: 'Controversy boosts engagement' },
        { type: 'statistic', emoji: '📊', text: `${percent}% of people don't know this about ${topic}`, reason: 'Numbers add credibility' },
        { type: 'personal', emoji: '💭', text: `My ${days}-day ${topic} experiment: Results were surprising`, reason: 'Personal experience connects' }
      ]
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2 }).eq('user_id', userId)
    }

    return NextResponse.json({ hooks })
  } catch (error) {
    console.error('Hook Generator Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
