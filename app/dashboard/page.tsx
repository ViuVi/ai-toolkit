'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

// Tool verileri - çok dilli
const getTools = (lang: string) => {
  const toolsData: any = {
    tr: [
      { id: 'viral-analyzer', name: 'Viral Analyzer', description: 'İçeriğinin viral potansiyelini analiz et, 0-100 skor al', icon: '🔥', credits: 5, category: 'analysis', badge: 'Popüler' },
      { id: 'content-repurposer', name: 'Content Repurposer', description: '1 içeriği 7 farklı platforma otomatik uyarla', icon: '🔄', credits: 8, category: 'content', badge: 'Güçlü' },
      { id: 'hashtag-research', name: 'Hashtag Research', description: 'Hacim, rekabet ve trend analizi ile hashtag bul', icon: '#️⃣', credits: 3, category: 'research' },
      { id: 'posting-optimizer', name: 'Smart Posting Times', description: 'Nişine özel en iyi paylaşım zamanlarını öğren', icon: '⏰', credits: 2, category: 'optimization' },
      { id: 'content-planner', name: 'Content Calendar', description: '30 günlük içerik planı oluştur', icon: '📅', credits: 10, category: 'planning', badge: 'Pro' },
      { id: 'competitor-spy', name: 'Competitor Spy', description: 'Rakiplerinin stratejilerini analiz et', icon: '🕵️', credits: 8, category: 'analysis' },
      { id: 'trend-radar', name: 'Trend Radar', description: 'Nişindeki trend konuları keşfet', icon: '📡', credits: 5, category: 'research' },
      { id: 'ab-tester', name: 'A/B Caption Tester', description: 'İki caption\'ı karşılaştır, kazananı bul', icon: '⚖️', credits: 5, category: 'optimization' },
      { id: 'script-studio', name: 'Script Studio', description: 'Viral video scriptleri oluştur', icon: '🎬', credits: 6, category: 'content' },
      { id: 'thread-composer', name: 'Thread Composer', description: 'Viral Twitter/X threadleri yaz', icon: '🧵', credits: 5, category: 'content' },
      { id: 'carousel-planner', name: 'Carousel Planner', description: 'Swipe-worthy carousel içerikleri planla', icon: '📱', credits: 4, category: 'planning' },
      { id: 'engagement-booster', name: 'Engagement Booster', description: 'Yorumları artıracak CTA\'lar ve sorular üret', icon: '💬', credits: 5, category: 'optimization' },
    ],
    en: [
      { id: 'viral-analyzer', name: 'Viral Analyzer', description: 'Analyze your content\'s viral potential, get 0-100 score', icon: '🔥', credits: 5, category: 'analysis', badge: 'Popular' },
      { id: 'content-repurposer', name: 'Content Repurposer', description: 'Automatically adapt 1 content to 7 different platforms', icon: '🔄', credits: 8, category: 'content', badge: 'Powerful' },
      { id: 'hashtag-research', name: 'Hashtag Research', description: 'Find hashtags with volume, competition & trend analysis', icon: '#️⃣', credits: 3, category: 'research' },
      { id: 'posting-optimizer', name: 'Smart Posting Times', description: 'Learn the best posting times for your niche', icon: '⏰', credits: 2, category: 'optimization' },
      { id: 'content-planner', name: 'Content Calendar', description: 'Create a 30-day content plan', icon: '📅', credits: 10, category: 'planning', badge: 'Pro' },
      { id: 'competitor-spy', name: 'Competitor Spy', description: 'Analyze your competitors\' strategies', icon: '🕵️', credits: 8, category: 'analysis' },
      { id: 'trend-radar', name: 'Trend Radar', description: 'Discover trending topics in your niche', icon: '📡', credits: 5, category: 'research' },
      { id: 'ab-tester', name: 'A/B Caption Tester', description: 'Compare two captions, find the winner', icon: '⚖️', credits: 5, category: 'optimization' },
      { id: 'script-studio', name: 'Script Studio', description: 'Create viral video scripts', icon: '🎬', credits: 6, category: 'content' },
      { id: 'thread-composer', name: 'Thread Composer', description: 'Write viral Twitter/X threads', icon: '🧵', credits: 5, category: 'content' },
      { id: 'carousel-planner', name: 'Carousel Planner', description: 'Plan swipe-worthy carousel content', icon: '📱', credits: 4, category: 'planning' },
      { id: 'engagement-booster', name: 'Engagement Booster', description: 'Generate CTAs and questions to boost comments', icon: '💬', credits: 5, category: 'optimization' },
    ],
    ru: [
      { id: 'viral-analyzer', name: 'Viral Analyzer', description: 'Анализируйте вирусный потенциал контента, получите оценку 0-100', icon: '🔥', credits: 5, category: 'analysis', badge: 'Популярный' },
      { id: 'content-repurposer', name: 'Content Repurposer', description: 'Автоматически адаптируйте 1 контент для 7 платформ', icon: '🔄', credits: 8, category: 'content', badge: 'Мощный' },
      { id: 'hashtag-research', name: 'Hashtag Research', description: 'Найдите хештеги с анализом объема и трендов', icon: '#️⃣', credits: 3, category: 'research' },
      { id: 'posting-optimizer', name: 'Smart Posting Times', description: 'Узнайте лучшее время публикации для вашей ниши', icon: '⏰', credits: 2, category: 'optimization' },
      { id: 'content-planner', name: 'Content Calendar', description: 'Создайте 30-дневный контент-план', icon: '📅', credits: 10, category: 'planning', badge: 'Pro' },
      { id: 'competitor-spy', name: 'Competitor Spy', description: 'Анализируйте стратегии конкурентов', icon: '🕵️', credits: 8, category: 'analysis' },
      { id: 'trend-radar', name: 'Trend Radar', description: 'Откройте трендовые темы в вашей нише', icon: '📡', credits: 5, category: 'research' },
      { id: 'ab-tester', name: 'A/B Caption Tester', description: 'Сравните две подписи, найдите победителя', icon: '⚖️', credits: 5, category: 'optimization' },
      { id: 'script-studio', name: 'Script Studio', description: 'Создавайте вирусные видео-сценарии', icon: '🎬', credits: 6, category: 'content' },
      { id: 'thread-composer', name: 'Thread Composer', description: 'Пишите вирусные треды Twitter/X', icon: '🧵', credits: 5, category: 'content' },
      { id: 'carousel-planner', name: 'Carousel Planner', description: 'Планируйте карусельный контент', icon: '📱', credits: 4, category: 'planning' },
      { id: 'engagement-booster', name: 'Engagement Booster', description: 'Генерируйте CTA для увеличения комментариев', icon: '💬', credits: 5, category: 'optimization' },
    ],
    de: [
      { id: 'viral-analyzer', name: 'Viral Analyzer', description: 'Analysiere das virale Potenzial deines Inhalts, erhalte 0-100 Score', icon: '🔥', credits: 5, category: 'analysis', badge: 'Beliebt' },
      { id: 'content-repurposer', name: 'Content Repurposer', description: 'Passe 1 Inhalt automatisch für 7 Plattformen an', icon: '🔄', credits: 8, category: 'content', badge: 'Stark' },
      { id: 'hashtag-research', name: 'Hashtag Research', description: 'Finde Hashtags mit Volumen- und Trendanalyse', icon: '#️⃣', credits: 3, category: 'research' },
      { id: 'posting-optimizer', name: 'Smart Posting Times', description: 'Lerne die besten Posting-Zeiten für deine Nische', icon: '⏰', credits: 2, category: 'optimization' },
      { id: 'content-planner', name: 'Content Calendar', description: 'Erstelle einen 30-Tage Content-Plan', icon: '📅', credits: 10, category: 'planning', badge: 'Pro' },
      { id: 'competitor-spy', name: 'Competitor Spy', description: 'Analysiere die Strategien deiner Konkurrenten', icon: '🕵️', credits: 8, category: 'analysis' },
      { id: 'trend-radar', name: 'Trend Radar', description: 'Entdecke Trendthemen in deiner Nische', icon: '📡', credits: 5, category: 'research' },
      { id: 'ab-tester', name: 'A/B Caption Tester', description: 'Vergleiche zwei Captions, finde den Gewinner', icon: '⚖️', credits: 5, category: 'optimization' },
      { id: 'script-studio', name: 'Script Studio', description: 'Erstelle virale Video-Skripte', icon: '🎬', credits: 6, category: 'content' },
      { id: 'thread-composer', name: 'Thread Composer', description: 'Schreibe virale Twitter/X Threads', icon: '🧵', credits: 5, category: 'content' },
      { id: 'carousel-planner', name: 'Carousel Planner', description: 'Plane Swipe-würdige Carousel-Inhalte', icon: '📱', credits: 4, category: 'planning' },
      { id: 'engagement-booster', name: 'Engagement Booster', description: 'Generiere CTAs und Fragen für mehr Kommentare', icon: '💬', credits: 5, category: 'optimization' },
    ],
    fr: [
      { id: 'viral-analyzer', name: 'Viral Analyzer', description: 'Analysez le potentiel viral de votre contenu, obtenez un score 0-100', icon: '🔥', credits: 5, category: 'analysis', badge: 'Populaire' },
      { id: 'content-repurposer', name: 'Content Repurposer', description: 'Adaptez automatiquement 1 contenu pour 7 plateformes', icon: '🔄', credits: 8, category: 'content', badge: 'Puissant' },
      { id: 'hashtag-research', name: 'Hashtag Research', description: 'Trouvez des hashtags avec analyse de volume et tendances', icon: '#️⃣', credits: 3, category: 'research' },
      { id: 'posting-optimizer', name: 'Smart Posting Times', description: 'Apprenez les meilleurs moments de publication', icon: '⏰', credits: 2, category: 'optimization' },
      { id: 'content-planner', name: 'Content Calendar', description: 'Créez un plan de contenu de 30 jours', icon: '📅', credits: 10, category: 'planning', badge: 'Pro' },
      { id: 'competitor-spy', name: 'Competitor Spy', description: 'Analysez les stratégies de vos concurrents', icon: '🕵️', credits: 8, category: 'analysis' },
      { id: 'trend-radar', name: 'Trend Radar', description: 'Découvrez les sujets tendance dans votre niche', icon: '📡', credits: 5, category: 'research' },
      { id: 'ab-tester', name: 'A/B Caption Tester', description: 'Comparez deux légendes, trouvez le gagnant', icon: '⚖️', credits: 5, category: 'optimization' },
      { id: 'script-studio', name: 'Script Studio', description: 'Créez des scripts vidéo viraux', icon: '🎬', credits: 6, category: 'content' },
      { id: 'thread-composer', name: 'Thread Composer', description: 'Écrivez des threads Twitter/X viraux', icon: '🧵', credits: 5, category: 'content' },
      { id: 'carousel-planner', name: 'Carousel Planner', description: 'Planifiez du contenu carrousel attrayant', icon: '📱', credits: 4, category: 'planning' },
      { id: 'engagement-booster', name: 'Engagement Booster', description: 'Générez des CTAs pour augmenter les commentaires', icon: '💬', credits: 5, category: 'optimization' },
    ],
  }
  return toolsData[lang] || toolsData.en
}

const getCategories = (lang: string) => {
  const cats: any = {
    tr: { all: 'Tümü', content: 'İçerik', analysis: 'Analiz', research: 'Araştırma', optimization: 'Optimizasyon', planning: 'Planlama' },
    en: { all: 'All', content: 'Content', analysis: 'Analysis', research: 'Research', optimization: 'Optimization', planning: 'Planning' },
    ru: { all: 'Все', content: 'Контент', analysis: 'Анализ', research: 'Исследование', optimization: 'Оптимизация', planning: 'Планирование' },
    de: { all: 'Alle', content: 'Inhalt', analysis: 'Analyse', research: 'Forschung', optimization: 'Optimierung', planning: 'Planung' },
    fr: { all: 'Tout', content: 'Contenu', analysis: 'Analyse', research: 'Recherche', optimization: 'Optimisation', planning: 'Planification' },
  }
  return cats[lang] || cats.en
}

const getTexts = (lang: string) => {
  const texts: any = {
    tr: { 
      welcome: 'Hoş Geldin', 
      credits: 'Kredi', 
      testMode: '🧪 Test Modu Aktif - Krediler düşmüyor',
      logout: 'Çıkış',
      upgrade: 'Pro\'ya Yükselt',
      unlimitedAccess: 'Sınırsız erişim için Pro\'ya geçin'
    },
    en: { 
      welcome: 'Welcome', 
      credits: 'Credits', 
      testMode: '🧪 Test Mode Active - Credits not deducted',
      logout: 'Logout',
      upgrade: 'Upgrade to Pro',
      unlimitedAccess: 'Upgrade to Pro for unlimited access'
    },
    ru: { 
      welcome: 'Добро пожаловать', 
      credits: 'Кредиты', 
      testMode: '🧪 Тестовый режим - Кредиты не списываются',
      logout: 'Выход',
      upgrade: 'Перейти на Pro',
      unlimitedAccess: 'Перейдите на Pro для неограниченного доступа'
    },
    de: { 
      welcome: 'Willkommen', 
      credits: 'Credits', 
      testMode: '🧪 Testmodus Aktiv - Credits werden nicht abgezogen',
      logout: 'Abmelden',
      upgrade: 'Auf Pro upgraden',
      unlimitedAccess: 'Upgraden Sie auf Pro für unbegrenzten Zugang'
    },
    fr: { 
      welcome: 'Bienvenue', 
      credits: 'Crédits', 
      testMode: '🧪 Mode Test Actif - Crédits non déduits',
      logout: 'Déconnexion',
      upgrade: 'Passer à Pro',
      unlimitedAccess: 'Passez à Pro pour un accès illimité'
    },
  }
  return texts[lang] || texts.en
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(50)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  const tools = getTools(language)
  const categories = getCategories(language)
  const texts = getTexts(language)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    
    // Kredileri al
    const { data } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single()
    
    if (data) setCredits(data.balance)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter((t: any) => t.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header - Ana sayfa ile aynı */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Media
                </span>
                <span className="text-xl font-bold text-white">
                  Tool Kit
                </span>
              </div>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Credits */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <span className="text-yellow-400">⚡</span>
                <span className="text-white font-semibold">{credits}</span>
                <span className="text-gray-400 text-sm">{texts.credits}</span>
              </div>

              {/* Language Switcher */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/80 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 transition border border-gray-700">
                  <span>🌐</span>
                  <span>{language.toUpperCase()}</span>
                </button>
                <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {['en', 'tr', 'ru', 'de', 'fr'].map((lang) => (
                    <button 
                      key={lang}
                      onClick={() => setLanguage(lang as any)} 
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ${language === lang ? 'text-purple-400' : 'text-gray-300'} ${lang === 'en' ? 'rounded-t-lg' : ''} ${lang === 'fr' ? 'rounded-b-lg' : ''}`}
                    >
                      {lang === 'en' && '🇺🇸 English'}
                      {lang === 'tr' && '🇹🇷 Türkçe'}
                      {lang === 'ru' && '🇷🇺 Русский'}
                      {lang === 'de' && '🇩🇪 Deutsch'}
                      {lang === 'fr' && '🇫🇷 Français'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                {texts.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome & Test Mode Banner */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {texts.welcome}, {user?.email?.split('@')[0]} 👋
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm">
              {texts.testMode}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {label as string}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool: any) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="group relative bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-purple-500/10"
              >
                {/* Badge */}
                {tool.badge && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-medium">
                    {tool.badge}
                  </span>
                )}

                {/* Icon */}
                <div className="text-4xl mb-4">{tool.icon}</div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition">
                  {tool.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {tool.description}
                </p>

                {/* Credits */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-400">⚡</span>
                  <span className="text-gray-300">{tool.credits} {texts.credits}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pro Banner */}
          <div className="mt-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">{texts.upgrade}</h2>
            <p className="text-gray-400 mb-4">{texts.unlimitedAccess}</p>
            <Link
              href="/pricing"
              className="inline-flex px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {texts.upgrade} →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
