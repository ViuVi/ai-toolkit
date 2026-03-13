'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function ThreadComposerPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [topic, setTopic] = useState('')
  const [threadType, setThreadType] = useState('educational')
  const [tweetCount, setTweetCount] = useState(7)
  
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

  const handleCompose = async () => {
    if (!topic.trim()) { setError('Konu gerekli'); return }
    setLoading(true); setError(''); setResult(null)

    try {
      const res = await fetch('/api/thread-composer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, threadType, tweetCount, userId: user?.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setResult(data.thread)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)
  const copyAll = () => {
    if (result?.tweets) {
      const all = result.tweets.map((t: any, i: number) => `${i + 1}/ ${t.content}`).join('\n\n')
      copyToClipboard(all)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Geri</Link>
          <h1 className="text-xl font-bold text-white">🧵 Thread Composer</h1>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">5 kredi</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Viral Thread Oluştur</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Konu</label>
                  <textarea value={topic} onChange={(e) => setTopic(e.target.value)}
                    placeholder="Thread konusunu yaz..."
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Thread Tipi</label>
                    <select value={threadType} onChange={(e) => setThreadType(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      <option value="educational">Eğitici</option>
                      <option value="storytelling">Hikaye</option>
                      <option value="listicle">Liste</option>
                      <option value="controversial">Tartışmalı</option>
                      <option value="howto">Nasıl Yapılır</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Tweet Sayısı</label>
                    <select value={tweetCount} onChange={(e) => setTweetCount(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      <option value={5}>5 tweet</option>
                      <option value={7}>7 tweet</option>
                      <option value={10}>10 tweet</option>
                      <option value={15}>15 tweet</option>
                    </select>
                  </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

                <button onClick={handleCompose} disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                  {loading ? 'Thread Yazılıyor...' : '🧵 Thread Oluştur'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">🧵 Thread: {result.title || topic}</h2>
              <button onClick={copyAll} className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-xl text-sm hover:bg-purple-500/30">
                📋 Tümünü Kopyala
              </button>
            </div>

            {/* Thread Preview */}
            <div className="space-y-3">
              {result.tweets && result.tweets.map((tweet: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white whitespace-pre-wrap">{tweet.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-2">
                          {tweet.emoji && <span className="text-xl">{tweet.emoji}</span>}
                          {tweet.type && (
                            <span className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs">{tweet.type}</span>
                          )}
                        </div>
                        <button onClick={() => copyToClipboard(tweet.content)} className="text-purple-400 text-sm hover:text-purple-300">
                          Kopyala
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Engagement Tips */}
            {result.engagement_tips && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">💡 Etkileşim İpuçları</h3>
                <ul className="space-y-2">
                  {result.engagement_tips.map((tip: string, i: number) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Best Time */}
            {result.best_posting_time && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <span className="text-green-400">⏰ En İyi Paylaşım Zamanı: {result.best_posting_time}</span>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="text-purple-400 hover:text-purple-300">
                ← Yeni Thread Oluştur
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
