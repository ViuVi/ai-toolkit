'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back', title: 'Sentiment Analysis', subtitle: 'Analyze emotions in text and comments', credits: '3 Credits',
    textLabel: 'Text to Analyze', textPlaceholder: 'Paste comments, reviews, or any text to analyze sentiment...',
    analyze: 'Analyze Sentiment', analyzing: 'Analyzing...',
    result: 'Sentiment Analysis', sentiment: 'Sentiment', confidence: 'Confidence',
    emotions: 'Detected Emotions', wordCount: 'Words Analyzed',
    positive: 'Positive', negative: 'Negative', neutral: 'Neutral',
    emptyInput: 'Please enter text to analyze', success: 'Analysis complete!', error: 'Error occurred'
  },
  tr: {
    back: '← Geri', title: 'Duygu Analizi', subtitle: 'Metin ve yorumlardaki duyguları analiz edin', credits: '3 Kredi',
    textLabel: 'Analiz Edilecek Metin', textPlaceholder: 'Yorumları, değerlendirmeleri veya herhangi bir metni yapıştırın...',
    analyze: 'Duygu Analizi Yap', analyzing: 'Analiz ediliyor...',
    result: 'Duygu Analizi Sonucu', sentiment: 'Duygu Durumu', confidence: 'Güven Oranı',
    emotions: 'Tespit Edilen Duygular', wordCount: 'Analiz Edilen Kelime',
    positive: 'Pozitif', negative: 'Negatif', neutral: 'Nötr',
    emptyInput: 'Lütfen analiz edilecek metin girin', success: 'Analiz tamamlandı!', error: 'Hata oluştu'
  },
  ru: { back: '← Назад', title: 'Анализ настроений', subtitle: 'Анализируйте эмоции в тексте', credits: '3 кредита', textLabel: 'Текст для анализа', textPlaceholder: 'Вставьте текст...', analyze: 'Анализировать', analyzing: 'Анализ...', result: 'Результат', sentiment: 'Настроение', confidence: 'Уверенность', emotions: 'Эмоции', wordCount: 'Слов', positive: 'Позитивный', negative: 'Негативный', neutral: 'Нейтральный', emptyInput: 'Введите текст', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Stimmungsanalyse', subtitle: 'Analysieren Sie Emotionen in Texten', credits: '3 Credits', textLabel: 'Text zur Analyse', textPlaceholder: 'Text einfügen...', analyze: 'Analysieren', analyzing: 'Analyse...', result: 'Ergebnis', sentiment: 'Stimmung', confidence: 'Konfidenz', emotions: 'Emotionen', wordCount: 'Wörter', positive: 'Positiv', negative: 'Negativ', neutral: 'Neutral', emptyInput: 'Text eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Analyse de sentiment', subtitle: 'Analysez les émotions dans le texte', credits: '3 crédits', textLabel: 'Texte à analyser', textPlaceholder: 'Collez le texte...', analyze: 'Analyser', analyzing: 'Analyse...', result: 'Résultat', sentiment: 'Sentiment', confidence: 'Confiance', emotions: 'Émotions', wordCount: 'Mots', positive: 'Positif', negative: 'Négatif', neutral: 'Neutre', emptyInput: 'Entrez du texte', success: 'Terminé!', error: 'Erreur' }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' }, { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' }, { code: 'de', flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function SentimentPage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleAnalyze = async () => {
    if (!text.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/sentiment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.analysis); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'from-green-500 to-emerald-500'
    if (sentiment === 'negative') return 'from-red-500 to-pink-500'
    return 'from-gray-500 to-gray-600'
  }

  const getSentimentText = (sentiment: string) => {
    if (sentiment === 'positive') return t.positive
    if (sentiment === 'negative') return t.negative
    return t.neutral
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
            <span className="text-3xl">😊</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">{t.textLabel}</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.textPlaceholder} className="w-full h-40 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
        </div>

        <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.analyzing}</>) : (<><span>😊</span>{t.analyze}</>)}
        </button>

        {result && (
          <div className="space-y-6">
            <div className={`bg-gradient-to-r ${getSentimentColor(result.sentiment)} rounded-2xl p-8 text-center`}>
              <p className="text-8xl mb-4">{result.emoji}</p>
              <p className="text-3xl font-bold text-white mb-2">{getSentimentText(result.sentiment)}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-white/80">{t.confidence}:</span>
                <span className="font-bold text-white">{result.confidence}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 text-center">
                <p className="text-4xl font-bold text-purple-400">{result.score}</p>
                <p className="text-sm text-gray-400">{t.sentiment} Score</p>
              </div>
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 text-center">
                <p className="text-4xl font-bold text-blue-400">{result.wordCount}</p>
                <p className="text-sm text-gray-400">{t.wordCount}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>💭</span>{t.emotions}</h3>
              <div className="flex flex-wrap gap-2">
                {result.emotions?.map((emotion: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full font-medium">{emotion}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
