'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Engagement Predictor', subtitle: 'Predict engagement', credits: '5 Credits', content: 'Content', placeholder: 'Paste your content...', platform: 'Platform', generate: 'Predict', generating: 'Predicting...', result: 'Predicted Engagement', required: 'Content required', success: 'Done!', error: 'Error', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' } },
  tr: { back: '← Panele Dön', title: 'Etkileşim Tahmini', subtitle: 'Etkileşimi tahmin et', credits: '5 Kredi', content: 'İçerik', placeholder: 'İçeriğinizi yapıştırın...', platform: 'Platform', generate: 'Tahmin Et', generating: 'Tahmin ediliyor...', result: 'Tahmini Etkileşim', required: 'İçerik gerekli', success: 'Tamam!', error: 'Hata', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' } },
  ru: { back: '← Назад', title: 'Прогноз вовлеченности', subtitle: 'Прогноз вовлеченности', credits: '5 Кредитов', content: 'Контент', placeholder: 'Вставьте контент...', platform: 'Платформа', generate: 'Предсказать', generating: 'Прогноз...', result: 'Прогноз', required: 'Контент обязателен', success: 'Готово!', error: 'Ошибка', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' } },
  de: { back: '← Zurück', title: 'Engagement-Vorhersage', subtitle: 'Engagement vorhersagen', credits: '5 Credits', content: 'Inhalt', placeholder: 'Inhalt einfügen...', platform: 'Plattform', generate: 'Vorhersagen', generating: 'Vorhersage...', result: 'Vorhersage', required: 'Inhalt erforderlich', success: 'Fertig!', error: 'Fehler', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' } },
  fr: { back: '← Retour', title: "Prédiction d'engagement", subtitle: "Prédisez l'engagement", credits: '5 Crédits', content: 'Contenu', placeholder: 'Collez le contenu...', platform: 'Plateforme', generate: 'Prédire', generating: 'Prédiction...', result: 'Prédiction', required: 'Contenu requis', success: 'Terminé!', error: 'Erreur', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' } }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function Page() {
  const [content, setContent] = useState(''); const [platform, setPlatform] = useState('instagram'); const [result, setResult] = useState<any>(null); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!content) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/engagement-predictor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platform, language }) }); const data = await res.json(); if (data) { setResult(data); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">📈</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="mb-4"><label className="block text-sm font-medium mb-2">{t.content}</label><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.placeholder} rows={4} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl resize-none" /></div>
          <div className="mb-4"><label className="block text-sm font-medium mb-2">{t.platform}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">{Object.entries(t.platforms).map(([k,v]) => <option key={k} value={k}>{v as string}</option>)}</select></div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>
        {result && (<div className="bg-gray-800 rounded-2xl p-6"><h2 className="text-xl font-semibold mb-4">{t.result}</h2><div className="grid grid-cols-3 gap-4 text-center"><div className="p-4 bg-gray-700/50 rounded-xl"><div className="text-2xl font-bold text-green-400">{result.likes || '~500'}</div><div className="text-gray-400 text-sm">Likes</div></div><div className="p-4 bg-gray-700/50 rounded-xl"><div className="text-2xl font-bold text-blue-400">{result.comments || '~50'}</div><div className="text-gray-400 text-sm">Comments</div></div><div className="p-4 bg-gray-700/50 rounded-xl"><div className="text-2xl font-bold text-purple-400">{result.shares || '~25'}</div><div className="text-gray-400 text-sm">Shares</div></div></div></div>)}
      </main>
    </div>
  )
}
