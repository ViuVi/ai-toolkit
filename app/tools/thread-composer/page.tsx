'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', topicLabel: 'Konu', topicPlaceholder: 'örn: 10 yılda öğrendiğim iş dersleri...', tweetCountLabel: 'Tweet Sayısı', toneLabel: 'Ton', btn: 'Thread Oluştur', loading: 'Oluşturuluyor...', copy: 'Kopyala', copied: '✓', copyAll: 'Tümünü Kopyala', thread: 'Thread', newThread: 'Yeni Thread' },
  en: { back: 'Dashboard', topicLabel: 'Topic', topicPlaceholder: 'e.g., 10 business lessons I learned in 10 years...', tweetCountLabel: 'Tweet Count', toneLabel: 'Tone', btn: 'Create Thread', loading: 'Creating...', copy: 'Copy', copied: '✓', copyAll: 'Copy All', thread: 'Thread', newThread: 'New Thread' },
  ru: { back: 'Панель', topicLabel: 'Тема', topicPlaceholder: 'напр: 10 уроков...', tweetCountLabel: 'Количество', toneLabel: 'Тон', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓', copyAll: 'Копировать всё', thread: 'Тред', newThread: 'Новый' },
  de: { back: 'Dashboard', topicLabel: 'Thema', topicPlaceholder: 'z.B. 10 Lektionen...', tweetCountLabel: 'Anzahl', toneLabel: 'Ton', btn: 'Erstellen', loading: 'Erstelle...', copy: 'Kopieren', copied: '✓', copyAll: 'Alle kopieren', thread: 'Thread', newThread: 'Neu' },
  fr: { back: 'Tableau', topicLabel: 'Sujet', topicPlaceholder: 'ex: 10 leçons...', tweetCountLabel: 'Nombre', toneLabel: 'Ton', btn: 'Créer', loading: 'Création...', copy: 'Copier', copied: '✓', copyAll: 'Tout copier', thread: 'Thread', newThread: 'Nouveau' }
}

export default function ThreadComposerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [tweetCount, setTweetCount] = useState('10')
  const [tone, setTone] = useState('professional')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else { setUser(user); supabase.from('credits').select('balance').eq('user_id', user.id).single().then(({ data }) => setCredits(data?.balance || 0)) }
    })
  }, [])

  const handleSubmit = async () => {
    if (!topic.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/thread-composer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, tweetCount, tone, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        if (credits >= 5) { await supabase.from('credits').update({ balance: credits - 5 }).eq('user_id', user.id); setCredits(prev => prev - 5) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500) }

  const copyAllTweets = () => {
    const allTweets = result.tweets?.map((tweet: any, i: number) => `${i + 1}/${result.tweets.length}\n${typeof tweet === 'string' ? tweet : tweet.text}`).join('\n\n---\n\n')
    copyText('all', allTweets)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">🧵</span><h1 className="font-semibold">Thread Composer</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400 text-sm">✦</span><span className="font-medium">{credits}</span></div>
            <div className="relative group">
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.tweetCountLabel}</label>
                  <select value={tweetCount} onChange={e => setTweetCount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="5">5 tweets</option>
                    <option value="7">7 tweets</option>
                    <option value="10">10 tweets</option>
                    <option value="15">15 tweets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.toneLabel}</label>
                  <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="professional">💼 Profesyonel</option>
                    <option value="casual">😊 Samimi</option>
                    <option value="educational">📚 Eğitici</option>
                    <option value="storytelling">📖 Hikaye</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !topic.trim() || credits < 5} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 5 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">🧵 {t.thread}</h2>
              <button onClick={copyAllTweets} className={`px-4 py-2 rounded-lg text-sm ${copiedKey === 'all' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'}`}>{copiedKey === 'all' ? t.copied : t.copyAll}</button>
            </div>

            <div className="space-y-3">
              {result.tweets?.map((tweet: any, i: number) => (
                <div key={i} className={`rounded-xl p-4 border ${i === 0 ? 'bg-blue-500/5 border-blue-500/20' : i === result.tweets.length - 1 ? 'bg-green-500/5 border-green-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">{i + 1}</span>
                      <span className="text-gray-500 text-xs">{i + 1}/{result.tweets.length}</span>
                    </div>
                    <button onClick={() => copyText(`tweet-${i}`, typeof tweet === 'string' ? tweet : tweet.text)} className="text-xs text-purple-400">{copiedKey === `tweet-${i}` ? t.copied : t.copy}</button>
                  </div>
                  <p className="text-white whitespace-pre-wrap">{typeof tweet === 'string' ? tweet : tweet.text}</p>
                  {tweet.char_count && <div className="text-right text-xs text-gray-500 mt-2">{tweet.char_count}/280</div>}
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newThread}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
