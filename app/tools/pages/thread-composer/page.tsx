'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 4
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Thread Yazıcı', topic: 'Konu', topicPlaceholder: 'örn: Yapay zeka geleceği...', tweetCount: 'Tweet Sayısı', style: 'Stil', generate: 'Thread Oluştur', generating: 'Yazılıyor...', copy: 'Kopyala', copyAll: 'Tümünü Kopyala', emptyTitle: 'Viral Thread', emptyDesc: 'Konunuzu girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', educational: 'Eğitici', storytelling: 'Hikaye', controversial: 'Tartışmalı', howTo: 'Nasıl Yapılır', hookTweet: 'Hook Tweet', closingTweet: 'Kapanış', tips: 'İpuçları', bestTime: 'En İyi Zaman' },
  en: { title: 'Thread Composer', topic: 'Topic', topicPlaceholder: 'e.g: The future of AI...', tweetCount: 'Tweet Count', style: 'Style', generate: 'Create Thread', generating: 'Writing...', copy: 'Copy', copyAll: 'Copy All', emptyTitle: 'Viral Thread', emptyDesc: 'Enter your topic', insufficientCredits: 'Insufficient credits', error: 'Error', educational: 'Educational', storytelling: 'Storytelling', controversial: 'Controversial', howTo: 'How-To', hookTweet: 'Hook Tweet', closingTweet: 'Closing', tips: 'Tips', bestTime: 'Best Posting Time' },
  ru: { title: 'Создатель Тредов', topic: 'Тема', topicPlaceholder: 'напр: Будущее ИИ...', tweetCount: 'Количество Твитов', style: 'Стиль', generate: 'Создать Тред', generating: 'Пишем...', copy: 'Копировать', copyAll: 'Копировать всё', emptyTitle: 'Вирусный Тред', emptyDesc: 'Введите тему', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', educational: 'Обучающий', storytelling: 'История', controversial: 'Спорный', howTo: 'Как сделать', hookTweet: 'Хук Твит', closingTweet: 'Завершение', tips: 'Советы', bestTime: 'Лучшее Время' },
  de: { title: 'Thread-Schreiber', topic: 'Thema', topicPlaceholder: 'z.B: Die Zukunft der KI...', tweetCount: 'Tweet-Anzahl', style: 'Stil', generate: 'Thread Erstellen', generating: 'Schreiben...', copy: 'Kopieren', copyAll: 'Alle kopieren', emptyTitle: 'Viraler Thread', emptyDesc: 'Thema eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', educational: 'Lehrreich', storytelling: 'Geschichte', controversial: 'Kontrovers', howTo: 'Anleitung', hookTweet: 'Hook Tweet', closingTweet: 'Abschluss', tips: 'Tipps', bestTime: 'Beste Zeit' },
  fr: { title: 'Compositeur de Thread', topic: 'Sujet', topicPlaceholder: 'ex: L\'avenir de l\'IA...', tweetCount: 'Nombre de Tweets', style: 'Style', generate: 'Créer Thread', generating: 'Écriture...', copy: 'Copier', copyAll: 'Tout copier', emptyTitle: 'Thread Viral', emptyDesc: 'Entrez votre sujet', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', educational: 'Éducatif', storytelling: 'Narration', controversial: 'Controversé', howTo: 'Tutoriel', hookTweet: 'Tweet Accroche', closingTweet: 'Conclusion', tips: 'Conseils', bestTime: 'Meilleur Moment' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function ThreadComposerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [tweetCount, setTweetCount] = useState('10')
  const [style, setStyle] = useState('educational')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!topic.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/thread-composer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, tweetCount, style, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const copyTweet = (text: string, index: number) => { navigator.clipboard.writeText(text); setCopiedIndex(index); setTimeout(() => setCopiedIndex(null), 2000) }
  const copyAllTweets = () => {
    if (!result?.thread?.tweets) return
    const allText = result.thread.tweets.map((tw: any, i: number) => `${i + 1}/${result.thread.tweets.length}\n${tw.content}`).join('\n\n')
    navigator.clipboard.writeText(allText); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000)
  }

  const styles = [{ value: 'educational', label: t.educational }, { value: 'storytelling', label: t.storytelling }, { value: 'controversial', label: t.controversial }, { value: 'howto', label: t.howTo }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">🧵</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.topic}</label><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.tweetCount}</label><div className="flex gap-2">{['5', '7', '10', '15'].map(c => (<button key={c} onClick={() => setTweetCount(c)} className={`px-4 py-2 rounded-xl border text-sm transition ${tweetCount === c ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{c}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.style}</label><div className="flex flex-wrap gap-2">{styles.map(st => (<button key={st.value} onClick={() => setStyle(st.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${style === st.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{st.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>🧵 {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🧵</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              <div className="flex justify-end"><button onClick={copyAllTweets} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white transition">{copiedAll ? '✓' : '📋'} {t.copyAll}</button></div>
              {result.thread?.hook_tweet && (<div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"><div className="text-xs text-yellow-400 mb-2">🎣 {t.hookTweet}</div><p className="font-medium">{result.thread.hook_tweet}</p></div>)}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto">{result.thread?.tweets?.map((tweet: any, i: number) => (<div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl group"><div className="flex justify-between items-start gap-3"><div className="flex items-start gap-3"><span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{tweet.number || i + 1}</span><p className="text-sm">{tweet.content}</p></div><button onClick={() => copyTweet(tweet.content, i)} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">{copiedIndex === i ? '✓' : t.copy}</button></div>{tweet.purpose && <span className="ml-9 mt-2 inline-block px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs">{tweet.purpose}</span>}</div>))}</div>
              {result.thread?.closing_tweet && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-xs text-green-400 mb-2">🎯 {t.closingTweet}</div><p className="font-medium">{result.thread.closing_tweet}</p></div>)}
              {result.engagement_tips && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-2">💡 {t.tips}</div><ul className="text-sm space-y-1">{result.engagement_tips.map((tip: string, i: number) => (<li key={i}>• {tip}</li>))}</ul></div>)}
              {result.best_posting_time && (<div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm"><span className="text-gray-500">⏰ {t.bestTime}:</span> <span className="text-purple-400">{result.best_posting_time}</span></div>)}
              {result.raw && !result.thread && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
