'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Competitor Spy', icon: '🕵️', credits: '8 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Rakiplerinin içerik stratejilerini analiz eder. Güçlü/zayıf yönleri ve fırsatları ortaya çıkarır.', competitorLabel: 'Rakip Hesabı', competitorPlaceholder: '@rakiphesap veya marka adı', platformLabel: 'Platform', nicheLabel: 'Senin Nişin', nichePlaceholder: 'örn: fitness, teknoloji...', btn: 'Analiz Et', loading: 'Analiz ediliyor...' },
  en: { title: 'Competitor Spy', icon: '🕵️', credits: '8 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Analyzes competitor content strategies. Reveals strengths, weaknesses and opportunities.', competitorLabel: 'Competitor Account', competitorPlaceholder: '@competitor or brand name', platformLabel: 'Platform', nicheLabel: 'Your Niche', nichePlaceholder: 'e.g., fitness, tech...', btn: 'Analyze', loading: 'Analyzing...' },
  ru: { title: 'Competitor Spy', icon: '🕵️', credits: '8', back: '← Назад', testMode: '🧪 Тест', purpose: 'Анализирует стратегии конкурентов.', competitorLabel: 'Конкурент', competitorPlaceholder: '@конкурент', platformLabel: 'Платформа', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', btn: 'Анализ', loading: 'Анализ...' },
  de: { title: 'Competitor Spy', icon: '🕵️', credits: '8', back: '← Zurück', testMode: '🧪 Test', purpose: 'Analysiert Konkurrenz-Strategien.', competitorLabel: 'Konkurrent', competitorPlaceholder: '@konkurrent', platformLabel: 'Plattform', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', btn: 'Analysieren', loading: 'Analyse...' },
  fr: { title: 'Competitor Spy', icon: '🕵️', credits: '8', back: '← Retour', testMode: '🧪 Test', purpose: 'Analyse les stratégies des concurrents.', competitorLabel: 'Concurrent', competitorPlaceholder: '@concurrent', platformLabel: 'Plateforme', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', btn: 'Analyser', loading: 'Analyse...' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [competitor, setCompetitor] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [yourNiche, setYourNiche] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [])

  const handleSubmit = async () => {
    if (!competitor.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/competitor-spy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitor, platform, yourNiche, language })
      })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">{t.back}</Link>
            <span className="text-2xl">{t.icon}</span>
            <h1 className="text-xl font-bold">{t.title}</h1>
            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">{t.credits}</span>
          </div>
          <div className="relative group">
            <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">🌐 {language.toUpperCase()}</button>
            <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${language === l ? 'text-purple-400' : 'text-gray-300'}`}>{l.toUpperCase()}</button>)}
            </div>
          </div>
        </div>
      </header>
      <div className="fixed top-16 left-0 right-0 z-40 bg-green-500/10 border-b border-green-500/30 py-2 text-center text-green-400 text-sm">{t.testMode}</div>
      
      <main className="pt-32 pb-12 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.competitorLabel}</label>
                <input type="text" value={competitor} onChange={e => setCompetitor(e.target.value)} placeholder={t.competitorPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                <input type="text" value={yourNiche} onChange={e => setYourNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result ? (
              <>
                {/* Genel Bakış */}
                {result.competitor_overview && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <h3 className="text-purple-400 font-semibold mb-2">📊 Rakip Profili</h3>
                    <p className="text-white">{result.competitor_overview.name}</p>
                    <p className="text-gray-400 text-sm">{result.competitor_overview.brand_positioning}</p>
                  </div>
                )}
                
                {/* SWOT Analizi */}
                {result.swot && (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Strengths */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <h4 className="text-green-400 font-semibold mb-2">💪 Güçlü Yönler</h4>
                      <ul className="space-y-2">
                        {result.swot.strengths?.map((s: any, i: number) => (
                          <li key={i} className="text-sm">
                            <span className="text-white">{s.point || s}</span>
                            {s.learn_from && <p className="text-green-400/70 text-xs mt-1">💡 {s.learn_from}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Weaknesses */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <h4 className="text-red-400 font-semibold mb-2">⚠️ Zayıf Yönler</h4>
                      <ul className="space-y-2">
                        {result.swot.weaknesses?.map((w: any, i: number) => (
                          <li key={i} className="text-sm">
                            <span className="text-white">{w.point || w}</span>
                            {w.your_opportunity && <p className="text-yellow-400/70 text-xs mt-1">🎯 {w.your_opportunity}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Opportunities */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <h4 className="text-yellow-400 font-semibold mb-2">🎯 Fırsatlar</h4>
                      <ul className="space-y-2">
                        {result.swot.opportunities?.map((o: any, i: number) => (
                          <li key={i} className="text-sm">
                            <span className="text-white">{o.point || o}</span>
                            {o.action_item && <p className="text-green-400/70 text-xs mt-1">✅ {o.action_item}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Threats */}
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                      <h4 className="text-orange-400 font-semibold mb-2">⚡ Tehditler</h4>
                      <ul className="space-y-2">
                        {result.swot.threats?.map((t: any, i: number) => (
                          <li key={i} className="text-sm">
                            <span className="text-white">{t.point || t}</span>
                            {t.mitigation && <p className="text-blue-400/70 text-xs mt-1">🛡 {t.mitigation}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Strateji Önerileri */}
                {result.strategy_recommendations && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-blue-400 font-semibold mb-3">📈 Strateji Önerileri</h4>
                    {result.strategy_recommendations.differentiation && (
                      <div className="mb-3">
                        <span className="text-purple-400 text-xs">Farklılaşma:</span>
                        <p className="text-gray-300 text-sm">{result.strategy_recommendations.differentiation}</p>
                      </div>
                    )}
                    {result.strategy_recommendations.quick_wins && (
                      <div>
                        <span className="text-green-400 text-xs">Hızlı Kazanımlar:</span>
                        <ul className="mt-1">
                          {result.strategy_recommendations.quick_wins.map((qw: string, i: number) => (
                            <li key={i} className="text-gray-300 text-sm">• {qw}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Aksiyon Planı */}
                {result.action_plan && result.action_plan.length > 0 && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3">📋 Aksiyon Planı</h4>
                    {result.action_plan.map((action: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                        <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">{action.priority || i+1}</span>
                        <div>
                          <p className="text-white text-sm">{action.action}</p>
                          <p className="text-gray-500 text-xs">{action.timeline} • {action.expected_impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">{t.icon}</div>
                <p className="text-gray-500">{t.purpose}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
