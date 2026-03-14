'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Thread Composer', icon: '🧵', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Twitter/X için viral thread\'ler oluşturur. Hook tweet, içerik tweetleri ve kapanış CTA\'sı içerir.', topicLabel: 'Thread Konusu', topicPlaceholder: 'örn: 10 girişimci dersi...', tweetCountLabel: 'Tweet Sayısı', btn: 'Thread Oluştur', loading: 'Oluşturuluyor...' },
  en: { title: 'Thread Composer', icon: '🧵', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Creates viral Twitter/X threads. Includes hook tweet, content tweets and closing CTA.', topicLabel: 'Thread Topic', topicPlaceholder: 'e.g., 10 entrepreneur lessons...', tweetCountLabel: 'Tweet Count', btn: 'Create Thread', loading: 'Creating...' },
  ru: { title: 'Thread Composer', icon: '🧵', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Создаёт вирусные треды.', topicLabel: 'Тема', topicPlaceholder: 'напр: 10 уроков...', tweetCountLabel: 'Количество', btn: 'Создать', loading: 'Создание...' },
  de: { title: 'Thread Composer', icon: '🧵', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Erstellt virale Threads.', topicLabel: 'Thema', topicPlaceholder: 'z.B. 10 Lektionen...', tweetCountLabel: 'Anzahl', btn: 'Erstellen', loading: 'Erstelle...' },
  fr: { title: 'Thread Composer', icon: '🧵', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Crée des threads viraux.', topicLabel: 'Sujet', topicPlaceholder: 'ex: 10 leçons...', tweetCountLabel: 'Nombre', btn: 'Créer', loading: 'Création...' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [tweetCount, setTweetCount] = useState('7')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [])

  const handleSubmit = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/thread-composer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tweetCount, userId: user?.id, language })
      })
      const data = await res.json()
      if (res.ok) setResult(data.result)
    } catch (e) {}
    setLoading(false)
  }

  const copyTweet = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">{t.back}</Link>
            <span className="text-2xl">{t.icon}</span>
            <h1 className="text-xl font-bold">{t.title}</h1>
            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">{t.credits}</span>
          </div>
          <div className="relative group">
            <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">🌐 {language.toUpperCase()}</button>
            <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${language === l ? 'text-purple-400' : 'text-gray-300'}`}>{l.toUpperCase()}</button>)}
            </div>
          </div>
        </div>
      </header>
      <div className="fixed top-16 left-0 right-0 z-40 bg-green-500/10 border-b border-green-500/30 py-2 text-center text-green-400 text-sm">{t.testMode}</div>
      <main className="pt-32 pb-12 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.tweetCountLabel}</label>
                <select value={tweetCount} onChange={e => setTweetCount(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="5">5 tweets</option>
                  <option value="7">7 tweets</option>
                  <option value="10">10 tweets</option>
                </select>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {result ? (
              <div className="space-y-3">
                {result.tweets?.map((tweet: string, i: number) => (
                  <div key={i} className={`rounded-xl p-4 ${i === 0 ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-gray-800/50 border border-gray-700'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-400">{i + 1}/{result.tweets.length}</span>
                      <button onClick={() => copyTweet(tweet)} className="text-xs text-purple-400 hover:text-purple-300">Copy</button>
                    </div>
                    <p className="text-white text-sm">{tweet}</p>
                    <span className="text-xs text-gray-500">{tweet.length}/280</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">{t.icon}</div>
                <p className="text-gray-500">{t.purpose}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
