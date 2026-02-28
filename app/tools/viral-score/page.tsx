'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back', title: 'Viral Score', subtitle: 'Calculate the viral potential of your content', credits: '3 Credits',
    contentLabel: 'Your Content', contentPlaceholder: 'Paste your content here to analyze viral potential...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube' },
    calculate: 'Calculate Viral Score', calculating: 'Calculating...',
    score: 'Viral Score', factors: 'Analysis Factors', improvements: 'How to Improve',
    wordCount: 'Word Count',
    emptyInput: 'Please enter content', success: 'Score calculated!', error: 'Error occurred'
  },
  tr: {
    back: '← Geri', title: 'Viral Skor', subtitle: 'İçeriğinizin viral potansiyelini hesaplayın', credits: '3 Kredi',
    contentLabel: 'İçeriğiniz', contentPlaceholder: 'Viral potansiyeli analiz etmek için içeriğinizi yapıştırın...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube' },
    calculate: 'Viral Skoru Hesapla', calculating: 'Hesaplanıyor...',
    score: 'Viral Skor', factors: 'Analiz Faktörleri', improvements: 'Nasıl İyileştirilir',
    wordCount: 'Kelime Sayısı',
    emptyInput: 'Lütfen içerik girin', success: 'Skor hesaplandı!', error: 'Hata oluştu'
  },
  ru: { back: '← Назад', title: 'Вирусный рейтинг', subtitle: 'Рассчитайте вирусный потенциал', credits: '3 кредита', contentLabel: 'Ваш контент', contentPlaceholder: 'Вставьте контент...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube' }, calculate: 'Рассчитать', calculating: 'Расчет...', score: 'Рейтинг', factors: 'Факторы', improvements: 'Улучшения', wordCount: 'Слов', emptyInput: 'Введите контент', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Viral-Score', subtitle: 'Berechnen Sie das virale Potenzial', credits: '3 Credits', contentLabel: 'Ihr Inhalt', contentPlaceholder: 'Inhalt einfügen...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube' }, calculate: 'Berechnen', calculating: 'Berechnung...', score: 'Score', factors: 'Faktoren', improvements: 'Verbesserungen', wordCount: 'Wörter', emptyInput: 'Inhalt eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Score viral', subtitle: 'Calculez le potentiel viral', credits: '3 crédits', contentLabel: 'Votre contenu', contentPlaceholder: 'Collez votre contenu...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube' }, calculate: 'Calculer', calculating: 'Calcul...', score: 'Score', factors: 'Facteurs', improvements: 'Améliorations', wordCount: 'Mots', emptyInput: 'Entrez du contenu', success: 'Terminé!', error: 'Erreur' }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' }, { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' }, { code: 'de', flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function ViralScorePage() {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleCalculate = async () => {
    if (!content.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/viral-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platform, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.analysis); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const getScoreColor = (score: number) => score >= 70 ? 'from-green-500 to-emerald-500' : score >= 50 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-pink-500'

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
            <span className="text-3xl">🚀</span>
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
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-40 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
              {Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
            </select>
          </div>
        </div>

        <button onClick={handleCalculate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.calculating}</>) : (<><span>🚀</span>{t.calculate}</>)}
        </button>

        {result && (
          <div className="space-y-6">
            <div className={`bg-gradient-to-r ${getScoreColor(result.score)} rounded-2xl p-8 text-center`}>
              <p className="text-white/80 text-lg mb-2">{t.score}</p>
              <p className="text-7xl font-bold text-white mb-2">{result.score}</p>
              <p className="text-3xl">{result.rating}</p>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>📊</span>{t.factors}</h3>
              <div className="space-y-3">
                {result.factors?.map((factor: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-900/50 rounded-xl p-3">
                    <span className={factor.startsWith('✅') ? 'text-green-400' : factor.startsWith('❌') ? 'text-red-400' : 'text-yellow-400'}>{factor.slice(0, 2)}</span>
                    <span className="text-gray-300">{factor.slice(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>💡</span>{t.improvements}</h3>
              <ul className="space-y-2">
                {result.improvements?.map((imp: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 text-center">
              <span className="text-gray-400">{t.wordCount}: </span>
              <span className="font-bold text-purple-400">{result.wordCount}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
