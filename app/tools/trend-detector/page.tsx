'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

interface Trend {
  topic: string
  trendScore: number
  contentIdeas: string[]
  platforms: string
  bestTime: string
  whyTrending: string
}

export default function TrendDetectorPage() {
  const [niche, setNiche] = useState('')
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleDetect = async () => {
    if (!niche.trim()) {
      showToast(language === 'en' ? 'Please enter a niche/topic' : 'Lütfen niş/konu girin', 'warning')
      return
    }

    setLoading(true)
    setTrends([])

    try {
      const response = await fetch('/api/trend-detector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setTrends(data.trends)
        showToast(language === 'en' ? 'Trends detected!' : 'Trendler tespit edildi!', 'success')
      }
    } catch (err) {
      showToast((language === 'tr' ? 'Hata oluştu' : 'An error occurred'), 'error')
      console.error('Trend detection error:', err)
    }

    setLoading(false)
  }

  const exampleNiches = [
    language === 'en' ? 'digital marketing' : 'dijital pazarlama',
    language === 'en' ? 'content creation' : 'içerik üretimi',
    language === 'en' ? 'entrepreneurship' : 'girişimcilik',
    language === 'en' ? 'personal development' : 'kişisel gelişim',
  ]

  const getTrendColor = (score: number) => {
    if (score >= 90) return 'text-red-400'
    if (score >= 80) return 'text-orange-400'
    return 'text-yellow-400'
  }

  const getTrendBadge = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-red-500 to-pink-500'
    if (score >= 80) return 'bg-gradient-to-r from-orange-500 to-yellow-500'
    return 'bg-gradient-to-r from-yellow-500 to-green-500'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{(language === 'tr' ? 'Panele Dön' : 'Back to Dashboard')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-red-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-red-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🔥</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-red-400 text-sm font-medium">
              {language === 'en' ? '🔥 5 CREDITS - PREMIUM FEATURE' : '🔥 5 KREDİ - PREMİUM ÖZELLİK'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'AI Trend Detector' : 'AI Trend Dedektörü'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' 
              ? 'Discover what\'s trending in your niche right now' 
              : 'Niş\'inizde şu an trend olanları keşfedin'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? 'Your Niche/Topic' : 'Niş/Konunuz'}
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 focus:outline-none transition"
            placeholder={language === 'en' ? 'e.g., digital marketing, fitness, AI...' : 'örn: dijital pazarlama, fitness, yapay zeka...'}
          />
          
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">
              {language === 'en' ? 'Quick examples:' : 'Hızlı örnekler:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {exampleNiches.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setNiche(ex)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleDetect}
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</>
          ) : (
            <>🔥 {language === 'en' ? 'Detect Trends' : 'Trendleri Tespit Et'}</>
          )}
        </button>

        {trends.length > 0 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold mb-4">
              🔥 {language === 'en' ? 'Trending Now' : 'Şu An Trend'}
            </h2>
            
            {trends.map((trend, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-red-500/50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">#{index + 1}</span>
                      <h3 className="text-xl font-semibold">{trend.topic}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`inline-flex items-center gap-1 ${getTrendColor(trend.trendScore)} font-bold`}>
                        📈 {trend.trendScore}% {language === 'en' ? 'Trending' : 'Trend'}
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getTrendBadge(trend.trendScore)} text-white`}>
                        {trend.trendScore >= 90 ? '🔥 HOT' : trend.trendScore >= 80 ? '📈 RISING' : '💫 POPULAR'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-2">
                      💡 {language === 'en' ? 'Content Ideas:' : 'İçerik Önerileri:'}
                    </p>
                    <ul className="space-y-2">
                      {trend.contentIdeas.map((idea, i) => (
                        <li key={i} className="text-sm bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                          → {idea}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        {language === 'en' ? 'Best Platforms' : 'En İyi Platformlar'}
                      </p>
                      <p className="text-sm font-medium">{trend.platforms}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">
                        {language === 'en' ? 'Best Posting Time' : 'En İyi Paylaşım Zamanı'}
                      </p>
                      <p className="text-sm font-medium">{trend.bestTime}</p>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-xs text-blue-400 font-medium mb-1">
                      {language === 'en' ? 'Why it\'s trending:' : 'Neden trend:'}
                    </p>
                    <p className="text-sm">{trend.whyTrending}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 {language === 'en' ? 'Pro Tips' : 'Pro İpuçları'}
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• {language === 'en' ? 'Act fast - trends change quickly' : 'Hızlı hareket edin - trendler çabuk değişir'}</li>
            <li>• {language === 'en' ? 'Add your unique perspective to trending topics' : 'Trend konulara kendi bakış açınızı ekleyin'}</li>
            <li>• {language === 'en' ? 'Post during suggested times for maximum reach' : 'Maksimum erişim için önerilen saatlerde paylaşın'}</li>
            <li>• {language === 'en' ? 'Use platform-specific formats (Reels, Stories, etc.)' : 'Platforma özel formatlar kullanın (Reels, Stories, vb.)'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
