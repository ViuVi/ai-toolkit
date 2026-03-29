'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Trend Radar', niche: 'Niş', nichePlaceholder: 'örn: Fitness, Girişimcilik...', platform: 'Platform', generate: 'Trendleri Tara', generating: 'Taranıyor...', emptyTitle: 'Trend Radar', emptyDesc: 'Nişinizi girin', actionPlan: 'Aksiyon Planı', today: 'Bugün', thisWeek: 'Bu hafta' },
  en: { title: 'Trend Radar', niche: 'Niche', nichePlaceholder: 'e.g: Fitness, Entrepreneurship...', platform: 'Platform', generate: 'Scan Trends', generating: 'Scanning...', emptyTitle: 'Trend Radar', emptyDesc: 'Enter your niche', actionPlan: 'Action Plan', today: 'Today', thisWeek: 'This week' },
  ru: { title: 'Радар трендов', niche: 'Ниша', nichePlaceholder: 'напр: Фитнес, Бизнес...', platform: 'Платформа', generate: 'Сканировать тренды', generating: 'Сканируем...', emptyTitle: 'Радар трендов', emptyDesc: 'Введите вашу нишу', actionPlan: 'План действий', today: 'Сегодня', thisWeek: 'На этой неделе' },
  de: { title: 'Trend-Radar', niche: 'Nische', nichePlaceholder: 'z.B: Fitness, Unternehmertum...', platform: 'Plattform', generate: 'Trends scannen', generating: 'Wird gescannt...', emptyTitle: 'Trend-Radar', emptyDesc: 'Nische eingeben', actionPlan: 'Aktionsplan', today: 'Heute', thisWeek: 'Diese Woche' },
  fr: { title: 'Radar de tendances', niche: 'Niche', nichePlaceholder: 'ex: Fitness, Entrepreneuriat...', platform: 'Plateforme', generate: 'Scanner les tendances', generating: 'Scan en cours...', emptyTitle: 'Radar de tendances', emptyDesc: 'Entrez votre niche', actionPlan: "Plan d'action", today: "Aujourd'hui", thisWeek: 'Cette semaine' }
}

export default function TrendRadarPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = toolTexts[language] || toolTexts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else {
        setUser(session.user)
        setSession(session)
        supabase.from('credits').select('balance').eq('user_id', session.user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [router])

  const handleSearch = async () => {
    if (!niche.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/trend-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ niche, platform, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }
  const fillExample = () => { setNiche('Technology and AI') }


  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">📡 {t.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {(['en', 'tr', 'ru', 'de', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.niche}</label>
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder || "e.g: Fitness..."} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {['tiktok', 'instagram', 'youtube', 'twitter'].map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-3 rounded-xl border text-sm capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={fillExample} className="w-full py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition mb-2">🧪 Try Example</button>

              <button onClick={handleSearch} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `📡 ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">📡</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
            {loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                </div>
                <p className="text-gray-400">{t.generating}</p>
                <div className="flex justify-center gap-1.5 mt-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                {(result.trending_topics || result.trends)?.map((trend: any, i: number) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{trend.topic}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${trend.category === 'RISING FAST' ? 'bg-red-500/20 text-red-400' : trend.category === 'BREAKING' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>{trend.category}</span>
                    </div>
                    {trend.why_trending && <p className="text-sm text-gray-400 mb-2">{trend.why_trending}</p>}
                    {trend.hooks?.map((hook: string, j: number) => <p key={j} className="text-sm text-purple-300">🎯 {hook}</p>)}
                    {trend.time_sensitivity && <p className="text-xs text-gray-500 mt-2">⏰ {trend.time_sensitivity}</p>}
                  </div>
                ))}
                {result.action_plan && (
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">{`🎯 ${t.actionPlan}`}</h4>
                    <p className="text-sm text-gray-300"><strong>{t.today}:</strong> {result.action_plan.today}</p>
                    <p className="text-sm text-gray-300"><strong>{t.thisWeek}:</strong> {result.action_plan.this_week}</p>
                  </div>
                )}
                {result.raw && !(result.trending_topics || result.trends) && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
