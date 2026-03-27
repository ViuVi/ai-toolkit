'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 4
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Trend Radar', niche: 'Niş', nichePlaceholder: 'örn: Teknoloji, Moda...', platform: 'Platform', timeframe: 'Zaman', generate: 'Trendleri Tara', generating: 'Taranıyor...', copy: 'Kopyala', emptyTitle: 'Trend Analizi', emptyDesc: 'Nişinizi girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', thisWeek: 'Bu Hafta', thisMonth: 'Bu Ay', sounds: 'Trend Sesler', hashtags: 'Hashtag Trendleri', formats: 'İçerik Formatları', prediction: 'Gelecek Tahmin', rising: 'Yükseliyor', peak: 'Zirve', declining: 'Düşüyor' },
  en: { title: 'Trend Radar', niche: 'Niche', nichePlaceholder: 'e.g: Tech, Fashion...', platform: 'Platform', timeframe: 'Timeframe', generate: 'Scan Trends', generating: 'Scanning...', copy: 'Copy', emptyTitle: 'Trend Analysis', emptyDesc: 'Enter your niche', insufficientCredits: 'Insufficient credits', error: 'Error', thisWeek: 'This Week', thisMonth: 'This Month', sounds: 'Trending Sounds', hashtags: 'Hashtag Trends', formats: 'Content Formats', prediction: 'Prediction', rising: 'Rising', peak: 'Peak', declining: 'Declining' },
  ru: { title: 'Trend Radar', niche: 'Ниша', nichePlaceholder: 'напр: Технологии...', platform: 'Платформа', timeframe: 'Период', generate: 'Сканировать', generating: 'Сканируем...', copy: 'Копировать', emptyTitle: 'Анализ Трендов', emptyDesc: 'Введите нишу', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', thisWeek: 'Эта Неделя', thisMonth: 'Этот Месяц', sounds: 'Звуки', hashtags: 'Хештеги', formats: 'Форматы', prediction: 'Прогноз', rising: 'Растёт', peak: 'Пик', declining: 'Падает' },
  de: { title: 'Trend Radar', niche: 'Nische', nichePlaceholder: 'z.B: Tech, Mode...', platform: 'Plattform', timeframe: 'Zeitraum', generate: 'Trends Scannen', generating: 'Scannen...', copy: 'Kopieren', emptyTitle: 'Trend-Analyse', emptyDesc: 'Nische eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', thisWeek: 'Diese Woche', thisMonth: 'Diesen Monat', sounds: 'Sounds', hashtags: 'Hashtags', formats: 'Formate', prediction: 'Vorhersage', rising: 'Steigend', peak: 'Peak', declining: 'Fallend' },
  fr: { title: 'Trend Radar', niche: 'Niche', nichePlaceholder: 'ex: Tech, Mode...', platform: 'Plateforme', timeframe: 'Période', generate: 'Scanner', generating: 'Scan...', copy: 'Copier', emptyTitle: 'Analyse des Tendances', emptyDesc: 'Entrez votre niche', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', thisWeek: 'Cette Semaine', thisMonth: 'Ce Mois', sounds: 'Sons', hashtags: 'Hashtags', formats: 'Formats', prediction: 'Prédiction', rising: 'Monte', peak: 'Pic', declining: 'Baisse' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function TrendRadarPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('all')
  const [timeframe, setTimeframe] = useState('week')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!niche.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/trend-radar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, timeframe, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const platforms = [{ value: 'all', label: 'All' }, { value: 'tiktok', label: 'TikTok' }, { value: 'instagram', label: 'Instagram' }, { value: 'youtube', label: 'YouTube' }]
  const timeframes = [{ value: 'week', label: t.thisWeek }, { value: 'month', label: t.thisMonth }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">📡</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.niche}</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="flex flex-wrap gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.timeframe}</label><div className="flex gap-2">{timeframes.map(tf => (<button key={tf.value} onClick={() => setTimeframe(tf.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${timeframe === tf.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{tf.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>📡 {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">📡</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              <div className="space-y-3">{result.trends?.map((trend: any, i: number) => (<div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="flex justify-between items-start mb-2"><h3 className="font-medium">{trend.trend}</h3><span className={`px-2 py-1 rounded text-xs ${trend.growth === 'rising' ? 'bg-green-500/20 text-green-400' : trend.growth === 'peak' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{trend.growth}</span></div>{trend.how_to_use && <p className="text-sm text-gray-400">{trend.how_to_use}</p>}</div>))}</div>
              {result.hashtag_trends && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-2"># {t.hashtags}</div><div className="flex flex-wrap gap-2">{result.hashtag_trends.map((tag: string, i: number) => (<span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm">{tag}</span>))}</div></div>)}
              {result.prediction && (<div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl"><div className="text-sm text-blue-400 mb-2">🔮 {t.prediction}</div><p className="text-sm">{result.prediction}</p></div>)}
              {result.raw && !result.trends?.length && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
