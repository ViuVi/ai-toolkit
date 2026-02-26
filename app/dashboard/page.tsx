'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage, Language } from '@/lib/LanguageContext'

const texts: Record<Language, any> = {
  en: {
    welcome: 'Welcome back',
    credits: 'Credits',
    searchTools: 'Search tools...',
    watchAd: '🎬 Watch Ad (+5)',
    adsRemaining: 'ads remaining',
    logout: 'Logout',
    loading: 'Loading...',
    categories: { all: 'All', video: 'Video', content: 'Content', analysis: 'Analysis', optimization: 'Optimization', helper: 'Helper' },
    free: 'FREE',
    new: 'NEW',
    noTools: 'No tools found',
    adModal: { title: 'Watch Ad', subtitle: 'Watch a 15s ad to earn 5 credits', watching: 'Watching...', earn: 'Earn 5 Credits', close: 'Close', maxReached: 'Daily limit reached' },
    tools: {
      videoScript: { name: 'Video Script Writer', desc: 'Scripts for YouTube & TikTok' },
      textToSpeech: { name: 'Text to Speech', desc: 'Convert text to speech' },
      subtitleGen: { name: 'Subtitle Generator', desc: 'Auto subtitles' },
      hookGen: { name: 'Hook Generator', desc: 'Attention-grabbing hooks' },
      captionWriter: { name: 'Caption Writer', desc: 'Professional captions' },
      platformAdapter: { name: 'Platform Adapter', desc: 'Adapt content' },
      summarizer: { name: 'Summarizer', desc: 'Summarize texts' },
      competitorAnalysis: { name: 'Competitor Analysis', desc: 'Analyze competitors' },
      trendDetector: { name: 'Trend Detector', desc: 'Discover trends' },
      engagementPredictor: { name: 'Engagement Predictor', desc: 'Predict engagement' },
      brandVoice: { name: 'Brand Voice', desc: 'Analyze brand voice' },
      sentiment: { name: 'Sentiment Analysis', desc: 'Analyze emotions' },
      hashtagGen: { name: 'Hashtag Generator', desc: 'Trending hashtags' },
      viralScore: { name: 'Viral Score', desc: 'Check viral potential' },
      bioGen: { name: 'Bio Generator', desc: 'Professional bios' },
      contentCalendar: { name: 'Content Calendar', desc: 'Plan content' },
      postScheduler: { name: 'Post Scheduler', desc: 'Schedule posts' },
      qrCode: { name: 'QR Code Generator', desc: 'Create QR codes' }
    }
  },
  tr: {
    welcome: 'Hoş geldin',
    credits: 'Kredi',
    searchTools: 'Araç ara...',
    watchAd: '🎬 Reklam İzle (+5)',
    adsRemaining: 'reklam hakkı',
    logout: 'Çıkış',
    loading: 'Yükleniyor...',
    categories: { all: 'Tümü', video: 'Video', content: 'İçerik', analysis: 'Analiz', optimization: 'Optimizasyon', helper: 'Yardımcı' },
    free: 'ÜCRETSİZ',
    new: 'YENİ',
    noTools: 'Araç bulunamadı',
    adModal: { title: 'Reklam İzle', subtitle: '5 kredi kazanmak için 15sn reklam izle', watching: 'İzleniyor...', earn: '5 Kredi Kazan', close: 'Kapat', maxReached: 'Günlük limit doldu' },
    tools: {
      videoScript: { name: 'Video Script Yazarı', desc: 'YouTube & TikTok için' },
      textToSpeech: { name: 'Seslendirme', desc: 'Metni sese dönüştür' },
      subtitleGen: { name: 'Altyazı Üretici', desc: 'Otomatik altyazı' },
      hookGen: { name: 'Hook Üretici', desc: 'Dikkat çeken hooklar' },
      captionWriter: { name: 'Caption Yazarı', desc: 'Profesyonel captionlar' },
      platformAdapter: { name: 'Platform Uyarlayıcı', desc: 'İçeriği uyarla' },
      summarizer: { name: 'Metin Özetleyici', desc: 'Metinleri özetle' },
      competitorAnalysis: { name: 'Rakip Analizi', desc: 'Rakipleri analiz et' },
      trendDetector: { name: 'Trend Dedektörü', desc: 'Trendleri keşfet' },
      engagementPredictor: { name: 'Etkileşim Tahmini', desc: 'Etkileşim tahmini' },
      brandVoice: { name: 'Marka Sesi', desc: 'Marka analizi' },
      sentiment: { name: 'Duygu Analizi', desc: 'Duyguları analiz et' },
      hashtagGen: { name: 'Hashtag Üretici', desc: 'Trend hashtagler' },
      viralScore: { name: 'Viral Skoru', desc: 'Viral potansiyel' },
      bioGen: { name: 'Bio Üretici', desc: 'Profesyonel biolar' },
      contentCalendar: { name: 'İçerik Takvimi', desc: 'İçeriğini planla' },
      postScheduler: { name: 'Gönderi Planlayıcı', desc: 'Gönderilerini zamanla' },
      qrCode: { name: 'QR Kod Üretici', desc: 'QR kod oluştur' }
    }
  },
  ru: {
    welcome: 'С возвращением',
    credits: 'Кредиты',
    searchTools: 'Поиск...',
    watchAd: '🎬 Реклама (+5)',
    adsRemaining: 'реклам осталось',
    logout: 'Выход',
    loading: 'Загрузка...',
    categories: { all: 'Все', video: 'Видео', content: 'Контент', analysis: 'Анализ', optimization: 'Оптимизация', helper: 'Помощник' },
    free: 'БЕСПЛАТНО',
    new: 'НОВОЕ',
    noTools: 'Ничего не найдено',
    adModal: { title: 'Смотреть рекламу', subtitle: '15с рекламы = 5 кредитов', watching: 'Просмотр...', earn: 'Получить 5', close: 'Закрыть', maxReached: 'Лимит достигнут' },
    tools: {
      videoScript: { name: 'Сценарист видео', desc: 'Скрипты для видео' },
      textToSpeech: { name: 'Озвучка текста', desc: 'Текст в речь' },
      subtitleGen: { name: 'Субтитры', desc: 'Автосубтитры' },
      hookGen: { name: 'Генератор хуков', desc: 'Захватывающие хуки' },
      captionWriter: { name: 'Автор подписей', desc: 'Профессиональные подписи' },
      platformAdapter: { name: 'Адаптер', desc: 'Адаптация контента' },
      summarizer: { name: 'Суммаризатор', desc: 'Резюме текстов' },
      competitorAnalysis: { name: 'Анализ конкурентов', desc: 'Анализ конкурентов' },
      trendDetector: { name: 'Детектор трендов', desc: 'Открыть тренды' },
      engagementPredictor: { name: 'Прогноз', desc: 'Прогноз вовлеченности' },
      brandVoice: { name: 'Голос бренда', desc: 'Анализ бренда' },
      sentiment: { name: 'Анализ настроений', desc: 'Анализ эмоций' },
      hashtagGen: { name: 'Хэштеги', desc: 'Трендовые хэштеги' },
      viralScore: { name: 'Вирусный рейтинг', desc: 'Вирусный потенциал' },
      bioGen: { name: 'Генератор био', desc: 'Профессиональные био' },
      contentCalendar: { name: 'Контент-календарь', desc: 'Планируйте контент' },
      postScheduler: { name: 'Планировщик', desc: 'Планируйте посты' },
      qrCode: { name: 'QR-код', desc: 'Создать QR-код' }
    }
  },
  de: {
    welcome: 'Willkommen zurück',
    credits: 'Credits',
    searchTools: 'Suchen...',
    watchAd: '🎬 Werbung (+5)',
    adsRemaining: 'Werbungen übrig',
    logout: 'Abmelden',
    loading: 'Laden...',
    categories: { all: 'Alle', video: 'Video', content: 'Inhalt', analysis: 'Analyse', optimization: 'Optimierung', helper: 'Helfer' },
    free: 'KOSTENLOS',
    new: 'NEU',
    noTools: 'Keine Tools gefunden',
    adModal: { title: 'Werbung ansehen', subtitle: '15s Werbung = 5 Credits', watching: 'Lädt...', earn: '5 Credits', close: 'Schließen', maxReached: 'Limit erreicht' },
    tools: {
      videoScript: { name: 'Video-Skript', desc: 'Skripte für Videos' },
      textToSpeech: { name: 'Text zu Sprache', desc: 'Text in Sprache' },
      subtitleGen: { name: 'Untertitel', desc: 'Auto-Untertitel' },
      hookGen: { name: 'Hook-Generator', desc: 'Aufmerksamkeitsstarke Hooks' },
      captionWriter: { name: 'Caption-Autor', desc: 'Professionelle Captions' },
      platformAdapter: { name: 'Plattform-Adapter', desc: 'Inhalte anpassen' },
      summarizer: { name: 'Zusammenfasser', desc: 'Texte zusammenfassen' },
      competitorAnalysis: { name: 'Wettbewerbsanalyse', desc: 'Konkurrenten analysieren' },
      trendDetector: { name: 'Trend-Detektor', desc: 'Trends entdecken' },
      engagementPredictor: { name: 'Engagement-Vorhersage', desc: 'Engagement vorhersagen' },
      brandVoice: { name: 'Markenstimme', desc: 'Marke analysieren' },
      sentiment: { name: 'Stimmungsanalyse', desc: 'Emotionen analysieren' },
      hashtagGen: { name: 'Hashtag-Generator', desc: 'Trendende Hashtags' },
      viralScore: { name: 'Viral-Score', desc: 'Virales Potenzial' },
      bioGen: { name: 'Bio-Generator', desc: 'Professionelle Bios' },
      contentCalendar: { name: 'Content-Kalender', desc: 'Inhalte planen' },
      postScheduler: { name: 'Post-Planer', desc: 'Posts planen' },
      qrCode: { name: 'QR-Code', desc: 'QR-Codes erstellen' }
    }
  },
  fr: {
    welcome: 'Bon retour',
    credits: 'Crédits',
    searchTools: 'Rechercher...',
    watchAd: '🎬 Pub (+5)',
    adsRemaining: 'pubs restantes',
    logout: 'Déconnexion',
    loading: 'Chargement...',
    categories: { all: 'Tous', video: 'Vidéo', content: 'Contenu', analysis: 'Analyse', optimization: 'Optimisation', helper: 'Assistant' },
    free: 'GRATUIT',
    new: 'NOUVEAU',
    noTools: 'Aucun outil trouvé',
    adModal: { title: 'Regarder une pub', subtitle: '15s de pub = 5 crédits', watching: 'Lecture...', earn: '5 Crédits', close: 'Fermer', maxReached: 'Limite atteinte' },
    tools: {
      videoScript: { name: 'Scénariste', desc: 'Scripts vidéo' },
      textToSpeech: { name: 'Synthèse vocale', desc: 'Texte en parole' },
      subtitleGen: { name: 'Sous-titres', desc: 'Sous-titres auto' },
      hookGen: { name: 'Générateur de hooks', desc: 'Hooks accrocheurs' },
      captionWriter: { name: 'Rédacteur', desc: 'Légendes pro' },
      platformAdapter: { name: 'Adaptateur', desc: 'Adapter le contenu' },
      summarizer: { name: 'Résumeur', desc: 'Résumer les textes' },
      competitorAnalysis: { name: 'Analyse concurrentielle', desc: 'Analyser les concurrents' },
      trendDetector: { name: 'Détecteur de tendances', desc: 'Découvrir les tendances' },
      engagementPredictor: { name: 'Prédiction', desc: "Prédire l'engagement" },
      brandVoice: { name: 'Voix de marque', desc: 'Analyser la marque' },
      sentiment: { name: 'Analyse de sentiment', desc: 'Analyser les émotions' },
      hashtagGen: { name: 'Générateur de hashtags', desc: 'Hashtags tendance' },
      viralScore: { name: 'Score viral', desc: 'Potentiel viral' },
      bioGen: { name: 'Générateur de bio', desc: 'Bios pro' },
      contentCalendar: { name: 'Calendrier', desc: 'Planifier le contenu' },
      postScheduler: { name: 'Planificateur', desc: 'Planifier les posts' },
      qrCode: { name: 'QR Code', desc: 'Créer des QR codes' }
    }
  }
}

const languages: { code: Language; flag: string }[] = [
  { code: 'en', flag: '🇺🇸' },
  { code: 'tr', flag: '🇹🇷' },
  { code: 'ru', flag: '🇷🇺' },
  { code: 'de', flag: '🇩🇪' },
  { code: 'fr', flag: '🇫🇷' }
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

  useEffect(() => { checkUser(); checkDailyAds() }, [])

  const checkDailyAds = () => {
    try {
      const today = new Date().toDateString()
      const storedDate = localStorage.getItem('adWatchDate')
      const storedCount = localStorage.getItem('adWatchCount')
      if (storedDate === today && storedCount) { setDailyAdsWatched(parseInt(storedCount)) }
      else { localStorage.setItem('adWatchDate', today); localStorage.setItem('adWatchCount', '0'); setDailyAdsWatched(0) }
    } catch {}
  }

  const handleWatchAd = async () => {
    if (dailyAdsWatched >= MAX_DAILY_ADS) return
    setAdWatching(true); setAdProgress(0)
    const interval = setInterval(() => { setAdProgress(prev => prev >= 100 ? 100 : prev + (100 / 15)) }, 1000)
    setTimeout(async () => {
      clearInterval(interval); setAdProgress(100)
      if (user && credits) { await supabase.from('credits').update({ balance: credits.balance + 5 }).eq('user_id', user.id); setCredits({ ...credits, balance: credits.balance + 5 }) }
      const newCount = dailyAdsWatched + 1; setDailyAdsWatched(newCount)
      try { localStorage.setItem('adWatchCount', newCount.toString()) } catch {}
      setTimeout(() => { setAdWatching(false); setShowAdModal(false); setAdProgress(0) }, 500)
    }, 15000)
  }

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: creditsData } = await supabase.from('credits').select('*').eq('user_id', user.id).single()
      if (!creditsData) { const { data: newCredits } = await supabase.from('credits').insert({ user_id: user.id, balance: 50 }).select().single(); setCredits(newCredits) }
      else { setCredits(creditsData) }
    } catch (error) { console.error(error) }
    setLoading(false)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  const tools = [
    { id: 'videoScript', icon: '🎬', path: '/tools/video-script', credits: 4, category: 'video' },
    { id: 'textToSpeech', icon: '🔊', path: '/tools/text-to-speech', credits: 3, category: 'video', isNew: true },
    { id: 'subtitleGen', icon: '📝', path: '/tools/subtitle-generator', credits: 5, category: 'video' },
    { id: 'hookGen', icon: '🎣', path: '/tools/hook-generator', credits: 2, category: 'content' },
    { id: 'captionWriter', icon: '✍️', path: '/tools/caption-writer', credits: 2, category: 'content' },
    { id: 'platformAdapter', icon: '🔄', path: '/tools/platform-adapter', credits: 3, category: 'content' },
    { id: 'summarizer', icon: '📋', path: '/tools/summarize', credits: 2, category: 'content' },
    { id: 'competitorAnalysis', icon: '🔍', path: '/tools/competitor-analyzer', credits: 8, category: 'analysis' },
    { id: 'trendDetector', icon: '📊', path: '/tools/trend-detector', credits: 5, category: 'analysis' },
    { id: 'engagementPredictor', icon: '📈', path: '/tools/engagement-predictor', credits: 5, category: 'analysis' },
    { id: 'brandVoice', icon: '🎯', path: '/tools/brand-voice', credits: 2, category: 'analysis' },
    { id: 'sentiment', icon: '😊', path: '/tools/sentiment', credits: 3, category: 'analysis' },
    { id: 'hashtagGen', icon: '#️⃣', path: '/tools/hashtag-generator', credits: 0, category: 'optimization', isFree: true },
    { id: 'viralScore', icon: '🚀', path: '/tools/viral-score', credits: 4, category: 'optimization' },
    { id: 'bioGen', icon: '👤', path: '/tools/bio-generator', credits: 0, category: 'helper', isFree: true },
    { id: 'contentCalendar', icon: '📅', path: '/tools/content-calendar', credits: 5, category: 'helper' },
    { id: 'postScheduler', icon: '⏰', path: '/tools/post-scheduler', credits: 3, category: 'helper' },
    { id: 'qrCode', icon: '📱', path: '/tools/qr-code-generator', credits: 0, category: 'helper', isFree: true }
  ]

  const filteredTools = tools.filter(tool => {
    const toolInfo = t.tools[tool.id as keyof typeof t.tools]
    const matchesSearch = toolInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">{t.loading}</div></div>

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"><span className="text-xl font-bold text-white">M</span></div>
              <span className="text-xl font-bold text-white hidden sm:block">Media Tool Kit</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition border border-gray-700">
                  {languages.find(l => l.code === language)?.flag} {language.toUpperCase()}
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === lang.code ? 'text-purple-400' : 'text-gray-300'}`}>{lang.flag} {lang.code.toUpperCase()}</button>))}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg"><span className="text-yellow-400">⚡</span><span className="text-white font-semibold">{credits?.balance || 0}</span><span className="text-gray-400 text-sm hidden sm:block">{t.credits}</span></div>
              {dailyAdsWatched < MAX_DAILY_ADS && (<button onClick={() => setShowAdModal(true)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-3 py-2 rounded-lg text-sm font-medium transition hidden sm:flex items-center gap-1">{t.watchAd}</button>)}
              <button onClick={handleLogout} className="text-gray-400 hover:text-white transition text-sm">{t.logout}</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">{t.welcome}, {user?.email?.split('@')[0]}! 👋</h1></div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1"><input type="text" placeholder={t.searchTools} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          <div className="flex gap-2 overflow-x-auto pb-2">{Object.entries(t.categories).map(([key, label]) => (<button key={key} onClick={() => setSelectedCategory(key)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${selectedCategory === key ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{label as string}</button>))}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const toolInfo = t.tools[tool.id as keyof typeof t.tools]
            return (
              <Link key={tool.id} href={tool.path} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all hover:transform hover:scale-105 group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <div className="flex gap-2">
                    {tool.isFree && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">{t.free}</span>}
                    {tool.isNew && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">{t.new}</span>}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition">{toolInfo?.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{toolInfo?.desc}</p>
                <div className="flex items-center text-sm text-gray-500"><span className="text-yellow-400">⚡</span><span className="ml-1">{tool.credits} {t.credits}</span></div>
              </Link>
            )
          })}
        </div>
        {filteredTools.length === 0 && <div className="text-center py-12"><p className="text-gray-400">{t.noTools}</p></div>}
      </main>

      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            {adWatching ? (
              <div className="text-center"><div className="text-6xl mb-4">📺</div><p className="text-white text-xl mb-4">{t.adModal.watching}</p><div className="w-full bg-gray-700 rounded-full h-3 mb-2"><div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all" style={{ width: `${adProgress}%` }}></div></div><p className="text-gray-400">{Math.round(adProgress)}%</p></div>
            ) : (
              <div className="text-center"><div className="text-6xl mb-4">🎬</div><h3 className="text-2xl font-bold text-white mb-2">{t.adModal.title}</h3><p className="text-gray-400 mb-2">{t.adModal.subtitle}</p><p className="text-sm text-gray-500 mb-6">{MAX_DAILY_ADS - dailyAdsWatched} {t.adsRemaining}</p><div className="flex gap-4"><button onClick={() => setShowAdModal(false)} className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition">{t.adModal.close}</button><button onClick={handleWatchAd} disabled={dailyAdsWatched >= MAX_DAILY_ADS} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50">{dailyAdsWatched >= MAX_DAILY_ADS ? t.adModal.maxReached : t.adModal.earn}</button></div></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
