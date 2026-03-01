'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'Trend Detector', subtitle: 'Discover trending topics and content ideas for your niche', credits: '5 Credits',
    nicheLabel: 'Your Niche / Industry', nichePlaceholder: 'e.g. fitness, cooking, tech, fashion, travel...',
    platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' },
    regionLabel: 'Region', regions: { global: 'Global', us: 'USA', eu: 'Europe', asia: 'Asia', tr: 'Turkey' },
    detect: 'Detect Trends', detecting: 'AI scanning trends...',
    trending: 'Trending Now', score: 'Score', growth: 'Growth',
    ideas: 'Content Ideas', format: 'Recommended Format', hashtags: 'Hashtags', timing: 'Best Time',
    insights: 'Niche Insights', health: 'Niche Health', competition: 'Competition', bestType: 'Best Content Type', activity: 'Peak Activity',
    plan: 'Weekly Content Plan', day: 'Day', content: 'Content', trend: 'Trend',
    expertTip: 'Expert Strategy Tip',
    viral: '🔥 VIRAL', rising: '📈 RISING', emerging: '🌱 EMERGING',
    emptyInput: 'Enter your niche', success: 'Trends detected!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'Trend Dedektörü', subtitle: 'Nişiniz için trend konuları ve içerik fikirlerini keşfedin', credits: '5 Kredi',
    nicheLabel: 'Niş / Sektör', nichePlaceholder: 'örn: fitness, yemek, teknoloji, moda, seyahat...',
    platformLabel: 'Platform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' },
    regionLabel: 'Bölge', regions: { global: 'Global', us: 'ABD', eu: 'Avrupa', asia: 'Asya', tr: 'Türkiye' },
    detect: 'Trendleri Bul', detecting: 'AI trendleri tarıyor...',
    trending: 'Şu An Trend', score: 'Skor', growth: 'Büyüme',
    ideas: 'İçerik Fikirleri', format: 'Önerilen Format', hashtags: 'Hashtagler', timing: 'En İyi Zaman',
    insights: 'Niş Analizleri', health: 'Niş Sağlığı', competition: 'Rekabet', bestType: 'En İyi İçerik Tipi', activity: 'Zirve Aktivite',
    plan: 'Haftalık İçerik Planı', day: 'Gün', content: 'İçerik', trend: 'Trend',
    expertTip: 'Uzman Strateji Tavsiyesi',
    viral: '🔥 VİRAL', rising: '📈 YÜKSELİYOR', emerging: '🌱 YENİ',
    emptyInput: 'Nişinizi girin', success: 'Trendler bulundu!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'Детектор трендов', subtitle: 'Находите трендовые темы', credits: '5 кредитов', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, regionLabel: 'Регион', regions: { global: 'Глобально', us: 'США', eu: 'Европа', asia: 'Азия', tr: 'Турция' }, detect: 'Найти', detecting: 'Поиск...', trending: 'В тренде', score: 'Рейтинг', growth: 'Рост', ideas: 'Идеи', format: 'Формат', hashtags: 'Хэштеги', timing: 'Время', insights: 'Аналитика', health: 'Здоровье', competition: 'Конкуренция', bestType: 'Лучший тип', activity: 'Активность', plan: 'План', day: 'День', content: 'Контент', trend: 'Тренд', expertTip: 'Совет', viral: '🔥 ВИРУСНЫЙ', rising: '📈 РАСТУЩИЙ', emerging: '🌱 НОВЫЙ', emptyInput: 'Введите нишу', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Trend-Detektor', subtitle: 'Trendthemen entdecken', credits: '5 Credits', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, regionLabel: 'Region', regions: { global: 'Global', us: 'USA', eu: 'Europa', asia: 'Asien', tr: 'Türkei' }, detect: 'Finden', detecting: 'Suche...', trending: 'Trending', score: 'Score', growth: 'Wachstum', ideas: 'Ideen', format: 'Format', hashtags: 'Hashtags', timing: 'Zeit', insights: 'Insights', health: 'Gesundheit', competition: 'Wettbewerb', bestType: 'Bester Typ', activity: 'Aktivität', plan: 'Plan', day: 'Tag', content: 'Inhalt', trend: 'Trend', expertTip: 'Tipp', viral: '🔥 VIRAL', rising: '📈 STEIGEND', emerging: '🌱 NEU', emptyInput: 'Nische eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Détecteur de tendances', subtitle: 'Découvrez les tendances', credits: '5 crédits', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', platforms: { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', twitter: 'Twitter/X' }, regionLabel: 'Région', regions: { global: 'Global', us: 'USA', eu: 'Europe', asia: 'Asie', tr: 'Turquie' }, detect: 'Détecter', detecting: 'Recherche...', trending: 'Tendances', score: 'Score', growth: 'Croissance', ideas: 'Idées', format: 'Format', hashtags: 'Hashtags', timing: 'Timing', insights: 'Insights', health: 'Santé', competition: 'Compétition', bestType: 'Meilleur type', activity: 'Activité', plan: 'Plan', day: 'Jour', content: 'Contenu', trend: 'Tendance', expertTip: 'Conseil', viral: '🔥 VIRAL', rising: '📈 MONTANT', emerging: '🌱 ÉMERGENT', emptyInput: 'Entrez niche', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function TrendDetectorPage() {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [region, setRegion] = useState('global')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [expandedTrend, setExpandedTrend] = useState<number | null>(0)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleDetect = async () => {
    if (!niche.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null); setExpandedTrend(0)
    try {
      const res = await fetch('/api/trend-detector', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, region, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.trends); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const getStatusBadge = (s: string) => {
    if (s === 'viral') return { bg: 'bg-red-500', text: t.viral }
    if (s === 'rising') return { bg: 'bg-yellow-500', text: t.rising }
    return { bg: 'bg-blue-500', text: t.emerging }
  }

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
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><span>🔥</span>{t.trending}</h2>
              <div className="space-y-3">
                {result.trends?.map((trend: any, i: number) => {
                  const badge = getStatusBadge(trend.status)
                  return (
                    <div key={i} className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
                      <div className="p-4 cursor-pointer hover:bg-gray-800/50 transition" onClick={() => setExpandedTrend(expandedTrend === i ? null : i)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                            <div><h3 className="font-semibold">{trend.topic}</h3><p className="text-sm text-gray-400 mt-0.5">{trend.description}</p></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 ${badge.bg} rounded text-xs font-bold`}>{badge.text}</span>
                            <span className="text-green-400 font-bold text-sm">{trend.growth}</span>
                            <span className="text-purple-400 font-bold">{trend.trendScore}%</span>
                            <span className="text-gray-500">{expandedTrend === i ? '▲' : '▼'}</span>
                          </div>
                        </div>
                      </div>
                      {expandedTrend === i && (
                        <div className="px-4 pb-4 border-t border-gray-700 pt-4 grid grid-cols-2 gap-4">
                          <div><p className="text-xs text-gray-400 mb-1">{t.ideas}</p><ul className="space-y-1">{trend.contentIdeas?.map((idea: string, j: number) => (<li key={j} className="text-sm flex items-start gap-1"><span className="text-purple-400">•</span>{idea}</li>))}</ul></div>
                          <div><p className="text-xs text-gray-400 mb-1">{t.format}</p><p className="text-sm">{trend.exampleFormat}</p></div>
                          <div><p className="text-xs text-gray-400 mb-1">{t.hashtags}</p><div className="flex flex-wrap gap-1">{trend.hashtags?.map((tag: string, j: number) => (<span key={j} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">{tag}</span>))}</div></div>
                          <div><p className="text-xs text-gray-400 mb-1">{t.timing}</p><p className="text-sm text-green-400">{trend.timing}</p></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Insights */}
            {result.nicheInsights && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>📈</span>{t.insights}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">{t.health}</p><p className={`font-bold text-lg capitalize ${result.nicheInsights.health === 'growing' ? 'text-green-400' : 'text-yellow-400'}`}>{result.nicheInsights.health}</p></div>
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center"><p className="text-xs text-gray-400 mb-1">{t.competition}</p><p className={`font-bold text-lg capitalize ${result.nicheInsights.competition === 'low' ? 'text-green-400' : result.nicheInsights.competition === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>{result.nicheInsights.competition}</p></div>
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center col-span-2"><p className="text-xs text-gray-400 mb-1">{t.bestType}</p><p className="font-medium">{result.nicheInsights.bestContentType}</p></div>
                </div>
              </div>
            )}

            {/* Weekly Plan */}
            {result.weeklyPlan && (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><span>📅</span>{t.plan}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.weeklyPlan.map((day: any, i: number) => (
                    <div key={i} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <p className="font-bold text-purple-400 mb-2">{day.day}</p>
                      <p className="text-sm mb-2">{day.content}</p>
                      <p className="text-xs text-gray-400">{t.trend}: <span className="text-gray-300">{day.trend}</span></p>
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
