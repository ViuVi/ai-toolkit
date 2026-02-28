import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url, size, language = 'en' } = await request.json()
    if (!url) return NextResponse.json({ error: language === 'tr' ? 'URL gerekli' : 'URL required' }, { status: 400 })

    const qrSize = size || 200
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}`

    return NextResponse.json({ 
      qrCodeUrl: qrUrl,
      originalUrl: url,
      size: qrSize
    })
  } catch (error) {
    console.error('QR Code Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
