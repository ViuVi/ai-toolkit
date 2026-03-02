import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, contentType, targetAudience, userId, language = 'en' } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: language === 'tr' ? 'Niş alanı gerekli' : 'Niche required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 3) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const platformNames: Record<string, string> = {
      instagram: 'Instagram',
      tiktok: 'TikTok',
      youtube: 'YouTube',
      twitter: 'Twitter/X',
      linkedin: 'LinkedIn'
    }

    const contentTypes: Record<string, Record<string, string>> = {
      educational: { tr: 'eğitici/bilgilendirici', en: 'educational/informative' },
      entertaining: { tr: 'eğlenceli/viral', en: 'entertaining/viral' },
      inspiring: { tr: 'ilham verici/motive edici', en: 'inspiring/motivational' },
      behindscenes: { tr: 'sahne arkası/kişisel', en: 'behind the scenes/personal' },
      mixed: { tr: 'karışık/dengeli', en: 'mixed/balanced' }
    }

    const platformName = platformNames[platform] || 'Instagram'
    const contentDesc = contentTypes[contentType]?.[language === 'tr' ? 'tr' : 'en'] || contentTypes.mixed[language === 'tr' ? 'tr' : 'en']
    const seed = Date.now()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] Sen içerik stratejisti ve viral içerik uzmanısın. "${niche}" nişi için ${platformName} platformunda 10 ÖZGÜN ve UYGULANABILIR içerik fikri üret.

NİŞ: ${niche}
PLATFORM: ${platformName}
İÇERİK TİPİ: ${contentDesc}
${targetAudience ? `HEDEF KİTLE: ${targetAudience}` : ''}

KURALLAR:
1. Her fikir TAMAMEN FARKLI ve ÖZGÜN olsun
2. Klişe fikirler verme (örn: "10 ipucu", "günlük rutin")
3. Viral potansiyeli yüksek fikirler öner
4. Her fikir için kısa açıklama yaz
5. Uygulanması kolay olsun
6. ${platformName} algoritmasına uygun olsun
7. Farklı kategorilerden fikirler ver: eğitici, eğlenceli, kişisel, trend

JSON formatında yanıt ver:
{
  "ideas": [
    {
      "id": 1,
      "title": "kısa ve çekici başlık",
      "description": "fikrin detaylı açıklaması (2-3 cümle)",
      "format": "Reels/Carousel/Video/Story/Post",
      "category": "Eğitici/Eğlenceli/Kişisel/Trend",
      "hook": "önerilen açılış hook'u"
    }
  ]
}

10 FARKLI fikir üret.`
      : `[SEED:${seed}] You are a content strategist and viral content expert. Generate 10 UNIQUE and ACTIONABLE content ideas for "${niche}" niche on ${platformName}.

NICHE: ${niche}
PLATFORM: ${platformName}
CONTENT TYPE: ${contentDesc}
${targetAudience ? `TARGET AUDIENCE: ${targetAudience}` : ''}

RULES:
1. Each idea must be COMPLETELY DIFFERENT and UNIQUE
2. Don't give cliché ideas (e.g., "10 tips", "daily routine")
3. Suggest ideas with high viral potential
4. Write a brief description for each idea
5. Make it easy to implement
6. Make it suitable for ${platformName} algorithm
7. Include ideas from different categories: educational, entertaining, personal, trend

Respond in JSON format:
{
  "ideas": [
    {
      "id": 1,
      "title": "short and catchy title",
      "description": "detailed description of the idea (2-3 sentences)",
      "format": "Reels/Carousel/Video/Story/Post",
      "category": "Educational/Entertaining/Personal/Trend",
      "hook": "suggested opening hook"
    }
  ]
}

Generate 10 DIFFERENT ideas.`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 2500, temperature: 0.95, top_p: 0.95, return_full_text: false } })
    })

    let ideas: { id: number; title: string; description: string; format: string; category: string; hook: string }[] = []
    
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          ideas = parsed.ideas || []
        } catch (e) { console.error('Parse error:', e) }
      }
    }

    // Fallback with niche-specific ideas
    if (ideas.length < 5) {
      const nicheWord = niche.split(' ')[0]
      ideas = language === 'tr' ? [
        { id: 1, title: `"${nicheWord} hakkında bilmediğiniz 1 şey"`, description: `Her gün farklı bir bilgi paylaşarak seri oluşturun. İzleyiciler merak edecek ve takip edecek.`, format: "Reels", category: "Eğitici", hook: "Bunu biliyor muydunuz?" },
        { id: 2, title: `${nicheWord} başarısızlık hikayem`, description: `Kendi başarısızlığınızı paylaşın ve ne öğrendiğinizi anlatın. Otantik içerik her zaman kazanır.`, format: "Carousel", category: "Kişisel", hook: "Bunu kimseye anlatmamıştım..." },
        { id: 3, title: `${nicheWord}'de trend vs gerçek`, description: `Popüler bir trendi gerçeklikle karşılaştırın. Tartışma yaratır ve etkileşim artar.`, format: "Reels", category: "Trend", hook: "Herkes bunu yapıyor ama..." },
        { id: 4, title: `1 dakikada ${nicheWord} dersi`, description: `Karmaşık bir konuyu 60 saniyede açıklayın. Hızlı değer = yüksek kaydetme oranı.`, format: "Reels", category: "Eğitici", hook: "60 saniyede öğreneceksiniz" },
        { id: 5, title: `${nicheWord} red flags`, description: `Kaçınılması gereken hataları paylaşın. İnsanlar uyarıları sever.`, format: "Carousel", category: "Eğitici", hook: "Bu 5 şeyi görürseniz kaçın" },
        { id: 6, title: `${nicheWord} glow up`, description: `Öncesi/sonrası dönüşüm hikayesi. Görsel kanıt güçlü etki yaratır.`, format: "Reels", category: "Kişisel", hook: "6 ay önce vs şimdi" },
        { id: 7, title: `POV: ${nicheWord} uzmanısın`, description: `Komik veya relatable bir POV videosu. Eğlenceli ve paylaşılabilir.`, format: "Reels", category: "Eğlenceli", hook: "POV: Bu senin de başına geldi" },
        { id: 8, title: `${nicheWord} unpopular opinion`, description: `Cesur ve farklı bir görüş paylaşın. Tartışma = etkileşim.`, format: "Carousel", category: "Trend", hook: "Beni linçleyeceksiniz ama..." },
        { id: 9, title: `${nicheWord} starter pack`, description: `Başlangıç için gerekenleri mizahi şekilde paylaşın.`, format: "Carousel", category: "Eğlenceli", hook: "Yeni başlayan starter pack" },
        { id: 10, title: `${nicheWord} Q&A hikayeleri`, description: `Takipçi sorularını story'de yanıtlayın. Etkileşimi artırır.`, format: "Story", category: "Kişisel", hook: "En çok sorulan sorular" }
      ] : [
        { id: 1, title: `"One thing you didn't know about ${nicheWord}"`, description: `Share a different fact every day to create a series. Viewers will be curious and follow.`, format: "Reels", category: "Educational", hook: "Did you know this?" },
        { id: 2, title: `My ${nicheWord} failure story`, description: `Share your own failure and what you learned. Authentic content always wins.`, format: "Carousel", category: "Personal", hook: "I never told anyone this..." },
        { id: 3, title: `${nicheWord} trend vs reality`, description: `Compare a popular trend with reality. Creates discussion and increases engagement.`, format: "Reels", category: "Trend", hook: "Everyone's doing this but..." },
        { id: 4, title: `${nicheWord} lesson in 1 minute`, description: `Explain a complex topic in 60 seconds. Quick value = high save rate.`, format: "Reels", category: "Educational", hook: "You'll learn this in 60 seconds" },
        { id: 5, title: `${nicheWord} red flags`, description: `Share mistakes to avoid. People love warnings.`, format: "Carousel", category: "Educational", hook: "Run if you see these 5 things" },
        { id: 6, title: `${nicheWord} glow up`, description: `Before/after transformation story. Visual proof creates strong impact.`, format: "Reels", category: "Personal", hook: "6 months ago vs now" },
        { id: 7, title: `POV: You're a ${nicheWord} expert`, description: `A funny or relatable POV video. Entertaining and shareable.`, format: "Reels", category: "Entertaining", hook: "POV: This happened to you too" },
        { id: 8, title: `${nicheWord} unpopular opinion`, description: `Share a bold and different opinion. Controversy = engagement.`, format: "Carousel", category: "Trend", hook: "You're gonna roast me but..." },
        { id: 9, title: `${nicheWord} starter pack`, description: `Share what's needed to start in a humorous way.`, format: "Carousel", category: "Entertaining", hook: "Beginner starter pack" },
        { id: 10, title: `${nicheWord} Q&A stories`, description: `Answer follower questions in stories. Boosts engagement.`, format: "Story", category: "Personal", hook: "Most asked questions" }
      ]
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 3, total_used: c.total_used + 3 }).eq('user_id', userId)
    }

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('Content Ideas Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
