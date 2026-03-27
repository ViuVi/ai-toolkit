'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 5

const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Video Fikir Bulucu', niche: 'Niş / Konu', nichePlaceholder: 'örn: Fitness, Teknoloji...', platform: 'Platform', contentType: 'İçerik Tipi', generate: 'Fikirler Bul', generating: 'Aranıyor...', copy: 'Kopyala', copied: '✓', emptyTitle: 'Video Fikirleri', emptyDesc: 'Nişinizi girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', all: 'Tümü', tutorial: 'Eğitim', entertainment: 'Eğlence', review: 'İnceleme', trends: 'Trend Açıları', gaps: 'İçerik Boşlukları', postingTimes: 'Paylaşım Zamanları' },
  en: { title: 'Video Idea Finder', niche: 'Niche / Topic', nichePlaceholder: 'e.g: Fitness, Technology...', platform: 'Platform', contentType: 'Content Type', generate: 'Find Ideas', generating: 'Searching...', copy: 'Copy', copied: '✓', emptyTitle: 'Video Ideas', emptyDesc: 'Enter your niche', insufficientCredits: 'Insufficient credits', error: 'Error', all: 'All', tutorial: 'Tutorial', entertainment: 'Entertainment', review: 'Review', trends: 'Trending Angles', gaps: 'Content Gaps', postingTimes: 'Best Posting Times' },
  ru: { title: 'Поиск Идей для Видео', niche: 'Ниша / Тема', nichePlaceholder: 'напр: Фитнес, Технологии...', platform: 'Платформа', contentType: 'Тип Контента', generate: 'Найти Идеи', generating: 'Ищем...', copy: 'Копировать', copied: '✓', emptyTitle: 'Идеи для Видео', emptyDesc: 'Введите нишу', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', all: 'Все', tutorial: 'Обучение', entertainment: 'Развлечение', review: 'Обзор', trends: 'Тренды', gaps: 'Пробелы в Контенте', postingTimes: 'Лучшее Время' },
  de: { title: 'Video-Ideen Finder', niche: 'Nische / Thema', nichePlaceholder: 'z.B: Fitness, Technologie...', platform: 'Plattform', contentType: 'Content-Typ', generate: 'Ideen Finden', generating: 'Suchen...', copy: 'Kopieren', copied: '✓', emptyTitle: 'Video-Ideen', emptyDesc: 'Nische eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', all: 'Alle', tutorial: 'Tutorial', entertainment: 'Unterhaltung', review: 'Review', trends: 'Trends', gaps: 'Content-Lücken', postingTimes: 'Beste Zeiten' },
  fr: { title: 'Recherche d\'Idées Vidéo', niche: 'Niche / Sujet', nichePlaceholder: 'ex: Fitness, Tech...', platform: 'Plateforme', contentType: 'Type de Contenu', generate: 'Trouver des Idées', generating: 'Recherche...', copy: 'Copier', copied: '✓', emptyTitle: 'Idées Vidéo', emptyDesc: 'Entrez votre niche', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', all: 'Tous', tutorial: 'Tutoriel', entertainment: 'Divertissement', review: 'Avis', trends: 'Tendances', gaps: 'Lacunes', postingTimes: 'Meilleurs Moments' }
}

const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function VideoFinderPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [contentType, setContentType] = useState('all')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) }
    })
  }, [router])

  const handleGenerate = async () => {
    if (!niche.trim() || loading || !user) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/video-finder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, contentType, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const copyIdea = (text: string, index: number) => { navigator.clipboard.writeText(text); setCopiedIndex(index); setTimeout(() => setCopiedIndex(null), 2000) }

  const platforms = [{ value: 'tiktok', label: 'TikTok', icon: '🎵' }, { value: 'youtube', label: 'YouTube', icon: '🎬' }, { value: 'instagram', label: 'Instagram', icon: '📸' }]
  const types = [{ value: 'all', label: t.all }, { value: 'tutorial', label: t.tutorial }, { value: 'entertainment', label: t.entertainment }, { value: 'review', label: t.review }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link>
            <div className="flex items-center gap-2"><span className="text-2xl">🔍</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button>
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}
              </div>
            </div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div><label className="block text-sm text-gray-400 mb-2">{t.niche}</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none transition" /></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="flex gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>{p.icon} {p.label}</button>))}</div></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.contentType}</label><div className="flex flex-wrap gap-2">{types.map(ty => (<button key={ty.value} onClick={() => setContentType(ty.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${contentType === ty.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>{ty.label}</button>))}</div></div>
              <button onClick={handleGenerate} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>🔍 {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🔍</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              <div className="max-h-[50vh] overflow-y-auto space-y-3">{result.video_ideas?.map((idea: any, index: number) => (<div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-purple-500/30 transition group"><div className="flex justify-between items-start gap-3 mb-2"><h3 className="font-medium text-purple-400">{idea.title}</h3><button onClick={() => copyIdea(idea.title, index)} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">{copiedIndex === index ? '✓' : t.copy}</button></div>{idea.hook && <p className="text-sm text-gray-400 mb-2">🎣 {idea.hook}</p>}<div className="flex flex-wrap gap-2 text-xs">{idea.format && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">{idea.format}</span>}{idea.difficulty && <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded">{idea.difficulty}</span>}{idea.estimated_views && <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded">{idea.estimated_views}</span>}</div></div>))}</div>
              {result.trending_angles && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-2">📈 {t.trends}</div><div className="flex flex-wrap gap-2">{result.trending_angles.map((angle: string, i: number) => (<span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm">{angle}</span>))}</div></div>)}
              {result.content_gaps && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-2">🎯 {t.gaps}</div><ul className="text-sm space-y-1">{result.content_gaps.map((gap: string, i: number) => (<li key={i}>• {gap}</li>))}</ul></div>)}
              {result.best_posting_times && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-2">⏰ {t.postingTimes}</div><p className="text-sm">{result.best_posting_times.join(' • ')}</p></div>)}
              {result.raw && !result.video_ideas?.length && (<div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl"><pre className="whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre></div>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
