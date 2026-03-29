'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Thread Oluşturucu', topic: 'Thread Konusu', topicPlaceholder: 'örn: Sıfırdan 100K takipçiye nasıl ulaştım...', tweetCount: 'Tweet Sayısı', style: 'Stil', generate: 'Thread Oluştur', generating: 'Yazılıyor...', emptyTitle: 'Thread Composer', emptyDesc: 'Viral thread oluşturun', copyAll: 'Tümünü Kopyala', copied: 'Kopyalandı', hookAlts: "Alternatif Hook'lar", selfReplies: 'Self-Reply Önerileri', postingStrategy: 'Paylaşım Stratejisi', educational: 'Eğitici', storytelling: 'Hikaye', listicle: 'Liste', motivational: 'Motivasyon' },
  en: { title: 'Thread Composer', topic: 'Thread Topic', topicPlaceholder: 'e.g: How I went from 0 to 100K followers...', tweetCount: 'Tweet Count', style: 'Style', generate: 'Create Thread', generating: 'Writing...', emptyTitle: 'Thread Composer', emptyDesc: 'Create a viral thread', copyAll: 'Copy All', copied: 'Copied', hookAlts: 'Alternative Hooks', selfReplies: 'Self-Reply Suggestions', postingStrategy: 'Posting Strategy', educational: 'Educational', storytelling: 'Storytelling', listicle: 'Listicle', motivational: 'Motivational' },
  ru: { title: 'Создатель тредов', topic: 'Тема треда', topicPlaceholder: 'напр: Как я набрал 100K подписчиков с нуля...', tweetCount: 'Кол-во твитов', style: 'Стиль', generate: 'Создать тред', generating: 'Пишем...', emptyTitle: 'Создатель тредов', emptyDesc: 'Создайте вирусный тред', copyAll: 'Копировать всё', copied: 'Скопировано', hookAlts: 'Альтернативные хуки', selfReplies: 'Предложения для self-reply', postingStrategy: 'Стратегия публикации', educational: 'Обучающий', storytelling: 'Сторителлинг', listicle: 'Список', motivational: 'Мотивационный' },
  de: { title: 'Thread-Ersteller', topic: 'Thread-Thema', topicPlaceholder: 'z.B: Wie ich von 0 auf 100K Follower kam...', tweetCount: 'Tweet-Anzahl', style: 'Stil', generate: 'Thread erstellen', generating: 'Wird geschrieben...', emptyTitle: 'Thread-Ersteller', emptyDesc: 'Erstellen Sie einen viralen Thread', copyAll: 'Alle kopieren', copied: 'Kopiert', hookAlts: 'Alternative Hooks', selfReplies: 'Self-Reply-Vorschläge', postingStrategy: 'Posting-Strategie', educational: 'Lehrreich', storytelling: 'Storytelling', listicle: 'Liste', motivational: 'Motivational' },
  fr: { title: 'Compositeur de Threads', topic: 'Sujet du thread', topicPlaceholder: "ex: Comment j'ai atteint 100K abonnés...", tweetCount: 'Nombre de tweets', style: 'Style', generate: 'Créer le thread', generating: 'Écriture...', emptyTitle: 'Compositeur de Threads', emptyDesc: 'Créez un thread viral', copyAll: 'Tout copier', copied: 'Copié', hookAlts: 'Hooks alternatifs', selfReplies: 'Suggestions de self-reply', postingStrategy: 'Stratégie de publication', educational: 'Éducatif', storytelling: 'Storytelling', listicle: 'Liste', motivational: 'Motivationnel' }
}

export default function ThreadComposerPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [tweetCount, setTweetCount] = useState('7')
  const [style, setStyle] = useState('educational')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = toolTexts[language] || toolTexts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else {
        setUser(session.user)
        setSession(session)
        supabase.from('credits').select('balance').eq('user_id', session.user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [router])

  const handleCompose = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/thread-composer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ topic, tweetCount, style, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }

  const copyAll = () => {
    if (result?.full_thread) {
      navigator.clipboard.writeText((result.full_thread || result.tweets))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else if (result?.tweets) {
      const text = result.tweets.map((t: any) => t.text).join('\n\n---\n\n')
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">🧵 {t.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {(['en', 'tr', 'ru', 'de', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topic}</label>
                <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.tweetCount}</label>
                <div className="grid grid-cols-4 gap-2">
                  {['5', '7', '10', '15'].map((n) => (
                    <button key={n} onClick={() => setTweetCount(n)} className={`p-3 rounded-xl border text-sm ${tweetCount === n ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Stil</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['educational', `📚 ${t.educational}`], ['storytelling', `📖 ${t.storytelling}`], ['listicle', `📋 ${t.listicle}`], ['motivational', '🔥 Motivasyon']].map(([val, label]) => (
                    <button key={val} onClick={() => setStyle(val)} className={`p-2 rounded-xl border text-sm ${style === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleCompose} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `🧵 ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🧵</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
            {loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                </div>
                <p className="text-gray-400">{t.generating}</p>
                <div className="flex justify-center gap-1.5 mt-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-purple-400">{`🧵 ${t.title}`}</h3>
                  <button onClick={copyAll} className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium">{copied ? `✓ ${t.copied}` : t.copyAll}</button>
                </div>

                {/* Tweets */}
                {result.tweets?.map((tweet: any, i: number) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-sm font-bold">{tweet.number || i + 1}</span>
                      {tweet.type && <span className={`text-xs px-2 py-1 rounded ${tweet.type === 'hook' ? 'bg-red-500/20 text-red-400' : tweet.type === 'cta' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{tweet.type.toUpperCase()}</span>}
                      {tweet.char_count && <span className="text-xs text-gray-500">{tweet.char_count}/280</span>}
                    </div>
                    <p className="text-gray-200 whitespace-pre-wrap">{tweet.text}</p>
                    {tweet.purpose && <p className="text-xs text-gray-500 mt-2">{tweet.purpose}</p>}
                  </div>
                ))}

                {/* Hook Alternatives */}
                {result.hook_alternatives && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <h4 className="font-semibold text-orange-400 mb-3">{`🎯 ${t.hookAlts}`}</h4>
                    <div className="space-y-2">
                      {result.hook_alternatives.map((h: string, i: number) => (
                        <p key={i} className="text-sm text-gray-300 p-2 bg-white/5 rounded">{h}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Self Replies */}
                {result.self_replies && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <h4 className="font-semibold text-blue-400 mb-3">{`💬 ${t.selfReplies}`}</h4>
                    <div className="space-y-2">
                      {result.self_replies.map((r: string, i: number) => (
                        <p key={i} className="text-sm text-gray-300">• {r}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posting Strategy */}
                {result.posting_strategy && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">{`📅 ${t.postingStrategy}`}</h4>
                    <p className="text-sm text-gray-300">{result.posting_strategy}</p>
                  </div>
                )}

                {result.raw && !result.tweets && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
