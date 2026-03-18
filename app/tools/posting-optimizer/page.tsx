'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function PostingOptimizerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [platforms, setPlatforms] = useState(['instagram', 'tiktok'])
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else {
        setUser(session.user)
        supabase.from('credits').select('balance').eq('user_id', session.user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [router])

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) setPlatforms(platforms.filter(x => x !== p))
    else setPlatforms([...platforms, p])
  }

  const handleAnalyze = async () => {
    if (!niche.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/posting-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, targetAudience, platforms: platforms.join(','), language })
      })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
      else setError(data.error || 'Hata oluştu')
    } catch (e) { setError('Bağlantı hatası') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">⏰ Smart Posting Times</h1>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Niş</label>
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="örn: Moda, Fitness..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Hedef Kitle (opsiyonel)</label>
                <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="örn: 18-25 yaş kadınlar..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platformlar</label>
                <div className="grid grid-cols-2 gap-2">
                  {['instagram', 'tiktok', 'youtube', 'twitter'].map((p) => (
                    <button key={p} onClick={() => togglePlatform(p)} className={`p-2 rounded-xl border text-sm capitalize ${platforms.includes(p) ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleAnalyze} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Analiz Ediliyor...</> : '⏰ En İyi Zamanları Bul'}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">⏰</div><h3 className="text-xl font-medium mb-2">Posting Optimizer</h3><p className="text-gray-500">Nişinize göre en iyi paylaşım saatlerini bulun</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {/* Optimal Times */}
                {result.optimal_times && (
                  <div className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                    <h3 className="font-semibold text-purple-400 mb-4">🏆 En İyi Zamanlar</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {result.optimal_times.map((t: any, i: number) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl text-center">
                          <p className="text-2xl font-bold text-white">{t.time}</p>
                          <p className="text-xs text-gray-400">{t.day}</p>
                          {t.reason && <p className="text-xs text-purple-400 mt-1">{t.reason}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* By Platform */}
                {result.by_platform && Object.entries(result.by_platform).map(([platform, data]: [string, any]) => (
                  <div key={platform} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-semibold capitalize text-purple-400 mb-3">{platform}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {data.best_times?.map((t: any, i: number) => (
                        <div key={i} className="p-2 bg-white/5 rounded text-sm">
                          <span className="font-medium">{t.time}</span>
                          <span className="text-gray-500 ml-2">{t.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Weekly Schedule */}
                {result.weekly_schedule && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-semibold text-green-400 mb-3">📅 Haftalık Program</h4>
                    <div className="space-y-2">
                      {Object.entries(result.weekly_schedule).map(([day, times]: [string, any]) => (
                        <div key={day} className="flex justify-between items-center p-2 bg-white/5 rounded">
                          <span className="font-medium capitalize">{day}</span>
                          <span className="text-sm text-gray-400">{Array.isArray(times) ? times.join(', ') : times}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pro Tips */}
                {result.pro_tips && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <h4 className="font-semibold text-orange-400 mb-3">💡 Pro İpuçları</h4>
                    <div className="space-y-1">
                      {result.pro_tips.map((tip: string, i: number) => (
                        <p key={i} className="text-sm text-gray-300">• {tip}</p>
                      ))}
                    </div>
                  </div>
                )}

                {result.raw && !result.optimal_times && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
