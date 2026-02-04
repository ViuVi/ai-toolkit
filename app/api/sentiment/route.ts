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

    console.log('🎭 Duygu analizi başlıyor...')

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/nlptown/bert-base-multilingual-uncased-sentiment',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    )

    const result = await response.json()
    console.log('📦 Sonuç:', result)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Sonucu işle
    const scores = result[0] || result
    
    // En yüksek skoru bul
    let maxScore = 0
    let sentiment = ''
    
    for (const item of scores) {
      if (item.score > maxScore) {
        maxScore = item.score
        sentiment = item.label
      }
    }

    // Yıldız sayısına göre duygu belirle
    const starToSentiment: { [key: string]: { emoji: string; text: string; color: string } } = {
      '1 star': { emoji: '😠', text: 'Çok Olumsuz', color: 'red' },
      '2 stars': { emoji: '😕', text: 'Olumsuz', color: 'orange' },
      '3 stars': { emoji: '😐', text: 'Nötr', color: 'yellow' },
      '4 stars': { emoji: '🙂', text: 'Olumlu', color: 'lime' },
      '5 stars': { emoji: '😍', text: 'Çok Olumlu', color: 'green' },
    }

    const analysis = starToSentiment[sentiment] || { emoji: '🤔', text: 'Belirsiz', color: 'gray' }

    return NextResponse.json({
      sentiment: analysis.text,
      emoji: analysis.emoji,
      color: analysis.color,
      confidence: Math.round(maxScore * 100),
      details: scores
    })

  } catch (error) {
    console.log('❌ Hata:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}