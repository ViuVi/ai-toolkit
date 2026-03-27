'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 3
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Hashtag Araştırma', topic: 'Konu', topicPlaceholder: 'örn: Fitness, Yemek...', platform: 'Platform', strategy: 'Strateji', generate: 'Hashtag Bul', generating: 'Aranıyor...', copy: 'Kopyala', copied: '✓', copyAll: 'Tümünü Kopyala', emptyTitle: 'Hashtag Setleri', emptyDesc: 'Konunuzu girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', balanced: 'Dengeli', maxReach: 'Max Erişim', niche: 'Niş', trending: 'Trend', avoid: 'Kaçının', tip: 'Strateji İpucu' },
  en: { title: 'Hashtag Research', topic: 'Topic', topicPlaceholder: 'e.g: Fitness, Food...', platform: 'Platform', strategy: 'Strategy', generate: 'Find Hashtags', generating: 'Searching...', copy: 'Copy', copied: '✓', copyAll: 'Copy All', emptyTitle: 'Hashtag Sets', emptyDesc: 'Enter your topic', insufficientCredits: 'Insufficient credits', error: 'Error', balanced: 'Balanced', maxReach: 'Max Reach', niche: 'Niche', trending: 'Trending', avoid: 'Avoid', tip: 'Strategy Tip' },
  ru: { title: 'Исследование Хештегов', topic: 'Тема', topicPlaceholder: 'напр: Фитнес...', platform: 'Платформа', strategy: 'Стратегия', generate: 'Найти Хештеги', generating: 'Ищем...', copy: 'Копировать', copied: '✓', copyAll: 'Копировать всё', emptyTitle: 'Наборы Хештегов', emptyDesc: 'Введите тему', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', balanced: 'Сбалансированно', maxReach: 'Макс Охват', niche: 'Ниша', trending: 'Тренды', avoid: 'Избегать', tip: 'Совет' },
  de: { title: 'Hashtag-Recherche', topic: 'Thema', topicPlaceholder: 'z.B: Fitness...', platform: 'Plattform', strategy: 'Strategie', generate: 'Hashtags Finden', generating: 'Suchen...', copy: 'Kopieren', copied: '✓', copyAll: 'Alle kopieren', emptyTitle: 'Hashtag-Sets', emptyDesc: 'Thema eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', balanced: 'Ausgewogen', maxReach: 'Max Reichweite', niche: 'Nische', trending: 'Trending', avoid: 'Vermeiden', tip: 'Strategie-Tipp' },
  fr: { title: 'Recherche Hashtags', topic: 'Sujet', topicPlaceholder: 'ex: Fitness...', platform: 'Plateforme', strategy: 'Stratégie', generate: 'Trouver Hashtags', generating: 'Recherche...', copy: 'Copier', copied: '✓', copyAll: 'Tout copier', emptyTitle: 'Sets de Hashtags', emptyDesc: 'Entrez votre sujet', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', balanced: 'Équilibré', maxReach: 'Portée Max', niche: 'Niche', trending: 'Tendance', avoid: 'Éviter', tip: 'Conseil' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function HashtagResearchPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [strategy, setStrategy] = useState('balanced')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedSet, setCopiedSet] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!topic.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/hashtag-research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, strategy, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const copyHashtags = (hashtags: string[], index: number) => { navigator.clipboard.writeText(hashtags.join(' ')); setCopiedSet(index); setTimeout(() => setCopiedSet(null), 2000) }

  const platforms = [{ value: 'instagram', label: 'Instagram' }, { value: 'tiktok', label: 'TikTok' }, { value: 'twitter', label: 'Twitter' }]
  const strategies = [{ value: 'balanced', label: t.balanced }, { value: 'maxreach', label: t.maxReach }, { value: 'niche', label: t.niche }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">#️⃣</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.topic}</label><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="flex gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.strategy}</label><div className="flex flex-wrap gap-2">{strategies.map(s => (<button key={s.value} onClick={() => setStrategy(s.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${strategy === s.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{s.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>#️⃣ {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">#️⃣</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              {result.hashtag_sets?.map((set: any, i: number) => (<div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="flex justify-between items-center mb-3"><h3 className="font-medium text-purple-400">{set.name}</h3><button onClick={() => copyHashtags(set.hashtags, i)} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 hover:text-white transition">{copiedSet === i ? '✓' : t.copy}</button></div><div className="flex flex-wrap gap-2 mb-2">{set.hashtags?.map((tag: string, j: number) => (<span key={j} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-sm">{tag}</span>))}</div><div className="text-xs text-gray-500">{set.total_reach && `Reach: ${set.total_reach}`} {set.competition && `• Competition: ${set.competition}`}</div></div>))}
              {result.trending_hashtags && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-2">🔥 {t.trending}</div><div className="flex flex-wrap gap-2">{result.trending_hashtags.map((tag: string, i: number) => (<span key={i} className="px-2 py-1 bg-white/5 rounded text-sm">{tag}</span>))}</div></div>)}
              {result.avoid_hashtags && (<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"><div className="text-sm text-red-400 mb-2">⚠️ {t.avoid}</div><div className="flex flex-wrap gap-2">{result.avoid_hashtags.map((tag: string, i: number) => (<span key={i} className="px-2 py-1 bg-white/5 rounded text-sm line-through">{tag}</span>))}</div></div>)}
              {result.strategy_tip && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-1">💡 {t.tip}</div><p className="text-sm">{result.strategy_tip}</p></div>)}
              {result.raw && !result.hashtag_sets?.length && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
