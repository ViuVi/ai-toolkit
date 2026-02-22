'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage, Language } from '@/lib/LanguageContext'

const languages = [
  { code: 'en', flag: '🇺🇸', name: 'EN' },
  { code: 'tr', flag: '🇹🇷', name: 'TR' },
  { code: 'ru', flag: '🇷🇺', name: 'RU' },
  { code: 'de', flag: '🇩🇪', name: 'DE' },
  { code: 'fr', flag: '🇫🇷', name: 'FR' },
]

// Çeviri objesi
const dashboardTexts: Record<Language, Record<string, string>> = {
  en: {
    loading: 'Loading...',
    welcome: 'Welcome back',
    whatToDo: 'What would you like to do today?',
    searchTools: 'Search tools...',
    credits: 'credits',
    watchAd: 'Watch Ad',
    watchAdCredits: 'Watch Ad (+5 Credits)',
    logout: 'Logout',
    noTools: 'No tools found',
    tryDifferent: 'Try a different search',
    free: 'FREE',
    new: 'NEW',
    // Categories
    all: 'All',
    video: 'Video',
    content: 'Content',
    analysis: 'Analysis',
    optimization: 'Optimization',
    helper: 'Helper',
    // Tools
    videoScript: 'Video Script Writer',
    videoScriptDesc: 'Scripts for YouTube & TikTok',
    textToSpeech: 'Text to Speech',
    textToSpeechDesc: 'Convert text to speech',
    hookGenerator: 'Hook Generator',
    hookGeneratorDesc: 'Attention-grabbing hooks',
    captionWriter: 'Caption Writer',
    captionWriterDesc: 'Professional captions',
    platformAdapter: 'Platform Adapter',
    platformAdapterDesc: 'Adapt content to platforms',
    summarizer: 'Summarizer',
    summarizerDesc: 'Summarize texts',
    competitorAnalysis: 'Competitor Analysis',
    competitorAnalysisDesc: 'Analyze competitors',
    trendDetector: 'Trend Detector',
    trendDetectorDesc: 'Discover trends',
    engagementPredictor: 'Engagement Predictor',
    engagementPredictorDesc: 'Predict engagement',
    brandVoice: 'Brand Voice Analyzer',
    brandVoiceDesc: 'Analyze brand voice',
    viralScore: 'Viral Score',
    viralScoreDesc: 'Predict viral potential',
    sentiment: 'Sentiment Analysis',
    sentimentDesc: 'Text sentiment analysis',
    hashtagGenerator: 'Hashtag Generator',
    hashtagGeneratorDesc: 'AI-powered viral hashtags',
    bioGenerator: 'Bio Generator',
    bioGeneratorDesc: 'Profile bios',
    qrCode: 'QR Code',
    qrCodeDesc: 'Generate QR codes',
    postScheduler: 'Post Scheduler',
    postSchedulerDesc: 'Best posting times',
    contentCalendar: 'Content Calendar',
    contentCalendarDesc: 'Monthly content plan',
    // Ad Modal
    watchAdTitle: 'Watch Ad, Earn Credits!',
    watchAdDesc: 'Watch a 15-second ad to earn 5 credits.',
    dailyRemaining: 'Daily remaining',
    dailyLimitReached: 'Daily limit reached!',
    close: 'Close',
    watchingAd: 'Watching Ad...',
    secondsLeft: 'seconds left',
  },
  tr: {
    loading: 'Yükleniyor...',
    welcome: 'Hoş Geldin',
    whatToDo: 'Bugün ne yapmak istersin?',
    searchTools: 'Araç ara...',
    credits: 'kredi',
    watchAd: 'Reklam İzle',
    watchAdCredits: 'Reklam İzle (+5 Kredi)',
    logout: 'Çıkış',
    noTools: 'Araç bulunamadı',
    tryDifferent: 'Farklı bir arama yapın',
    free: 'ÜCRETSİZ',
    new: 'YENİ',
    all: 'Tümü',
    video: 'Video',
    content: 'İçerik',
    analysis: 'Analiz',
    optimization: 'Optimizasyon',
    helper: 'Yardımcı',
    videoScript: 'Video Script Yazarı',
    videoScriptDesc: 'YouTube & TikTok için script',
    textToSpeech: 'Seslendirme',
    textToSpeechDesc: 'Metni sese dönüştür',
    hookGenerator: 'Hook Üretici',
    hookGeneratorDesc: 'Dikkat çeken hooklar',
    captionWriter: 'Caption Yazarı',
    captionWriterDesc: 'Profesyonel captionlar',
    platformAdapter: 'Platform Uyarlayıcı',
    platformAdapterDesc: 'İçeriği platformlara uyarla',
    summarizer: 'Metin Özetleyici',
    summarizerDesc: 'Metinleri özetle',
    competitorAnalysis: 'Rakip Analizi',
    competitorAnalysisDesc: 'Rakiplerinizi analiz edin',
    trendDetector: 'Trend Dedektörü',
    trendDetectorDesc: 'Güncel trendleri keşfet',
    engagementPredictor: 'Etkileşim Tahmini',
    engagementPredictorDesc: 'Etkileşim tahmini',
    brandVoice: 'Marka Sesi Analizi',
    brandVoiceDesc: 'Marka sesinizi analiz edin',
    viralScore: 'Viral Skor',
    viralScoreDesc: 'Viral potansiyel tahmini',
    sentiment: 'Duygu Analizi',
    sentimentDesc: 'Metin duygu analizi',
    hashtagGenerator: 'Hashtag Üretici',
    hashtagGeneratorDesc: 'AI ile viral hashtagler',
    bioGenerator: 'Bio Üretici',
    bioGeneratorDesc: 'Profil bioları',
    qrCode: 'QR Kod',
    qrCodeDesc: 'QR kod oluştur',
    postScheduler: 'Paylaşım Zamanlayıcı',
    postSchedulerDesc: 'En iyi paylaşım saatleri',
    contentCalendar: 'İçerik Takvimi',
    contentCalendarDesc: 'Aylık içerik planı',
    watchAdTitle: 'Reklam İzle, Kredi Kazan!',
    watchAdDesc: '15 saniyelik bir reklam izleyerek 5 kredi kazanabilirsiniz.',
    dailyRemaining: 'Günlük kalan hak',
    dailyLimitReached: 'Günlük limitinize ulaştınız!',
    close: 'Kapat',
    watchingAd: 'Reklam İzleniyor...',
    secondsLeft: 'saniye kaldı',
  },
  ru: {
    loading: 'Загрузка...',
    welcome: 'С возвращением',
    whatToDo: 'Что вы хотите сделать сегодня?',
    searchTools: 'Поиск инструментов...',
    credits: 'кредитов',
    watchAd: 'Смотреть рекламу',
    watchAdCredits: 'Смотреть (+5 Кредитов)',
    logout: 'Выход',
    noTools: 'Инструменты не найдены',
    tryDifferent: 'Попробуйте другой поиск',
    free: 'БЕСПЛАТНО',
    new: 'НОВОЕ',
    all: 'Все',
    video: 'Видео',
    content: 'Контент',
    analysis: 'Анализ',
    optimization: 'Оптимизация',
    helper: 'Помощник',
    videoScript: 'Сценарий видео',
    videoScriptDesc: 'Скрипты для YouTube и TikTok',
    textToSpeech: 'Озвучка текста',
    textToSpeechDesc: 'Преобразование текста в речь',
    hookGenerator: 'Генератор хуков',
    hookGeneratorDesc: 'Привлекающие внимание хуки',
    captionWriter: 'Автор подписей',
    captionWriterDesc: 'Профессиональные подписи',
    platformAdapter: 'Адаптер платформ',
    platformAdapterDesc: 'Адаптация контента',
    summarizer: 'Суммаризатор',
    summarizerDesc: 'Резюмирование текстов',
    competitorAnalysis: 'Анализ конкурентов',
    competitorAnalysisDesc: 'Анализируйте конкурентов',
    trendDetector: 'Детектор трендов',
    trendDetectorDesc: 'Откройте тренды',
    engagementPredictor: 'Прогноз вовлеченности',
    engagementPredictorDesc: 'Прогнозируйте вовлеченность',
    brandVoice: 'Голос бренда',
    brandVoiceDesc: 'Анализ голоса бренда',
    viralScore: 'Вирусный балл',
    viralScoreDesc: 'Прогноз вирусности',
    sentiment: 'Анализ тональности',
    sentimentDesc: 'Анализ эмоций текста',
    hashtagGenerator: 'Генератор хештегов',
    hashtagGeneratorDesc: 'AI вирусные хештеги',
    bioGenerator: 'Генератор био',
    bioGeneratorDesc: 'Биографии профиля',
    qrCode: 'QR Код',
    qrCodeDesc: 'Создание QR кодов',
    postScheduler: 'Планировщик постов',
    postSchedulerDesc: 'Лучшее время для публикации',
    contentCalendar: 'Контент календарь',
    contentCalendarDesc: 'Месячный план контента',
    watchAdTitle: 'Смотрите рекламу, получайте кредиты!',
    watchAdDesc: 'Посмотрите 15-секундную рекламу и получите 5 кредитов.',
    dailyRemaining: 'Осталось сегодня',
    dailyLimitReached: 'Дневной лимит достигнут!',
    close: 'Закрыть',
    watchingAd: 'Просмотр рекламы...',
    secondsLeft: 'секунд осталось',
  },
  de: {
    loading: 'Laden...',
    welcome: 'Willkommen zurück',
    whatToDo: 'Was möchten Sie heute tun?',
    searchTools: 'Tools suchen...',
    credits: 'Credits',
    watchAd: 'Werbung ansehen',
    watchAdCredits: 'Werbung (+5 Credits)',
    logout: 'Abmelden',
    noTools: 'Keine Tools gefunden',
    tryDifferent: 'Versuchen Sie eine andere Suche',
    free: 'KOSTENLOS',
    new: 'NEU',
    all: 'Alle',
    video: 'Video',
    content: 'Inhalt',
    analysis: 'Analyse',
    optimization: 'Optimierung',
    helper: 'Helfer',
    videoScript: 'Video-Skript',
    videoScriptDesc: 'Skripte für YouTube & TikTok',
    textToSpeech: 'Text-zu-Sprache',
    textToSpeechDesc: 'Text in Sprache umwandeln',
    hookGenerator: 'Hook-Generator',
    hookGeneratorDesc: 'Aufmerksamkeitsstarke Hooks',
    captionWriter: 'Caption-Autor',
    captionWriterDesc: 'Professionelle Captions',
    platformAdapter: 'Plattform-Adapter',
    platformAdapterDesc: 'Inhalte anpassen',
    summarizer: 'Zusammenfasser',
    summarizerDesc: 'Texte zusammenfassen',
    competitorAnalysis: 'Wettbewerbsanalyse',
    competitorAnalysisDesc: 'Wettbewerber analysieren',
    trendDetector: 'Trend-Detektor',
    trendDetectorDesc: 'Trends entdecken',
    engagementPredictor: 'Engagement-Vorhersage',
    engagementPredictorDesc: 'Engagement vorhersagen',
    brandVoice: 'Markenstimme',
    brandVoiceDesc: 'Markenstimme analysieren',
    viralScore: 'Viral-Score',
    viralScoreDesc: 'Virale Potenzial vorhersagen',
    sentiment: 'Stimmungsanalyse',
    sentimentDesc: 'Text-Stimmungsanalyse',
    hashtagGenerator: 'Hashtag-Generator',
    hashtagGeneratorDesc: 'KI virale Hashtags',
    bioGenerator: 'Bio-Generator',
    bioGeneratorDesc: 'Profil-Bios',
    qrCode: 'QR-Code',
    qrCodeDesc: 'QR-Codes erstellen',
    postScheduler: 'Post-Planer',
    postSchedulerDesc: 'Beste Posting-Zeiten',
    contentCalendar: 'Content-Kalender',
    contentCalendarDesc: 'Monatlicher Content-Plan',
    watchAdTitle: 'Werbung ansehen, Credits verdienen!',
    watchAdDesc: 'Sehen Sie eine 15-Sekunden-Werbung und verdienen Sie 5 Credits.',
    dailyRemaining: 'Täglich verbleibend',
    dailyLimitReached: 'Tageslimit erreicht!',
    close: 'Schließen',
    watchingAd: 'Werbung läuft...',
    secondsLeft: 'Sekunden übrig',
  },
  fr: {
    loading: 'Chargement...',
    welcome: 'Bon retour',
    whatToDo: 'Que souhaitez-vous faire aujourd\'hui?',
    searchTools: 'Rechercher des outils...',
    credits: 'crédits',
    watchAd: 'Voir la pub',
    watchAdCredits: 'Voir la pub (+5 Crédits)',
    logout: 'Déconnexion',
    noTools: 'Aucun outil trouvé',
    tryDifferent: 'Essayez une autre recherche',
    free: 'GRATUIT',
    new: 'NOUVEAU',
    all: 'Tous',
    video: 'Vidéo',
    content: 'Contenu',
    analysis: 'Analyse',
    optimization: 'Optimisation',
    helper: 'Assistant',
    videoScript: 'Script Vidéo',
    videoScriptDesc: 'Scripts pour YouTube & TikTok',
    textToSpeech: 'Synthèse vocale',
    textToSpeechDesc: 'Convertir le texte en parole',
    hookGenerator: 'Générateur de hooks',
    hookGeneratorDesc: 'Hooks accrocheurs',
    captionWriter: 'Rédacteur de légendes',
    captionWriterDesc: 'Légendes professionnelles',
    platformAdapter: 'Adaptateur de plateforme',
    platformAdapterDesc: 'Adapter le contenu',
    summarizer: 'Résumeur',
    summarizerDesc: 'Résumer les textes',
    competitorAnalysis: 'Analyse concurrentielle',
    competitorAnalysisDesc: 'Analyser les concurrents',
    trendDetector: 'Détecteur de tendances',
    trendDetectorDesc: 'Découvrir les tendances',
    engagementPredictor: 'Prédicteur d\'engagement',
    engagementPredictorDesc: 'Prédire l\'engagement',
    brandVoice: 'Voix de marque',
    brandVoiceDesc: 'Analyser la voix de marque',
    viralScore: 'Score viral',
    viralScoreDesc: 'Prédire le potentiel viral',
    sentiment: 'Analyse de sentiment',
    sentimentDesc: 'Analyse des émotions du texte',
    hashtagGenerator: 'Générateur de hashtags',
    hashtagGeneratorDesc: 'Hashtags viraux IA',
    bioGenerator: 'Générateur de bio',
    bioGeneratorDesc: 'Bios de profil',
    qrCode: 'Code QR',
    qrCodeDesc: 'Créer des codes QR',
    postScheduler: 'Planificateur de posts',
    postSchedulerDesc: 'Meilleurs moments pour publier',
    contentCalendar: 'Calendrier de contenu',
    contentCalendarDesc: 'Plan de contenu mensuel',
    watchAdTitle: 'Regardez une pub, gagnez des crédits!',
    watchAdDesc: 'Regardez une pub de 15 secondes pour gagner 5 crédits.',
    dailyRemaining: 'Restant aujourd\'hui',
    dailyLimitReached: 'Limite quotidienne atteinte!',
    close: 'Fermer',
    watchingAd: 'Pub en cours...',
    secondsLeft: 'secondes restantes',
  },
}

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  const MAX_DAILY_ADS = 5
  
  // Çeviri fonksiyonu
  const txt = dashboardTexts[language]

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

    setCredits(creditsData)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const tools = [
    { name: txt.videoScript, icon: '🎬', path: '/tools/video-script', credits: 4, category: 'video', description: txt.videoScriptDesc },
    { name: txt.textToSpeech, icon: '🔊', path: '/tools/text-to-speech', credits: 3, category: 'video', description: txt.textToSpeechDesc, new: true },
    
    { name: txt.hookGenerator, icon: '🎣', path: '/tools/hook-generator', credits: 2, category: 'content', description: txt.hookGeneratorDesc },
    { name: txt.captionWriter, icon: '✍️', path: '/tools/caption-writer', credits: 2, category: 'content', description: txt.captionWriterDesc },
    { name: txt.platformAdapter, icon: '🔄', path: '/tools/platform-adapter', credits: 3, category: 'content', description: txt.platformAdapterDesc },
    { name: txt.summarizer, icon: '📝', path: '/tools/summarize', credits: 2, category: 'content', description: txt.summarizerDesc },
    
    { name: txt.competitorAnalysis, icon: '🔍', path: '/tools/competitor-analyzer', credits: 8, category: 'analysis', description: txt.competitorAnalysisDesc },
    { name: txt.trendDetector, icon: '📊', path: '/tools/trend-detector', credits: 5, category: 'analysis', description: txt.trendDetectorDesc },
    { name: txt.engagementPredictor, icon: '📈', path: '/tools/engagement-predictor', credits: 5, category: 'analysis', description: txt.engagementPredictorDesc },
    { name: txt.brandVoice, icon: '🎯', path: '/tools/brand-voice', credits: 2, category: 'analysis', description: txt.brandVoiceDesc },
    { name: txt.viralScore, icon: '🚀', path: '/tools/viral-score', credits: 3, category: 'analysis', description: txt.viralScoreDesc },
    { name: txt.sentiment, icon: '😊', path: '/tools/sentiment', credits: 2, category: 'analysis', description: txt.sentimentDesc },
    
    { name: txt.hashtagGenerator, icon: '#️⃣', path: '/tools/hashtag-generator', credits: 0, category: 'optimization', description: txt.hashtagGeneratorDesc, free: true },
    { name: txt.bioGenerator, icon: '👤', path: '/tools/bio-generator', credits: 0, category: 'optimization', description: txt.bioGeneratorDesc, free: true },
    { name: txt.qrCode, icon: '📱', path: '/tools/qr-code-generator', credits: 0, category: 'optimization', description: txt.qrCodeDesc, free: true },
    
    { name: txt.postScheduler, icon: '📅', path: '/tools/post-scheduler', credits: 0, category: 'helper', description: txt.postSchedulerDesc, free: true },
    { name: txt.contentCalendar, icon: '🗓️', path: '/tools/content-calendar', credits: 0, category: 'helper', description: txt.contentCalendarDesc, free: true },
  ]

  const categories = [
    { id: 'all', name: txt.all, icon: '🎯' },
    { id: 'video', name: txt.video, icon: '📹' },
    { id: 'content', name: txt.content, icon: '✍️' },
    { id: 'analysis', name: txt.analysis, icon: '📊' },
    { id: 'optimization', name: txt.optimization, icon: '⚡' },
    { id: 'helper', name: txt.helper, icon: '🛠️' },
  ]

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-400">{txt.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-white">M</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white hidden sm:block">Media Tool Kit</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
                <span className="text-yellow-400">💰</span>
                <span className="font-bold text-white">{credits?.balance || 0}</span>
                <span className="text-gray-400 text-sm">{txt.credits}</span>
              </div>

              {dailyAdsWatched < MAX_DAILY_ADS && (
                <button
                  onClick={() => setShowAdModal(true)}
                  className="flex items-center gap-2 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition"
                >
                  <span>🎬</span>
                  <span className="text-sm">{txt.watchAd}</span>
                </button>
              )}

              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className={`px-2 py-1 rounded text-xs transition ${
                      language === lang.code ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>

              <button onClick={handleLogout} className="text-gray-400 hover:text-white transition text-sm">
                {txt.logout}
              </button>
            </div>

            <div className="flex md:hidden items-center gap-3">
              <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-lg">
                <span className="text-yellow-400 text-sm">💰</span>
                <span className="font-bold text-white text-sm">{credits?.balance || 0}</span>
              </div>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 animate-fadeIn">
              <div className="flex flex-col gap-3">
                {dailyAdsWatched < MAX_DAILY_ADS && (
                  <button
                    onClick={() => { setShowAdModal(true); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl"
                  >
                    <span>🎬</span>
                    <span>{txt.watchAdCredits}</span>
                  </button>
                )}

                <div className="flex items-center justify-center gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as Language)}
                      className={`px-3 py-2 rounded-lg text-sm transition flex items-center gap-1 ${
                        language === lang.code ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>

                <button onClick={handleLogout} className="text-gray-400 hover:text-white py-2">
                  {txt.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            {txt.welcome} 👋
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">{txt.whatToDo}</p>
        </div>

        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder={txt.searchTools}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm sm:text-base"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition text-sm ${
                  selectedCategory === cat.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTools.map((tool, index) => (
            <Link
              key={index}
              href={tool.path}
              className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 active:scale-[0.98] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>

              {tool.new && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="bg-green-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-full">
                    {txt.new}
                  </span>
                </div>
              )}

              {tool.free && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-full">
                    {txt.free}
                  </span>
                </div>
              )}

              <div className="relative">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{tool.icon}</div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-400 transition">
                  {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {tool.credits === 0 ? (
                      <span className="text-xs font-bold text-green-400">{txt.free}</span>
                    ) : (
                      <>
                        <span className="text-yellow-400 text-sm">💰</span>
                        <span className="text-xs sm:text-sm font-bold text-yellow-400">{tool.credits}</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">{txt.credits}</span>
                      </>
                    )}
                  </div>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{txt.noTools}</h3>
            <p className="text-gray-400 text-sm sm:text-base">{txt.tryDifferent}</p>
          </div>
        )}
      </main>

      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-5 sm:p-6 border border-gray-700">
            {!adWatching ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl sm:text-6xl mb-4">🎬</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{txt.watchAdTitle}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{txt.watchAdDesc}</p>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">{txt.dailyRemaining}</span>
                    <span className="text-white font-bold">{MAX_DAILY_ADS - dailyAdsWatched} / {MAX_DAILY_ADS}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${((MAX_DAILY_ADS - dailyAdsWatched) / MAX_DAILY_ADS) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {dailyAdsWatched >= MAX_DAILY_ADS ? (
                  <div className="text-center text-yellow-400 mb-4 text-sm">⚠️ {txt.dailyLimitReached}</div>
                ) : (
                  <button
                    onClick={handleWatchAd}
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-bold text-base sm:text-lg transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>▶️</span>
                    {txt.watchAdCredits}
                  </button>
                )}

                <button
                  onClick={() => setShowAdModal(false)}
                  className="w-full py-3 mt-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition text-sm sm:text-base"
                >
                  {txt.close}
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="text-5xl sm:text-6xl mb-4 animate-pulse">📺</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{txt.watchingAd}</h3>
                
                <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 sm:h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${adProgress}%` }}
                  ></div>
                </div>
                
                <p className="text-gray-400 text-sm">
                  {Math.ceil(15 - (adProgress / 100 * 15))} {txt.secondsLeft}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
