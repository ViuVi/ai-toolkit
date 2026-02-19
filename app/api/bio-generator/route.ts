import { NextRequest, NextResponse } from 'next/server'

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { name, profession, interests, platform, tone, userId, language = 'en' } = await request.json()

    if (!name || !profession) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'İsim ve meslek gerekli' : 'Name and profession required' 
      }, { status: 400 })
    }

    console.log('💫 Bio Generator AI - Name:', name, 'Profession:', profession, 'Platform:', platform)

    const bios = await generateBiosWithAI(name, profession, interests, platform, tone, language)

    return NextResponse.json({ bios })

  } catch (error) {
    console.error('❌ Bio Generator Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

async function generateBiosWithAI(name: string, profession: string, interests: string, platform: string, tone: string, language: string): Promise<string[]> {
  
  const platformLimits: {[key: string]: number} = {
    instagram: 150,
    tiktok: 80,
    twitter: 160,
    linkedin: 220,
    youtube: 200
  }

  const charLimit = platformLimits[platform] || 150

  const toneDescriptions: {[key: string]: string} = {
    casual: language === 'tr' ? 'rahat, samimi, emoji kullanarak' : 'casual, friendly, using emojis',
    professional: language === 'tr' ? 'profesyonel, ciddi, iş odaklı' : 'professional, serious, business-focused',
    creative: language === 'tr' ? 'yaratıcı, eğlenceli, benzersiz' : 'creative, playful, unique'
  }

  const toneDesc = toneDescriptions[tone] || toneDescriptions.casual

  const prompt = language === 'tr'
    ? `${name} için ${platform} profil biyografisi yaz.
Meslek: ${profession}
İlgi alanları: ${interests || 'belirtilmemiş'}
Ton: ${toneDesc}
Karakter limiti: ${charLimit}

3 farklı bio önerisi yaz. Her biri ${charLimit} karakterden kısa olsun. Sadece biyografileri yaz, açıklama yapma. Her biyografiyi yeni satırda yaz.`
    : `Write ${platform} profile bio for ${name}.
Profession: ${profession}
Interests: ${interests || 'not specified'}
Tone: ${toneDesc}
Character limit: ${charLimit}

Write 3 different bio suggestions. Each should be under ${charLimit} characters. Only write the bios, no explanations. Write each bio on a new line.`

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 400,
            temperature: 0.9,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      const text = data[0]?.generated_text || ''
      
      const bios = text
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 20 && line.length < charLimit + 50)
        .map((line: string) => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter((line: string) => !line.toLowerCase().includes('bio') && !line.toLowerCase().includes('here'))
        .slice(0, 3)

      if (bios.length >= 2) {
        return bios
      }
    }
  } catch (error) {
    console.log('AI bio generation failed, using fallback')
  }

  return generateFallbackBios(name, profession, interests, platform, tone, language)
}

function generateFallbackBios(name: string, profession: string, interests: string, platform: string, tone: string, language: string): string[] {
  const templates = {
    casual: {
      tr: [
        `${profession} 🎯 | ${interests ? interests + ' tutkunu' : 'Hayat severim'} ✨`,
        `${name} | ${profession} 💼 | ${interests || 'Macera peşinde'} 🌍`,
        `✨ ${profession} | ${interests ? interests + ' ile yaşıyorum' : 'Hayallerimin peşindeyim'}`
      ],
      en: [
        `${profession} 🎯 | ${interests ? interests + ' enthusiast' : 'Life lover'} ✨`,
        `${name} | ${profession} 💼 | ${interests || 'Adventure seeker'} 🌍`,
        `✨ ${profession} | ${interests ? 'Living for ' + interests : 'Chasing dreams'}`
      ]
    },
    professional: {
      tr: [
        `${profession} | ${interests ? interests + ' uzmanı' : 'Profesyonel'} | İş birliği için DM 📧`,
        `${name} - ${profession} | ${interests || 'Strateji & İnovasyon'}`,
        `Sertifikalı ${profession} | ${interests || 'Eğitim & Mentorluk'}`
      ],
      en: [
        `${profession} | ${interests ? interests + ' specialist' : 'Professional'} | DM for collaborations 📧`,
        `${name} - ${profession} | ${interests || 'Strategy & Innovation'}`,
        `Certified ${profession} | ${interests || 'Education & Mentorship'}`
      ]
    },
    creative: {
      tr: [
        `${profession} ✨ | ${interests ? interests + ' ile sınırları zorluyorum' : 'Yaratıcılık benim tutkum'}`,
        `🎨 ${name} | ${profession} | ${interests || 'Hayal gücünün peşinde'}`,
        `Yaratıcı ${profession} 💡 | ${interests ? interests + ' tutkunu' : 'İlham kaynağı'}`
      ],
      en: [
        `${profession} ✨ | ${interests ? 'Pushing boundaries with ' + interests : 'Creativity is my passion'}`,
        `🎨 ${name} | ${profession} | ${interests || 'Chasing imagination'}`,
        `Creative ${profession} 💡 | ${interests ? interests + ' lover' : 'Inspiration source'}`
      ]
    }
  }

  const toneTemplates = templates[tone as keyof typeof templates] || templates.casual
  const langTemplates = language === 'tr' ? toneTemplates.tr : toneTemplates.en

  return langTemplates
}
