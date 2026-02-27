'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back to Dashboard',
    title: 'Hook Generator',
    subtitle: 'Create scroll-stopping hooks that grab attention instantly',
    credits: '2 Credits',
    inputLabel: 'What\'s your topic or content theme?',
    inputPlaceholder: 'e.g., productivity tips, fitness motivation, cooking hacks, tech reviews...',
    generate: 'Generate 5 Hooks',
    generating: 'Creating your hooks...',
    result: 'Your Hooks',
    copy: 'Copy',
    copied: 'Copied!',
    copyAll: 'Copy All',
    hookTypes: { question: 'Question', statement: 'Bold Statement', statistic: 'Statistic', story: 'Story Hook', controversial: 'Controversial' },
    emptyInput: 'Please enter a topic first',
    success: 'Hooks generated successfully!',
    error: 'Something went wrong. Please try again.',
    whyWorks: 'Why it works'
  },
  tr: {
    back: '← Panele Dön',
    title: 'Hook Üretici',
    subtitle: 'Kaydırmayı durduran, anında dikkat çeken hooklar oluşturun',
    credits: '2 Kredi',
    inputLabel: 'Konunuz veya içerik temanız nedir?',
    inputPlaceholder: 'örn: verimlilik ipuçları, fitness motivasyonu, yemek hileleri, teknoloji incelemeleri...',
    generate: '5 Hook Oluştur',
    generating: 'Hooklar oluşturuluyor...',
    result: 'Hooklarınız',
    copy: 'Kopyala',
    copied: 'Kopyalandı!',
    copyAll: 'Tümünü Kopyala',
    hookTypes: { question: 'Soru', statement: 'Cesur İfade', statistic: 'İstatistik', story: 'Hikaye', controversial: 'Tartışmalı' },
    emptyInput: 'Lütfen önce bir konu girin',
    success: 'Hooklar başarıyla oluşturuldu!',
    error: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
    whyWorks: 'Neden işe yarar'
  },
  ru: {
    back: '← Назад к панели',
    title: 'Генератор хуков',
    subtitle: 'Создавайте хуки, которые мгновенно привлекают внимание',
    credits: '2 кредита',
    inputLabel: 'Какая ваша тема или тема контента?',
    inputPlaceholder: 'например: советы по продуктивности, фитнес-мотивация...',
    generate: 'Создать 5 хуков',
    generating: 'Создаём хуки...',
    result: 'Ваши хуки',
    copy: 'Копировать',
    copied: 'Скопировано!',
    copyAll: 'Копировать все',
    hookTypes: { question: 'Вопрос', statement: 'Утверждение', statistic: 'Статистика', story: 'История', controversial: 'Спорный' },
    emptyInput: 'Сначала введите тему',
    success: 'Хуки успешно созданы!',
    error: 'Что-то пошло не так. Попробуйте снова.',
    whyWorks: 'Почему это работает'
  },
  de: {
    back: '← Zurück zum Dashboard',
    title: 'Hook-Generator',
    subtitle: 'Erstellen Sie Hooks, die sofort Aufmerksamkeit erregen',
    credits: '2 Credits',
    inputLabel: 'Was ist Ihr Thema?',
    inputPlaceholder: 'z.B.: Produktivitätstipps, Fitness-Motivation...',
    generate: '5 Hooks generieren',
    generating: 'Hooks werden erstellt...',
    result: 'Ihre Hooks',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    copyAll: 'Alle kopieren',
    hookTypes: { question: 'Frage', statement: 'Aussage', statistic: 'Statistik', story: 'Geschichte', controversial: 'Kontrovers' },
    emptyInput: 'Bitte geben Sie zuerst ein Thema ein',
    success: 'Hooks erfolgreich generiert!',
    error: 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.',
    whyWorks: 'Warum es funktioniert'
  },
  fr: {
    back: '← Retour au tableau de bord',
    title: 'Générateur de Hooks',
    subtitle: 'Créez des hooks qui captent l\'attention instantanément',
    credits: '2 Crédits',
    inputLabel: 'Quel est votre sujet ou thème de contenu?',
    inputPlaceholder: 'ex: conseils de productivité, motivation fitness...',
    generate: 'Générer 5 Hooks',
    generating: 'Création des hooks...',
    result: 'Vos Hooks',
    copy: 'Copier',
    copied: 'Copié!',
    copyAll: 'Tout copier',
    hookTypes: { question: 'Question', statement: 'Déclaration', statistic: 'Statistique', story: 'Histoire', controversial: 'Controversé' },
    emptyInput: 'Veuillez d\'abord entrer un sujet',
    success: 'Hooks générés avec succès!',
    error: 'Quelque chose s\'est mal passé. Veuillez réessayer.',
    whyWorks: 'Pourquoi ça marche'
  }
}

const langs: { code: Language; flag: string }[] = [
  { code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }
]

export default function HookGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [hooks, setHooks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState<number | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast(t.emptyInput, 'warning')
      return
    }

    setLoading(true)
    setHooks([])

    try {
      const response = await fetch('/api/hook-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setHooks(data.hooks || [])
        showToast(t.success, 'success')
      }
    } catch (err) {
      showToast(t.error, 'error')
    }
    setLoading(false)
  }

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    showToast(t.copied, 'success')
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyAll = () => {
    const allHooks = hooks.map(h => h.text).join('\n\n')
    navigator.clipboard.writeText(allHooks)
    showToast(t.copied, 'success')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-800 rounded-xl p-1 border border-gray-700">
                {langs.map((l) => (
                  <button key={l.code} onClick={() => setLanguage(l.code)} className={`px-2.5 py-1.5 rounded-lg text-sm transition ${language === l.code ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                    {l.flag}
                  </button>
                ))}
              </div>
              <span className="text-2xl">🎣</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>⚡</span>
            <span>{t.credits}</span>
          </div>
          <div className="text-5xl mb-4">🎣</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        {/* Input */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t.inputLabel}</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 resize-none transition"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold text-lg text-black transition flex items-center justify-center gap-3 mb-8 shadow-lg shadow-yellow-500/25"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              {t.generating}
            </>
          ) : (
            <>
              <span>🎣</span>
              {t.generate}
            </>
          )}
        </button>

        {/* Results */}
        {hooks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t.result}</h2>
              <button onClick={handleCopyAll} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition">
                {t.copyAll}
              </button>
            </div>

            {hooks.map((hook, index) => (
              <div key={index} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-5 hover:border-yellow-500/50 transition group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{hook.emoji || '💡'}</span>
                      <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-lg font-medium">
                        {t.hookTypes[hook.type as keyof typeof t.hookTypes] || hook.type}
                      </span>
                    </div>
                    <p className="text-lg text-white mb-3 leading-relaxed">"{hook.text}"</p>
                    {hook.reason && (
                      <p className="text-sm text-gray-400">
                        <span className="text-yellow-400 font-medium">{t.whyWorks}:</span> {hook.reason}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(index, hook.text)}
                    className={`p-3 rounded-xl transition shrink-0 ${copied === index ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-yellow-600 text-white'}`}
                  >
                    {copied === index ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
