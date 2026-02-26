'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'Viral Score', subtitle: 'Check viral potential', credits: '4 Credits', content: 'Content', placeholder: 'Paste your content...', generate: 'Analyze', generating: 'Analyzing...', result: 'Viral Score', tips: 'Tips to Improve', required: 'Content is required', success: 'Done!', error: 'Error' },
  tr: { back: '← Panele Dön', title: 'Viral Skoru', subtitle: 'Viral potansiyeli kontrol et', credits: '4 Kredi', content: 'İçerik', placeholder: 'İçeriğinizi yapıştırın...', generate: 'Analiz Et', generating: 'Analiz ediliyor...', result: 'Viral Skor', tips: 'İyileştirme İpuçları', required: 'İçerik gerekli', success: 'Tamam!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Вирусный рейтинг', subtitle: 'Проверьте потенциал', credits: '4 Кредита', content: 'Контент', placeholder: 'Вставьте контент...', generate: 'Анализировать', generating: 'Анализ...', result: 'Рейтинг', tips: 'Советы', required: 'Контент обязателен', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Viral-Score', subtitle: 'Virales Potenzial prüfen', credits: '4 Credits', content: 'Inhalt', placeholder: 'Inhalt einfügen...', generate: 'Analysieren', generating: 'Analyse...', result: 'Score', tips: 'Tipps', required: 'Inhalt erforderlich', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Score viral', subtitle: 'Vérifiez le potentiel', credits: '4 Crédits', content: 'Contenu', placeholder: 'Collez le contenu...', generate: 'Analyser', generating: 'Analyse...', result: 'Score', tips: 'Conseils', required: 'Contenu requis', success: 'Terminé!', error: 'Erreur' }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]
export default function Page() {
  const [content, setContent] = useState(''); const [result, setResult] = useState<any>(null); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]
  const handleGenerate = async () => { if (!content) { showToast(t.required, 'warning'); return }; setLoading(true); try { const res = await fetch('/api/viral-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, language }) }); const data = await res.json(); if (data) { setResult(data); showToast(t.success, 'success') } } catch { showToast(t.error, 'error') } setLoading(false) }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link><div className="flex items-center gap-4"><div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div><span className="text-2xl">🚀</span></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ {t.credits}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8"><label className="block text-sm font-medium mb-2">{t.content}</label><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.placeholder} rows={5} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl resize-none" /><button onClick={handleGenerate} disabled={loading} className="w-full mt-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button></div>
        {result && (<div className="space-y-4"><div className="bg-gray-800 rounded-2xl p-6 text-center"><h2 className="text-xl font-semibold mb-4">{t.result}</h2><div className="text-6xl font-bold text-purple-400">{result.score || 75}/100</div></div>{result.tips && (<div className="bg-gray-800 rounded-2xl p-6"><h2 className="text-xl font-semibold mb-4">{t.tips}</h2><ul className="space-y-2">{result.tips.map((tip: string, i: number) => (<li key={i} className="flex items-start gap-2"><span className="text-green-400">✓</span><span>{tip}</span></li>))}</ul></div>)}</div>)}
      </main>
    </div>
  )
}
