'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

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
    
    // 15 saniyelik reklam simülasyonu
    const interval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + (100 / 15) // 15 saniyede 100%
      })
    }, 1000)

    // 15 saniye sonra kredi ekle
    setTimeout(async () => {
      clearInterval(interval)
      setAdProgress(100)
      
      // Kredi ekle
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
      
      // Günlük sayacı güncelle
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
    // Video Tools
    { name: language === 'tr' ? 'Video Script Yazarı' : 'Video Script Writer', icon: '🎬', path: '/tools/video-script', credits: 4, category: 'video', description: language === 'tr' ? 'YouTube & TikTok için script' : 'Scripts for YouTube & TikTok' },
    { name: language === 'tr' ? 'Seslendirme' : 'Text to Speech', icon: '🔊', path: '/tools/text-to-speech', credits: 3, category: 'video', description: language === 'tr' ? 'Metni sese dönüştür' : 'Convert text to speech' },
    
    // Content Creation
    { name: language === 'tr' ? 'Hook Üretici' : 'Hook Generator', icon: '🎣', path: '/tools/hook-generator', credits: 2, category: 'content', description: language === 'tr' ? 'Dikkat çeken hook\'lar' : 'Attention-grabbing hooks' },
    { name: language === 'tr' ? 'Caption Yazarı' : 'Caption Writer', icon: '✍️', path: '/tools/caption-writer', credits: 2, category: 'content', description: language === 'tr' ? 'Profesyonel caption\'lar' : 'Professional captions' },
    { name: language === 'tr' ? 'Thread Yazarı' : 'Thread Writer', icon: '🧵', path: '/tools/thread-writer', credits: 4, category: 'content', description: language === 'tr' ? 'Viral Twitter/X thread\'leri' : 'Viral Twitter/X threads', new: true },
    { name: language === 'tr' ? 'Platform Uyarlayıcı' : 'Platform Adapter', icon: '🔄', path: '/tools/platform-adapter', credits: 3, category: 'content', description: language === 'tr' ? 'İçeriği platformlara uyarla' : 'Adapt content to platforms' },
    { name: language === 'tr' ? 'Metin Özetleyici' : 'Summarizer', icon: '📝', path: '/tools/summarize', credits: 2, category: 'content', description: language === 'tr' ? 'Metinleri özetle' : 'Summarize texts' },
    { name: language === 'tr' ? 'İçerik Fikir Motoru' : 'Content Ideas', icon: '💡', path: '/tools/content-ideas', credits: 3, category: 'content', description: language === 'tr' ? '10 özgün içerik fikri' : '10 unique content ideas' },
    
    // Communication
    { name: language === 'tr' ? 'Yorum Yanıtlayıcı' : 'Comment Reply', icon: '💬', path: '/tools/comment-reply', credits: 2, category: 'content', description: language === 'tr' ? 'Yorumlara akıllı yanıtlar' : 'Smart replies to comments', new: true },
    { name: language === 'tr' ? 'DM & E-posta Yazarı' : 'DM & Email Writer', icon: '✉️', path: '/tools/dm-email-writer', credits: 2, category: 'content', description: language === 'tr' ? 'Profesyonel mesajlar' : 'Professional messages', new: true },
    
    // Analysis & Strategy
    { name: language === 'tr' ? 'Trend Dedektörü' : 'Trend Detector', icon: '📊', path: '/tools/trend-detector', credits: 5, category: 'analysis', description: language === 'tr' ? 'Güncel trendleri keşfet' : 'Discover trends' },
    { name: language === 'tr' ? 'Etkileşim Tahmini' : 'Engagement Predictor', icon: '📈', path: '/tools/engagement-predictor', credits: 5, category: 'analysis', description: language === 'tr' ? 'Etkileşim tahmini' : 'Predict engagement' },
    
    // Optimization
    { name: language === 'tr' ? 'Hashtag Üretici' : 'Hashtag Generator', icon: '#️⃣', path: '/tools/hashtag-generator', credits: 0, category: 'optimization', description: language === 'tr' ? 'AI ile viral hashtag\'ler' : 'AI-powered viral hashtags', free: true },
    { name: language === 'tr' ? 'Bio Üretici' : 'Bio Generator', icon: '👤', path: '/tools/bio-generator', credits: 0, category: 'optimization', description: language === 'tr' ? 'Profil bio\'ları' : 'Profile bios', free: true },
    { name: language === 'tr' ? 'QR Kod' : 'QR Code', icon: '📱', path: '/tools/qr-code-generator', credits: 0, category: 'optimization', description: language === 'tr' ? 'QR kod oluştur' : 'Generate QR codes', free: true },
    
    // Helper Tools
    { name: language === 'tr' ? 'Paylaşım Zamanlayıcı' : 'Post Scheduler', icon: '📅', path: '/tools/post-scheduler', credits: 0, category: 'helper', description: language === 'tr' ? 'En iyi paylaşım saatleri' : 'Best posting times', free: true },
    { name: language === 'tr' ? 'İçerik Takvimi' : 'Content Calendar', icon: '🗓️', path: '/tools/content-calendar', credits: 0, category: 'helper', description: language === 'tr' ? 'Aylık içerik planı' : 'Monthly content plan', free: true },
  ]

  const categories = [
    { id: 'all', name: language === 'tr' ? 'Tümü' : 'All', icon: '🎯' },
    { id: 'video', name: language === 'tr' ? 'Video' : 'Video', icon: '📹' },
    { id: 'content', name: language === 'tr' ? 'İçerik' : 'Content', icon: '✍️' },
    { id: 'analysis', name: language === 'tr' ? 'Analiz' : 'Analysis', icon: '📊' },
    { id: 'optimization', name: language === 'tr' ? 'Optimizasyon' : 'Optimization', icon: '⚡' },
    { id: 'helper', name: language === 'tr' ? 'Yardımcı' : 'Helper', icon: '🛠️' },
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</p>
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
            {/* Logo - Tıklanabilir */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Media
                  </span>
                  <span className="text-xl font-bold text-white">
                    Tool Kit
                  </span>
                </div>
                <p className="text-xs text-gray-400">{language === 'tr' ? 'İçerik Üretim Platformu' : 'Content Creation Platform'}</p>
              </div>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Switcher - Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-700/50 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 transition">
                  <span>🌐</span>
                  <span>{language.toUpperCase()}</span>
                  <span>▼</span>
                </button>
                <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button onClick={() => setLanguage('en')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ' + (language === 'en' ? 'text-purple-400' : 'text-gray-300')}>
                    🇺🇸 English
                  </button>
                  <button onClick={() => setLanguage('tr')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ' + (language === 'tr' ? 'text-purple-400' : 'text-gray-300')}>
                    🇹🇷 Türkçe
                  </button>
                  <button onClick={() => setLanguage('ru')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ' + (language === 'ru' ? 'text-purple-400' : 'text-gray-300')}>
                    🇷🇺 Русский
                  </button>
                  <button onClick={() => setLanguage('de')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ' + (language === 'de' ? 'text-purple-400' : 'text-gray-300')}>
                    🇩🇪 Deutsch
                  </button>
                  <button onClick={() => setLanguage('fr')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ' + (language === 'fr' ? 'text-purple-400' : 'text-gray-300')}>
                    🇫🇷 Français
                  </button>
                </div>
              </div>

              {/* Pricing Link */}
              <Link href="/pricing" className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-500/30 transition">
                <span>💎</span>
                <span>{language === 'tr' ? 'Pro' : language === 'ru' ? 'Про' : language === 'de' ? 'Pro' : language === 'fr' ? 'Pro' : 'Pro'}</span>
              </Link>

              {/* Credits */}
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-xs text-gray-400">{language === 'tr' ? 'Kredi' : 'Credits'}</p>
                  <p className="text-lg font-bold text-yellow-400">{credits?.balance || 0}</p>
                </div>
              </div>

              {/* Watch Ad for Credits Button */}
              <button
                onClick={() => setShowAdModal(true)}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-400 rounded-lg px-3 py-2 transition"
                title={language === 'tr' ? 'Reklam izle, kredi kazan!' : 'Watch ad, earn credits!'}
              >
                <span className="text-xl">🎬</span>
                <span className="text-sm text-green-400 font-medium">+5</span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{user?.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                  title={language === 'tr' ? 'Çıkış Yap' : 'Logout'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {language === 'tr' ? `Hoş geldin, ${user?.user_metadata?.full_name || 'Kullanıcı'}! 👋` : `Welcome back, ${user?.user_metadata?.full_name || 'User'}! 👋`}
          </h2>
          <p className="text-gray-400">
            {language === 'tr' ? '16 güçlü araçla içeriklerini oluştur ve markanı büyüt!' : 'Create content with 16 powerful tools and grow your brand!'}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder={language === 'tr' ? 'Araç ara...' : 'Search tools...'}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool, index) => (
            <Link
              key={index}
              href={tool.path}
              className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02] relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>

              {/* New Badge */}
              {tool.new && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {language === 'tr' ? 'YENİ' : 'NEW'}
                  </span>
                </div>
              )}

              {/* Free Badge */}
              {tool.free && (
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {language === 'tr' ? 'ÜCRETSİZ' : 'FREE'}
                  </span>
                </div>
              )}

              <div className="relative">
                {/* Icon */}
                <div className="text-4xl mb-4">{tool.icon}</div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition">
                  {tool.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4">
                  {tool.description}
                </p>

                {/* Credits */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {tool.credits === 0 ? (
                      <span className="text-xs font-bold text-green-400">
                        {language === 'tr' ? 'ÜCRETSİZ' : 'FREE'}
                      </span>
                    ) : (
                      <>
                        <span className="text-yellow-400">💰</span>
                        <span className="text-sm font-bold text-yellow-400">{tool.credits}</span>
                        <span className="text-xs text-gray-500">{language === 'tr' ? 'kredi' : 'credits'}</span>
                      </>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'tr' ? 'Araç bulunamadı' : 'No tools found'}
            </h3>
            <p className="text-gray-400">
              {language === 'tr' ? 'Farklı bir arama yapın veya kategori seçin' : 'Try a different search or category'}
            </p>
          </div>
        )}
      </main>

      {/* Watch Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700">
            {!adWatching ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {language === 'tr' ? 'Reklam İzle, Kredi Kazan!' : 'Watch Ad, Earn Credits!'}
                  </h3>
                  <p className="text-gray-400">
                    {language === 'tr' 
                      ? '15 saniyelik bir reklam izleyerek 5 kredi kazanabilirsiniz.'
                      : 'Watch a 15-second ad to earn 5 credits.'}
                  </p>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">{language === 'tr' ? 'Günlük kalan hak' : 'Daily remaining'}</span>
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
                  <div className="text-center text-yellow-400 mb-4">
                    ⚠️ {language === 'tr' ? 'Günlük limitinize ulaştınız. Yarın tekrar deneyin!' : 'Daily limit reached. Try again tomorrow!'}
                  </div>
                ) : (
                  <button
                    onClick={handleWatchAd}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2"
                  >
                    <span>▶️</span>
                    {language === 'tr' ? 'Reklam İzle (+5 Kredi)' : 'Watch Ad (+5 Credits)'}
                  </button>
                )}

                <button
                  onClick={() => setShowAdModal(false)}
                  className="w-full py-3 mt-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition"
                >
                  {language === 'tr' ? 'Kapat' : 'Close'}
                </button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-pulse">📺</div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {language === 'tr' ? 'Reklam İzleniyor...' : 'Watching Ad...'}
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${adProgress}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-gray-400 mb-2">
                    {Math.ceil(15 - (adProgress / 100 * 15))} {language === 'tr' ? 'saniye kaldı' : 'seconds left'}
                  </p>
                  
                  <div className="mt-6 p-4 bg-gray-700/50 rounded-xl">
                    <p className="text-sm text-gray-400">
                      {language === 'tr' 
                        ? '💡 İpucu: Premium planla sınırsız kredi ve reklamsız deneyim!'
                        : '💡 Tip: Go Premium for unlimited credits and ad-free experience!'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}