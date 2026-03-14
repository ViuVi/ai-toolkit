'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Competitor Spy', icon: '🕵️', credits: '8 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Rakiplerinin içerik stratejilerini analiz eder. Güçlü/zayıf yönleri ve fırsatları ortaya çıkarır.', competitorLabel: 'Rakip Hesabı', competitorPlaceholder: '@rakiphesap veya URL', platformLabel: 'Platform', btn: 'Analiz Et', loading: 'Analiz ediliyor...' },
  en: { title: 'Competitor Spy', icon: '🕵️', credits: '8 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Analyzes competitor content strategies. Reveals strengths, weaknesses and opportunities.', competitorLabel: 'Competitor Account', competitorPlaceholder: '@competitor or URL', platformLabel: 'Platform', btn: 'Analyze', loading: 'Analyzing...' },
  ru: { title: 'Competitor Spy', icon: '🕵️', credits: '8', back: '← Назад', testMode: '🧪 Тест', purpose: 'Анализирует стратегии конкурентов.', competitorLabel: 'Конкурент', competitorPlaceholder: '@конкурент', platformLabel: 'Платформа', btn: 'Анализ', loading: 'Анализ...' },
  de: { title: 'Competitor Spy', icon: '🕵️', credits: '8', back: '← Zurück', testMode: '🧪 Test', purpose: 'Analysiert Konkurrenz-Strategien.', competitorLabel: 'Konkurrent', competitorPlaceholder: '@konkurrent', platformLabel: 'Plattform', btn: 'Analysieren', loading: 'Analyse...' },
  fr: { title: 'Competitor Spy', icon: '🕵️', credits: '8', back: '← Retour', testMode: '🧪 Test', purpose: 'Analyse les stratégies des concurrents.', competitorLabel: 'Concurrent', competitorPlaceholder: '@concurrent', platformLabel: 'Plateforme', btn: 'Analyser', loading: 'Analyse...' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [competitor, setCompetitor] = useState('')
  const [platform, setPlatform] = useState('instagram')
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
    try {
      const res = await fetch('/api/competitor-spy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitor, platform, userId: user?.id, language })
      })
      const data = await res.json()
      if (res.ok) setResult(data.result)
    } catch (e) {}
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
      <main className="pt-32 pb-12 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
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
                </select>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          <div>
            {result ? (
              <div className="space-y-4">
                {result.strengths && <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"><h4 className="text-green-400 font-medium mb-2">💪 Strengths</h4><ul className="text-sm text-gray-300 space-y-1">{result.strengths.map((s:string,i:number) => <li key={i}>• {s}</li>)}</ul></div>}
                {result.weaknesses && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"><h4 className="text-red-400 font-medium mb-2">⚠️ Weaknesses</h4><ul className="text-sm text-gray-300 space-y-1">{result.weaknesses.map((w:string,i:number) => <li key={i}>• {w}</li>)}</ul></div>}
                {result.opportunities && <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4"><h4 className="text-purple-400 font-medium mb-2">🎯 Opportunities</h4><ul className="text-sm text-gray-300 space-y-1">{result.opportunities.map((o:string,i:number) => <li key={i}>• {o}</li>)}</ul></div>}
                {result.strategy && <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"><h4 className="text-white font-medium mb-2">📊 Strategy</h4><p className="text-sm text-gray-300">{result.strategy}</p></div>}
              </div>
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
