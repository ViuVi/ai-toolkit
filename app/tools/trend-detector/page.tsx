'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Trend Detector', subtitle: 'Discover trending topics', credits: '5 Credits', niche: 'Niche', placeholder: 'e.g. fitness, tech...', generate: 'Detect Trends', generating: 'Detecting...', results: 'Trending Topics', required: 'Niche is required', success: 'Done!', error: 'Error' },
  tr: { back: '← Panele Dön', title: 'Trend Dedektörü', subtitle: 'Trend konuları keşfet', credits: '5 Kredi', niche: 'Niş', placeholder: 'örn. fitness, teknoloji...', generate: 'Trendleri Bul', generating: 'Aranıyor...', results: 'Trend Konular', required: 'Niş gerekli', success: 'Tamam!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Детектор трендов', subtitle: 'Откройте тренды', credits: '5 Кредитов', niche: 'Ниша', placeholder: 'напр. фитнес, технологии...', generate: 'Найти тренды', generating: 'Поиск...', results: 'Тренды', required: 'Ниша обязательна', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Trend-Detektor', subtitle: 'Trends entdecken', credits: '5 Credits', niche: 'Nische', placeholder: 'z.B. Fitness, Tech...', generate: 'Trends finden', generating: 'Suche...', results: 'Trends', required: 'Nische erforderlich', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Détecteur de tendances', subtitle: 'Découvrez les tendances', credits: '5 Crédits', niche: 'Niche', placeholder: 'ex. fitness, tech...', generate: 'Détecter', generating: 'Recherche...', results: 'Tendances', required: 'Niche requise', success: 'Terminé!', error: 'Erreur' }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function Page() {
  const [niche, setNiche] = useState(''); const [trends, setTrends] = useState<string[]>([]); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!niche) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/trend-detector', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, language }) }); const data = await res.json(); if (data.trends) { setTrends(data.trends); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">📊</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8"><label className="block text-sm font-medium mb-2">{t.niche}</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.placeholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl" /><button onClick={handleGenerate} disabled={loading} className="w-full mt-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button></div>
        {trends.length > 0 && (<div className="bg-gray-800 rounded-2xl p-6"><h2 className="text-xl font-semibold mb-4">{t.results}</h2><div className="space-y-3">{trends.map((trend, i) => (<div key={i} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl"><span className="text-purple-400 font-bold">#{i+1}</span><span>{trend}</span></div>))}</div></div>)}
      </main>
    </div>
  )
}
