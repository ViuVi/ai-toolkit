'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'A/B Test', optionA: 'Seçenek A', optionB: 'Seçenek B', optionAPlaceholder: 'İlk hook veya caption...', optionBPlaceholder: 'İkinci hook veya caption...', contentType: 'İçerik Türü', generate: 'Hangisi Daha İyi?', generating: 'Test Ediliyor...', winner: 'Kazanan', hybridTitle: 'Hibrit Öneri', emptyTitle: 'A/B Test', emptyDesc: 'İki seçeneği karşılaştırın', hook: 'Hook', caption: 'Caption', titleLabel: 'Başlık', cta: 'CTA' },
  en: { title: 'A/B Tester', optionA: 'Option A', optionB: 'Option B', optionAPlaceholder: 'First hook or caption...', optionBPlaceholder: 'Second hook or caption...', contentType: 'Content Type', generate: 'Which Is Better?', generating: 'Testing...', winner: 'Winner', hybridTitle: 'Hybrid Suggestion', emptyTitle: 'A/B Test', emptyDesc: 'Compare two options', hook: 'Hook', caption: 'Caption', titleLabel: 'Title', cta: 'CTA' },
  ru: { title: 'A/B Тест', optionA: 'Вариант A', optionB: 'Вариант B', optionAPlaceholder: 'Первый хук или подпись...', optionBPlaceholder: 'Второй хук или подпись...', contentType: 'Тип контента', generate: 'Что лучше?', generating: 'Тестирование...', winner: 'Победитель', hybridTitle: 'Гибридное предложение', emptyTitle: 'A/B Тест', emptyDesc: 'Сравните два варианта', hook: 'Хук', caption: 'Подпись', titleLabel: 'Заголовок', cta: 'CTA' },
  de: { title: 'A/B Test', optionA: 'Option A', optionB: 'Option B', optionAPlaceholder: 'Erster Hook oder Caption...', optionBPlaceholder: 'Zweiter Hook oder Caption...', contentType: 'Inhaltstyp', generate: 'Was ist besser?', generating: 'Wird getestet...', winner: 'Gewinner', hybridTitle: 'Hybrid-Vorschlag', emptyTitle: 'A/B Test', emptyDesc: 'Zwei Optionen vergleichen', hook: 'Hook', caption: 'Caption', titleLabel: 'Titel', cta: 'CTA' },
  fr: { title: 'Test A/B', optionA: 'Option A', optionB: 'Option B', optionAPlaceholder: 'Premier hook ou légende...', optionBPlaceholder: 'Deuxième hook ou légende...', contentType: 'Type de contenu', generate: 'Lequel est meilleur ?', generating: 'Test en cours...', winner: 'Gagnant', hybridTitle: 'Suggestion hybride', emptyTitle: 'Test A/B', emptyDesc: 'Comparez deux options', hook: 'Hook', caption: 'Légende', titleLabel: 'Titre', cta: 'CTA' }
}

export default function ABTesterPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [contentType, setContentType] = useState('hook')
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

  const handleTest = async () => {
    if (!optionA.trim() || !optionB.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ab-tester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ optionA, optionB, contentType, platform, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }

  const getScoreColor = (score: number) => score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">⚔️ {t.title}</h1>
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
                <label className="block text-sm text-gray-400 mb-2">🅰️ {t.optionA}</label>
                <textarea value={optionA} onChange={(e) => setOptionA(e.target.value)} placeholder={t.optionAPlaceholder} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">🅱️ {t.optionB}</label>
                <textarea value={optionB} onChange={(e) => setOptionB(e.target.value)} placeholder={t.optionBPlaceholder} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.contentType}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['hook', `🎯 ${t.hook}`], ['caption', `✍️ ${t.caption}`], ['title', `📌 ${t.titleLabel}`], ['cta', `👉 ${t.cta}`]].map(([val, label]) => (
                    <button key={val} onClick={() => setContentType(val)} className={`p-2 rounded-xl border text-sm ${contentType === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleTest} disabled={loading || !optionA.trim() || !optionB.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `⚔️ ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">⚔️</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
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
                {result.winner && (
                  <div className="p-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl text-center">
                    <span className="text-3xl">🏆</span>
                    <h3 className="text-xl font-bold text-yellow-400 mt-2">{t.winner}: {result.winner}</h3>
                    {result.winner_reason && <p className="text-sm text-gray-400 mt-2">{result.winner_reason}</p>}
                  </div>
                )}
                {result.option_a && (
                  <div className={`p-4 rounded-xl border ${result.winner === 'A' ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">🅰️ {t.optionA}</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(result.option_a.total_score || 0)}`}>{result.option_a.total_score}/100</span>
                    </div>
                    {result.option_a.scores && (<div className="grid grid-cols-3 gap-2 mb-3">{Object.entries(result.option_a.scores).map(([key, val]: [string, any]) => (<div key={key} className="p-2 bg-white/5 rounded text-center"><p className="text-xs text-gray-400 capitalize">{key.replace('_', ' ')}</p><p className="font-bold text-sm">{val}/10</p></div>))}</div>)}
                    {result.option_a.strengths && <p className="text-xs text-green-400">✅ {result.option_a.strengths.join(', ')}</p>}
                    {result.option_a.weaknesses && <p className="text-xs text-red-400 mt-1">⚠️ {result.option_a.weaknesses.join(', ')}</p>}
                  </div>
                )}
                {result.option_b && (
                  <div className={`p-4 rounded-xl border ${result.winner === 'B' ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">🅱️ {t.optionB}</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(result.option_b.total_score || 0)}`}>{result.option_b.total_score}/100</span>
                    </div>
                    {result.option_b.scores && (<div className="grid grid-cols-3 gap-2 mb-3">{Object.entries(result.option_b.scores).map(([key, val]: [string, any]) => (<div key={key} className="p-2 bg-white/5 rounded text-center"><p className="text-xs text-gray-400 capitalize">{key.replace('_', ' ')}</p><p className="font-bold text-sm">{val}/10</p></div>))}</div>)}
                    {result.option_b.strengths && <p className="text-xs text-green-400">✅ {result.option_b.strengths.join(', ')}</p>}
                    {result.option_b.weaknesses && <p className="text-xs text-red-400 mt-1">⚠️ {result.option_b.weaknesses.join(', ')}</p>}
                  </div>
                )}
                {result.hybrid_suggestion && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">💡 {t.hybridTitle}</h4>
                    <p className="text-sm text-gray-300">{result.hybrid_suggestion}</p>
                  </div>
                )}
                {result.raw && !result.winner && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
