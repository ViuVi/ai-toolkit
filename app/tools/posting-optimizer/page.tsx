'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Akıllı Paylaşım Saatleri', niche: 'Niş', nichePlaceholder: 'örn: Moda, Fitness...', targetAudience: 'Hedef Kitle (opsiyonel)', audiencePlaceholder: 'örn: 18-25 yaş kadınlar...', platforms: 'Platformlar', generate: 'En İyi Zamanları Bul', generating: 'Analiz Ediliyor...', emptyTitle: 'Posting Optimizer', emptyDesc: 'Nişinize göre en iyi paylaşım saatlerini bulun', bestTimes: 'En İyi Zamanlar', weeklySchedule: 'Haftalık Program', proTips: 'Pro İpuçları' },
  en: { title: 'Smart Posting Times', niche: 'Niche', nichePlaceholder: 'e.g: Fashion, Fitness...', targetAudience: 'Target Audience (optional)', audiencePlaceholder: 'e.g: Women 18-25...', platforms: 'Platforms', generate: 'Find Best Times', generating: 'Analyzing...', emptyTitle: 'Posting Optimizer', emptyDesc: 'Find the best posting times for your niche', bestTimes: 'Best Times', weeklySchedule: 'Weekly Schedule', proTips: 'Pro Tips' },
  ru: { title: 'Оптимизация времени публикаций', niche: 'Ниша', nichePlaceholder: 'напр: Мода, Фитнес...', targetAudience: 'Целевая аудитория (необязательно)', audiencePlaceholder: 'напр: Женщины 18-25...', platforms: 'Платформы', generate: 'Найти лучшее время', generating: 'Анализируем...', emptyTitle: 'Оптимизатор публикаций', emptyDesc: 'Найдите лучшее время публикации для вашей ниши', bestTimes: 'Лучшее время', weeklySchedule: 'Недельное расписание', proTips: 'Советы' },
  de: { title: 'Smarte Posting-Zeiten', niche: 'Nische', nichePlaceholder: 'z.B: Mode, Fitness...', targetAudience: 'Zielgruppe (optional)', audiencePlaceholder: 'z.B: Frauen 18-25...', platforms: 'Plattformen', generate: 'Beste Zeiten finden', generating: 'Wird analysiert...', emptyTitle: 'Posting-Optimierer', emptyDesc: 'Finden Sie die besten Posting-Zeiten', bestTimes: 'Beste Zeiten', weeklySchedule: 'Wochenplan', proTips: 'Pro-Tipps' },
  fr: { title: 'Heures de publication intelligentes', niche: 'Niche', nichePlaceholder: 'ex: Mode, Fitness...', targetAudience: 'Public cible (optionnel)', audiencePlaceholder: 'ex: Femmes 18-25 ans...', platforms: 'Plateformes', generate: 'Trouver les meilleurs moments', generating: 'Analyse...', emptyTitle: 'Optimiseur de publication', emptyDesc: 'Trouvez les meilleurs moments pour publier', bestTimes: 'Meilleurs moments', weeklySchedule: 'Programme hebdomadaire', proTips: 'Conseils pro' }
}

export default function PostingOptimizerPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [platforms, setPlatforms] = useState(['instagram', 'tiktok'])
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ niche, targetAudience, platforms: platforms.join(','), language })
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
            <h1 className="font-bold">⏰ {t.title}</h1>
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
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder || "e.g: Fashion, Fitness..."} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.targetAudience}</label>
                <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder={t.audiencePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platforms}</label>
                <div className="grid grid-cols-2 gap-2">
                  {['instagram', 'tiktok', 'youtube', 'twitter'].map((p) => (
                    <button key={p} onClick={() => togglePlatform(p)} className={`p-2 rounded-xl border text-sm capitalize ${platforms.includes(p) ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleAnalyze} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `⏰ ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">⏰</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
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
                {/* Optimal Times */}
                {(result.optimal_times || result.best_times) && (
                  <div className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                    <h3 className="font-semibold text-purple-400 mb-4">{`🏆 ${t.bestTimes}`}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {(result.optimal_times || result.best_times).map((t: any, i: number) => (
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
                {(result.by_platform || result.platform_breakdown) && Object.entries((result.by_platform || result.platform_breakdown)).map(([platform, data]: [string, any]) => (
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
                    <h4 className="font-semibold text-green-400 mb-3">{`📅 ${t.weeklySchedule}`}</h4>
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
                    <h4 className="font-semibold text-orange-400 mb-3">{`💡 ${t.proTips}`}</h4>
                    <div className="space-y-1">
                      {result.pro_tips.map((tip: string, i: number) => (
                        <p key={i} className="text-sm text-gray-300">• {tip}</p>
                      ))}
                    </div>
                  </div>
                )}

                {result.raw && !(result.optimal_times || result.best_times) && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
