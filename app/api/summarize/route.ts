import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Metin gerekli' },
        { status: 400 }
      )
    }

    console.log('🚀 API isteği gönderiliyor...')

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            max_length: 150,
            min_length: 30,
          },
        }),
      }
    )

    console.log('📥 Response status:', response.status)

    const result = await response.json()
    
    console.log('📦 API Sonucu:', JSON.stringify(result, null, 2))

    // Model yükleniyor hatası
    if (result.error && result.error.includes('loading')) {
      return NextResponse.json({
        error: 'Model yükleniyor, lütfen 20 saniye bekleyip tekrar deneyin.'
      }, { status: 503 })
    }

    // Genel hata
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Başarılı sonuç
    const summary = result[0]?.summary_text || result.summary_text || result

    return NextResponse.json({ summary })

  } catch (error) {
    console.log('❌ Hata:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu: ' + String(error) },
      { status: 500 }
    )
  }
}