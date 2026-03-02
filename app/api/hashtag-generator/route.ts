import { NextRequest, NextResponse } from 'next/server'

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

const platformGuide: Record<string, string> = {
  instagram: 'Instagram (30 hashtag limit, mix of popular and niche)',
  tiktok: 'TikTok (trending, viral, challenge hashtags)',
  twitter: 'Twitter/X (2-3 relevant hashtags max)',
  youtube: 'YouTube (SEO focused, searchable tags)',
  linkedin: 'LinkedIn (professional, industry-specific)'
}

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, count = 20, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: language === 'tr' ? 'Konu gerekli' : 'Topic required' }, { status: 400 })
    }

    const platformDesc = platformGuide[platform] || platformGuide.instagram
    const seed = Date.now()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] "${topic}" konusu için ${platformDesc} hashtagleri oluştur.

4 KATEGORİDE hashtag üret:
1. ANA (5 adet): Konuyla doğrudan ilgili, yüksek hacimli
2. TREND (5 adet): Şu an popüler, viral potansiyelli
3. NİŞ (5 adet): Spesifik, hedefli, düşük rekabet
4. İLGİLİ (5 adet): Konuyla bağlantılı, keşfedilebilir

KURALLAR:
- Tüm hashtagler # ile başlasın
- Türkçe ve İngilizce karışık olabilir
- Gerçekçi ve kullanılabilir hashtagler
- Platform için uygun uzunluk ve stil

JSON formatında yanıt ver:
{
  "main": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "trending": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "niche": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "related": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
}`
      : `[SEED:${seed}] Generate hashtags for "${topic}" for ${platformDesc}.

Create hashtags in 4 CATEGORIES:
1. MAIN (5): Directly related to topic, high volume
2. TRENDING (5): Currently popular, viral potential
3. NICHE (5): Specific, targeted, low competition
4. RELATED (5): Connected to topic, discoverable

RULES:
- All hashtags start with #
- Can mix languages if appropriate
- Realistic and usable hashtags
- Appropriate length and style for platform

Respond in JSON format:
{
  "main": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "trending": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "niche": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "related": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 800, temperature: 0.85, top_p: 0.9, return_full_text: false } })
    })

    let hashtags: any = null
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try { hashtags = JSON.parse(match[0]) } catch (e) { console.error('Parse error:', e) }
      }
    }

    if (!hashtags || !hashtags.main) {
      const topicClean = topic.toLowerCase().replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]/g, '')
      hashtags = {
        main: [`#${topicClean}`, `#${topicClean}tips`, `#${topicClean}life`, `#${topicClean}lover`, `#${topicClean}daily`],
        trending: ['#viral', '#fyp', '#trending', '#explore', '#foryou'],
        niche: [`#${topicClean}community`, `#${topicClean}enthusiast`, `#${topicClean}expert`, `#${topicClean}journey`, `#${topicClean}goals`],
        related: ['#lifestyle', '#motivation', '#instagood', '#content', '#creator']
      }
    }

    return NextResponse.json({ hashtags, topic, platform, generatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('Hashtag Generator Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
