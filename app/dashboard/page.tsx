'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { t, language, setLanguage } = useLanguage()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
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
                  language === 'en' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 py-1 rounded text-xs transition ${
                  language === 'tr' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">{t.dashboard.credits}</p>
              <p className="text-5xl font-bold">50</p>
              <p className="text-white/60 text-sm mt-2">Resets daily</p>
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

            {/* Content Generator - Coming Soon */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 opacity-50 cursor-not-allowed">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-lg font-semibold mb-2">Content Generator</h3>
              <p className="text-gray-400 text-sm mb-4">Generate blog posts, social media content</p>
              <span className="inline-block text-xs bg-gray-600 px-3 py-1 rounded-full">
                {t.common.comingSoon}
              </span>
            </div>

            {/* Image Generator - Coming Soon */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 opacity-50 cursor-not-allowed">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-lg font-semibold mb-2">Image Generator</h3>
              <p className="text-gray-400 text-sm mb-4">Create images with AI</p>
              <span className="inline-block text-xs bg-gray-600 px-3 py-1 rounded-full">
                {t.common.comingSoon}
              </span>
            </div>

            {/* Translator - Coming Soon */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 opacity-50 cursor-not-allowed">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold mb-2">Translator</h3>
              <p className="text-gray-400 text-sm mb-4">Translate between 50+ languages</p>
              <span className="inline-block text-xs bg-gray-600 px-3 py-1 rounded-full">
                {t.common.comingSoon}
              </span>
            </div>

            {/* Code Assistant - Coming Soon */}
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
            <button className="text-blue-400 hover:underline text-sm">
              {t.dashboard.viewAll}
            </button>
          </div>
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-400">{t.dashboard.noHistory}</p>
          </div>
        </div>
      </main>
    </div>
  )
}