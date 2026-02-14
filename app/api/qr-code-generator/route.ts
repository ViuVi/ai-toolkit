import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, language = 'en' } = await request.json()

    if (!text) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Metin gerekli' : 'Text required' 
      }, { status: 400 })
    }

    // QR kod işlemleri frontend'de yapılıyor
    // Bu endpoint sadece tracking için
    
    return NextResponse.json({ 
      success: true,
      message: language === 'tr' ? 'QR kod oluşturuldu' : 'QR code generated'
    })

  } catch (error) {
    console.error('QR Generator Error:', error)
    return NextResponse.json({ 
      error: language === 'tr' ? 'Bir hata oluştu' : 'An error occurred' 
    }, { status: 500 })
  }
}