import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

const styleGuide: Record<string, Record<string, string>> = {
  educational: { tr: 'eğitici, bilgi dolu, adım adım öğretici', en: 'educational, informative, step-by-step teaching' },
  storytelling: { tr: 'hikaye anlatımı, kişisel deneyim, duygusal bağ', en: 'storytelling, personal experience, emotional connection' },
  listicle: { tr: 'liste formatı, maddeler halinde, kolay okunur', en: 'list format, bullet points, easy to read' },
  controversial: { tr: 'tartışmalı, düşündürücü, farklı bakış açısı', en: 'controversial, thought-provoking, different perspective' }
}

export async function POST(request: NextRequest) {
  try {
    const { topic, threadLength, style, platform, userId, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: language === 'tr' ? 'Konu gerekli' : 'Topic required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 4) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const length = threadLength || 7
    const styleDesc = styleGuide[style]?.[language === 'tr' ? 'tr' : 'en'] || styleGuide.educational.en
    const charLimit = platform === 'twitter' ? 280 : 500
    const seed = Date.now()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] "${topic}" konusu için ${length} tweet'lik viral bir thread yaz.

STİL: ${styleDesc}
KARAKTER LİMİTİ: Her tweet ${charLimit} karakter

KURALLAR:
1. İlk tweet (HOOK): Çok güçlü, merak uyandırıcı, thread'i okumaya teşvik eden
2. Orta tweetler: Her biri değer katan, birbirini takip eden
3. Son tweet (CTA): Retweet, kaydet, takip et çağrısı
4. Her tweet bağımsız okunabilmeli ama seri olarak daha anlamlı
5. Numaralı ol: "1/", "2/", şeklinde
6. Emoji kullan ama abartma
7. Klişelerden kaçın, özgün ol

JSON formatında yanıt ver:
{
  "thread": [
    {"number": "1/${length}", "content": "hook tweet", "type": "hook"},
    {"number": "2/${length}", "content": "içerik tweet 2", "type": "content"},
    {"number": "3/${length}", "content": "içerik tweet 3", "type": "content"},
    ...
    {"number": "${length}/${length}", "content": "CTA tweet", "type": "cta"}
  ],
  "title": "thread başlığı",
  "estimatedEngagement": "tahmini etkileşim seviyesi"
}`
      : `[SEED:${seed}] Write a viral ${length}-tweet thread about "${topic}".

STYLE: ${styleDesc}
CHARACTER LIMIT: Each tweet ${charLimit} characters

RULES:
1. First tweet (HOOK): Very strong, curiosity-inducing, encourages reading the thread
2. Middle tweets: Each adds value, follows logically
3. Last tweet (CTA): Retweet, save, follow call to action
4. Each tweet should be readable alone but more meaningful as a series
5. Numbered: "1/", "2/", format
6. Use emojis but don't overdo
7. Avoid clichés, be original

Respond in JSON format:
{
  "thread": [
    {"number": "1/${length}", "content": "hook tweet", "type": "hook"},
    {"number": "2/${length}", "content": "content tweet 2", "type": "content"},
    {"number": "3/${length}", "content": "content tweet 3", "type": "content"},
    ...
    {"number": "${length}/${length}", "content": "CTA tweet", "type": "cta"}
  ],
  "title": "thread title",
  "estimatedEngagement": "estimated engagement level"
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 2500, temperature: 0.9, top_p: 0.95, return_full_text: false } })
    })

    let threadData: any = null
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try { threadData = JSON.parse(match[0]) } catch (e) { console.error('Parse error:', e) }
      }
    }

    if (!threadData || !threadData.thread || threadData.thread.length < 3) {
      threadData = {
        thread: language === 'tr' ? [
          { number: `1/${length}`, content: `🧵 ${topic} hakkında bilmeniz gereken her şey.\n\nBu thread'i kaydedin, ileride teşekkür edeceksiniz. ↓`, type: 'hook' },
          { number: `2/${length}`, content: `Öncelikle, ${topic} neden bu kadar önemli?\n\nÇünkü çoğu kişi bunu görmezden geliyor ve büyük fırsatları kaçırıyor.`, type: 'content' },
          { number: `3/${length}`, content: `İşte ${topic} hakkında bilmeniz gereken ilk şey:\n\nTemel prensipleri anlamadan ilerlemeye çalışmak, temelsiz bina inşa etmek gibi.`, type: 'content' },
          { number: `4/${length}`, content: `İkinci önemli nokta:\n\nTutarlılık her şeyden önemli. Bir gün yapıp bırakmak yerine, küçük adımlarla ilerlemeye devam edin.`, type: 'content' },
          { number: `5/${length}`, content: `Üçüncü nokta:\n\nBaşkalarından öğrenin. Her başarılı kişi, onlarca başarısız denemeden sonra bugünlere geldi.`, type: 'content' },
          { number: `6/${length}`, content: `Son olarak:\n\n${topic} bir yolculuk, varış noktası değil. Sürecin tadını çıkarın.`, type: 'content' },
          { number: `7/${length}`, content: `📌 Bu thread'i kaydedin ve ihtiyacınız olduğunda tekrar okuyun.\n\n🔄 RT ile başkalarına da fayda sağlayın.\n\n➡️ Daha fazla içerik için takip edin!`, type: 'cta' }
        ] : [
          { number: `1/${length}`, content: `🧵 Everything you need to know about ${topic}.\n\nSave this thread, you'll thank me later. ↓`, type: 'hook' },
          { number: `2/${length}`, content: `First, why is ${topic} so important?\n\nBecause most people ignore it and miss huge opportunities.`, type: 'content' },
          { number: `3/${length}`, content: `Here's the first thing to know about ${topic}:\n\nTrying to progress without understanding the basics is like building a house without foundation.`, type: 'content' },
          { number: `4/${length}`, content: `Second important point:\n\nConsistency beats everything. Instead of one day effort, keep making small progress.`, type: 'content' },
          { number: `5/${length}`, content: `Third point:\n\nLearn from others. Every successful person reached here after dozens of failed attempts.`, type: 'content' },
          { number: `6/${length}`, content: `Finally:\n\n${topic} is a journey, not a destination. Enjoy the process.`, type: 'content' },
          { number: `7/${length}`, content: `📌 Save this thread and re-read when you need it.\n\n🔄 RT to help others.\n\n➡️ Follow for more content!`, type: 'cta' }
        ],
        title: language === 'tr' ? `${topic} Rehberi` : `${topic} Guide`,
        estimatedEngagement: 'High'
      }
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 4, total_used: c.total_used + 4 }).eq('user_id', userId)
    }

    return NextResponse.json({ ...threadData, topic, style, platform })
  } catch (error) {
    console.error('Thread Writer Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
