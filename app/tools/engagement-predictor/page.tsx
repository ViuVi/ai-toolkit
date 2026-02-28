'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back', title: 'Engagement Predictor', subtitle: 'Predict how your content will perform', credits: '5 Credits',
    contentLabel: 'Your Content', contentPlaceholder: 'Paste your caption or content here...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' },
    predict: 'Predict Engagement', predicting: 'Predicting...',
    results: 'Prediction Results', overallScore: 'Overall Score', predictions: 'Estimated Metrics',
    likes: 'Likes', comments: 'Comments', shares: 'Shares', factors: 'Impact Factors',
    bestTime: 'Best Time to Post', tips: 'Tips to Improve',
    emptyInput: 'Please enter content', success: 'Prediction ready!', error: 'Error occurred'
  },
  tr: {
    back: '← Geri', title: 'Etkileşim Tahmini', subtitle: 'İçeriğinizin performansını tahmin edin', credits: '5 Kredi',
    contentLabel: 'İçeriğiniz', contentPlaceholder: 'Caption veya içeriğinizi buraya yapıştırın...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' },
    predict: 'Etkileşimi Tahmin Et', predicting: 'Tahmin ediliyor...',
    results: 'Tahmin Sonuçları', overallScore: 'Genel Skor', predictions: 'Tahmini Metrikler',
    likes: 'Beğeni', comments: 'Yorum', shares: 'Paylaşım', factors: 'Etki Faktörleri',
    bestTime: 'En İyi Paylaşım Saati', tips: 'İyileştirme İpuçları',
    emptyInput: 'Lütfen içerik girin', success: 'Tahmin hazır!', error: 'Hata oluştu'
  },
  ru: { back: '← Назад', title: 'Прогноз вовлеченности', subtitle: 'Прогнозируйте успех контента', credits: '5 кредитов', contentLabel: 'Ваш контент', contentPlaceholder: 'Вставьте контент...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, predict: 'Прогнозировать', predicting: 'Прогноз...', results: 'Результаты', overallScore: 'Общий балл', predictions: 'Метрики', likes: 'Лайки', comments: 'Комментарии', shares: 'Репосты', factors: 'Факторы', bestTime: 'Лучшее время', tips: 'Советы', emptyInput: 'Введите контент', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Engagement-Vorhersage', subtitle: 'Sagen Sie Content-Erfolg voraus', credits: '5 Credits', contentLabel: 'Ihr Inhalt', contentPlaceholder: 'Inhalt einfügen...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, predict: 'Vorhersagen', predicting: 'Vorhersage...', results: 'Ergebnisse', overallScore: 'Gesamtscore', predictions: 'Metriken', likes: 'Likes', comments: 'Kommentare', shares: 'Shares', factors: 'Faktoren', bestTime: 'Beste Zeit', tips: 'Tipps', emptyInput: 'Inhalt eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Prédiction d\'engagement', subtitle: 'Prédisez le succès de votre contenu', credits: '5 crédits', contentLabel: 'Votre contenu', contentPlaceholder: 'Collez votre contenu...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, predict: 'Prédire', predicting: 'Prédiction...', results: 'Résultats', overallScore: 'Score global', predictions: 'Métriques', likes: 'Likes', comments: 'Commentaires', shares: 'Partages', factors: 'Facteurs', bestTime: 'Meilleur moment', tips: 'Conseils', emptyInput: 'Entrez du contenu', success: 'Terminé!', error: 'Erreur' }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' }, { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' }, { code: 'de', flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function EngagementPredictorPage() {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handlePredict = async () => {
    if (!content.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/engagement-predictor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platform, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.prediction); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const getScoreColor = (score: number) => score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'

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
            <span className="text-3xl">📈</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.contentLabel}</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
              {Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
            </select>
          </div>
        </div>

        <button onClick={handlePredict} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.predicting}</>) : (<><span>📈</span>{t.predict}</>)}
        </button>

        {result && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6 text-center">
              <h2 className="text-lg text-gray-400 mb-2">{t.overallScore}</h2>
              <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}</div>
              <p className="text-2xl mt-2">{result.rating || ''}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 text-center">
                <p className="text-3xl mb-1">❤️</p>
                <p className="text-xl font-bold text-pink-400">{result.predictions?.likes}</p>
                <p className="text-xs text-gray-400">{t.likes}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 text-center">
                <p className="text-3xl mb-1">💬</p>
                <p className="text-xl font-bold text-blue-400">{result.predictions?.comments}</p>
                <p className="text-xs text-gray-400">{t.comments}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 text-center">
                <p className="text-3xl mb-1">🔄</p>
                <p className="text-xl font-bold text-green-400">{result.predictions?.shares}</p>
                <p className="text-xs text-gray-400">{t.shares}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>📊</span>{t.factors}</h3>
              <div className="grid grid-cols-2 gap-3">
                {result.factors && Object.entries(result.factors).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between items-center bg-gray-900/50 rounded-lg px-4 py-2">
                    <span className="text-sm text-gray-400 capitalize">{key.replace('Impact', '')}</span>
                    <span className={`font-semibold ${value.startsWith('+') ? 'text-green-400' : value === '0%' ? 'text-gray-400' : 'text-red-400'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><span>⏰</span>{t.bestTime}</h3>
                <span className="text-purple-400 font-bold text-lg">{result.bestTimeToPost}</span>
              </div>
              <h3 className="font-semibold mb-3 flex items-center gap-2"><span>💡</span>{t.tips}</h3>
              <ul className="space-y-2">
                {result.tips?.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><span className="text-purple-400">•</span>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
