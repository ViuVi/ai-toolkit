'use client'
import { useState, useEffect, useRef } from 'react'
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
    cancel: 'Cancel',
    changePhoto: 'Change Photo',
    uploadPhoto: 'Upload Photo',
    uploading: 'Uploading...',
    removePhoto: 'Remove Photo',
    uploadError: 'Upload failed',
    uploadSuccess: 'Photo updated',
    photoRemoved: 'Photo removed',
    readyToCreate: 'Ready to create viral content?',
    allTools: 'All Tools',
    create: 'Create',
    analyze: 'Analyze',
    optimize: 'Optimize'
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
    cancel: 'İptal',
    changePhoto: 'Fotoğraf Değiştir',
    uploadPhoto: 'Fotoğraf Yükle',
    uploading: 'Yükleniyor...',
    removePhoto: 'Fotoğrafı Kaldır',
    uploadError: 'Yükleme hatası',
    uploadSuccess: 'Fotoğraf güncellendi',
    photoRemoved: 'Fotoğraf kaldırıldı',
    readyToCreate: 'Viral içerik oluşturmaya hazır mısın?',
    allTools: 'Tüm Araçlar',
    create: 'Oluştur',
    analyze: 'Analiz',
    optimize: 'Optimize'
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
    cancel: 'Отмена',
    changePhoto: 'Изменить фото',
    uploadPhoto: 'Загрузить',
    uploading: 'Загрузка...',
    removePhoto: 'Удалить фото',
    uploadError: 'Ошибка загрузки',
    uploadSuccess: 'Фото обновлено',
    photoRemoved: 'Фото удалено',
    readyToCreate: 'Готовы создавать вирусный контент?',
    allTools: 'Все',
    create: 'Создать',
    analyze: 'Анализ',
    optimize: 'Оптимизация'
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
    cancel: 'Abbrechen',
    changePhoto: 'Foto ändern',
    uploadPhoto: 'Hochladen',
    uploading: 'Lädt...',
    removePhoto: 'Foto entfernen',
    uploadError: 'Upload fehlgeschlagen',
    uploadSuccess: 'Foto aktualisiert',
    photoRemoved: 'Foto entfernt',
    readyToCreate: 'Bereit viralen Content zu erstellen?',
    allTools: 'Alle',
    create: 'Erstellen',
    analyze: 'Analysieren',
    optimize: 'Optimieren'
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
    cancel: 'Annuler',
    changePhoto: 'Changer la photo',
    uploadPhoto: 'Télécharger',
    uploading: 'Téléchargement...',
    removePhoto: 'Supprimer',
    uploadError: 'Échec du téléchargement',
    uploadSuccess: 'Photo mise à jour',
    photoRemoved: 'Photo supprimée',
    readyToCreate: 'Prêt à créer du contenu viral?',
    allTools: 'Tous',
    create: 'Créer',
    analyze: 'Analyser',
    optimize: 'Optimiser'
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
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  // Avatar Upload
  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setUploadMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok && data.url) {
        setAvatarUrl(data.url)
        setUploadMessage({ type: 'success', text: t.uploadSuccess || 'Photo updated!' })
      } else {
        setUploadMessage({ type: 'error', text: data.error || t.uploadError || 'Upload failed' })
      }
    } catch (err) {
      setUploadMessage({ type: 'error', text: t.uploadError || 'Upload failed' })
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAvatar = async () => {
    if (!user) return
    setUploading(true)

    const { error } = await supabase
      .from('credits')
      .update({ avatar_url: null })
      .eq('user_id', user.id)

    if (!error) {
      setAvatarUrl(null)
      setUploadMessage({ type: 'success', text: t.photoRemoved || 'Photo removed' })
    }
    setUploading(false)
  }

  const tools = [
    { key: 'videoFinder', icon: '🔍', href: '/tools/video-finder', credits: 5, category: 'analyze' },
    { key: 'hookGenerator', icon: '🎣', href: '/tools/hook-generator', credits: 3, category: 'create' },
    { key: 'captionGenerator', icon: '✍️', href: '/tools/caption-generator', credits: 3, category: 'create' },
    { key: 'stealVideo', icon: '🎯', href: '/tools/steal-video', credits: 8, category: 'analyze' },
    { key: 'viralAnalyzer', icon: '📊', href: '/tools/viral-analyzer', credits: 5, category: 'analyze' },
    { key: 'scriptStudio', icon: '🎬', href: '/tools/script-studio', credits: 6, category: 'create' },
    { key: 'contentPlanner', icon: '📅', href: '/tools/content-planner', credits: 10, category: 'optimize' },
    { key: 'trendRadar', icon: '📡', href: '/tools/trend-radar', credits: 4, category: 'analyze' },
    { key: 'competitorSpy', icon: '🕵️', href: '/tools/competitor-spy', credits: 8, category: 'analyze' },
    { key: 'hashtagResearch', icon: '#️⃣', href: '/tools/hashtag-research', credits: 3, category: 'optimize' },
    { key: 'contentRepurposer', icon: '♻️', href: '/tools/content-repurposer', credits: 8, category: 'create' },
    { key: 'abTester', icon: '⚔️', href: '/tools/ab-tester', credits: 5, category: 'analyze' },
    { key: 'carouselPlanner', icon: '🎠', href: '/tools/carousel-planner', credits: 5, category: 'create' },
    { key: 'engagementBooster', icon: '🚀', href: '/tools/engagement-booster', credits: 4, category: 'optimize' },
    { key: 'postingOptimizer', icon: '⏰', href: '/tools/posting-optimizer', credits: 2, category: 'optimize' },
    { key: 'threadComposer', icon: '🧵', href: '/tools/thread-composer', credits: 5, category: 'create' },
  ]

  const [filter, setFilter] = useState('all')
  const filteredTools = filter === 'all' ? tools : tools.filter(tool => tool.category === filter)

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
                  onClick={() => setShowAvatarModal(true)} 
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
                >
                  {t.changePhoto}
                </button>
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
          <p className="text-gray-400">{t.readyToCreate}</p>
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

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: t.allTools, icon: '📦' },
            { key: 'create', label: t.create, icon: '✨' },
            { key: 'analyze', label: t.analyze, icon: '🔍' },
            { key: 'optimize', label: t.optimize, icon: '⚡' },
          ].map(f => (
            <button 
              key={f.key} 
              onClick={() => setFilter(f.key)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                filter === f.key 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
              }`}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <Link
              key={tool.key}
              href={tool.href}
              className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/30 hover:bg-white/[0.04] transition"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{tool.icon}</span>
                <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg">
                  {tool.credits} ✦
                </span>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition">
                {toolT[tool.key]?.name || tool.key}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${
                  tool.category === 'create' ? 'bg-green-500' : 
                  tool.category === 'analyze' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></span>
                {tool.category === 'create' ? t.create : tool.category === 'analyze' ? t.analyze : t.optimize}
              </div>
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

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAvatarModal(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t.changePhoto}</h2>
              <button onClick={() => setShowAvatarModal(false)} className="text-gray-500 hover:text-white transition">✕</button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex justify-center mb-6">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* Upload Message */}
            {uploadMessage && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${uploadMessage.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {uploadMessage.text}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={uploadAvatar}
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
            >
              {uploading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {t.uploading}
                </>
              ) : (
                t.uploadPhoto
              )}
            </button>

            <p className="text-center text-gray-500 text-xs mb-4">JPG, PNG, GIF, WebP • Max 5MB</p>

            {/* Remove Button */}
            {avatarUrl && (
              <button onClick={removeAvatar} disabled={uploading} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-red-400 hover:border-red-500/30 transition disabled:opacity-50">
                {t.removePhoto}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
