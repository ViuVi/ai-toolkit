'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function ContentPlannerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [platforms, setPlatforms] = useState('Instagram, TikTok')
  const [postsPerWeek, setPostsPerWeek] = useState('5')
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

  const handleGenerate = async () => {
    if (!niche.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/content-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platforms, postsPerWeek, language })
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
            <h1 className="font-bold">📅 Content Planner</h1>
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
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="örn: Fitness, Kişisel gelişim..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Haftalık Post Sayısı</label>
                <div className="grid grid-cols-4 gap-2">
                  {['3', '5', '7', '14'].map((n) => (
                    <button key={n} onClick={() => setPostsPerWeek(n)} className={`p-3 rounded-xl border text-sm ${postsPerWeek === n ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerate} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Planlanıyor...</> : '📅 30 Günlük Plan Oluştur'}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">📅</div><h3 className="text-xl font-medium mb-2">30 Günlük Plan</h3><p className="text-gray-500">Nişinizi girin</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {result.strategy && (
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">🎯 Strateji</h4>
                    <p className="text-sm text-gray-300">Sıklık: {result.strategy.posting_frequency}</p>
                    {result.strategy.content_pillars && <p className="text-sm text-gray-400 mt-1">Konular: {result.strategy.content_pillars.join(', ')}</p>}
                  </div>
                )}
                {result.calendar?.slice(0, 14).map((day: any, i: number) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-400">Gün {day.day}</span>
                      <span className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded">{day.format}</span>
                    </div>
                    <h4 className="font-medium mb-1">{day.topic}</h4>
                    {day.hook && <p className="text-sm text-gray-400">🎯 {day.hook}</p>}
                    {day.best_time && <p className="text-xs text-gray-500 mt-2">⏰ {day.best_time}</p>}
                  </div>
                ))}
                {result.calendar?.length > 14 && <p className="text-center text-gray-500 text-sm">+ {result.calendar.length - 14} gün daha...</p>}
                {result.raw && !result.calendar && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
