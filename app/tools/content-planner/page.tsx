'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'İçerik Planlayıcı', niche: 'Niş', nichePlaceholder: 'örn: Fitness, Kişisel gelişim...', postsPerWeek: 'Haftalık Post Sayısı', generate: '30 Günlük Plan Oluştur', generating: 'Planlanıyor...', emptyTitle: '30 Günlük Plan', emptyDesc: 'Nişinizi girin', strategy: 'Strateji', day: 'Gün' },
  en: { title: 'Content Planner', niche: 'Niche', nichePlaceholder: 'e.g: Fitness, Personal development...', postsPerWeek: 'Posts Per Week', generate: 'Create 30-Day Plan', generating: 'Planning...', emptyTitle: '30-Day Plan', emptyDesc: 'Enter your niche', strategy: 'Strategy', day: 'Day' },
  ru: { title: 'Планировщик контента', niche: 'Ниша', nichePlaceholder: 'напр: Фитнес, Саморазвитие...', postsPerWeek: 'Постов в неделю', generate: 'Создать план на 30 дней', generating: 'Планирование...', emptyTitle: 'План на 30 дней', emptyDesc: 'Введите вашу нишу', strategy: 'Стратегия', day: 'День' },
  de: { title: 'Content-Planer', niche: 'Nische', nichePlaceholder: 'z.B: Fitness, Persönliche Entwicklung...', postsPerWeek: 'Posts pro Woche', generate: '30-Tage-Plan erstellen', generating: 'Wird geplant...', emptyTitle: '30-Tage-Plan', emptyDesc: 'Nische eingeben', strategy: 'Strategie', day: 'Tag' },
  fr: { title: 'Planificateur de contenu', niche: 'Niche', nichePlaceholder: 'ex: Fitness, Développement personnel...', postsPerWeek: 'Posts par semaine', generate: 'Créer un plan sur 30 jours', generating: 'Planification...', emptyTitle: 'Plan sur 30 jours', emptyDesc: 'Entrez votre niche', strategy: 'Stratégie', day: 'Jour' }
}

export default function ContentPlannerPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [platforms, setPlatforms] = useState('Instagram, TikTok')
  const [postsPerWeek, setPostsPerWeek] = useState('5')
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

  const handleGenerate = async () => {
    if (!niche.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/content-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ niche, platforms, postsPerWeek, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">📅 {t.title}</h1>
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
                <label className="block text-sm text-gray-400 mb-2">{t.postsPerWeek}</label>
                <div className="grid grid-cols-4 gap-2">
                  {['3', '5', '7', '14'].map((n) => (
                    <button key={n} onClick={() => setPostsPerWeek(n)} className={`p-3 rounded-xl border text-sm ${postsPerWeek === n ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <button onClick={fillExample} className="w-full py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition mb-2">🧪 Try Example</button>

              <button onClick={handleGenerate} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `📅 ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">📅</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
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
                {result.strategy && (
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">🎯 {t.strategy}</h4>
                    <p className="text-sm text-gray-300">{language === 'tr' ? 'Sıklık' : 'Frequency'}: {result.strategy.posting_frequency}</p>
                    {result.strategy.content_pillars && <p className="text-sm text-gray-400 mt-1">{t.day === 'Gün' ? 'Konular' : 'Topics'}: {result.strategy.content_pillars.join(', ')}</p>}
                  </div>
                )}
                {result.calendar?.slice(0, 14).map((day: any, i: number) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-400">{t.day} {day.day}</span>
                      <span className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded">{day.format}</span>
                    </div>
                    <h4 className="font-medium mb-1">{day.topic}</h4>
                    {day.hook && <p className="text-sm text-gray-400">🎯 {day.hook}</p>}
                    {day.best_time && <p className="text-xs text-gray-500 mt-2">⏰ {day.best_time}</p>}
                  </div>
                ))}
                {result.calendar?.length > 14 && <p className="text-center text-gray-500 text-sm">+ {result.calendar.length - 14} {t.day} more...</p>}
                {result.raw && !result.calendar && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
