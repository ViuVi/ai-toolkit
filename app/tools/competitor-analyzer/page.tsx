'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Competitor Analysis', subtitle: 'Analyze competitor strategies', credits: '8 Credits', handleLabel: 'Username', handlePlaceholder: '@username', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, analyze: 'Analyze', analyzing: 'Analyzing...', overview: 'Overview', followers: 'Followers', posts: 'Posts', engagement: 'Engagement', strategy: 'Strategy', strengths: 'Strengths', weaknesses: 'Weaknesses', recommendations: 'Recommendations', emptyInput: 'Enter username', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Rakip Analizi', subtitle: 'Rakip stratejilerini analiz edin', credits: '8 Kredi', handleLabel: 'Kullanıcı Adı', handlePlaceholder: '@kullaniciadi', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, analyze: 'Analiz Et', analyzing: 'Analiz ediliyor...', overview: 'Genel Bakış', followers: 'Takipçi', posts: 'Gönderi', engagement: 'Etkileşim', strategy: 'Strateji', strengths: 'Güçlü Yönler', weaknesses: 'Zayıf Yönler', recommendations: 'Öneriler', emptyInput: 'Kullanıcı adı girin', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Анализ конкурентов', subtitle: 'Анализируйте стратегии', credits: '8 кредитов', handleLabel: 'Имя', handlePlaceholder: '@username', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, analyze: 'Анализ', analyzing: 'Анализ...', overview: 'Обзор', followers: 'Подписчики', posts: 'Посты', engagement: 'Вовлеченность', strategy: 'Стратегия', strengths: 'Сильные', weaknesses: 'Слабые', recommendations: 'Рекомендации', emptyInput: 'Введите имя', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Wettbewerbsanalyse', subtitle: 'Strategien analysieren', credits: '8 Credits', handleLabel: 'Benutzername', handlePlaceholder: '@name', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, analyze: 'Analysieren', analyzing: 'Analyse...', overview: 'Übersicht', followers: 'Follower', posts: 'Beiträge', engagement: 'Engagement', strategy: 'Strategie', strengths: 'Stärken', weaknesses: 'Schwächen', recommendations: 'Empfehlungen', emptyInput: 'Name eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Analyse concurrentielle', subtitle: 'Analysez les stratégies', credits: '8 crédits', handleLabel: 'Nom', handlePlaceholder: '@utilisateur', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, analyze: 'Analyser', analyzing: 'Analyse...', overview: 'Aperçu', followers: 'Abonnés', posts: 'Posts', engagement: 'Engagement', strategy: 'Stratégie', strengths: 'Forces', weaknesses: 'Faiblesses', recommendations: 'Recommandations', emptyInput: 'Entrez nom', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function CompetitorAnalyzerPage() {
  const [handle, setHandle] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleAnalyze = async () => {
    if (!handle.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/competitor-analyzer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ competitorHandle: handle, platform, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.analysis); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">🔍</span></div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.handleLabel}</label><input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder={t.handlePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div></div></div>
        <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.analyzing}</>) : (<><span>🔍</span>{t.analyze}</>)}</button>
        {result && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h2 className="text-xl font-semibold mb-4">{t.overview}</h2><div className="grid grid-cols-3 gap-4"><div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-purple-400">{result.overview?.followers}</p><p className="text-xs text-gray-400">{t.followers}</p></div><div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-blue-400">{result.overview?.posts}</p><p className="text-xs text-gray-400">{t.posts}</p></div><div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-green-400">{result.overview?.engagementRate}</p><p className="text-xs text-gray-400">{t.engagement}</p></div></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-gray-800/50 rounded-2xl border border-green-500/30 p-6"><h2 className="text-lg font-semibold mb-3 text-green-400">{t.strengths}</h2><ul className="space-y-2">{result.strengths?.map((s: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm"><span className="text-green-400">✓</span>{s}</li>))}</ul></div><div className="bg-gray-800/50 rounded-2xl border border-red-500/30 p-6"><h2 className="text-lg font-semibold mb-3 text-red-400">{t.weaknesses}</h2><ul className="space-y-2">{result.weaknesses?.map((w: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm"><span className="text-red-400">✗</span>{w}</li>))}</ul></div></div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6"><h2 className="text-xl font-semibold mb-4">{t.recommendations}</h2><ul className="space-y-3">{result.recommendations?.map((r: string, i: number) => (<li key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-xl p-3"><span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span><span>{r}</span></li>))}</ul></div>
          </div>
        )}
      </main>
    </div>
  )
}
