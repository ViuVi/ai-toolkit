import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

export async function POST(request: NextRequest) {
  try {
    const { comment, tone, platform, context, userId, language = 'en' } = await request.json()

    if (!comment) {
      return NextResponse.json({ error: language === 'tr' ? 'Yorum gerekli' : 'Comment required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const toneGuide: Record<string, Record<string, string>> = {
      friendly: { tr: 'samimi, sıcak ve arkadaşça', en: 'friendly, warm and approachable' },
      professional: { tr: 'profesyonel ve saygılı', en: 'professional and respectful' },
      funny: { tr: 'eğlenceli, espritüel ve neşeli', en: 'funny, witty and cheerful' },
      grateful: { tr: 'minnettarlık dolu ve içten', en: 'grateful and heartfelt' }
    }

    const toneDesc = toneGuide[tone]?.[language === 'tr' ? 'tr' : 'en'] || toneGuide.friendly[language === 'tr' ? 'tr' : 'en']
    const seed = Date.now()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] Sen sosyal medya uzmanısın. Aşağıdaki yoruma 3 FARKLI ve ÖZGÜN yanıt yaz.

GELEN YORUM: "${comment}"
${context ? `EK BAĞLAM: ${context}` : ''}
PLATFORM: ${platform || 'Instagram'}
TON: ${toneDesc}

KURALLAR:
1. Her yanıt TAMAMEN FARKLI olsun
2. Kısa ve öz ol (1-3 cümle)
3. Samimi ve doğal ol, robot gibi yazma
4. Yorumu yapan kişiyi değerli hissetir
5. Gerekirse emoji kullan ama abartma
6. İlk yanıt: Direkt ve samimi
7. İkinci yanıt: Soru sorarak etkileşim kur
8. Üçüncü yanıt: Değer katarak yanıtla

JSON formatında yanıt ver:
{
  "replies": [
    {"id": 1, "reply": "birinci yanıt", "style": "Direkt & Samimi"},
    {"id": 2, "reply": "ikinci yanıt", "style": "Soru ile Etkileşim"},
    {"id": 3, "reply": "üçüncü yanıt", "style": "Değer Katıcı"}
  ]
}`
      : `[SEED:${seed}] You are a social media expert. Write 3 DIFFERENT and UNIQUE replies to this comment.

INCOMING COMMENT: "${comment}"
${context ? `ADDITIONAL CONTEXT: ${context}` : ''}
PLATFORM: ${platform || 'Instagram'}
TONE: ${toneDesc}

RULES:
1. Each reply must be COMPLETELY DIFFERENT
2. Keep it short and concise (1-3 sentences)
3. Be authentic and natural, don't sound robotic
4. Make the commenter feel valued
5. Use emojis if appropriate but don't overdo it
6. First reply: Direct and friendly
7. Second reply: Engage with a question
8. Third reply: Add value in your response

Respond in JSON format:
{
  "replies": [
    {"id": 1, "reply": "first reply", "style": "Direct & Friendly"},
    {"id": 2, "reply": "second reply", "style": "Question Engagement"},
    {"id": 3, "reply": "third reply", "style": "Value Adding"}
  ]
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 800, temperature: 0.9, top_p: 0.95, return_full_text: false } })
    })

    let replies: { id: number; reply: string; style: string }[] = []
    
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          replies = parsed.replies || []
        } catch (e) { console.error('Parse error:', e) }
      }
    }

    // Fallback
    if (replies.length === 0) {
      replies = language === 'tr' ? [
        { id: 1, reply: "Çok teşekkür ederim! Bu yorum gerçekten günümü güzelleştirdi 🙏", style: "Direkt & Samimi" },
        { id: 2, reply: "Harika bir bakış açısı! Sen bu konuda ne düşünüyorsun, deneyimlerini de duymak isterim 💭", style: "Soru ile Etkileşim" },
        { id: 3, reply: "Bu konuyu yakında daha detaylı ele alacağım, takipte kal! ✨", style: "Değer Katıcı" }
      ] : [
        { id: 1, reply: "Thank you so much! This comment truly made my day 🙏", style: "Direct & Friendly" },
        { id: 2, reply: "Great perspective! What's your experience with this? Would love to hear more 💭", style: "Question Engagement" },
        { id: 3, reply: "I'll cover this topic in more detail soon, stay tuned! ✨", style: "Value Adding" }
      ]
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2 }).eq('user_id', userId)
    }

    return NextResponse.json({ replies })
  } catch (error) {
    console.error('Comment Reply Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
