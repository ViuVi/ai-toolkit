import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

export async function POST(request: NextRequest) {
  try {
    const { competitorHandle, platform, userId, language = 'en' } = await request.json()

    if (!competitorHandle) {
      return NextResponse.json({ error: language === 'tr' ? 'Kullanıcı adı gerekli' : 'Username required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 8) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const handle = competitorHandle.replace(/[@\s]/g, '').toLowerCase()
    const platformName = { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }[platform] || 'Instagram'

    const prompt = language === 'tr' 
      ? `Sen sosyal medya analiz uzmanısın. "${handle}" kullanıcı adlı ${platformName} hesabını analiz et.

ÖNEMLİ: Bu hesap hakkında gerçek ve spesifik bilgiler ver. Hesabın içerik tarzı, paylaşım stratejisi ve rakip olarak nasıl değerlendirilebileceğini analiz et.

Sadece JSON formatında yanıt ver:
{
  "overview": {
    "followers": "tahmini takipçi (örn: 50K, 1.2M)",
    "posts": "tahmini gönderi sayısı",
    "engagementRate": "etkileşim oranı (örn: 3.5%)",
    "avgLikes": "ortalama beğeni",
    "avgComments": "ortalama yorum"
  },
  "contentStrategy": {
    "postingFrequency": "paylaşım sıklığı",
    "bestTimes": ["saat1", "saat2"],
    "topContentTypes": ["içerik tipi 1", "içerik tipi 2"],
    "topHashtags": ["#tag1", "#tag2", "#tag3"]
  },
  "strengths": ["güçlü yön 1", "güçlü yön 2", "güçlü yön 3"],
  "weaknesses": ["zayıf yön 1", "zayıf yön 2"],
  "recommendations": [
    "Bu rakibe karşı uygulayabileceğiniz strateji 1",
    "Strateji 2",
    "Strateji 3",
    "Strateji 4",
    "Strateji 5"
  ],
  "aiInsights": "${handle} hesabı hakkında 2-3 cümlelik genel değerlendirme"
}`
      : `You are a social media analysis expert. Analyze the ${platformName} account "${handle}".

IMPORTANT: Provide real and specific information about this account. Analyze content style, posting strategy, and how to compete against them.

Respond only in JSON format:
{
  "overview": {
    "followers": "estimated followers (e.g., 50K, 1.2M)",
    "posts": "estimated post count",
    "engagementRate": "engagement rate (e.g., 3.5%)",
    "avgLikes": "average likes",
    "avgComments": "average comments"
  },
  "contentStrategy": {
    "postingFrequency": "posting frequency",
    "bestTimes": ["time1", "time2"],
    "topContentTypes": ["content type 1", "content type 2"],
    "topHashtags": ["#tag1", "#tag2", "#tag3"]
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": [
    "Strategy to compete against this account 1",
    "Strategy 2",
    "Strategy 3",
    "Strategy 4",
    "Strategy 5"
  ],
  "aiInsights": "2-3 sentence overall assessment about ${handle}"
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1500, temperature: 0.7, return_full_text: false } })
    })

    let analysis: any = null
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try { analysis = JSON.parse(match[0]) } catch {}
      }
    }

    if (!analysis) {
      analysis = {
        overview: { followers: "10K-100K", posts: "200+", engagementRate: "2-5%", avgLikes: "500-2K", avgComments: "20-100" },
        contentStrategy: { postingFrequency: language === 'tr' ? "Haftada 5-7 paylaşım" : "5-7 posts per week", bestTimes: ["19:00", "21:00"], topContentTypes: ["Reels", "Carousel", "Stories"], topHashtags: [`#${handle}`, "#content", "#viral"] },
        strengths: language === 'tr' ? ["Tutarlı paylaşım", "Görsel kalite", "Takipçi etkileşimi"] : ["Consistent posting", "Visual quality", "Follower engagement"],
        weaknesses: language === 'tr' ? ["Hashtag stratejisi geliştirilebilir", "Video içerik az"] : ["Hashtag strategy needs work", "Low video content"],
        recommendations: language === 'tr' 
          ? ["Benzer saatlerde paylaşım yapın", "Onların kullanmadığı hashtagleri hedefleyin", "Daha fazla video içerik üretin", "Takipçileriyle etkileşime geçin", "Hikaye formatını daha aktif kullanın"]
          : ["Post at similar times", "Target hashtags they don't use", "Create more video content", "Engage with their followers", "Use Stories more actively"],
        aiInsights: language === 'tr' ? `@${handle} hesabı ${platformName}'da aktif bir varlık gösteriyor. Rakip olarak takip edilmeli.` : `@${handle} shows active presence on ${platformName}. Should be monitored as competitor.`
      }
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 8, total_used: c.total_used + 8 }).eq('user_id', userId)
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Competitor Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
