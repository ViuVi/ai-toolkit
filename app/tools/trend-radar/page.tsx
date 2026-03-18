'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', nicheLabel: 'Niş', nichePlaceholder: 'örn: fitness, teknoloji...', platformLabel: 'Platform', regionLabel: 'Bölge', btn: 'Trendleri Tara', loading: 'Taranıyor...', trending: 'Trend Konular', sounds: 'Popüler Sesler', hashtags: 'Yükselen Hashtag\'ler', opportunities: 'Fırsatlar', newScan: 'Yeni Tarama' },
  en: { back: 'Dashboard', nicheLabel: 'Niche', nichePlaceholder: 'e.g., fitness, tech...', platformLabel: 'Platform', regionLabel: 'Region', btn: 'Scan Trends', loading: 'Scanning...', trending: 'Trending Topics', sounds: 'Popular Sounds', hashtags: 'Rising Hashtags', opportunities: 'Opportunities', newScan: 'New Scan' },
  ru: { back: 'Панель', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', regionLabel: 'Регион', btn: 'Сканировать', loading: 'Сканирую...', trending: 'Тренды', sounds: 'Звуки', hashtags: 'Хештеги', opportunities: 'Возможности', newScan: 'Новый' },
  de: { back: 'Dashboard', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', regionLabel: 'Region', btn: 'Scannen', loading: 'Scanne...', trending: 'Trends', sounds: 'Sounds', hashtags: 'Hashtags', opportunities: 'Chancen', newScan: 'Neu' },
  fr: { back: 'Tableau', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', regionLabel: 'Région', btn: 'Scanner', loading: 'Scan...', trending: 'Tendances', sounds: 'Sons', hashtags: 'Hashtags', opportunities: 'Opportunités', newScan: 'Nouveau' }
}

export default function TrendRadarPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [region, setRegion] = useState('global')
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
    if (!niche.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/trend-radar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, region, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // if (credits >= X) { // await supabase.from("credits").update({ balance: credits - 4 }).eq('user_id', user.id); // setCredits(prev => prev - X) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">📡</span><h1 className="font-semibold">Trend Radar</h1></div>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.regionLabel}</label>
                  <select value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="global">🌍 Global</option>
                    <option value="us">🇺🇸 US</option>
                    <option value="tr">🇹🇷 Türkiye</option>
                    <option value="de">🇩🇪 Germany</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !niche.trim() || credits < 4} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 4 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Trending Topics */}
            {result.trending_topics?.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-red-400 font-semibold mb-4">🔥 {t.trending}</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.trending_topics.map((topic: any, i: number) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{topic.topic}</h4>
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">{topic.growth || 'Hot'}</span>
                      </div>
                      <p className="text-gray-500 text-sm">{topic.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags & Sounds */}
            <div className="grid md:grid-cols-2 gap-4">
              {result.trending_hashtags?.length > 0 && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                  <h3 className="text-blue-400 font-semibold mb-3">📈 {t.hashtags}</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.trending_hashtags.map((h: any, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-sm">{typeof h === 'string' ? h : h.tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.trending_sounds?.length > 0 && (
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
                  <h3 className="text-purple-400 font-semibold mb-3">🎵 {t.sounds}</h3>
                  <div className="space-y-2">
                    {result.trending_sounds.map((s: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-gray-300 text-sm"><span>🎵</span>{typeof s === 'string' ? s : s.name}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Opportunities */}
            {result.content_opportunities?.length > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                <h3 className="text-green-400 font-semibold mb-3">💡 {t.opportunities}</h3>
                <ul className="space-y-2">
                  {result.content_opportunities.map((opp: string, i: number) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-green-400">→</span>{opp}</li>)}
                </ul>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newScan}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
