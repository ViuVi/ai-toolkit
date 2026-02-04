'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function SentimentPage() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { t, language, setLanguage } = useLanguage()

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
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(t.common.error)
    }

    setLoading(false)
  }

  const exampleTexts = [
    {
      text: "This product is amazing! Best purchase I've ever made. Highly recommend to everyone!",
      label: language === 'en' ? '😊 Positive example' : '😊 Pozitif örnek'
    },
    {
      text: "Terrible experience. The product broke after one day. Very disappointed.",
      label: language === 'en' ? '😠 Negative example' : '😠 Negatif örnek'
    },
    {
      text: "It's okay. Nothing special but does the job. Average quality for the price.",
      label: language === 'en' ? '😐 Neutral example' : '😐 Nötr örnek'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{t.common.backToDashboard}</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs transition ${
                  language === 'en' ? 'bg-purple-600 text-white' : 'text-gray-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 py-1 rounded text-xs transition ${
                  language === 'tr' ? 'bg-purple-600 text-white' : 'text-gray-400'
                }`}
              >
                TR
              </button>
            </div>
            
            <span className="text-2xl">🎭</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-purple-400 text-sm">{t.tools.sentiment.credits}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.tools.sentiment.title}</h1>
          <p className="text-gray-400">{t.tools.sentiment.description}</p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3">
            {t.tools.sentiment.inputLabel}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-36 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none transition"
            placeholder={t.tools.sentiment.inputPlaceholder}
          />
          
          {/* Example Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            {exampleTexts.map((example, index) => (
              <button
                key={index}
                onClick={() => setInputText(example.text)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-6"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              {t.common.loading}
            </>
          ) : (
            <>
              🎭 {t.tools.sentiment.button}
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <label className="block text-sm font-medium mb-4">{t.tools.sentiment.resultLabel}</label>
            
            {/* Main Result */}
            <div className="bg-gray-900 rounded-xl p-8 text-center mb-6">
              <div className="text-7xl mb-4">{result.emoji}</div>
              <div className="text-3xl font-bold mb-2">{result.sentiment}</div>
              <div className="text-gray-400">
                {t.tools.sentiment.confidence}: 
                <span className={`font-semibold ml-2 ${
                  result.confidence >= 70 ? 'text-green-400' :
                  result.confidence >= 50 ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {result.confidence}%
                </span>
                <span className="text-sm ml-2">
                  {result.confidence >= 70 ? '(High)' :
                   result.confidence >= 50 ? '(Medium)' :
                   '(Low)'}
                </span>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-4">
                {language === 'en' ? 'Detailed Scores' : 'Detaylı Skorlar'}
              </p>
              <div className="space-y-3">
                {result.details?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm w-20 text-gray-400">{item.label}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${item.score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-14 text-right">
                      {Math.round(item.score * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Use Cases */}
        <div className="mt-8 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            💡 {language === 'en' ? 'Use Cases' : 'Kullanım Alanları'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <span className="text-xl">🛒</span>
              <span>{language === 'en' ? 'E-commerce product reviews' : 'E-ticaret ürün yorumları'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📱</span>
              <span>{language === 'en' ? 'Social media monitoring' : 'Sosyal medya takibi'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📧</span>
              <span>{language === 'en' ? 'Customer email analysis' : 'Müşteri email analizi'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <span>{language === 'en' ? 'Survey response analysis' : 'Anket yanıt analizi'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}