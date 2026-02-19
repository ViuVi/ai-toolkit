import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ttsmp3.com benzeri ses listesi
const VOICES: {[key: string]: { language: string, name: string, gender: string, code: string }} = {
  // Turkish
  'Filiz': { language: 'Turkish', name: 'Filiz', gender: 'Female', code: 'Filiz' },
  
  // US English
  'Joanna': { language: 'US English', name: 'Joanna', gender: 'Female', code: 'Joanna' },
  'Matthew': { language: 'US English', name: 'Matthew', gender: 'Male', code: 'Matthew' },
  'Ivy': { language: 'US English', name: 'Ivy', gender: 'Female (Child)', code: 'Ivy' },
  'Joey': { language: 'US English', name: 'Joey', gender: 'Male', code: 'Joey' },
  'Kendra': { language: 'US English', name: 'Kendra', gender: 'Female', code: 'Kendra' },
  'Kimberly': { language: 'US English', name: 'Kimberly', gender: 'Female', code: 'Kimberly' },
  'Salli': { language: 'US English', name: 'Salli', gender: 'Female', code: 'Salli' },
  'Justin': { language: 'US English', name: 'Justin', gender: 'Male (Child)', code: 'Justin' },
  
  // British English
  'Amy': { language: 'British English', name: 'Amy', gender: 'Female', code: 'Amy' },
  'Brian': { language: 'British English', name: 'Brian', gender: 'Male', code: 'Brian' },
  'Emma': { language: 'British English', name: 'Emma', gender: 'Female', code: 'Emma' },
  
  // German
  'Marlene': { language: 'German', name: 'Marlene', gender: 'Female', code: 'Marlene' },
  'Hans': { language: 'German', name: 'Hans', gender: 'Male', code: 'Hans' },
  'Vicki': { language: 'German', name: 'Vicki', gender: 'Female', code: 'Vicki' },
  
  // French
  'Celine': { language: 'French', name: 'Céline', gender: 'Female', code: 'Celine' },
  'Mathieu': { language: 'French', name: 'Mathieu', gender: 'Male', code: 'Mathieu' },
  'Lea': { language: 'French', name: 'Léa', gender: 'Female', code: 'Lea' },
  
  // Spanish
  'Lucia': { language: 'Castilian Spanish', name: 'Lucia', gender: 'Female', code: 'Lucia' },
  'Enrique': { language: 'Castilian Spanish', name: 'Enrique', gender: 'Male', code: 'Enrique' },
  'Conchita': { language: 'Castilian Spanish', name: 'Conchita', gender: 'Female', code: 'Conchita' },
  'Mia': { language: 'Mexican Spanish', name: 'Mia', gender: 'Female', code: 'Mia' },
  'Penelope': { language: 'US Spanish', name: 'Penélope', gender: 'Female', code: 'Penelope' },
  
  // Italian
  'Carla': { language: 'Italian', name: 'Carla', gender: 'Female', code: 'Carla' },
  'Giorgio': { language: 'Italian', name: 'Giorgio', gender: 'Male', code: 'Giorgio' },
  'Bianca': { language: 'Italian', name: 'Bianca', gender: 'Female', code: 'Bianca' },
  
  // Portuguese
  'Camila': { language: 'Brazilian Portuguese', name: 'Camila', gender: 'Female', code: 'Camila' },
  'Ricardo': { language: 'Brazilian Portuguese', name: 'Ricardo', gender: 'Male', code: 'Ricardo' },
  'Vitoria': { language: 'Brazilian Portuguese', name: 'Vitória', gender: 'Female', code: 'Vitoria' },
  'Cristiano': { language: 'Portuguese', name: 'Cristiano', gender: 'Male', code: 'Cristiano' },
  'Ines': { language: 'Portuguese', name: 'Inês', gender: 'Female', code: 'Ines' },
  
  // Russian
  'Tatyana': { language: 'Russian', name: 'Tatyana', gender: 'Female', code: 'Tatyana' },
  'Maxim': { language: 'Russian', name: 'Maxim', gender: 'Male', code: 'Maxim' },
  
  // Japanese
  'Mizuki': { language: 'Japanese', name: 'Mizuki', gender: 'Female', code: 'Mizuki' },
  'Takumi': { language: 'Japanese', name: 'Takumi', gender: 'Male', code: 'Takumi' },
  
  // Korean
  'Seoyeon': { language: 'Korean', name: 'Seoyeon', gender: 'Female', code: 'Seoyeon' },
  
  // Chinese
  'Zhiyu': { language: 'Chinese Mandarin', name: 'Zhiyu', gender: 'Female', code: 'Zhiyu' },
  
  // Arabic
  'Zeina': { language: 'Arabic', name: 'Zeina', gender: 'Female', code: 'Zeina' },
  
  // Dutch
  'Lotte': { language: 'Dutch', name: 'Lotte', gender: 'Female', code: 'Lotte' },
  'Ruben': { language: 'Dutch', name: 'Ruben', gender: 'Male', code: 'Ruben' },
  
  // Polish
  'Ewa': { language: 'Polish', name: 'Ewa', gender: 'Female', code: 'Ewa' },
  'Jacek': { language: 'Polish', name: 'Jacek', gender: 'Male', code: 'Jacek' },
  'Maja': { language: 'Polish', name: 'Maja', gender: 'Female', code: 'Maja' },
  'Jan': { language: 'Polish', name: 'Jan', gender: 'Male', code: 'Jan' },
  
  // Australian English
  'Nicole': { language: 'Australian English', name: 'Nicole', gender: 'Female', code: 'Nicole' },
  'Russell': { language: 'Australian English', name: 'Russell', gender: 'Male', code: 'Russell' },
  
  // Indian English
  'Aditi': { language: 'Indian English', name: 'Aditi', gender: 'Female', code: 'Aditi' },
  'Raveena': { language: 'Indian English', name: 'Raveena', gender: 'Female', code: 'Raveena' },
  
  // Others
  'Chantal': { language: 'Canadian French', name: 'Chantal', gender: 'Female', code: 'Chantal' },
  'Naja': { language: 'Danish', name: 'Naja', gender: 'Female', code: 'Naja' },
  'Mads': { language: 'Danish', name: 'Mads', gender: 'Male', code: 'Mads' },
  'Liv': { language: 'Norwegian', name: 'Liv', gender: 'Female', code: 'Liv' },
  'Astrid': { language: 'Swedish', name: 'Astrid', gender: 'Female', code: 'Astrid' },
  'Carmen': { language: 'Romanian', name: 'Carmen', gender: 'Female', code: 'Carmen' },
  'Dora': { language: 'Icelandic', name: 'Dóra', gender: 'Female', code: 'Dora' },
  'Karl': { language: 'Icelandic', name: 'Karl', gender: 'Male', code: 'Karl' },
  'Gwyneth': { language: 'Welsh', name: 'Gwyneth', gender: 'Female', code: 'Gwyneth' },
  'Geraint': { language: 'Welsh English', name: 'Geraint', gender: 'Male', code: 'Geraint' },
}

export async function POST(request: NextRequest) {
  try {
    const { text, voice, userId, language = 'en' } = await request.json()

    if (!text) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Metin gerekli' : 'Text required' 
      }, { status: 400 })
    }

    if (text.length > 3000) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Metin çok uzun (max 3000 karakter)' : 'Text too long (max 3000 characters)' 
      }, { status: 400 })
    }

    const selectedVoice = voice || 'Joanna'

    // Kredi kontrolü (3 kredi)
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

    console.log('🔊 Text-to-Speech - Voice:', selectedVoice, 'Text length:', text.length)

    // ttsmp3.com API'sine istek at
    const formData = new URLSearchParams()
    formData.append('msg', text)
    formData.append('lang', selectedVoice)
    formData.append('source', 'ttsmp3')

    const ttsResponse = await fetch('https://ttsmp3.com/makemp3_new.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    })

    const ttsData = await ttsResponse.json()

    if (!ttsData.URL) {
      // Fallback: Google Translate TTS
      const langCode = getLanguageCode(selectedVoice)
      const encodedText = encodeURIComponent(text.substring(0, 200))
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodedText}`
      
      return NextResponse.json({ 
        success: true,
        audioUrl: fallbackUrl,
        text,
        voice: selectedVoice,
        voiceInfo: VOICES[selectedVoice],
        characterCount: text.length,
        fallback: true
      })
    }

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
            tool_name: 'text-to-speech',
            tool_display_name: language === 'tr' ? 'Seslendirme' : 'Text to Speech',
            credits_used: 3,
            input_preview: text.substring(0, 50) + '...',
            output_preview: `Voice: ${selectedVoice}`,
          })
      }
    }

    return NextResponse.json({ 
      success: true,
      audioUrl: ttsData.URL,
      text,
      voice: selectedVoice,
      voiceInfo: VOICES[selectedVoice],
      characterCount: text.length
    })

  } catch (error) {
    console.error('Text-to-Speech Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

function getLanguageCode(voice: string): string {
  const voiceInfo = VOICES[voice]
  if (!voiceInfo) return 'en'
  
  const langMap: {[key: string]: string} = {
    'Turkish': 'tr',
    'US English': 'en',
    'British English': 'en-GB',
    'Australian English': 'en-AU',
    'Indian English': 'en-IN',
    'German': 'de',
    'French': 'fr',
    'Canadian French': 'fr-CA',
    'Castilian Spanish': 'es',
    'Mexican Spanish': 'es-MX',
    'US Spanish': 'es-US',
    'Italian': 'it',
    'Brazilian Portuguese': 'pt-BR',
    'Portuguese': 'pt',
    'Russian': 'ru',
    'Japanese': 'ja',
    'Korean': 'ko',
    'Chinese Mandarin': 'zh-CN',
    'Arabic': 'ar',
    'Dutch': 'nl',
    'Polish': 'pl',
    'Danish': 'da',
    'Norwegian': 'no',
    'Swedish': 'sv',
    'Romanian': 'ro',
    'Icelandic': 'is',
    'Welsh': 'cy',
    'Welsh English': 'en-GB-WLS',
  }
  
  return langMap[voiceInfo.language] || 'en'
}

// Sesleri listele
export async function GET() {
  // Dile göre grupla
  const groupedVoices: {[key: string]: any[]} = {}
  
  Object.entries(VOICES).forEach(function(entry: [string, any]) { const id = entry[0]; const info = entry[1];
    if (!groupedVoices[info.language]) {
      groupedVoices[info.language] = []
    }
    groupedVoices[info.language].push({ id, ...info })
  })

  return NextResponse.json({ voices: groupedVoices, voiceList: VOICES })
}
