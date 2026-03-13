'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PostingOptimizerPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [niche, setNiche] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [platforms, setPlatforms] = useState(['instagram'])
  const [region, setRegion] = useState('TR')
  
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)
    }
    getUser()
  }, [])

  const handleOptimize = async () => {
    if (!niche.trim()) {
      setError('Niş gerekli')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/posting-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, targetAudience, platforms, region, userId: user?.id })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setResult(data.optimization)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const platformOptions = [
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' }
  ]

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Geri</Link>
          <h1 className="text-xl font-bold text-white">⏰ Smart Posting Times</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">2 kredi</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Paylaşım Zamanlarını Optimize Et</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Niş / Sektör</label>
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)}
                  placeholder="örn: fitness, teknoloji, moda..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Hedef Kitle (opsiyonel)</label>
                <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="örn: 25-35 yaş kadınlar, girişimciler..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Platformlar</label>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map(p => (
                    <button key={p.id} onClick={() => togglePlatform(p.id)}
                      className={`px-4 py-2 rounded-xl text-sm transition ${
                        platforms.includes(p.id)
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}>
                      {p.icon} {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Bölge</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="TR">Türkiye</option>
                  <option value="US">Amerika</option>
                  <option value="EU">Avrupa</option>
                  <option value="GLOBAL">Global</option>
                </select>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

              <button onClick={handleOptimize} disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Analiz Ediliyor...' : '⏰ Zamanları Bul'}
              </button>
            </div>
          </div>

          <div>
            {result ? (
              <div className="space-y-4">
                {result.platforms && Object.entries(result.platforms).map(([platform, data]: [string, any]) => (
                  <div key={platform} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                      {platformOptions.find(p => p.id === platform)?.icon} {platform}
                    </h3>
                    
                    {data.best_times && (
                      <div className="space-y-3 mb-4">
                        <div className="text-sm text-gray-400">En İyi Zamanlar</div>
                        {data.best_times.map((time: any, i: number) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                            <div>
                              <span className="text-white font-medium">{time.day}</span>
                              <span className="text-purple-400 ml-2">{time.time}</span>
                            </div>
                            <span className="text-green-400 text-sm">{time.engagement}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {data.worst_times && (
                      <div className="bg-red-500/10 rounded-xl p-3">
                        <div className="text-red-400 text-sm">⚠️ Kaçınılması Gereken: {data.worst_times.join(', ')}</div>
                      </div>
                    )}

                    {data.frequency && (
                      <div className="mt-3 text-gray-300 text-sm">
                        📊 Önerilen Sıklık: <span className="text-white">{data.frequency}</span>
                      </div>
                    )}
                  </div>
                ))}

                {result.weekly_schedule && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">📅 Haftalık Program</h3>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                      {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => (
                        <div key={day} className="bg-white/5 rounded-lg p-2">
                          <div className="text-gray-400">{day}</div>
                          <div className="text-white font-medium mt-1">
                            {result.weekly_schedule[day.toLowerCase()] || '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold text-white mb-2">Paylaşım Zamanlarını Bul</h3>
                <p className="text-gray-400">Nişine ve hedef kitlene özel en iyi paylaşım zamanlarını öğren.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
