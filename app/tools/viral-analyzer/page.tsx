'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Viral Analizör', content: 'İçerik / Script', contentPlaceholder: 'Analiz edilecek içeriği yapıştırın...', platform: 'Platform', generate: 'Viral Skorunu Hesapla', generating: 'Analiz Ediliyor...', emptyTitle: 'Viral Analiz', emptyDesc: 'İçeriğinizi yapıştırın ve viral potansiyelini öğrenin', viralScore: 'Viral Skor', strengths: 'Güçlü Yönler', weaknesses: 'Zayıf Yönler', suggestedHook: 'Önerilen Hook' },
  en: { title: 'Viral Analyzer', content: 'Content / Script', contentPlaceholder: 'Paste the content to analyze...', platform: 'Platform', generate: 'Calculate Viral Score', generating: 'Analyzing...', emptyTitle: 'Viral Analysis', emptyDesc: 'Paste your content and discover its viral potential', viralScore: 'Viral Score', strengths: 'Strengths', weaknesses: 'Weaknesses', suggestedHook: 'Suggested Hook' },
  ru: { title: 'Вирусный анализатор', content: 'Контент / Скрипт', contentPlaceholder: 'Вставьте контент для анализа...', platform: 'Платформа', generate: 'Рассчитать вирусный балл', generating: 'Анализируем...', emptyTitle: 'Вирусный анализ', emptyDesc: 'Вставьте контент и узнайте его вирусный потенциал', viralScore: 'Вирусный балл', strengths: 'Сильные стороны', weaknesses: 'Слабые стороны', suggestedHook: 'Предложенный хук' },
  de: { title: 'Viral-Analysator', content: 'Inhalt / Script', contentPlaceholder: 'Inhalt zum Analysieren einfügen...', platform: 'Plattform', generate: 'Viral-Score berechnen', generating: 'Wird analysiert...', emptyTitle: 'Viral-Analyse', emptyDesc: 'Inhalt einfügen und virales Potenzial entdecken', viralScore: 'Viral-Score', strengths: 'Stärken', weaknesses: 'Schwächen', suggestedHook: 'Vorgeschlagener Hook' },
  fr: { title: 'Analyseur viral', content: 'Contenu / Script', contentPlaceholder: 'Collez le contenu à analyser...', platform: 'Plateforme', generate: 'Calculer le score viral', generating: 'Analyse...', emptyTitle: 'Analyse virale', emptyDesc: 'Collez votre contenu et découvrez son potentiel viral', viralScore: 'Score viral', strengths: 'Points forts', weaknesses: 'Points faibles', suggestedHook: 'Hook suggéré' }
}

export default function ViralAnalyzerPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
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

  const handleAnalyze = async () => {
    if (!content.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/viral-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ content, platform, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">📊 {t.title}</h1>
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
                <label className="block text-sm text-gray-400 mb-2">{t.content}</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPlaceholder} rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {['tiktok', 'instagram', 'youtube', 'twitter'].map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-3 rounded-xl border text-sm capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleAnalyze} disabled={loading || !content.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `📊 ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">📊</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {/* Final Score */}
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                  <p className="text-gray-400 mb-2">{t.viralScore}</p>
                  <p className={`text-6xl font-bold ${getScoreColor(result.final_score || 0)}`}>{result.final_score || 0}<span className="text-2xl text-gray-500">/100</span></p>
                  {result.verdict && <p className="mt-3 text-lg">{result.verdict}</p>}
                </div>

                {/* Scores Breakdown */}
                {result.scores && (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(result.scores).map(([key, val]: [string, any]) => (
                      <div key={key} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <p className="text-gray-400 text-sm capitalize mb-1">{key.replace('_', ' ')}</p>
                        <p className={`text-2xl font-bold ${getScoreColor(val?.score || 0)}`}>{val?.score || 0}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  {result.strengths && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <h4 className="font-semibold text-green-400 mb-2">{`✅ ${t.strengths}`}</h4>
                      <ul className="space-y-1">{result.strengths.map((s: string, i: number) => <li key={i} className="text-sm text-gray-300">• {s}</li>)}</ul>
                    </div>
                  )}
                  {result.weaknesses && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <h4 className="font-semibold text-red-400 mb-2">{`⚠️ ${t.weaknesses}`}</h4>
                      <ul className="space-y-1">{result.weaknesses.map((w: string, i: number) => <li key={i} className="text-sm text-gray-300">• {w}</li>)}</ul>
                    </div>
                  )}
                </div>

                {/* Rewritten Hook */}
                {result.rewritten_hook && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">{`🎯 ${t.suggestedHook}`}</h4>
                    <p className="text-gray-200">{result.rewritten_hook}</p>
                  </div>
                )}

                {result.raw && !result.final_score && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
