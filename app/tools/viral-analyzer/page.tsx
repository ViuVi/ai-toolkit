'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const getTexts = (lang: string) => {
  const data: any = {
    tr: {
      title: 'Viral Analyzer',
      icon: '🔥',
      credits: '5 Kredi',
      back: '← Dashboard\'a Dön',
      testMode: '🧪 Test Modu - Kredi düşmüyor',
      
      // Tool açıklaması
      purpose: 'Bu araç ne işe yarar?',
      purposeDesc: 'İçeriğinin viral potansiyelini 0-100 arasında puanlayarak analiz eder. Hook gücü, duygusal tetikleyiciler, paylaşılabilirlik ve trend uyumu gibi faktörleri değerlendirir.',
      howTo: 'Nasıl kullanılır?',
      howToSteps: [
        'Analiz etmek istediğin içeriği (caption, video script vb.) yapıştır',
        'Hedef platformunu seç (Instagram, TikTok, Twitter vb.)',
        'İsteğe bağlı olarak nişini belirt',
        '"Analiz Et" butonuna tıkla ve sonuçları incele'
      ],
      
      // Form
      contentLabel: 'İçerik',
      contentPlaceholder: 'Analiz etmek istediğin içeriği buraya yapıştır...',
      platformLabel: 'Platform',
      nicheLabel: 'Niş (opsiyonel)',
      nichePlaceholder: 'örn: fitness, teknoloji, moda...',
      analyzeBtn: 'Analiz Et',
      analyzing: 'Analiz ediliyor...',
      
      // Results
      viralScore: 'Viral Skoru',
      strengths: '💪 Güçlü Yönler',
      weaknesses: '⚠️ Zayıf Yönler',
      improvements: '🚀 İyileştirme Önerileri',
      copyResult: 'Sonucu Kopyala',
      copied: 'Kopyalandı!'
    },
    en: {
      title: 'Viral Analyzer',
      icon: '🔥',
      credits: '5 Credits',
      back: '← Back to Dashboard',
      testMode: '🧪 Test Mode - No credits deducted',
      
      purpose: 'What does this tool do?',
      purposeDesc: 'Analyzes your content\'s viral potential with a score from 0-100. Evaluates factors like hook strength, emotional triggers, shareability, and trend alignment.',
      howTo: 'How to use?',
      howToSteps: [
        'Paste the content you want to analyze (caption, video script, etc.)',
        'Select your target platform (Instagram, TikTok, Twitter, etc.)',
        'Optionally specify your niche',
        'Click "Analyze" and review the results'
      ],
      
      contentLabel: 'Content',
      contentPlaceholder: 'Paste the content you want to analyze here...',
      platformLabel: 'Platform',
      nicheLabel: 'Niche (optional)',
      nichePlaceholder: 'e.g., fitness, tech, fashion...',
      analyzeBtn: 'Analyze',
      analyzing: 'Analyzing...',
      
      viralScore: 'Viral Score',
      strengths: '💪 Strengths',
      weaknesses: '⚠️ Weaknesses',
      improvements: '🚀 Improvement Suggestions',
      copyResult: 'Copy Result',
      copied: 'Copied!'
    },
    ru: {
      title: 'Viral Analyzer',
      icon: '🔥',
      credits: '5 Кредитов',
      back: '← Назад',
      testMode: '🧪 Тест режим - Кредиты не списываются',
      
      purpose: 'Что делает этот инструмент?',
      purposeDesc: 'Анализирует вирусный потенциал вашего контента с оценкой от 0 до 100.',
      howTo: 'Как использовать?',
      howToSteps: [
        'Вставьте контент для анализа',
        'Выберите платформу',
        'Укажите нишу (опционально)',
        'Нажмите "Анализировать"'
      ],
      
      contentLabel: 'Контент',
      contentPlaceholder: 'Вставьте контент здесь...',
      platformLabel: 'Платформа',
      nicheLabel: 'Ниша (опционально)',
      nichePlaceholder: 'напр., фитнес, технологии...',
      analyzeBtn: 'Анализировать',
      analyzing: 'Анализируем...',
      
      viralScore: 'Вирусный рейтинг',
      strengths: '💪 Сильные стороны',
      weaknesses: '⚠️ Слабые стороны',
      improvements: '🚀 Рекомендации',
      copyResult: 'Копировать',
      copied: 'Скопировано!'
    },
    de: {
      title: 'Viral Analyzer',
      icon: '🔥',
      credits: '5 Credits',
      back: '← Zurück',
      testMode: '🧪 Testmodus - Keine Credits abgezogen',
      
      purpose: 'Was macht dieses Tool?',
      purposeDesc: 'Analysiert das virale Potenzial deines Inhalts mit einem Score von 0-100.',
      howTo: 'Wie benutzt man es?',
      howToSteps: [
        'Füge den zu analysierenden Inhalt ein',
        'Wähle deine Plattform',
        'Gib optional deine Nische an',
        'Klicke auf "Analysieren"'
      ],
      
      contentLabel: 'Inhalt',
      contentPlaceholder: 'Füge deinen Inhalt hier ein...',
      platformLabel: 'Plattform',
      nicheLabel: 'Nische (optional)',
      nichePlaceholder: 'z.B. Fitness, Tech, Mode...',
      analyzeBtn: 'Analysieren',
      analyzing: 'Analysiere...',
      
      viralScore: 'Viral Score',
      strengths: '💪 Stärken',
      weaknesses: '⚠️ Schwächen',
      improvements: '🚀 Verbesserungsvorschläge',
      copyResult: 'Kopieren',
      copied: 'Kopiert!'
    },
    fr: {
      title: 'Viral Analyzer',
      icon: '🔥',
      credits: '5 Crédits',
      back: '← Retour',
      testMode: '🧪 Mode Test - Crédits non déduits',
      
      purpose: 'Que fait cet outil?',
      purposeDesc: 'Analyse le potentiel viral de votre contenu avec un score de 0 à 100.',
      howTo: 'Comment l\'utiliser?',
      howToSteps: [
        'Collez le contenu à analyser',
        'Sélectionnez votre plateforme',
        'Spécifiez votre niche (optionnel)',
        'Cliquez sur "Analyser"'
      ],
      
      contentLabel: 'Contenu',
      contentPlaceholder: 'Collez votre contenu ici...',
      platformLabel: 'Plateforme',
      nicheLabel: 'Niche (optionnel)',
      nichePlaceholder: 'ex: fitness, tech, mode...',
      analyzeBtn: 'Analyser',
      analyzing: 'Analyse en cours...',
      
      viralScore: 'Score Viral',
      strengths: '💪 Points Forts',
      weaknesses: '⚠️ Points Faibles',
      improvements: '🚀 Suggestions',
      copyResult: 'Copier',
      copied: 'Copié!'
    }
  }
  return data[lang] || data.en
}

export default function ViralAnalyzerPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [niche, setNiche] = useState('')
  
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = getTexts(language)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
  }

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError(language === 'tr' ? 'İçerik gerekli' : 'Content is required')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/viral-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platform,
          niche,
          userId: user?.id,
          language
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setResult(data.result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                {t.back}
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <h1 className="text-xl font-bold">{t.title}</h1>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                  {t.credits}
                </span>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/80 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition border border-gray-700">
                <span>🌐</span>
                <span>{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {['en', 'tr', 'ru', 'de', 'fr'].map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => setLanguage(lang as any)} 
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition ${language === lang ? 'text-purple-400' : 'text-gray-300'}`}
                  >
                    {lang === 'en' && '🇺🇸 English'}
                    {lang === 'tr' && '🇹🇷 Türkçe'}
                    {lang === 'ru' && '🇷🇺 Русский'}
                    {lang === 'de' && '🇩🇪 Deutsch'}
                    {lang === 'fr' && '🇫🇷 Français'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Test Mode Banner */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-green-500/10 border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 py-2 text-center text-green-400 text-sm">
          {t.testMode}
        </div>
      </div>

      {/* Main */}
      <main className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sol: Form */}
            <div className="space-y-6">
              {/* Açıklama Kutusu */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-2">{t.purpose}</h2>
                <p className="text-gray-400 text-sm mb-4">{t.purposeDesc}</p>
                
                <h3 className="text-md font-semibold text-white mb-2">{t.howTo}</h3>
                <ol className="text-gray-500 text-sm space-y-1 list-decimal list-inside">
                  {t.howToSteps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Form */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={t.contentPlaceholder}
                      className="w-full h-40 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="youtube">YouTube</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                    <input
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder={t.nichePlaceholder}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? t.analyzing : `${t.icon} ${t.analyzeBtn}`}
                  </button>
                </div>
              </div>
            </div>

            {/* Sağ: Sonuçlar */}
            <div>
              {result ? (
                <div className="space-y-4">
                  {/* Skor */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(result.score || 0)}`}>
                      {result.score || 0}
                    </div>
                    <div className="text-gray-400 mt-2">{t.viralScore}</div>
                    <div className="text-white font-medium mt-1">{result.verdict || ''}</div>
                  </div>

                  {/* Breakdown */}
                  {result.breakdown && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                      <div className="space-y-3">
                        {Object.entries(result.breakdown).map(([key, value]: [string, any]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                              <span className={getScoreColor(value?.score || 0)}>{value?.score || 0}/100</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                style={{ width: `${value?.score || 0}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {result.strengths?.length > 0 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <h4 className="text-green-400 font-medium mb-2">{t.strengths}</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {result.strengths.map((s: string, i: number) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {result.weaknesses?.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <h4 className="text-red-400 font-medium mb-2">{t.weaknesses}</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {result.weaknesses.map((w: string, i: number) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {result.improvements?.length > 0 && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">{t.improvements}</h3>
                      <div className="space-y-3">
                        {result.improvements.map((imp: any, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-xl">
                            <span className={`px-2 py-1 rounded text-xs ${
                              imp.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              imp.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {imp.priority}
                            </span>
                            <div>
                              <div className="text-white text-sm">{imp.suggestion}</div>
                              <div className="text-purple-400 text-xs mt-1">{imp.impact}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="w-full py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 transition"
                  >
                    {copied ? t.copied : t.copyResult}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4">{t.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t.title}</h3>
                  <p className="text-gray-500">{t.purposeDesc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
