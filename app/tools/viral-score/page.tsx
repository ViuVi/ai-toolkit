'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function ViralScorePage() {
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [media, setMedia] = useState('video')
  const [postTime, setPostTime] = useState('18:00')
  const [targetAudience, setTargetAudience] = useState('')
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
    if (!caption.trim()) {
      showToast(language === 'en' ? 'Please enter a caption' : 'Lütfen bir caption girin', 'warning')
      return
    }

    setLoading(true)
    setAnalysis(null)

    try {
      const response = await fetch('/api/viral-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, hashtags, media, platform, postTime, targetAudience, userId, language }),
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

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  ]

  const mediaTypes = [
    { value: 'video', label: language === 'en' ? 'Video' : 'Video', icon: '🎬' },
    { value: 'photo', label: language === 'en' ? 'Photo' : 'Fotoğraf', icon: '📷' },
    { value: 'carousel', label: language === 'en' ? 'Carousel' : 'Galeri', icon: '🎠' },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-blue-500 to-cyan-500'
    if (score >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect': return 'text-green-400 bg-green-500/20'
      case 'good': return 'text-blue-400 bg-blue-500/20'
      case 'warning': return 'text-yellow-400 bg-yellow-500/20'
      case 'error': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
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
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🚀</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-yellow-400 text-sm font-medium">
              {language === 'en' ? '💰 3 Credits - VIRAL PREDICTOR' : '💰 3 Kredi - VİRAL TAHMİNİ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Viral Score Predictor' : 'Viral Skor Tahmini'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' 
              ? 'Analyze your content\'s viral potential before posting' 
              : 'Paylaşmadan önce içeriğinizin viral potansiyelini analiz edin'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          {/* Platform Selection */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '1. Select Platform' : '1. Platform Seç'}
          </label>
          <div className="grid grid-cols-5 gap-3 mb-6">
            {platforms.map(p => (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={`p-3 rounded-xl border-2 transition ${
                  platform === p.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{p.icon}</div>
                <div className="text-xs font-medium">{p.label}</div>
              </button>
            ))}
          </div>

          {/* Media Type */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '2. Media Type' : '2. Medya Tipi'}
          </label>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {mediaTypes.map(m => (
              <button
                key={m.value}
                onClick={() => setMedia(m.value)}
                className={`p-3 rounded-xl border-2 transition ${
                  media === m.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-xl mr-2">{m.icon}</span>
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Caption */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '3. Your Caption' : '3. Caption\'ınız'}
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none transition resize-none mb-4"
            placeholder={language === 'en' ? 'Enter your caption here...' : 'Caption\'ınızı buraya girin...'}
          />

          {/* Hashtags */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '4. Hashtags' : '4. Hashtag\'ler'}
          </label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none transition mb-4"
            placeholder="#viral #trending #fyp"
          />

          {/* Post Time */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '5. Planned Post Time' : '5. Planlanan Paylaşım Saati'}
          </label>
          <input
            type="time"
            value={postTime}
            onChange={(e) => setPostTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none transition"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {t.common.loading}</>
          ) : (
            <>🚀 {language === 'en' ? 'Analyze Viral Potential' : 'Viral Potansiyeli Analiz Et'}</>
          )}
        </button>

        {analysis && (
          <div className="space-y-6 animate-fade-in">
            {/* Main Score */}
            <div className={`bg-gradient-to-r ${getScoreColor(analysis.viralScore)} p-1 rounded-2xl`}>
              <div className="bg-gray-900 rounded-xl p-8 text-center">
                <div className="text-6xl mb-2">{analysis.viralIcon}</div>
                <div className="text-7xl font-bold mb-2">{analysis.viralScore}</div>
                <div className="text-xl text-gray-400 mb-4">{language === 'en' ? 'out of 100' : '/ 100'}</div>
                <div className="text-2xl font-semibold">{analysis.viralCategory}</div>
              </div>
            </div>

            {/* Estimated Reach */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 text-center">
                <div className="text-3xl mb-2">👁️</div>
                <div className="text-2xl font-bold text-purple-400">
                  {analysis.estimatedReach.min.toLocaleString()} - {analysis.estimatedReach.max.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'en' ? 'Estimated Reach' : 'Tahmini Erişim'}
                </div>
              </div>
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 text-center">
                <div className="text-3xl mb-2">💬</div>
                <div className="text-2xl font-bold text-pink-400">{analysis.estimatedEngagement}</div>
                <div className="text-sm text-gray-400">
                  {language === 'en' ? 'Estimated Engagement' : 'Tahmini Etkileşim'}
                </div>
              </div>
            </div>

            {/* Factors Breakdown */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4">
                {language === 'en' ? '📊 Score Breakdown' : '📊 Skor Detayları'}
              </h3>
              <div className="space-y-3">
                {analysis.factors.map((factor: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(factor.status)}`}>
                        {factor.score}/{factor.factor === 'Hashtag' ? 20 : factor.factor.includes('Length') ? 25 : 15}
                      </span>
                      <span className="font-medium">{factor.factor}</span>
                    </div>
                    <span className="text-sm text-gray-400">{factor.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            {analysis.improvements.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-400">
                  💡 {language === 'en' ? 'Improvements to Boost Score' : 'Skoru Artırmak İçin'}
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {analysis.improvements.map((imp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-400">▸</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Competitor Comparison */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4">
                {language === 'en' ? '📈 vs. Competitor Average' : '📈 Rakip Ortalamasına Göre'}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{language === 'en' ? 'Your Score' : 'Sizin Skor'}</span>
                    <span className="font-bold text-purple-400">{analysis.viralScore}</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${analysis.viralScore}%` }}
                    />
                  </div>
                </div>
                <div className="text-3xl">
                  {analysis.viralScore > analysis.competitorAverage ? '🏆' : '📊'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{language === 'en' ? 'Avg. Competitor' : 'Rakip Ort.'}</span>
                    <span className="font-bold text-gray-400">{analysis.competitorAverage}</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-500 rounded-full transition-all duration-1000"
                      style={{ width: `${analysis.competitorAverage}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-sm">
                {analysis.viralScore > analysis.competitorAverage ? (
                  <span className="text-green-400">
                    🎉 {language === 'en' ? `You're ${analysis.viralScore - analysis.competitorAverage} points above average!` : `Ortalamanın ${analysis.viralScore - analysis.competitorAverage} puan üstündesiniz!`}
                  </span>
                ) : (
                  <span className="text-yellow-400">
                    ⚡ {language === 'en' ? `${analysis.competitorAverage - analysis.viralScore} points to beat the average` : `Ortalamayı geçmek için ${analysis.competitorAverage - analysis.viralScore} puan`}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}