'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function ScriptStudioPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [duration, setDuration] = useState('60')
  const [style, setStyle] = useState('educational')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('script')
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
      const res = await fetch('/api/script-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, duration, style, language })
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const platforms = [
    { value: 'tiktok', label: 'TikTok' },
    { value: 'reels', label: 'Reels' },
    { value: 'shorts', label: 'Shorts' },
    { value: 'youtube', label: 'YouTube' }
  ]

  const durations = [
    { value: '15', label: '15 sn' },
    { value: '30', label: '30 sn' },
    { value: '60', label: '60 sn' },
    { value: '180', label: '3 dk' }
  ]

  const styles = [
    { value: 'educational', label: '📚 Eğitici' },
    { value: 'entertaining', label: '🎭 Eğlenceli' },
    { value: 'storytelling', label: '📖 Hikaye' },
    { value: 'tutorial', label: '🎯 Tutorial' }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎬</span>
              <h1 className="font-bold text-lg">Script Studio</h1>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <span className="text-purple-400">✦ {credits}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Video Konusu</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="örn: Yapay zeka ile 5 dakikada logo tasarımı..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-4 gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPlatform(p.value)}
                      className={`p-2 rounded-xl border text-sm font-medium transition ${
                        platform === p.value
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Süre</label>
                <div className="grid grid-cols-4 gap-2">
                  {durations.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={`p-2 rounded-xl border text-sm font-medium transition ${
                        duration === d.value
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Stil</label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`p-2 rounded-xl border text-sm font-medium transition ${
                        style === s.value
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {s.label}
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
                    Script Yazılıyor...
                  </>
                ) : (
                  <>🎬 Script Oluştur</>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-xl font-medium mb-2">Video Script</h3>
                <p className="text-gray-500">Konunuzu girin, çekime hazır script oluşturalım</p>
              </div>
            )}

            {loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Viral script yazılıyor...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                      activeTab === 'script' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    📝 Script
                  </button>
                  <button
                    onClick={() => setActiveTab('scenes')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                      activeTab === 'scenes' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🎬 Sahneler
                  </button>
                  <button
                    onClick={() => setActiveTab('extras')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                      activeTab === 'extras' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    ✨ Extras
                  </button>
                </div>

                {/* Script Tab */}
                {activeTab === 'script' && result.script && (
                  <div className="space-y-4">
                    {/* Full Script */}
                    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-purple-400">📝 Tam Script</h3>
                        <button
                          onClick={() => copyToClipboard(result.script.full_script || '')}
                          className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition"
                        >
                          {copied ? '✓ Kopyalandı' : 'Kopyala'}
                        </button>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                          {result.script.full_script}
                        </p>
                      </div>
                    </div>

                    {/* Script Sections */}
                    {result.script.hook && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-red-400">🎯 HOOK ({result.script.hook.duration})</span>
                        </div>
                        <p className="text-gray-200">{result.script.hook.text}</p>
                        <p className="text-xs text-gray-500 mt-2">{result.script.hook.delivery}</p>
                      </div>
                    )}

                    {result.script.problem && (
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        <span className="text-sm font-semibold text-orange-400">⚠️ PROBLEM</span>
                        <p className="text-gray-200 mt-2">{result.script.problem.text}</p>
                      </div>
                    )}

                    {result.script.buildup && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <span className="text-sm font-semibold text-yellow-400">📈 BUILD-UP</span>
                        <p className="text-gray-200 mt-2">{result.script.buildup.text}</p>
                      </div>
                    )}

                    {result.script.solution && (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <span className="text-sm font-semibold text-green-400">✅ SOLUTION</span>
                        <p className="text-gray-200 mt-2">{result.script.solution.text}</p>
                      </div>
                    )}

                    {result.script.cta && (
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                        <span className="text-sm font-semibold text-purple-400">👉 CTA</span>
                        <p className="text-gray-200 mt-2">{result.script.cta.text}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Scenes Tab */}
                {activeTab === 'scenes' && result.scene_breakdown && (
                  <div className="space-y-3">
                    {result.scene_breakdown.map((scene: any, index: number) => (
                      <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">
                            {scene.scene}
                          </span>
                          <div>
                            <span className="font-semibold text-white">{scene.section}</span>
                            <span className="text-gray-500 text-sm ml-2">({scene.shot} - {scene.duration})</span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm ml-11">{scene.text}</p>
                        <p className="text-gray-500 text-xs ml-11 mt-1">{scene.action}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extras Tab */}
                {activeTab === 'extras' && (
                  <div className="space-y-4">
                    {/* Metadata */}
                    {result.metadata && (
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <h4 className="font-semibold text-purple-400 mb-3">📊 Video Bilgileri</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <span className="text-gray-500">Süre:</span>
                            <span className="text-white ml-2">{result.metadata.total_duration}</span>
                          </div>
                          <div className="p-2 bg-white/5 rounded-lg">
                            <span className="text-gray-500">Kelime:</span>
                            <span className="text-white ml-2">{result.metadata.word_count}</span>
                          </div>
                          <div className="p-2 bg-white/5 rounded-lg col-span-2">
                            <span className="text-gray-500">Stil:</span>
                            <span className="text-white ml-2">{result.metadata.speaking_style}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Title Options */}
                    {result.title_options && (
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <h4 className="font-semibold text-purple-400 mb-3">📌 Başlık Önerileri</h4>
                        <div className="space-y-2">
                          {result.title_options.map((title: string, i: number) => (
                            <div key={i} className="p-2 bg-white/5 rounded-lg text-sm text-gray-300">
                              {title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hashtags */}
                    {result.hashtags && (
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <h4 className="font-semibold text-purple-400 mb-3">#️⃣ Hashtag'ler</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.hashtags.map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Filming Tips */}
                    {result.filming_tips && (
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                        <h4 className="font-semibold text-purple-400 mb-3">💡 Çekim İpuçları</h4>
                        <ul className="space-y-2">
                          {result.filming_tips.map((tip: string, i: number) => (
                            <li key={i} className="text-sm text-gray-300 flex gap-2">
                              <span className="text-purple-400">•</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Raw fallback */}
                {result.raw && !result.script && (
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
