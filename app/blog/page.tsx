'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const texts: Record<string, Record<string, string>> = {
  en: {
    title: 'Blog',
    subtitle: 'Tips, tricks, and strategies to grow your social media presence',
    readMore: 'Read More',
    minRead: 'min read'
  },
  tr: {
    title: 'Blog',
    subtitle: 'Sosyal medya varlığınızı büyütmek için ipuçları, püf noktaları ve stratejiler',
    readMore: 'Devamını Oku',
    minRead: 'dk okuma'
  },
  ru: {
    title: 'Блог',
    subtitle: 'Советы и стратегии для роста в социальных сетях',
    readMore: 'Читать далее',
    minRead: 'мин чтения'
  },
  de: {
    title: 'Blog',
    subtitle: 'Tipps und Strategien für Ihr Social-Media-Wachstum',
    readMore: 'Weiterlesen',
    minRead: 'Min. Lesezeit'
  },
  fr: {
    title: 'Blog',
    subtitle: 'Conseils et stratégies pour développer votre présence sur les réseaux sociaux',
    readMore: 'Lire la suite',
    minRead: 'min de lecture'
  }
}

const blogPosts = [
  {
    slug: 'how-to-go-viral-on-tiktok',
    image: '🚀',
    category: 'TikTok',
    date: '2025-03-20',
    readTime: 5,
    title: {
      en: 'How to Go Viral on TikTok in 2025',
      tr: '2025\'te TikTok\'ta Nasıl Viral Olunur',
      ru: 'Как стать вирусным в TikTok в 2025',
      de: 'Wie man 2025 auf TikTok viral geht',
      fr: 'Comment devenir viral sur TikTok en 2025'
    },
    excerpt: {
      en: 'Learn the secrets behind viral TikTok videos and how to create content that gets millions of views.',
      tr: 'Viral TikTok videolarının arkasındaki sırları ve milyonlarca izlenme alan içerikler oluşturmayı öğrenin.',
      ru: 'Узнайте секреты вирусных видео TikTok и как создавать контент с миллионами просмотров.',
      de: 'Lernen Sie die Geheimnisse viraler TikTok-Videos und wie Sie Inhalte mit Millionen von Aufrufen erstellen.',
      fr: 'Découvrez les secrets des vidéos TikTok virales et comment créer du contenu avec des millions de vues.'
    }
  },
  {
    slug: 'best-hooks-for-reels',
    image: '🎣',
    category: 'Instagram',
    date: '2025-03-18',
    readTime: 4,
    title: {
      en: '10 Powerful Hooks That Stop the Scroll',
      tr: 'Kaydırmayı Durduran 10 Güçlü Hook',
      ru: '10 мощных хуков, которые останавливают прокрутку',
      de: '10 starke Hooks, die das Scrollen stoppen',
      fr: '10 accroches puissantes qui arrêtent le défilement'
    },
    excerpt: {
      en: 'The first 3 seconds decide everything. Here are the hook formulas that work every time.',
      tr: 'İlk 3 saniye her şeyi belirler. İşte her seferinde işe yarayan hook formülleri.',
      ru: 'Первые 3 секунды решают всё. Вот формулы хуков, которые работают каждый раз.',
      de: 'Die ersten 3 Sekunden entscheiden alles. Hier sind Hook-Formeln, die jedes Mal funktionieren.',
      fr: 'Les 3 premières secondes décident de tout. Voici les formules d\'accroche qui fonctionnent à chaque fois.'
    }
  },
  {
    slug: 'content-calendar-strategy',
    image: '📅',
    category: 'Strategy',
    date: '2025-03-15',
    readTime: 6,
    title: {
      en: 'The Perfect Content Calendar for Creators',
      tr: 'İçerik Üreticileri İçin Mükemmel İçerik Takvimi',
      ru: 'Идеальный контент-календарь для создателей',
      de: 'Der perfekte Content-Kalender für Creator',
      fr: 'Le calendrier de contenu parfait pour les créateurs'
    },
    excerpt: {
      en: 'How to plan 30 days of content in just 2 hours. A step-by-step guide to batch content creation.',
      tr: '30 günlük içeriği sadece 2 saatte nasıl planlanır. Toplu içerik oluşturma için adım adım rehber.',
      ru: 'Как спланировать 30 дней контента всего за 2 часа. Пошаговое руководство.',
      de: 'Wie Sie 30 Tage Content in nur 2 Stunden planen. Eine Schritt-für-Schritt-Anleitung.',
      fr: 'Comment planifier 30 jours de contenu en seulement 2 heures. Guide étape par étape.'
    }
  },
  {
    slug: 'hashtag-strategy-2025',
    image: '#️⃣',
    category: 'Growth',
    date: '2025-03-12',
    readTime: 5,
    title: {
      en: 'Hashtag Strategy That Actually Works',
      tr: 'Gerçekten İşe Yarayan Hashtag Stratejisi',
      ru: 'Стратегия хештегов, которая реально работает',
      de: 'Hashtag-Strategie, die wirklich funktioniert',
      fr: 'Stratégie de hashtags qui fonctionne vraiment'
    },
    excerpt: {
      en: 'Forget what you know about hashtags. Here\'s the data-driven approach to hashtag research.',
      tr: 'Hashtag\'ler hakkında bildiklerinizi unutun. İşte veri odaklı hashtag araştırma yaklaşımı.',
      ru: 'Забудьте всё, что вы знали о хештегах. Вот подход, основанный на данных.',
      de: 'Vergessen Sie alles über Hashtags. Hier ist der datengetriebene Ansatz.',
      fr: 'Oubliez ce que vous savez sur les hashtags. Voici l\'approche basée sur les données.'
    }
  },
  {
    slug: 'ai-tools-for-creators',
    image: '🤖',
    category: 'Tools',
    date: '2025-03-10',
    readTime: 7,
    title: {
      en: 'Top AI Tools Every Creator Needs in 2025',
      tr: '2025\'te Her İçerik Üreticisinin İhtiyacı Olan AI Araçları',
      ru: 'Лучшие AI-инструменты для создателей контента в 2025',
      de: 'Top AI-Tools, die jeder Creator 2025 braucht',
      fr: 'Les meilleurs outils IA dont chaque créateur a besoin en 2025'
    },
    excerpt: {
      en: 'From scriptwriting to analytics, these AI tools will 10x your productivity as a content creator.',
      tr: 'Senaryo yazımından analize kadar, bu AI araçları içerik üreticisi olarak verimliliğinizi 10 kat artıracak.',
      ru: 'От написания сценариев до аналитики — эти AI-инструменты увеличат вашу продуктивность в 10 раз.',
      de: 'Von Skripten bis Analytics — diese AI-Tools steigern Ihre Produktivität um das 10-fache.',
      fr: 'De l\'écriture de scripts à l\'analyse, ces outils IA multiplieront votre productivité par 10.'
    }
  },
  {
    slug: 'youtube-shorts-vs-tiktok',
    image: '⚔️',
    category: 'Comparison',
    date: '2025-03-08',
    readTime: 6,
    title: {
      en: 'YouTube Shorts vs TikTok: Which is Better?',
      tr: 'YouTube Shorts vs TikTok: Hangisi Daha İyi?',
      ru: 'YouTube Shorts vs TikTok: Что лучше?',
      de: 'YouTube Shorts vs TikTok: Was ist besser?',
      fr: 'YouTube Shorts vs TikTok: Lequel est meilleur?'
    },
    excerpt: {
      en: 'A detailed comparison of both platforms. Algorithm, monetization, and growth potential analyzed.',
      tr: 'Her iki platformun detaylı karşılaştırması. Algoritma, para kazanma ve büyüme potansiyeli analizi.',
      ru: 'Детальное сравнение обеих платформ. Анализ алгоритма, монетизации и потенциала роста.',
      de: 'Ein detaillierter Vergleich beider Plattformen. Algorithmus, Monetarisierung und Wachstumspotenzial.',
      fr: 'Une comparaison détaillée des deux plateformes. Algorithme, monétisation et potentiel de croissance.'
    }
  }
]

export default function BlogPage() {
  const { language } = useLanguage()
  const t = texts[language] || texts.en

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg">MediaToolKit</span>
          </Link>
          <Link href="/dashboard" className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition">
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 hover:bg-white/[0.04] transition"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <span className="text-6xl">{post.image}</span>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {post.readTime} {t.minRead}
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition">
                    {post.title[language as keyof typeof post.title] || post.title.en}
                  </h2>
                  
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt[language as keyof typeof post.excerpt] || post.excerpt.en}
                  </p>
                  
                  <span className="text-purple-400 text-sm font-medium group-hover:underline">
                    {t.readMore} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          © 2025 MediaToolKit. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
