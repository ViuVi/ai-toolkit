'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back to Dashboard',
    credits: 'FREE Credits',
    inputLabel: 'Enter your content',
    inputPlaceholder: 'Type or paste your content here...',
    generate: 'Generate',
    generating: 'Generating...',
    result: 'Result',
    copy: 'Copy',
    copied: 'Copied!',
    copyAll: 'Copy All',
    emptyInput: 'Please enter some content',
    success: 'Generated successfully!',
    error: 'An error occurred. Please try again.',
    loginRequired: 'Please login to use this tool'
  },
  tr: {
    back: '← Panele Dön',
    credits: 'FREE Kredi',
    inputLabel: 'İçeriğinizi girin',
    inputPlaceholder: 'İçeriğinizi buraya yazın veya yapıştırın...',
    generate: 'Oluştur',
    generating: 'Oluşturuluyor...',
    result: 'Sonuç',
    copy: 'Kopyala',
    copied: 'Kopyalandı!',
    copyAll: 'Tümünü Kopyala',
    emptyInput: 'Lütfen içerik girin',
    success: 'Başarıyla oluşturuldu!',
    error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    loginRequired: 'Bu aracı kullanmak için giriş yapın'
  },
  ru: {
    back: '← Назад к панели',
    credits: 'FREE кредитов',
    inputLabel: 'Введите ваш контент',
    inputPlaceholder: 'Введите или вставьте контент здесь...',
    generate: 'Создать',
    generating: 'Создание...',
    result: 'Результат',
    copy: 'Копировать',
    copied: 'Скопировано!',
    copyAll: 'Копировать все',
    emptyInput: 'Пожалуйста, введите контент',
    success: 'Успешно создано!',
    error: 'Произошла ошибка. Попробуйте снова.',
    loginRequired: 'Войдите, чтобы использовать этот инструмент'
  },
  de: {
    back: '← Zurück zum Dashboard',
    credits: 'FREE Credits',
    inputLabel: 'Geben Sie Ihren Inhalt ein',
    inputPlaceholder: 'Geben Sie Ihren Inhalt hier ein...',
    generate: 'Generieren',
    generating: 'Wird generiert...',
    result: 'Ergebnis',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    copyAll: 'Alles kopieren',
    emptyInput: 'Bitte geben Sie Inhalt ein',
    success: 'Erfolgreich generiert!',
    error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    loginRequired: 'Bitte melden Sie sich an'
  },
  fr: {
    back: '← Retour au tableau de bord',
    credits: 'FREE Crédits',
    inputLabel: 'Entrez votre contenu',
    inputPlaceholder: 'Tapez ou collez votre contenu ici...',
    generate: 'Générer',
    generating: 'Génération...',
    result: 'Résultat',
    copy: 'Copier',
    copied: 'Copié!',
    copyAll: 'Tout copier',
    emptyInput: 'Veuillez entrer du contenu',
    success: 'Généré avec succès!',
    error: 'Une erreur est survenue. Veuillez réessayer.',
    loginRequired: 'Connectez-vous pour utiliser cet outil'
  }
}

const toolNames: Record<Language, string> = {
  en: 'Post Scheduler',
  tr: 'Post Scheduler',
  ru: 'Post Scheduler',
  de: 'Post Scheduler',
  fr: 'Post Scheduler'
}

const langs: { code: Language; flag: string }[] = [
  { code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }
]

export default function ToolPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  const handleGenerate = async () => {
    if (!input.trim()) {
      showToast(t.emptyInput, 'warning')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/post-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setResult(data)
        showToast(t.success, 'success')
      }
    } catch (err) {
      showToast(t.error, 'error')
    }
    setLoading(false)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2))
    setCopied(true)
    showToast(t.copied, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <span>{t.back}</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-800 rounded-xl p-1 border border-gray-700">
                {langs.map((l) => (
                  <button key={l.code} onClick={() => setLanguage(l.code)} className={`px-2.5 py-1.5 rounded-lg text-sm transition ${language === l.code ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                    {l.flag}
                  </button>
                ))}
              </div>
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>⚡</span>
            <span>{t.credits}</span>
          </div>
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{toolNames[language]}</h1>
        </div>

        {/* Input */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t.inputLabel}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-40 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-none transition"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-pink-600 hover:from-green-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8 shadow-lg shadow-green-500/25"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {t.generating}
            </>
          ) : (
            <>
              <span>📅</span>
              {t.generate}
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t.result}</h2>
              <button 
                onClick={() => handleCopy(result)} 
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
              >
                {copied ? t.copied : t.copy}
              </button>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed overflow-x-auto">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
