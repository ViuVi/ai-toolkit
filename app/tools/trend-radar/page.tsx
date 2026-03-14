'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Trend Radar', icon: '📡', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Nişindeki güncel trendleri keşfeder.', nicheLabel: 'Niş', nichePlaceholder: 'örn: teknoloji, moda...', platformLabel: 'Platform', btn: 'Trendleri Bul', loading: 'Araştırılıyor...' },
  en: { title: 'Trend Radar', icon: '📡', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Discovers trends in your niche.', nicheLabel: 'Niche', nichePlaceholder: 'e.g., tech, fashion...', platformLabel: 'Platform', btn: 'Find Trends', loading: 'Researching...' },
  ru: { title: 'Trend Radar', icon: '📡', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Находит тренды.', nicheLabel: 'Ниша', nichePlaceholder: 'напр: технологии...', platformLabel: 'Платформа', btn: 'Найти', loading: 'Поиск...' },
  de: { title: 'Trend Radar', icon: '📡', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Entdeckt Trends.', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Tech...', platformLabel: 'Plattform', btn: 'Finden', loading: 'Suche...' },
  fr: { title: 'Trend Radar', icon: '📡', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Découvre les tendances.', nicheLabel: 'Niche', nichePlaceholder: 'ex: tech...', platformLabel: 'Plateforme', btn: 'Trouver', loading: 'Recherche...' }
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

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!niche.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/trend-radar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">{t.back}</Link>
            <span className="text-2xl">{t.icon}</span><h1 className="text-xl font-bold">{t.title}</h1>
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
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6"><p className="text-gray-400 text-sm">{t.purpose}</p></div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div><label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label><input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label><select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white"><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="youtube">YouTube</option><option value="twitter">Twitter/X</option></select></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result ? (
              <>
                {result.trend_overview && <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4"><p className="text-gray-300 text-sm">{result.trend_overview}</p></div>}
                {result.hot_trends?.length > 0 && <div><h3 className="text-red-400 font-semibold mb-3">🔥 Sıcak Trendler</h3><div className="space-y-3">{result.hot_trends.map((tr: any, i: number) => <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"><div className="flex justify-between items-start mb-2"><h4 className="text-white font-medium">{tr.trend}</h4>{tr.viral_potential && <span className="text-xs bg-red-500/30 text-red-300 px-2 py-1 rounded">🔥 {tr.viral_potential}%</span>}</div><p className="text-gray-400 text-sm">{tr.description}</p>{tr.content_ideas?.length > 0 && <div className="mt-2 pt-2 border-t border-red-500/20"><span className="text-yellow-400 text-xs">💡 Fikirler:</span><ul className="mt-1">{tr.content_ideas.map((idea: string, j: number) => <li key={j} className="text-gray-300 text-xs">• {idea}</li>)}</ul></div>}</div>)}</div></div>}
                {result.rising_trends?.length > 0 && <div><h3 className="text-yellow-400 font-semibold mb-3">📈 Yükselen</h3><div className="space-y-3">{result.rising_trends.map((tr: any, i: number) => <div key={i} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4"><h4 className="text-white font-medium">{tr.trend}</h4><p className="text-gray-400 text-sm">{tr.description}</p>{tr.early_adopter_advantage && <p className="text-green-400 text-xs mt-2">🚀 {tr.early_adopter_advantage}</p>}</div>)}</div></div>}
                {result.emerging_trends?.length > 0 && <div><h3 className="text-green-400 font-semibold mb-3">🌱 Yeni Çıkan</h3><div className="space-y-3">{result.emerging_trends.map((tr: any, i: number) => <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"><h4 className="text-white font-medium">{tr.trend}</h4><p className="text-gray-400 text-sm">{tr.description}</p></div>)}</div></div>}
                {result.pro_tips?.length > 0 && <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"><h3 className="text-purple-400 font-semibold mb-2">💡 Pro Tips</h3><ul className="space-y-1">{result.pro_tips.map((tip: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {tip}</li>)}</ul></div>}
              </>
            ) : <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-12 text-center"><div className="text-6xl mb-4">{t.icon}</div><p className="text-gray-500">{t.purpose}</p></div>}
          </div>
        </div>
      </main>
    </div>
  )
}
