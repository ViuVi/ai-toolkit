'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ContentRepurposerPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [activePlatform, setActivePlatform] = useState('instagram_post')
  
  const [content, setContent] = useState('')
  const [sourceType, setSourceType] = useState('blog')
  
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }
      setUser(session.user)
    }
    getUser()
  }, [])

  const handleRepurpose = async () => {
    if (!content.trim()) {
      setError('İçerik gerekli')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/content-repurposer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          sourceType,
          userId: user?.id
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Bir hata oluştu')
      }

      setResult(data.repurposed)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const platforms = [
    { id: 'instagram_post', name: 'Instagram Post', icon: '📸' },
    { id: 'instagram_reels', name: 'Reels', icon: '🎬' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'youtube_shorts', name: 'Shorts', icon: '📺' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌' }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
            ← Geri
          </Link>
          <h1 className="text-xl font-bold text-white">🔄 Content Repurposer</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
            8 kredi
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">1 İçerik → 7 Platform</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Kaynak Tipi</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="blog">Blog Yazısı</option>
                    <option value="video">Video Script</option>
                    <option value="podcast">Podcast Özeti</option>
                    <option value="article">Makale</option>
                    <option value="notes">Notlar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">İçerik</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Dönüştürmek istediğin içeriği yapıştır..."
                    className="w-full h-60 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleRepurpose}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      7 Platforma Uyarlanıyor...
                    </span>
                  ) : (
                    '🔄 Dönüştür'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Platform Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePlatform(p.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    activePlatform === p.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {p.icon} {p.name}
                </button>
              ))}
            </div>

            {/* Platform Content */}
            {result.platforms && result.platforms[activePlatform] && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {platforms.find(p => p.id === activePlatform)?.icon} {platforms.find(p => p.id === activePlatform)?.name}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(result.platforms[activePlatform], null, 2))}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    📋 Tümünü Kopyala
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Content */}
                  {result.platforms[activePlatform].content && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">İçerik</span>
                        <button onClick={() => copyToClipboard(result.platforms[activePlatform].content)} className="text-purple-400 text-xs">Kopyala</button>
                      </div>
                      <p className="text-white whitespace-pre-wrap">{result.platforms[activePlatform].content}</p>
                    </div>
                  )}

                  {/* Hook */}
                  {result.platforms[activePlatform].hook && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-400 text-sm">🎣 Hook</span>
                        <button onClick={() => copyToClipboard(result.platforms[activePlatform].hook)} className="text-purple-400 text-xs">Kopyala</button>
                      </div>
                      <p className="text-white">{result.platforms[activePlatform].hook}</p>
                    </div>
                  )}

                  {/* Script */}
                  {result.platforms[activePlatform].script && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">📝 Script</span>
                        <button onClick={() => copyToClipboard(result.platforms[activePlatform].script)} className="text-purple-400 text-xs">Kopyala</button>
                      </div>
                      <p className="text-white whitespace-pre-wrap">{result.platforms[activePlatform].script}</p>
                    </div>
                  )}

                  {/* Thread */}
                  {result.platforms[activePlatform].thread && (
                    <div className="space-y-2">
                      <span className="text-gray-400 text-sm">🧵 Thread</span>
                      {result.platforms[activePlatform].thread.map((tweet: string, i: number) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <span className="text-purple-400 text-xs">{i + 1}/{result.platforms[activePlatform].thread.length}</span>
                            <button onClick={() => copyToClipboard(tweet)} className="text-purple-400 text-xs">Kopyala</button>
                          </div>
                          <p className="text-white mt-2">{tweet}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hashtags */}
                  {result.platforms[activePlatform].hashtags && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <span className="text-gray-400 text-sm">🏷️ Hashtags</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {result.platforms[activePlatform].hashtags.map((tag: string, i: number) => (
                          <span key={i} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Best Time */}
                  {result.platforms[activePlatform].best_time && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <span className="text-green-400 text-sm">⏰ En İyi Zaman: {result.platforms[activePlatform].best_time}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Calendar */}
            {result.content_calendar && (
              <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📅 Önerilen Paylaşım Takvimi</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(result.content_calendar).map(([day, info]: [string, any]) => (
                    <div key={day} className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-gray-400 text-xs">{day.replace('day_', 'Gün ')}</div>
                      <div className="text-white text-sm font-medium mt-1">{info.platform}</div>
                      <div className="text-purple-400 text-xs mt-1">{info.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Content Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setResult(null)}
                className="text-purple-400 hover:text-purple-300"
              >
                ← Yeni İçerik Dönüştür
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
