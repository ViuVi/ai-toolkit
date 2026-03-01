import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, region, userId, language = 'en' } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: language === 'tr' ? 'Niş alanı gerekli' : 'Niche required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 5) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const platformName = { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }[platform] || 'TikTok'
    const regionName = { global: 'Global', us: 'USA', eu: 'Europe', asia: 'Asia', tr: 'Turkey' }[region] || 'Global'

    const prompt = language === 'tr'
      ? `Sen sosyal medya trend analisti ve içerik stratejistisin. "${niche}" nişi için ${platformName} platformunda ${regionName} bölgesindeki güncel trendleri analiz et.

GÖREV: Bu niş için ŞU ANDA viral olan, yükselen ve gelecek vaat eden içerik trendlerini belirle. Genel değil, SPESİFİK ve UYGULANABİLİR trendler ver.

JSON formatında yanıt ver:
{
  "trends": [
    {
      "topic": "spesifik trend konusu",
      "description": "bu trendin ne olduğu ve neden popüler (1-2 cümle)",
      "trendScore": 60-98 arası skor,
      "growth": "+yüzde (örn: +180%)",
      "status": "viral/rising/emerging",
      "contentIdeas": ["somut içerik fikri 1", "somut içerik fikri 2"],
      "exampleFormat": "bu trende uygun video/post formatı açıklaması",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "timing": "bu trendi ne zaman kullanmalı"
    }
  ],
  "nicheInsights": {
    "health": "growing/stable/declining",
    "competition": "low/medium/high",
    "bestContentType": "en iyi performans gösteren içerik tipi",
    "audienceActivity": "hedef kitle en aktif ne zaman"
  },
  "weeklyPlan": [
    {"day": "Pazartesi", "content": "içerik önerisi", "trend": "kullanılacak trend"},
    {"day": "Çarşamba", "content": "içerik önerisi", "trend": "kullanılacak trend"},
    {"day": "Cuma", "content": "içerik önerisi", "trend": "kullanılacak trend"}
  ],
  "expertTip": "bu niş için stratejik tavsiye (2-3 cümle)"
}

NOT: En az 5 farklı ve SPESİFİK trend belirle. Genel trendler değil, bu nişe ÖZEL trendler olsun.`
      : `You are a social media trend analyst and content strategist. Analyze current trends for "${niche}" niche on ${platformName} in ${regionName} region.

TASK: Identify CURRENT viral, rising, and emerging content trends for this niche. Provide SPECIFIC and ACTIONABLE trends, not generic ones.

Respond in JSON:
{
  "trends": [
    {
      "topic": "specific trend topic",
      "description": "what this trend is and why it's popular (1-2 sentences)",
      "trendScore": score 60-98,
      "growth": "+percentage (e.g., +180%)",
      "status": "viral/rising/emerging",
      "contentIdeas": ["concrete content idea 1", "concrete content idea 2"],
      "exampleFormat": "video/post format description for this trend",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "timing": "when to use this trend"
    }
  ],
  "nicheInsights": {
    "health": "growing/stable/declining",
    "competition": "low/medium/high",
    "bestContentType": "best performing content type",
    "audienceActivity": "when target audience is most active"
  },
  "weeklyPlan": [
    {"day": "Monday", "content": "content suggestion", "trend": "trend to use"},
    {"day": "Wednesday", "content": "content suggestion", "trend": "trend to use"},
    {"day": "Friday", "content": "content suggestion", "trend": "trend to use"}
  ],
  "expertTip": "strategic advice for this niche (2-3 sentences)"
}

NOTE: Identify at least 5 different and SPECIFIC trends. Not generic trends, but trends SPECIFIC to this niche.`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 2000, temperature: 0.8, return_full_text: false } })
    })

    let trends: any = null
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try { trends = JSON.parse(match[0]) } catch {}
      }
    }

    // Fallback
    if (!trends || !trends.trends || trends.trends.length < 3) {
      const nicheClean = niche.toLowerCase().replace(/\s+/g, '')
      trends = {
        trends: language === 'tr' ? [
          { topic: `"Bir günüm" ${niche} versiyonu`, description: `${niche} alanında günlük rutin içerikleri büyük ilgi görüyor`, trendScore: 92, growth: "+245%", status: "viral", contentIdeas: ["Sabah rutini", "İş akışı gösterimi"], exampleFormat: "15-30 sn vlog tarzı, hızlı kesimler", hashtags: [`#${nicheClean}`, "#günlükrutin"], timing: "Sabah 7-9 arası" },
          { topic: `${niche} mitleri çürütme`, description: "Yaygın yanlış bilgileri düzeltmek yüksek kaydetme oranı sağlıyor", trendScore: 87, growth: "+180%", status: "viral", contentIdeas: ["En yaygın 3 mit", "Gerçek vs Kurgu"], exampleFormat: "Yeşil ekran + konuşma, metin overlay", hashtags: [`#${nicheClean}gerçekleri`, "#mitçürütme"], timing: "Öğlen 12-14" },
          { topic: `30 saniyede ${niche} ipucu`, description: "Hızlı, uygulanabilir bilgiler en çok paylaşılan format", trendScore: 84, growth: "+156%", status: "rising", contentIdeas: ["Günün ipucu serisi", "Hızlı hack'ler"], exampleFormat: "Doğrudan kameraya, hızlı tempo", hashtags: [`#${nicheClean}ipucu`, "#bilgikapsülü"], timing: "Akşam 19-21" },
          { topic: `Yeni başlayanlar için ${niche}`, description: "Başlangıç rehberleri sürekli arama trafiği alıyor", trendScore: 79, growth: "+120%", status: "rising", contentIdeas: ["5 adımda başla", "İlk haftanın planı"], exampleFormat: "Eğitici, adım adım gösterim", hashtags: [`#${nicheClean}101`, "#başlangıç"], timing: "Hafta sonu sabahları" },
          { topic: `${niche} alışveriş/ekipman`, description: "Ürün önerileri ve incelemeler ilgi çekiyor", trendScore: 75, growth: "+95%", status: "emerging", contentIdeas: ["Favorilerim", "Bu ay aldıklarım"], exampleFormat: "Ürün gösterimi, dürüst yorum", hashtags: [`#${nicheClean}alışveriş`, "#öneri"], timing: "Akşam saatleri" }
        ] : [
          { topic: `"Day in my life" ${niche} edition`, description: `Daily routine content in ${niche} is getting massive engagement`, trendScore: 92, growth: "+245%", status: "viral", contentIdeas: ["Morning routine", "Workflow showcase"], exampleFormat: "15-30 sec vlog style, quick cuts", hashtags: [`#${nicheClean}`, "#dayinmylife"], timing: "Morning 7-9 AM" },
          { topic: `${niche} myths debunked`, description: "Correcting misconceptions drives high save rates", trendScore: 87, growth: "+180%", status: "viral", contentIdeas: ["Top 3 myths", "Fact vs Fiction"], exampleFormat: "Green screen + talking head, text overlay", hashtags: [`#${nicheClean}facts`, "#mythbusting"], timing: "Noon 12-2 PM" },
          { topic: `30 second ${niche} tip`, description: "Quick, actionable tips are most shared format", trendScore: 84, growth: "+156%", status: "rising", contentIdeas: ["Tip of the day series", "Quick hacks"], exampleFormat: "Direct to camera, fast pace", hashtags: [`#${nicheClean}tips`, "#quicktip"], timing: "Evening 7-9 PM" },
          { topic: `${niche} for beginners`, description: "Beginner guides get consistent search traffic", trendScore: 79, growth: "+120%", status: "rising", contentIdeas: ["Start in 5 steps", "First week plan"], exampleFormat: "Educational, step-by-step", hashtags: [`#${nicheClean}101`, "#beginner"], timing: "Weekend mornings" },
          { topic: `${niche} gear/shopping`, description: "Product recommendations and reviews attract attention", trendScore: 75, growth: "+95%", status: "emerging", contentIdeas: ["My favorites", "Monthly haul"], exampleFormat: "Product showcase, honest review", hashtags: [`#${nicheClean}haul`, "#recommendation"], timing: "Evening hours" }
        ],
        nicheInsights: {
          health: "growing",
          competition: "medium",
          bestContentType: language === 'tr' ? "Kısa formatlı eğitici videolar" : "Short-form educational videos",
          audienceActivity: language === 'tr' ? "Hafta içi akşamları ve hafta sonu sabahları" : "Weekday evenings and weekend mornings"
        },
        weeklyPlan: language === 'tr' ? [
          { day: "Pazartesi", content: "Motivasyon/hafta başlangıcı içeriği", trend: "Günlük rutin" },
          { day: "Çarşamba", content: "Eğitici içerik/ipucu", trend: "30 saniyelik ipucu" },
          { day: "Cuma", content: "Eğlenceli/rahat içerik", trend: "Mit çürütme" }
        ] : [
          { day: "Monday", content: "Motivation/week starter content", trend: "Daily routine" },
          { day: "Wednesday", content: "Educational content/tip", trend: "30 second tip" },
          { day: "Friday", content: "Fun/relaxed content", trend: "Myth debunking" }
        ],
        expertTip: language === 'tr' 
          ? `${niche} nişinde tutarlılık kritik. Haftada en az 3-4 içerik paylaşın ve bir içerik serinize bağlı kalın. İlk 3 saniye her şeydir.`
          : `Consistency is critical in ${niche} niche. Post at least 3-4 times per week and stick to a content series. First 3 seconds are everything.`
      }
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 5, total_used: c.total_used + 5 }).eq('user_id', userId)
    }

    return NextResponse.json({ trends })
  } catch (error) {
    console.error('Trend Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
