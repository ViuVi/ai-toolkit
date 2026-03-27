'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 8
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Rakip Analizi', competitor: 'Rakip Bilgisi', competitorPlaceholder: 'Rakibin hesabını veya içerik tarzını açıklayın...', platform: 'Platform', analysisType: 'Analiz Türü', generate: 'Rakibi Analiz Et', generating: 'Analiz ediliyor...', emptyTitle: 'Rakip Analizi', emptyDesc: 'Rakip bilgisi girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', full: 'Tam Analiz', content: 'İçerik', engagement: 'Etkileşim', strategy: 'Strateji', opportunities: 'Fırsatlar', ideas: 'İçerik Fikirleri', action: 'Aksiyon Planı' },
  en: { title: 'Competitor Spy', competitor: 'Competitor Info', competitorPlaceholder: 'Describe the competitor account or content style...', platform: 'Platform', analysisType: 'Analysis Type', generate: 'Analyze Competitor', generating: 'Analyzing...', emptyTitle: 'Competitor Analysis', emptyDesc: 'Enter competitor info', insufficientCredits: 'Insufficient credits', error: 'Error', full: 'Full Analysis', content: 'Content', engagement: 'Engagement', strategy: 'Strategy', opportunities: 'Opportunities', ideas: 'Content Ideas', action: 'Action Plan' },
  ru: { title: 'Анализ Конкурентов', competitor: 'О Конкуренте', competitorPlaceholder: 'Опишите аккаунт конкурента...', platform: 'Платформа', analysisType: 'Тип Анализа', generate: 'Анализировать', generating: 'Анализируем...', emptyTitle: 'Анализ Конкурентов', emptyDesc: 'Введите данные', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', full: 'Полный Анализ', content: 'Контент', engagement: 'Вовлечение', strategy: 'Стратегия', opportunities: 'Возможности', ideas: 'Идеи Контента', action: 'План Действий' },
  de: { title: 'Konkurrenz-Analyse', competitor: 'Konkurrenz-Info', competitorPlaceholder: 'Beschreiben Sie den Konkurrenten...', platform: 'Plattform', analysisType: 'Analyse-Typ', generate: 'Analysieren', generating: 'Analysieren...', emptyTitle: 'Konkurrenz-Analyse', emptyDesc: 'Info eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', full: 'Vollanalyse', content: 'Inhalt', engagement: 'Engagement', strategy: 'Strategie', opportunities: 'Chancen', ideas: 'Content-Ideen', action: 'Aktionsplan' },
  fr: { title: 'Espion Concurrent', competitor: 'Info Concurrent', competitorPlaceholder: 'Décrivez le concurrent...', platform: 'Plateforme', analysisType: 'Type d\'Analyse', generate: 'Analyser', generating: 'Analyse...', emptyTitle: 'Analyse Concurrent', emptyDesc: 'Entrez les infos', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', full: 'Analyse Complète', content: 'Contenu', engagement: 'Engagement', strategy: 'Stratégie', opportunities: 'Opportunités', ideas: 'Idées de Contenu', action: 'Plan d\'Action' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function CompetitorSpyPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [competitorInfo, setCompetitorInfo] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [analysisType, setAnalysisType] = useState('full')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!competitorInfo.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/competitor-spy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ competitorInfo, platform, analysisType, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const platforms = [{ value: 'tiktok', label: 'TikTok' }, { value: 'instagram', label: 'Instagram' }, { value: 'youtube', label: 'YouTube' }]
  const types = [{ value: 'full', label: t.full }, { value: 'content', label: t.content }, { value: 'engagement', label: t.engagement }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">🕵️</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.competitor}</label><textarea value={competitorInfo} onChange={(e) => setCompetitorInfo(e.target.value)} placeholder={t.competitorPlaceholder} rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none resize-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="flex gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.analysisType}</label><div className="flex flex-wrap gap-2">{types.map(ty => (<button key={ty.value} onClick={() => setAnalysisType(ty.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${analysisType === ty.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{ty.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !competitorInfo.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>🕵️ {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🕵️</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              {result.competitor_analysis && (<div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"><div className="text-sm text-blue-400 mb-2">📊 {t.strategy}</div><p className="text-sm mb-2">{result.competitor_analysis.content_strategy}</p>{result.competitor_analysis.weaknesses && <div className="mt-2"><span className="text-xs text-gray-500">Weaknesses:</span><ul className="text-xs text-gray-400">{result.competitor_analysis.weaknesses.map((w: string, i: number) => (<li key={i}>• {w}</li>))}</ul></div>}</div>)}
              {result.opportunities && (<div className="space-y-2"><div className="text-sm text-green-400 mb-2">🎯 {t.opportunities}</div>{result.opportunities.map((opp: any, i: number) => (<div key={i} className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="font-medium text-sm">{opp.gap}</div><p className="text-xs text-gray-400 mt-1">{opp.your_angle}</p><span className={`text-xs px-2 py-0.5 rounded ${opp.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{opp.priority}</span></div>))}</div>)}
              {result.content_ideas && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-2">💡 {t.ideas}</div><div className="space-y-2">{result.content_ideas.map((idea: any, i: number) => (<div key={i} className="text-sm"><span className="font-medium">{idea.idea}</span><p className="text-xs text-gray-400">{idea.hook}</p></div>))}</div></div>)}
              {result.action_plan && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-2">📋 {t.action}</div><ol className="text-sm space-y-1">{result.action_plan.map((step: string, i: number) => (<li key={i}>{i + 1}. {step}</li>))}</ol></div>)}
              {result.raw && !result.opportunities && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
