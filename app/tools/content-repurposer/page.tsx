'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function ContentRepurposerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [originalContent, setOriginalContent] = useState('')
  const [contentType, setContentType] = useState('blog')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('tiktok')
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

  const handleRepurpose = async () => {
    if (!originalContent.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/content-repurposer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalContent, contentType, language, userId: user.id })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Hata oluştu')
    } catch (e) { setError('Bağlantı hatası') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">♻️ Content Repurposer</h1>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Orijinal İçerik</label>
                <textarea value={originalContent} onChange={(e) => setOriginalContent(e.target.value)} placeholder="Blog yazısı, video scripti veya herhangi bir içeriği yapıştırın..." rows={8} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">İçerik Türü</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['blog', '📝 Blog'], ['video', '🎬 Video'], ['podcast', '🎙️ Podcast'], ['tweet', '🐦 Tweet']].map(([val, label]) => (
                    <button key={val} onClick={() => setContentType(val)} className={`p-3 rounded-xl border text-sm ${contentType === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleRepurpose} disabled={loading || !originalContent.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Dönüştürülüyor...</> : '♻️ 5 Platforma Dönüştür'}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">♻️</div><h3 className="text-xl font-medium mb-2">İçerik Dönüştürücü</h3><p className="text-gray-500">Bir içeriği 5 farklı platforma dönüştürün</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl overflow-x-auto">
                  {[['tiktok', '🎵 TikTok'], ['twitter', '🐦 Twitter'], ['linkedin', '💼 LinkedIn'], ['instagram', '📸 IG'], ['youtube', '🎬 YT']].map(([key, label]) => (
                    <button key={key} onClick={() => setActiveTab(key)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === key ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{label}</button>
                  ))}
                </div>

                {activeTab === 'tiktok' && result.tiktok_scripts?.map((s: any, i: number) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-medium text-purple-400 mb-2">Script {i + 1}</h4>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{s.script || s}</p>
                  </div>
                ))}

                {activeTab === 'twitter' && result.twitter_threads?.map((t: any, i: number) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-medium text-blue-400 mb-2">Thread {i + 1}</h4>
                    {(t.tweets || [t]).map((tw: any, j: number) => (
                      <p key={j} className="text-sm text-gray-300 mb-2 p-2 bg-white/5 rounded">{tw.text || tw}</p>
                    ))}
                  </div>
                ))}

                {activeTab === 'linkedin' && result.linkedin_posts?.map((p: any, i: number) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-medium text-blue-600 mb-2">Post {i + 1}</h4>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{p.post || p}</p>
                  </div>
                ))}

                {activeTab === 'instagram' && result.instagram_carousel && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-medium text-pink-400 mb-2">Carousel</h4>
                    {result.instagram_carousel.slides?.map((s: any, i: number) => (
                      <div key={i} className="p-2 bg-white/5 rounded mb-2">
                        <p className="text-sm font-medium">Slide {s.slide || i + 1}</p>
                        <p className="text-xs text-gray-400">{s.content || s.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'youtube' && result.youtube_short && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-medium text-red-400 mb-2">YouTube Short</h4>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{result.youtube_short.script || result.youtube_short}</p>
                  </div>
                )}

                {result.raw && !result.tiktok_scripts && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
