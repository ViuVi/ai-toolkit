import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { month, year, platform, niche, language = 'en' } = await request.json()

    if (!month || !year) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Ay ve yıl gerekli' : 'Month and year required' 
      }, { status: 400 })
    }

    console.log('📅 Content Calendar - Month:', month, 'Year:', year, 'Platform:', platform)

    const calendar = generateCalendar(month, year, platform, niche, language)

    return NextResponse.json({ calendar })

  } catch (error) {
    console.error('Content Calendar Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

function generateCalendar(month: number, year: number, platform: string, niche: string, language: string) {
  
  const monthNames = {
    tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }

  const daysInMonth = new Date(year, month, 0).getDate()
  const monthName = (language === 'tr' ? monthNames.tr : monthNames.en)[month - 1]

  // Özel günler ve bayramlar
  const specialDays: {[key: string]: {[key: number]: string[]}} = {
    tr: {
      1: ['1 - Yılbaşı 🎉', '14 - Sevgililer Günü ❤️'],
      2: ['8 - Dünya Kadınlar Günü 💐', '14 - Tıp Bayramı'],
      3: ['18 - Çanakkale Zaferi 🇹🇷', '21 - Nevruz Bayramı'],
      4: ['23 - Ulusal Egemenlik ve Çocuk Bayramı 🇹🇷'],
      5: ['1 - İşçi Bayramı', '19 - Gençlik ve Spor Bayramı 🇹🇷'],
      6: ['1 - Dünya Çocuk Günü 👶'],
      7: ['15 - Demokrasi Bayramı 🇹🇷'],
      8: ['30 - Zafer Bayramı 🇹🇷'],
      9: ['Ramazan Bayramı 🌙'],
      10: ['29 - Cumhuriyet Bayramı 🇹🇷'],
      11: ['10 - Atatürk Günü 🇹🇷'],
      12: ['Kurban Bayramı 🕌', '31 - Yılbaşı Gecesi 🎆']
    },
    en: {
      1: ['1 - New Year 🎉', '14 - Valentine\'s Day ❤️'],
      2: ['8 - Women\'s Day 💐', '14 - Valentine\'s Day ❤️'],
      3: ['17 - St. Patrick\'s Day 🍀', '20 - Spring Equinox 🌸'],
      4: ['1 - April Fools 🤡', '22 - Earth Day 🌍'],
      5: ['1 - Labor Day', '12 - Mother\'s Day 👩'],
      6: ['16 - Father\'s Day 👨', '21 - Summer Solstice ☀️'],
      7: ['4 - Independence Day 🇺🇸'],
      8: [],
      9: ['22 - Autumn Equinox 🍂'],
      10: ['31 - Halloween 🎃'],
      11: ['28 - Thanksgiving 🦃'],
      12: ['25 - Christmas 🎄', '31 - New Year\'s Eve 🎆']
    }
  }

  // Platform bazlı içerik önerileri
  const contentTypes = {
    instagram: [
      { type: 'Reel', icon: '🎬', frequency: 'daily' },
      { type: 'Story', icon: '📸', frequency: 'daily' },
      { type: 'Post', icon: '📷', frequency: '3x week' },
      { type: 'Carousel', icon: '🖼️', frequency: '2x week' }
    ],
    tiktok: [
      { type: 'Video', icon: '🎵', frequency: 'daily' },
      { type: 'Trending Sound', icon: '🔥', frequency: '3x week' },
      { type: 'Duet', icon: '👥', frequency: 'weekly' }
    ],
    youtube: [
      { type: 'Long Video', icon: '📺', frequency: '2x week' },
      { type: 'Short', icon: '⚡', frequency: 'daily' },
      { type: 'Live', icon: '🔴', frequency: 'weekly' }
    ],
    twitter: [
      { type: 'Tweet', icon: '🐦', frequency: 'daily' },
      { type: 'Thread', icon: '🧵', frequency: '3x week' },
      { type: 'Poll', icon: '📊', frequency: 'weekly' }
    ],
    linkedin: [
      { type: 'Post', icon: '💼', frequency: '3x week' },
      { type: 'Article', icon: '📝', frequency: 'weekly' },
      { type: 'Video', icon: '🎥', frequency: 'weekly' }
    ]
  }

  // Niche bazlı konu önerileri
  const nicheTopics: {[key: string]: string[]} = {
    fitness: ['Workout Tips', 'Nutrition Guide', 'Transformation Story', 'Exercise Demo', 'Motivation Monday', 'Meal Prep', 'Fitness Myth', 'Product Review'],
    food: ['Recipe Tutorial', 'Food Review', 'Cooking Tips', 'Kitchen Hacks', 'Restaurant Visit', 'Ingredient Guide', 'Quick Meal', 'Healthy Option'],
    tech: ['Product Review', 'Tech News', 'Tutorial', 'Comparison', 'Tips & Tricks', 'Unboxing', 'App Recommendation', 'Tech Myth'],
    fashion: ['Outfit Ideas', 'Style Tips', 'Trend Alert', 'Haul Video', 'Styling Guide', 'Shopping Picks', 'Fashion Hack', 'Wardrobe Essentials'],
    travel: ['Destination Guide', 'Travel Vlog', 'Budget Tips', 'Hidden Gems', 'Packing Guide', 'Travel Hack', 'Food Tour', 'Adventure Story'],
    business: ['Business Tip', 'Success Story', 'Industry News', 'Productivity Hack', 'Tool Review', 'Market Analysis', 'Leadership Lesson', 'Case Study'],
    beauty: ['Tutorial', 'Product Review', 'Skincare Routine', 'Makeup Look', 'Beauty Hack', 'Product Comparison', 'Trend Try-On', 'Morning Routine']
  }

  const topics = nicheTopics[niche] || nicheTopics.business
  const platformContent = contentTypes[platform as keyof typeof contentTypes] || contentTypes.instagram

  // Günlük plan oluştur
  const days = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()
    const dayName = {
      tr: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }[language][dayOfWeek]

    // Rastgele içerik tipi ve konu seç
    const randomContent = platformContent[Math.floor(Math.random() * platformContent.length)]
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]

    // Özel gün kontrolü
    const specialDay = specialDays[language][month]?.find(sd => sd.startsWith(`${day} -`))

    // Haftasonları farklı öneri
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const suggestion = isWeekend 
      ? (language === 'tr' ? 'Hafta sonu içeriği - Daha rahat & eğlenceli' : 'Weekend content - More casual & fun')
      : (language === 'tr' ? 'Hafta içi içeriği - Daha profesyonel' : 'Weekday content - More professional')

    days.push({
      day,
      dayName,
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      contentType: randomContent.type,
      icon: randomContent.icon,
      topic: randomTopic,
      specialDay: specialDay || null,
      isWeekend,
      suggestion,
      bestTime: getBestPostingTime(platform, dayOfWeek)
    })
  }

  // Haftalık özet
  const weeklyPlan = {
    totalPosts: Math.ceil(daysInMonth * 0.8), // %80 paylaşım oranı
    reels: days.filter(d => d.contentType.includes('Reel') || d.contentType.includes('Video')).length,
    posts: days.filter(d => d.contentType === 'Post').length,
    stories: days.filter(d => d.contentType === 'Story').length,
    specialDaysCount: days.filter(d => d.specialDay).length
  }

  return {
    month: monthName,
    year,
    platform,
    niche,
    daysInMonth,
    days,
    weeklyPlan,
    tips: generateTips(platform, language)
  }
}

function getBestPostingTime(platform: string, dayOfWeek: number): string {
  const times: {[key: string]: string[][]} = {
    instagram: [
      ['10:00', '14:00', '19:00'], // Sunday
      ['09:00', '12:00', '18:00'], // Monday
      ['09:00', '12:00', '18:00'], // Tuesday
      ['09:00', '13:00', '18:00'], // Wednesday
      ['09:00', '12:00', '19:00'], // Thursday
      ['09:00', '12:00', '20:00'], // Friday
      ['11:00', '15:00', '20:00']  // Saturday
    ],
    youtube: [
      ['14:00', '18:00', '20:00'],
      ['15:00', '18:00', '21:00'],
      ['15:00', '18:00', '21:00'],
      ['15:00', '18:00', '21:00'],
      ['15:00', '19:00', '21:00'],
      ['15:00', '19:00', '21:00'],
      ['12:00', '16:00', '20:00']
    ]
  }

  const platformTimes = times[platform] || times.instagram
  const dayTimes = platformTimes[dayOfWeek]
  return dayTimes[Math.floor(Math.random() * dayTimes.length)]
}

function generateTips(platform: string, language: string): string[] {
  const tips = {
    tr: [
      `${platform} için tutarlı paylaşım yapın - haftada en az 3-4 içerik`,
      'Özel günleri ve trendleri takip edin',
      'Hafta sonları daha rahat, hafta içi daha profesyonel içerikler paylaşın',
      'Her içeriği en az 24 saat önceden planlayın',
      'Analitiklerinizi kontrol edin ve en iyi performans gösteren içerik tiplerini tekrarlayın'
    ],
    en: [
      `Post consistently on ${platform} - at least 3-4 times per week`,
      'Track special days and trends',
      'Weekend content should be more casual, weekday more professional',
      'Plan each post at least 24 hours in advance',
      'Check your analytics and repeat best-performing content types'
    ]
  }

  return tips[language] || tips.en
}