'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Competitor Analysis', subtitle: 'Analyze competitors', credits: '8 Credits', competitor: 'Competitor', placeholder: 'Competitor name or URL...', niche: 'Your Niche', nichePlaceholder: 'e.g. fitness, tech...', generate: 'Analyze', generating: 'Analyzing...', result: 'Analysis', required: 'Info required', success: 'Done!', error: 'Error' },
  tr: { back: '← Panele Dön', title: 'Rakip Analizi', subtitle: 'Rakipleri analiz et', credits: '8 Kredi', competitor: 'Rakip', placeholder: 'Rakip adı veya URL...', niche: 'Nişiniz', nichePlaceholder: 'örn. fitness, teknoloji...', generate: 'Analiz Et', generating: 'Analiz ediliyor...', result: 'Analiz', required: 'Bilgi gerekli', success: 'Tamam!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Анализ конкурентов', subtitle: 'Анализируйте конкурентов', credits: '8 Кредитов', competitor: 'Конкурент', placeholder: 'Имя или URL...', niche: 'Ниша', nichePlaceholder: 'напр. фитнес...', generate: 'Анализировать', generating: 'Анализ...', result: 'Анализ', required: 'Информация обязательна', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Wettbewerbsanalyse', subtitle: 'Konkurrenten analysieren', credits: '8 Credits', competitor: 'Wettbewerber', placeholder: 'Name oder URL...', niche: 'Nische', nichePlaceholder: 'z.B. Fitness...', generate: 'Analysieren', generating: 'Analyse...', result: 'Analyse', required: 'Info erforderlich', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Analyse concurrentielle', subtitle: 'Analysez les concurrents', credits: '8 Crédits', competitor: 'Concurrent', placeholder: 'Nom ou URL...', niche: 'Niche', nichePlaceholder: 'ex. fitness...', generate: 'Analyser', generating: 'Analyse...', result: 'Analyse', required: 'Info requise', success: 'Terminé!', error: 'Erreur' }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function Page() {
  const [competitor, setCompetitor] = useState(''); const [niche, setNiche] = useState(''); const [result, setResult] = useState(''); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!competitor) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/competitor-analyzer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ competitor, niche, language }) }); const data = await res.json(); if (data.analysis) { setResult(data.analysis); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">🔍</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium mb-2">{t.competitor}</label><input type="text" value={competitor} onChange={(e) => setCompetitor(e.target.value)} placeholder={t.placeholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-2">{t.niche}</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl" /></div>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>
        {result && (<div className="bg-gray-800 rounded-2xl p-6"><h2 className="text-xl font-semibold mb-4">{t.result}</h2><p className="text-gray-300 whitespace-pre-wrap">{result}</p></div>)}
      </main>
    </div>
  )
}
