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
  const { language, setLanguage, t } = useLanguage()

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

    setCredits(creditsData)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Çeviri fonksiyonu
  const getText = (trText: string, enText: string) => {
    if (language === 'tr') return trText
    if (language === 'ru') return t.dashboard?.[enText.toLowerCase().replace(/ /g, '')] || enText
    if (language === 'de') return t.dashboard?.[enText.toLowerCase().replace(/ /g, '')] || enText
    if (language === 'fr') return t.dashboard?.[enText.toLowerCase().replace(/ /g, '')] || enText
    return enText
  }

  const tools = [
    { name: getText('Video Script Yazarı', 'Video Script Writer'), icon: '🎬', path: '/tools/video-script', credits: 4, category: 'video', description: getText('YouTube & TikTok için script', 'Scripts for YouTube & TikTok') },
    { name: getText('Seslendirme', 'Text to Speech'), icon: '🔊', path: '/tools/text-to-speech', credits: 3, category: 'video', description: getText('Metni sese dönüştür', 'Convert text to speech'), new: true },
    
    { name: getText('Hook Üretici', 'Hook Generator'), icon: '🎣', path: '/tools/hook-generator', credits: 2, category: 'content', description: getText('Dikkat çeken hook\'lar', 'Attention-grabbing hooks') },
    { name: getText('Caption Yazarı', 'Caption Writer'), icon: '✍️', path: '/tools/caption-writer', credits: 2, category: 'content', description: getText('Profesyonel caption\'lar', 'Professional captions') },
    { name: getText('Platform Uyarlayıcı', 'Platform Adapter'), icon: '🔄', path: '/tools/platform-adapter', credits: 3, category: 'content', description: getText('İçeriği platformlara uyarla', 'Adapt content to platforms') },
    { name: getText('Metin Özetleyici', 'Summarizer'), icon: '📝', path: '/tools/summarize', credits: 2, category: 'content', description: getText('Metinleri özetle', 'Summarize texts') },
    
    { name: getText('Rakip Analizi', 'Competitor Analysis'), icon: '🔍', path: '/tools/competitor-analyzer', credits: 8, category: 'analysis', description: getText('Rakiplerinizi analiz edin', 'Analyze competitors') },
    { name: getText('Trend Dedektörü', 'Trend Detector'), icon: '📊', path: '/tools/trend-detector', credits: 5, category: 'analysis', description: getText('Güncel trendleri keşfet', 'Discover trends') },
    { name: getText('Etkileşim Tahmini', 'Engagement Predictor'), icon: '📈', path: '/tools/engagement-predictor', credits: 5, category: 'analysis', description: getText('Etkileşim tahmini', 'Predict engagement') },
    { name: getText('Marka Sesi Analizi', 'Brand Voice Analyzer'), icon: '🎯', path: '/tools/brand-voice', credits: 2, category: 'analysis', description: getText('Marka sesinizi analiz edin', 'Analyze brand voice') },
    { name: getText('Viral Skor', 'Viral Score'), icon: '🚀', path: '/tools/viral-score', credits: 3, category: 'analysis', description: getText('Viral potansiyel tahmini', 'Predict viral potential') },
    { name: getText('Duygu Analizi', 'Sentiment Analysis'), icon: '😊', path: '/tools/sentiment', credits: 2, category: 'analysis', description: getText('Metin duygu analizi', 'Text sentiment analysis') },
    
    { name: getText('Hashtag Üretici', 'Hashtag Generator'), icon: '#️⃣', path: '/tools/hashtag-generator', credits: 0, category: 'optimization', description: getText('AI ile viral hashtag\'ler', 'AI-powered viral hashtags'), free: true },
    { name: getText('Bio Üretici', 'Bio Generator'), icon: '👤', path: '/tools/bio-generator', credits: 0, category: 'optimization', description: getText('Profil bio\'ları', 'Profile bios'), free: true },
    { name: getText('QR Kod', 'QR Code'), icon: '📱', path: '/tools/qr-code-generator', credits: 0, category: 'optimization', description: getText('QR kod oluştur', 'Generate QR codes'), free: true },
    
    { name: getText('Paylaşım Zamanlayıcı', 'Post Scheduler'), icon: '📅', path: '/tools/post-scheduler', credits: 0, category: 'helper', description: getText('En iyi paylaşım saatleri', 'Best posting times'), free: true },
    { name: getText('İçerik Takvimi', 'Content Calendar'), icon: '🗓️', path: '/tools/content-calendar', credits: 0, category: 'helper', description: getText('Aylık içerik planı', 'Monthly content plan'), free: true },
  ]

  const categories = [
    { id: 'all', name: getText('Tümü', 'All'), icon: '🎯' },
    { id: 'video', name: 'Video', icon: '📹' },
    { id: 'content', name: getText('İçerik', 'Content'), icon: '✍️' },
    { id: 'analysis', name: getText('Analiz', 'Analysis'), icon: '📊' },
    { id: 'optimization', name: getText('Optimizasyon', 'Optimization'), icon: '⚡' },
    { id: 'helper', name: getText('Yardımcı', 'Helper'), icon: '🛠️' },
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
          <p className="text-gray-400">{getText('Yükleniyor...', 'Loading...')}</p>
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
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-white">M</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white hidden sm:block">Media Tool Kit</span>
            </Link>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Credits */}
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
                <span className="text-yellow-400">💰</span>
                <span className="font-bold text-white">{credits?.balance || 0}</span>
                <span className="text-gray-400 text-sm">{getText('kredi', 'credits')}</span>
              </div>

              {/* Watch Ad */}
              {dailyAdsWatched < MAX_DAILY_ADS && (
                <button
                  onClick={() => setShowAdModal(true)}
                  className="flex items-center gap-2 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition"
                >
                  <span>🎬</span>
                  <span className="text-sm">{getText('Reklam İzle', 'Watch Ad')}</span>
                </button>
              )}

              {/* Language */}
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

              {/* User Menu */}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition text-sm"
              >
                {getText('Çıkış', 'Logout')}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              {/* Credits - Mobile */}
              <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-lg">
                <span className="text-yellow-400 text-sm">💰</span>
                <span className="font-bold text-white text-sm">{credits?.balance || 0}</span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2"
              >
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

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 animate-fadeIn">
              <div className="flex flex-col gap-3">
                {/* Watch Ad - Mobile */}
                {dailyAdsWatched < MAX_DAILY_ADS && (
                  <button
                    onClick={() => { setShowAdModal(true); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl"
                  >
                    <span>🎬</span>
                    <span>{getText('Reklam İzle (+5 Kredi)', 'Watch Ad (+5 Credits)')}</span>
                  </button>
                )}

                {/* Language - Mobile */}
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

                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white py-2"
                >
                  {getText('Çıkış Yap', 'Logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Welcome */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            {getText('Hoş Geldin', 'Welcome back')} 👋
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {getText('Bugün ne yapmak istersin?', 'What would you like to do today?')}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={getText('Araç ara...', 'Search tools...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm sm:text-base"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition text-sm ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
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
                    {getText('YENİ', 'NEW')}
                  </span>
                </div>
              )}

              {tool.free && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-full">
                    {getText('ÜCRETSİZ', 'FREE')}
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
                      <span className="text-xs font-bold text-green-400">
                        {getText('ÜCRETSİZ', 'FREE')}
                      </span>
                    ) : (
                      <>
                        <span className="text-yellow-400 text-sm">💰</span>
                        <span className="text-xs sm:text-sm font-bold text-yellow-400">{tool.credits}</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">{getText('kredi', 'credits')}</span>
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

        {/* No Results */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {getText('Araç bulunamadı', 'No tools found')}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              {getText('Farklı bir arama yapın', 'Try a different search')}
            </p>
          </div>
        )}
      </main>

      {/* Watch Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-5 sm:p-6 border border-gray-700">
            {!adWatching ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl sm:text-6xl mb-4">🎬</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {getText('Reklam İzle, Kredi Kazan!', 'Watch Ad, Earn Credits!')}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {getText('15 saniyelik bir reklam izleyerek 5 kredi kazanabilirsiniz.', 'Watch a 15-second ad to earn 5 credits.')}
                  </p>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">{getText('Günlük kalan hak', 'Daily remaining')}</span>
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
                  <div className="text-center text-yellow-400 mb-4 text-sm">
                    ⚠️ {getText('Günlük limitinize ulaştınız!', 'Daily limit reached!')}
                  </div>
                ) : (
                  <button
                    onClick={handleWatchAd}
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-bold text-base sm:text-lg transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>▶️</span>
                    {getText('Reklam İzle (+5 Kredi)', 'Watch Ad (+5 Credits)')}
                  </button>
                )}

                <button
                  onClick={() => setShowAdModal(false)}
                  className="w-full py-3 mt-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition text-sm sm:text-base"
                >
                  {getText('Kapat', 'Close')}
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="text-5xl sm:text-6xl mb-4 animate-pulse">📺</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                  {getText('Reklam İzleniyor...', 'Watching Ad...')}
                </h3>
                
                <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 sm:h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${adProgress}%` }}
                  ></div>
                </div>
                
                <p className="text-gray-400 text-sm">
                  {Math.ceil(15 - (adProgress / 100 * 15))} {getText('saniye kaldı', 'seconds left')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
