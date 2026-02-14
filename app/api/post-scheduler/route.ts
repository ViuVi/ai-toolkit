import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { platform, contentType, userTimezone, targetTimezone, language = 'en' } = await request.json()

    if (!platform) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Platform gerekli' : 'Platform required' 
      }, { status: 400 })
    }

    const schedule = generateSchedule(platform, contentType, userTimezone, targetTimezone, language)

    return NextResponse.json({ schedule })

  } catch (error) {
    console.error('Post Scheduler Error:', error)
    return NextResponse.json({ 
      error: language === 'tr' ? 'Bir hata oluştu' : 'An error occurred' 
    }, { status: 500 })
  }
}

function generateSchedule(platform: string, contentType: string, userTimezone: string, targetTimezone: string, language: string) {
  
  const timezones: {[key: string]: number} = {
    'UTC': 0,
    'Europe/London': 0,
    'Europe/Paris': 1,
    'Europe/Berlin': 1,
    'Europe/Istanbul': 3,
    'Asia/Dubai': 4,
    'Asia/Karachi': 5,
    'Asia/Kolkata': 5.5,
    'Asia/Shanghai': 8,
    'Asia/Tokyo': 9,
    'Australia/Sydney': 11,
    'America/New_York': -5,
    'America/Chicago': -6,
    'America/Los_Angeles': -8,
    'America/Sao_Paulo': -3
  }

  const bestTimes: {[key: string]: {[key: string]: string[]}} = {
    instagram: {
      photo: ['09:00', '12:00', '17:00', '19:00'],
      video: ['12:00', '18:00', '21:00'],
      story: ['08:00', '13:00', '19:00', '22:00'],
      reel: ['11:00', '15:00', '20:00']
    },
    tiktok: {
      video: ['07:00', '12:00', '19:00', '22:00'],
      entertainment: ['18:00', '20:00', '21:00'],
      educational: ['09:00', '12:00', '16:00']
    },
    youtube: {
      video: ['14:00', '17:00', '20:00'],
      short: ['12:00', '16:00', '19:00'],
      livestream: ['19:00', '20:00', '21:00']
    },
    twitter: {
      tweet: ['08:00', '12:00', '17:00', '19:00'],
      thread: ['09:00', '13:00', '18:00'],
      poll: ['10:00', '15:00', '20:00']
    },
    linkedin: {
      post: ['08:00', '12:00', '17:00'],
      article: ['07:00', '08:00', '09:00'],
      video: ['12:00', '13:00', '17:00']
    }
  }

  const days = {
    tr: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }

  const platformTimes = bestTimes[platform] || bestTimes.instagram
  const targetTimes = platformTimes[contentType] || platformTimes.photo || ['09:00', '12:00', '17:00']

  // Saat farkını hesapla
  const userOffset = timezones[userTimezone] || 0
  const targetOffset = timezones[targetTimezone] || 0
  const hourDifference = userOffset - targetOffset

  // Hedef bölge saatlerini kullanıcı saatine çevir
  const convertedTimes = targetTimes.map(time => {
    const [hours, minutes] = time.split(':').map(Number)
    let newHours = hours + hourDifference
    
    // 24 saat formatında tut
    if (newHours < 0) newHours += 24
    if (newHours >= 24) newHours -= 24
    
    return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  })

  const dayNames = days[language] || days.en
  
  const schedule = [
    { day: dayNames[0], targetTimes: targetTimes.slice(0, 2), userTimes: convertedTimes.slice(0, 2), engagement: 'High', color: 'green' },
    { day: dayNames[1], targetTimes: targetTimes.slice(1, 3), userTimes: convertedTimes.slice(1, 3), engagement: 'High', color: 'green' },
    { day: dayNames[2], targetTimes: targetTimes.slice(0, 2), userTimes: convertedTimes.slice(0, 2), engagement: 'Medium', color: 'yellow' },
    { day: dayNames[3], targetTimes: targetTimes.slice(1, 3), userTimes: convertedTimes.slice(1, 3), engagement: 'High', color: 'green' },
    { day: dayNames[4], targetTimes: targetTimes.slice(2), userTimes: convertedTimes.slice(2), engagement: 'Very High', color: 'blue' },
    { day: dayNames[5], targetTimes: [targetTimes[targetTimes.length - 1]], userTimes: [convertedTimes[convertedTimes.length - 1]], engagement: 'Medium', color: 'yellow' },
    { day: dayNames[6], targetTimes: [targetTimes[targetTimes.length - 1]], userTimes: [convertedTimes[convertedTimes.length - 1]], engagement: 'Low', color: 'red' }
  ]

  const tips = {
    tr: [
      `${targetTimezone} bölgesinde en iyi paylaşım zamanları sabah 9-11 ve akşam 7-9 arasıdır.`,
      `Sizin saat diliminize (${userTimezone}) göre önerilen saatler yukarıda gösterilmiştir.`,
      'Hafta sonları etkileşim oranları genellikle daha düşüktür.',
      'Hedef kitlenizin aktif saatlerini Analytics ile takip edin.',
      'Tutarlı bir paylaşım programı oluşturun.'
    ],
    en: [
      `Best posting times in ${targetTimezone} are between 9-11 AM and 7-9 PM.`,
      `Recommended times in your timezone (${userTimezone}) are shown above.`,
      'Engagement rates are generally lower on weekends.',
      'Track your audience active hours using Analytics.',
      'Create a consistent posting schedule.'
    ]
  }

  return {
    platform,
    contentType,
    userTimezone,
    targetTimezone,
    timeDifference: hourDifference,
    weeklySchedule: schedule,
    bestOverallTimes: convertedTimes,
    tips: tips[language] || tips.en,
    peakDays: [dayNames[1], dayNames[3], dayNames[4]]
  }
}