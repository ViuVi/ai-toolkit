'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Content Calendar', subtitle: 'Plan your content', credits: '5 Credits', niche: 'Your Niche', placeholder: 'e.g. fitness, tech...', weeks: 'Weeks', generate: 'Generate Calendar', generating: 'Generating...', result: 'Content Plan', required: 'Niche required', success: 'Done!', error: 'Error' },
  tr: { back: '← Panele Dön', title: 'İçerik Takvimi', subtitle: 'İçeriğini planla', credits: '5 Kredi', niche: 'Nişiniz', placeholder: 'örn. fitness, teknoloji...', weeks: 'Hafta', generate: 'Takvim Oluştur', generating: 'Oluşturuluyor...', result: 'İçerik Planı', required: 'Niş gerekli', success: 'Tamam!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Контент-календарь', subtitle: 'Планируйте контент', credits: '5 Кредитов', niche: 'Ниша', placeholder: 'напр. фитнес...', weeks: 'Недели', generate: 'Создать', generating: 'Создание...', result: 'План', required: 'Ниша обязательна', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Content-Kalender', subtitle: 'Inhalte planen', credits: '5 Credits', niche: 'Nische', placeholder: 'z.B. Fitness...', weeks: 'Wochen', generate: 'Erstellen', generating: 'Erstellen...', result: 'Plan', required: 'Nische erforderlich', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Calendrier de contenu', subtitle: 'Planifiez votre contenu', credits: '5 Crédits', niche: 'Niche', placeholder: 'ex. fitness...', weeks: 'Semaines', generate: 'Générer', generating: 'Génération...', result: 'Plan', required: 'Niche requise', success: 'Terminé!', error: 'Erreur' }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function Page() {
  const [niche, setNiche] = useState(''); const [weeks, setWeeks] = useState('4'); const [calendar, setCalendar] = useState<any[]>([]); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!niche) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/content-calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, weeks: parseInt(weeks), language }) }); const data = await res.json(); if (data.calendar) { setCalendar(data.calendar); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">📅</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium mb-2">{t.niche}</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.placeholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-2">{t.weeks}</label><select value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl"><option value="2">2</option><option value="4">4</option></select></div>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>
        {calendar.length > 0 && (<div className="bg-gray-800 rounded-2xl p-6"><h2 className="text-xl font-semibold mb-4">{t.result}</h2><div className="space-y-4">{calendar.map((week: any, i: number) => (<div key={i} className="p-4 bg-gray-700/50 rounded-xl"><h3 className="font-semibold mb-2">Week {i+1}</h3><ul className="space-y-1">{week.posts?.map((post: string, j: number) => (<li key={j} className="text-gray-300 text-sm">• {post}</li>))}</ul></div>))}</div></div>)}
      </main>
    </div>
  )
}
