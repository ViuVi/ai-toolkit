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
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

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
    { name: language === 'tr' ? 'Alt Yazı Ekleyici' : 'Subtitle Generator', icon: '📹', path: '/tools/subtitle-generator', credits: 4, category: 'video', description: language === 'tr' ? 'Videolarınıza alt yazı ekleyin' : 'Add subtitles to videos' },
    { name: language === 'tr' ? 'Video Script Yazarı' : 'Video Script Writer', icon: '🎬', path: '/tools/video-script', credits: 4, category: 'video', description: language === 'tr' ? 'YouTube & TikTok için script' : 'Scripts for YouTube & TikTok' },
    
    // Content Creation
    { name: language === 'tr' ? 'Hook Üretici' : 'Hook Generator', icon: '🎣', path: '/tools/hook-generator', credits: 2, category: 'content', description: language === 'tr' ? 'Dikkat çeken hook\'lar' : 'Attention-grabbing hooks' },
    { name: language === 'tr' ? 'Caption Yazarı' : 'Caption Writer', icon: '✍️', path: '/tools/caption-writer', credits: 2, category: 'content', description: language === 'tr' ? 'Profesyonel caption\'lar' : 'Professional captions' },
    { name: language === 'tr' ? 'Platform Uyarlayıcı' : 'Platform Adapter', icon: '🔄', path: '/tools/platform-adapter', credits: 3, category: 'content', description: language === 'tr' ? 'İçeriği platformlara uyarla' : 'Adapt content to platforms' },
    { name: language === 'tr' ? 'Metin Özetleyici' : 'Summarizer', icon: '📝', path: '/tools/summarize', credits: 2, category: 'content', description: language === 'tr' ? 'Metinleri özetle' : 'Summarize texts' },
    
    // Analysis & Strategy
    { name: language === 'tr' ? 'Rakip Analizi' : 'Competitor Analysis', icon: '🔍', path: '/tools/competitor-analyzer', credits: 8, category: 'analysis', description: language === 'tr' ? 'Rakiplerinizi analiz edin' : 'Analyze competitors' },
    { name: language === 'tr' ? 'Trend Dedektörü' : 'Trend Detector', icon: '📊', path: '/tools/trend-detector', credits: 5, category: 'analysis', description: language === 'tr' ? 'Güncel trendleri keşfet' : 'Discover trends' },
    { name: language === 'tr' ? 'Etkileşim Tahmini' : 'Engagement Predictor', icon: '📈', path: '/tools/engagement-predictor', credits: 5, category: 'analysis', description: language === 'tr' ? 'Etkileşim tahmini' : 'Predict engagement' },
    { name: language === 'tr' ? 'Marka Sesi Analizi' : 'Brand Voice Analyzer', icon: '🎯', path: '/tools/brand-voice', credits: 2, category: 'analysis', description: language === 'tr' ? 'Marka sesinizi analiz edin' : 'Analyze brand voice' },
    
    // Optimization
    { name: language === 'tr' ? 'Hashtag Üretici' : 'Hashtag Generator', icon: '#️⃣', path: '/tools/hashtag-generator', credits: 3, category: 'optimization', description: language === 'tr' ? 'Viral hashtag\'ler' : 'Viral hashtags' },
    { name: language === 'tr' ? 'Bio Üretici' : 'Bio Generator', icon: '👤', path: '/tools/bio-generator', credits: 0, category: 'optimization', description: language === 'tr' ? 'Profil bio\'ları' : 'Profile bios', free: true },
    { name: language === 'tr' ? 'QR Kod' : 'QR Code', icon: '📱', path: '/tools/qr-code-generator', credits: 0, category: 'optimization', description: language === 'tr' ? 'QR kod oluştur' : 'Generate QR codes', free: true },
    
    // Helper Tools
    { name: language === 'tr' ? 'Paylaşım Zamanlayıcı' : 'Post Scheduler', icon: '📅', path: '/tools/post-scheduler', credits: 0, category: 'helper', description: language === 'tr' ? 'En iyi paylaşım saatleri' : 'Best posting times', free: true },
    { name: language === 'tr' ? 'İçerik Takvimi' : 'Content Calendar', icon: '🗓️', path: '/tools/content-calendar', credits: 0, category: 'helper', description: language === 'tr' ? 'Aylık içerik planı' : 'Monthly content plan', free: true, new: true },
    { name: language === 'tr' ? 'Viral Skor' : 'Viral Score', icon: '🚀', path: '/tools/viral-score', credits: 0, category: 'helper', description: language === 'tr' ? 'Viral potansiyel tahmini' : 'Predict viral potential', free: true, new: true },
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
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
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
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    language === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('tr')}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    language === 'tr' ? 'bg-purple-500 text-white' : 'text-gray-400'
                  }`}
                >
                  TR
                </button>
              </div>

              {/* Credits */}
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-xs text-gray-400">{language === 'tr' ? 'Kredi' : 'Credits'}</p>
                  <p className="text-lg font-bold text-yellow-400">{credits?.balance || 0}</p>
                </div>
              </div>

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
    </div>
  )
}