'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'Trend Detector', subtitle: 'Discover trending topics and content ideas for your niche', credits: '5 Credits',
    nicheLabel: 'Your Niche', nichePlaceholder: 'e.g. fitness, cooking, tech, fashion...',
    platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' },
    regionLabel: 'Region', regions: { global: 'Global', us: 'USA', eu: 'Europe', asia: 'Asia', tr: 'Turkey' },
    detect: 'Detect Trends', detecting: 'AI finding trends...',
    trendingNow: 'Trending Now', trendScore: 'Score', growth: 'Growth', status: 'Status',
    contentIdeas: 'Content Ideas', hashtags: 'Hashtags', timing: 'Best Timing', format: 'Format',
    insights: 'Niche Insights', health: 'Health', competition: 'Competition', bestContent: 'Best Content', audience: 'Audience Activity',
    weeklyPlan: 'Weekly Plan', expertTip: 'Expert Tip',
    viral: 'Viral', rising: 'Rising', emerging: 'Emerging',
    emptyInput: 'Enter your niche', success: 'Trends found!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'Trend Dedektörü', subtitle: 'Nişiniz için trend konuları ve içerik fikirlerini keşfedin', credits: '5 Kredi',
    nicheLabel: 'Nişiniz', nichePlaceholder: 'örn: fitness, yemek, teknoloji, moda...',
    platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' },
    regionLabel: 'Bölge', regions: { global: 'Global', us: 'ABD', eu: 'Avrupa', asia: 'Asya', tr: 'Türkiye' },
    detect: 'Trendleri Bul', detecting: 'AI trendleri arıyor...',
    trendingNow: 'Şu An Trend', trendScore: 'Skor', growth: 'Büyüme', status: 'Durum',
    contentIdeas: 'İçerik Fikirleri', hashtags: 'Hashtagler', timing: 'En İyi Zaman', format: 'Format',
    insights: 'Niş Analizleri', health: 'Sağlık', competition: 'Rekabet', bestContent: 'En İyi İçerik', audience: 'Kitle Aktivitesi',
    weeklyPlan: 'Haftalık Plan', expertTip: 'Uzman Tavsiyesi',
    viral: 'Viral', rising: 'Yükseliyor', emerging: 'Yeni Çıkıyor',
    emptyInput: 'Nişinizi girin', success: 'Trendler bulundu!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'Детектор трендов', subtitle: 'Находите трендовые темы', credits: '5 кредитов', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, regionLabel: 'Регион', regions: { global: 'Глобально', us: 'США', eu: 'Европа', asia: 'Азия', tr: 'Турция' }, detect: 'Найти', detecting: 'Поиск...', trendingNow: 'В тренде', trendScore: 'Рейтинг', growth: 'Рост', status: 'Статус', contentIdeas: 'Идеи', hashtags: 'Хэштеги', timing: 'Время', format: 'Формат', insights: 'Аналитика', health: 'Здоровье', competition: 'Конкуренция', bestContent: 'Лучший контент', audience: 'Активность', weeklyPlan: 'План', expertTip: 'Совет', viral: 'Вирусный', rising: 'Растущий', emerging: 'Новый', emptyInput: 'Введите нишу', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Trend-Detektor', subtitle: 'Trendthemen entdecken', credits: '5 Credits', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, regionLabel: 'Region', regions: { global: 'Global', us: 'USA', eu: 'Europa', asia: 'Asien', tr: 'Türkei' }, detect: 'Finden', detecting: 'Suche...', trendingNow: 'Trending', trendScore: 'Score', growth: 'Wachstum', status: 'Status', contentIdeas: 'Ideen', hashtags: 'Hashtags', timing: 'Zeit', format: 'Format', insights: 'Insights', health: 'Gesundheit', competition: 'Wettbewerb', bestContent: 'Bester Inhalt', audience: 'Aktivität', weeklyPlan: 'Plan', expertTip: 'Tipp', viral: 'Viral', rising: 'Steigend', emerging: 'Neu', emptyInput: 'Nische eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Détecteur de tendances', subtitle: 'Découvrez les tendances', credits: '5 crédits', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, regionLabel: 'Région', regions: { global: 'Global', us: 'USA', eu: 'Europe', asia: 'Asie', tr: 'Turquie' }, detect: 'Détecter', detecting: 'Recherche...', trendingNow: 'Tendances', trendScore: 'Score', growth: 'Croissance', status: 'Statut', contentIdeas: 'Idées', hashtags: 'Hashtags', timing: 'Timing', format: 'Format', insights: 'Insights', health: 'Santé', competition: 'Compétition', bestContent: 'Meilleur contenu', audience: 'Activité', weeklyPlan: 'Plan', expertTip: 'Conseil', viral: 'Viral', rising: 'Montant', emerging: 'Émergent', emptyInput: 'Entrez niche', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function TrendDetectorPage() {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [region, setRegion] = useState('global')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [expandedTrend, setExpandedTrend] = useState<number | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleDetect = async () => {
    if (!niche.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null); setExpandedTrend(null)
    try {
      const res = await fetch('/api/trend-detector', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, region, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.trends); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const getStatusColor = (s: string) => s === 'viral' ? 'bg-red-500' : s === 'rising' ? 'bg-yellow-500' : 'bg-blue-500'
  const getStatusText = (s: string) => s === 'viral' ? t.viral : s === 'rising' ? t.rising : t.emerging

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">📊</span></div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.nicheLabel}</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.regionLabel}</label><select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.regions).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
          </div>
        </div>

        <button onClick={handleDetect} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.detecting}</>) : (<><span>📊</span>{t.detect}</>)}</button>

        {result && (
          <div className="space-y-6">
            {/* Trends */}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><span>🔥</span>{t.trendingNow}</h2>
              <div className="space-y-4">
                {result.trends?.map((trend: any, i: number) => (
                  <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-5 cursor-pointer hover:bg-gray-800/50 transition" onClick={() => setExpandedTrend(expandedTrend === i ? null : i)}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <span className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">{i + 1}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{trend.topic}</h3>
                            <p className="text-gray-400 text-sm mt-1">{trend.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`px-2 py-1 ${getStatusColor(trend.status)} rounded text-xs font-bold uppercase`}>{getStatusText(trend.status)}</span>
                          <span className="text-green-400 font-bold">{trend.growth}</span>
                          <span className="text-purple-400 font-bold">{trend.trendScore}%</span>
                          <span className="text-gray-400">{expandedTrend === i ? '▲' : '▼'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {expandedTrend === i && (
                      <div className="px-5 pb-5 border-t border-gray-700 pt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm text-gray-400 mb-2">{t.contentIdeas}</p><ul className="space-y-1">{trend.contentIdeas?.map((idea: string, j: number) => (<li key={j} className="text-sm flex items-start gap-2"><span className="text-purple-400">•</span>{idea}</li>))}</ul></div>
                          <div><p className="text-sm text-gray-400 mb-2">{t.format}</p><p className="text-sm">{trend.exampleFormat}</p></div>
                        </div>
                        <div className="flex flex-wrap gap-2"><p className="text-sm text-gray-400 w-full mb-1">{t.hashtags}</p>{trend.hashtags?.map((tag: string, j: number) => (<span key={j} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">{tag}</span>))}</div>
                        <div><p className="text-sm text-gray-400 mb-1">{t.timing}</p><p className="text-green-400 font-medium">{trend.timing}</p></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            {result.nicheInsights && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4">{t.insights}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-sm text-gray-400 mb-1">{t.health}</p><p className={`font-bold text-lg ${result.nicheInsights.health === 'growing' ? 'text-green-400' : result.nicheInsights.health === 'stable' ? 'text-yellow-400' : 'text-red-400'}`}>{result.nicheInsights.health}</p></div>
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-sm text-gray-400 mb-1">{t.competition}</p><p className={`font-bold text-lg ${result.nicheInsights.competition === 'low' ? 'text-green-400' : result.nicheInsights.competition === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>{result.nicheInsights.competition}</p></div>
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center col-span-2"><p className="text-sm text-gray-400 mb-1">{t.bestContent}</p><p className="font-medium">{result.nicheInsights.bestContentType}</p></div>
                </div>
              </div>
            )}

            {/* Weekly Plan */}
            {result.weeklyPlan && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4">{t.weeklyPlan}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.weeklyPlan.map((day: any, i: number) => (
                    <div key={i} className="bg-gray-900/50 rounded-xl p-4">
                      <p className="font-bold text-purple-400 mb-2">{day.day}</p>
                      <p className="text-sm mb-2">{day.content}</p>
                      <p className="text-xs text-gray-400">Trend: {day.trend}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expert Tip */}
            {result.expertTip && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><span>💡</span>{t.expertTip}</h3>
                <p className="text-gray-300 leading-relaxed">{result.expertTip}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
