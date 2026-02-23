'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { supabase } from '@/lib/supabase'

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'ru', label: 'RU' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' }
]

export default function SentimentPage() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const { t, language, setLanguage } = useLanguage()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError(language === 'en' ? 'Please enter text to analyze' : 'Lütfen analiz edilecek metin girin')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, userId }),
      })

      const data = await response.json()

      if (data.error) {
        if (data.error === 'Insufficient credits') {
          setError(
            language === 'tr'
              ? 'Yeterli kredi yok!'
              : language === 'ru'
              ? 'Недостаточно кредитов!'
              : language === 'de'
              ? 'Nicht genügend Guthaben!'
              : language === 'fr'
              ? 'Crédits insuffisants !'
              : 'Not enough credits!'
          )
        } else {
          setError(data.error)
        }
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(
        language === 'tr'
          ? 'Hata oluştu'
          : language === 'ru'
          ? 'Произошла ошибка'
          : language === 'de'
          ? 'Ein Fehler ist aufgetreten'
          : language === 'fr'
          ? 'Une erreur est survenue'
          : 'An error occurred'
      )
    }

    setLoading(false)
  }

  const exampleTexts = [
    { text: "This product is amazing! Best purchase ever!", label: language === 'en' ? '😊 Positive' : '😊 Pozitif' },
    { text: "Terrible experience. Very disappointed.", label: language === 'en' ? '😠 Negative' : '😠 Negatif' },
    { text: "It's okay. Nothing special.", label: language === 'en' ? '😐 Neutral' : '😐 Nötr' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>
              {language === 'tr'
                ? 'Panele Dön'
                : language === 'ru'
                ? 'Назад к панели'
                : language === 'de'
                ? 'Zurück zum Dashboard'
                : language === 'fr'
                ? 'Retour au tableau de bord'
                : 'Back to Dashboard'}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded text-xs transition ${
                    language === lang.code ? 'bg-purple-600 text-white' : 'text-gray-400'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <span className="text-2xl">🎭</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-purple-400 text-sm">{(language === 'tr' ? '2 Kredi' : '2 Credits')}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{(language === 'tr' ? 'Duygu Analizi' : 'Sentiment Analysis')}</h1>
          <p className="text-gray-400">{(language === 'tr' ? 'Metninizin duygusunu analiz edin' : 'Analyze the sentiment of your text')}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3">{(language === 'tr' ? 'Metin' : 'Text')}</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-36 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none transition"
            placeholder={(language === 'tr' ? 'Metninizi girin...' : 'Enter your text...')}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {exampleTexts.map((ex, i) => (
              <button key={i} onClick={() => setInputText(ex.text)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition">
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-6"
        >
          {loading ? <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</> : <>🎭 {(language === 'tr' ? 'Analiz Et' : 'Analyze')}</>}
        </button>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6">{error}</div>}

        {result && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <div className="bg-gray-900 rounded-xl p-8 text-center mb-6">
              <div className="text-7xl mb-4">{result.emoji}</div>
              <div className="text-3xl font-bold mb-2">{result.sentiment}</div>
              <div className="text-gray-400">
                {(language === 'tr' ? 'Güven' : 'Confidence')}: <span className={`font-semibold ml-2 ${result.confidence >= 70 ? 'text-green-400' : result.confidence >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>{result.confidence}%</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-4">{language === 'en' ? 'Detailed Scores' : 'Detaylı Skorlar'}</p>
              <div className="space-y-3">
                {result.details?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm w-20 text-gray-400">{item.label}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${item.score * 100}%` }} />
                    </div>
                    <span className="text-sm text-gray-400 w-14 text-right">{Math.round(item.score * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}