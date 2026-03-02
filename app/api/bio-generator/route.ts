import { NextRequest, NextResponse } from 'next/server'

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

const platformLimits: Record<string, number> = {
  instagram: 150, tiktok: 80, twitter: 160, linkedin: 220, youtube: 200
}

const toneGuide: Record<string, Record<string, string>> = {
  casual: { tr: 'rahat, samimi, emoji kullanarak eğlenceli', en: 'casual, friendly, fun with emojis' },
  professional: { tr: 'profesyonel, ciddi, iş odaklı', en: 'professional, serious, business-focused' },
  creative: { tr: 'yaratıcı, eğlenceli, benzersiz ve dikkat çekici', en: 'creative, playful, unique and eye-catching' }
}

export async function POST(request: NextRequest) {
  try {
    const { name, profession, interests, platform, tone, language = 'en' } = await request.json()

    if (!name || !profession) {
      return NextResponse.json({ error: language === 'tr' ? 'İsim ve meslek gerekli' : 'Name and profession required' }, { status: 400 })
    }

    const charLimit = platformLimits[platform] || 150
    const toneDesc = toneGuide[tone]?.[language === 'tr' ? 'tr' : 'en'] || toneGuide.casual.en
    const seed = Date.now()

    const prompt = language === 'tr'
      ? `[SEED:${seed}] ${platform} için profil biyografisi yaz.

İSİM: ${name}
MESLEK: ${profession}
${interests ? `İLGİ ALANLARI: ${interests}` : ''}
TON: ${toneDesc}
KARAKTER LİMİTİ: ${charLimit}

5 FARKLI bio yaz. Her biri:
- Farklı bir yaklaşım kullansın
- ${charLimit} karakteri geçmesin
- Özgün ve akılda kalıcı olsun
- Platform için uygun olsun

JSON formatında yanıt ver:
{
  "bios": ["bio 1", "bio 2", "bio 3", "bio 4", "bio 5"]
}`
      : `[SEED:${seed}] Write profile bio for ${platform}.

NAME: ${name}
PROFESSION: ${profession}
${interests ? `INTERESTS: ${interests}` : ''}
TONE: ${toneDesc}
CHARACTER LIMIT: ${charLimit}

Write 5 DIFFERENT bios. Each should:
- Use a different approach
- Not exceed ${charLimit} characters
- Be original and memorable
- Be appropriate for the platform

Respond in JSON format:
{
  "bios": ["bio 1", "bio 2", "bio 3", "bio 4", "bio 5"]
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 800, temperature: 0.9, top_p: 0.95, return_full_text: false } })
    })

    let bios: string[] = []
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          const parsed = JSON.parse(match[0])
          bios = parsed.bios || []
        } catch (e) { console.error('Parse error:', e) }
      }
    }

    if (bios.length < 3) {
      const emoji = tone === 'professional' ? '' : '✨'
      const emoji2 = tone === 'professional' ? '' : '🚀'
      
      bios = language === 'tr' ? [
        `${emoji} ${profession} | ${name} | ${interests || 'İçerik üreticisi'} ${emoji2}`,
        `${name} • ${profession} • ${interests || 'Hayallerin peşinde'} ${emoji}`,
        `${profession} olarak ${interests || 'tutkumu'} paylaşıyorum | ${name}`,
        `${emoji2} ${name} | ${profession} | DM açık`,
        `Merhaba! Ben ${name}, ${profession.toLowerCase()} ${emoji}`
      ] : [
        `${emoji} ${profession} | ${name} | ${interests || 'Content Creator'} ${emoji2}`,
        `${name} • ${profession} • ${interests || 'Chasing dreams'} ${emoji}`,
        `Sharing my passion for ${interests || 'life'} as a ${profession} | ${name}`,
        `${emoji2} ${name} | ${profession} | DMs open`,
        `Hey! I'm ${name}, a ${profession.toLowerCase()} ${emoji}`
      ]
    }

    // Karakter limitine göre kırp
    bios = bios.map(bio => bio.length > charLimit ? bio.substring(0, charLimit - 3) + '...' : bio)

    return NextResponse.json({ bios })
  } catch (error) {
    console.error('Bio Generator Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
