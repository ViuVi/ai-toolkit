'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function HashtagResearchPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [niche, setNiche] = useState('')
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }
      setUser(session.user)
    }
    getUser()
  }, [])

  const handleResearch = async () => {
    if (!topic.trim()) {
      setError('Konu gerekli')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platform,
          niche,
          userId: user?.id
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Bir hata oluştu')
      }

      setResult(data.research)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyHashtags = (hashtags: any[]) => {
    const text = hashtags.map(h => h.tag || h).join(' ')
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
            ← Geri
          </Link>
          <h1 className="text-xl font-bold text-white">#️⃣ Hashtag Research</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
            3 kredi
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="md:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Hashtag Araştır</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Konu</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="örn: fitness, kahve, startup..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Niş (opsiyonel)</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="örn: kadın girişimci..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleResearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Araştırılıyor...' : '#️⃣ Araştır'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="md:col-span-2">
            {result ? (
              <div className="space-y-6">
                {/* Strategy */}
                {result.hashtag_strategy && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">📋 Strateji</h3>
                    <p className="text-gray-300">{result.hashtag_strategy}</p>
                  </div>
                )}

                {/* Hashtag Sets */}
                {result.hashtag_sets && Object.entries(result.hashtag_sets).map(([category, data]: [string, any]) => (
                  <div key={category} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white capitalize">
                          {category === 'high_volume' ? '🔥 Yüksek Hacim' :
                           category === 'medium_volume' ? '📊 Orta Hacim' :
                           category === 'niche' ? '🎯 Niş' :
                           category === 'trending' ? '📈 Trend' :
                           category === 'branded' ? '🏷️ Marka' : category}
                        </h3>
                        {data.description && (
                          <p className="text-gray-400 text-sm">{data.description}</p>
                        )}
                      </div>
                      {data.hashtags && (
                        <button
                          onClick={() => copyHashtags(data.hashtags)}
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          📋 Kopyala
                        </button>
                      )}
                    </div>

                    {data.hashtags && (
                      <div className="space-y-2">
                        {data.hashtags.map((h: any, i: number) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                            <span className="text-white font-medium">{h.tag || h}</span>
                            <div className="flex items-center gap-4 text-sm">
                              {h.estimated_posts && (
                                <span className="text-gray-400">{h.estimated_posts}</span>
                              )}
                              {h.competition && (
                                <span className={`px-2 py-1 rounded ${
                                  h.competition === 'Düşük' ? 'bg-green-500/20 text-green-400' :
                                  h.competition === 'Orta' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {h.competition}
                                </span>
                              )}
                              {h.trend && (
                                <span className="text-purple-400">{h.trend}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {data.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data.suggestions.map((s: string, i: number) => (
                          <span key={i} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Recommended Combinations */}
                {result.recommended_combinations && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🎯 Önerilen Kombinasyonlar</h3>
                    <div className="space-y-4">
                      {result.recommended_combinations.map((combo: any, i: number) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{combo.name}</span>
                            <button
                              onClick={() => copyHashtags(combo.hashtags)}
                              className="text-purple-400 text-sm"
                            >
                              📋 Kopyala
                            </button>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{combo.strategy}</p>
                          <div className="flex flex-wrap gap-2">
                            {combo.hashtags.map((h: string, j: number) => (
                              <span key={j} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Avoid */}
                {result.avoid_hashtags && result.avoid_hashtags.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">⚠️ Kaçınılması Gerekenler</h3>
                    <div className="space-y-2">
                      {result.avoid_hashtags.map((h: any, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-red-400">{h.tag}</span>
                          <span className="text-gray-400 text-sm">{h.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pro Tips */}
                {result.pro_tips && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">💡 Pro İpuçları</h3>
                    <ul className="space-y-2">
                      {result.pro_tips.map((tip: string, i: number) => (
                        <li key={i} className="text-gray-300 flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">#️⃣</div>
                <h3 className="text-xl font-semibold text-white mb-2">Hashtag Araştırması</h3>
                <p className="text-gray-400">
                  Konunu gir, en etkili hashtag stratejini öğren. Hacim, rekabet ve trend analizi al.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
