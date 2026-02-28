import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { text, voice, userId, language = 'en' } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: language === 'tr' ? 'Metin gerekli' : 'Text is required' }, { status: 400 })
    }

    if (text.length > 3000) {
      return NextResponse.json({ error: language === 'tr' ? 'Maksimum 3000 karakter' : 'Maximum 3000 characters' }, { status: 400 })
    }

    const selectedVoice = voice || 'Joanna'

    // Kredi kontrolü
    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 3) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    let audioUrl = ''

    // Yöntem 1: ttsmp3.com
    try {
      const formData = new URLSearchParams()
      formData.append('msg', text)
      formData.append('lang', selectedVoice)
      formData.append('source', 'ttsmp3')

      const ttsResponse = await fetch('https://ttsmp3.com/makemp3_new.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      })

      if (ttsResponse.ok) {
        const ttsData = await ttsResponse.json()
        if (ttsData.URL) {
          audioUrl = ttsData.URL
        }
      }
    } catch (e) {
      console.log('ttsmp3 failed, trying fallback')
    }

    // Yöntem 2: StreamElements TTS
    if (!audioUrl) {
      const voiceMap: Record<string, string> = {
        'Joanna': 'Joanna', 'Matthew': 'Matthew', 'Amy': 'Amy', 'Brian': 'Brian',
        'Filiz': 'Filiz', 'Marlene': 'Marlene', 'Hans': 'Hans', 'Celine': 'Celine',
        'Lucia': 'Lucia', 'Carla': 'Carla', 'Tatyana': 'Tatyana', 'Mizuki': 'Mizuki'
      }
      const seVoice = voiceMap[selectedVoice] || 'Brian'
      audioUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${seVoice}&text=${encodeURIComponent(text.substring(0, 500))}`
    }

    // Kredi düş
    if (userId && audioUrl) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) {
        await supabase.from('credits').update({ 
          balance: c.balance - 3, 
          total_used: c.total_used + 3, 
          updated_at: new Date().toISOString() 
        }).eq('user_id', userId)
      }
    }

    return NextResponse.json({
      success: true,
      audioUrl,
      voice: selectedVoice,
      characterCount: text.length
    })

  } catch (error) {
    console.error('TTS Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
