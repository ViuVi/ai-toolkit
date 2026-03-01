'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Text Summarizer', subtitle: 'Summarize long texts into concise summaries', credits: '2 Credits', textLabel: 'Text', textPlaceholder: 'Paste the text to summarize...', lengthLabel: 'Length', lengths: { short: 'Short', medium: 'Medium', long: 'Long' }, summarize: 'Summarize', summarizing: 'Summarizing...', result: 'Summary', copy: 'Copy', copied: 'Copied!', original: 'Original', summary: 'Summary', reduction: 'Reduction', chars: 'chars', emptyInput: 'Enter text', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Metin Özetleyici', subtitle: 'Uzun metinleri kısa özetlere dönüştürün', credits: '2 Kredi', textLabel: 'Metin', textPlaceholder: 'Özetlenecek metni yapıştırın...', lengthLabel: 'Uzunluk', lengths: { short: 'Kısa', medium: 'Orta', long: 'Uzun' }, summarize: 'Özetle', summarizing: 'Özetleniyor...', result: 'Özet', copy: 'Kopyala', copied: 'Kopyalandı!', original: 'Orijinal', summary: 'Özet', reduction: 'Azalma', chars: 'karakter', emptyInput: 'Metin girin', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Сжатие текста', subtitle: 'Сжимайте длинные тексты', credits: '2 кредита', textLabel: 'Текст', textPlaceholder: 'Вставьте текст...', lengthLabel: 'Длина', lengths: { short: 'Короткое', medium: 'Среднее', long: 'Длинное' }, summarize: 'Сжать', summarizing: 'Сжатие...', result: 'Резюме', copy: 'Копировать', copied: 'Скопировано!', original: 'Оригинал', summary: 'Резюме', reduction: 'Сокращение', chars: 'символов', emptyInput: 'Введите текст', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Text-Zusammenfassung', subtitle: 'Lange Texte zusammenfassen', credits: '2 Credits', textLabel: 'Text', textPlaceholder: 'Text einfügen...', lengthLabel: 'Länge', lengths: { short: 'Kurz', medium: 'Mittel', long: 'Lang' }, summarize: 'Zusammenfassen', summarizing: 'Wird zusammengefasst...', result: 'Zusammenfassung', copy: 'Kopieren', copied: 'Kopiert!', original: 'Original', summary: 'Zusammenfassung', reduction: 'Reduktion', chars: 'Zeichen', emptyInput: 'Text eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Résumeur de texte', subtitle: 'Résumez de longs textes', credits: '2 crédits', textLabel: 'Texte', textPlaceholder: 'Collez le texte...', lengthLabel: 'Longueur', lengths: { short: 'Court', medium: 'Moyen', long: 'Long' }, summarize: 'Résumer', summarizing: 'Résumé en cours...', result: 'Résumé', copy: 'Copier', copied: 'Copié!', original: 'Original', summary: 'Résumé', reduction: 'Réduction', chars: 'caractères', emptyInput: 'Entrez texte', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function SummarizePage() {
  const [text, setText] = useState('')
  const [length, setLength] = useState('medium')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleSummarize = async () => {
    if (!text.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/summarize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, length, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.summary); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = () => { navigator.clipboard.writeText(result?.summary || ''); setCopied(true); showToast(t.copied, 'success'); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">📄</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div><div className="flex justify-between mb-2"><label className="text-sm font-medium text-gray-300">{t.textLabel}</label><span className="text-xs text-gray-500">{text.length} {t.chars}</span></div><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.textPlaceholder} className="w-full h-48 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.lengthLabel}</label><select value={length} onChange={(e) => setLength(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.lengths).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
        </div>
        <button onClick={handleSummarize} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.summarizing}</>) : (<><span>📄</span>{t.summarize}</>)}</button>
        {result && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">{t.result}</h2><button onClick={handleCopy} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copied ? t.copied : t.copy}</button></div><div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700 mb-4"><p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{result.summary}</p></div><div className="grid grid-cols-3 gap-4"><div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-blue-400">{result.originalLength}</p><p className="text-xs text-gray-400">{t.original}</p></div><div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-purple-400">{result.summaryLength}</p><p className="text-xs text-gray-400">{t.summary}</p></div><div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-green-400">{result.reduction}</p><p className="text-xs text-gray-400">{t.reduction}</p></div></div></div>)}
      </main>
    </div>
  )
}
