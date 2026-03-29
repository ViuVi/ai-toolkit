'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Video Fikir Üretici', niche: 'Niş / Alan', nichePlaceholder: 'örn: Fitness, Yazılım, Yemek...', platform: 'Platform', count: 'Fikir Sayısı', generate: 'Video Fikirleri Üret', generating: 'Fikirler Üretiliyor...', emptyTitle: 'Video Fikir Üretici', emptyDesc: 'Nişinizi girin, bu hafta çekilecek video fikirlerini alın', viralPotential: 'Viral Potansiyel', bestTime: 'En İyi Zaman', seasonal: 'Sezonsal Bonus', weeklyPlan: 'Haftalık Plan', whyNow: 'Neden Şimdi' },
  en: { title: 'Video Idea Generator', niche: 'Niche / Area', nichePlaceholder: 'e.g: Fitness, Software, Food...', platform: 'Platform', count: 'Idea Count', generate: 'Generate Video Ideas', generating: 'Generating Ideas...', emptyTitle: 'Video Idea Generator', emptyDesc: 'Enter your niche to get shoot-ready video ideas', viralPotential: 'Viral Potential', bestTime: 'Best Time', seasonal: 'Seasonal Bonus', weeklyPlan: 'Weekly Plan', whyNow: 'Why Now' },
  ru: { title: 'Генератор видео-идей', niche: 'Ниша', nichePlaceholder: 'напр: Фитнес, IT, Еда...', platform: 'Платформа', count: 'Кол-во идей', generate: 'Создать идеи', generating: 'Генерация...', emptyTitle: 'Генератор видео-идей', emptyDesc: 'Введите нишу', viralPotential: 'Вирусный потенциал', bestTime: 'Лучшее время', seasonal: 'Сезонный бонус', weeklyPlan: 'Недельный план', whyNow: 'Почему сейчас' },
  de: { title: 'Video-Ideen-Generator', niche: 'Nische', nichePlaceholder: 'z.B: Fitness, Software...', platform: 'Plattform', count: 'Anzahl Ideen', generate: 'Video-Ideen generieren', generating: 'Wird generiert...', emptyTitle: 'Video-Ideen-Generator', emptyDesc: 'Nische eingeben', viralPotential: 'Viral-Potenzial', bestTime: 'Beste Zeit', seasonal: 'Saisonaler Bonus', weeklyPlan: 'Wochenplan', whyNow: 'Warum jetzt' },
  fr: { title: "Générateur d'idées vidéo", niche: 'Niche', nichePlaceholder: 'ex: Fitness, Tech...', platform: 'Plateforme', count: "Nombre d'idées", generate: 'Générer des idées', generating: 'Génération...', emptyTitle: "Générateur d'idées vidéo", emptyDesc: 'Entrez votre niche', viralPotential: 'Potentiel viral', bestTime: 'Meilleur moment', seasonal: 'Bonus saisonnier', weeklyPlan: 'Plan hebdomadaire', whyNow: 'Pourquoi maintenant' }
}

export default function VideoIdeasPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [count, setCount] = useState('10')
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
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/video-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ niche, platform, count, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch { setError('Connection error') }
    setLoading(false)
  }

  const getViralColor = (score: number) => score >= 8 ? 'text-green-400 bg-green-500/20' : score >= 6 ? 'text-yellow-400 bg-yellow-500/20' : 'text-orange-400 bg-orange-500/20'

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">💡 {t.title}</h1>
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
                <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platform}</label>
                <div className="grid grid-cols-2 gap-2">
                  {['tiktok', 'instagram', 'youtube', 'twitter'].map(p => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-2 rounded-xl border text-sm capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.count}</label>
                <div className="grid grid-cols-3 gap-2">
                  {['5', '10', '15'].map(n => (
                    <button key={n} onClick={() => setCount(n)} className={`p-2 rounded-xl border text-sm ${count === n ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerate} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `💡 ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">💡</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
                        {loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                </div>
                <p className="text-gray-400">{{t.generating}}</p>
                <div className="flex justify-center gap-1.5 mt-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                {/* Seasonal Bonus */}
                {result.seasonal_bonus && (
                  <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2"><span className="text-lg">🎄</span><span className="font-semibold text-orange-400">{t.seasonal}</span></div>
                    <p className="text-sm text-white mb-1">{result.seasonal_bonus.idea}</p>
                    <div className="flex gap-2 text-xs"><span className="text-orange-400">📅 {result.seasonal_bonus.event}</span><span className="text-red-400">⚡ {result.seasonal_bonus.urgency}</span></div>
                  </div>
                )}
                {/* Weekly Plan */}
                {result.weekly_plan && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-3">📅 {t.weeklyPlan}</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(result.weekly_plan).map(([day, idea]: [string, any]) => (
                        <div key={day} className="p-2 bg-white/5 rounded-lg text-center">
                          <p className="text-xs text-gray-400 capitalize">{day}</p>
                          <p className="text-xs text-white mt-1">{idea}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Ideas */}
                {result.ideas?.map((idea: any, i: number) => (
                  <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-purple-500/20 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                        <div>
                          <h4 className="font-medium text-white">{idea.title}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{idea.format}</span>
                            <span className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-xs">{idea.duration}</span>
                          </div>
                        </div>
                      </div>
                      {idea.viral_potential && <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getViralColor(idea.viral_potential)}`}>{idea.viral_potential}/10</span>}
                    </div>
                    {idea.hook && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-2"><span className="text-xs text-red-400 font-semibold">🎯 HOOK:</span><p className="text-sm text-gray-200 mt-1">{idea.hook}</p></div>}
                    {idea.script_outline && <p className="text-sm text-gray-400 mb-2">📝 {idea.script_outline}</p>}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {idea.best_time && <span>⏰ {idea.best_time}</span>}
                      {idea.why_now && <span className="text-purple-400">💡 {idea.why_now}</span>}
                    </div>
                    {idea.hashtags && <div className="flex flex-wrap gap-1 mt-2">{idea.hashtags.map((tag: string, j: number) => <span key={j} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs">{tag}</span>)}</div>}
                  </div>
                ))}
                {result.raw && !result.ideas && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
