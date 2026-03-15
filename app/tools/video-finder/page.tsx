'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const niches = [
  { value: 'ai', label: '🤖 Yapay Zeka', labelEn: '🤖 AI' },
  { value: 'fitness', label: '💪 Fitness', labelEn: '💪 Fitness' },
  { value: 'finance', label: '💰 Finans', labelEn: '💰 Finance' },
  { value: 'business', label: '💼 İş/Girişim', labelEn: '💼 Business' },
  { value: 'gaming', label: '🎮 Gaming', labelEn: '🎮 Gaming' },
  { value: 'beauty', label: '💄 Güzellik', labelEn: '💄 Beauty' },
  { value: 'food', label: '🍳 Yemek', labelEn: '🍳 Food' },
  { value: 'travel', label: '✈️ Seyahat', labelEn: '✈️ Travel' },
  { value: 'education', label: '📚 Eğitim', labelEn: '📚 Education' },
  { value: 'comedy', label: '😂 Komedi', labelEn: '😂 Comedy' },
]

const texts: any = {
  tr: { title: 'Viral Video Finder', icon: '🔍', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Nişindeki viral video trendlerini ve başarılı içerik formatlarını keşfet.', platformLabel: 'Platform', nicheLabel: 'Niş Seçin', customLabel: 'veya Özel Anahtar Kelime', customPlaceholder: 'örn: ev dekorasyonu, köpek eğitimi...', minViewsLabel: 'Min. Görüntülenme', dateLabel: 'Zaman Aralığı', btn: 'Viral Videoları Bul', loading: 'Aranıyor...', videos: '🎬 Viral Video Konseptleri', hooks: '🎣 Popüler Hook\'lar', gaps: '💡 İçerik Fırsatları', analyze: '🔬 Analiz Et' },
  en: { title: 'Viral Video Finder', icon: '🔍', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Discover viral video trends and successful content formats in your niche.', platformLabel: 'Platform', nicheLabel: 'Select Niche', customLabel: 'or Custom Keyword', customPlaceholder: 'e.g., home decor, dog training...', minViewsLabel: 'Min. Views', dateLabel: 'Time Range', btn: 'Find Viral Videos', loading: 'Searching...', videos: '🎬 Viral Video Concepts', hooks: '🎣 Popular Hooks', gaps: '💡 Content Gaps', analyze: '🔬 Analyze' },
  ru: { title: 'Viral Video Finder', icon: '🔍', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Найти вирусные видео.', platformLabel: 'Платформа', nicheLabel: 'Ниша', customLabel: 'или ключевое слово', customPlaceholder: 'напр: декор...', minViewsLabel: 'Мин. просмотры', dateLabel: 'Период', btn: 'Найти', loading: 'Поиск...', videos: '🎬 Видео', hooks: '🎣 Хуки', gaps: '💡 Возможности', analyze: '🔬 Анализ' },
  de: { title: 'Viral Video Finder', icon: '🔍', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Virale Videos finden.', platformLabel: 'Plattform', nicheLabel: 'Nische', customLabel: 'oder Stichwort', customPlaceholder: 'z.B. Deko...', minViewsLabel: 'Min. Views', dateLabel: 'Zeitraum', btn: 'Suchen', loading: 'Suche...', videos: '🎬 Videos', hooks: '🎣 Hooks', gaps: '💡 Chancen', analyze: '🔬 Analyse' },
  fr: { title: 'Viral Video Finder', icon: '🔍', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Trouver les vidéos virales.', platformLabel: 'Plateforme', nicheLabel: 'Niche', customLabel: 'ou mot-clé', customPlaceholder: 'ex: déco...', minViewsLabel: 'Min. vues', dateLabel: 'Période', btn: 'Rechercher', loading: 'Recherche...', videos: '🎬 Vidéos', hooks: '🎣 Hooks', gaps: '💡 Opportunités', analyze: '🔬 Analyse' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [platform, setPlatform] = useState('tiktok')
  const [niche, setNiche] = useState('')
  const [customKeyword, setCustomKeyword] = useState('')
  const [minViews, setMinViews] = useState('100K')
  const [dateRange, setDateRange] = useState('30days')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!niche && !customKeyword.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/video-finder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform, niche, customKeyword, minViews, dateRange, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const formatViews = (views: string) => views

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
      
      <main className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
        {!result ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
              <p className="text-gray-300">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{v:'tiktok',l:'TikTok'},{v:'reels',l:'Instagram Reels'},{v:'shorts',l:'YouTube Shorts'}].map(p => (
                    <button key={p.v} onClick={() => setPlatform(p.v)} className={`p-3 rounded-xl border text-sm ${platform === p.v ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-gray-900/50 border-gray-700 text-gray-400'}`}>{p.l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                <div className="grid grid-cols-5 gap-2">
                  {niches.map(n => (
                    <button key={n.value} onClick={() => { setNiche(n.value); setCustomKeyword('') }} className={`p-2 rounded-xl border text-xs ${niche === n.value ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-gray-900/50 border-gray-700 text-gray-400'}`}>
                      {language === 'tr' ? n.label : n.labelEn}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.customLabel}</label>
                <input type="text" value={customKeyword} onChange={e => { setCustomKeyword(e.target.value); setNiche('') }} placeholder={t.customPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.minViewsLabel}</label>
                  <select value={minViews} onChange={e => setMinViews(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white">
                    <option value="10K">10K+</option>
                    <option value="100K">100K+</option>
                    <option value="500K">500K+</option>
                    <option value="1M">1M+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.dateLabel}</label>
                  <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white">
                    <option value="7days">Son 7 Gün</option>
                    <option value="30days">Son 30 Gün</option>
                    <option value="90days">Son 90 Gün</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || (!niche && !customKeyword.trim())} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview */}
            {result.niche_overview && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5">
                <p className="text-gray-300">{result.niche_overview}</p>
                {result.trending_formats && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.trending_formats.map((f: string, i: number) => <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">{f}</span>)}
                  </div>
                )}
              </div>
            )}
            
            {/* Viral Videos */}
            {result.viral_videos && result.viral_videos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">{t.videos}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.viral_videos.map((video: any, i: number) => (
                    <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-white font-semibold">{video.title}</h3>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{video.engagement_rate}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                        <div className="bg-gray-900/50 rounded-lg p-2">
                          <div className="text-xs text-gray-500">Views</div>
                          <div className="text-white font-semibold">{video.estimated_views}</div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-2">
                          <div className="text-xs text-gray-500">Likes</div>
                          <div className="text-white font-semibold">{video.estimated_likes}</div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-2">
                          <div className="text-xs text-gray-500">Comments</div>
                          <div className="text-white font-semibold">{video.estimated_comments}</div>
                        </div>
                      </div>
                      
                      {/* Hook */}
                      {video.hook && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 mb-2">
                          <span className="text-xs text-red-400">🎣 Hook:</span>
                          <p className="text-white text-sm">"{video.hook}"</p>
                        </div>
                      )}
                      
                      {/* Why Viral */}
                      {video.why_viral && <p className="text-green-400 text-xs mb-2">✓ {video.why_viral}</p>}
                      
                      {/* Recreate Tips */}
                      {video.recreate_tips && <p className="text-gray-500 text-xs">💡 {video.recreate_tips}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hooks & Gaps */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Common Hooks */}
              {result.common_hooks && result.common_hooks.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                  <h3 className="text-red-400 font-semibold mb-3">{t.hooks}</h3>
                  <div className="space-y-2">
                    {result.common_hooks.map((h: any, i: number) => (
                      <div key={i} className="bg-gray-900/50 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="text-white text-sm">"{h.hook}"</p>
                          <span className="text-xs text-gray-500">{h.type}</span>
                        </div>
                        <span className="text-green-400 font-bold">{h.effectiveness}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Content Gaps */}
              {result.content_gaps && result.content_gaps.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
                  <h3 className="text-yellow-400 font-semibold mb-3">{t.gaps}</h3>
                  <ul className="space-y-2">
                    {result.content_gaps.map((gap: string, i: number) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-yellow-400">💡</span>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Pro Tips */}
            {result.pro_tips && result.pro_tips.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-semibold mb-2">🚀 Pro Tips</h3>
                <ul className="space-y-1">
                  {result.pro_tips.map((tip: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {tip}</li>)}
                </ul>
              </div>
            )}
            
            {/* Yeni Arama */}
            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600">← Yeni Arama</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
