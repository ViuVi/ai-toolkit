'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function CompetitorSpyPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [competitorHandle, setCompetitorHandle] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [niche, setNiche] = useState('')
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
    }
    getUser()
  }, [])

  const handleAnalyze = async () => {
    if (!competitorHandle.trim()) { setError('Rakip hesabı gerekli'); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/competitor-spy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorHandle, platform, niche, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setResult(data.analysis)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Geri</Link>
          <h1 className="text-xl font-bold text-white">🕵️ Competitor Spy</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">8 kredi</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Rakip Analizi</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rakip Hesabı</label>
                <input type="text" value={competitorHandle} onChange={(e) => setCompetitorHandle(e.target.value)}
                  placeholder="@kullaniciadi veya hesap adı"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Niş (opsiyonel)</label>
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)}
                  placeholder="örn: fitness, moda..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

              <button onClick={handleAnalyze} disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Analiz Ediliyor...' : '🕵️ Analiz Et'}
              </button>
            </div>
          </div>

          <div>
            {result ? (
              <div className="space-y-4">
                {/* Profile Overview */}
                {result.profile_overview && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">📊 Profil Özeti</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(result.profile_overview).map(([key, value]: [string, any]) => (
                        <div key={key} className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-gray-400 text-sm capitalize">{key.replace(/_/g, ' ')}</div>
                          <div className="text-white font-semibold">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Strategy */}
                {result.content_strategy && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">📋 İçerik Stratejisi</h3>
                    <div className="space-y-3">
                      {result.content_strategy.content_types && (
                        <div>
                          <span className="text-gray-400 text-sm">İçerik Türleri:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {result.content_strategy.content_types.map((t: string, i: number) => (
                              <span key={i} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.content_strategy.posting_frequency && (
                        <div className="text-gray-300">📅 Paylaşım Sıklığı: <span className="text-white">{result.content_strategy.posting_frequency}</span></div>
                      )}
                      {result.content_strategy.best_performing && (
                        <div className="text-gray-300">🔥 En İyi Performans: <span className="text-white">{result.content_strategy.best_performing}</span></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Opportunities */}
                {result.opportunities && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">💡 Fırsatlar</h3>
                    <ul className="space-y-2">
                      {result.opportunities.map((opp: string, i: number) => (
                        <li key={i} className="text-gray-300 flex items-start gap-2">
                          <span className="text-green-400">✓</span> {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {result.action_items && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🎯 Aksiyon Önerileri</h3>
                    <ul className="space-y-2">
                      {result.action_items.map((item: string, i: number) => (
                        <li key={i} className="text-gray-300 flex items-start gap-2">
                          <span className="text-purple-400">{i + 1}.</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🕵️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Rakip Analizi</h3>
                <p className="text-gray-400">Rakiplerinin stratejilerini öğren, boşluklarını bul, fırsatları yakala.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
