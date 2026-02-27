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
    pro: 'Go Pro',
    credits: 'Credits',
    watchAd: 'Earn Credits',
    earnCredits: 'Watch ad, earn 5 credits!',
    logout: 'Logout',
    welcome: 'Welcome back',
    subtitle: 'What would you like to create today?',
    searchPlaceholder: 'Search tools...',
    freeTag: 'FREE',
    newTag: 'NEW',
    hotTag: 'HOT',
    creditUnit: 'credits',
    loading: 'Loading...',
    noTools: 'No tools found',
    adModal: {
      title: '🎬 Earn Free Credits',
      subtitle: 'Watch a 15-second ad to earn 5 credits instantly!',
      remaining: 'ads remaining today',
      watching: 'Watching ad...',
      earnBtn: 'Watch Ad (+5 Credits)',
      limitReached: 'Daily limit reached (5/5)',
      close: 'Close'
    },
    categories: {
      all: 'All Tools',
      video: 'Video',
      content: 'Content',
      analysis: 'Analytics',
      optimization: 'Optimization',
      planning: 'Planning'
    },
    tools: {
      videoScript: { name: 'Video Script Writer', desc: 'Create engaging scripts for YouTube, TikTok & Reels' },
      textToSpeech: { name: 'Text to Speech', desc: 'Convert your text into natural-sounding voice' },
      subtitleGenerator: { name: 'Subtitle Generator', desc: 'Auto-generate subtitles for your videos' },
      hookGenerator: { name: 'Hook Generator', desc: 'Create attention-grabbing opening hooks' },
      captionWriter: { name: 'Caption Writer', desc: 'Write engaging captions that convert' },
      platformAdapter: { name: 'Platform Adapter', desc: 'Adapt content for different platforms' },
      summarizer: { name: 'Text Summarizer', desc: 'Summarize long texts into key points' },
      competitorAnalysis: { name: 'Competitor Analysis', desc: 'Analyze competitor strategies & content' },
      trendDetector: { name: 'Trend Detector', desc: 'Discover trending topics in your niche' },
      engagementPredictor: { name: 'Engagement Predictor', desc: 'Predict how your content will perform' },
      brandVoice: { name: 'Brand Voice', desc: 'Define and maintain consistent brand voice' },
      viralScore: { name: 'Viral Score', desc: 'Calculate viral potential of your content' },
      sentiment: { name: 'Sentiment Analysis', desc: 'Analyze emotions in text and comments' },
      hashtagGenerator: { name: 'Hashtag Generator', desc: 'Generate trending hashtags for reach' },
      bioGenerator: { name: 'Bio Generator', desc: 'Create compelling profile bios' },
      qrCode: { name: 'QR Code Generator', desc: 'Generate QR codes for links & profiles' },
      postScheduler: { name: 'Post Scheduler', desc: 'Find the best times to post' },
      contentCalendar: { name: 'Content Calendar', desc: 'Plan your content for the month' }
    }
  },
  tr: {
    platform: 'İçerik Üretim Platformu',
    pro: 'Pro\'ya Geç',
    credits: 'Kredi',
    watchAd: 'Kredi Kazan',
    earnCredits: 'Reklam izle, 5 kredi kazan!',
    logout: 'Çıkış Yap',
    welcome: 'Tekrar hoş geldin',
    subtitle: 'Bugün ne oluşturmak istersin?',
    searchPlaceholder: 'Araç ara...',
    freeTag: 'ÜCRETSİZ',
    newTag: 'YENİ',
    hotTag: 'POPÜLER',
    creditUnit: 'kredi',
    loading: 'Yükleniyor...',
    noTools: 'Araç bulunamadı',
    adModal: {
      title: '🎬 Ücretsiz Kredi Kazan',
      subtitle: '15 saniyelik reklam izleyerek anında 5 kredi kazan!',
      remaining: 'reklam hakkı kaldı',
      watching: 'Reklam izleniyor...',
      earnBtn: 'Reklam İzle (+5 Kredi)',
      limitReached: 'Günlük limit doldu (5/5)',
      close: 'Kapat'
    },
    categories: {
      all: 'Tüm Araçlar',
      video: 'Video',
      content: 'İçerik',
      analysis: 'Analiz',
      optimization: 'Optimizasyon',
      planning: 'Planlama'
    },
    tools: {
      videoScript: { name: 'Video Script Yazarı', desc: 'YouTube, TikTok ve Reels için script oluştur' },
      textToSpeech: { name: 'Seslendirme', desc: 'Metni doğal sese dönüştür' },
      subtitleGenerator: { name: 'Altyazı Üretici', desc: 'Videolar için otomatik altyazı oluştur' },
      hookGenerator: { name: 'Hook Üretici', desc: 'Dikkat çeken açılış hooklarını oluştur' },
      captionWriter: { name: 'Caption Yazarı', desc: 'Etkileşim getiren captionlar yaz' },
      platformAdapter: { name: 'Platform Uyarlayıcı', desc: 'İçeriği farklı platformlara uyarla' },
      summarizer: { name: 'Metin Özetleyici', desc: 'Uzun metinleri önemli noktalara özetle' },
      competitorAnalysis: { name: 'Rakip Analizi', desc: 'Rakip stratejilerini ve içeriklerini analiz et' },
      trendDetector: { name: 'Trend Dedektörü', desc: 'Nişindeki trend konuları keşfet' },
      engagementPredictor: { name: 'Etkileşim Tahmini', desc: 'İçeriğinin nasıl performans göstereceğini tahmin et' },
      brandVoice: { name: 'Marka Sesi', desc: 'Tutarlı marka sesini tanımla ve koru' },
      viralScore: { name: 'Viral Skor', desc: 'İçeriğinin viral potansiyelini hesapla' },
      sentiment: { name: 'Duygu Analizi', desc: 'Metin ve yorumlardaki duyguları analiz et' },
      hashtagGenerator: { name: 'Hashtag Üretici', desc: 'Erişim için trend hashtagler üret' },
      bioGenerator: { name: 'Bio Üretici', desc: 'Etkileyici profil bioları oluştur' },
      qrCode: { name: 'QR Kod Üretici', desc: 'Link ve profiller için QR kod oluştur' },
      postScheduler: { name: 'Paylaşım Zamanlayıcı', desc: 'En iyi paylaşım zamanlarını bul' },
      contentCalendar: { name: 'İçerik Takvimi', desc: 'Aylık içerik planını oluştur' }
    }
  },
  ru: {
    platform: 'Платформа для контента',
    pro: 'Перейти на Pro',
    credits: 'Кредиты',
    watchAd: 'Получить кредиты',
    earnCredits: 'Смотрите рекламу, получайте 5 кредитов!',
    logout: 'Выход',
    welcome: 'С возвращением',
    subtitle: 'Что вы хотите создать сегодня?',
    searchPlaceholder: 'Поиск инструментов...',
    freeTag: 'БЕСПЛАТНО',
    newTag: 'НОВОЕ',
    hotTag: 'ГОРЯЧЕЕ',
    creditUnit: 'кредитов',
    loading: 'Загрузка...',
    noTools: 'Инструменты не найдены',
    adModal: { title: '🎬 Бесплатные кредиты', subtitle: 'Посмотрите 15-секундную рекламу и получите 5 кредитов!', remaining: 'реклам осталось сегодня', watching: 'Просмотр рекламы...', earnBtn: 'Смотреть (+5 кредитов)', limitReached: 'Дневной лимит (5/5)', close: 'Закрыть' },
    categories: { all: 'Все инструменты', video: 'Видео', content: 'Контент', analysis: 'Аналитика', optimization: 'Оптимизация', planning: 'Планирование' },
    tools: {
      videoScript: { name: 'Сценарист видео', desc: 'Создавайте сценарии для YouTube и TikTok' },
      textToSpeech: { name: 'Озвучка текста', desc: 'Превращайте текст в естественную речь' },
      subtitleGenerator: { name: 'Генератор субтитров', desc: 'Автоматические субтитры для видео' },
      hookGenerator: { name: 'Генератор хуков', desc: 'Создавайте привлекающие внимание хуки' },
      captionWriter: { name: 'Автор подписей', desc: 'Пишите вовлекающие подписи' },
      platformAdapter: { name: 'Адаптер платформ', desc: 'Адаптируйте контент для разных платформ' },
      summarizer: { name: 'Суммаризатор', desc: 'Резюмируйте длинные тексты' },
      competitorAnalysis: { name: 'Анализ конкурентов', desc: 'Анализируйте стратегии конкурентов' },
      trendDetector: { name: 'Детектор трендов', desc: 'Находите трендовые темы' },
      engagementPredictor: { name: 'Прогноз вовлеченности', desc: 'Прогнозируйте успех контента' },
      brandVoice: { name: 'Голос бренда', desc: 'Определите голос вашего бренда' },
      viralScore: { name: 'Вирусный рейтинг', desc: 'Рассчитайте вирусный потенциал' },
      sentiment: { name: 'Анализ настроений', desc: 'Анализируйте эмоции в тексте' },
      hashtagGenerator: { name: 'Генератор хэштегов', desc: 'Генерируйте трендовые хэштеги' },
      bioGenerator: { name: 'Генератор био', desc: 'Создавайте привлекательные био' },
      qrCode: { name: 'QR код', desc: 'Генерируйте QR коды для ссылок' },
      postScheduler: { name: 'Планировщик постов', desc: 'Найдите лучшее время для постов' },
      contentCalendar: { name: 'Контент-календарь', desc: 'Планируйте контент на месяц' }
    }
  },
  de: {
    platform: 'Content-Erstellungsplattform',
    pro: 'Auf Pro upgraden',
    credits: 'Credits',
    watchAd: 'Credits verdienen',
    earnCredits: 'Werbung ansehen, 5 Credits verdienen!',
    logout: 'Abmelden',
    welcome: 'Willkommen zurück',
    subtitle: 'Was möchten Sie heute erstellen?',
    searchPlaceholder: 'Tools suchen...',
    freeTag: 'KOSTENLOS',
    newTag: 'NEU',
    hotTag: 'BELIEBT',
    creditUnit: 'Credits',
    loading: 'Laden...',
    noTools: 'Keine Tools gefunden',
    adModal: { title: '🎬 Kostenlose Credits', subtitle: '15-Sekunden-Werbung ansehen und 5 Credits erhalten!', remaining: 'Werbungen übrig heute', watching: 'Werbung läuft...', earnBtn: 'Ansehen (+5 Credits)', limitReached: 'Tageslimit erreicht (5/5)', close: 'Schließen' },
    categories: { all: 'Alle Tools', video: 'Video', content: 'Inhalt', analysis: 'Analytik', optimization: 'Optimierung', planning: 'Planung' },
    tools: {
      videoScript: { name: 'Video-Skript-Autor', desc: 'Erstellen Sie Skripte für YouTube und TikTok' },
      textToSpeech: { name: 'Text zu Sprache', desc: 'Wandeln Sie Text in natürliche Sprache um' },
      subtitleGenerator: { name: 'Untertitel-Generator', desc: 'Automatische Untertitel für Videos' },
      hookGenerator: { name: 'Hook-Generator', desc: 'Erstellen Sie aufmerksamkeitsstarke Hooks' },
      captionWriter: { name: 'Caption-Autor', desc: 'Schreiben Sie ansprechende Captions' },
      platformAdapter: { name: 'Plattform-Adapter', desc: 'Passen Sie Inhalte für Plattformen an' },
      summarizer: { name: 'Zusammenfasser', desc: 'Fassen Sie lange Texte zusammen' },
      competitorAnalysis: { name: 'Wettbewerbsanalyse', desc: 'Analysieren Sie Wettbewerberstrategien' },
      trendDetector: { name: 'Trend-Detektor', desc: 'Entdecken Sie Trendthemen' },
      engagementPredictor: { name: 'Engagement-Vorhersage', desc: 'Sagen Sie Content-Erfolg voraus' },
      brandVoice: { name: 'Markenstimme', desc: 'Definieren Sie Ihre Markenstimme' },
      viralScore: { name: 'Viral-Score', desc: 'Berechnen Sie virales Potenzial' },
      sentiment: { name: 'Stimmungsanalyse', desc: 'Analysieren Sie Emotionen in Texten' },
      hashtagGenerator: { name: 'Hashtag-Generator', desc: 'Generieren Sie trendige Hashtags' },
      bioGenerator: { name: 'Bio-Generator', desc: 'Erstellen Sie ansprechende Bios' },
      qrCode: { name: 'QR-Code', desc: 'Generieren Sie QR-Codes für Links' },
      postScheduler: { name: 'Post-Planer', desc: 'Finden Sie die besten Posting-Zeiten' },
      contentCalendar: { name: 'Content-Kalender', desc: 'Planen Sie Ihren Monatsinhalt' }
    }
  },
  fr: {
    platform: 'Plateforme de création de contenu',
    pro: 'Passer à Pro',
    credits: 'Crédits',
    watchAd: 'Gagner des crédits',
    earnCredits: 'Regardez une pub, gagnez 5 crédits!',
    logout: 'Déconnexion',
    welcome: 'Bon retour',
    subtitle: 'Que voulez-vous créer aujourd\'hui?',
    searchPlaceholder: 'Rechercher des outils...',
    freeTag: 'GRATUIT',
    newTag: 'NOUVEAU',
    hotTag: 'POPULAIRE',
    creditUnit: 'crédits',
    loading: 'Chargement...',
    noTools: 'Aucun outil trouvé',
    adModal: { title: '🎬 Crédits gratuits', subtitle: 'Regardez une pub de 15 secondes pour 5 crédits!', remaining: 'pubs restantes aujourd\'hui', watching: 'Visionnage en cours...', earnBtn: 'Regarder (+5 crédits)', limitReached: 'Limite quotidienne (5/5)', close: 'Fermer' },
    categories: { all: 'Tous les outils', video: 'Vidéo', content: 'Contenu', analysis: 'Analytique', optimization: 'Optimisation', planning: 'Planification' },
    tools: {
      videoScript: { name: 'Scénariste vidéo', desc: 'Créez des scripts pour YouTube et TikTok' },
      textToSpeech: { name: 'Synthèse vocale', desc: 'Convertissez le texte en voix naturelle' },
      subtitleGenerator: { name: 'Générateur de sous-titres', desc: 'Sous-titres automatiques pour vidéos' },
      hookGenerator: { name: 'Générateur de hooks', desc: 'Créez des hooks accrocheurs' },
      captionWriter: { name: 'Rédacteur de légendes', desc: 'Écrivez des légendes engageantes' },
      platformAdapter: { name: 'Adaptateur de plateforme', desc: 'Adaptez le contenu pour les plateformes' },
      summarizer: { name: 'Résumeur', desc: 'Résumez les longs textes' },
      competitorAnalysis: { name: 'Analyse concurrentielle', desc: 'Analysez les stratégies des concurrents' },
      trendDetector: { name: 'Détecteur de tendances', desc: 'Découvrez les sujets tendance' },
      engagementPredictor: { name: 'Prédiction d\'engagement', desc: 'Prédisez le succès du contenu' },
      brandVoice: { name: 'Voix de marque', desc: 'Définissez votre voix de marque' },
      viralScore: { name: 'Score viral', desc: 'Calculez le potentiel viral' },
      sentiment: { name: 'Analyse de sentiment', desc: 'Analysez les émotions dans le texte' },
      hashtagGenerator: { name: 'Générateur de hashtags', desc: 'Générez des hashtags tendance' },
      bioGenerator: { name: 'Générateur de bio', desc: 'Créez des bios captivantes' },
      qrCode: { name: 'Code QR', desc: 'Générez des codes QR pour les liens' },
      postScheduler: { name: 'Planificateur de posts', desc: 'Trouvez les meilleurs horaires' },
      contentCalendar: { name: 'Calendrier de contenu', desc: 'Planifiez votre contenu mensuel' }
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
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + (100 / 15)
      })
    }, 1000)
    setTimeout(async () => {
      clearInterval(interval)
      setAdProgress(100)
      if (user && credits) {
        await supabase.from('credits').update({ balance: credits.balance + 5, updated_at: new Date().toISOString() }).eq('user_id', user.id)
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
    if (!user) { router.push('/login'); return }
    setUser(user)
    const { data: creditsData } = await supabase.from('credits').select('*').eq('user_id', user.id).single()
    if (!creditsData) {
      const { data: newCredits } = await supabase.from('credits').insert({ user_id: user.id, balance: 50 }).select().single()
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
    { id: 'subtitleGenerator', icon: '📺', path: '/tools/subtitle-generator', credits: 5, category: 'video', hot: true },
    { id: 'hookGenerator', icon: '🎣', path: '/tools/hook-generator', credits: 2, category: 'content' },
    { id: 'captionWriter', icon: '✍️', path: '/tools/caption-writer', credits: 2, category: 'content' },
    { id: 'platformAdapter', icon: '🔄', path: '/tools/platform-adapter', credits: 3, category: 'content' },
    { id: 'summarizer', icon: '📝', path: '/tools/summarize', credits: 2, category: 'content' },
    { id: 'competitorAnalysis', icon: '🔍', path: '/tools/competitor-analyzer', credits: 8, category: 'analysis', hot: true },
    { id: 'trendDetector', icon: '📊', path: '/tools/trend-detector', credits: 5, category: 'analysis' },
    { id: 'engagementPredictor', icon: '📈', path: '/tools/engagement-predictor', credits: 5, category: 'analysis' },
    { id: 'brandVoice', icon: '🎯', path: '/tools/brand-voice', credits: 2, category: 'analysis' },
    { id: 'viralScore', icon: '🚀', path: '/tools/viral-score', credits: 3, category: 'analysis' },
    { id: 'sentiment', icon: '😊', path: '/tools/sentiment', credits: 3, category: 'analysis' },
    { id: 'hashtagGenerator', icon: '#️⃣', path: '/tools/hashtag-generator', credits: 0, category: 'optimization', free: true },
    { id: 'bioGenerator', icon: '👤', path: '/tools/bio-generator', credits: 0, category: 'optimization', free: true },
    { id: 'qrCode', icon: '📱', path: '/tools/qr-code-generator', credits: 0, category: 'optimization', free: true },
    { id: 'postScheduler', icon: '📅', path: '/tools/post-scheduler', credits: 0, category: 'planning', free: true },
    { id: 'contentCalendar', icon: '🗓️', path: '/tools/content-calendar', credits: 0, category: 'planning', free: true },
  ]

  const categories = [
    { id: 'all', icon: '🎯' },
    { id: 'video', icon: '📹' },
    { id: 'content', icon: '✍️' },
    { id: 'analysis', icon: '📊' },
    { id: 'optimization', icon: '⚡' },
    { id: 'planning', icon: '🗓️' },
  ]

  const filteredTools = tools.filter(tool => {
    const toolText = t.tools[tool.id as keyof typeof t.tools]
    const matchesSearch = toolText?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || toolText?.desc?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-white">Media Tool Kit</div>
                <div className="text-xs text-gray-400">{t.platform}</div>
              </div>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Dropdown - Ana sayfa gibi */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/80 rounded-lg text-sm font-medium text-gray-300 border border-gray-700 hover:bg-gray-700 transition">
                  <span>🌐</span>
                  <span>{language.toUpperCase()}</span>
                </button>
                <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {langs.map((l) => (
                    <button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pro Button */}
              <Link href="/pricing" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-500/30 transition">
                <span>💎</span>
                <span>{t.pro}</span>
              </Link>

              {/* Credits */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
                <span className="text-lg">💰</span>
                <div className="text-right">
                  <div className="text-xs text-gray-400 hidden sm:block">{t.credits}</div>
                  <div className="text-sm font-bold text-yellow-400">{credits?.balance || 0}</div>
                </div>
              </div>

              {/* Watch Ad Button */}
              <button onClick={() => setShowAdModal(true)} className="flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-400 rounded-lg px-2 py-1.5 transition" title={t.earnCredits}>
                <span>🎬</span>
                <span className="text-sm text-green-400 font-bold">+5</span>
              </button>

              {/* Logout - Yazı olarak */}
              <button onClick={handleLogout} className="px-3 py-1.5 bg-gray-800/80 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {t.welcome}, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        {/* Search & Categories */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{t.categories[cat.id as keyof typeof t.categories]}</span>
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
                  className="group relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
                >
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {tool.free && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">{t.freeTag}</span>}
                    {tool.new && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">{t.newTag}</span>}
                    {tool.hot && <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full border border-orange-500/30">{t.hotTag}</span>}
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{tool.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1.5 group-hover:text-purple-400 transition">{toolText?.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{toolText?.desc}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                    <span className={`text-sm font-medium ${tool.credits > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {tool.credits > 0 ? `${tool.credits} ${t.creditUnit}` : t.freeTag}
                    </span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">{t.noTools}</p>
          </div>
        )}
      </main>

      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full border border-gray-700 shadow-2xl">
            {adWatching ? (
              <div className="text-center py-4">
                <div className="text-6xl mb-4 animate-bounce">📺</div>
                <p className="text-white text-xl font-semibold mb-4">{t.adModal.watching}</p>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${adProgress}%` }}></div>
                </div>
                <p className="text-gray-400 text-sm">{Math.round(15 - (adProgress / 100) * 15)}s</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-xl font-bold text-white mb-2">{t.adModal.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{t.adModal.subtitle}</p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="flex gap-1">
                    {[...Array(MAX_DAILY_ADS)].map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < dailyAdsWatched ? 'bg-gray-600' : 'bg-green-500'}`}></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{MAX_DAILY_ADS - dailyAdsWatched} {t.adModal.remaining}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAdModal(false)} className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition font-medium">{t.adModal.close}</button>
                  <button onClick={handleWatchAd} disabled={dailyAdsWatched >= MAX_DAILY_ADS} className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium">
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
