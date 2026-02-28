import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { samples, brandName, userId, language = 'en' } = await request.json()
    if (!samples || samples.length === 0) return NextResponse.json({ error: language === 'tr' ? 'Örnek içerik gerekli' : 'Sample content required' }, { status: 400 })

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
    }

    const analysis = await analyzeBrandVoice(samples, brandName, language)

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2, updated_at: new Date().toISOString() }).eq('user_id', userId)
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Brand Voice Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function analyzeBrandVoice(samples: string[], brandName: string, language: string) {
  const allText = samples.join(' ').toLowerCase()
  
  const tones = []
  if (allText.includes('!') || allText.includes('🔥')) tones.push(language === 'tr' ? 'Enerjik' : 'Energetic')
  if (allText.includes('?')) tones.push(language === 'tr' ? 'İnteraktif' : 'Interactive')
  if (allText.length / samples.length < 100) tones.push(language === 'tr' ? 'Özlü' : 'Concise')
  else tones.push(language === 'tr' ? 'Detaylı' : 'Detailed')
  if (/[\u{1F600}-\u{1F64F}]/u.test(allText)) tones.push(language === 'tr' ? 'Samimi' : 'Friendly')
  else tones.push(language === 'tr' ? 'Profesyonel' : 'Professional')

  const avgLength = Math.round(allText.length / samples.length)
  const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(allText)
  const hasHashtag = allText.includes('#')

  return {
    brandName: brandName || 'Your Brand',
    voiceCharacteristics: tones,
    writingStyle: {
      averageLength: avgLength + ' ' + (language === 'tr' ? 'karakter' : 'characters'),
      emojiUsage: hasEmoji ? (language === 'tr' ? 'Aktif' : 'Active') : (language === 'tr' ? 'Minimal' : 'Minimal'),
      hashtagUsage: hasHashtag ? (language === 'tr' ? 'Aktif' : 'Active') : (language === 'tr' ? 'Minimal' : 'Minimal')
    },
    recommendations: language === 'tr'
      ? ['Tutarlı ton kullanın', 'Hedef kitleye uygun dil seçin', 'Marka değerlerini yansıtın']
      : ['Maintain consistent tone', 'Use audience-appropriate language', 'Reflect brand values'],
    samplesAnalyzed: samples.length
  }
}
