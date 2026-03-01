'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Brand Voice Analyzer', subtitle: 'Analyze and define your brand voice', credits: '2 Credits', brandLabel: 'Brand Name', brandPlaceholder: 'Your brand name', samplesLabel: 'Content Samples', samplePlaceholder: 'Paste sample content...', addSample: 'Add Sample', analyze: 'Analyze', analyzing: 'Analyzing...', voice: 'Voice Characteristics', style: 'Writing Style', recommendations: 'Recommendations', emptyInput: 'Fill fields', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Marka Sesi Analizi', subtitle: 'Marka sesinizi analiz edin ve tanımlayın', credits: '2 Kredi', brandLabel: 'Marka Adı', brandPlaceholder: 'Marka adınız', samplesLabel: 'İçerik Örnekleri', samplePlaceholder: 'Örnek içerik yapıştırın...', addSample: 'Örnek Ekle', analyze: 'Analiz Et', analyzing: 'Analiz ediliyor...', voice: 'Ses Karakteristikleri', style: 'Yazım Stili', recommendations: 'Öneriler', emptyInput: 'Alanları doldurun', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Голос бренда', subtitle: 'Анализируйте голос бренда', credits: '2 кредита', brandLabel: 'Бренд', brandPlaceholder: 'Название бренда', samplesLabel: 'Примеры', samplePlaceholder: 'Вставьте пример...', addSample: 'Добавить', analyze: 'Анализ', analyzing: 'Анализ...', voice: 'Характеристики', style: 'Стиль', recommendations: 'Рекомендации', emptyInput: 'Заполните поля', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Markenstimme', subtitle: 'Markenstimme analysieren', credits: '2 Credits', brandLabel: 'Marke', brandPlaceholder: 'Markenname', samplesLabel: 'Beispiele', samplePlaceholder: 'Beispiel einfügen...', addSample: 'Hinzufügen', analyze: 'Analysieren', analyzing: 'Analyse...', voice: 'Eigenschaften', style: 'Stil', recommendations: 'Empfehlungen', emptyInput: 'Felder ausfüllen', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Voix de marque', subtitle: 'Analysez votre voix de marque', credits: '2 crédits', brandLabel: 'Marque', brandPlaceholder: 'Nom de marque', samplesLabel: 'Exemples', samplePlaceholder: 'Collez exemple...', addSample: 'Ajouter', analyze: 'Analyser', analyzing: 'Analyse...', voice: 'Caractéristiques', style: 'Style', recommendations: 'Recommandations', emptyInput: 'Remplir champs', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function BrandVoicePage() {
  const [brandName, setBrandName] = useState('')
  const [samples, setSamples] = useState([''])
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleAnalyze = async () => {
    if (!brandName.trim() || !samples[0].trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/brand-voice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brandName, contentSamples: samples.filter(s => s.trim()), userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.analysis); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">🎯</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.brandLabel}</label><input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder={t.brandPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.samplesLabel}</label>{samples.map((s, i) => (<textarea key={i} value={s} onChange={(e) => { const arr = [...samples]; arr[i] = e.target.value; setSamples(arr) }} placeholder={t.samplePlaceholder} className="w-full h-24 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none mb-2" />))}<button onClick={() => setSamples([...samples, ''])} className="text-purple-400 text-sm hover:underline">+ {t.addSample}</button></div>
        </div>
        <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.analyzing}</>) : (<><span>🎯</span>{t.analyze}</>)}</button>
        {result && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h2 className="text-xl font-semibold mb-4">{t.voice}</h2><div className="flex flex-wrap gap-2">{result.voiceCharacteristics?.map((v: string, i: number) => (<span key={i} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full font-medium">{v}</span>))}</div></div>
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h2 className="text-xl font-semibold mb-4">{t.style}</h2><div className="grid grid-cols-3 gap-4">{result.writingStyle && Object.entries(result.writingStyle).map(([k, v]) => (<div key={k} className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-green-400">{v as string}</p><p className="text-xs text-gray-400 capitalize">{k}</p></div>))}</div></div>
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h2 className="text-xl font-semibold mb-4">{t.recommendations}</h2><ul className="space-y-2">{result.recommendations?.map((r: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm"><span className="text-green-400">•</span>{r}</li>))}</ul></div>
          </div>
        )}
      </main>
    </div>
  )
}
