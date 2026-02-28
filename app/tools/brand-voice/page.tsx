'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back', title: 'Brand Voice Analyzer', subtitle: 'Define and analyze your brand voice', credits: '2 Credits',
    brandLabel: 'Brand Name', brandPlaceholder: 'Your brand name',
    samplesLabel: 'Content Samples', samplesPlaceholder: 'Paste 2-3 examples of your brand content...',
    addSample: 'Add Another Sample', analyze: 'Analyze Brand Voice', analyzing: 'Analyzing...',
    results: 'Brand Voice Analysis', characteristics: 'Voice Characteristics', writingStyle: 'Writing Style',
    avgLength: 'Average Length', emojiUsage: 'Emoji Usage', hashtagUsage: 'Hashtag Usage',
    recommendations: 'Recommendations', samplesAnalyzed: 'Samples Analyzed',
    emptyInput: 'Please add content samples', success: 'Analysis complete!', error: 'Error occurred'
  },
  tr: {
    back: '← Geri', title: 'Marka Sesi Analizi', subtitle: 'Marka sesinizi tanımlayın ve analiz edin', credits: '2 Kredi',
    brandLabel: 'Marka Adı', brandPlaceholder: 'Marka adınız',
    samplesLabel: 'İçerik Örnekleri', samplesPlaceholder: 'Marka içeriklerinizden 2-3 örnek yapıştırın...',
    addSample: 'Başka Örnek Ekle', analyze: 'Marka Sesini Analiz Et', analyzing: 'Analiz ediliyor...',
    results: 'Marka Sesi Analizi', characteristics: 'Ses Özellikleri', writingStyle: 'Yazım Stili',
    avgLength: 'Ortalama Uzunluk', emojiUsage: 'Emoji Kullanımı', hashtagUsage: 'Hashtag Kullanımı',
    recommendations: 'Öneriler', samplesAnalyzed: 'Analiz Edilen Örnek',
    emptyInput: 'Lütfen içerik örnekleri ekleyin', success: 'Analiz tamamlandı!', error: 'Hata oluştu'
  },
  ru: { back: '← Назад', title: 'Анализ голоса бренда', subtitle: 'Определите голос вашего бренда', credits: '2 кредита', brandLabel: 'Название бренда', brandPlaceholder: 'Ваш бренд', samplesLabel: 'Примеры контента', samplesPlaceholder: 'Вставьте 2-3 примера...', addSample: 'Добавить пример', analyze: 'Анализировать', analyzing: 'Анализ...', results: 'Результаты', characteristics: 'Характеристики', writingStyle: 'Стиль', avgLength: 'Средняя длина', emojiUsage: 'Эмодзи', hashtagUsage: 'Хэштеги', recommendations: 'Рекомендации', samplesAnalyzed: 'Проанализировано', emptyInput: 'Добавьте примеры', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Markenstimme-Analyse', subtitle: 'Definieren Sie Ihre Markenstimme', credits: '2 Credits', brandLabel: 'Markenname', brandPlaceholder: 'Ihre Marke', samplesLabel: 'Inhaltsbeispiele', samplesPlaceholder: '2-3 Beispiele einfügen...', addSample: 'Beispiel hinzufügen', analyze: 'Analysieren', analyzing: 'Analyse...', results: 'Ergebnisse', characteristics: 'Eigenschaften', writingStyle: 'Schreibstil', avgLength: 'Durchschnittliche Länge', emojiUsage: 'Emoji-Nutzung', hashtagUsage: 'Hashtag-Nutzung', recommendations: 'Empfehlungen', samplesAnalyzed: 'Analysiert', emptyInput: 'Beispiele hinzufügen', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Analyse de voix de marque', subtitle: 'Définissez la voix de votre marque', credits: '2 crédits', brandLabel: 'Nom de marque', brandPlaceholder: 'Votre marque', samplesLabel: 'Exemples de contenu', samplesPlaceholder: 'Collez 2-3 exemples...', addSample: 'Ajouter un exemple', analyze: 'Analyser', analyzing: 'Analyse...', results: 'Résultats', characteristics: 'Caractéristiques', writingStyle: 'Style d\'écriture', avgLength: 'Longueur moyenne', emojiUsage: 'Utilisation d\'emoji', hashtagUsage: 'Utilisation de hashtag', recommendations: 'Recommandations', samplesAnalyzed: 'Analysés', emptyInput: 'Ajoutez des exemples', success: 'Terminé!', error: 'Erreur' }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' }, { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' }, { code: 'de', flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

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

  const addSample = () => setSamples([...samples, ''])
  const updateSample = (index: number, value: string) => {
    const newSamples = [...samples]; newSamples[index] = value; setSamples(newSamples)
  }
  const removeSample = (index: number) => {
    if (samples.length > 1) setSamples(samples.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    const validSamples = samples.filter(s => s.trim().length > 10)
    if (validSamples.length === 0) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/brand-voice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ samples: validSamples, brandName, userId, language }) })
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
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}
              </div>
            </div>
            <span className="text-3xl">🎯</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.brandLabel}</label>
            <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder={t.brandPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.samplesLabel}</label>
            {samples.map((sample, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <textarea value={sample} onChange={(e) => updateSample(index, e.target.value)} placeholder={t.samplesPlaceholder} className="flex-1 h-24 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
                {samples.length > 1 && <button onClick={() => removeSample(index)} className="px-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition">✕</button>}
              </div>
            ))}
            <button onClick={addSample} className="text-purple-400 text-sm hover:text-purple-300 transition">+ {t.addSample}</button>
          </div>
        </div>

        <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.analyzing}</>) : (<><span>🎯</span>{t.analyze}</>)}
        </button>

        {result && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">{result.brandName}</h2>
              <p className="text-gray-400">{t.samplesAnalyzed}: {result.samplesAnalyzed}</p>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>✨</span>{t.characteristics}</h3>
              <div className="flex flex-wrap gap-2">
                {result.voiceCharacteristics?.map((char: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full font-medium">{char}</span>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>📝</span>{t.writingStyle}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">{t.avgLength}</p>
                  <p className="font-bold text-purple-400">{result.writingStyle?.averageLength}</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">{t.emojiUsage}</p>
                  <p className="font-bold text-pink-400">{result.writingStyle?.emojiUsage}</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">{t.hashtagUsage}</p>
                  <p className="font-bold text-blue-400">{result.writingStyle?.hashtagUsage}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>💡</span>{t.recommendations}</h3>
              <ul className="space-y-2">
                {result.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300"><span className="text-purple-400">•</span>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
