'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Thread Composer', icon: '🧵', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Twitter/X için viral thread\'ler oluşturur.', topicLabel: 'Thread Konusu', topicPlaceholder: 'örn: 10 girişimcilik dersi...', countLabel: 'Tweet Sayısı', toneLabel: 'Ton', btn: 'Thread Oluştur', loading: 'Yazılıyor...', copy: 'Kopyala', copied: '✓', copyAll: 'Tümünü Kopyala', download: '📥 İndir' },
  en: { title: 'Thread Composer', icon: '🧵', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Creates viral Twitter/X threads.', topicLabel: 'Thread Topic', topicPlaceholder: 'e.g., 10 entrepreneurship lessons...', countLabel: 'Tweet Count', toneLabel: 'Tone', btn: 'Create Thread', loading: 'Writing...', copy: 'Copy', copied: '✓', copyAll: 'Copy All', download: '📥 Download' },
  ru: { title: 'Thread Composer', icon: '🧵', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Создаёт вирусные треды.', topicLabel: 'Тема', topicPlaceholder: 'напр: 10 уроков...', countLabel: 'Количество', toneLabel: 'Тон', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓', copyAll: 'Копировать всё', download: '📥 Скачать' },
  de: { title: 'Thread Composer', icon: '🧵', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Erstellt virale Threads.', topicLabel: 'Thema', topicPlaceholder: 'z.B. 10 Lektionen...', countLabel: 'Anzahl', toneLabel: 'Ton', btn: 'Erstellen', loading: 'Erstelle...', copy: 'Kopieren', copied: '✓', copyAll: 'Alles kopieren', download: '📥 Herunterladen' },
  fr: { title: 'Thread Composer', icon: '🧵', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Crée des threads viraux.', topicLabel: 'Sujet', topicPlaceholder: 'ex: 10 leçons...', countLabel: 'Nombre', toneLabel: 'Ton', btn: 'Créer', loading: 'Création...', copy: 'Copier', copied: '✓', copyAll: 'Tout copier', download: '📥 Télécharger' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [tweetCount, setTweetCount] = useState('10')
  const [tone, setTone] = useState('informative')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!topic.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/thread-composer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, tweetCount, tone, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  // Tweet içeriğini al (object veya string olabilir)
  const getTweetContent = (tweet: any) => {
    if (typeof tweet === 'string') return tweet
    return tweet.content || tweet.text || tweet.tweet || JSON.stringify(tweet)
  }

  const getTweetType = (tweet: any) => {
    if (typeof tweet === 'object' && tweet.type) return tweet.type
    return null
  }

  const copyTweet = (index: number, tweet: any) => {
    navigator.clipboard.writeText(getTweetContent(tweet))
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }
  
  const copyAll = () => {
    if (!result?.tweets) return
    const fullThread = result.tweets.map((tw: any, i: number) => `${i + 1}/${result.tweets.length}\n\n${getTweetContent(tw)}`).join('\n\n---\n\n')
    navigator.clipboard.writeText(fullThread)
    setCopiedIndex(-1)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const downloadThread = () => {
    if (!result?.tweets) return
    let txt = `🧵 TWITTER THREAD\n${'═'.repeat(50)}\n\n`
    txt += `Konu: ${topic}\n`
    txt += `Ton: ${tone}\n\n`
    
    result.tweets.forEach((tw: any, i: number) => {
      const content = getTweetContent(tw)
      txt += `${'─'.repeat(50)}\n`
      txt += `Tweet ${i + 1}/${result.tweets.length}\n`
      txt += `${'─'.repeat(50)}\n`
      txt += `${content}\n`
      txt += `(${content.length}/280 karakter)\n\n`
    })
    
    if (result.hashtags) { txt += `\nHashtags: ${result.hashtags.join(' ')}` }
    
    txt += `\n\n${'═'.repeat(50)}\nMediaToolkit.site ile oluşturuldu\n`
    
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `thread-${topic.replace(/\s+/g, '-').slice(0, 20)}.txt`
    link.click()
  }

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
      
      <main className="pt-32 pb-12 px-4 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.countLabel}</label>
                  <select value={tweetCount} onChange={e => setTweetCount(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white">
                    <option value="5">5 tweet</option>
                    <option value="7">7 tweet</option>
                    <option value="10">10 tweet</option>
                    <option value="15">15 tweet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.toneLabel}</label>
                  <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white">
                    <option value="informative">Bilgilendirici</option>
                    <option value="storytelling">Hikaye</option>
                    <option value="motivational">Motivasyon</option>
                    <option value="controversial">Tartışmacı</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
            
            {/* Hook Alternatifleri */}
            {result?.hook_options && result.hook_options.length > 0 && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-purple-400 font-medium mb-3">🎣 Alternatif Hook'lar</h4>
                {result.hook_options.map((h: any, i: number) => (
                  <div key={i} className="bg-gray-900/50 rounded-lg p-3 mb-2 last:mb-0">
                    <span className="text-xs text-gray-500">{h.style || h.version}</span>
                    <p className="text-white text-sm mt-1">{h.tweet}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Full Thread (Kopyala) */}
            {result?.full_thread && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-blue-400 font-medium">📋 Tam Thread</h4>
                  <button onClick={() => { navigator.clipboard.writeText(result.full_thread); setCopiedIndex(-2); setTimeout(() => setCopiedIndex(null), 1500) }} className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded">{copiedIndex === -2 ? '✓' : 'Kopyala'}</button>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">{result.full_thread}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-3 max-h-[700px] overflow-y-auto">
            {result?.tweets && result.tweets.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-2 sticky top-0 bg-gray-900 py-2 z-10">
                  <span className="text-gray-400 text-sm">{result.tweets.length} tweet</span>
                  <div className="flex gap-2">
                    <button onClick={copyAll} className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg hover:bg-purple-500/30">{copiedIndex === -1 ? '✓ Kopyalandı' : t.copyAll}</button>
                    <button onClick={downloadThread} className="text-xs bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-500/30">{t.download}</button>
                  </div>
                </div>
                
                {result.tweets.map((tweet: any, i: number) => {
                  const content = getTweetContent(tweet)
                  const tweetType = getTweetType(tweet) || (typeof tweet === 'object' ? tweet.type : null)
                  const isHook = i === 0 || tweetType === 'hook'
                  const isCTA = i === result.tweets.length - 1 || tweetType === 'cta'
                  
                  return (
                    <div key={i} className={`rounded-xl p-4 border transition-all ${isHook ? 'bg-purple-500/10 border-purple-500/50' : isCTA ? 'bg-green-500/10 border-green-500/50' : 'bg-gray-800/50 border-gray-700'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isHook ? 'bg-purple-500 text-white' : isCTA ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>{typeof tweet === 'object' && tweet.number ? tweet.number : i + 1}</span>
                          {isHook && <span className="text-xs text-purple-400">🎣 Hook</span>}
                          {isCTA && <span className="text-xs text-green-400">🎯 CTA</span>}
                        </div>
                        <button onClick={() => copyTweet(i, tweet)} className={`text-xs px-2 py-1 rounded ${copiedIndex === i ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>{copiedIndex === i ? t.copied : t.copy}</button>
                      </div>
                      <p className="text-white text-sm leading-relaxed">{content}</p>
                      
                      {/* Tweet purpose */}
                      {typeof tweet === 'object' && tweet.purpose && (
                        <p className="text-gray-500 text-xs mt-2 italic">{tweet.purpose}</p>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs ${content.length > 260 ? 'text-orange-400' : 'text-gray-500'}`}>{content.length}/280</span>
                        {content.length > 280 && <span className="text-xs text-red-400">⚠️ Çok uzun!</span>}
                      </div>
                    </div>
                  )
                })}
                
                {/* Engagement Tips */}
                {result.engagement_boosters && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-4">
                    <h4 className="text-yellow-400 font-medium mb-2">💡 Engagement İpuçları</h4>
                    {result.engagement_boosters.best_time_to_post && <p className="text-gray-300 text-sm">⏰ {result.engagement_boosters.best_time_to_post}</p>}
                    {result.engagement_boosters.quote_tweet_bait && <p className="text-gray-300 text-sm mt-1">💬 QRT: {result.engagement_boosters.quote_tweet_bait}</p>}
                    {result.engagement_boosters.reply_to_self_tip && <p className="text-gray-300 text-sm mt-1">↩️ {result.engagement_boosters.reply_to_self_tip}</p>}
                  </div>
                )}
                
                {/* Hashtags */}
                {result.hashtags && result.hashtags.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-blue-400 font-medium mb-2">Hashtags</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.hashtags.map((h: string, i: number) => <span key={i} className="text-blue-300 text-sm">{h}</span>)}
                    </div>
                  </div>
                )}
              </>
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
