import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, count, language = 'en' } = await request.json()
    if (!topic) return NextResponse.json({ error: language === 'tr' ? 'Konu gerekli' : 'Topic required' }, { status: 400 })

    const hashtags = await generateHashtags(topic, platform, count || 20, language)
    return NextResponse.json({ hashtags })
  } catch (error) {
    console.error('Hashtag Generator Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function generateHashtags(topic: string, platform: string, count: number, language: string) {
  const prompt = language === 'tr'
    ? `"${topic}" için ${platform} platformunda kullanılacak ${count} popüler hashtag üret. Sadece hashtag'leri yaz, # işaretiyle başlat.`
    : `Generate ${count} popular hashtags for "${topic}" on ${platform}. Only write hashtags starting with #.`

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 200, temperature: 0.7, return_full_text: false } }),
    })
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const tags = text.match(/#\w+/g)?.slice(0, count) || []
      if (tags.length >= 5) return tags.map((tag: string, i: number) => ({ id: i + 1, hashtag: tag, popularity: Math.floor(Math.random() * 50 + 50) + '%' }))
    }
  } catch (e) { console.error('AI Error:', e) }

  const words = topic.toLowerCase().split(' ').filter(w => w.length > 2)
  const base = ['viral', 'trending', 'fyp', 'explore', 'content', 'creator', 'tips', 'growth', 'success', 'motivation']
  const tags = [...words.map(w => `#${w}`), ...base.map(b => `#${b}`)].slice(0, count)
  return tags.map((tag, i) => ({ id: i + 1, hashtag: tag, popularity: Math.floor(Math.random() * 50 + 50) + '%' }))
}
