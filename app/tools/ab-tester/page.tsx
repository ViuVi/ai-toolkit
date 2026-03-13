'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ABTesterPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [content, setContent] = useState('')
  const [contentType, setContentType] = useState('caption')
  const [platform, setPlatform] = useState('instagram')
  const [goal, setGoal] = useState('engagement')
  
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
    }
    getUser()
  }, [])

  const handleGenerate = async () => {
    if (!content.trim()) { setError('İçerik gerekli'); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/ab-tester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, contentType, platform, goal, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setResult(data.variations)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Geri</Link>
          <h1 className="text-xl font-bold text-white">⚖️ A/B Test Generator</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">5 kredi</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">5 Farklı Versiyon Oluştur</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">İçerik</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)}
                    placeholder="Test etmek istediğin içeriği yapıştır..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Tür</label>
                    <select value={contentType} onChange={(e) => setContentType(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      <option value="caption">Caption</option>
                      <option value="headline">Başlık</option>
                      <option value="hook">Hook</option>
                      <option value="cta">CTA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Platform</label>
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Hedef</label>
                    <select value={goal} onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      <option value="engagement">Etkileşim</option>
                      <option value="clicks">Tıklama</option>
                      <option value="saves">Kaydetme</option>
                      <option value="shares">Paylaşım</option>
                    </select>
                  </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

                <button onClick={handleGenerate} disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                  {loading ? 'Versiyonlar Oluşturuluyor...' : '⚖️ 5 Versiyon Oluştur'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">5 Farklı Versiyon</h2>
              <p className="text-gray-400">Her birini dene ve hangisinin daha iyi performans gösterdiğini ölç</p>
            </div>

            {result.versions && result.versions.map((version: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{i + 1}</span>
                    <span className="text-white font-medium">{version.style || `Versiyon ${i + 1}`}</span>
                  </div>
                  <button onClick={() => copyToClipboard(version.content)} className="text-purple-400 hover:text-purple-300 text-sm">
                    📋 Kopyala
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <p className="text-white whitespace-pre-wrap">{version.content}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {version.predicted_performance && (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      📊 {version.predicted_performance}
                    </span>
                  )}
                  {version.best_for && (
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                      🎯 {version.best_for}
                    </span>
                  )}
                  {version.tone && (
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      💬 {version.tone}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Testing Tips */}
            {result.testing_tips && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">💡 Test İpuçları</h3>
                <ul className="space-y-2">
                  {result.testing_tips.map((tip: string, i: number) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center">
              <button onClick={() => setResult(null)} className="text-purple-400 hover:text-purple-300">
                ← Yeni Test Oluştur
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
