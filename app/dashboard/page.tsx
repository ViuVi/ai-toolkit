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
  input_preview: string
  output_preview: string
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
      // Kullanıcıyı al
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)

      // Kredileri al
      const { data: creditsData } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', user.id)
        .single()

      if (creditsData) {
        setCredits(creditsData)
      } else {
        // Kredi yoksa oluştur
        await supabase
          .from('credits')
          .insert({
            user_id: user.id,
            balance: 50,
            total_used: 0
          })
        setCredits({ balance: 50, total_used: 0 })
      }

      // Kullanım geçmişini al
      const { data: historyData } = await supabase
        .from('usage_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (historyData) {
        setHistory(historyData)
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getToolEmoji = (toolName: string) => {
    const emojis: { [key: string]: string } = {
      'summarize': '📝',
      'sentiment': '🎭',
      'generate': '✍️',
      'translate': '🌍',
      'image': '🖼️',
    }
    return emojis[toolName] || '🔧'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🧠</div>
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
            <span className="text-xl font-bold">AI Toolkit</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs transition ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 py-1 rounded text-xs transition ${
                  language === 'tr' ? 'bg-blue-600 text-white' : 'text-gray-400'
                }`}
              >
                TR
              </button>
            </div>

            <span className="text-gray-400 text-sm hidden md:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
            >
              {t.nav.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.dashboard.welcome}! 👋</h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        {/* Credits Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm mb-1">{t.dashboard.credits}</p>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-bold">{credits?.balance || 0}</p>
                <p className="text-white/60 text-sm">
                  / {(credits?.balance || 0) + (credits?.total_used || 0)} total
                </p>
              </div>
              <p className="text-white/60 text-sm mt-2">
                {language === 'en' ? 'Total used:' : 'Toplam kullanılan:'} {credits?.total_used || 0}
              </p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur px-6 py-3 rounded-xl font-semibold transition">
              {t.dashboard.buyCredits}
            </button>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t.dashboard.tools}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Text Summarizer */}
            <Link 
              href="/tools/summarize" 
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition border border-gray-700 hover:border-blue-500 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition">📝</div>
              <h3 className="text-lg font-semibold mb-2">{t.tools.summarize.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{t.tools.summarize.description}</p>
              <span className="inline-block text-xs bg-blue-600 px-3 py-1 rounded-full">
                {t.tools.summarize.credits}
              </span>
            </Link>

            {/* Sentiment Analysis */}
            <Link 
              href="/tools/sentiment" 
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-750 transition border border-gray-700 hover:border-purple-500 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition">🎭</div>
              <h3 className="text-lg font-semibold mb-2">{t.tools.sentiment.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{t.tools.sentiment.description}</p>
              <span className="inline-block text-xs bg-purple-600 px-3 py-1 rounded-full">
                {t.tools.sentiment.credits}
              </span>
            </Link>

            {/* Coming Soon Cards */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 opacity-50 cursor-not-allowed">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-lg font-semibold mb-2">Content Generator</h3>
              <p className="text-gray-400 text-sm mb-4">Generate blog posts, social media</p>
              <span className="inline-block text-xs bg-gray-600 px-3 py-1 rounded-full">
                {t.common.comingSoon}
              </span>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 opacity-50 cursor-not-allowed">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-lg font-semibold mb-2">Image Generator</h3>
              <p className="text-gray-400 text-sm mb-4">Create images with AI</p>
              <span className="inline-block text-xs bg-gray-600 px-3 py-1 rounded-full">
                {t.common.comingSoon}
              </span>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 opacity-50 cursor-not-allowed">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold mb-2">Translator</h3>
              <p className="text-gray-400 text-sm mb-4">Translate 50+ languages</p>
              <span className="inline-block text-xs bg-gray-600 px-3 py-1 rounded-full">
                {t.common.comingSoon}
              </span>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 opacity-50 cursor-not-allowed">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-lg font-semibold mb-2">Code Assistant</h3>
              <p className="text-gray-400 text-sm mb-4">Generate and explain code</p>
              <span className="inline-block text-xs bg-gray-600 px-3 py-1 rounded-full">
                {t.common.comingSoon}
              </span>
            </div>

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
              <p className="text-gray-500 text-sm mt-2">
                {language === 'en' 
                  ? 'Start using AI tools to see your history here'
                  : 'Geçmişinizi görmek için AI araçlarını kullanmaya başlayın'}
              </p>
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
                  <div className="text-2xl">
                    {getToolEmoji(record.tool_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{record.tool_display_name}</span>
                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                        -{record.credits_used} credits
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">
                      {record.input_preview}
                    </p>
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