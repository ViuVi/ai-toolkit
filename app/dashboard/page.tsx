'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const tools = [
  // Discovery & Research
  { id: 'video-finder', icon: '🔍', name: 'Viral Video Finder', nameEn: 'Viral Video Finder', desc: 'Nişindeki viral trendleri keşfet', descEn: 'Discover viral trends in your niche', credits: 5, category: 'discovery', isNew: true },
  { id: 'trend-radar', icon: '📡', name: 'Trend Radar', nameEn: 'Trend Radar', desc: 'Güncel trendleri yakala', descEn: 'Catch current trends', credits: 4, category: 'discovery' },
  { id: 'competitor-spy', icon: '🕵️', name: 'Competitor Spy', nameEn: 'Competitor Spy', desc: 'Rakip analizi yap', descEn: 'Analyze competitors', credits: 8, category: 'discovery' },
  { id: 'hashtag-research', icon: '#️⃣', name: 'Hashtag Research', nameEn: 'Hashtag Research', desc: 'Etkili hashtagler bul', descEn: 'Find effective hashtags', credits: 3, category: 'discovery' },
  
  // Content Creation
  { id: 'hook-generator', icon: '🎣', name: 'Hook Generator Pro', nameEn: 'Hook Generator Pro', desc: 'Viral hook\'lar üret', descEn: 'Generate viral hooks', credits: 3, category: 'creation', isNew: true },
  { id: 'script-studio', icon: '🎬', name: 'Script Studio', nameEn: 'Script Studio', desc: 'Video scriptleri yaz', descEn: 'Write video scripts', credits: 6, category: 'creation' },
  { id: 'caption-generator', icon: '✍️', name: 'Caption Generator', nameEn: 'Caption Generator', desc: 'Viral caption\'lar oluştur', descEn: 'Create viral captions', credits: 3, category: 'creation', isNew: true },
  { id: 'thread-composer', icon: '🧵', name: 'Thread Composer', nameEn: 'Thread Composer', desc: 'Twitter thread\'leri yaz', descEn: 'Write Twitter threads', credits: 5, category: 'creation' },
  { id: 'carousel-planner', icon: '🎠', name: 'Carousel Planner', nameEn: 'Carousel Planner', desc: 'Carousel içerikleri planla', descEn: 'Plan carousel content', credits: 5, category: 'creation' },
  
  // Analysis & Optimization
  { id: 'viral-analyzer', icon: '🔬', name: 'Viral Analyzer', nameEn: 'Viral Analyzer', desc: 'İçerik potansiyelini analiz et', descEn: 'Analyze content potential', credits: 5, category: 'analysis' },
  { id: 'steal-video', icon: '🎯', name: 'Steal This Video', nameEn: 'Steal This Video', desc: 'Viral videoları reverse engineer yap', descEn: 'Reverse engineer viral videos', credits: 8, category: 'analysis', isNew: true },
  { id: 'ab-tester', icon: '⚖️', name: 'A/B Tester', nameEn: 'A/B Tester', desc: 'Caption\'ları karşılaştır', descEn: 'Compare captions', credits: 5, category: 'analysis' },
  { id: 'engagement-booster', icon: '🚀', name: 'Engagement Booster', nameEn: 'Engagement Booster', desc: 'Etkileşimi artır', descEn: 'Boost engagement', credits: 4, category: 'analysis' },
  
  // Planning & Repurposing
  { id: 'content-planner', icon: '📅', name: 'Content Calendar', nameEn: 'Content Calendar', desc: '30 günlük plan oluştur', descEn: 'Create 30-day plan', credits: 10, category: 'planning' },
  { id: 'posting-optimizer', icon: '⏰', name: 'Smart Posting Times', nameEn: 'Smart Posting Times', desc: 'Optimal paylaşım saatleri', descEn: 'Optimal posting times', credits: 2, category: 'planning' },
  { id: 'content-repurposer', icon: '♻️', name: 'Content Repurposer', nameEn: 'Content Repurposer', desc: 'İçeriği tüm platformlara uyarla', descEn: 'Repurpose for all platforms', credits: 8, category: 'planning' },
]

const categories = [
  { id: 'all', label: '🏠 Tümü', labelEn: '🏠 All' },
  { id: 'discovery', label: '🔍 Keşif', labelEn: '🔍 Discovery' },
  { id: 'creation', label: '✨ Oluşturma', labelEn: '✨ Creation' },
  { id: 'analysis', label: '📊 Analiz', labelEn: '📊 Analysis' },
  { id: 'planning', label: '📅 Planlama', labelEn: '📅 Planning' },
]

const texts: any = {
  tr: { title: 'Dashboard', welcome: 'Hoş geldin', credits: 'Kredi', tools: 'araç', logout: 'Çıkış', newBadge: 'YENİ' },
  en: { title: 'Dashboard', welcome: 'Welcome', credits: 'Credits', tools: 'tools', logout: 'Logout', newBadge: 'NEW' },
  ru: { title: 'Панель', welcome: 'Добро пожаловать', credits: 'Кредиты', tools: 'инструменты', logout: 'Выход', newBadge: 'НОВЫЙ' },
  de: { title: 'Dashboard', welcome: 'Willkommen', credits: 'Credits', tools: 'Tools', logout: 'Abmelden', newBadge: 'NEU' },
  fr: { title: 'Tableau de bord', welcome: 'Bienvenue', credits: 'Crédits', tools: 'outils', logout: 'Déconnexion', newBadge: 'NOUVEAU' },
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else {
        setUser(user)
        // Fetch credits
        supabase.from('credits').select('balance').eq('user_id', user.id).single()
          .then(({ data }) => setCredits(data?.balance || 100))
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">MediaToolkit</Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Credits */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl px-4 py-2">
              <span className="text-gray-400 text-sm">{t.credits}:</span>
              <span className="text-white font-bold ml-2">{credits}</span>
            </div>
            
            {/* Language */}
            <div className="relative group">
              <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">🌐 {language.toUpperCase()}</button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${language === l ? 'text-purple-400' : 'text-gray-300'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            
            {/* Logout */}
            <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm">{t.logout}</button>
          </div>
        </div>
      </header>

      {/* Test Mode Banner */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-green-500/10 border-b border-green-500/30 py-2 text-center text-green-400 text-sm">
        🧪 Test Modu Aktif - Krediler düşmüyor
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t.welcome}, {user?.email?.split('@')[0]} 👋</h1>
          <p className="text-gray-400">{tools.length} {t.tools}</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {language === 'tr' ? cat.label : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map(tool => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="group bg-gray-800/50 border border-gray-700 rounded-2xl p-5 hover:border-purple-500/50 hover:bg-gray-800 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{tool.icon}</span>
                <div className="flex items-center gap-2">
                  {tool.isNew && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold">{t.newBadge}</span>
                  )}
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">{tool.credits} {t.credits}</span>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                {language === 'tr' ? tool.name : tool.nameEn}
              </h3>
              <p className="text-gray-500 text-sm">
                {language === 'tr' ? tool.desc : tool.descEn}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-white">{tools.length}</div>
            <div className="text-gray-400 text-sm">AI Tools</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-white">4</div>
            <div className="text-gray-400 text-sm">New Tools</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-white">5</div>
            <div className="text-gray-400 text-sm">Languages</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-white">{credits}</div>
            <div className="text-gray-400 text-sm">Your Credits</div>
          </div>
        </div>
      </main>
    </div>
  )
}
