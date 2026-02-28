'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back', title: 'Trend Detector', subtitle: 'Discover trending topics in your niche', credits: '5 Credits',
    nicheLabel: 'Your Niche', nichePlaceholder: 'e.g., fitness, tech, fashion...', platformLabel: 'Platform',
    platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' },
    regionLabel: 'Region', regions: { global: 'Global', us: 'United States', eu: 'Europe', asia: 'Asia' },
    detect: 'Detect Trends', detecting: 'Detecting...', results: 'Trending Topics',
    trendScore: 'Trend Score', growth: 'Growth', contentIdea: 'Content Idea',
    emptyInput: 'Please enter your niche', success: 'Trends detected!', error: 'Error occurred'
  },
  tr: {
    back: '← Geri', title: 'Trend Dedektörü', subtitle: 'Nişinizdeki trend konuları keşfedin', credits: '5 Kredi',
    nicheLabel: 'Nişiniz', nichePlaceholder: 'örn: fitness, teknoloji, moda...', platformLabel: 'Platform',
    platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' },
    regionLabel: 'Bölge', regions: { global: 'Global', us: 'Amerika', eu: 'Avrupa', asia: 'Asya' },
    detect: 'Trendleri Bul', detecting: 'Aranıyor...', results: 'Trend Konular',
    trendScore: 'Trend Skoru', growth: 'Büyüme', contentIdea: 'İçerik Fikri',
    emptyInput: 'Lütfen niş girin', success: 'Trendler bulundu!', error: 'Hata oluştu'
  },
  ru: { back: '← Назад', title: 'Детектор трендов', subtitle: 'Находите трендовые темы', credits: '5 кредитов', nicheLabel: 'Ваша ниша', nichePlaceholder: 'напр: фитнес, технологии...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, regionLabel: 'Регион', regions: { global: 'Глобально', us: 'США', eu: 'Европа', asia: 'Азия' }, detect: 'Найти тренды', detecting: 'Поиск...', results: 'Трендовые темы', trendScore: 'Рейтинг', growth: 'Рост', contentIdea: 'Идея', emptyInput: 'Введите нишу', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Trend-Detektor', subtitle: 'Entdecken Sie Trendthemen', credits: '5 Credits', nicheLabel: 'Ihre Nische', nichePlaceholder: 'z.B: Fitness, Tech...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, regionLabel: 'Region', regions: { global: 'Global', us: 'USA', eu: 'Europa', asia: 'Asien' }, detect: 'Trends finden', detecting: 'Suche...', results: 'Trendthemen', trendScore: 'Score', growth: 'Wachstum', contentIdea: 'Idee', emptyInput: 'Nische eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Détecteur de tendances', subtitle: 'Découvrez les sujets tendance', credits: '5 crédits', nicheLabel: 'Votre niche', nichePlaceholder: 'ex: fitness, tech...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, regionLabel: 'Région', regions: { global: 'Global', us: 'USA', eu: 'Europe', asia: 'Asie' }, detect: 'Détecter', detecting: 'Recherche...', results: 'Sujets tendance', trendScore: 'Score', growth: 'Croissance', contentIdea: 'Idée', emptyInput: 'Entrez votre niche', success: 'Terminé!', error: 'Erreur' }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' }, { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' }, { code: 'de', flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function TrendDetectorPage() {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [region, setRegion] = useState('global')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleDetect = async () => {
    if (!niche.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/trend-detector', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, region, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.trends); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}
              </div>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.nicheLabel}</label>
            <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.regionLabel}</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {Object.entries(t.regions).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleDetect} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.detecting}</>) : (<><span>📊</span>{t.detect}</>)}
        </button>

        {result && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><span>🔥</span>{t.results}</h2>
            <div className="space-y-4">
              {result.trends?.map((trend: any, i: number) => (
                <div key={i} className="bg-gray-900/50 rounded-xl p-5 border border-gray-700 hover:border-purple-500/50 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                      <h3 className="font-semibold text-lg">{trend.topic}</h3>
                    </div>
                    <span className="text-green-400 font-semibold">{trend.growth}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{t.trendScore}:</span>
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${trend.trendScore}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-purple-400">{trend.trendScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
