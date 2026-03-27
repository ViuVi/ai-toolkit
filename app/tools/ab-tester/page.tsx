'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function ABTesterPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [contentType, setContentType] = useState('hook')
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

  const handleTest = async () => {
    if (!optionA.trim() || !optionB.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ab-tester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionA, optionB, contentType, platform, language, userId: user.id })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Hata oluştu')
    } catch (e) { setError('Bağlantı hatası') }
    setLoading(false)
  }

  const getScoreColor = (score: number) => score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">⚔️ A/B Tester</h1>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">🅰️ Seçenek A</label>
                <textarea value={optionA} onChange={(e) => setOptionA(e.target.value)} placeholder="İlk hook veya caption..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">🅱️ Seçenek B</label>
                <textarea value={optionB} onChange={(e) => setOptionB(e.target.value)} placeholder="İkinci hook veya caption..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">İçerik Türü</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['hook', '🎯 Hook'], ['caption', '✍️ Caption'], ['title', '📌 Başlık'], ['cta', '👉 CTA']].map(([val, label]) => (
                    <button key={val} onClick={() => setContentType(val)} className={`p-2 rounded-xl border text-sm ${contentType === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleTest} disabled={loading || !optionA.trim() || !optionB.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Test Ediliyor...</> : '⚔️ Hangisi Daha İyi?'}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">⚔️</div><h3 className="text-xl font-medium mb-2">A/B Test</h3><p className="text-gray-500">İki seçeneği karşılaştırın</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {/* Winner */}
                {result.winner && (
                  <div className="p-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl text-center">
                    <span className="text-3xl">🏆</span>
                    <h3 className="text-xl font-bold text-yellow-400 mt-2">Kazanan: {result.winner}</h3>
                    {result.winner_reason && <p className="text-sm text-gray-400 mt-2">{result.winner_reason}</p>}
                  </div>
                )}

                {/* Option A */}
                {result.option_a && (
                  <div className={`p-4 rounded-xl border ${result.winner === 'A' ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">🅰️ Seçenek A</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(result.option_a.total_score || 0)}`}>{result.option_a.total_score}/100</span>
                    </div>
                    {result.option_a.scores && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {Object.entries(result.option_a.scores).map(([key, val]: [string, any]) => (
                          <div key={key} className="p-2 bg-white/5 rounded text-center">
                            <p className="text-xs text-gray-400 capitalize">{key.replace('_', ' ')}</p>
                            <p className="font-bold text-sm">{val}/10</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {result.option_a.strengths && <p className="text-xs text-green-400">✅ {result.option_a.strengths.join(', ')}</p>}
                    {result.option_a.weaknesses && <p className="text-xs text-red-400 mt-1">⚠️ {result.option_a.weaknesses.join(', ')}</p>}
                  </div>
                )}

                {/* Option B */}
                {result.option_b && (
                  <div className={`p-4 rounded-xl border ${result.winner === 'B' ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">🅱️ Seçenek B</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(result.option_b.total_score || 0)}`}>{result.option_b.total_score}/100</span>
                    </div>
                    {result.option_b.scores && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {Object.entries(result.option_b.scores).map(([key, val]: [string, any]) => (
                          <div key={key} className="p-2 bg-white/5 rounded text-center">
                            <p className="text-xs text-gray-400 capitalize">{key.replace('_', ' ')}</p>
                            <p className="font-bold text-sm">{val}/10</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {result.option_b.strengths && <p className="text-xs text-green-400">✅ {result.option_b.strengths.join(', ')}</p>}
                    {result.option_b.weaknesses && <p className="text-xs text-red-400 mt-1">⚠️ {result.option_b.weaknesses.join(', ')}</p>}
                  </div>
                )}

                {/* Hybrid */}
                {result.hybrid_suggestion && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">💡 Hibrit Öneri</h4>
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
