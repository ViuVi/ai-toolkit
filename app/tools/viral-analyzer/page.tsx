'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function ViralAnalyzerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else {
        setUser(session.user)
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform, language, userId: user.id })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Hata oluştu')
    } catch (e) { setError('Bağlantı hatası') }
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
            <h1 className="font-bold">📊 Viral Analyzer</h1>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">İçerik / Script</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Analiz edilecek içeriği yapıştırın..." rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
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
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Analiz Ediliyor...</> : '📊 Viral Skorunu Hesapla'}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">📊</div><h3 className="text-xl font-medium mb-2">Viral Analiz</h3><p className="text-gray-500">İçeriğinizi yapıştırın ve viral potansiyelini öğrenin</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {/* Final Score */}
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                  <p className="text-gray-400 mb-2">Viral Skor</p>
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
                      <h4 className="font-semibold text-green-400 mb-2">✅ Güçlü Yönler</h4>
                      <ul className="space-y-1">{result.strengths.map((s: string, i: number) => <li key={i} className="text-sm text-gray-300">• {s}</li>)}</ul>
                    </div>
                  )}
                  {result.weaknesses && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <h4 className="font-semibold text-red-400 mb-2">⚠️ Zayıf Yönler</h4>
                      <ul className="space-y-1">{result.weaknesses.map((w: string, i: number) => <li key={i} className="text-sm text-gray-300">• {w}</li>)}</ul>
                    </div>
                  )}
                </div>

                {/* Rewritten Hook */}
                {result.rewritten_hook && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">🎯 Önerilen Hook</h4>
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
