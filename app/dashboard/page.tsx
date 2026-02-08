'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

interface Credits {
  balance: number
  total_used: number
}

interface UsageRecord {
  id: string
  tool_name: string
  tool_display_name: string
  credits_used: number
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [history, setHistory] = useState<UsageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { t, language, setLanguage } = useLanguage()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)

      const { data: creditsData } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', user.id)
        .single()

      if (creditsData) {
        setCredits(creditsData)
      } else {
        await supabase.from('credits').insert({ user_id: user.id, balance: 50, total_used: 0 })
        setCredits({ balance: 50, total_used: 0 })
      }

      const { data: historyData } = await supabase
        .from('usage_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (historyData) setHistory(historyData)
      setLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const toolEmojis: {[key: string]: string} = {
    'platform-adapter': '🔄',
    'hook-generator': '🎣',
    'decision-helper': '⚖️',
    'summarize': '📝',
    'trend-detector': '🔥',
    'competitor-analyzer': '🔍',
  }

  // Basitleştirilmiş araç listesi - KATEGORİ YOK
  const tools = [
    // PREMIUM ARAÇLAR
    {
      href: '/tools/competitor-analyzer',
      icon: '🔍',
      name: language === 'tr' ? 'Rakip Analizi' : 'Competitor Analyzer',
      desc: language === 'tr' 
        ? 'Rakiplerden öğren, daha iyi içerik üret' 
        : 'Learn from competitors, create better content',
      credits: '8 Kredi',
      color: 'hover:border-purple-500',
      badge: 'from-purple-500 to-pink-500',
      isPremium: true
    },
    {
      href: '/tools/trend-detector',
      icon: '🔥',
      name: language === 'tr' ? 'Trend Dedektörü' : 'Trend Detector',
      desc: language === 'tr' 
        ? 'Niş\'inizde şu an trend olanları keşfedin' 
        : 'Discover trending topics in your niche',
      credits: '5 Kredi',
      color: 'hover:border-red-500',
      badge: 'from-red-500 to-pink-500',
      isPremium: true
    },
    
    // STANDART ARAÇLAR
    {
      href: '/tools/hook-generator',
      icon: '🎣',
      name: t.tools.hookGenerator.title,
      desc: t.tools.hookGenerator.description,
      credits: t.tools.hookGenerator.credits,
      color: 'hover:border-yellow-500',
      badge: 'from-yellow-500 to-orange-500'
    },
    {
      href: '/tools/platform-adapter',
      icon: '🔄',
      name: t.tools.platformAdapter.title,
      desc: t.tools.platformAdapter.description,
      credits: t.tools.platformAdapter.credits,
      color: 'hover:border-pink-500',
      badge: 'from-pink-500 to-purple-500'
    },
    {
      href: '/tools/decision-helper',
      icon: '⚖️',
      name: t.tools.decisionHelper.title,
      desc: t.tools.decisionHelper.description,
      credits: t.tools.decisionHelper.credits,
      color: 'hover:border-indigo-500',
      badge: 'from-indigo-500 to-purple-500'
    },
    {
      href: '/tools/summarize',
      icon: '📝',
      name: t.tools.quickSummary.title,
      desc: t.tools.quickSummary.description,
      credits: t.tools.quickSummary.credits,
      color: 'hover:border-blue-500',
      badge: 'from-blue-500 to-cyan-500'
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🧠</div>
          <p className="text-xl">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="text-xl font-bold">Clarity AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-gray-400 text-sm hidden md:block">{user?.email}</span>
            <button onClick={handleLogout} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">
              {t.nav.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome + Credits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{t.dashboard.welcome}! 👋</h1>
            <p className="text-gray-400">
              {language === 'en' 
                ? 'What would you like to accomplish today?' 
                : 'Bugün ne başarmak istersin?'}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6">
            <p className="text-white/80 text-sm mb-1">{t.dashboard.credits}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold">{credits?.balance || 0}</p>
              <p className="text-white/60 text-sm">{t.common.credits}</p>
            </div>
            <button className="mt-4 w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition">
              {t.dashboard.buyCredits}
            </button>
          </div>
        </div>

        {/* Araçlar - TEK GRİD, KATEGORİ YOK */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">
            {language === 'en' ? '🛠️ AI Tools' : '🛠️ AI Araçlar'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <Link 
                key={index} 
                href={tool.href} 
                className={`bg-gray-800 rounded-2xl p-6 border border-gray-700 ${tool.color} transition group relative`}
              >
                {tool.isPremium && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full font-medium">
                      PREMIUM
                    </span>
                  </div>
                )}
                
                <div className="text-4xl mb-4 group-hover:scale-110 transition">{tool.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tool.desc}</p>
                <span className={`inline-block text-xs bg-gradient-to-r ${tool.badge} px-3 py-1 rounded-full text-white`}>
                  {tool.credits}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t.dashboard.history}</h2>
            {history.length > 0 && (
              <button className="text-blue-400 hover:underline text-sm">
                {t.dashboard.viewAll}
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-400">{t.dashboard.noHistory}</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              {history.map((record, index) => (
                <div 
                  key={record.id} 
                  className={`p-4 flex items-center gap-4 ${
                    index !== history.length - 1 ? 'border-b border-gray-700' : ''
                  }`}
                >
                  <div className="text-2xl">{toolEmojis[record.tool_name] || '🔧'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{record.tool_display_name}</span>
                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                        -{record.credits_used} {t.common.credits}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm whitespace-nowrap">
                    {formatDate(record.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}