import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { name, profession, interests, platform, tone, userId, language = 'en' } = await request.json()

    if (!name || !profession) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'İsim ve meslek gerekli' : 'Name and profession required' 
      }, { status: 400 })
    }

    console.log('💫 Bio Generator - Name:', name, 'Profession:', profession, 'Platform:', platform)

    const bios = generateBios(name, profession, interests, platform, tone, language)

    return NextResponse.json({ bios })

  } catch (error) {
    console.error('❌ Bio Generator Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred' 
    }, { status: 500 })
  }
}

function generateBios(name: string, profession: string, interests: string, platform: string, tone: string, language: string) {
  
  const templates = {
    instagram: {
      casual: {
        tr: [
          `${profession} 🎯 | ${interests ? interests + ' tutkunu' : 'Hayat severim'} ✨`,
          `${name} | ${profession} 💼 | ${interests || 'Macera peşinde'} 🌍`,
          `${profession} & ${interests || 'İçerik üreticisi'} 📱 | Hikayem burada başlıyor`,
          `✨ ${profession} | ${interests ? interests + ' ile yaşıyorum' : 'Hayallerimin peşindeyim'}`,
          `${name} 🌟 | ${profession} | ${interests || 'Anı kolleksiyoncusu'} 📸`
        ],
        en: [
          `${profession} 🎯 | ${interests ? interests + ' enthusiast' : 'Life lover'} ✨`,
          `${name} | ${profession} 💼 | ${interests || 'Adventure seeker'} 🌍`,
          `${profession} & ${interests || 'Content creator'} 📱 | My story starts here`,
          `✨ ${profession} | ${interests ? 'Living for ' + interests : 'Chasing dreams'}`,
          `${name} 🌟 | ${profession} | ${interests || 'Moment collector'} 📸`
        ]
      },
      professional: {
        tr: [
          `${profession} | ${interests ? interests + ' uzmanı' : 'Profesyonel'} | İş birliği için DM 📧`,
          `${name} - ${profession} 💼 | ${interests || 'Strateji & İnovasyon'} | Şirket: @yourcompany`,
          `${profession} 🎯 | ${interests ? interests + ' danışmanı' : 'Sektör lideri'} | info@email.com`,
          `Sertifikalı ${profession} | ${interests || 'Eğitim & Mentorluk'} | Linkedin: ${name}`,
          `${profession} & ${interests || 'Girişimci'} | 10+ yıl deneyim | Konuşmalar için iletişime geçin`
        ],
        en: [
          `${profession} | ${interests ? interests + ' specialist' : 'Professional'} | DM for collaborations 📧`,
          `${name} - ${profession} 💼 | ${interests || 'Strategy & Innovation'} | Company: @yourcompany`,
          `${profession} 🎯 | ${interests ? interests + ' consultant' : 'Industry leader'} | info@email.com`,
          `Certified ${profession} | ${interests || 'Education & Mentorship'} | LinkedIn: ${name}`,
          `${profession} & ${interests || 'Entrepreneur'} | 10+ years experience | DM for speaking engagements`
        ]
      },
      creative: {
        tr: [
          `${profession} ✨ | ${interests ? interests + ' ile sınırları zorluyorum' : 'Yaratıcılık benim tutkum'}`,
          `🎨 ${name} | ${profession} | ${interests || 'Hayal gücünün peşinde'}`,
          `${profession} & ${interests || 'Sanatçı'} | Hayatı renklerle boyuyorum 🌈`,
          `Yaratıcı ${profession} 💡 | ${interests ? interests + ' tutkunu' : 'İlham kaynağı'} | Hikayeler anlatıyorum`,
          `${name} ✨ ${profession} | ${interests || 'Rüyaları gerçeğe dönüştürüyorum'}`
        ],
        en: [
          `${profession} ✨ | ${interests ? 'Pushing boundaries with ' + interests : 'Creativity is my passion'}`,
          `🎨 ${name} | ${profession} | ${interests || 'Chasing imagination'}`,
          `${profession} & ${interests || 'Artist'} | Painting life with colors 🌈`,
          `Creative ${profession} 💡 | ${interests ? interests + ' lover' : 'Inspiration source'} | Storyteller`,
          `${name} ✨ ${profession} | ${interests || 'Turning dreams into reality'}`
        ]
      }
    },
    twitter: {
      casual: {
        tr: [
          `${profession} 🎯 ${interests ? '| ' + interests + ' hakkında tweet atıyorum' : ''}`,
          `${name} | ${profession} | ${interests || 'Düşüncelerimi paylaşıyorum'} 💭`,
          `${profession} & ${interests || 'sosyal medya'} meraklısı 📱`,
          `Günlük ${profession} hikayeleri | ${interests || 'Trend takipçisi'} ✨`
        ],
        en: [
          `${profession} 🎯 ${interests ? '| Tweeting about ' + interests : ''}`,
          `${name} | ${profession} | ${interests || 'Sharing thoughts'} 💭`,
          `${profession} & ${interests || 'social media'} enthusiast 📱`,
          `Daily ${profession} stories | ${interests || 'Trend watcher'} ✨`
        ]
      },
      professional: {
        tr: [
          `${profession} | ${interests || 'Sektör içgörüleri'} | Görüşler benimdir`,
          `${name} - ${profession} 💼 | ${interests ? interests + ' uzmanı' : 'Lider'} | DM açık`,
          `${profession} 🎯 | ${interests || 'Teknoloji & İnovasyon'} | Konuşmacı`
        ],
        en: [
          `${profession} | ${interests || 'Industry insights'} | Opinions are my own`,
          `${name} - ${profession} 💼 | ${interests ? interests + ' expert' : 'Leader'} | DM open`,
          `${profession} 🎯 | ${interests || 'Tech & Innovation'} | Speaker`
        ]
      },
      creative: {
        tr: [
          `Yaratıcı ${profession} ✨ | ${interests || 'Hikaye anlatıcısı'}`,
          `${name} 🎨 ${profession} | ${interests ? interests + ' ile ilham veriyorum' : 'İlham peşinde'}`,
          `${profession} & ${interests || 'Sanat'} | Fikirleri hayata geçiriyorum 💡`
        ],
        en: [
          `Creative ${profession} ✨ | ${interests || 'Storyteller'}`,
          `${name} 🎨 ${profession} | ${interests ? 'Inspiring through ' + interests : 'Seeking inspiration'}`,
          `${profession} & ${interests || 'Art'} | Bringing ideas to life 💡`
        ]
      }
    },
    linkedin: {
      professional: {
        tr: [
          `${profession} | ${interests || 'Liderlik & Strateji'} | 10+ yıl sektör deneyimi`,
          `${name} - ${profession} 💼 | ${interests ? interests + ' uzmanı' : 'Sektör lideri'} | MBA`,
          `Kıdemli ${profession} | ${interests || 'Dijital Dönüşüm'} | Sertifikalı Eğitmen`,
          `${profession} 🎯 | ${interests || 'İnovasyon & Teknoloji'} | Fortune 500 deneyimi`
        ],
        en: [
          `${profession} | ${interests || 'Leadership & Strategy'} | 10+ years industry experience`,
          `${name} - ${profession} 💼 | ${interests ? interests + ' specialist' : 'Industry leader'} | MBA`,
          `Senior ${profession} | ${interests || 'Digital Transformation'} | Certified Trainer`,
          `${profession} 🎯 | ${interests || 'Innovation & Technology'} | Fortune 500 experience`
        ]
      }
    }
  }

  const platformTemplates = templates[platform as keyof typeof templates] || templates.instagram
  const toneTemplates = (platformTemplates as any)[tone] || (platformTemplates as any).casual
  const langTemplates = toneTemplates[language] || toneTemplates.en

  // Rastgele 3 tane seç
  const shuffled = [...langTemplates].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}