'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const niches = [
  { value: 'ai', icon: '🤖', label: 'AI' },
  { value: 'fitness', icon: '💪', label: 'Fitness' },
  { value: 'finance', icon: '💰', label: 'Finance' },
  { value: 'business', icon: '💼', label: 'Business' },
  { value: 'gaming', icon: '🎮', label: 'Gaming' },
  { value: 'beauty', icon: '💄', label: 'Beauty' },
  { value: 'food', icon: '🍳', label: 'Food' },
  { value: 'travel', icon: '✈️', label: 'Travel' },
]

const texts: any = {
  tr: { back: 'Dashboard', platformLabel: 'Platform', nicheLabel: 'Niş Seçin', customLabel: 'veya Özel Anahtar Kelime', customPlaceholder: 'örn: ev dekorasyonu...', minViewsLabel: 'Min. Görüntülenme', btn: 'Viral Videoları Bul', loading: 'Aranıyor...', videos: 'Viral Video Konseptleri', hooks: 'Popüler Hook\'lar', gaps: 'İçerik Fırsatları', newSearch: 'Yeni Arama' },
  en: { back: 'Dashboard', platformLabel: 'Platform', nicheLabel: 'Select Niche', customLabel: 'or Custom Keyword', customPlaceholder: 'e.g., home decor...', minViewsLabel: 'Min. Views', btn: 'Find Viral Videos', loading: 'Searching...', videos: 'Viral Video Concepts', hooks: 'Popular Hooks', gaps: 'Content Gaps', newSearch: 'New Search' },
  ru: { back: 'Панель', platformLabel: 'Платформа', nicheLabel: 'Ниша', customLabel: 'или ключевое слово', customPlaceholder: 'напр: декор...', minViewsLabel: 'Мин. просмотры', btn: 'Найти', loading: 'Поиск...', videos: 'Видео', hooks: 'Хуки', gaps: 'Возможности', newSearch: 'Новый' },
  de: { back: 'Dashboard', platformLabel: 'Plattform', nicheLabel: 'Nische', customLabel: 'oder Stichwort', customPlaceholder: 'z.B. Deko...', minViewsLabel: 'Min. Views', btn: 'Suchen', loading: 'Suche...', videos: 'Videos', hooks: 'Hooks', gaps: 'Chancen', newSearch: 'Neu' },
  fr: { back: 'Tableau', platformLabel: 'Plateforme', nicheLabel: 'Niche', customLabel: 'ou mot-clé', customPlaceholder: 'ex: déco...', minViewsLabel: 'Min. vues', btn: 'Rechercher', loading: 'Recherche...', videos: 'Vidéos', hooks: 'Hooks', gaps: 'Opportunités', newSearch: 'Nouveau' }
}

export default function VideoFinderPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [platform, setPlatform] = useState('tiktok')
  const [niche, setNiche] = useState('')
  const [customKeyword, setCustomKeyword] = useState('')
  const [minViews, setMinViews] = useState('100K')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else {
        setUser(user)
        supabase.from('credits').select('balance').eq('user_id', user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [])

  const handleSubmit = async () => {
    if (!niche && !customKeyword.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/video-finder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform, niche, customKeyword, minViews, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // if (credits >= X) {
          // await supabase.from("credits").update({ balance: credits - 5 }).eq('user_id', user.id)
          // setCredits(prev => prev - X)
        // }
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
            <div className="flex items-center gap-3"><span className="text-2xl">🔍</span><h1 className="font-semibold">Viral Video Finder</h1></div>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{v:'tiktok',l:'TikTok',i:'🎵'},{v:'reels',l:'Reels',i:'📸'},{v:'shorts',l:'Shorts',i:'▶️'}].map(p => (
                    <button key={p.v} onClick={() => setPlatform(p.v)} className={`p-3 rounded-xl border text-center transition-all ${platform === p.v ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                      <span className="text-xl">{p.i}</span>
                      <div className="text-sm mt-1">{p.l}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                <div className="grid grid-cols-4 gap-2">
                  {niches.map(n => (
                    <button key={n.value} onClick={() => { setNiche(n.value); setCustomKeyword('') }} className={`p-3 rounded-xl border text-center transition-all ${niche === n.value ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                      <span className="text-xl">{n.icon}</span>
                      <div className="text-xs mt-1">{n.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.customLabel}</label>
                <input type="text" value={customKeyword} onChange={e => { setCustomKeyword(e.target.value); setNiche('') }} placeholder={t.customPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.minViewsLabel}</label>
                <select value={minViews} onChange={e => setMinViews(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                  <option value="10K">10K+</option>
                  <option value="100K">100K+</option>
                  <option value="500K">500K+</option>
                  <option value="1M">1M+</option>
                </select>
              </div>
              <button onClick={handleSubmit} disabled={loading || (!niche && !customKeyword.trim()) || credits < 5} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 5 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview */}
            {result.niche_overview && (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5">
                <p className="text-gray-300">{result.niche_overview}</p>
                {result.trending_formats && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.trending_formats.map((f: string, i: number) => <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">{f}</span>)}
                  </div>
                )}
              </div>
            )}

            {/* Videos */}
            {result.viral_videos?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">🎬 {t.videos}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.viral_videos.map((video: any, i: number) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-purple-500/30 transition">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-white">{video.title}</h3>
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">{video.engagement_rate}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                        <div className="bg-white/5 rounded-lg p-2"><div className="text-gray-500 text-xs">Views</div><div className="text-white font-medium">{video.estimated_views}</div></div>
                        <div className="bg-white/5 rounded-lg p-2"><div className="text-gray-500 text-xs">Likes</div><div className="text-white font-medium">{video.estimated_likes}</div></div>
                        <div className="bg-white/5 rounded-lg p-2"><div className="text-gray-500 text-xs">Duration</div><div className="text-white font-medium">{video.duration}</div></div>
                      </div>
                      {video.hook && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
                          <div className="text-xs text-red-400 mb-1">🎣 Hook</div>
                          <p className="text-white text-sm">"{video.hook}"</p>
                        </div>
                      )}
                      {video.why_viral && <p className="text-green-400 text-xs">✓ {video.why_viral}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hooks & Gaps */}
            <div className="grid md:grid-cols-2 gap-4">
              {result.common_hooks?.length > 0 && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                  <h3 className="text-red-400 font-semibold mb-3">🎣 {t.hooks}</h3>
                  <div className="space-y-2">
                    {result.common_hooks.map((h: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                        <p className="text-white text-sm">"{h.hook}"</p>
                        <span className="text-green-400 font-bold text-sm">{h.effectiveness}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.content_gaps?.length > 0 && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
                  <h3 className="text-yellow-400 font-semibold mb-3">💡 {t.gaps}</h3>
                  <ul className="space-y-2">
                    {result.content_gaps.map((gap: string, i: number) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-yellow-400">→</span>{gap}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newSearch}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
