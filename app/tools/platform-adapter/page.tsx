'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function PlatformAdapterPage() {
  const [content, setContent] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const { t, language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleAdapt = async () => {
    if (!content.trim()) {
      showToast(language === 'en' ? 'Please enter content' : 'Lütfen içerik girin', 'warning')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/platform-adapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setResult(data)
        showToast(language === 'en' ? 'Content adapted!' : 'İçerik uyarlandı!', 'success')
      }
    } catch (err) {
      showToast((language === 'tr' ? 'Hata oluştu' : 'An error occurred'), 'error')
    }

    setLoading(false)
  }

  const handleCopy = (platform: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(platform)
    showToast((language === 'tr' ? 'Kopyalandı!' : 'Copied!'), 'success')
    setTimeout(() => setCopied(null), 2000)
  }

  const platforms = [
    { key: 'instagram', icon: '📸', color: 'from-pink-500 to-purple-500', name: 'Instagram' },
    { key: 'linkedin', icon: '💼', color: 'from-blue-600 to-blue-800', name: 'LinkedIn' },
    { key: 'twitter', icon: '𝕏', color: 'from-gray-700 to-gray-900', name: 'Twitter/X' },
    { key: 'tiktok', icon: '🎵', color: 'from-pink-500 to-cyan-500', name: 'TikTok' },
  ]

  const exampleContent = `The future of work is changing rapidly. Remote work has become the norm for many companies, and this shift is here to stay. Studies show that employees who work remotely are often more productive and report higher job satisfaction. However, it's important to maintain work-life balance and stay connected with your team. The key is finding the right tools and creating a dedicated workspace at home.`

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{(language === 'tr' ? 'Panele Dön' : 'Back to Dashboard')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🔄</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-pink-400 text-sm">{(language === 'tr' ? '3 Kredi' : '3 Credits')}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{(language === 'tr' ? 'Platform Adaptörü' : 'Platform Adapter')}</h1>
          <p className="text-gray-400">{(language === 'tr' ? 'İçeriği farklı platformlara uyarlayın' : 'Adapt content to different platforms')}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3">{(language === 'tr' ? 'İçerik' : 'Content')}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-48 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-pink-500 focus:outline-none resize-none transition"
            placeholder={(language === 'tr' ? 'İçeriğinizi girin...' : 'Enter your content...')}
          />
          <button
            onClick={() => setContent(exampleContent)}
            className="mt-3 text-sm text-pink-400 hover:underline"
          >
            📌 {language === 'en' ? 'Load example content' : 'Örnek içerik yükle'}
          </button>
        </div>

        <button
          onClick={handleAdapt}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</>
          ) : (
            <>🔄 {(language === 'tr' ? 'Adapte Et' : 'Adapt')}</>
          )}
        </button>

        {result && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold">{(language === 'tr' ? 'Sonuçlar' : 'Results')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platforms.map(platform => (
                <div key={platform.key} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                  <div className={`bg-gradient-to-r ${platform.color} px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{platform.icon}</span>
                      <span className="font-semibold">{platform.name}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(platform.key, result.platforms[platform.key])}
                      className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition"
                    >
                      {copied === platform.key ? '✓' : '📋'}
                    </button>
                  </div>
                  <div className="p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                      {result.platforms[platform.key]}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 {language === 'en' ? 'Pro Tips' : 'İpuçları'}
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• {language === 'en' ? 'Paste any content: blog posts, ideas, notes, or articles' : 'Herhangi bir içerik yapıştır: blog yazısı, fikir, not veya makale'}</li>
            <li>• {language === 'en' ? 'Each platform gets a unique, optimized version' : 'Her platform benzersiz, optimize edilmiş versiyon alır'}</li>
            <li>• {language === 'en' ? 'Edit the output to match your voice and style' : 'Çıktıyı kendi sesin ve stiline göre düzenle'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}