'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Platform Adapter', subtitle: 'Adapt content for platforms', credits: '3 Credits', content: 'Content', placeholder: 'Paste your content...', platform: 'Target Platform', generate: 'Adapt', generating: 'Adapting...', result: 'Adapted Content', copy: 'Copy', copied: 'Copied!', required: 'Content is required', success: 'Done!', error: 'Error', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' } },
  tr: { back: '← Panele Dön', title: 'Platform Uyarlayıcı', subtitle: 'İçeriği platformlara uyarla', credits: '3 Kredi', content: 'İçerik', placeholder: 'İçeriğinizi yapıştırın...', platform: 'Hedef Platform', generate: 'Uyarla', generating: 'Uyarlanıyor...', result: 'Uyarlanmış İçerik', copy: 'Kopyala', copied: 'Kopyalandı!', required: 'İçerik gerekli', success: 'Tamam!', error: 'Hata', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' } },
  ru: { back: '← Назад', title: 'Адаптер платформ', subtitle: 'Адаптируйте контент', credits: '3 Кредита', content: 'Контент', placeholder: 'Вставьте контент...', platform: 'Платформа', generate: 'Адаптировать', generating: 'Адаптация...', result: 'Адаптированный контент', copy: 'Копировать', copied: 'Скопировано!', required: 'Контент обязателен', success: 'Готово!', error: 'Ошибка', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' } },
  de: { back: '← Zurück', title: 'Plattform-Adapter', subtitle: 'Inhalte anpassen', credits: '3 Credits', content: 'Inhalt', placeholder: 'Inhalt einfügen...', platform: 'Plattform', generate: 'Anpassen', generating: 'Anpassung...', result: 'Angepasster Inhalt', copy: 'Kopieren', copied: 'Kopiert!', required: 'Inhalt erforderlich', success: 'Fertig!', error: 'Fehler', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' } },
  fr: { back: '← Retour', title: 'Adaptateur', subtitle: 'Adaptez le contenu', credits: '3 Crédits', content: 'Contenu', placeholder: 'Collez le contenu...', platform: 'Plateforme', generate: 'Adapter', generating: 'Adaptation...', result: 'Contenu adapté', copy: 'Copier', copied: 'Copié!', required: 'Contenu requis', success: 'Terminé!', error: 'Erreur', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' } }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function Page() {
  const [content, setContent] = useState(''); const [platform, setPlatform] = useState('instagram'); const [result, setResult] = useState(''); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!content) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/platform-adapter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platform, language }) }); const data = await res.json(); if (data.adapted) { setResult(data.adapted); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">🔄</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="mb-4"><label className="block text-sm font-medium mb-2">{t.content}</label><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.placeholder} rows={4} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl resize-none" /></div>
          <div className="mb-4"><label className="block text-sm font-medium mb-2">{t.platform}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl">{Object.entries(t.platforms).map(([k,v]) => <option key={k} value={k}>{v as string}</option>)}</select></div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>
        {result && (<div className="bg-gray-800 rounded-2xl p-6"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">{t.result}</h2><button onClick={() => {navigator.clipboard.writeText(result); showToast(t.copied, 'success')}} className="px-4 py-2 bg-purple-600 rounded-lg text-sm">{t.copy}</button></div><p className="text-gray-300 whitespace-pre-wrap">{result}</p></div>)}
      </main>
    </div>
  )
}
