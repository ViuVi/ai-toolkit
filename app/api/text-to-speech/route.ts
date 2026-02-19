import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, language = 'en', speed = 1 } = await request.json()

    if (!text) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Metin gerekli' : 'Text required' 
      }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Metin çok uzun (max 5000 karakter)' : 'Text too long (max 5000 characters)' 
      }, { status: 400 })
    }

    console.log('🔊 Text-to-Speech - Text length:', text.length, 'Language:', language)

    // Google Translate TTS API kullan (ücretsiz)
    const voiceLang = getVoiceLanguage(language)
    
    // Metni parçalara böl (Google TTS max 200 karakter)
    const chunks = splitText(text, 200)
    const audioUrls: string[] = []

    for (const chunk of chunks) {
      const encodedText = encodeURIComponent(chunk)
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${voiceLang}&client=tw-ob&q=${encodedText}`
      audioUrls.push(url)
    }

    return NextResponse.json({ 
      success: true,
      audioUrls,
      text,
      language: voiceLang,
      chunks: chunks.length,
      totalCharacters: text.length
    })

  } catch (error) {
    console.error('Text-to-Speech Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

function getVoiceLanguage(lang: string): string {
  const languageMap: {[key: string]: string} = {
    'tr': 'tr',
    'en': 'en',
    'de': 'de',
    'fr': 'fr',
    'es': 'es',
    'it': 'it',
    'pt': 'pt',
    'ru': 'ru',
    'ja': 'ja',
    'ko': 'ko',
    'zh': 'zh-CN',
    'ar': 'ar'
  }
  return languageMap[lang] || 'en'
}

function splitText(text: string, maxLength: number): string[] {
  const chunks: string[] = []
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  
  let currentChunk = ''
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
      }
      // Eğer cümle tek başına maxLength'den uzunsa, kelime bazlı böl
      if (sentence.length > maxLength) {
        const words = sentence.split(' ')
        currentChunk = ''
        for (const word of words) {
          if ((currentChunk + ' ' + word).length <= maxLength) {
            currentChunk += (currentChunk ? ' ' : '') + word
          } else {
            if (currentChunk) {
              chunks.push(currentChunk.trim())
            }
            currentChunk = word
          }
        }
      } else {
        currentChunk = sentence
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks
}
