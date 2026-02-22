'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function HashtagGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [niche, setNiche] = useState('')
  const [hashtags, setHashtags] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copiedCategory, setCopiedCategory] = useState<string | null>(null)
  const { t, language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast(
        language === 'en' ? 'Please enter a topic' : 'Lütfen bir konu girin',
        'warning'
      )
      return
    }

    setLoading(true)
    setHashtags(null)

    try {
      const response = await fetch('/api/hashtag-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, niche, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setHashtags(data.hashtags)
        showToast(
          language === 'en' ? 'Hashtags generated!' : 'Hashtagler oluşturuldu!',
          'success'
        )
      }
    } catch (err) {
      showToast((language === 'tr' ? 'Hata oluştu' : 'An error occurred'), 'error')
      console.error('Hashtag generation error:', err)
    }

    setLoading(false)
  }

  const copyCategory = (category: string, tags: string[]) => {
    const text = tags.map(tag => `#${tag}`).join(' ')
    navigator.clipboard.writeText(text)
    setCopiedCategory(category)
    showToast(
      language === 'en' ? 'Copied to clipboard!' : 'Panoya kopyalandı!',
      'success'
    )
    setTimeout(() => setCopiedCategory(null), 2000)
  }

  const copyAll = () => {
    if (!hashtags) return
    
    const allTags = [
      ...hashtags.trending,
      ...hashtags.niche,
      ...hashtags.branded
    ]
    const text = allTags.map(tag => `#${tag}`).join(' ')
    navigator.clipboard.writeText(text)
    showToast(
      language === 'en' ? 'All hashtags copied!' : 'Tüm hashtagler kopyalandı!',
      'success'
    )
  }

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-500' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵', color: 'from-cyan-500 to-blue-500' },
    { value: 'youtube', label: 'YouTube', icon: '📺', color: 'from-red-500 to-pink-500' },
    { value: 'twitter', label: 'Twitter', icon: '🐦', color: 'from-blue-400 to-blue-600' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-800' },
  ]

  const quickTopics = [
    { label: 'Fitness', icon: '💪' },
    { label: 'Travel', icon: '✈️' },
    { label: 'Food', icon: '🍕' },
    { label: 'Fashion', icon: '👗' },
    { label: 'Tech', icon: '💻' },
    { label: 'Gaming', icon: '🎮' },
  ]

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
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🏷️</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-green-400 text-sm font-medium">
              {language === 'en' ? '✨ FREE - AI-POWERED HASHTAGS' : '✨ ÜCRETSİZ - AI DESTEKLİ HASHTAG'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'AI Hashtag Generator' : 'AI Hashtag Üretici'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' 
              ? 'AI-powered viral hashtags for maximum reach' 
              : 'Maksimum erişim için trend hashtagler oluştur'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          {/* Platform Selection */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '1. Select Platform' : '1. Platform Seç'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {platforms.map(p => (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={`p-4 rounded-xl border-2 transition ${
                  platform === p.value
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="text-sm font-medium">{p.label}</div>
              </button>
            ))}
          </div>

          {/* Topic Input */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '2. Enter Topic' : '2. Konu Gir'}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none transition mb-3"
            placeholder={language === 'en' ? 'e.g., Fitness, Travel, Cooking...' : 'örn., Fitness, Seyahat, Yemek...'}
          />

          {/* Quick Topics */}
          <div className="flex flex-wrap gap-2 mb-6">
            {quickTopics.map((qt, i) => (
              <button
                key={i}
                onClick={() => setTopic(qt.label)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
              >
                {qt.icon} {qt.label}
              </button>
            ))}
          </div>

          {/* Niche Input (Optional) */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '3. Niche (Optional)' : '3. Niş (İsteğe Bağlı)'}
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none transition"
            placeholder={language === 'en' ? 'e.g., Home Workouts, Vegan Food...' : 'örn., Evde Spor, Vegan Yemekler...'}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</>
          ) : (
            <>🏷️ {language === 'en' ? 'Generate Hashtags' : 'Hashtag Oluştur'}</>
          )}
        </button>

        {hashtags && (
          <div className="animate-fade-in space-y-6">
            {/* Copy All Button */}
            <div className="flex justify-end">
              <button
                onClick={copyAll}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-medium transition"
              >
                📋 {language === 'en' ? 'Copy All Hashtags' : 'Tüm Hashtagleri Kopyala'}
              </button>
            </div>

            {/* Trending Hashtags */}
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    🔥 {language === 'en' ? 'Trending Hashtags' : 'Trend Hashtagler'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'en' ? 'High engagement, viral potential' : 'Yüksek etkileşim, viral potansiyel'}
                  </p>
                </div>
                <button
                  onClick={() => copyCategory('trending', hashtags.trending)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition"
                >
                  {copiedCategory === 'trending' ? '✓' : '📋'} {language === 'en' ? 'Copy' : 'Kopyala'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.trending.map((tag: string, i: number) => (
                  <span key={i} className="bg-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Niche Hashtags */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    🎯 {language === 'en' ? 'Niche Hashtags' : 'Niş Hashtagler'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'en' ? 'Target audience, organic growth' : 'Hedef kitle, organik büyüme'}
                  </p>
                </div>
                <button
                  onClick={() => copyCategory('niche', hashtags.niche)}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm transition"
                >
                  {copiedCategory === 'niche' ? '✓' : '📋'} {language === 'en' ? 'Copy' : 'Kopyala'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.niche.map((tag: string, i: number) => (
                  <span key={i} className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg text-sm font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Branded Hashtags */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    🏷️ {language === 'en' ? 'Branded Hashtags' : 'Marka Hashtagleri'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {language === 'en' ? 'Campaign ideas, memorable tags' : 'Kampanya fikirleri, akılda kalıcı'}
                  </p>
                </div>
                <button
                  onClick={() => copyCategory('branded', hashtags.branded)}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm transition"
                >
                  {copiedCategory === 'branded' ? '✓' : '📋'} {language === 'en' ? 'Copy' : 'Kopyala'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.branded.map((tag: string, i: number) => (
                  <span key={i} className="bg-purple-500/20 text-purple-300 px-3 py-2 rounded-lg text-sm font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                💡 {language === 'en' ? 'Pro Tips' : 'Pro İpuçları'}
              </h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• {language === 'en' 
                  ? 'Mix trending and niche hashtags for best results' 
                  : 'En iyi sonuç için trend ve niş hashtagleri karıştır'}</li>
                <li>• {language === 'en' 
                  ? 'Instagram: 10-15 hashtags | TikTok: 3-5 hashtags' 
                  : 'Instagram: 10-15 hashtag | TikTok: 3-5 hashtag'}</li>
                <li>• {language === 'en' 
                  ? 'Update your hashtag strategy every 2-3 weeks' 
                  : 'Hashtag stratejini her 2-3 haftada bir güncelle'}</li>
                <li>• {language === 'en' 
                  ? 'Avoid banned or spam hashtags' 
                  : 'Yasaklı veya spam hashtaglerden kaçın'}</li>
              </ul>
            </div>
          </div>
        )}

        {!hashtags && (
          <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              💡 {language === 'en' ? 'How it works' : 'Nasıl Çalışır'}
            </h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>• {language === 'en' ? 'Select your social media platform' : 'Sosyal medya platformunu seç'}</li>
              <li>• {language === 'en' ? 'Enter your content topic' : 'İçerik konunu gir'}</li>
              <li>• {language === 'en' ? 'AI generates 3 categories of hashtags' : 'AI 3 kategori hashtag üretir'}</li>
              <li>• {language === 'en' ? 'Copy and paste to your posts' : 'Kopyala ve postlarına yapıştır'}</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}