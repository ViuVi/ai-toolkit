'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Trend Radar', icon: '📡', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Nişindeki güncel trendleri keşfeder. Viral potansiyeli yüksek konuları önerir.', nicheLabel: 'Niş', nichePlaceholder: 'örn: teknoloji, moda...', platformLabel: 'Platform', btn: 'Trendleri Bul', loading: 'Araştırılıyor...' },
  en: { title: 'Trend Radar', icon: '📡', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Discovers current trends in your niche. Suggests topics with high viral potential.', nicheLabel: 'Niche', nichePlaceholder: 'e.g., tech, fashion...', platformLabel: 'Platform', btn: 'Find Trends', loading: 'Researching...' },
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
    try {
      const res = await fetch('/api/trend-radar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, platform, userId: user?.id, language })
      })
      const data = await res.json()
      if (res.ok) setResult(data.result)
    } catch (e) {}
    setLoading(false)
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
      <main className="pt-32 pb-12 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
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
          <div>
            {result ? (
              <div className="space-y-3">
                {result.trends?.map((trend: any, i: number) => (
                  <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-medium">{trend.topic}</span>
                      <span className={`text-xs px-2 py-1 rounded ${trend.potential === 'high' ? 'bg-green-500/20 text-green-400' : trend.potential === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{trend.potential}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{trend.description}</p>
                    {trend.contentIdeas && <p className="text-purple-400 text-xs mt-2">💡 {trend.contentIdeas}</p>}
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
