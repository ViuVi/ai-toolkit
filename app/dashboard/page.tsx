'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const tools = [
  // Discovery & Research
  { id: 'video-finder', icon: '🔍', name: 'Viral Video Finder', nameEn: 'Viral Video Finder', desc: 'Nişindeki viral trendleri keşfet', descEn: 'Discover viral trends', credits: 5, category: 'discovery', isNew: true, color: 'from-blue-500 to-cyan-500' },
  { id: 'trend-radar', icon: '📡', name: 'Trend Radar', nameEn: 'Trend Radar', desc: 'Güncel trendleri yakala', descEn: 'Catch current trends', credits: 4, category: 'discovery', color: 'from-green-500 to-emerald-500' },
  { id: 'competitor-spy', icon: '🕵️', name: 'Competitor Spy', nameEn: 'Competitor Spy', desc: 'Rakip analizi yap', descEn: 'Analyze competitors', credits: 8, category: 'discovery', color: 'from-orange-500 to-amber-500' },
  { id: 'hashtag-research', icon: '#️⃣', name: 'Hashtag Research', nameEn: 'Hashtag Research', desc: 'Etkili hashtagler bul', descEn: 'Find effective hashtags', credits: 3, category: 'discovery', color: 'from-pink-500 to-rose-500' },
  
  // Content Creation
  { id: 'hook-generator', icon: '🎣', name: 'Hook Generator Pro', nameEn: 'Hook Generator Pro', desc: 'Viral hook\'lar üret', descEn: 'Generate viral hooks', credits: 3, category: 'creation', isNew: true, color: 'from-red-500 to-orange-500' },
  { id: 'script-studio', icon: '🎬', name: 'Script Studio', nameEn: 'Script Studio', desc: 'Video scriptleri yaz', descEn: 'Write video scripts', credits: 6, category: 'creation', color: 'from-purple-500 to-violet-500' },
  { id: 'caption-generator', icon: '✍️', name: 'Caption Generator', nameEn: 'Caption Generator', desc: 'Viral caption\'lar oluştur', descEn: 'Create viral captions', credits: 3, category: 'creation', isNew: true, color: 'from-indigo-500 to-purple-500' },
  { id: 'thread-composer', icon: '🧵', name: 'Thread Composer', nameEn: 'Thread Composer', desc: 'Twitter thread\'leri yaz', descEn: 'Write Twitter threads', credits: 5, category: 'creation', color: 'from-sky-500 to-blue-500' },
  { id: 'carousel-planner', icon: '🎠', name: 'Carousel Planner', nameEn: 'Carousel Planner', desc: 'Carousel içerikleri planla', descEn: 'Plan carousel content', credits: 5, category: 'creation', color: 'from-fuchsia-500 to-pink-500' },
  
  // Analysis & Optimization
  { id: 'viral-analyzer', icon: '🔬', name: 'Viral Analyzer', nameEn: 'Viral Analyzer', desc: 'İçerik potansiyelini analiz et', descEn: 'Analyze content potential', credits: 5, category: 'analysis', color: 'from-teal-500 to-green-500' },
  { id: 'steal-video', icon: '🎯', name: 'Steal This Video', nameEn: 'Steal This Video', desc: 'Viral videoları reverse engineer yap', descEn: 'Reverse engineer viral videos', credits: 8, category: 'analysis', isNew: true, color: 'from-yellow-500 to-orange-500' },
  { id: 'ab-tester', icon: '⚖️', name: 'A/B Tester', nameEn: 'A/B Tester', desc: 'Caption\'ları karşılaştır', descEn: 'Compare captions', credits: 5, category: 'analysis', color: 'from-lime-500 to-green-500' },
  { id: 'engagement-booster', icon: '🚀', name: 'Engagement Booster', nameEn: 'Engagement Booster', desc: 'Etkileşimi artır', descEn: 'Boost engagement', credits: 4, category: 'analysis', color: 'from-rose-500 to-red-500' },
  
  // Planning & Repurposing
  { id: 'content-planner', icon: '📅', name: 'Content Calendar', nameEn: 'Content Calendar', desc: '30 günlük plan oluştur', descEn: 'Create 30-day plan', credits: 10, category: 'planning', color: 'from-violet-500 to-purple-500' },
  { id: 'posting-optimizer', icon: '⏰', name: 'Smart Posting Times', nameEn: 'Smart Posting Times', desc: 'Optimal paylaşım saatleri', descEn: 'Optimal posting times', credits: 2, category: 'planning', color: 'from-cyan-500 to-teal-500' },
  { id: 'content-repurposer', icon: '♻️', name: 'Content Repurposer', nameEn: 'Content Repurposer', desc: 'İçeriği tüm platformlara uyarla', descEn: 'Repurpose for all platforms', credits: 8, category: 'planning', color: 'from-emerald-500 to-green-500' },
]

const categories = [
  { id: 'all', label: 'Tümü', labelEn: 'All', icon: '🏠' },
  { id: 'discovery', label: 'Keşif', labelEn: 'Discovery', icon: '🔍' },
  { id: 'creation', label: 'Oluşturma', labelEn: 'Creation', icon: '✨' },
  { id: 'analysis', label: 'Analiz', labelEn: 'Analysis', icon: '📊' },
  { id: 'planning', label: 'Planlama', labelEn: 'Planning', icon: '📅' },
]

const texts: any = {
  tr: { welcome: 'Hoş geldin', credits: 'Kredi', tools: 'araç mevcut', logout: 'Çıkış', new: 'YENİ', upgrade: 'Pro\'ya Yükselt', viewAll: 'Tümünü Gör' },
  en: { welcome: 'Welcome back', credits: 'Credits', tools: 'tools available', logout: 'Log out', new: 'NEW', upgrade: 'Upgrade to Pro', viewAll: 'View All' },
  ru: { welcome: 'Добро пожаловать', credits: 'Кредиты', tools: 'инструментов', logout: 'Выход', new: 'НОВЫЙ', upgrade: 'Обновить', viewAll: 'Все' },
  de: { welcome: 'Willkommen zurück', credits: 'Credits', tools: 'Tools verfügbar', logout: 'Abmelden', new: 'NEU', upgrade: 'Upgrade', viewAll: 'Alle' },
  fr: { welcome: 'Bienvenue', credits: 'Crédits', tools: 'outils disponibles', logout: 'Déconnexion', new: 'NOUVEAU', upgrade: 'Passer Pro', viewAll: 'Tout voir' },
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [plan, setPlan] = useState('free')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else {
        setUser(user)
        supabase.from('credits').select('balance, plan').eq('user_id', user.id).single()
          .then(({ data }) => {
            setCredits(data?.balance || 100)
            setPlan(data?.plan || 'free')
          })
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Creator'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">M</div>
            <span className="text-lg font-bold hidden sm:block">MediaToolkit</span>
          </Link>
          
          {/* Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Credits */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
              <span className="text-purple-400 text-sm">✦</span>
              <span className="font-semibold">{credits}</span>
              <span className="text-gray-500 text-sm hidden sm:block">{t.credits}</span>
            </div>
            
            {/* Language */}
            <div className="relative group">
              <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition">
                🌐
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            
            {/* Profile */}
            <div className="relative group">
              <button className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-800">
                  <div className="font-medium truncate">{userName}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                </div>
                <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800">{t.logout}</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t.welcome}, {userName} 👋</h1>
            <p className="text-gray-500 mt-1">{tools.length} {t.tools}</p>
          </div>
          
          {plan === 'free' && (
            <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:opacity-90 transition">
              ✦ {t.upgrade}
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-2xl font-bold text-purple-400">{credits}</div>
            <div className="text-sm text-gray-500">Credits Left</div>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-2xl font-bold text-green-400">16</div>
            <div className="text-sm text-gray-500">AI Tools</div>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-2xl font-bold text-pink-400">4</div>
            <div className="text-sm text-gray-500">New Tools</div>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-2xl font-bold text-cyan-400 capitalize">{plan}</div>
            <div className="text-sm text-gray-500">Your Plan</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{language === 'tr' ? cat.label : cat.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map(tool => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="group relative p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl`}>
                    {tool.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {tool.isNew && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">{t.new}</span>
                    )}
                    <span className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded-lg">{tool.credits} ✦</span>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-1 group-hover:text-white transition">
                  {language === 'tr' ? tool.name : tool.nameEn}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'tr' ? tool.desc : tool.descEn}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500">No tools found matching your search</p>
          </div>
        )}
      </main>
    </div>
  )
}
