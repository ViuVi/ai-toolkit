import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, niche, userId, language = 'en' } = await request.json()

    if (!topic || !platform) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Konu ve platform gerekli' : 'Topic and platform required' 
      }, { status: 400 })
    }

    // Kredi kontrolü
    if (userId) {
      const { data: credits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (!credits || credits.balance < 3) {
        return NextResponse.json({ 
          error: language === 'tr' ? 'Yetersiz kredi (3 kredi gerekli)' : 'Insufficient credits (3 credits required)' 
        }, { status: 403 })
      }
    }

    console.log('🏷️ Hashtag Generator - Topic:', topic, 'Platform:', platform, 'Lang:', language)

    // DİNAMİK hashtag oluştur (her seferinde farklı)
    const hashtags = generateDynamicHashtags(topic, platform, niche, language)

    // Kredi düşür
    if (userId) {
      const { data: currentCredits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (currentCredits) {
        await supabase
          .from('credits')
          .update({
            balance: currentCredits.balance - 3,
            total_used: currentCredits.total_used + 3,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'hashtag-generator',
            tool_display_name: language === 'tr' ? 'Hashtag Generator' : 'Hashtag Generator',
            credits_used: 3,
            input_preview: `${topic} - ${platform}`,
            output_preview: `${hashtags.trending.length} trending hashtags`,
          })
      }
    }

    return NextResponse.json({ hashtags })

  } catch (error) {
    console.error('❌ Hashtag Generator Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

function generateDynamicHashtags(topic: string, platform: string, nicheInput: string, language: string) {
  
  const topicLower = topic.toLowerCase().trim()
  const nicheLower = (nicheInput || topic).toLowerCase().trim()
  
  // GERÇEK POPÜLER HASHTAGLER (Konu bazlı)
  const topicHashtags: {[key: string]: {tr: string[], en: string[]}} = {
    fitness: {
      tr: ['fitness', 'spor', 'antrenman', 'saglikli', 'motivasyon', 'vucut', 'gym', 'kas', 'diyet', 'form', 'egzersiz', 'fit', 'health', 'wellness', 'training'],
      en: ['fitness', 'gym', 'workout', 'fit', 'training', 'health', 'motivation', 'bodybuilding', 'fitfam', 'exercise', 'muscle', 'fitlife', 'wellness', 'strong', 'gains']
    },
    travel: {
      tr: ['seyahat', 'gezi', 'tatil', 'kesfet', 'dunya', 'turkey', 'istanbul', 'gezgin', 'macera', 'yolculuk', 'travel', 'ucak', 'otel', 'deniz', 'fotograf'],
      en: ['travel', 'wanderlust', 'explore', 'adventure', 'traveling', 'travelphotography', 'instatravel', 'travelgram', 'vacation', 'trip', 'tourism', 'world', 'discover', 'journey', 'explore']
    },
    food: {
      tr: ['yemek', 'lezzet', 'mutfak', 'tarif', 'tatlı', 'kahvalti', 'pizza', 'burger', 'pasta', 'food', 'yummy', 'delicious', 'homemade', 'cooking', 'chef'],
      en: ['food', 'foodie', 'foodporn', 'instafood', 'yummy', 'delicious', 'foodstagram', 'cooking', 'foodphotography', 'homemade', 'tasty', 'foodlover', 'chef', 'recipe', 'dinner']
    },
    fashion: {
      tr: ['moda', 'stil', 'kombin', 'trend', 'elbise', 'ayakkabi', 'aksesuar', 'fashion', 'style', 'ootd', 'giyim', 'tasarim', 'butik', 'shopping', 'look'],
      en: ['fashion', 'style', 'ootd', 'fashionista', 'instafashion', 'outfit', 'fashionblogger', 'streetstyle', 'trendy', 'fashionstyle', 'model', 'clothing', 'stylish', 'chic', 'design']
    },
    tech: {
      tr: ['teknoloji', 'yazilim', 'kod', 'programlama', 'dijital', 'innovation', 'ai', 'tech', 'coding', 'developer', 'bilgisayar', 'internet', 'mobil', 'uygulama', 'startup'],
      en: ['tech', 'technology', 'innovation', 'gadgets', 'programming', 'coding', 'developer', 'software', 'ai', 'techie', 'digital', 'computer', 'startup', 'app', 'code']
    },
    gaming: {
      tr: ['oyun', 'gaming', 'gamer', 'esports', 'twitch', 'ps5', 'xbox', 'pc', 'mobile', 'valorant', 'pubg', 'game', 'streamer', 'gameplay', 'wins'],
      en: ['gaming', 'gamer', 'game', 'videogames', 'twitch', 'streamer', 'gameplay', 'esports', 'gamingcommunity', 'pcgaming', 'ps5', 'xbox', 'nintendo', 'mobilegaming', 'wins']
    },
  }

  // Platform bazlı popüler hashtagler
  const platformHashtags: {[key: string]: {tr: string[], en: string[]}} = {
    instagram: {
      tr: ['instagram', 'instagood', 'foto', 'gununkaresin', 'turkiye', 'istanbul', 'ankara', 'izmir', 'love', 'photography', 'like', 'follow', 'instalike', 'instadaily', 'beautiful'],
      en: ['instagood', 'photooftheday', 'instadaily', 'picoftheday', 'love', 'instalike', 'instamood', 'follow', 'like4like', 'beautiful', 'photography', 'art', 'instagram', 'photo', 'followme']
    },
    tiktok: {
      tr: ['tiktok', 'kesfet', 'fyp', 'viral', 'trend', 'video', 'eglence', 'komedi', 'mizah', 'turkiye', 'foryou', 'trending', 'funny', 'dance', 'music'],
      en: ['fyp', 'foryou', 'viral', 'foryoupage', 'trending', 'viralvideo', 'fypシ', 'tiktok', 'trend', 'fy', 'funny', 'comedy', 'dance', 'music', 'entertainment']
    },
    youtube: {
      tr: ['youtube', 'youtuber', 'video', 'vlog', 'abone', 'turkiye', 'egitim', 'eglence', 'oyun', 'muzik', 'komedi', 'tutorial', 'inceleme', 'tanitim', 'gaming'],
      en: ['youtube', 'youtuber', 'subscribe', 'video', 'vlog', 'youtubevideo', 'sub', 'youtubers', 'gaming', 'tutorial', 'review', 'entertainment', 'music', 'comedy', 'educational']
    },
    twitter: {
      tr: ['twitter', 'gundem', 'haber', 'turkiye', 'son', 'dakika', 'trend', 'takip', 'retweet', 'viral', 'tweet', 'gunun', 'sozluk', 'siyaset', 'spor'],
      en: ['twitter', 'tweet', 'trending', 'news', 'breaking', 'viral', 'follow', 'retweet', 'rt', 'followme', 'twittertrends', 'socialmedia', 'politics', 'sports', 'tech']
    },
    linkedin: {
      tr: ['linkedin', 'kariyer', 'is', 'profesyonel', 'network', 'basvuru', 'ilan', 'cv', 'girisim', 'basari', 'egitim', 'liderlik', 'startup', 'teknoloji', 'dijital'],
      en: ['linkedin', 'business', 'career', 'professional', 'networking', 'jobs', 'leadership', 'success', 'entrepreneur', 'motivation', 'corporatelife', 'startup', 'technology', 'innovation', 'marketing']
    }
  }

  // Konu hashtaglerini bul
  let topicTags = {tr: [] as string[], en: [] as string[]}
  for (const [key, tags] of Object.entries(topicHashtags)) {
    if (topicLower.includes(key) || key.includes(topicLower)) {
      topicTags = tags
      break
    }
  }

  const platformTags = platformHashtags[platform.toLowerCase()] || platformHashtags['instagram']
  
  // RASTGELE KARIŞTIR (her seferinde farklı sıra)
  const shuffleArray = (arr: string[]) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const lang = language === 'tr' ? 'tr' : 'en'
  
  // Trending: Topic + Platform karışık (her seferinde farklı)
  const trendingPool = [...(topicTags[lang] || topicTags['en']), ...platformTags[lang]]
  const trending = shuffleArray(trendingPool).slice(0, 10)

  // Niche: Topic-based özel kombinasyonlar
  const topicWord = topicLower.replace(/\s+/g, '')
  const nicheWord = nicheLower.replace(/\s+/g, '')
  
  const nicheSuffixes = language === 'tr'
    ? ['turkiye', 'tr', 'gunluk', 'sevgisi', 'dunyasi', 'hayati', 'haber', 'bilgi', 'ipucu', 'rehber']
    : ['community', 'daily', 'life', 'lover', 'world', 'tips', 'guide', 'passion', 'journey', 'goals']
  
  const nicheHashtags = shuffleArray([
    nicheWord,
    topicWord,
    `${nicheWord}${shuffleArray(nicheSuffixes)[0]}`,
    `${topicWord}${shuffleArray(nicheSuffixes)[1]}`,
    `${nicheWord}${shuffleArray(nicheSuffixes)[2]}`,
    language === 'tr' ? `${topicWord}sevdalilari` : `${topicWord}lovers`,
    language === 'tr' ? `${nicheWord}rehberi` : `${nicheWord}guide`,
    language === 'tr' ? `${topicWord}ile` : `with${topicWord}`,
    `${nicheWord}2026`,
    language === 'tr' ? `ben${topicWord}` : `my${topicWord}`
  ]).slice(0, 10)

  // Branded: Yaratıcı kombinasyonlar
  const currentYear = new Date().getFullYear()
  const branded = shuffleArray([
    `${topicWord}${currentYear}`,
    language === 'tr' ? `benim${topicWord}` : `my${topicWord}`,
    `${topicWord}${language === 'tr' ? 'yolculugu' : 'journey'}`,
    `${topicWord}${language === 'tr' ? 'zamani' : 'time'}`,
    language === 'tr' ? `${topicWord}aski` : `the${topicWord}`,
  ])

  return {
    trending,
    niche: nicheHashtags,
    branded
  }
}