'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { dashboard, toolNames } from '@/lib/translations'

const langs: { code: Language; flag: string }[] = [
  { code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }
]

const tools = [
  { id: 'videoScript', icon: '🎬', path: '/tools/video-script', credits: 4, category: 'video' },
  { id: 'textToSpeech', icon: '🔊', path: '/tools/text-to-speech', credits: 3, category: 'video', isNew: true },
  { id: 'subtitleGen', icon: '📝', path: '/tools/subtitle-generator', credits: 5, category: 'video' },
  { id: 'hookGen', icon: '🎣', path: '/tools/hook-generator', credits: 2, category: 'content' },
  { id: 'captionWriter', icon: '✍️', path: '/tools/caption-writer', credits: 2, category: 'content' },
  { id: 'platformAdapter', icon: '🔄', path: '/tools/platform-adapter', credits: 3, category: 'content' },
  { id: 'summarizer', icon: '📋', path: '/tools/summarize', credits: 2, category: 'content' },
  { id: 'competitorAnalysis', icon: '🔍', path: '/tools/competitor-analyzer', credits: 8, category: 'analysis' },
  { id: 'trendDetector', icon: '📊', path: '/tools/trend-detector', credits: 5, category: 'analysis' },
  { id: 'engagementPredictor', icon: '📈', path: '/tools/engagement-predictor', credits: 5, category: 'analysis' },
  { id: 'brandVoice', icon: '🎯', path: '/tools/brand-voice', credits: 2, category: 'analysis' },
  { id: 'sentiment', icon: '😊', path: '/tools/sentiment', credits: 3, category: 'analysis' },
  { id: 'hashtagGen', icon: '#️⃣', path: '/tools/hashtag-generator', credits: 0, category: 'optimization', isFree: true },
  { id: 'viralScore', icon: '🚀', path: '/tools/viral-score', credits: 4, category: 'optimization' },
  { id: 'bioGen', icon: '👤', path: '/tools/bio-generator', credits: 0, category: 'helper', isFree: true },
  { id: 'contentCalendar', icon: '📅', path: '/tools/content-calendar', credits: 5, category: 'helper' },
  { id: 'postScheduler', icon: '⏰', path: '/tools/post-scheduler', credits: 3, category: 'helper' },
  { id: 'qrCode', icon: '📱', path: '/tools/qr-code-generator', credits: 0, category: 'helper', isFree: true }
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [showAdModal, setShowAdModal] = useState(false)
  const [adWatching, setAdWatching] = useState(false)
  const [adProgress, setAdProgress] = useState(0)
  const [dailyAds, setDailyAds] = useState(0)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const d = dashboard[language]
  const names = toolNames[language]
  const MAX_ADS = 5

  useEffect(() => { checkUser(); checkAds() }, [])

  const checkAds = () => {
    try {
      const today = new Date().toDateString()
      const stored = localStorage.getItem('adDate')
      const count = localStorage.getItem('adCount')
      if (stored === today && count) setDailyAds(parseInt(count))
      else { localStorage.setItem('adDate', today); localStorage.setItem('adCount', '0') }
    } catch {}
  }

  const watchAd = async () => {
    if (dailyAds >= MAX_ADS) return
    setAdWatching(true); setAdProgress(0)
    const interval = setInterval(() => setAdProgress(p => p >= 100 ? 100 : p + 6.67), 1000)
    setTimeout(async () => {
      clearInterval(interval); setAdProgress(100)
      if (user && credits) {
        await supabase.from('credits').update({ balance: credits.balance + 5 }).eq('user_id', user.id)
        setCredits({ ...credits, balance: credits.balance + 5 })
      }
      const newCount = dailyAds + 1
      setDailyAds(newCount)
      try { localStorage.setItem('adCount', newCount.toString()) } catch {}
      setTimeout(() => { setAdWatching(false); setShowAdModal(false); setAdProgress(0) }, 500)
    }, 15000)
  }

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('credits').select('*').eq('user_id', user.id).single()
      if (!data) {
        const { data: newCredits } = await supabase.from('credits').insert({ user_id: user.id, balance: 50 }).select().single()
        setCredits(newCredits)
      } else setCredits(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const logout = async () => { await supabase.auth.signOut(); router.push('/') }

  const filtered = tools.filter(tool => {
    const name = names[tool.id as keyof typeof names] || ''
    const matchSearch = name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || tool.category === category
    return matchSearch && matchCat
  })

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">{d.loading}</div></div>

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"><span className="text-xl font-bold text-white">M</span></div>
              <span className="text-xl font-bold text-white hidden sm:block">Media Tool Kit</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">
                  {langs.find(l => l.code === language)?.flag} {language.toUpperCase()}
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.code.toUpperCase()}</button>))}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg"><span className="text-yellow-400">⚡</span><span className="text-white font-semibold">{credits?.balance || 0}</span><span className="text-gray-400 text-sm hidden sm:block">{d.credits}</span></div>
              {dailyAds < MAX_ADS && <button onClick={() => setShowAdModal(true)} className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2 rounded-lg text-sm font-medium hidden sm:flex items-center gap-1">{d.watchAd}</button>}
              <button onClick={logout} className="text-gray-400 hover:text-white text-sm">{d.logout}</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">{d.welcome}, {user?.email?.split('@')[0]}! 👋</h1></div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1"><input type="text" placeholder={d.search} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          <div className="flex gap-2 overflow-x-auto pb-2">{Object.entries(d.categories).map(([k, v]) => (<button key={k} onClick={() => setCategory(k)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${category === k ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{v}</button>))}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tool) => (
            <Link key={tool.id} href={tool.path} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all hover:transform hover:scale-105 group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{tool.icon}</span>
                <div className="flex gap-2">
                  {tool.isFree && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">{d.free}</span>}
                  {tool.isNew && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">{d.new}</span>}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition">{names[tool.id as keyof typeof names]}</h3>
              <div className="flex items-center text-sm text-gray-500"><span className="text-yellow-400">⚡</span><span className="ml-1">{tool.credits} {d.credits}</span></div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-12"><p className="text-gray-400">{d.noTools}</p></div>}
      </main>

      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            {adWatching ? (
              <div className="text-center"><div className="text-6xl mb-4">📺</div><p className="text-white text-xl mb-4">{d.adModal.watching}</p><div className="w-full bg-gray-700 rounded-full h-3 mb-2"><div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all" style={{ width: `${adProgress}%` }}></div></div><p className="text-gray-400">{Math.round(adProgress)}%</p></div>
            ) : (
              <div className="text-center"><div className="text-6xl mb-4">🎬</div><h3 className="text-2xl font-bold text-white mb-2">{d.adModal.title}</h3><p className="text-gray-400 mb-2">{d.adModal.subtitle}</p><p className="text-sm text-gray-500 mb-6">{MAX_ADS - dailyAds} {d.adsLeft}</p><div className="flex gap-4"><button onClick={() => setShowAdModal(false)} className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition">{d.adModal.close}</button><button onClick={watchAd} disabled={dailyAds >= MAX_ADS} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50">{dailyAds >= MAX_ADS ? d.adModal.limit : d.adModal.earn}</button></div></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
