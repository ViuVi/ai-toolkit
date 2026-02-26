'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Post Scheduler', subtitle: 'Find best posting times', credits: '3 Credits', platform: 'Platform', audience: 'Audience Location', audiencePlaceholder: 'e.g. USA, Europe...', generate: 'Find Best Times', generating: 'Analyzing...', result: 'Best Posting Times', required: 'Info required', success: 'Done!', error: 'Error', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', youtube: 'YouTube' } },
  tr: { back: '← Panele Dön', title: 'Gönderi Planlayıcı', subtitle: 'En iyi paylaşım zamanları', credits: '3 Kredi', platform: 'Platform', audience: 'Hedef Kitle Konumu', audiencePlaceholder: 'örn. Türkiye, Avrupa...', generate: 'En İyi Zamanları Bul', generating: 'Analiz ediliyor...', result: 'En İyi Paylaşım Zamanları', required: 'Bilgi gerekli', success: 'Tamam!', error: 'Hata', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', youtube: 'YouTube' } },
  ru: { back: '← Назад', title: 'Планировщик постов', subtitle: 'Лучшее время для постов', credits: '3 Кредита', platform: 'Платформа', audience: 'Локация аудитории', audiencePlaceholder: 'напр. США, Европа...', generate: 'Найти время', generating: 'Анализ...', result: 'Лучшее время', required: 'Информация обязательна', success: 'Готово!', error: 'Ошибка', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', youtube: 'YouTube' } },
  de: { back: '← Zurück', title: 'Post-Planer', subtitle: 'Beste Posting-Zeiten', credits: '3 Credits', platform: 'Plattform', audience: 'Zielgruppen-Standort', audiencePlaceholder: 'z.B. USA, Europa...', generate: 'Zeiten finden', generating: 'Analyse...', result: 'Beste Zeiten', required: 'Info erforderlich', success: 'Fertig!', error: 'Fehler', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', youtube: 'YouTube' } },
  fr: { back: '← Retour', title: 'Planificateur de posts', subtitle: 'Meilleurs moments pour poster', credits: '3 Crédits', platform: 'Plateforme', audience: 'Localisation audience', audiencePlaceholder: 'ex. USA, Europe...', generate: 'Trouver les moments', generating: 'Analyse...', result: 'Meilleurs moments', required: 'Info requise', success: 'Terminé!', error: 'Erreur', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', youtube: 'YouTube' } }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function Page() {
  const [platform, setPlatform] = useState('instagram'); const [audience, setAudience] = useState(''); const [result, setResult] = useState<any>(null); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!audience) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/post-scheduler', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform, audience, language }) }); const data = await res.json(); if (data) { setResult(data); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">⏰</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium mb-2">{t.platform}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">{Object.entries(t.platforms).map(([k,v]) => <option key={k} value={k}>{v as string}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-2">{t.audience}</label><input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder={t.audiencePlaceholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl" /></div>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>
        {result && (<div className="bg-gray-800 rounded-2xl p-6"><h2 className="text-xl font-semibold mb-4">{t.result}</h2><div className="space-y-3">{result.times?.map((time: string, i: number) => (<div key={i} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl"><span className="text-2xl">🕐</span><span>{time}</span></div>))}</div></div>)}
      </main>
    </div>
  )
}
