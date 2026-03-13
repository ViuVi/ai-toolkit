'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const tools = [
  {
    id: 'viral-analyzer',
    name: 'Viral Analyzer',
    description: 'İçeriğinin viral potansiyelini analiz et, 0-100 skor al',
    icon: '🔥',
    credits: 5,
    category: 'analysis',
    badge: 'Popüler'
  },
  {
    id: 'content-repurposer', 
    name: 'Content Repurposer',
    description: '1 içeriği 7 farklı platforma otomatik uyarla',
    icon: '🔄',
    credits: 8,
    category: 'content',
    badge: 'Güçlü'
  },
  {
    id: 'hashtag-research',
    name: 'Hashtag Research',
    description: 'Hacim, rekabet ve trend analizi ile hashtag bul',
    icon: '#️⃣',
    credits: 3,
    category: 'research'
  },
  {
    id: 'posting-optimizer',
    name: 'Smart Posting Times',
    description: 'Nişine özel en iyi paylaşım zamanlarını öğren',
    icon: '⏰',
    credits: 2,
    category: 'optimization'
  },
  {
    id: 'content-planner',
    name: '30-Day Planner',
    description: '30 günlük profesyonel içerik takvimi oluştur',
    icon: '📅',
    credits: 10,
    category: 'planning',
    badge: 'Pro'
  },
  {
    id: 'competitor-spy',
    name: 'Competitor Spy',
    description: 'Rakiplerinin stratejisini analiz et, fırsatları bul',
    icon: '🕵️',
    credits: 8,
    category: 'analysis'
  },
  {
    id: 'trend-radar',
    name: 'Trend Radar',
    description: 'Güncel trendleri yakala, içerik fırsatlarını gör',
    icon: '📡',
    credits: 5,
    category: 'research',
    badge: 'Yeni'
  },
  {
    id: 'ab-tester',
    name: 'A/B Test Generator',
    description: 'Aynı içeriğin 5 farklı versiyonunu karşılaştır',
    icon: '⚖️',
    credits: 5,
    category: 'optimization'
  },
  {
    id: 'script-studio',
    name: 'Script Studio',
    description: 'Video script, thumbnail ve başlık önerileri al',
    icon: '🎬',
    credits: 6,
    category: 'content'
  },
  {
    id: 'thread-composer',
    name: 'Thread Composer',
    description: 'Viral Twitter/X thread\'leri oluştur',
    icon: '🧵',
    credits: 5,
    category: 'content'
  },
  {
    id: 'carousel-planner',
    name: 'Carousel Planner',
    description: '10 slide\'lık carousel yapısı ve içeriği planla',
    icon: '🎠',
    credits: 4,
    category: 'content'
  },
  {
    id: 'engagement-booster',
    name: 'Engagement Booster',
    description: 'Düşük etkileşimi artırmak için 30 günlük strateji',
    icon: '📈',
    credits: 5,
    category: 'optimization'
  }
]

const categories = [
  { id: 'all', name: 'Tümü', icon: '🏠' },
  { id: 'content', name: 'İçerik', icon: '✍️' },
  { id: 'analysis', name: 'Analiz', icon: '🔍' },
  { id: 'research', name: 'Araştırma', icon: '🔬' },
  { id: 'optimization', name: 'Optimizasyon', icon: '⚡' },
  { id: 'planning', name: 'Planlama', icon: '📋' }
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)

      // Get credits
      const { data: creditData } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single()

      if (creditData) {
        setCredits(creditData.balance)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            MediaToolKit
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2">
              <span className="text-purple-300 text-sm">💎</span>
              <span className="text-white font-semibold ml-2">{credits} Kredi</span>
            </div>
            <Link 
              href="/pricing"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              Kredi Al
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Hoş geldin, {user?.user_metadata?.full_name?.split(' ')[0] || 'Creator'} 👋
          </h1>
          <p className="text-gray-400">
            12 profesyonel araçla içeriklerini bir üst seviyeye taşı
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{tool.icon}</span>
                {tool.badge && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                    {tool.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition">
                {tool.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {tool.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-purple-400 text-sm">
                  💎 {tool.credits} kredi
                </span>
                <span className="text-gray-500 group-hover:text-purple-400 transition">
                  Kullan →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pro Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            🚀 Pro'ya Geç, Sınırsız Kullan
          </h2>
          <p className="text-gray-300 mb-4">
            Aylık 500 kredi, öncelikli destek ve özel araçlara erişim
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            Planları Gör
          </Link>
        </div>
      </main>
    </div>
  )
}
