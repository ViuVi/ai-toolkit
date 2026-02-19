import { NextRequest, NextResponse } from 'next/server'

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, count = 20, language = 'en' } = await request.json()

    if (!topic) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Konu gerekli' : 'Topic required' 
      }, { status: 400 })
    }

    console.log('🏷️ Hashtag Generator AI - Topic:', topic, 'Platform:', platform, 'Lang:', language)

    // AI ile hashtag oluştur
    const hashtags = await generateHashtagsWithAI(topic, platform, count, language)

    return NextResponse.json({ 
      hashtags,
      topic,
      platform,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Hashtag Generator Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

async function generateHashtagsWithAI(topic: string, platform: string, count: number, language: string): Promise<{
  main: string[],
  trending: string[],
  niche: string[],
  related: string[]
}> {
  
  const platformContext = {
    instagram: 'Instagram posts, reels, stories',
    tiktok: 'TikTok videos, trends',
    twitter: 'Twitter/X tweets, threads',
    youtube: 'YouTube videos, shorts',
    linkedin: 'LinkedIn professional posts'
  }

  const platformInfo = platformContext[platform as keyof typeof platformContext] || 'social media'

  const prompt = language === 'tr' 
    ? `${topic} konusu için ${platformInfo} platformunda kullanılacak ${count} adet viral hashtag öner. Hashtagler popüler, alakalı ve keşfedilebilir olmalı. Sadece hashtag listesi ver, açıklama yapma. Her satıra bir hashtag yaz.`
    : `Generate ${count} viral hashtags for the topic "${topic}" optimized for ${platformInfo}. Hashtags should be popular, relevant, and discoverable. Only list hashtags, no explanations. One hashtag per line.`

  try {
    // Llama 3.2 ile hashtag oluştur
    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.8,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      const text = data[0]?.generated_text || ''
      
      // Hashtagleri parse et
      const allHashtags = text
        .split(/[\n,]/)
        .map((h: string) => h.trim())
        .filter((h: string) => h.startsWith('#') || h.length > 2)
        .map((h: string) => h.startsWith('#') ? h : `#${h}`)
        .map((h: string) => h.replace(/[^\w#ğüşıöçĞÜŞİÖÇ]/gi, '').toLowerCase())
        .filter((h: string) => h.length > 2 && h.length < 30)
        .slice(0, count)

      if (allHashtags.length >= 8) {
        return categorizeHashtags(allHashtags, topic, platform)
      }
    }
  } catch (error) {
    console.log('AI hashtag generation failed, using smart fallback')
  }

  // Fallback: Akıllı hashtag oluşturma
  return generateSmartHashtags(topic, platform, count, language)
}

function categorizeHashtags(hashtags: string[], topic: string, platform: string): {
  main: string[],
  trending: string[],
  niche: string[],
  related: string[]
} {
  const topicWords = topic.toLowerCase().split(' ')
  
  // Ana hashtagler (topic içerenler)
  const main = hashtags.filter(function(h: string) { 
    return topicWords.some(function(word: string) { return h.toLowerCase().includes(word) })
  }).slice(0, 5)
  
  // Trending (kısa ve genel)
  const trending = hashtags.filter(function(h: string) { 
    return h.length < 15 && !main.includes(h)
  }).slice(0, 5)
  
  // Niche (uzun ve spesifik)
  const niche = hashtags.filter(function(h: string) { 
    return h.length >= 15 && !main.includes(h) && !trending.includes(h)
  }).slice(0, 5)
  
  // Related (geri kalanlar)
  const related = hashtags.filter(function(h: string) { 
    return !main.includes(h) && !trending.includes(h) && !niche.includes(h)
  }).slice(0, 5)

  return { main, trending, niche, related }
}

function generateSmartHashtags(topic: string, platform: string, count: number, language: string): {
  main: string[],
  trending: string[],
  niche: string[],
  related: string[]
} {
  const topicSlug = topic.toLowerCase().replace(/\s+/g, '')
  const topicWords = topic.toLowerCase().split(' ')
  
  // Platform bazlı trending hashtagler
  const platformTrending: {[key: string]: string[]} = {
    instagram: ['#instagood', '#photooftheday', '#instadaily', '#explore', '#viral', '#reels', '#trending', '#fyp', '#instalike', '#picoftheday'],
    tiktok: ['#fyp', '#foryou', '#viral', '#trending', '#foryoupage', '#tiktok', '#xyzbca', '#trend', '#viralvideo', '#duet'],
    twitter: ['#trending', '#viral', '#breaking', '#news', '#thread', '#mustread', '#followback', '#retweet'],
    youtube: ['#youtube', '#subscribe', '#viral', '#shorts', '#youtubeshorts', '#video', '#trending', '#vlog'],
    linkedin: ['#business', '#success', '#leadership', '#entrepreneur', '#professional', '#career', '#growth', '#innovation', '#networking', '#motivation']
  }

  // Niche hashtagler (kategori bazlı)
  const nicheCategories: {[key: string]: string[]} = {
    fitness: ['#fitnessmotivation', '#workout', '#gym', '#healthylifestyle', '#fitlife', '#training', '#bodybuilding', '#fitfam'],
    food: ['#foodie', '#foodporn', '#yummy', '#delicious', '#homemade', '#cooking', '#recipe', '#foodlover'],
    tech: ['#technology', '#innovation', '#ai', '#coding', '#programming', '#developer', '#startup', '#digital'],
    fashion: ['#fashion', '#style', '#ootd', '#fashionista', '#streetstyle', '#outfitoftheday', '#fashionblogger'],
    travel: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation', '#travelphotography', '#travelgram'],
    beauty: ['#beauty', '#makeup', '#skincare', '#beautytips', '#cosmetics', '#beautyblogger', '#glam'],
    business: ['#business', '#entrepreneur', '#success', '#marketing', '#startup', '#hustle', '#businessowner'],
    music: ['#music', '#musician', '#song', '#newmusic', '#singer', '#producer', '#beats', '#musicproducer'],
    art: ['#art', '#artist', '#artwork', '#creative', '#illustration', '#design', '#digitalart', '#drawing'],
    gaming: ['#gaming', '#gamer', '#videogames', '#twitch', '#esports', '#gameplay', '#streamer']
  }

  // Topic'e en yakın kategoriyi bul
  let bestCategory = 'business'
  for (const [category, tags] of Object.entries(nicheCategories)) {
    if (topic.toLowerCase().includes(category) || tags.some(t => topic.toLowerCase().includes(t.replace('#', '')))) {
      bestCategory = category
      break
    }
  }

  // Main hashtagler
  const filteredWords = topicWords.filter(function(w: string) { return w.length > 3 })
  const mappedWords = filteredWords.map(function(w: string) { return '#' + w })
  const main = [
    '#' + topicSlug,
    ...mappedWords,
    '#' + topicSlug + 'tips',
    '#' + topicSlug + new Date().getFullYear(),
    '#best' + topicSlug
  ].slice(0, 5)

  // Trending hashtagler
  const platformTags = platformTrending[platform] || platformTrending.instagram
  const trending = platformTags.sort(function() { return Math.random() - 0.5 }).slice(0, 5)

  // Niche hashtagler
  const nicheTags = nicheCategories[bestCategory] || nicheCategories.business
  const niche = nicheTags.sort(function() { return Math.random() - 0.5 }).slice(0, 5)

  // Related hashtagler
  const relatedPrefixes = language === 'tr' 
    ? ['gunluk', 'turkiye', 'kesfet', 'paylas', 'takip']
    : ['daily', 'life', 'love', 'best', 'top']
  
  const mappedPrefixes = relatedPrefixes.map(function(p: string) { return '#' + p + topicSlug })
  const related = [
    ...mappedPrefixes,
    '#' + topicSlug + 'lover',
    '#' + topicSlug + 'community',
    '#' + topicSlug + 'life',
    '#learn' + topicSlug,
    '#' + topicSlug + 'goals'
  ].slice(0, 5)

  return { main, trending, niche, related }
}
