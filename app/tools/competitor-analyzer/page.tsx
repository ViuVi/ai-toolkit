'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'Competitor Analysis', subtitle: 'Analyze your competitors and get strategic insights', credits: '8 Credits',
    handleLabel: 'Competitor Username', handlePlaceholder: '@username or profile URL',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' },
    analyze: 'Analyze Competitor', analyzing: 'Deep analyzing...',
    overview: 'Account Overview', followers: 'Followers', posts: 'Posts', engagement: 'Engagement', avgLikes: 'Avg Likes', avgComments: 'Avg Comments',
    strategy: 'Content Strategy', frequency: 'Posting Frequency', bestTimes: 'Best Times', contentTypes: 'Content Types', hashtags: 'Top Hashtags',
    strengths: 'Strengths', weaknesses: 'Weaknesses', recommendations: 'How to Compete', insights: 'AI Insights',
    emptyInput: 'Enter competitor username', success: 'Analysis complete!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'Rakip Analizi', subtitle: 'Rakiplerinizi analiz edin ve stratejik içgörüler edinin', credits: '8 Kredi',
    handleLabel: 'Rakip Kullanıcı Adı', handlePlaceholder: '@kullaniciadi veya profil URL',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' },
    analyze: 'Rakibi Analiz Et', analyzing: 'Derinlemesine analiz ediliyor...',
    overview: 'Hesap Özeti', followers: 'Takipçi', posts: 'Gönderi', engagement: 'Etkileşim', avgLikes: 'Ort. Beğeni', avgComments: 'Ort. Yorum',
    strategy: 'İçerik Stratejisi', frequency: 'Paylaşım Sıklığı', bestTimes: 'En İyi Saatler', contentTypes: 'İçerik Tipleri', hashtags: 'Popüler Hashtagler',
    strengths: 'Güçlü Yönleri', weaknesses: 'Zayıf Yönleri', recommendations: 'Nasıl Rekabet Edilir', insights: 'AI Değerlendirmesi',
    emptyInput: 'Rakip kullanıcı adı girin', success: 'Analiz tamamlandı!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'Анализ конкурентов', subtitle: 'Анализируйте конкурентов', credits: '8 кредитов', handleLabel: 'Имя пользователя', handlePlaceholder: '@username', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, analyze: 'Анализировать', analyzing: 'Анализ...', overview: 'Обзор', followers: 'Подписчики', posts: 'Посты', engagement: 'Вовлеченность', avgLikes: 'Ср. лайки', avgComments: 'Ср. комментарии', strategy: 'Стратегия', frequency: 'Частота', bestTimes: 'Лучшее время', contentTypes: 'Типы контента', hashtags: 'Хэштеги', strengths: 'Сильные стороны', weaknesses: 'Слабые стороны', recommendations: 'Рекомендации', insights: 'AI анализ', emptyInput: 'Введите имя', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Wettbewerbsanalyse', subtitle: 'Analysieren Sie Ihre Wettbewerber', credits: '8 Credits', handleLabel: 'Benutzername', handlePlaceholder: '@benutzername', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, analyze: 'Analysieren', analyzing: 'Analyse...', overview: 'Übersicht', followers: 'Follower', posts: 'Beiträge', engagement: 'Engagement', avgLikes: 'Ø Likes', avgComments: 'Ø Kommentare', strategy: 'Strategie', frequency: 'Frequenz', bestTimes: 'Beste Zeiten', contentTypes: 'Inhaltstypen', hashtags: 'Hashtags', strengths: 'Stärken', weaknesses: 'Schwächen', recommendations: 'Empfehlungen', insights: 'KI-Analyse', emptyInput: 'Name eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Analyse concurrentielle', subtitle: 'Analysez vos concurrents', credits: '8 crédits', handleLabel: 'Nom d\'utilisateur', handlePlaceholder: '@utilisateur', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, analyze: 'Analyser', analyzing: 'Analyse...', overview: 'Aperçu', followers: 'Abonnés', posts: 'Publications', engagement: 'Engagement', avgLikes: 'Moy. likes', avgComments: 'Moy. commentaires', strategy: 'Stratégie', frequency: 'Fréquence', bestTimes: 'Meilleurs horaires', contentTypes: 'Types de contenu', hashtags: 'Hashtags', strengths: 'Forces', weaknesses: 'Faiblesses', recommendations: 'Recommandations', insights: 'Analyse IA', emptyInput: 'Entrez nom', success: 'Terminé!', error: 'Erreur' }
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
        
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-300 mb-2">{t.handleLabel}</label><input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder={t.handlePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
          </div>
        </div>

        <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.analyzing}</>) : (<><span>🔍</span>{t.analyze}</>)}</button>

        {result && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>📊</span>{t.overview}</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-purple-400">{result.overview?.followers}</p><p className="text-xs text-gray-400">{t.followers}</p></div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-blue-400">{result.overview?.posts}</p><p className="text-xs text-gray-400">{t.posts}</p></div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-green-400">{result.overview?.engagementRate}</p><p className="text-xs text-gray-400">{t.engagement}</p></div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-pink-400">{result.overview?.avgLikes}</p><p className="text-xs text-gray-400">{t.avgLikes}</p></div>
                <div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-yellow-400">{result.overview?.avgComments}</p><p className="text-xs text-gray-400">{t.avgComments}</p></div>
              </div>
            </div>

            {/* Strategy */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>📈</span>{t.strategy}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/50 rounded-xl p-4"><p className="text-sm text-gray-400 mb-1">{t.frequency}</p><p className="font-medium">{result.contentStrategy?.postingFrequency}</p></div>
                <div className="bg-gray-900/50 rounded-xl p-4"><p className="text-sm text-gray-400 mb-1">{t.bestTimes}</p><p className="font-medium">{result.contentStrategy?.bestTimes?.join(', ')}</p></div>
                <div className="bg-gray-900/50 rounded-xl p-4"><p className="text-sm text-gray-400 mb-1">{t.contentTypes}</p><div className="flex flex-wrap gap-2 mt-1">{result.contentStrategy?.topContentTypes?.map((type: string, i: number) => (<span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">{type}</span>))}</div></div>
                <div className="bg-gray-900/50 rounded-xl p-4"><p className="text-sm text-gray-400 mb-1">{t.hashtags}</p><p className="font-medium text-blue-400 text-sm">{result.contentStrategy?.topHashtags?.join(' ')}</p></div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-2xl border border-green-500/30 p-6"><h2 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2"><span>💪</span>{t.strengths}</h2><ul className="space-y-2">{result.strengths?.map((s: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm"><span className="text-green-400 mt-0.5">✓</span><span>{s}</span></li>))}</ul></div>
              <div className="bg-gray-800/50 rounded-2xl border border-red-500/30 p-6"><h2 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2"><span>⚠️</span>{t.weaknesses}</h2><ul className="space-y-2">{result.weaknesses?.map((w: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm"><span className="text-red-400 mt-0.5">✗</span><span>{w}</span></li>))}</ul></div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>🎯</span>{t.recommendations}</h2>
              <div className="space-y-3">{result.recommendations?.map((r: string, i: number) => (<div key={i} className="flex items-start gap-3 bg-gray-800/50 rounded-xl p-4"><span className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span><span>{r}</span></div>))}</div>
            </div>

            {/* AI Insights */}
            {result.aiInsights && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><span>🤖</span>{t.insights}</h2>
                <p className="text-gray-300 leading-relaxed">{result.aiInsights}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
