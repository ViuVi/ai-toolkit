'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function CarouselPlannerPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [topic, setTopic] = useState('')
  const [slideCount, setSlideCount] = useState(10)
  const [style, setStyle] = useState('educational')
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
    }
    getUser()
  }, [])

  const handlePlan = async () => {
    if (!topic.trim()) { setError('Konu gerekli'); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/carousel-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, slideCount, style, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setResult(data.carousel)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Geri</Link>
          <h1 className="text-xl font-bold text-white">🎠 Carousel Planner</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">4 kredi</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Carousel İçeriği Planla</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Konu</label>
                  <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                    placeholder="Carousel konusunu yaz..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Slide Sayısı</label>
                    <select value={slideCount} onChange={(e) => setSlideCount(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      <option value={5}>5 slide</option>
                      <option value={7}>7 slide</option>
                      <option value={10}>10 slide</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Stil</label>
                    <select value={style} onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      <option value="educational">Eğitici</option>
                      <option value="storytelling">Hikaye</option>
                      <option value="tips">İpuçları</option>
                      <option value="comparison">Karşılaştırma</option>
                      <option value="stepbystep">Adım Adım</option>
                    </select>
                  </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

                <button onClick={handlePlan} disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                  {loading ? 'Carousel Planlanıyor...' : '🎠 Carousel Planla'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">{result.title || topic}</h2>
              {result.hook && <p className="text-purple-400 mt-2">🎣 {result.hook}</p>}
            </div>

            {/* Slides */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {result.slides && result.slides.map((slide: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 aspect-[4/5] flex flex-col">
                  <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-3">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm mb-2">{slide.headline}</div>
                    <div className="text-gray-400 text-xs">{slide.content}</div>
                  </div>
                  {slide.visual_suggestion && (
                    <div className="text-purple-400 text-xs mt-2">🖼️ {slide.visual_suggestion}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Caption */}
            {result.caption && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📝 Caption</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{result.caption}</p>
              </div>
            )}

            {/* Hashtags */}
            {result.hashtags && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🏷️ Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag: string, i: number) => (
                    <span key={i} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Design Tips */}
            {result.design_tips && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🎨 Tasarım İpuçları</h3>
                <ul className="space-y-2">
                  {result.design_tips.map((tip: string, i: number) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="text-purple-400 hover:text-purple-300">
                ← Yeni Carousel Planla
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
