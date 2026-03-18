'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function HashtagResearchPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
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

  const handleSearch = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, niche, platform, language })
      })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
      else setError(data.error || 'Hata oluştu')
    } catch (e) { setError('Bağlantı hatası') }
    setLoading(false)
  }

  const copyHashtags = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">#️⃣ Hashtag Research</h1>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Konu</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="örn: Fitness, Yemek tarifleri..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Niş (opsiyonel)</label>
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="örn: Ev egzersizleri..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {['instagram', 'tiktok', 'twitter', 'youtube'].map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-3 rounded-xl border text-sm capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleSearch} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Aranıyor...</> : '#️⃣ Hashtag Bul'}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">#️⃣</div><h3 className="text-xl font-medium mb-2">Hashtag'ler</h3><p className="text-gray-500">Konunuzu girin</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {result.recommended_set && (
                  <div className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-purple-400">📋 Önerilen Set</h3>
                      <button onClick={() => copyHashtags(result.recommended_set.copy_paste)} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">{copied ? '✓ Kopyalandı' : 'Tümünü Kopyala'}</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.recommended_set.hashtags?.map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {[
                  { key: 'trending_hashtags', title: '🔥 Trend', color: 'red' },
                  { key: 'high_volume_hashtags', title: '📈 Yüksek Hacim', color: 'orange' },
                  { key: 'medium_hashtags', title: '⚖️ Orta', color: 'yellow' },
                  { key: 'low_competition_hashtags', title: '💎 Düşük Rekabet', color: 'green' },
                ].map(({ key, title, color }) => result[key] && (
                  <div key={key} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className={`font-semibold text-${color}-400 mb-3`}>{title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {result[key].map((tag: any, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/5 text-gray-300 rounded text-sm">{tag.hashtag || tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {result.raw && !result.recommended_set && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
