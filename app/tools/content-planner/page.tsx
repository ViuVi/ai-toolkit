'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ContentPlannerPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [niche, setNiche] = useState('')
  const [goals, setGoals] = useState('')
  const [platforms, setPlatforms] = useState(['instagram'])
  
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
    }
    getUser()
  }, [])

  const handlePlan = async () => {
    if (!niche.trim()) { setError('Niş gerekli'); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/content-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, goals, platforms, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setResult(data.plan)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const platformOptions = ['instagram', 'tiktok', 'twitter', 'youtube', 'linkedin']
  const togglePlatform = (p: string) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Geri</Link>
          <h1 className="text-xl font-bold text-white">📅 30-Day Content Planner</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">10 kredi</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">30 Günlük İçerik Takvimi</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Niş / Sektör</label>
                  <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)}
                    placeholder="örn: fitness, dijital pazarlama..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Hedefler</label>
                  <textarea value={goals} onChange={(e) => setGoals(e.target.value)}
                    placeholder="örn: takipçi artışı, satış, marka bilinirliği..."
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Platformlar</label>
                  <div className="flex flex-wrap gap-2">
                    {platformOptions.map(p => (
                      <button key={p} onClick={() => togglePlatform(p)}
                        className={`px-4 py-2 rounded-xl text-sm capitalize transition ${
                          platforms.includes(p) ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}>{p}</button>
                    ))}
                  </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

                <button onClick={handlePlan} disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                  {loading ? '30 Günlük Plan Hazırlanıyor...' : '📅 Takvim Oluştur'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Strategy Overview */}
            {result.strategy && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">📋 Strateji Özeti</h3>
                <p className="text-gray-300">{result.strategy}</p>
              </div>
            )}

            {/* Calendar Grid */}
            {result.calendar && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📅 30 Günlük Takvim</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.calendar.map((day: any, i: number) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-purple-400 font-medium">Gün {day.day}</span>
                        <span className="text-gray-400 text-xs">{day.platform}</span>
                      </div>
                      <div className="text-white text-sm mb-2">{day.content_type}</div>
                      <div className="text-gray-300 text-sm">{day.topic}</div>
                      {day.hook && <div className="text-purple-400 text-xs mt-2">🎣 {day.hook}</div>}
                      {day.time && <div className="text-green-400 text-xs mt-1">⏰ {day.time}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Pillars */}
            {result.content_pillars && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🏛️ İçerik Sütunları</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {result.content_pillars.map((pillar: any, i: number) => (
                    <div key={i} className="bg-purple-500/10 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">{pillar.emoji || '📌'}</div>
                      <div className="text-white font-medium">{pillar.name}</div>
                      <div className="text-gray-400 text-sm">{pillar.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <button onClick={() => setResult(null)} className="text-purple-400 hover:text-purple-300">
                ← Yeni Plan Oluştur
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
