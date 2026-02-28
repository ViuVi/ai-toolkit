import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { platform, timezone, contentType, language = 'en' } = await request.json()
    
    const schedule = generateSchedule(platform, timezone, contentType, language)
    return NextResponse.json({ schedule })
  } catch (error) {
    console.error('Post Scheduler Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

function generateSchedule(platform: string, timezone: string, contentType: string, language: string) {
  const bestTimes: Record<string, string[]> = {
    instagram: ['09:00', '12:00', '15:00', '19:00', '21:00'],
    tiktok: ['07:00', '10:00', '14:00', '19:00', '22:00'],
    twitter: ['08:00', '12:00', '17:00', '20:00'],
    linkedin: ['07:00', '10:00', '12:00', '17:00'],
    youtube: ['15:00', '18:00', '21:00'],
    facebook: ['09:00', '13:00', '16:00', '20:00']
  }

  const times = bestTimes[platform] || bestTimes.instagram
  const days = language === 'tr' 
    ? ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return {
    platform,
    timezone: timezone || 'UTC',
    bestTimes: times,
    bestDays: days.slice(0, 5),
    recommendations: language === 'tr'
      ? ['En yüksek etkileşim saatlerinde paylaşın', 'Tutarlı bir program oluşturun', 'Farklı saatleri test edin']
      : ['Post during peak engagement hours', 'Create a consistent schedule', 'Test different times'],
    weeklyPlan: days.map((day, i) => ({
      day,
      suggestedTime: times[i % times.length],
      priority: i < 5 ? (language === 'tr' ? 'Yüksek' : 'High') : (language === 'tr' ? 'Orta' : 'Medium')
    }))
  }
}
