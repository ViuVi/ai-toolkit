'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function EngagementPredictorPage() {
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [postTime, setPostTime] = useState('12:00')
  const [platform, setPlatform] = useState('instagram')
  const [contentType, setContentType] = useState('photo')
  const [prediction, setPrediction] = useState<any>(null)
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

  const handlePredict = async () => {
    if (!caption.trim()) {
      showToast(language === 'en' ? 'Please enter a caption' : 'Lütfen bir caption girin', 'warning')
      return
    }

    setLoading(true)
    setPrediction(null)

    try {
      const response = await fetch('/api/engagement-predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, hashtags, postTime, platform, contentType, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setPrediction(data.prediction)
        showToast(language === 'en' ? 'Prediction complete!' : 'Tahmin tamamlandı!', 'success')
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
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-green-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-green-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-green-400 text-sm font-medium">
              {language === 'en' ? '📊 5 CREDITS - PREDICTION TOOL' : '📊 5 KREDİ - TAHMİN ARACI'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Engagement Predictor' : 'Engagement Predictor'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Predict your post performance before publishing' : 'Yayınlamadan önce post performansını tahmin et'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-green-500 focus:outline-none">
                <option value="instagram">📸 Instagram</option>
                <option value="tiktok">🎵 TikTok</option>
                <option value="youtube">📺 YouTube</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Content Type' : 'İçerik Tipi'}</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-green-500 focus:outline-none">
                <option value="photo">{language === 'en' ? 'Photo' : 'Fotoğraf'}</option>
                <option value="video">{language === 'en' ? 'Video' : 'Video'}</option>
                <option value="reel">Reel/Short</option>
              </select>
            </div>
          </div>

          <label className="block text-sm font-medium mb-2">Caption</label>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-green-500 focus:outline-none mb-4" placeholder={language === 'en' ? 'Enter your caption...' : 'Caption\'ınızı girin...'} />

          <label className="block text-sm font-medium mb-2">Hashtags</label>
          <input type="text" value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-green-500 focus:outline-none mb-4" placeholder="#example #hashtags #here" />

          <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Post Time' : 'Paylaşım Saati'}</label>
          <input type="time" value={postTime} onChange={(e) => setPostTime(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-green-500 focus:outline-none" />
        </div>

        <button onClick={handlePredict} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8">
          {loading ? <><span className="animate-spin">⏳</span> {t.common.loading}</> : <>📊 {language === 'en' ? 'Predict Engagement' : 'Etkileşim Tahmin Et'}</>}
        </button>

        {prediction && (
          <div className="space-y-6 animate-fade-in">
            <div className={`rounded-2xl p-8 text-center ${
              prediction.overallScore >= 80 ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30' :
              prediction.overallScore >= 60 ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30' :
              prediction.overallScore >= 40 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
              'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30'
            }`}>
              <div className="text-6xl font-bold mb-2">{prediction.overallScore}%</div>
              <div className="text-2xl font-semibold mb-4">{prediction.rating}</div>
              <div className="text-sm text-gray-300">
                {language === 'en' ? 'Estimated Reach' : 'Tahmini Erişim'}: {prediction.estimatedReach.min}-{prediction.estimatedReach.max} {prediction.estimatedReach.unit}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(prediction.metrics).map(([key, value]: [string, any], i) => (
                <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{value}%</div>
                  <div className="text-xs text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>

            {prediction.recommendations.length > 0 && (
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  💡 {language === 'en' ? 'Recommendations' : 'Öneriler'}
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {prediction.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-400">▸</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}