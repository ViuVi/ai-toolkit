'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Text Summarizer', subtitle: 'Summarize long texts', credits: '2 Credits', input: 'Text', placeholder: 'Paste your text...', generate: 'Summarize', generating: 'Summarizing...', result: 'Summary', copy: 'Copy', copied: 'Copied!', required: 'Text is required', success: 'Done!', error: 'Error' },
  tr: { back: '← Panele Dön', title: 'Metin Özetleyici', subtitle: 'Uzun metinleri özetle', credits: '2 Kredi', input: 'Metin', placeholder: 'Metninizi yapıştırın...', generate: 'Özetle', generating: 'Özetleniyor...', result: 'Özet', copy: 'Kopyala', copied: 'Kopyalandı!', required: 'Metin gerekli', success: 'Tamam!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Суммаризатор', subtitle: 'Резюмируйте тексты', credits: '2 Кредита', input: 'Текст', placeholder: 'Вставьте текст...', generate: 'Резюмировать', generating: 'Резюмирование...', result: 'Резюме', copy: 'Копировать', copied: 'Скопировано!', required: 'Текст обязателен', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Zusammenfasser', subtitle: 'Texte zusammenfassen', credits: '2 Credits', input: 'Text', placeholder: 'Text einfügen...', generate: 'Zusammenfassen', generating: 'Zusammenfassen...', result: 'Zusammenfassung', copy: 'Kopieren', copied: 'Kopiert!', required: 'Text erforderlich', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Résumeur', subtitle: 'Résumez les textes', credits: '2 Crédits', input: 'Texte', placeholder: 'Collez le texte...', generate: 'Résumer', generating: 'Résumé...', result: 'Résumé', copy: 'Copier', copied: 'Copié!', required: 'Texte requis', success: 'Terminé!', error: 'Erreur' }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function Page() {
  const [input, setInput] = useState(''); const [result, setResult] = useState(''); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!input) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/summarize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: input, language }) }); const data = await res.json(); if (data.summary) { setResult(data.summary); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">📋</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8"><label className="block text-sm font-medium mb-2">{t.input}</label><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} rows={6} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl resize-none" /><button onClick={handleGenerate} disabled={loading} className="w-full mt-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button></div>
        {result && (<div className="bg-gray-800 rounded-2xl p-6"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">{t.result}</h2><button onClick={() => {navigator.clipboard.writeText(result); showToast(t.copied, 'success')}} className="px-4 py-2 bg-purple-600 rounded-lg text-sm">{t.copy}</button></div><p className="text-gray-300 whitespace-pre-wrap">{result}</p></div>)}
      </main>
    </div>
  )
}
