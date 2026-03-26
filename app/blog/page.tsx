'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import Footer from '@/components/Footer'

const headerTexts: Record<string, Record<string, string>> = {
  en: { home: 'Home', dashboard: 'Dashboard' },
  tr: { home: 'Ana Sayfa', dashboard: 'Dashboard' },
  ru: { home: 'Главная', dashboard: 'Панель' },
  de: { home: 'Startseite', dashboard: 'Dashboard' },
  fr: { home: 'Accueil', dashboard: 'Tableau de bord' }
}

const content: Record<string, any> = {
  en: {
    title: 'Blog',
    subtitle: 'Tips, tricks, and insights for content creators',
    readMore: 'Read More',
    minRead: 'min read',
    categories: ['All', 'Tips & Tricks', 'Trends', 'Case Studies', 'Product Updates']
  },
  tr: {
    title: 'Blog',
    subtitle: 'İçerik üreticileri için ipuçları, püf noktaları ve içgörüler',
    readMore: 'Devamını Oku',
    minRead: 'dk okuma',
    categories: ['Tümü', 'İpuçları', 'Trendler', 'Başarı Hikayeleri', 'Ürün Güncellemeleri']
  },
  ru: {
    title: 'Блог',
    subtitle: 'Советы и идеи для создателей контента',
    readMore: 'Читать далее',
    minRead: 'мин чтения',
    categories: ['Все', 'Советы', 'Тренды', 'Кейсы', 'Обновления']
  },
  de: {
    title: 'Blog',
    subtitle: 'Tipps und Einblicke für Content-Ersteller',
    readMore: 'Weiterlesen',
    minRead: 'Min. Lesezeit',
    categories: ['Alle', 'Tipps', 'Trends', 'Fallstudien', 'Updates']
  },
  fr: {
    title: 'Blog',
    subtitle: 'Conseils et astuces pour les créateurs de contenu',
    readMore: 'Lire la suite',
    minRead: 'min de lecture',
    categories: ['Tout', 'Conseils', 'Tendances', 'Études de cas', 'Mises à jour']
  }
}

const posts = [
  {
    slug: '10-viral-hook-formulas',
    image: '🎣',
    category: 'Tips & Tricks',
    date: '2026-01-15',
    readTime: 5,
    title: {
      en: '10 Viral Hook Formulas That Actually Work',
      tr: 'Gerçekten İşe Yarayan 10 Viral Hook Formülü',
      ru: '10 формул вирусных хуков, которые работают',
      de: '10 virale Hook-Formeln, die funktionieren',
      fr: '10 formules de hooks viraux qui marchent'
    },
    excerpt: {
      en: 'Discover the secret formulas top creators use to grab attention in the first 3 seconds.',
      tr: 'En iyi içerik üreticilerinin ilk 3 saniyede dikkat çekmek için kullandığı gizli formülleri keşfedin.',
      ru: 'Узнайте секретные формулы, которые используют топ-создатели для привлечения внимания.',
      de: 'Entdecken Sie die geheimen Formeln, die Top-Creator verwenden.',
      fr: 'Découvrez les formules secrètes utilisées par les meilleurs créateurs.'
    }
  },
  {
    slug: 'tiktok-algorithm-2026',
    image: '📱',
    category: 'Trends',
    date: '2026-01-10',
    readTime: 8,
    title: {
      en: 'TikTok Algorithm 2026: What You Need to Know',
      tr: 'TikTok Algoritması 2026: Bilmeniz Gerekenler',
      ru: 'Алгоритм TikTok 2026: что нужно знать',
      de: 'TikTok-Algorithmus 2026: Was Sie wissen müssen',
      fr: 'Algorithme TikTok 2026: Ce que vous devez savoir'
    },
    excerpt: {
      en: 'Everything changed this year. Here\'s your complete guide to the new TikTok algorithm.',
      tr: 'Bu yıl her şey değişti. İşte yeni TikTok algoritmasına dair kapsamlı rehberiniz.',
      ru: 'В этом году всё изменилось. Полное руководство по новому алгоритму TikTok.',
      de: 'Dieses Jahr hat sich alles geändert. Ihr Leitfaden zum neuen Algorithmus.',
      fr: 'Tout a changé cette année. Votre guide complet du nouvel algorithme.'
    }
  },
  {
    slug: 'ai-content-creation-guide',
    image: '🤖',
    category: 'Tips & Tricks',
    date: '2026-01-05',
    readTime: 6,
    title: {
      en: 'The Complete Guide to AI Content Creation',
      tr: 'AI İçerik Oluşturma Rehberi',
      ru: 'Полное руководство по созданию контента с ИИ',
      de: 'Der komplette Leitfaden zur KI-Inhaltserstellung',
      fr: 'Le guide complet de la création de contenu IA'
    },
    excerpt: {
      en: 'Learn how to use AI tools effectively without losing your authentic voice.',
      tr: 'Otantik sesinizi kaybetmeden AI araçlarını etkili bir şekilde nasıl kullanacağınızı öğrenin.',
      ru: 'Узнайте, как эффективно использовать инструменты ИИ, сохраняя свой стиль.',
      de: 'Erfahren Sie, wie Sie KI-Tools effektiv nutzen können.',
      fr: 'Apprenez à utiliser les outils IA efficacement.'
    }
  },
  {
    slug: 'instagram-reels-vs-tiktok',
    image: '⚔️',
    category: 'Trends',
    date: '2025-12-28',
    readTime: 7,
    title: {
      en: 'Instagram Reels vs TikTok: Where Should You Post?',
      tr: 'Instagram Reels vs TikTok: Nerede Paylaşmalısınız?',
      ru: 'Instagram Reels vs TikTok: Где публиковать?',
      de: 'Instagram Reels vs TikTok: Wo sollten Sie posten?',
      fr: 'Instagram Reels vs TikTok: Où publier?'
    },
    excerpt: {
      en: 'A data-driven comparison to help you decide where to focus your energy.',
      tr: 'Enerjinizi nereye odaklayacağınıza karar vermenize yardımcı olacak veri odaklı bir karşılaştırma.',
      ru: 'Сравнение на основе данных, чтобы помочь вам решить, где сосредоточить усилия.',
      de: 'Ein datengestützter Vergleich zur Entscheidungshilfe.',
      fr: 'Une comparaison basée sur les données pour vous aider à décider.'
    }
  },
  {
    slug: 'how-sarah-grew-100k',
    image: '📈',
    category: 'Case Studies',
    date: '2025-12-20',
    readTime: 10,
    title: {
      en: 'How Sarah Grew from 1K to 100K in 3 Months',
      tr: 'Sarah 3 Ayda 1K\'dan 100K\'ya Nasıl Büyüdü',
      ru: 'Как Сара выросла с 1K до 100K за 3 месяца',
      de: 'Wie Sarah in 3 Monaten von 1K auf 100K wuchs',
      fr: 'Comment Sarah est passée de 1K à 100K en 3 mois'
    },
    excerpt: {
      en: 'A real case study of a creator who used MediaToolkit to 100x her following.',
      tr: 'MediaToolkit kullanarak takipçi sayısını 100 kat artıran bir içerik üreticisinin gerçek hikayesi.',
      ru: 'Реальный кейс создателя, который использовал MediaToolkit для роста в 100 раз.',
      de: 'Eine echte Fallstudie einer Creatorin, die ihre Follower ver-100-facht hat.',
      fr: 'Une étude de cas réelle d\'une créatrice qui a multiplié ses abonnés par 100.'
    }
  },
  {
    slug: 'best-posting-times-2026',
    image: '⏰',
    category: 'Tips & Tricks',
    date: '2025-12-15',
    readTime: 4,
    title: {
      en: 'Best Posting Times for Every Platform in 2026',
      tr: '2026\'da Her Platform İçin En İyi Paylaşım Zamanları',
      ru: 'Лучшее время для публикации на каждой платформе в 2026',
      de: 'Beste Posting-Zeiten für jede Plattform 2026',
      fr: 'Meilleurs moments pour publier sur chaque plateforme en 2026'
    },
    excerpt: {
      en: 'We analyzed millions of posts to find the optimal posting times for maximum engagement.',
      tr: 'Maksimum etkileşim için optimal paylaşım zamanlarını bulmak için milyonlarca gönderiyi analiz ettik.',
      ru: 'Мы проанализировали миллионы постов, чтобы найти оптимальное время.',
      de: 'Wir haben Millionen von Posts analysiert, um optimale Zeiten zu finden.',
      fr: 'Nous avons analysé des millions de posts pour trouver les heures optimales.'
    }
  }
]

export default function BlogPage() {
  const { language, setLanguage } = useLanguage()
  const t = content[language] || content.en
  const h = headerTexts[language] || headerTexts.en

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" scroll={false} className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg sm:text-xl font-bold">M</div>
            <span className="text-lg sm:text-xl font-bold hidden sm:block">MediaToolkit</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" scroll={false} className="text-gray-400 hover:text-white transition text-sm">{h.home}</Link>
            <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium hover:opacity-90 transition">{h.dashboard}</Link>
            <div className="relative group">
              <button className="px-2 py-1.5 text-sm text-gray-400 hover:text-white transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-[#1a1a2e] border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t.title}</h1>
            <p className="text-gray-400 text-lg">{t.subtitle}</p>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {t.categories.map((cat: string, i: number) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  i === 0 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Link 
                key={i}
                href={`/blog/${post.slug}`}
                className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-purple-500/30 transition-all"
              >
                <div className="text-5xl mb-4">{post.image}</div>
                
                <div className="flex items-center gap-3 mb-3 text-sm">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg">{post.category}</span>
                  <span className="text-gray-500">{post.readTime} {t.minRead}</span>
                </div>
                
                <h2 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition">
                  {post.title[language] || post.title.en}
                </h2>
                
                <p className="text-gray-500 text-sm mb-4">
                  {post.excerpt[language] || post.excerpt.en}
                </p>
                
                <span className="text-purple-400 text-sm group-hover:text-purple-300 transition">
                  {t.readMore} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
