'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 4
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Engagement Artırıcı', content: 'İçerik', contentPlaceholder: 'Optimize edilecek içeriği yapıştırın...', platform: 'Platform', goal: 'Hedef', generate: 'Optimize Et', generating: 'Optimize ediliyor...', copy: 'Kopyala', emptyTitle: 'Engagement Boost', emptyDesc: 'İçeriğinizi girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', moreComments: 'Daha Fazla Yorum', moreShares: 'Daha Fazla Paylaşım', moreSaves: 'Daha Fazla Kaydetme', moreFollows: 'Daha Fazla Takipçi', currentScore: 'Mevcut Skor', optimized: 'Optimize Edilmiş', hooks: 'Engagement Hooks', replyStarters: 'Yorum Tetikleyiciler', hashtags: 'Hashtag Stratejisi' },
  en: { title: 'Engagement Booster', content: 'Content', contentPlaceholder: 'Paste content to optimize...', platform: 'Platform', goal: 'Goal', generate: 'Optimize', generating: 'Optimizing...', copy: 'Copy', emptyTitle: 'Engagement Boost', emptyDesc: 'Enter your content', insufficientCredits: 'Insufficient credits', error: 'Error', moreComments: 'More Comments', moreShares: 'More Shares', moreSaves: 'More Saves', moreFollows: 'More Follows', currentScore: 'Current Score', optimized: 'Optimized Versions', hooks: 'Engagement Hooks', replyStarters: 'Reply Starters', hashtags: 'Hashtag Strategy' },
  ru: { title: 'Усилитель Вовлечения', content: 'Контент', contentPlaceholder: 'Вставьте контент...', platform: 'Платформа', goal: 'Цель', generate: 'Оптимизировать', generating: 'Оптимизируем...', copy: 'Копировать', emptyTitle: 'Boost Вовлечения', emptyDesc: 'Введите контент', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', moreComments: 'Больше Комментариев', moreShares: 'Больше Репостов', moreSaves: 'Больше Сохранений', moreFollows: 'Больше Подписчиков', currentScore: 'Текущий Балл', optimized: 'Оптимизировано', hooks: 'Хуки Вовлечения', replyStarters: 'Триггеры Комментариев', hashtags: 'Стратегия Хештегов' },
  de: { title: 'Engagement-Booster', content: 'Inhalt', contentPlaceholder: 'Inhalt einfügen...', platform: 'Plattform', goal: 'Ziel', generate: 'Optimieren', generating: 'Optimieren...', copy: 'Kopieren', emptyTitle: 'Engagement Boost', emptyDesc: 'Inhalt eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', moreComments: 'Mehr Kommentare', moreShares: 'Mehr Shares', moreSaves: 'Mehr Speichern', moreFollows: 'Mehr Follower', currentScore: 'Aktueller Score', optimized: 'Optimierte Versionen', hooks: 'Engagement-Hooks', replyStarters: 'Antwort-Starter', hashtags: 'Hashtag-Strategie' },
  fr: { title: 'Booster d\'Engagement', content: 'Contenu', contentPlaceholder: 'Collez le contenu...', platform: 'Plateforme', goal: 'Objectif', generate: 'Optimiser', generating: 'Optimisation...', copy: 'Copier', emptyTitle: 'Boost Engagement', emptyDesc: 'Entrez votre contenu', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', moreComments: 'Plus de Commentaires', moreShares: 'Plus de Partages', moreSaves: 'Plus de Sauvegardes', moreFollows: 'Plus d\'Abonnés', currentScore: 'Score Actuel', optimized: 'Versions Optimisées', hooks: 'Hooks d\'Engagement', replyStarters: 'Déclencheurs de Réponse', hashtags: 'Stratégie Hashtags' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function EngagementBoosterPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [goal, setGoal] = useState('comments')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!content.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/engagement-booster', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platform, goal, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const copyText = (text: string, index: number) => { navigator.clipboard.writeText(text); setCopiedIndex(index); setTimeout(() => setCopiedIndex(null), 2000) }

  const platforms = [{ value: 'instagram', label: 'Instagram' }, { value: 'tiktok', label: 'TikTok' }, { value: 'twitter', label: 'Twitter' }]
  const goals = [{ value: 'comments', label: t.moreComments }, { value: 'shares', label: t.moreShares }, { value: 'saves', label: t.moreSaves }, { value: 'follows', label: t.moreFollows }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">🚀</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.content}</label><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPlaceholder} rows={5} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none resize-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="flex gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.goal}</label><div className="flex flex-wrap gap-2">{goals.map(g => (<button key={g.value} onClick={() => setGoal(g.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${goal === g.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{g.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !content.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>🚀 {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🚀</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              {result.current_score && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-center"><div className="text-sm text-gray-400 mb-1">{t.currentScore}</div><div className="text-3xl font-bold text-purple-400">{result.current_score}/10</div></div>)}
              {result.optimized_versions && (<div className="space-y-3"><div className="text-sm text-purple-400 mb-2">✨ {t.optimized}</div>{result.optimized_versions.map((ver: any, i: number) => (<div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl group"><div className="flex justify-between items-start gap-3 mb-2"><p className="flex-1">{ver.version}</p><button onClick={() => copyText(ver.version, i)} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">{copiedIndex === i ? '✓' : t.copy}</button></div>{ver.expected_lift && <span className="text-xs text-green-400">{ver.expected_lift}</span>}{ver.changes && <div className="flex flex-wrap gap-1 mt-2">{ver.changes.map((c: string, j: number) => (<span key={j} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs">{c}</span>))}</div>}</div>))}</div>)}
              {result.engagement_hooks && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-2">🎣 {t.hooks}</div><ul className="text-sm space-y-1">{result.engagement_hooks.map((hook: string, i: number) => (<li key={i}>• {hook}</li>))}</ul></div>)}
              {result.reply_starters && (<div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"><div className="text-sm text-blue-400 mb-2">💬 {t.replyStarters}</div><ul className="text-sm space-y-1">{result.reply_starters.map((rs: string, i: number) => (<li key={i}>• {rs}</li>))}</ul></div>)}
              {result.hashtag_strategy && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-2"># {t.hashtags}</div><div className="flex flex-wrap gap-2">{result.hashtag_strategy.primary?.map((tag: string, i: number) => (<span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-sm">{tag}</span>))}{result.hashtag_strategy.secondary?.map((tag: string, i: number) => (<span key={i} className="px-2 py-1 bg-white/5 text-gray-400 rounded text-sm">{tag}</span>))}</div></div>)}
              {result.raw && !result.optimized_versions && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
