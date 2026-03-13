'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ViralAnalyzerPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [niche, setNiche] = useState('')
  
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

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('İçerik gerekli')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/viral-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platform,
          niche,
          userId: user?.id
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Bir hata oluştu')
      }

      setResult(data.analysis)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
            ← Geri
          </Link>
          <h1 className="text-xl font-bold text-white">🔥 Viral Analyzer</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
            5 kredi
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">İçeriğini Analiz Et</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">İçerik</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Analiz etmek istediğin içeriği yapıştır..."
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Niş (opsiyonel)</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="örn: fitness, teknoloji, moda..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analiz Ediliyor...
                    </span>
                  ) : (
                    '🔥 Analiz Et'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div>
            {result ? (
              <div className="space-y-4">
                {/* Score Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </div>
                  <div className="text-gray-400 mt-2">Viral Skoru</div>
                  <div className="text-white font-medium mt-1">{result.verdict}</div>
                </div>

                {/* Breakdown */}
                {result.breakdown && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Detaylı Analiz</h3>
                    <div className="space-y-3">
                      {Object.entries(result.breakdown).map(([key, value]: [string, any]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">{key.replace(/_/g, ' ')}</span>
                            <span className={getScoreColor(value.score)}>{value.score}/100</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${value.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  {result.strengths && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <h4 className="text-green-400 font-medium mb-2">💪 Güçlü Yönler</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {result.strengths.map((s: string, i: number) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.weaknesses && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <h4 className="text-red-400 font-medium mb-2">⚠️ Zayıf Yönler</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {result.weaknesses.map((w: string, i: number) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Improvements */}
                {result.improvements && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🚀 İyileştirme Önerileri</h3>
                    <div className="space-y-3">
                      {result.improvements.map((imp: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                          <span className={`px-2 py-1 rounded text-xs ${
                            imp.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            imp.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {imp.priority}
                          </span>
                          <div>
                            <div className="text-white text-sm">{imp.suggestion}</div>
                            <div className="text-purple-400 text-xs mt-1">{imp.impact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🔥</div>
                <h3 className="text-xl font-semibold text-white mb-2">Viral Potansiyelini Keşfet</h3>
                <p className="text-gray-400">
                  İçeriğini yapıştır ve viral olma şansını öğren. Detaylı analiz ve iyileştirme önerileri al.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
