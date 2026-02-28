import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { niche, platforms, postsPerWeek, month, language = 'en' } = await request.json()
    
    const calendar = await generateCalendar(niche, platforms, postsPerWeek || 7, month, language)
    return NextResponse.json({ calendar })
  } catch (error) {
    console.error('Content Calendar Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function generateCalendar(niche: string, platforms: string[], postsPerWeek: number, month: string, language: string) {
  const contentTypes = language === 'tr'
    ? ['Eğitici İçerik', 'İlham Verici', 'Eğlenceli', 'Soru-Cevap', 'Trend Takibi', 'Behind the Scenes', 'Kullanıcı Yorumu']
    : ['Educational', 'Inspirational', 'Fun/Entertainment', 'Q&A', 'Trend Following', 'Behind the Scenes', 'User Feedback']

  const weeks = []
  for (let w = 1; w <= 4; w++) {
    const posts = []
    for (let d = 0; d < Math.min(postsPerWeek, 7); d++) {
      posts.push({
        day: d + 1,
        contentType: contentTypes[d % contentTypes.length],
        platform: platforms[d % platforms.length] || 'instagram',
        topic: `${niche} - ${contentTypes[d % contentTypes.length]}`,
        suggestedTime: ['09:00', '12:00', '15:00', '18:00', '21:00'][d % 5]
      })
    }
    weeks.push({ week: w, posts })
  }

  return {
    niche,
    month: month || new Date().toLocaleString('default', { month: 'long' }),
    platforms,
    postsPerWeek,
    weeks,
    tips: language === 'tr'
      ? ['İçerik türlerini karıştırın', 'Tutarlı olun', 'Etkileşimleri takip edin']
      : ['Mix content types', 'Stay consistent', 'Track engagement']
  }
}
