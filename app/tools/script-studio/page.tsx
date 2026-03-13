'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ScriptStudioPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('youtube')
  const [duration, setDuration] = useState('short')
  const [style, setStyle] = useState('educational')
  
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
    }
    getUser()
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Konu gerekli'); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/script-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, duration, style, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setResult(data.script)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Geri</Link>
          <h1 className="text-xl font-bold text-white">🎬 Script Studio</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">6 kredi</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Video Script Oluştur</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Konu</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                  placeholder="Video konusunu yaz..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Platform</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Reels</option>
                    <option value="shorts">Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Süre</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                    <option value="short">Kısa (15-60sn)</option>
                    <option value="medium">Orta (1-3dk)</option>
                    <option value="long">Uzun (5-10dk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Stil</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="educational">Eğitici</option>
                  <option value="entertaining">Eğlenceli</option>
                  <option value="storytelling">Hikaye</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="vlog">Vlog</option>
                </select>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

              <button onClick={handleGenerate} disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Script Yazılıyor...' : '🎬 Script Oluştur'}
              </button>
            </div>
          </div>

          <div>
            {result ? (
              <div className="space-y-4">
                {/* Title Options */}
                {result.title_options && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">📝 Başlık Önerileri</h3>
                    <div className="space-y-2">
                      {result.title_options.map((title: string, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                          <span className="text-white">{title}</span>
                          <button onClick={() => copyToClipboard(title)} className="text-purple-400 text-xs">Kopyala</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thumbnail Ideas */}
                {result.thumbnail_ideas && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🖼️ Thumbnail Fikirleri</h3>
                    <ul className="space-y-2">
                      {result.thumbnail_ideas.map((idea: string, i: number) => (
                        <li key={i} className="text-gray-300 flex items-start gap-2">
                          <span className="text-purple-400">•</span> {idea}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Script */}
                {result.script && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">📜 Script</h3>
                      <button onClick={() => copyToClipboard(result.script.full_script || JSON.stringify(result.script))} 
                        className="text-purple-400 text-sm">📋 Tümünü Kopyala</button>
                    </div>

                    {result.script.hook && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                        <div className="text-yellow-400 text-sm mb-1">🎣 Hook (İlk 3 saniye)</div>
                        <p className="text-white">{result.script.hook}</p>
                      </div>
                    )}

                    {result.script.sections && result.script.sections.map((section: any, i: number) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 mb-2">
                        <div className="text-purple-400 text-sm mb-1">{section.title || `Bölüm ${i + 1}`}</div>
                        <p className="text-gray-300 text-sm">{section.content}</p>
                        {section.duration && <div className="text-gray-500 text-xs mt-1">⏱️ {section.duration}</div>}
                      </div>
                    ))}

                    {result.script.cta && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mt-4">
                        <div className="text-green-400 text-sm mb-1">📢 CTA</div>
                        <p className="text-white">{result.script.cta}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* B-Roll Suggestions */}
                {result.broll_suggestions && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🎥 B-Roll Önerileri</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.broll_suggestions.map((suggestion: string, i: number) => (
                        <span key={i} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">{suggestion}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold text-white mb-2">Script Studio</h3>
                <p className="text-gray-400">Profesyonel video scriptleri, başlık önerileri ve thumbnail fikirleri al.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
