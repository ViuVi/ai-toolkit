'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const texts: Record<string, Record<string, string>> = {
  en: {
    backToBlog: '← Back to Blog',
    shareArticle: 'Share this article',
    relatedTools: 'Try Related Tools',
    minRead: 'min read'
  },
  tr: {
    backToBlog: '← Blog\'a Dön',
    shareArticle: 'Bu makaleyi paylaş',
    relatedTools: 'İlgili Araçları Dene',
    minRead: 'dk okuma'
  },
  ru: {
    backToBlog: '← Вернуться в блог',
    shareArticle: 'Поделиться статьёй',
    relatedTools: 'Попробуйте инструменты',
    minRead: 'мин чтения'
  },
  de: {
    backToBlog: '← Zurück zum Blog',
    shareArticle: 'Artikel teilen',
    relatedTools: 'Verwandte Tools',
    minRead: 'Min. Lesezeit'
  },
  fr: {
    backToBlog: '← Retour au blog',
    shareArticle: 'Partager cet article',
    relatedTools: 'Outils associés',
    minRead: 'min de lecture'
  }
}

const blogContent: Record<string, any> = {
  'how-to-go-viral-on-tiktok': {
    image: '🚀',
    category: 'TikTok',
    date: '2025-03-20',
    readTime: 5,
    relatedTools: ['hook-generator', 'viral-analyzer', 'trend-radar'],
    title: {
      en: 'How to Go Viral on TikTok in 2025',
      tr: '2025\'te TikTok\'ta Nasıl Viral Olunur',
      ru: 'Как стать вирусным в TikTok в 2025',
      de: 'Wie man 2025 auf TikTok viral geht',
      fr: 'Comment devenir viral sur TikTok en 2025'
    },
    content: {
      en: `
## The Secret to Going Viral

Going viral on TikTok isn't about luck—it's about understanding the algorithm and creating content that resonates with your audience.

### 1. Hook Your Audience in 0.5 Seconds

The first half-second of your video determines whether someone scrolls past or stays to watch. Start with movement, a surprising statement, or a visual that demands attention.

**Examples of powerful hooks:**
- "Nobody talks about this, but..."
- "I tested this for 30 days and..."
- "Stop scrolling if you want to..."

### 2. Leverage Trending Sounds

TikTok's algorithm favors videos using trending sounds. But here's the trick: don't just use the sound—make it relevant to your niche.

### 3. Post at Peak Times

Based on our analysis of millions of videos:
- **Best times:** 7-9 AM, 12-3 PM, 7-9 PM
- **Best days:** Tuesday, Thursday, Friday

### 4. Create a Content Loop

End your video in a way that makes people want to watch it again. This increases your watch time and signals to the algorithm that your content is engaging.

### 5. Use Our AI Tools

MediaToolKit can help you:
- Generate viral hooks with our **Hook Generator**
- Analyze trending content with **Viral Analyzer**
- Find trending topics with **Trend Radar**

Start creating viral content today! 🚀
      `,
      tr: `
## Viral Olmanın Sırrı

TikTok'ta viral olmak şans değil—algoritmayı anlamak ve izleyicilerinizle rezonans kuran içerik oluşturmakla ilgili.

### 1. İzleyiciyi 0.5 Saniyede Yakala

Videonuzun ilk yarım saniyesi, birinin kaydırıp geçeceğini veya izlemeye kalacağını belirler. Hareketle, şaşırtıcı bir ifadeyle veya dikkat çeken bir görselle başlayın.

**Güçlü hook örnekleri:**
- "Kimse bundan bahsetmiyor ama..."
- "Bunu 30 gün test ettim ve..."
- "Eğer istiyorsan kaydırmayı durdur..."

### 2. Trend Sesleri Kullan

TikTok algoritması trend sesleri kullanan videoları tercih eder. Ama işin püf noktası: sesi sadece kullanmayın—nişinizle alakalı hale getirin.

### 3. En Yoğun Saatlerde Paylaş

Milyonlarca videonun analizine göre:
- **En iyi saatler:** 7-9, 12-15, 19-21
- **En iyi günler:** Salı, Perşembe, Cuma

### 4. İçerik Döngüsü Oluştur

Videonuzu insanların tekrar izlemek isteyeceği şekilde bitirin. Bu, izlenme sürenizi artırır ve algoritmaya içeriğinizin ilgi çekici olduğunu gösterir.

### 5. AI Araçlarımızı Kullan

MediaToolKit size yardımcı olabilir:
- **Hook Generator** ile viral hooklar oluşturun
- **Viral Analyzer** ile trend içerikleri analiz edin
- **Trend Radar** ile trend konuları bulun

Bugün viral içerik oluşturmaya başlayın! 🚀
      `
    }
  },
  'best-hooks-for-reels': {
    image: '🎣',
    category: 'Instagram',
    date: '2025-03-18',
    readTime: 4,
    relatedTools: ['hook-generator', 'caption-generator'],
    title: {
      en: '10 Powerful Hooks That Stop the Scroll',
      tr: 'Kaydırmayı Durduran 10 Güçlü Hook',
      ru: '10 мощных хуков, которые останавливают прокрутку',
      de: '10 starke Hooks, die das Scrollen stoppen',
      fr: '10 accroches puissantes qui arrêtent le défilement'
    },
    content: {
      en: `
## The Power of a Great Hook

The first 3 seconds of your Reel determine its success. Here are 10 proven hook formulas that work every time.

### 1. The Controversial Statement
"Unpopular opinion: You're wasting time on hashtags"

### 2. The Curiosity Gap
"I found something that changed everything..."

### 3. The Direct Address
"If you're struggling with content, watch this"

### 4. The Number Promise
"3 things I wish I knew before starting"

### 5. The Challenge
"Try this and thank me later"

### 6. The Story Hook
"This one mistake cost me 10k followers"

### 7. The Question
"Want to know how I got 1M views?"

### 8. The Warning
"Stop doing this immediately"

### 9. The Secret
"Nobody's talking about this strategy"

### 10. The Result
"This took me from 0 to 100k in 30 days"

## How to Use These Hooks

Don't just copy them—adapt them to your niche and authentic voice. Use our **Hook Generator** to create custom hooks for your content!
      `,
      tr: `
## Harika Bir Hook'un Gücü

Reels'inizin ilk 3 saniyesi başarısını belirler. İşte her seferinde işe yarayan 10 kanıtlanmış hook formülü.

### 1. Tartışmalı İfade
"Popüler olmayan görüş: Hashtag'lerde zaman kaybediyorsunuz"

### 2. Merak Boşluğu
"Her şeyi değiştiren bir şey buldum..."

### 3. Doğrudan Hitap
"İçerikle mücadele ediyorsanız, bunu izleyin"

### 4. Sayı Vaadi
"Başlamadan önce keşke bilseydim dediğim 3 şey"

### 5. Meydan Okuma
"Bunu deneyin ve sonra teşekkür edin"

### 6. Hikaye Hook'u
"Bu tek hata bana 10k takipçiye mal oldu"

### 7. Soru
"1M görüntülemeyi nasıl aldığımı bilmek ister misiniz?"

### 8. Uyarı
"Bunu hemen yapmayı bırakın"

### 9. Sır
"Kimse bu stratejiden bahsetmiyor"

### 10. Sonuç
"Bu beni 30 günde 0'dan 100k'ya taşıdı"

## Bu Hook'ları Nasıl Kullanmalı

Sadece kopyalamayın—nişinize ve özgün sesinize uyarlayın. İçeriğiniz için özel hooklar oluşturmak için **Hook Generator**'ı kullanın!
      `
    }
  }
}

// Default content for other posts
const defaultContent = {
  en: `
## Coming Soon

This article is being written. Check back soon for the full content!

In the meantime, explore our AI tools to supercharge your content creation.
  `,
  tr: `
## Yakında

Bu makale yazılıyor. Tam içerik için yakında tekrar kontrol edin!

Bu arada, içerik oluşturmanızı güçlendirmek için AI araçlarımızı keşfedin.
  `
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { language } = useLanguage()
  const t = texts[language] || texts.en
  
  const post = blogContent[slug]
  
  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-400 mb-6">Post not found</p>
          <Link href="/blog" className="text-purple-400 hover:underline">{t.backToBlog}</Link>
        </div>
      </div>
    )
  }

  const content = post.content[language] || post.content.en || defaultContent[language as keyof typeof defaultContent] || defaultContent.en

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg">MediaToolKit</span>
          </Link>
          <Link href="/blog" className="text-gray-400 hover:text-white transition text-sm">
            {t.backToBlog}
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Meta */}
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">
            {post.category}
          </span>
          <span className="text-gray-500 text-sm">{post.date}</span>
          <span className="text-gray-500 text-sm">{post.readTime} {t.minRead}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          {post.title[language as keyof typeof post.title] || post.title.en}
        </h1>

        {/* Hero Image */}
        <div className="h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-10">
          <span className="text-8xl">{post.image}</span>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-purple max-w-none">
          <div 
            className="text-gray-300 leading-relaxed space-y-4"
            style={{ whiteSpace: 'pre-line' }}
          >
            {content.split('\n').map((line: string, i: number) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{line.replace('## ', '')}</h2>
              } else if (line.startsWith('### ')) {
                return <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-3">{line.replace('### ', '')}</h3>
              } else if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold text-white">{line.replace(/\*\*/g, '')}</p>
              } else if (line.startsWith('- ')) {
                return <li key={i} className="ml-4 text-gray-300">{line.replace('- ', '')}</li>
              } else if (line.trim()) {
                return <p key={i} className="text-gray-300">{line}</p>
              }
              return null
            })}
          </div>
        </div>

        {/* Related Tools */}
        {post.relatedTools && (
          <div className="mt-12 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">{t.relatedTools}</h3>
            <div className="flex flex-wrap gap-3">
              {post.relatedTools.map((tool: string) => (
                <Link
                  key={tool}
                  href={`/tools/${tool}`}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition"
                >
                  {tool.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-8 flex items-center gap-4">
          <span className="text-gray-400 text-sm">{t.shareArticle}:</span>
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title.en)}&url=${encodeURIComponent(`https://mediatoolkit.site/blog/${slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
          >
            𝕏
          </a>
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://mediatoolkit.site/blog/${slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
          >
            in
          </a>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          © 2025 MediaToolKit. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
