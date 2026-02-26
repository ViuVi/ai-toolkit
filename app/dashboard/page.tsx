'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage, Language } from '@/lib/LanguageContext'

// 5 DİLLİ ÇEVİRİLER
const texts: Record<Language, any> = {
  en: {
    platform: 'Content Creation Platform',
    pro: 'Pro',
    credits: 'Credits',
    watchAd: 'Watch Ad',
    earnCredits: 'Watch ad, earn credits!',
    logout: 'Logout',
    welcome: 'Welcome',
    searchPlaceholder: 'Search tools...',
    freeTag: 'FREE',
    newTag: 'NEW',
    creditUnit: 'credit',
    loading: 'Loading...',
    noTools: 'No tools found',
    adModal: {
      title: 'Earn Free Credits',
      subtitle: 'Watch a 15-second ad to earn 5 credits',
      remaining: 'ads remaining today',
      watching: 'Watching ad...',
      earnBtn: 'Watch Ad (+5 Credits)',
      limitReached: 'Daily limit reached',
      close: 'Close'
    },
    categories: {
      all: 'All',
      video: 'Video',
      content: 'Content',
      analysis: 'Analysis',
      optimization: 'Optimization',
      helper: 'Helper'
    },
    tools: {
      videoScript: { name: 'Video Script Writer', desc: 'Scripts for YouTube & TikTok' },
      textToSpeech: { name: 'Text to Speech', desc: 'Convert text to speech' },
      hookGenerator: { name: 'Hook Generator', desc: 'Attention-grabbing hooks' },
      captionWriter: { name: 'Caption Writer', desc: 'Professional captions' },
      platformAdapter: { name: 'Platform Adapter', desc: 'Adapt content to platforms' },
      summarizer: { name: 'Summarizer', desc: 'Summarize texts' },
      competitorAnalysis: { name: 'Competitor Analysis', desc: 'Analyze competitors' },
      trendDetector: { name: 'Trend Detector', desc: 'Discover trends' },
      engagementPredictor: { name: 'Engagement Predictor', desc: 'Predict engagement' },
      brandVoice: { name: 'Brand Voice Analyzer', desc: 'Analyze brand voice' },
      viralScore: { name: 'Viral Score', desc: 'Predict viral potential' },
      hashtagGenerator: { name: 'Hashtag Generator', desc: 'AI-powered viral hashtags' },
      bioGenerator: { name: 'Bio Generator', desc: 'Profile bios' },
      qrCode: { name: 'QR Code', desc: 'Generate QR codes' },
      postScheduler: { name: 'Post Scheduler', desc: 'Best posting times' },
      contentCalendar: { name: 'Content Calendar', desc: 'Monthly content plan' },
      sentiment: { name: 'Sentiment Analysis', desc: 'Analyze emotions' },
      subtitleGenerator: { name: 'Subtitle Generator', desc: 'Generate subtitles' }
    }
  },
  tr: {
    platform: 'İçerik Üretim Platformu',
    pro: 'Pro',
    credits: 'Kredi',
    watchAd: 'Reklam İzle',
    earnCredits: 'Reklam izle, kredi kazan!',
    logout: 'Çıkış',
    welcome: 'Hoş geldin',
    searchPlaceholder: 'Araç ara...',
    freeTag: 'ÜCRETSİZ',
    newTag: 'YENİ',
    creditUnit: 'kredi',
    loading: 'Yükleniyor...',
    noTools: 'Araç bulunamadı',
    adModal: {
      title: 'Ücretsiz Kredi Kazan',
      subtitle: '15 saniyelik reklam izleyerek 5 kredi kazan',
      remaining: 'reklam hakkı kaldı',
      watching: 'Reklam izleniyor...',
      earnBtn: 'Reklam İzle (+5 Kredi)',
      limitReached: 'Günlük limit doldu',
      close: 'Kapat'
    },
    categories: {
      all: 'Tümü',
      video: 'Video',
      content: 'İçerik',
      analysis: 'Analiz',
      optimization: 'Optimizasyon',
      helper: 'Yardımcı'
    },
    tools: {
      videoScript: { name: 'Video Script Yazarı', desc: 'YouTube & TikTok için script' },
      textToSpeech: { name: 'Seslendirme', desc: 'Metni sese dönüştür' },
      hookGenerator: { name: 'Hook Üretici', desc: 'Dikkat çeken hooklar' },
      captionWriter: { name: 'Caption Yazarı', desc: 'Profesyonel captionlar' },
      platformAdapter: { name: 'Platform Uyarlayıcı', desc: 'İçeriği platformlara uyarla' },
      summarizer: { name: 'Metin Özetleyici', desc: 'Metinleri özetle' },
      competitorAnalysis: { name: 'Rakip Analizi', desc: 'Rakiplerinizi analiz edin' },
      trendDetector: { name: 'Trend Dedektörü', desc: 'Güncel trendleri keşfet' },
      engagementPredictor: { name: 'Etkileşim Tahmini', desc: 'Etkileşim tahmini' },
      brandVoice: { name: 'Marka Sesi Analizi', desc: 'Marka sesinizi analiz edin' },
      viralScore: { name: 'Viral Skor', desc: 'Viral potansiyel tahmini' },
      hashtagGenerator: { name: 'Hashtag Üretici', desc: 'AI ile viral hashtagler' },
      bioGenerator: { name: 'Bio Üretici', desc: 'Profil bioları' },
      qrCode: { name: 'QR Kod', desc: 'QR kod oluştur' },
      postScheduler: { name: 'Paylaşım Zamanlayıcı', desc: 'En iyi paylaşım saatleri' },
      contentCalendar: { name: 'İçerik Takvimi', desc: 'Aylık içerik planı' },
      sentiment: { name: 'Duygu Analizi', desc: 'Duyguları analiz et' },
      subtitleGenerator: { name: 'Altyazı Üretici', desc: 'Altyazı oluştur' }
    }
  },
  ru: {
    platform: 'Платформа для контента',
    pro: 'Pro',
    credits: 'Кредиты',
    watchAd: 'Смотреть рекламу',
    earnCredits: 'Смотрите рекламу, получайте кредиты!',
    logout: 'Выход',
    welcome: 'Добро пожаловать',
    searchPlaceholder: 'Поиск инструментов...',
    freeTag: 'БЕСПЛАТНО',
    newTag: 'НОВОЕ',
    creditUnit: 'кредит',
    loading: 'Загрузка...',
    noTools: 'Инструменты не найдены',
    adModal: {
      title: 'Получите бесплатные кредиты',
      subtitle: 'Посмотрите 15-секундную рекламу и получите 5 кредитов',
      remaining: 'реклам осталось сегодня',
      watching: 'Просмотр рекламы...',
      earnBtn: 'Смотреть (+5 кредитов)',
      limitReached: 'Дневной лимит достигнут',
      close: 'Закрыть'
    },
    categories: {
      all: 'Все',
      video: 'Видео',
      content: 'Контент',
      analysis: 'Анализ',
      optimization: 'Оптимизация',
      helper: 'Помощник'
    },
    tools: {
      videoScript: { name: 'Сценарист видео', desc: 'Скрипты для YouTube и TikTok' },
      textToSpeech: { name: 'Озвучка текста', desc: 'Преобразование текста в речь' },
      hookGenerator: { name: 'Генератор хуков', desc: 'Привлекающие внимание хуки' },
      captionWriter: { name: 'Автор подписей', desc: 'Профессиональные подписи' },
      platformAdapter: { name: 'Адаптер платформ', desc: 'Адаптация контента' },
      summarizer: { name: 'Суммаризатор', desc: 'Резюмирование текстов' },
      competitorAnalysis: { name: 'Анализ конкурентов', desc: 'Анализируйте конкурентов' },
      trendDetector: { name: 'Детектор трендов', desc: 'Откройте тренды' },
      engagementPredictor: { name: 'Прогноз вовлеченности', desc: 'Прогноз вовлеченности' },
      brandVoice: { name: 'Голос бренда', desc: 'Анализ голоса бренда' },
      viralScore: { name: 'Вирусный рейтинг', desc: 'Прогноз вирусности' },
      hashtagGenerator: { name: 'Генератор хэштегов', desc: 'AI хэштеги' },
      bioGenerator: { name: 'Генератор био', desc: 'Био профиля' },
      qrCode: { name: 'QR код', desc: 'Создание QR кодов' },
      postScheduler: { name: 'Планировщик постов', desc: 'Лучшее время для постов' },
      contentCalendar: { name: 'Контент-календарь', desc: 'Месячный план контента' },
      sentiment: { name: 'Анализ настроений', desc: 'Анализ эмоций' },
      subtitleGenerator: { name: 'Генератор субтитров', desc: 'Создание субтитров' }
    }
  },
  de: {
    platform: 'Content-Erstellungsplattform',
    pro: 'Pro',
    credits: 'Credits',
    watchAd: 'Werbung ansehen',
    earnCredits: 'Werbung ansehen, Credits verdienen!',
    logout: 'Abmelden',
    welcome: 'Willkommen',
    searchPlaceholder: 'Tools suchen...',
    freeTag: 'KOSTENLOS',
    newTag: 'NEU',
    creditUnit: 'Credit',
    loading: 'Laden...',
    noTools: 'Keine Tools gefunden',
    adModal: {
      title: 'Kostenlose Credits verdienen',
      subtitle: '15-Sekunden-Werbung ansehen und 5 Credits verdienen',
      remaining: 'Werbungen übrig heute',
      watching: 'Werbung läuft...',
      earnBtn: 'Ansehen (+5 Credits)',
      limitReached: 'Tageslimit erreicht',
      close: 'Schließen'
    },
    categories: {
      all: 'Alle',
      video: 'Video',
      content: 'Inhalt',
      analysis: 'Analyse',
      optimization: 'Optimierung',
      helper: 'Helfer'
    },
    tools: {
      videoScript: { name: 'Video-Skript-Autor', desc: 'Skripte für YouTube & TikTok' },
      textToSpeech: { name: 'Text zu Sprache', desc: 'Text in Sprache umwandeln' },
      hookGenerator: { name: 'Hook-Generator', desc: 'Aufmerksamkeitsstarke Hooks' },
      captionWriter: { name: 'Caption-Autor', desc: 'Professionelle Captions' },
      platformAdapter: { name: 'Plattform-Adapter', desc: 'Inhalte anpassen' },
      summarizer: { name: 'Zusammenfasser', desc: 'Texte zusammenfassen' },
      competitorAnalysis: { name: 'Wettbewerbsanalyse', desc: 'Konkurrenten analysieren' },
      trendDetector: { name: 'Trend-Detektor', desc: 'Trends entdecken' },
      engagementPredictor: { name: 'Engagement-Vorhersage', desc: 'Engagement vorhersagen' },
      brandVoice: { name: 'Markenstimme', desc: 'Markenstimme analysieren' },
      viralScore: { name: 'Viral-Score', desc: 'Virales Potenzial vorhersagen' },
      hashtagGenerator: { name: 'Hashtag-Generator', desc: 'KI-gestützte Hashtags' },
      bioGenerator: { name: 'Bio-Generator', desc: 'Profil-Bios' },
      qrCode: { name: 'QR-Code', desc: 'QR-Codes erstellen' },
      postScheduler: { name: 'Post-Planer', desc: 'Beste Posting-Zeiten' },
      contentCalendar: { name: 'Content-Kalender', desc: 'Monatlicher Inhaltsplan' },
      sentiment: { name: 'Stimmungsanalyse', desc: 'Emotionen analysieren' },
      subtitleGenerator: { name: 'Untertitel-Generator', desc: 'Untertitel erstellen' }
    }
  },
  fr: {
    platform: 'Plateforme de création de contenu',
    pro: 'Pro',
    credits: 'Crédits',
    watchAd: 'Regarder une pub',
    earnCredits: 'Regardez une pub, gagnez des crédits!',
    logout: 'Déconnexion',
    welcome: 'Bienvenue',
    searchPlaceholder: 'Rechercher des outils...',
    freeTag: 'GRATUIT',
    newTag: 'NOUVEAU',
    creditUnit: 'crédit',
    loading: 'Chargement...',
    noTools: 'Aucun outil trouvé',
    adModal: {
      title: 'Gagnez des crédits gratuits',
      subtitle: 'Regardez une pub de 15 secondes pour gagner 5 crédits',
      remaining: 'pubs restantes aujourd\'hui',
      watching: 'Visionnage en cours...',
      earnBtn: 'Regarder (+5 crédits)',
      limitReached: 'Limite quotidienne atteinte',
      close: 'Fermer'
    },
    categories: {
      all: 'Tous',
      video: 'Vidéo',
      content: 'Contenu',
      analysis: 'Analyse',
      optimization: 'Optimisation',
      helper: 'Assistant'
    },
    tools: {
      videoScript: { name: 'Scénariste vidéo', desc: 'Scripts pour YouTube & TikTok' },
      textToSpeech: { name: 'Synthèse vocale', desc: 'Convertir le texte en parole' },
      hookGenerator: { name: 'Générateur de hooks', desc: 'Hooks accrocheurs' },
      captionWriter: { name: 'Rédacteur de légendes', desc: 'Légendes professionnelles' },
      platformAdapter: { name: 'Adaptateur de plateforme', desc: 'Adapter le contenu' },
      summarizer: { name: 'Résumeur', desc: 'Résumer les textes' },
      competitorAnalysis: { name: 'Analyse concurrentielle', desc: 'Analyser les concurrents' },
      trendDetector: { name: 'Détecteur de tendances', desc: 'Découvrir les tendances' },
      engagementPredictor: { name: 'Prédiction d\'engagement', desc: 'Prédire l\'engagement' },
      brandVoice: { name: 'Voix de marque', desc: 'Analyser la voix de marque' },
      viralScore: { name: 'Score viral', desc: 'Prédire le potentiel viral' },
      hashtagGenerator: { name: 'Générateur de hashtags', desc: 'Hashtags IA' },
      bioGenerator: { name: 'Générateur de bio', desc: 'Bios de profil' },
      qrCode: { name: 'Code QR', desc: 'Générer des codes QR' },
      postScheduler: { name: 'Planificateur de posts', desc: 'Meilleurs horaires de publication' },
      contentCalendar: { name: 'Calendrier de contenu', desc: 'Plan de contenu mensuel' },
      sentiment: { name: 'Analyse de sentiment', desc: 'Analyser les émotions' },
      subtitleGenerator: { name: 'Générateur de sous-titres', desc: 'Créer des sous-titres' }
    }
  }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAdModal, setShowAdModal] = useState(false)
  const [adWatching, setAdWatching] = useState(false)
  const [adProgress, setAdProgress] = useState(0)
  const [dailyAdsWatched, setDailyAdsWatched] = useState(0)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language]

  const MAX_DAILY_ADS = 5

  useEffect(() => {
    checkUser()
    checkDailyAds()
  }, [])

  const checkDailyAds = () => {
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem('adWatchDate')
    const storedCount = localStorage.getItem('adWatchCount')
    
    if (storedDate === today && storedCount) {
      setDailyAdsWatched(parseInt(storedCount))
    } else {
      localStorage.setItem('adWatchDate', today)
      localStorage.setItem('adWatchCount', '0')
      setDailyAdsWatched(0)
    }
  }

  const handleWatchAd = async () => {
    if (dailyAdsWatched >= MAX_DAILY_ADS) return
    
    setAdWatching(true)
    setAdProgress(0)
    
    const interval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + (100 / 15)
      })
    }, 1000)

    setTimeout(async () => {
      clearInterval(interval)
      setAdProgress(100)
      
      if (user && credits) {
        await supabase
          .from('credits')
          .update({
            balance: credits.balance + 5,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
        
        setCredits({ ...credits, balance: credits.balance + 5 })
      }
      
      const newCount = dailyAdsWatched + 1
      setDailyAdsWatched(newCount)
      localStorage.setItem('adWatchCount', newCount.toString())
      
      setAdWatching(false)
      setShowAdModal(false)
    }, 15000)
  }

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)

    const { data: creditsData } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!creditsData) {
      const { data: newCredits } = await supabase
        .from('credits')
        .insert({ user_id: user.id, balance: 50 })
        .select()
        .single()
      setCredits(newCredits)
    } else {
      setCredits(creditsData)
    }
    
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const tools = [
    { id: 'videoScript', icon: '🎬', path: '/tools/video-script', credits: 4, category: 'video' },
    { id: 'textToSpeech', icon: '🔊', path: '/tools/text-to-speech', credits: 3, category: 'video', new: true },
    { id: 'subtitleGenerator', icon: '📺', path: '/tools/subtitle-generator', credits: 5, category: 'video' },
    { id: 'hookGenerator', icon: '🎣', path: '/tools/hook-generator', credits: 2, category: 'content' },
    { id: 'captionWriter', icon: '✍️', path: '/tools/caption-writer', credits: 2, category: 'content' },
    { id: 'platformAdapter', icon: '🔄', path: '/tools/platform-adapter', credits: 3, category: 'content' },
    { id: 'summarizer', icon: '📝', path: '/tools/summarize', credits: 2, category: 'content' },
    { id: 'competitorAnalysis', icon: '🔍', path: '/tools/competitor-analyzer', credits: 8, category: 'analysis' },
    { id: 'trendDetector', icon: '📊', path: '/tools/trend-detector', credits: 5, category: 'analysis' },
    { id: 'engagementPredictor', icon: '📈', path: '/tools/engagement-predictor', credits: 5, category: 'analysis' },
    { id: 'brandVoice', icon: '🎯', path: '/tools/brand-voice', credits: 2, category: 'analysis' },
    { id: 'viralScore', icon: '🚀', path: '/tools/viral-score', credits: 3, category: 'analysis' },
    { id: 'sentiment', icon: '😊', path: '/tools/sentiment', credits: 3, category: 'analysis' },
    { id: 'hashtagGenerator', icon: '#️⃣', path: '/tools/hashtag-generator', credits: 0, category: 'optimization', free: true },
    { id: 'bioGenerator', icon: '👤', path: '/tools/bio-generator', credits: 0, category: 'optimization', free: true },
    { id: 'qrCode', icon: '📱', path: '/tools/qr-code-generator', credits: 0, category: 'optimization', free: true },
    { id: 'postScheduler', icon: '📅', path: '/tools/post-scheduler', credits: 0, category: 'helper', free: true },
    { id: 'contentCalendar', icon: '🗓️', path: '/tools/content-calendar', credits: 0, category: 'helper', free: true },
  ]

  const categories = [
    { id: 'all', icon: '🎯' },
    { id: 'video', icon: '📹' },
    { id: 'content', icon: '✍️' },
    { id: 'analysis', icon: '📊' },
    { id: 'optimization', icon: '⚡' },
    { id: 'helper', icon: '🛠️' },
  ]

  const filteredTools = tools.filter(tool => {
    const toolText = t.tools[tool.id as keyof typeof t.tools]
    const matchesSearch = toolText?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         toolText?.desc?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Media</span>
                  <span className="text-xl font-bold text-white">Tool Kit</span>
                </div>
                <p className="text-xs text-gray-400">{t.platform}</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-700/50 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 transition">
                  <span>🌐</span>
                  <span>{language.toUpperCase()}</span>
                  <span>▼</span>
                </button>
                <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {langs.map((l) => (
                    <button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pro Link */}
              <Link href="/pricing" className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-500/30 transition">
                <span>💎</span>
                <span>{t.pro}</span>
              </Link>

              {/* Credits */}
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-xs text-gray-400">{t.credits}</p>
                  <p className="text-lg font-bold text-yellow-400">{credits?.balance || 0}</p>
                </div>
              </div>

              {/* Watch Ad Button */}
              <button onClick={() => setShowAdModal(true)} className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-400 rounded-lg px-3 py-2 transition" title={t.earnCredits}>
                <span className="text-xl">🎬</span>
                <span className="text-sm text-green-400 font-medium">+5</span>
              </button>

              {/* User & Logout */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{user?.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-gray-700 rounded-lg transition" title={t.logout}>
                  <span className="text-xl">🚪</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t.welcome}, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
        </div>

        {/* Search & Categories */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{t.categories[cat.id as keyof typeof t.categories]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const toolText = t.tools[tool.id as keyof typeof t.tools]
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{tool.icon}</span>
                    <div className="flex gap-2">
                      {tool.free && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                          {t.freeTag}
                        </span>
                      )}
                      {tool.new && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                          {t.newTag}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition">
                    {toolText?.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{toolText?.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {tool.credits > 0 ? `${tool.credits} ${t.creditUnit}` : t.freeTag}
                    </span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">{t.noTools}</p>
          </div>
        )}
      </main>

      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
            {adWatching ? (
              <div className="text-center">
                <div className="text-6xl mb-4">📺</div>
                <p className="text-white text-xl mb-4">{t.adModal.watching}</p>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${adProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-400">{Math.round(adProgress)}%</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-2xl font-bold text-white mb-2">{t.adModal.title}</h3>
                <p className="text-gray-400 mb-2">{t.adModal.subtitle}</p>
                <p className="text-sm text-gray-500 mb-6">
                  {MAX_DAILY_ADS - dailyAdsWatched} {t.adModal.remaining}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAdModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition"
                  >
                    {t.adModal.close}
                  </button>
                  <button
                    onClick={handleWatchAd}
                    disabled={dailyAdsWatched >= MAX_DAILY_ADS}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
                  >
                    {dailyAdsWatched >= MAX_DAILY_ADS ? t.adModal.limitReached : t.adModal.earnBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
