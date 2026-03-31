'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Rakip Analizi', competitorInfo: 'Rakip Hakkında Bilgi', competitorPlaceholder: 'Rakibin kullanıcı adı veya içerik stratejisi hakkında bilgi...', yourNiche: 'Sizin Nişiniz', nichePlaceholder: 'örn: Fitness, Teknoloji...', platform: 'Platform', generate: 'Rakibi Analiz Et', generating: 'Analiz Ediliyor...', emptyTitle: 'Rakip Analizi', emptyDesc: 'Rakibiniz hakkında bilgi girin', rightThings: 'Doğru Yaptıkları', doItBetter: 'Siz Daha İyi Yapabilirsiniz', actionPlan: 'Aksiyon Planı' },
  en: { title: 'Competitor Spy', competitorInfo: 'Competitor Info', competitorPlaceholder: "Competitor's username or content strategy info...", yourNiche: 'Your Niche', nichePlaceholder: 'e.g: Fitness, Tech...', platform: 'Platform', generate: 'Analyze Competitor', generating: 'Analyzing...', emptyTitle: 'Competitor Analysis', emptyDesc: 'Enter info about your competitor', rightThings: 'What They Do Right', doItBetter: 'You Can Do Better', actionPlan: 'Action Plan' },
  ru: { title: 'Шпион за конкурентами', competitorInfo: 'Информация о конкуренте', competitorPlaceholder: 'Имя пользователя или стратегия контента конкурента...', yourNiche: 'Ваша ниша', nichePlaceholder: 'напр: Фитнес, Технологии...', platform: 'Платформа', generate: 'Анализировать конкурента', generating: 'Анализируем...', emptyTitle: 'Анализ конкурентов', emptyDesc: 'Введите информацию о конкуренте', rightThings: 'Что делают правильно', doItBetter: 'Вы можете лучше', actionPlan: 'План действий' },
  de: { title: 'Wettbewerber-Spion', competitorInfo: 'Wettbewerber-Info', competitorPlaceholder: 'Benutzername oder Content-Strategie des Wettbewerbers...', yourNiche: 'Ihre Nische', nichePlaceholder: 'z.B: Fitness, Technik...', platform: 'Plattform', generate: 'Wettbewerber analysieren', generating: 'Wird analysiert...', emptyTitle: 'Wettbewerbsanalyse', emptyDesc: 'Infos über Ihren Wettbewerber eingeben', rightThings: 'Was sie richtig machen', doItBetter: 'Sie können es besser', actionPlan: 'Aktionsplan' },
  fr: { title: 'Espion Concurrent', competitorInfo: 'Infos concurrent', competitorPlaceholder: "Nom d'utilisateur ou stratégie du concurrent...", yourNiche: 'Votre niche', nichePlaceholder: 'ex: Fitness, Tech...', platform: 'Plateforme', generate: 'Analyser le concurrent', generating: 'Analyse en cours...', emptyTitle: 'Analyse concurrentielle', emptyDesc: 'Entrez des infos sur votre concurrent', rightThings: "Ce qu'ils font bien", doItBetter: 'Vous pouvez mieux faire', actionPlan: "Plan d'action" }
}

export default function CompetitorSpyPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [competitorInfo, setCompetitorInfo] = useState('')
  const [yourNiche, setYourNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
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

  const handleAnalyze = async () => {
    if (!competitorInfo.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/competitor-spy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ competitorInfo, yourNiche, platform, language })
      })
      const data = await res.json()

    // Normalize safely
    try { API response
    if (data.result?.competitor_analysis) {
      const ca = data.result.competitor_analysis
      if (!data.result.what_they_do_right) {
        const tactics = ca.engagement_tactics || ca.top_performing_content || []
        data.result.what_they_do_right = tactics.map((t: any) => typeof t === 'string' ? { strength: t, learn_from: '' } : t)
      }
      if (!data.result.what_you_can_do_better) {
        const weaknesses = ca.weaknesses || []
        const opps = data.result.opportunities || []
        data.result.what_you_can_do_better = opps.length > 0
          ? opps.map((o: any) => ({ weakness: o.gap, your_opportunity: o.your_angle + (o.priority ? ' (' + o.priority + ')' : '') }))
          : weaknesses.map((w: any) => typeof w === 'string' ? { weakness: w, your_opportunity: '' } : w)
      }
    }
    if (data.result?.action_plan && Array.isArray(data.result.action_plan)) {
      data.result.action_plan = data.result.action_plan.map((item: any, i: number) => 
        typeof item === 'string' ? { priority: i + 1, action: item } : item
      )
    }
    if (data.result?.content_ideas && !data.result.action_plan) {
      data.result.action_plan = data.result.content_ideas.map((idea: any, i: number) => ({
        priority: i + 1, action: typeof idea === 'string' ? idea : (idea.idea + (idea.hook ? ' — Hook: ' + idea.hook : ''))
      }))
    }
      } catch {}
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }
  const fillExample = () => { setCompetitorInfo('@garyvee - Gary Vaynerchuk, business and entrepreneurship on TikTok') }


  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">🕵️ {t.title}</h1>
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
                <label className="block text-sm text-gray-400 mb-2">{t.competitorInfo}</label>
                <textarea value={competitorInfo} onChange={(e) => setCompetitorInfo(e.target.value)} placeholder={t.competitorPlaceholder} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.yourNiche}</label>
                <input type="text" value={yourNiche} onChange={(e) => setYourNiche(e.target.value)} placeholder={t.nichePlaceholder || "e.g: Fitness, Tech..."} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {['instagram', 'tiktok', 'youtube', 'twitter'].map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-3 rounded-xl border text-sm capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={fillExample} className="w-full py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition mb-2">🧪 Try Example</button>

              <button onClick={handleAnalyze} disabled={loading || !competitorInfo.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `🕵️ ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🕵️</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
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
                {(result.what_they_do_right || result.competitor_analysis?.engagement_tactics) && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <h4 className="font-semibold text-green-400 mb-3">{`✅ ${t.rightThings}`}</h4>
                    {(result.what_they_do_right || result.competitor_analysis?.engagement_tactics).map((item: any, i: number) => (
                      <div key={i} className="mb-2 p-2 bg-white/5 rounded-lg">
                        <p className="font-medium text-sm">{item.strength}</p>
                        <p className="text-xs text-gray-400">{item.learn_from}</p>
                      </div>
                    ))}
                  </div>
                )}
                {(result.what_you_can_do_better || result.opportunities) && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-3">{`🚀 ${t.doItBetter}`}</h4>
                    {(result.what_you_can_do_better || result.opportunities).map((item: any, i: number) => (
                      <div key={i} className="mb-2 p-2 bg-white/5 rounded-lg">
                        <p className="font-medium text-sm">{item.weakness}</p>
                        <p className="text-xs text-gray-400">{item.your_opportunity}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.action_plan && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <h4 className="font-semibold text-orange-400 mb-3">{`🎯 ${t.actionPlan}`}</h4>
                    {result.action_plan.map((item: any, i: number) => (
                      <div key={i} className="mb-2 flex gap-3 items-start">
                        <span className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded flex items-center justify-center text-sm shrink-0">{item.priority}</span>
                        <p className="text-sm">{item.action}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.raw && !(result.what_they_do_right || result.competitor_analysis?.engagement_tactics) && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
