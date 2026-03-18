'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function HookGeneratorPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [tone, setTone] = useState('professional')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
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

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/hook-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, language })
      })
      const data = await res.json()
      
      if (res.ok && data.result) {
        setResult(data.result)
      } else {
        setError(data.error || 'Bir hata oluştu')
      }
    } catch (err) {
      setError('Bağlantı hatası')
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const platforms = [
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'youtube', label: 'YouTube', icon: '🎬' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' }
  ]

  const tones = [
    { value: 'professional', label: 'Profesyonel' },
    { value: 'casual', label: 'Samimi' },
    { value: 'humorous', label: 'Esprili' },
    { value: 'dramatic', label: 'Dramatik' }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎣</span>
              <h1 className="font-bold text-lg">Hook Generator Pro</h1>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <span className="text-purple-400">✦ {credits}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Panel - Sol */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Konu / Niş</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="örn: Yapay zeka, Fitness, Para kazanma..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPlatform(p.value)}
                      className={`p-3 rounded-xl border text-sm font-medium transition ${
                        platform === p.value
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Ton</label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`p-3 rounded-xl border text-sm font-medium transition ${
                        tone === t.value
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    20 Hook Üretiliyor...
                  </>
                ) : (
                  <>🎣 20 Viral Hook Üret</>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Panel - Sağ */}
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="text-5xl mb-4">🎣</div>
                <h3 className="text-xl font-medium mb-2">20 Viral Hook</h3>
                <p className="text-gray-500">Konunuzu girin, scroll-durduran hook'lar üretelim</p>
              </div>
            )}

            {loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">20 viral hook üretiliyor...</p>
              </div>
            )}

            {result && (
              <div className="space-y-3">
                {/* Best Hook */}
                {result.best_hook && (
                  <div className="p-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🏆</span>
                      <span className="font-semibold text-yellow-400">En İyi Hook</span>
                    </div>
                    <p className="text-lg font-medium mb-2">{result.best_hook.text}</p>
                    <p className="text-sm text-gray-400">{result.best_hook.reason}</p>
                  </div>
                )}

                {/* All Hooks */}
                {result.hooks && result.hooks.map((hook: any, index: number) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-purple-500/30 transition">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                          {index + 1}
                        </span>
                        <p className="font-medium">{hook.text}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(hook.text, index)}
                        className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition shrink-0"
                      >
                        {copiedIndex === index ? '✓' : 'Copy'}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-10">
                      {hook.pattern && (
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs">
                          {hook.pattern}
                        </span>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Virality: <span className="text-orange-400 font-semibold">{hook.virality_score}/10</span></span>
                        <span>Curiosity: <span className="text-blue-400 font-semibold">{hook.curiosity_score}/10</span></span>
                      </div>
                    </div>

                    {hook.why_it_works && (
                      <p className="mt-2 ml-10 text-xs text-gray-500">{hook.why_it_works}</p>
                    )}
                  </div>
                ))}

                {/* Topic Insight */}
                {result.topic_insight && (
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span>💡</span>
                      <span className="font-medium text-purple-400">Konu Analizi</span>
                    </div>
                    <p className="text-sm text-gray-300">{result.topic_insight}</p>
                  </div>
                )}

                {/* Raw fallback */}
                {result.raw && (!result.hooks || result.hooks.length === 0) && (
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
