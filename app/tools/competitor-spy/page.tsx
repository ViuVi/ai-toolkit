'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function CompetitorSpyPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [competitorInfo, setCompetitorInfo] = useState('')
  const [yourNiche, setYourNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
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

  const handleAnalyze = async () => {
    if (!competitorInfo.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/competitor-spy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorInfo, yourNiche, platform, language })
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
            <h1 className="font-bold">🕵️ Competitor Spy</h1>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rakip Hakkında Bilgi</label>
                <textarea value={competitorInfo} onChange={(e) => setCompetitorInfo(e.target.value)} placeholder="Rakibin kullanıcı adı veya içerik stratejisi hakkında bilgi..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sizin Nişiniz</label>
                <input type="text" value={yourNiche} onChange={(e) => setYourNiche(e.target.value)} placeholder="örn: Fitness, Teknoloji..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {['instagram', 'tiktok', 'youtube', 'twitter'].map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-3 rounded-xl border text-sm capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleAnalyze} disabled={loading || !competitorInfo.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Analiz Ediliyor...</> : '🕵️ Rakibi Analiz Et'}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🕵️</div><h3 className="text-xl font-medium mb-2">Rakip Analizi</h3><p className="text-gray-500">Rakibiniz hakkında bilgi girin</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {result.what_they_do_right && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <h4 className="font-semibold text-green-400 mb-3">✅ Doğru Yaptıkları</h4>
                    {result.what_they_do_right.map((item: any, i: number) => (
                      <div key={i} className="mb-2 p-2 bg-white/5 rounded-lg">
                        <p className="font-medium text-sm">{item.strength}</p>
                        <p className="text-xs text-gray-400">{item.learn_from}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.what_you_can_do_better && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-3">🚀 Siz Daha İyi Yapabilirsiniz</h4>
                    {result.what_you_can_do_better.map((item: any, i: number) => (
                      <div key={i} className="mb-2 p-2 bg-white/5 rounded-lg">
                        <p className="font-medium text-sm">{item.weakness}</p>
                        <p className="text-xs text-gray-400">{item.your_opportunity}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.action_plan && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <h4 className="font-semibold text-orange-400 mb-3">🎯 Aksiyon Planı</h4>
                    {result.action_plan.map((item: any, i: number) => (
                      <div key={i} className="mb-2 flex gap-3 items-start">
                        <span className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded flex items-center justify-center text-sm shrink-0">{item.priority}</span>
                        <p className="text-sm">{item.action}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.raw && !result.what_they_do_right && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
