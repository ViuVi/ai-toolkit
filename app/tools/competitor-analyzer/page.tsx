'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function CompetitorAnalysisPage() {
  const [competitorUrl, setCompetitorUrl] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { t, language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleAnalyze = async () => {
    if (!competitorUrl.trim()) {
      showToast(language === 'en' ? 'Please enter a competitor URL' : 'Lütfen bir rakip URL\'si girin', 'warning')
      return
    }

    setLoading(true)
    setAnalysis(null)

    try {
      const response = await fetch('/api/competitor-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorUrl, platform, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setAnalysis(data.analysis)
        showToast(language === 'en' ? 'Analysis complete!' : 'Analiz tamamlandı!', 'success')
      }
    } catch (err) {
      showToast(t.common.error, 'error')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{t.common.backToDashboard}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-red-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-red-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🔍</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-red-400 text-sm font-medium">
              {language === 'en' ? '🔍 8 CREDITS' : '🔍 8 KREDİ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Competitor Analysis' : 'Rakip Analizi'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Analyze your competitors and discover their strategies' : 'Rakiplerinizi analiz edin ve stratejilerini keşfedin'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 focus:outline-none">
                <option value="instagram">📸 Instagram</option>
                <option value="tiktok">🎵 TikTok</option>
                <option value="youtube">📺 YouTube</option>
                <option value="twitter">🐦 Twitter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Competitor URL' : 'Rakip URL'}
              </label>
              <input
                type="text"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 focus:outline-none"
                placeholder="https://instagram.com/competitor"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8"
        >
          {loading ? <><span className="animate-spin">⏳</span> {t.common.loading}</> : <>🔍 {language === 'en' ? 'Analyze Competitor' : 'Rakibi Analiz Et'}</>}
        </button>

        {analysis && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-2xl font-bold mb-4">{analysis.accountName}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-red-400">{analysis.followers}</div>
                  <div className="text-sm text-gray-400">{language === 'en' ? 'Followers' : 'Takipçi'}</div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-orange-400">{analysis.avgEngagement}%</div>
                  <div className="text-sm text-gray-400">{language === 'en' ? 'Engagement' : 'Etkileşim'}</div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-yellow-400">{analysis.postFrequency}</div>
                  <div className="text-sm text-gray-400">{language === 'en' ? 'Posts/Week' : 'Post/Hafta'}</div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-green-400">{analysis.contentScore}</div>
                  <div className="text-sm text-gray-400">{language === 'en' ? 'Quality Score' : 'Kalite Skoru'}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'Top Performing Content' : 'En Başarılı İçerikler'}</h3>
              <div className="space-y-3">
                {analysis.topPosts.map((post: any, i: number) => (
                  <div key={i} className="bg-gray-700/50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{post.type}</span>
                      <span className="text-red-400">❤️ {post.likes}</span>
                    </div>
                    <p className="text-sm text-gray-400">{post.caption}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'Most Used Hashtags' : 'En Çok Kullanılan Hashtag\'ler'}</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.topHashtags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-400">
                💡 {language === 'en' ? 'Recommendations' : 'Öneriler'}
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {analysis.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-400">▸</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}