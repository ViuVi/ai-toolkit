'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function SummarizePage() {
  const [inputText, setInputText] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const { t, language, setLanguage } = useLanguage()

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError(language === 'en' ? 'Please enter text to summarize' : 'Lütfen özetlenecek metin girin')
      return
    }

    setLoading(true)
    setError('')
    setSummary('')

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setSummary(data.summary)
      }
    } catch (err) {
      setError(t.common.error)
    }

    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exampleText = `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving".`

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
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 py-1 rounded text-xs transition ${
                  language === 'tr' ? 'bg-blue-600 text-white' : 'text-gray-400'
                }`}
              >
                TR
              </button>
            </div>
            
            <span className="text-2xl">📝</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-blue-400 text-sm">{t.tools.summarize.credits}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.tools.summarize.title}</h1>
          <p className="text-gray-400">{t.tools.summarize.description}</p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3">
            {t.tools.summarize.inputLabel}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-48 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none resize-none transition"
            placeholder={t.tools.summarize.inputPlaceholder}
          />
          
          {/* Example Button */}
          <button
            onClick={() => setInputText(exampleText)}
            className="mt-3 text-sm text-blue-400 hover:underline"
          >
            {language === 'en' ? '📌 Load example text' : '📌 Örnek metin yükle'}
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-6"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              {t.common.loading}
            </>
          ) : (
            <>
              ✨ {t.tools.summarize.button}
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
        {summary && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">{t.tools.summarize.resultLabel}</label>
              <button
                onClick={handleCopy}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition flex items-center gap-2"
              >
                {copied ? (
                  <>✓ {t.common.copied}</>
                ) : (
                  <>📋 {t.common.copy}</>
                )}
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-gray-200 leading-relaxed">{summary}</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 {language === 'en' ? 'Tips' : 'İpuçları'}
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• {language === 'en' ? 'This tool works best with English text' : 'Bu araç İngilizce metinlerle en iyi çalışır'}</li>
            <li>• {language === 'en' ? 'Longer texts produce better summaries' : 'Uzun metinler daha iyi özetler üretir'}</li>
            <li>• {language === 'en' ? 'Each summary uses 2 credits' : 'Her özet 2 kredi kullanır'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}