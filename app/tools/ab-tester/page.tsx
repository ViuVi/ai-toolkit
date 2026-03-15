'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', versionALabel: 'Versiyon A', versionBLabel: 'Versiyon B', placeholder: 'Caption veya hook yazın...', platformLabel: 'Platform', btn: 'Karşılaştır', loading: 'Analiz ediliyor...', winner: 'Kazanan', analysis: 'Detaylı Analiz', recommendation: 'Öneri', newTest: 'Yeni Test' },
  en: { back: 'Dashboard', versionALabel: 'Version A', versionBLabel: 'Version B', placeholder: 'Enter caption or hook...', platformLabel: 'Platform', btn: 'Compare', loading: 'Analyzing...', winner: 'Winner', analysis: 'Detailed Analysis', recommendation: 'Recommendation', newTest: 'New Test' },
  ru: { back: 'Панель', versionALabel: 'Версия A', versionBLabel: 'Версия B', placeholder: 'Введите текст...', platformLabel: 'Платформа', btn: 'Сравнить', loading: 'Анализ...', winner: 'Победитель', analysis: 'Анализ', recommendation: 'Рекомендация', newTest: 'Новый' },
  de: { back: 'Dashboard', versionALabel: 'Version A', versionBLabel: 'Version B', placeholder: 'Text eingeben...', platformLabel: 'Plattform', btn: 'Vergleichen', loading: 'Analyse...', winner: 'Gewinner', analysis: 'Analyse', recommendation: 'Empfehlung', newTest: 'Neu' },
  fr: { back: 'Tableau', versionALabel: 'Version A', versionBLabel: 'Version B', placeholder: 'Entrez le texte...', platformLabel: 'Plateforme', btn: 'Comparer', loading: 'Analyse...', winner: 'Gagnant', analysis: 'Analyse', recommendation: 'Recommandation', newTest: 'Nouveau' }
}

export default function ABTesterPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [versionA, setVersionA] = useState('')
  const [versionB, setVersionB] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else { setUser(user); supabase.from('credits').select('balance').eq('user_id', user.id).single().then(({ data }) => setCredits(data?.balance || 0)) }
    })
  }, [])

  const handleSubmit = async () => {
    if (!versionA.trim() || !versionB.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ab-tester', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ versionA, versionB, platform, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        if (credits >= 5) { await supabase.from('credits').update({ balance: credits - 5 }).eq('user_id', user.id); setCredits(prev => prev - 5) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">⚖️</span><h1 className="font-semibold">A/B Tester</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400 text-sm">✦</span><span className="font-medium">{credits}</span></div>
            <div className="relative group">
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                <label className="block text-blue-400 font-semibold mb-3">{t.versionALabel}</label>
                <textarea value={versionA} onChange={e => setVersionA(e.target.value)} placeholder={t.placeholder} className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none transition" />
              </div>
              <div className="bg-pink-500/5 border border-pink-500/20 rounded-2xl p-5">
                <label className="block text-pink-400 font-semibold mb-3">{t.versionBLabel}</label>
                <textarea value={versionB} onChange={e => setVersionB(e.target.value)} placeholder={t.placeholder} className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 resize-none transition" />
              </div>
            </div>
            <div className="max-w-xs mx-auto">
              <label className="block text-sm text-gray-400 mb-2 text-center">{t.platformLabel}</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <button onClick={handleSubmit} disabled={loading || !versionA.trim() || !versionB.trim() || credits < 5} className="w-full max-w-md mx-auto block py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</span> : <>{t.btn} <span className="text-white/70">• 5 ✦</span></>}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Winner */}
            <div className={`p-6 rounded-2xl border-2 ${result.winner === 'A' ? 'bg-blue-500/10 border-blue-500' : 'bg-pink-500/10 border-pink-500'}`}>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-4xl">🏆</span>
                <h2 className="text-2xl font-bold">{t.winner}: {result.winner === 'A' ? t.versionALabel : t.versionBLabel}</h2>
              </div>
              {result.winner_reason && <p className="text-center text-gray-300">{result.winner_reason}</p>}
            </div>

            {/* Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`rounded-xl p-5 border ${result.winner === 'A' ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-blue-400">{t.versionALabel}</span>
                  <span className="text-2xl font-bold">{result.score_a || result.scores?.a}/100</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{versionA}</p>
                {result.analysis_a && <p className="text-gray-500 text-sm">{result.analysis_a}</p>}
              </div>
              <div className={`rounded-xl p-5 border ${result.winner === 'B' ? 'bg-pink-500/10 border-pink-500/50' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-pink-400">{t.versionBLabel}</span>
                  <span className="text-2xl font-bold">{result.score_b || result.scores?.b}/100</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{versionB}</p>
                {result.analysis_b && <p className="text-gray-500 text-sm">{result.analysis_b}</p>}
              </div>
            </div>

            {/* Recommendation */}
            {result.recommendation && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                <h3 className="text-green-400 font-semibold mb-2">💡 {t.recommendation}</h3>
                <p className="text-gray-300">{result.recommendation}</p>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => { setResult(null); setVersionA(''); setVersionB('') }} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newTest}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
