'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 8
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'İçerik Dönüştürücü', content: 'Orijinal İçerik', contentPlaceholder: 'Blog yazısı, video scripti veya makale yapıştırın...', sourceFormat: 'Kaynak Format', targetPlatforms: 'Hedef Platformlar', generate: 'Dönüştür', generating: 'Dönüştürülüyor...', copy: 'Kopyala', emptyTitle: 'İçerik Dönüştürme', emptyDesc: 'İçeriğinizi girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', blog: 'Blog Yazısı', video: 'Video Script', podcast: 'Podcast', article: 'Makale', repurposed: 'Dönüştürülmüş İçerik', atoms: 'İçerik Atomları', distribution: 'Dağıtım Planı', ideas: 'Ek Fikirler' },
  en: { title: 'Content Repurposer', content: 'Original Content', contentPlaceholder: 'Paste your blog post, video script or article...', sourceFormat: 'Source Format', targetPlatforms: 'Target Platforms', generate: 'Repurpose', generating: 'Repurposing...', copy: 'Copy', emptyTitle: 'Content Repurposing', emptyDesc: 'Enter your content', insufficientCredits: 'Insufficient credits', error: 'Error', blog: 'Blog Post', video: 'Video Script', podcast: 'Podcast', article: 'Article', repurposed: 'Repurposed Content', atoms: 'Content Atoms', distribution: 'Distribution Plan', ideas: 'Additional Ideas' },
  ru: { title: 'Конвертер Контента', content: 'Оригинальный Контент', contentPlaceholder: 'Вставьте блог, скрипт или статью...', sourceFormat: 'Исходный Формат', targetPlatforms: 'Целевые Платформы', generate: 'Конвертировать', generating: 'Конвертируем...', copy: 'Копировать', emptyTitle: 'Конвертация Контента', emptyDesc: 'Введите контент', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', blog: 'Блог', video: 'Видео Скрипт', podcast: 'Подкаст', article: 'Статья', repurposed: 'Конвертированный Контент', atoms: 'Атомы Контента', distribution: 'План Распространения', ideas: 'Дополнительные Идеи' },
  de: { title: 'Content-Recycler', content: 'Original-Inhalt', contentPlaceholder: 'Blog-Post, Video-Script oder Artikel einfügen...', sourceFormat: 'Quellformat', targetPlatforms: 'Zielplattformen', generate: 'Umwandeln', generating: 'Umwandeln...', copy: 'Kopieren', emptyTitle: 'Content-Umwandlung', emptyDesc: 'Inhalt eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', blog: 'Blog-Post', video: 'Video-Script', podcast: 'Podcast', article: 'Artikel', repurposed: 'Umgewandelter Content', atoms: 'Content-Atome', distribution: 'Verteilungsplan', ideas: 'Weitere Ideen' },
  fr: { title: 'Recycleur de Contenu', content: 'Contenu Original', contentPlaceholder: 'Collez votre article, script ou podcast...', sourceFormat: 'Format Source', targetPlatforms: 'Plateformes Cibles', generate: 'Recycler', generating: 'Recyclage...', copy: 'Copier', emptyTitle: 'Recyclage de Contenu', emptyDesc: 'Entrez votre contenu', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', blog: 'Article de Blog', video: 'Script Vidéo', podcast: 'Podcast', article: 'Article', repurposed: 'Contenu Recyclé', atoms: 'Atomes de Contenu', distribution: 'Plan de Distribution', ideas: 'Idées Supplémentaires' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function ContentRepurposerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [sourceFormat, setSourceFormat] = useState('blog')
  const [targetPlatforms, setTargetPlatforms] = useState(['tiktok', 'instagram'])
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const togglePlatform = (p: string) => { setTargetPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]) }

  const handleGenerate = async () => {
    if (!content.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/content-repurposer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, sourceFormat, targetPlatforms, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const copyText = (text: string, index: number) => { navigator.clipboard.writeText(text); setCopiedIndex(index); setTimeout(() => setCopiedIndex(null), 2000) }

  const sources = [{ value: 'blog', label: t.blog }, { value: 'video', label: t.video }, { value: 'podcast', label: t.podcast }, { value: 'article', label: t.article }]
  const platforms = [{ value: 'tiktok', label: 'TikTok' }, { value: 'instagram', label: 'Instagram' }, { value: 'twitter', label: 'Twitter' }, { value: 'linkedin', label: 'LinkedIn' }, { value: 'youtube', label: 'YouTube' }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">♻️</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.content}</label><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPlaceholder} rows={6} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none resize-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.sourceFormat}</label><div className="flex flex-wrap gap-2">{sources.map(s => (<button key={s.value} onClick={() => setSourceFormat(s.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${sourceFormat === s.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{s.label}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.targetPlatforms}</label><div className="flex flex-wrap gap-2">{platforms.map(p => (<button key={p.value} onClick={() => togglePlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${targetPlatforms.includes(p.value) ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !content.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>♻️ {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">♻️</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              {result.repurposed && (<div className="space-y-3 max-h-[50vh] overflow-y-auto"><div className="text-sm text-purple-400 mb-2">✨ {t.repurposed}</div>{result.repurposed.map((item: any, i: number) => (<div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl group"><div className="flex justify-between items-start gap-3 mb-2"><div><span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded">{item.platform}</span><span className="text-xs text-gray-500 ml-2">{item.format}</span></div><button onClick={() => copyText(item.content, i)} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">{copiedIndex === i ? '✓' : t.copy}</button></div><p className="text-sm mb-2">{item.content}</p>{item.hook && <p className="text-xs text-yellow-400 mb-2">🎣 {item.hook}</p>}{item.hashtags && <div className="flex flex-wrap gap-1">{item.hashtags.map((tag: string, j: number) => (<span key={j} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs">{tag}</span>))}</div>}</div>))}</div>)}
              {result.content_atoms && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-2">⚛️ {t.atoms}</div><ul className="text-sm space-y-1">{result.content_atoms.map((atom: string, i: number) => (<li key={i}>• {atom}</li>))}</ul></div>)}
              {result.distribution_plan && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-2">📅 {t.distribution}</div><div className="space-y-1">{Object.entries(result.distribution_plan).map(([day, plan]: [string, any]) => (<div key={day} className="text-xs"><span className="text-gray-400">{day}:</span> <span>{plan}</span></div>))}</div></div>)}
              {result.additional_ideas && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-2">💡 {t.ideas}</div><ul className="text-sm space-y-1">{result.additional_ideas.map((idea: string, i: number) => (<li key={i}>• {idea}</li>))}</ul></div>)}
              {result.raw && !result.repurposed && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
