'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Sentiment Analysis', subtitle: 'Analyze the sentiment of any text', credits: '3 Credits', textLabel: 'Text to Analyze', textPlaceholder: 'Enter text to analyze sentiment...', analyze: 'Analyze', analyzing: 'Analyzing...', sentiment: 'Sentiment', score: 'Score', words: 'words', emotions: 'Detected Emotions', positive: 'Positive', negative: 'Negative', neutral: 'Neutral', emptyInput: 'Enter text', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Duygu Analizi', subtitle: 'Metinlerin duygusunu analiz edin', credits: '3 Kredi', textLabel: 'Analiz Edilecek Metin', textPlaceholder: 'Duygu analizi için metin girin...', analyze: 'Analiz Et', analyzing: 'Analiz ediliyor...', sentiment: 'Duygu', score: 'Skor', words: 'kelime', emotions: 'Tespit Edilen Duygular', positive: 'Pozitif', negative: 'Negatif', neutral: 'Nötr', emptyInput: 'Metin girin', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Анализ тональности', subtitle: 'Анализируйте тональность текста', credits: '3 кредита', textLabel: 'Текст', textPlaceholder: 'Введите текст...', analyze: 'Анализ', analyzing: 'Анализ...', sentiment: 'Тональность', score: 'Рейтинг', words: 'слов', emotions: 'Эмоции', positive: 'Позитивный', negative: 'Негативный', neutral: 'Нейтральный', emptyInput: 'Введите текст', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Stimmungsanalyse', subtitle: 'Stimmung von Texten analysieren', credits: '3 Credits', textLabel: 'Text', textPlaceholder: 'Text eingeben...', analyze: 'Analysieren', analyzing: 'Analyse...', sentiment: 'Stimmung', score: 'Score', words: 'Wörter', emotions: 'Emotionen', positive: 'Positiv', negative: 'Negativ', neutral: 'Neutral', emptyInput: 'Text eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Analyse de sentiment', subtitle: 'Analysez le sentiment des textes', credits: '3 crédits', textLabel: 'Texte', textPlaceholder: 'Entrez le texte...', analyze: 'Analyser', analyzing: 'Analyse...', sentiment: 'Sentiment', score: 'Score', words: 'mots', emotions: 'Émotions', positive: 'Positif', negative: 'Négatif', neutral: 'Neutre', emptyInput: 'Entrez texte', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]
const sentimentEmojis: Record<string, string> = { positive: '😊', negative: '😔', neutral: '😐' }

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

  const getSentimentColor = (s: string) => s === 'positive' ? 'from-green-500 to-emerald-500' : s === 'negative' ? 'from-red-500 to-pink-500' : 'from-gray-500 to-gray-600'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">💭</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">{t.textLabel}</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.textPlaceholder} className="w-full h-40 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
          <p className="text-xs text-gray-500 mt-1">{text.split(/\s+/).filter(Boolean).length} {t.words}</p>
        </div>
        <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.analyzing}</>) : (<><span>💭</span>{t.analyze}</>)}</button>
        {result && (
          <div className="space-y-6">
            <div className={`bg-gradient-to-r ${getSentimentColor(result.sentiment)} rounded-2xl p-8 text-center`}>
              <span className="text-6xl mb-4 block">{sentimentEmojis[result.sentiment] || '😐'}</span>
              <h2 className="text-2xl font-bold text-white capitalize">{(t as any)[result.sentiment] || result.sentiment}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-purple-400">{result.score}</p><p className="text-xs text-gray-400">{t.score}</p></div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-blue-400">{result.wordCount}</p><p className="text-xs text-gray-400">{t.words}</p></div>
            </div>
            {result.emotions && result.emotions.length > 0 && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h2 className="text-xl font-semibold mb-4">{t.emotions}</h2><div className="flex flex-wrap gap-2">{result.emotions.map((e: string, i: number) => (<span key={i} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full font-medium">{e}</span>))}</div></div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
