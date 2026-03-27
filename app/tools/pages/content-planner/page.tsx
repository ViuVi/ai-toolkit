'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 10
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'İçerik Planlayıcı', niche: 'Niş', nichePlaceholder: 'örn: Fitness, Teknoloji...', platforms: 'Platformlar', weeks: 'Hafta', frequency: 'Sıklık', generate: 'Plan Oluştur', generating: 'Planlanıyor...', emptyTitle: 'İçerik Takvimi', emptyDesc: 'Nişinizi girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', daily: 'Günlük 1', twiceDaily: 'Günlük 2', threeDaily: 'Günlük 3', pillars: 'İçerik Sütunları', themes: 'Aylık Temalar', strategy: 'Strateji', tips: 'İpuçları' },
  en: { title: 'Content Planner', niche: 'Niche', nichePlaceholder: 'e.g: Fitness, Tech...', platforms: 'Platforms', weeks: 'Weeks', frequency: 'Frequency', generate: 'Create Plan', generating: 'Planning...', emptyTitle: 'Content Calendar', emptyDesc: 'Enter your niche', insufficientCredits: 'Insufficient credits', error: 'Error', daily: '1x Daily', twiceDaily: '2x Daily', threeDaily: '3x Daily', pillars: 'Content Pillars', themes: 'Monthly Themes', strategy: 'Strategy', tips: 'Growth Tips' },
  ru: { title: 'Планировщик Контента', niche: 'Ниша', nichePlaceholder: 'напр: Фитнес...', platforms: 'Платформы', weeks: 'Недели', frequency: 'Частота', generate: 'Создать План', generating: 'Планируем...', emptyTitle: 'Календарь Контента', emptyDesc: 'Введите нишу', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', daily: '1 в день', twiceDaily: '2 в день', threeDaily: '3 в день', pillars: 'Столпы Контента', themes: 'Темы Месяца', strategy: 'Стратегия', tips: 'Советы' },
  de: { title: 'Content-Planer', niche: 'Nische', nichePlaceholder: 'z.B: Fitness...', platforms: 'Plattformen', weeks: 'Wochen', frequency: 'Frequenz', generate: 'Plan Erstellen', generating: 'Planen...', emptyTitle: 'Content-Kalender', emptyDesc: 'Nische eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', daily: '1x täglich', twiceDaily: '2x täglich', threeDaily: '3x täglich', pillars: 'Content-Säulen', themes: 'Monatsthemen', strategy: 'Strategie', tips: 'Wachstumstipps' },
  fr: { title: 'Planificateur de Contenu', niche: 'Niche', nichePlaceholder: 'ex: Fitness...', platforms: 'Plateformes', weeks: 'Semaines', frequency: 'Fréquence', generate: 'Créer le Plan', generating: 'Planification...', emptyTitle: 'Calendrier de Contenu', emptyDesc: 'Entrez votre niche', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', daily: '1x par jour', twiceDaily: '2x par jour', threeDaily: '3x par jour', pillars: 'Piliers de Contenu', themes: 'Thèmes Mensuels', strategy: 'Stratégie', tips: 'Conseils' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function ContentPlannerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['tiktok', 'instagram'])
  const [weeks, setWeeks] = useState('2')
  const [frequency, setFrequency] = useState('daily')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const togglePlatform = (p: string) => { setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]) }

  const handleGenerate = async () => {
    if (!niche.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/content-planner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platforms: selectedPlatforms, weeks, frequency, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const platforms = [{ value: 'tiktok', label: 'TikTok' }, { value: 'instagram', label: 'Instagram' }, { value: 'youtube', label: 'YouTube' }, { value: 'twitter', label: 'Twitter' }]
  const frequencies = [{ value: 'daily', label: t.daily }, { value: 'twice', label: t.twiceDaily }, { value: 'three', label: t.threeDaily }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">📅</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
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
            <div><label className="block text-sm text-gray-400 mb-2">{t.platforms}</label><div className="flex flex-wrap gap-2">{platforms.map(p => (<button key={p.value} onClick={() => togglePlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${selectedPlatforms.includes(p.value) ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.weeks}</label><div className="flex gap-2">{['1', '2', '4'].map(w => (<button key={w} onClick={() => setWeeks(w)} className={`px-4 py-2 rounded-xl border text-sm transition ${weeks === w ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{w}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.frequency}</label><div className="flex flex-wrap gap-2">{frequencies.map(f => (<button key={f.value} onClick={() => setFrequency(f.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${frequency === f.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{f.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>📅 {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">📅</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              {result.content_pillars && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-2">🏛️ {t.pillars}</div><div className="flex flex-wrap gap-2">{result.content_pillars.map((p: string, i: number) => (<span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm">{p}</span>))}</div></div>)}
              {result.calendar && (<div className="space-y-4 max-h-[50vh] overflow-y-auto">{result.calendar.map((week: any, wi: number) => (<div key={wi} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><h3 className="font-medium text-purple-400 mb-3">Week {week.week}</h3><div className="space-y-2">{week.days?.map((day: any, di: number) => (<div key={di} className="p-3 bg-white/[0.02] rounded-lg"><div className="text-sm font-medium mb-2">{day.day}</div>{day.posts?.map((post: any, pi: number) => (<div key={pi} className="text-xs text-gray-400 mb-1"><span className="text-purple-400">{post.platform}</span> • {post.topic} • {post.best_time}</div>))}</div>))}</div></div>))}</div>)}
              {result.engagement_strategy && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-1">🚀 {t.strategy}</div><p className="text-sm">{result.engagement_strategy}</p></div>)}
              {result.growth_tips && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-2">💡 {t.tips}</div><ul className="text-sm space-y-1">{result.growth_tips.map((tip: string, i: number) => (<li key={i}>• {tip}</li>))}</ul></div>)}
              {result.raw && !result.calendar && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
