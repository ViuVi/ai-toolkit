'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const languageNames: Record<string, string> = {
  en: '🇺🇸 English',
  tr: '🇹🇷 Türkçe',
  ru: '🇷🇺 Русский',
  de: '🇩🇪 Deutsch',
  fr: '🇫🇷 Français'
}

// Çeviriler
const texts: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    credits: 'Credits',
    tools: 'AI Tools',
    logout: 'Logout',
    watchAd: 'Watch Ad',
    watchAdDesc: 'Watch a short ad to earn credits',
    watching: 'Watching Ad...',
    remaining: 'seconds remaining',
    complete: '+10 Credits Added!',
    cancel: 'Cancel'
  },
  tr: {
    welcome: 'Hoş Geldin',
    credits: 'Kredi',
    tools: 'AI Araçları',
    logout: 'Çıkış',
    watchAd: 'Reklam İzle',
    watchAdDesc: 'Kredi kazanmak için reklam izle',
    watching: 'Reklam İzleniyor...',
    remaining: 'saniye kaldı',
    complete: '+10 Kredi Eklendi!',
    cancel: 'İptal'
  },
  ru: {
    welcome: 'Добро пожаловать',
    credits: 'Кредиты',
    tools: 'AI Инструменты',
    logout: 'Выход',
    watchAd: 'Смотреть рекламу',
    watchAdDesc: 'Смотрите рекламу для кредитов',
    watching: 'Просмотр рекламы...',
    remaining: 'секунд осталось',
    complete: '+10 Кредитов!',
    cancel: 'Отмена'
  },
  de: {
    welcome: 'Willkommen',
    credits: 'Credits',
    tools: 'AI Tools',
    logout: 'Abmelden',
    watchAd: 'Werbung ansehen',
    watchAdDesc: 'Werbung ansehen für Credits',
    watching: 'Werbung läuft...',
    remaining: 'Sekunden übrig',
    complete: '+10 Credits!',
    cancel: 'Abbrechen'
  },
  fr: {
    welcome: 'Bienvenue',
    credits: 'Crédits',
    tools: 'Outils IA',
    logout: 'Déconnexion',
    watchAd: 'Voir la pub',
    watchAdDesc: 'Regardez une pub pour des crédits',
    watching: 'Pub en cours...',
    remaining: 'secondes restantes',
    complete: '+10 Crédits!',
    cancel: 'Annuler'
  }
}

// Tool isimleri
const toolNames: Record<string, Record<string, { name: string; desc: string }>> = {
  en: {
    hookGenerator: { name: 'Hook Generator', desc: 'Create viral hooks' },
    captionGenerator: { name: 'Caption Generator', desc: 'Write engaging captions' },
    scriptStudio: { name: 'Script Studio', desc: 'Write video scripts' },
    viralAnalyzer: { name: 'Viral Analyzer', desc: 'Analyze viral potential' },
    stealVideo: { name: 'Steal This Video', desc: 'Reverse engineer viral content' },
    videoFinder: { name: 'Video Finder', desc: 'Find trending videos' },
    trendRadar: { name: 'Trend Radar', desc: 'Discover trends' },
    competitorSpy: { name: 'Competitor Spy', desc: 'Analyze competitors' },
    hashtagResearch: { name: 'Hashtag Research', desc: 'Find best hashtags' },
    contentPlanner: { name: 'Content Planner', desc: '30-day content calendar' },
    contentRepurposer: { name: 'Content Repurposer', desc: 'Repurpose your content' },
    abTester: { name: 'A/B Tester', desc: 'Compare content versions' },
    carouselPlanner: { name: 'Carousel Planner', desc: 'Plan carousel posts' },
    engagementBooster: { name: 'Engagement Booster', desc: 'Boost engagement' },
    postingOptimizer: { name: 'Posting Optimizer', desc: 'Best posting times' },
    threadComposer: { name: 'Thread Composer', desc: 'Write Twitter threads' }
  },
  tr: {
    hookGenerator: { name: 'Hook Üretici', desc: 'Viral hooklar oluştur' },
    captionGenerator: { name: 'Açıklama Üretici', desc: 'Etkileyici açıklamalar yaz' },
    scriptStudio: { name: 'Script Stüdyosu', desc: 'Video scriptleri yaz' },
    viralAnalyzer: { name: 'Viral Analizci', desc: 'Viral potansiyeli analiz et' },
    stealVideo: { name: 'Bu Videoyu Çal', desc: 'Viral içerikleri analiz et' },
    videoFinder: { name: 'Video Bulucu', desc: 'Trend videoları bul' },
    trendRadar: { name: 'Trend Radarı', desc: 'Trendleri keşfet' },
    competitorSpy: { name: 'Rakip Casusluğu', desc: 'Rakipleri analiz et' },
    hashtagResearch: { name: 'Hashtag Araştırma', desc: 'En iyi hashtagleri bul' },
    contentPlanner: { name: 'İçerik Planlayıcı', desc: '30 günlük içerik takvimi' },
    contentRepurposer: { name: 'İçerik Dönüştürücü', desc: 'İçeriklerini dönüştür' },
    abTester: { name: 'A/B Test', desc: 'İçerik versiyonlarını karşılaştır' },
    carouselPlanner: { name: 'Carousel Planlayıcı', desc: 'Carousel postları planla' },
    engagementBooster: { name: 'Etkileşim Arttırıcı', desc: 'Etkileşimi arttır' },
    postingOptimizer: { name: 'Paylaşım Zamanı', desc: 'En iyi paylaşım saatleri' },
    threadComposer: { name: 'Thread Yazarı', desc: 'Twitter threadleri yaz' }
  },
  ru: {
    hookGenerator: { name: 'Генератор Хуков', desc: 'Создайте вирусные хуки' },
    captionGenerator: { name: 'Генератор Подписей', desc: 'Пишите подписи' },
    scriptStudio: { name: 'Студия Скриптов', desc: 'Пишите скрипты' },
    viralAnalyzer: { name: 'Вирусный Анализатор', desc: 'Анализ потенциала' },
    stealVideo: { name: 'Украсть Видео', desc: 'Анализ контента' },
    videoFinder: { name: 'Поиск Видео', desc: 'Найти тренды' },
    trendRadar: { name: 'Радар Трендов', desc: 'Откройте тренды' },
    competitorSpy: { name: 'Шпион Конкурентов', desc: 'Анализ конкурентов' },
    hashtagResearch: { name: 'Исследование Хештегов', desc: 'Лучшие хештеги' },
    contentPlanner: { name: 'Планировщик Контента', desc: '30-дневный календарь' },
    contentRepurposer: { name: 'Переработка Контента', desc: 'Переработка' },
    abTester: { name: 'A/B Тестер', desc: 'Сравнение версий' },
    carouselPlanner: { name: 'Планер Каруселей', desc: 'Планируйте посты' },
    engagementBooster: { name: 'Усилитель Вовлечения', desc: 'Увеличьте охват' },
    postingOptimizer: { name: 'Оптимизатор Постинга', desc: 'Лучшее время' },
    threadComposer: { name: 'Композитор Тредов', desc: 'Пишите треды' }
  },
  de: {
    hookGenerator: { name: 'Hook Generator', desc: 'Virale Hooks erstellen' },
    captionGenerator: { name: 'Caption Generator', desc: 'Captions schreiben' },
    scriptStudio: { name: 'Script Studio', desc: 'Video-Skripte schreiben' },
    viralAnalyzer: { name: 'Viral Analyzer', desc: 'Viral-Potenzial analysieren' },
    stealVideo: { name: 'Video Klauen', desc: 'Virale Inhalte analysieren' },
    videoFinder: { name: 'Video Finder', desc: 'Trend-Videos finden' },
    trendRadar: { name: 'Trend Radar', desc: 'Trends entdecken' },
    competitorSpy: { name: 'Konkurrenz Spion', desc: 'Konkurrenz analysieren' },
    hashtagResearch: { name: 'Hashtag Recherche', desc: 'Beste Hashtags finden' },
    contentPlanner: { name: 'Content Planer', desc: '30-Tage Kalender' },
    contentRepurposer: { name: 'Content Umwandler', desc: 'Inhalte umwandeln' },
    abTester: { name: 'A/B Tester', desc: 'Versionen vergleichen' },
    carouselPlanner: { name: 'Carousel Planer', desc: 'Carousel planen' },
    engagementBooster: { name: 'Engagement Booster', desc: 'Engagement steigern' },
    postingOptimizer: { name: 'Posting Optimierer', desc: 'Beste Posting-Zeit' },
    threadComposer: { name: 'Thread Komponist', desc: 'Threads schreiben' }
  },
  fr: {
    hookGenerator: { name: 'Générateur de Hooks', desc: 'Créer des hooks viraux' },
    captionGenerator: { name: 'Générateur de Légendes', desc: 'Écrire des légendes' },
    scriptStudio: { name: 'Studio de Scripts', desc: 'Écrire des scripts' },
    viralAnalyzer: { name: 'Analyseur Viral', desc: 'Analyser le potentiel' },
    stealVideo: { name: 'Voler Cette Vidéo', desc: 'Analyser le contenu' },
    videoFinder: { name: 'Chercheur de Vidéos', desc: 'Trouver les tendances' },
    trendRadar: { name: 'Radar des Tendances', desc: 'Découvrir les tendances' },
    competitorSpy: { name: 'Espion Concurrent', desc: 'Analyser la concurrence' },
    hashtagResearch: { name: 'Recherche Hashtags', desc: 'Meilleurs hashtags' },
    contentPlanner: { name: 'Planificateur de Contenu', desc: 'Calendrier 30 jours' },
    contentRepurposer: { name: 'Recycleur de Contenu', desc: 'Recycler le contenu' },
    abTester: { name: 'Test A/B', desc: 'Comparer les versions' },
    carouselPlanner: { name: 'Planificateur Carousel', desc: 'Planifier les carousels' },
    engagementBooster: { name: 'Booster d\'Engagement', desc: 'Augmenter l\'engagement' },
    postingOptimizer: { name: 'Optimiseur de Posts', desc: 'Meilleur moment' },
    threadComposer: { name: 'Compositeur de Threads', desc: 'Écrire des threads' }
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [plan, setPlan] = useState('free')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [showAdModal, setShowAdModal] = useState(false)
  const [adCountdown, setAdCountdown] = useState(30)
  const [adComplete, setAdComplete] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  
  const t = texts[language] || texts.en
  const toolT = toolNames[language] || toolNames.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        fetchCredits(session.user.id)
      }
    })
  }, [router])

  const fetchCredits = async (userId: string) => {
    const { data } = await supabase
      .from('credits')
      .select('balance, plan, avatar_url')
      .eq('user_id', userId)
      .single()
    
    if (data) {
      setCredits(data.balance || 0)
      setPlan(data.plan || 'free')
      setAvatarUrl(data.avatar_url)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const startWatchingAd = () => {
    setShowAdModal(true)
    setAdCountdown(30)
    setAdComplete(false)
  }

  useEffect(() => {
    if (showAdModal && adCountdown > 0 && !adComplete) {
      const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showAdModal && adCountdown === 0 && !adComplete) {
      addAdCredits()
    }
  }, [showAdModal, adCountdown, adComplete])

  const addAdCredits = async () => {
    if (!user) return
    setAdComplete(true)
    
    const { error } = await supabase
      .from('credits')
      .update({ balance: credits + 10 })
      .eq('user_id', user.id)
    
    if (!error) {
      setCredits(credits + 10)
    }
    
    setTimeout(() => {
      setShowAdModal(false)
    }, 2000)
  }

  const tools = [
    { key: 'hookGenerator', icon: '🎣', href: '/tools/hook-generator', credits: 3 },
    { key: 'captionGenerator', icon: '✍️', href: '/tools/caption-generator', credits: 3 },
    { key: 'scriptStudio', icon: '🎬', href: '/tools/script-studio', credits: 6 },
    { key: 'viralAnalyzer', icon: '📊', href: '/tools/viral-analyzer', credits: 5 },
    { key: 'stealVideo', icon: '🎯', href: '/tools/steal-video', credits: 8 },
    { key: 'videoFinder', icon: '🔍', href: '/tools/video-finder', credits: 5 },
    { key: 'trendRadar', icon: '📡', href: '/tools/trend-radar', credits: 4 },
    { key: 'competitorSpy', icon: '🕵️', href: '/tools/competitor-spy', credits: 8 },
    { key: 'hashtagResearch', icon: '#️⃣', href: '/tools/hashtag-research', credits: 3 },
    { key: 'contentPlanner', icon: '📅', href: '/tools/content-planner', credits: 10 },
    { key: 'contentRepurposer', icon: '♻️', href: '/tools/content-repurposer', credits: 8 },
    { key: 'abTester', icon: '⚔️', href: '/tools/ab-tester', credits: 5 },
    { key: 'carouselPlanner', icon: '🎠', href: '/tools/carousel-planner', credits: 5 },
    { key: 'engagementBooster', icon: '🚀', href: '/tools/engagement-booster', credits: 4 },
    { key: 'postingOptimizer', icon: '⏰', href: '/tools/posting-optimizer', credits: 2 },
    { key: 'threadComposer', icon: '🧵', href: '/tools/thread-composer', credits: 5 },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">MediaToolKit</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-sm"
              >
                {languageNames[language]?.split(' ')[0] || '🌐'}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLangMenu(false) }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition ${language === lang ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300'}`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Credits */}
            <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <span className="text-purple-400 font-medium">✦ {credits}</span>
            </div>

            {/* Watch Ad Button */}
            <button
              onClick={startWatchingAd}
              className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium hover:from-green-500/30 hover:to-emerald-500/30 transition hidden sm:flex items-center gap-1"
            >
              🎬 +10
            </button>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 cursor-pointer">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-800">
                  <div className="font-semibold text-white">{user.email?.split('@')[0] || 'User'}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-gray-800 transition"
                >
                  {t.logout}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{t.welcome}, {user.email?.split('@')[0] || 'User'}! 👋</h1>
          <p className="text-gray-400">{t.credits}: <span className="text-purple-400 font-semibold">{credits}</span></p>
        </div>

        {/* Watch Ad Card - Mobile */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl sm:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-400">{t.watchAd}</h3>
              <p className="text-sm text-gray-400">{t.watchAdDesc}</p>
            </div>
            <button
              onClick={startWatchingAd}
              className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium"
            >
              +10 🎬
            </button>
          </div>
        </div>

        {/* Tools Grid */}
        <h2 className="text-xl font-semibold mb-4">{t.tools}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.key}
              href={tool.href}
              className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/30 hover:bg-white/[0.04] transition"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{tool.icon}</span>
                <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg">
                  ✦ {tool.credits} {t.credits.toLowerCase()}
                </span>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition">
                {toolT[tool.key]?.name || tool.key}
              </h3>
              <p className="text-sm text-gray-500">
                {toolT[tool.key]?.desc || ''}
              </p>
            </Link>
          ))}
        </div>
      </main>

      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-md w-full text-center">
            {!adComplete ? (
              <>
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-xl font-bold mb-2">{t.watching}</h3>
                
                {/* Fake Ad Content */}
                <div className="my-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                  <p className="text-sm text-gray-300 mb-2">✨ MediaToolKit Pro ✨</p>
                  <p className="text-xs text-gray-400">Unlock unlimited credits and premium features!</p>
                </div>

                {/* Countdown */}
                <div className="mb-4">
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((30 - adCountdown) / 30) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">{adCountdown} {t.remaining}</p>
                </div>

                <button
                  onClick={() => setShowAdModal(false)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition"
                >
                  {t.cancel}
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">{t.complete}</h3>
                <p className="text-gray-400">+10 {t.credits}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
