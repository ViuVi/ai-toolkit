'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', topicLabel: 'Konu/Niş', topicPlaceholder: 'örn: fitness, yemek tarifleri...', platformLabel: 'Platform', btn: 'Hashtag Bul', loading: 'Aranıyor...', copy: 'Kopyala', copied: '✓', copyAll: 'Tümünü Kopyala', primary: 'Ana Hashtag\'ler', secondary: 'İkincil Hashtag\'ler', niche: 'Niş Hashtag\'ler', banned: 'Yasaklı/Riskli', newSearch: 'Yeni Arama' },
  en: { back: 'Dashboard', topicLabel: 'Topic/Niche', topicPlaceholder: 'e.g., fitness, recipes...', platformLabel: 'Platform', btn: 'Find Hashtags', loading: 'Searching...', copy: 'Copy', copied: '✓', copyAll: 'Copy All', primary: 'Primary Hashtags', secondary: 'Secondary Hashtags', niche: 'Niche Hashtags', banned: 'Banned/Risky', newSearch: 'New Search' },
  ru: { back: 'Панель', topicLabel: 'Тема', topicPlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', btn: 'Найти', loading: 'Поиск...', copy: 'Копировать', copied: '✓', copyAll: 'Копировать все', primary: 'Основные', secondary: 'Вторичные', niche: 'Нишевые', banned: 'Запрещённые', newSearch: 'Новый' },
  de: { back: 'Dashboard', topicLabel: 'Thema', topicPlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', btn: 'Suchen', loading: 'Suche...', copy: 'Kopieren', copied: '✓', copyAll: 'Alle kopieren', primary: 'Primäre', secondary: 'Sekundäre', niche: 'Nischen', banned: 'Verboten', newSearch: 'Neu' },
  fr: { back: 'Tableau', topicLabel: 'Sujet', topicPlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', btn: 'Rechercher', loading: 'Recherche...', copy: 'Copier', copied: '✓', copyAll: 'Tout copier', primary: 'Primaires', secondary: 'Secondaires', niche: 'Niche', banned: 'Interdits', newSearch: 'Nouveau' }
}

export default function HashtagResearchPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else { setUser(user); supabase.from('credits').select('balance').eq('user_id', user.id).single().then(({ data }) => setCredits(data?.balance || 0)) }
    })
  }, [])

  const handleSubmit = async () => {
    if (!topic.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/hashtag-research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // if (credits >= X) { // await supabase.from("credits").update({ balance: credits - 3 }).eq('user_id', user.id); // setCredits(prev => prev - X) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500) }

  const copyAllHashtags = () => {
    const all = [
      ...(result.primary_hashtags || []),
      ...(result.secondary_hashtags || []),
      ...(result.niche_hashtags || [])
    ].join(' ')
    copyText('all', all)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">#️⃣</span><h1 className="font-semibold">Hashtag Research</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400 text-sm">✦</span><span className="font-medium">{credits}</span></div>
            <div className="relative group">
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter/X</option>
                </select>
              </div>
              <button onClick={handleSubmit} disabled={loading || !topic.trim() || credits < 3} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 3 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={copyAllHashtags} className={`px-4 py-2 rounded-lg text-sm transition ${copiedKey === 'all' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'}`}>{copiedKey === 'all' ? t.copied : t.copyAll}</button>
            </div>

            {/* Primary */}
            {result.primary_hashtags?.length > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                <h3 className="text-green-400 font-semibold mb-3">🎯 {t.primary}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.primary_hashtags.map((h: string, i: number) => <span key={i} className="px-3 py-1.5 bg-green-500/10 text-green-300 rounded-full text-sm cursor-pointer hover:bg-green-500/20" onClick={() => copyText(`p-${i}`, h)}>{h}</span>)}
                </div>
              </div>
            )}

            {/* Secondary */}
            {result.secondary_hashtags?.length > 0 && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                <h3 className="text-blue-400 font-semibold mb-3">📈 {t.secondary}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.secondary_hashtags.map((h: string, i: number) => <span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-sm cursor-pointer hover:bg-blue-500/20" onClick={() => copyText(`s-${i}`, h)}>{h}</span>)}
                </div>
              </div>
            )}

            {/* Niche */}
            {result.niche_hashtags?.length > 0 && (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
                <h3 className="text-purple-400 font-semibold mb-3">💎 {t.niche}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.niche_hashtags.map((h: string, i: number) => <span key={i} className="px-3 py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-sm cursor-pointer hover:bg-purple-500/20" onClick={() => copyText(`n-${i}`, h)}>{h}</span>)}
                </div>
              </div>
            )}

            {/* Banned */}
            {result.banned_hashtags?.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                <h3 className="text-red-400 font-semibold mb-3">⚠️ {t.banned}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.banned_hashtags.map((h: string, i: number) => <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-300 rounded-full text-sm line-through opacity-50">{h}</span>)}
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newSearch}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
