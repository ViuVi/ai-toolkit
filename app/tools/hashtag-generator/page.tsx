'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Hashtag Generator', subtitle: 'Generate trending hashtags for maximum reach', credits: 'FREE', topicLabel: 'Topic', topicPlaceholder: 'Enter your topic...', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X' }, countLabel: 'Count', generate: 'Generate', generating: 'Finding...', results: 'Hashtags', copyAll: 'Copy All', copied: 'Copied!', emptyInput: 'Enter topic', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Hashtag Üretici', subtitle: 'Maksimum erişim için trend hashtagler', credits: 'ÜCRETSİZ', topicLabel: 'Konu', topicPlaceholder: 'Konu girin...', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X' }, countLabel: 'Adet', generate: 'Oluştur', generating: 'Bulunuyor...', results: 'Hashtagler', copyAll: 'Kopyala', copied: 'Kopyalandı!', emptyInput: 'Konu girin', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Генератор хэштегов', subtitle: 'Трендовые хэштеги', credits: 'БЕСПЛАТНО', topicLabel: 'Тема', topicPlaceholder: 'Введите тему...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X' }, countLabel: 'Кол-во', generate: 'Создать', generating: 'Поиск...', results: 'Хэштеги', copyAll: 'Копировать', copied: 'Скопировано!', emptyInput: 'Введите тему', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Hashtag-Generator', subtitle: 'Trend-Hashtags für Reichweite', credits: 'KOSTENLOS', topicLabel: 'Thema', topicPlaceholder: 'Thema eingeben...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X' }, countLabel: 'Anzahl', generate: 'Erstellen', generating: 'Suche...', results: 'Hashtags', copyAll: 'Kopieren', copied: 'Kopiert!', emptyInput: 'Thema eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Générateur de hashtags', subtitle: 'Hashtags tendance', credits: 'GRATUIT', topicLabel: 'Sujet', topicPlaceholder: 'Entrez sujet...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X' }, countLabel: 'Nombre', generate: 'Créer', generating: 'Recherche...', results: 'Hashtags', copyAll: 'Copier', copied: 'Copié!', emptyInput: 'Entrez sujet', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function HashtagGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [count, setCount] = useState(20)
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  const handleGenerate = async () => {
    if (!topic.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult([])
    try {
      const res = await fetch('/api/hashtag-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, count, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.hashtags); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopyAll = () => { navigator.clipboard.writeText(result.map(h => h.tag).join(' ')); setCopied(true); showToast(t.copied, 'success'); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">#️⃣</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.topicLabel}</label><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.countLabel}</label><select value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{[10,15,20,30].map(n => (<option key={n} value={n}>{n}</option>))}</select></div></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>#️⃣</span>{t.generate}</>)}</button>
        {result.length > 0 && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">{t.results}</h2><button onClick={handleCopyAll} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copied ? t.copied : t.copyAll}</button></div><div className="flex flex-wrap gap-2">{result.map((h, i) => (<span key={i} className="bg-gray-900/50 rounded-xl px-4 py-2 border border-gray-700 text-purple-400 font-medium">{h.tag}</span>))}</div></div>)}
      </main>
    </div>
  )
}
