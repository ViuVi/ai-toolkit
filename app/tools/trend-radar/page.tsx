'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function TrendRadarPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [niche, setNiche] = useState('')
  const [platforms, setPlatforms] = useState(['instagram', 'tiktok'])
  const [region, setRegion] = useState('TR')
  
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

  const handleScan = async () => {
    if (!niche.trim()) { setError('Niş gerekli'); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/trend-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platforms, region, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setResult(data.trends)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const platformOptions = ['instagram', 'tiktok', 'twitter', 'youtube']
  const togglePlatform = (p: string) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Geri</Link>
          <h1 className="text-xl font-bold text-white">📡 Trend Radar</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">5 kredi</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Trendleri Tara</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Niş / Sektör</label>
                  <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)}
                    placeholder="örn: fitness, teknoloji..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Platformlar</label>
                  <div className="flex flex-wrap gap-2">
                    {platformOptions.map(p => (
                      <button key={p} onClick={() => togglePlatform(p)}
                        className={`px-3 py-1 rounded-lg text-sm capitalize transition ${
                          platforms.includes(p) ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-300'
                        }`}>{p}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bölge</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                    <option value="TR">Türkiye</option>
                    <option value="US">Amerika</option>
                    <option value="GLOBAL">Global</option>
                  </select>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

                <button onClick={handleScan} disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                  {loading ? 'Taranıyor...' : '📡 Trendleri Tara'}
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            {result ? (
              <div className="space-y-6">
                {/* Hot Trends */}
                {result.hot_trends && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🔥 Sıcak Trendler</h3>
                    <div className="space-y-3">
                      {result.hot_trends.map((trend: any, i: number) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{trend.name}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              trend.momentum === 'rising' ? 'bg-green-500/20 text-green-400' :
                              trend.momentum === 'peak' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>{trend.momentum}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{trend.description}</p>
                          {trend.content_ideas && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {trend.content_ideas.map((idea: string, j: number) => (
                                <span key={j} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">{idea}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emerging Trends */}
                {result.emerging_trends && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🌱 Yükselen Trendler</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {result.emerging_trends.map((trend: any, i: number) => (
                        <div key={i} className="bg-white/5 rounded-xl p-3">
                          <div className="text-white font-medium">{trend.name}</div>
                          <div className="text-green-400 text-sm">{trend.potential}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Viral Formats */}
                {result.viral_formats && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🎬 Viral Formatlar</h3>
                    <div className="space-y-2">
                      {result.viral_formats.map((format: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                          <span className="text-white">{format.format}</span>
                          <span className="text-purple-400 text-sm">{format.platform}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Opportunities */}
                {result.content_opportunities && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">💡 İçerik Fırsatları</h3>
                    <ul className="space-y-2">
                      {result.content_opportunities.map((opp: string, i: number) => (
                        <li key={i} className="text-gray-300 flex items-start gap-2">
                          <span className="text-purple-400">•</span> {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">📡</div>
                <h3 className="text-xl font-semibold text-white mb-2">Trend Radar</h3>
                <p className="text-gray-400">Nişindeki güncel trendleri keşfet, içerik fırsatlarını yakala.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
