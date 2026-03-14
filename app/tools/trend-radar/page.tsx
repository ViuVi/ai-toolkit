'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Trend Radar', icon: '📡', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Nişindeki güncel trendleri keşfeder. Viral potansiyeli yüksek konuları önerir.', nicheLabel: 'Niş / Sektör', nichePlaceholder: 'örn: teknoloji, moda, fitness...', platformLabel: 'Platform', btn: 'Trendleri Bul', loading: 'Araştırılıyor...' },
  en: { title: 'Trend Radar', icon: '📡', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Discovers current trends in your niche. Suggests topics with high viral potential.', nicheLabel: 'Niche / Industry', nichePlaceholder: 'e.g., tech, fashion, fitness...', platformLabel: 'Platform', btn: 'Find Trends', loading: 'Researching...' },
  ru: { title: 'Trend Radar', icon: '📡', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Находит тренды в вашей нише.', nicheLabel: 'Ниша', nichePlaceholder: 'напр: технологии...', platformLabel: 'Платформа', btn: 'Найти', loading: 'Поиск...' },
  de: { title: 'Trend Radar', icon: '📡', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Entdeckt aktuelle Trends.', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Tech...', platformLabel: 'Plattform', btn: 'Finden', loading: 'Suche...' },
  fr: { title: 'Trend Radar', icon: '📡', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Découvre les tendances actuelles.', nicheLabel: 'Niche', nichePlaceholder: 'ex: tech...', platformLabel: 'Plateforme', btn: 'Trouver', loading: 'Recherche...' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
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
    if (!niche.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/trend-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platform, language })
      })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    if (status === 'hot') return 'bg-red-500/20 text-red-400 border-red-500/30'
    if (status === 'rising') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    return 'bg-green-500/20 text-green-400 border-green-500/30'
  }

  const getStatusEmoji = (status: string) => {
    if (status === 'hot') return '🔥'
    if (status === 'rising') return '📈'
    return '🌱'
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
      
      <main className="pt-32 pb-12 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter/X</option>
                </select>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result ? (
              <>
                {/* Genel Özet */}
                {result.trend_overview && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-gray-300 text-sm">{result.trend_overview}</p>
                  </div>
                )}
                
                {/* Hot Trendler */}
                {result.hot_trends && result.hot_trends.length > 0 && (
                  <div>
                    <h3 className="text-red-400 font-semibold mb-3">🔥 Sıcak Trendler</h3>
                    <div className="space-y-3">
                      {result.hot_trends.map((trend: any, i: number) => (
                        <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-medium">{trend.trend}</h4>
                            {trend.viral_potential && (
                              <span className="text-xs bg-red-500/30 text-red-300 px-2 py-1 rounded">🔥 {trend.viral_potential}%</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{trend.description}</p>
                          {trend.content_ideas && trend.content_ideas.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-red-500/20">
                              <span className="text-yellow-400 text-xs">💡 İçerik Fikirleri:</span>
                              <ul className="mt-1">
                                {trend.content_ideas.map((idea: string, j: number) => (
                                  <li key={j} className="text-gray-300 text-xs">• {idea}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {trend.how_to_use && (
                            <p className="text-purple-400 text-xs mt-2">📝 {trend.how_to_use}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Rising Trendler */}
                {result.rising_trends && result.rising_trends.length > 0 && (
                  <div>
                    <h3 className="text-yellow-400 font-semibold mb-3">📈 Yükselen Trendler</h3>
                    <div className="space-y-3">
                      {result.rising_trends.map((trend: any, i: number) => (
                        <div key={i} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                          <h4 className="text-white font-medium mb-1">{trend.trend}</h4>
                          <p className="text-gray-400 text-sm mb-2">{trend.description}</p>
                          {trend.early_adopter_advantage && (
                            <p className="text-green-400 text-xs">🚀 {trend.early_adopter_advantage}</p>
                          )}
                          {trend.content_ideas && (
                            <div className="mt-2">
                              {trend.content_ideas.map((idea: string, j: number) => (
                                <span key={j} className="text-gray-300 text-xs mr-2">• {idea}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Emerging Trendler */}
                {result.emerging_trends && result.emerging_trends.length > 0 && (
                  <div>
                    <h3 className="text-green-400 font-semibold mb-3">🌱 Yeni Çıkan Trendler</h3>
                    <div className="space-y-3">
                      {result.emerging_trends.map((trend: any, i: number) => (
                        <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                          <h4 className="text-white font-medium mb-1">{trend.trend}</h4>
                          <p className="text-gray-400 text-sm">{trend.description}</p>
                          {trend.why_watch && (
                            <p className="text-blue-400 text-xs mt-2">👀 {trend.why_watch}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Mevsimsel Fırsatlar */}
                {result.seasonal_opportunities && result.seasonal_opportunities.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h3 className="text-blue-400 font-semibold mb-3">📅 Mevsimsel Fırsatlar</h3>
                    {result.seasonal_opportunities.map((opp: any, i: number) => (
                      <div key={i} className="mb-3 last:mb-0">
                        <span className="text-white text-sm">{opp.event}</span>
                        <span className="text-gray-500 text-xs ml-2">({opp.dates})</span>
                        {opp.content_angles && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {opp.content_angles.map((angle: string, j: number) => (
                              <span key={j} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">{angle}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Pro Tips */}
                {result.pro_tips && result.pro_tips.length > 0 && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-purple-400 font-semibold mb-2">💡 Pro İpuçları</h3>
                    <ul className="space-y-1">
                      {result.pro_tips.map((tip: string, i: number) => (
                        <li key={i} className="text-gray-300 text-sm">• {tip}</li>
                      ))}
                    </ul>
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
