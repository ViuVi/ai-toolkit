import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { input, platform, style, language = 'en' } = await request.json()
    if (!input) return NextResponse.json({ error: language === 'tr' ? 'Bilgi gerekli' : 'Input required' }, { status: 400 })

    const bio = await generateBio(input, platform, style, language)
    return NextResponse.json({ bio })
  } catch (error) {
    console.error('Bio Generator Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

async function generateBio(input: string, platform: string, style: string, language: string) {
  const prompt = language === 'tr'
    ? `${platform} için "${input}" bilgisine göre ${style} tonda kısa bir profil bio'su yaz. Max 150 karakter. Sadece bio metnini yaz.`
    : `Write a short ${style} profile bio for ${platform} based on: "${input}". Max 150 chars. Only write the bio text.`

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 100, temperature: 0.8, return_full_text: false } }),
    })
    if (response.ok) {
      const result = await response.json()
      const text = (result[0]?.generated_text || '').replace(/^["']|["']$/g, '').trim()
      if (text.length > 20) return text.substring(0, 150)
    }
  } catch (e) { console.error('AI Error:', e) }

  const templates: Record<string, Record<string, string>> = {
    tr: { professional: `${input} | Profesyonel içerik üreticisi 💼`, creative: `✨ ${input} | Yaratıcı ruh 🎨`, minimal: `${input}`, fun: `${input} sevdalısı 🔥 | Hayatın tadını çıkar` },
    en: { professional: `${input} | Professional content creator 💼`, creative: `✨ ${input} | Creative soul 🎨`, minimal: `${input}`, fun: `${input} enthusiast 🔥 | Living my best life` }
  }
  return templates[language]?.[style] || templates.en[style] || input
}
