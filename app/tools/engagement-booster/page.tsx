'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function EngagementBoosterPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [niche, setNiche] = useState('')
  const [platforms, setPlatforms] = useState(['instagram'])
  const [currentEngagement, setCurrentEngagement] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
    }
    getUser()
  }, [])

  const handleBoost = async () => {
    if (!niche.trim()) { setError('Niş gerekli'); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/engagement-booster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platforms, currentEngagement, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setResult(data.strategy)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const platformOptions = ['instagram', 'tiktok', 'twitter', 'youtube', 'linkedin']
  const togglePlatform = (p: string) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Geri</Link>
          <h1 className="text-xl font-bold text-white">📈 Engagement Booster</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">5 kredi</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">30 Günlük Etkileşim Stratejisi</h2>
              
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
                        className={`px-4 py-2 rounded-xl text-sm capitalize transition ${
                          platforms.includes(p) ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-300'
                        }`}>{p}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Mevcut Etkileşim Oranı (opsiyonel)</label>
                  <input type="text" value={currentEngagement} onChange={(e) => setCurrentEngagement(e.target.value)}
                    placeholder="örn: %2, düşük, orta..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

                <button onClick={handleBoost} disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                  {loading ? 'Strateji Hazırlanıyor...' : '📈 Strateji Oluştur'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview */}
            {result.overview && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">📋 Strateji Özeti</h3>
                <p className="text-gray-300">{result.overview}</p>
              </div>
            )}

            {/* Weekly Plan */}
            {result.weekly_plan && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📅 Haftalık Plan</h3>
                <div className="space-y-4">
                  {Object.entries(result.weekly_plan).map(([week, data]: [string, any]) => (
                    <div key={week} className="bg-white/5 rounded-xl p-4">
                      <div className="text-purple-400 font-medium mb-2">{week}</div>
                      <div className="text-white mb-2">{data.focus}</div>
                      {data.tasks && (
                        <ul className="space-y-1">
                          {data.tasks.map((task: string, i: number) => (
                            <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                              <span className="text-green-400">✓</span> {task}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Wins */}
            {result.quick_wins && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">⚡ Hızlı Kazanımlar</h3>
                <div className="grid grid-cols-2 gap-3">
                  {result.quick_wins.map((win: any, i: number) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4">
                      <div className="text-white font-medium">{win.action}</div>
                      <div className="text-green-400 text-sm">{win.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Ideas */}
            {result.content_ideas && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">💡 İçerik Fikirleri</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {result.content_ideas.map((idea: any, i: number) => (
                    <div key={i} className="bg-purple-500/10 rounded-xl p-3">
                      <div className="text-white text-sm">{idea.idea || idea}</div>
                      {idea.type && <div className="text-purple-400 text-xs mt-1">{idea.type}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Tactics */}
            {result.engagement_tactics && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🎯 Etkileşim Taktikleri</h3>
                <ul className="space-y-2">
                  {result.engagement_tactics.map((tactic: string, i: number) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400">{i + 1}.</span> {tactic}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expected Results */}
            {result.expected_results && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">🎯 Beklenen Sonuçlar</h3>
                <p className="text-gray-300">{result.expected_results}</p>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="text-purple-400 hover:text-purple-300">
                ← Yeni Strateji Oluştur
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
