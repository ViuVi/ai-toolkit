'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', contentLabel: 'Mevcut İçerik', contentPlaceholder: 'İyileştirmek istediğiniz caption veya içeriği yapıştırın...', platformLabel: 'Platform', goalLabel: 'Hedef', btn: 'İyileştir', loading: 'İyileştiriliyor...', copy: 'Kopyala', copied: '✓', improved: 'İyileştirilmiş Versiyon', hooks: 'Alternatif Hook\'lar', ctas: 'CTA Önerileri', tips: 'Engagement İpuçları', newBoost: 'Yeni İyileştirme' },
  en: { back: 'Dashboard', contentLabel: 'Current Content', contentPlaceholder: 'Paste the caption or content you want to improve...', platformLabel: 'Platform', goalLabel: 'Goal', btn: 'Boost', loading: 'Boosting...', copy: 'Copy', copied: '✓', improved: 'Improved Version', hooks: 'Alternative Hooks', ctas: 'CTA Suggestions', tips: 'Engagement Tips', newBoost: 'New Boost' },
  ru: { back: 'Панель', contentLabel: 'Контент', contentPlaceholder: 'Вставьте контент...', platformLabel: 'Платформа', goalLabel: 'Цель', btn: 'Улучшить', loading: 'Улучшение...', copy: 'Копировать', copied: '✓', improved: 'Улучшенная версия', hooks: 'Хуки', ctas: 'CTA', tips: 'Советы', newBoost: 'Новый' },
  de: { back: 'Dashboard', contentLabel: 'Inhalt', contentPlaceholder: 'Inhalt einfügen...', platformLabel: 'Plattform', goalLabel: 'Ziel', btn: 'Verbessern', loading: 'Verbessere...', copy: 'Kopieren', copied: '✓', improved: 'Verbesserte Version', hooks: 'Hooks', ctas: 'CTAs', tips: 'Tipps', newBoost: 'Neu' },
  fr: { back: 'Tableau', contentLabel: 'Contenu', contentPlaceholder: 'Collez le contenu...', platformLabel: 'Plateforme', goalLabel: 'Objectif', btn: 'Améliorer', loading: 'Amélioration...', copy: 'Copier', copied: '✓', improved: 'Version améliorée', hooks: 'Hooks', ctas: 'CTAs', tips: 'Conseils', newBoost: 'Nouveau' }
}

export default function EngagementBoosterPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [goal, setGoal] = useState('engagement')
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
    if (!content.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/engagement-booster', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platform, goal, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        if (credits >= 4) { await supabase.from('credits').update({ balance: credits - 4 }).eq('user_id', user.id); setCredits(prev => prev - 4) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500) }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">🚀</span><h1 className="font-semibold">Engagement Booster</h1></div>
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
                <label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.goalLabel}</label>
                  <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="engagement">💬 Engagement</option>
                    <option value="saves">📌 Saves</option>
                    <option value="shares">🔄 Shares</option>
                    <option value="followers">👥 Followers</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !content.trim() || credits < 4} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 4 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Improved Version */}
            {result.improved_content && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-green-400 font-semibold">✨ {t.improved}</h3>
                  <button onClick={() => copyText('improved', result.improved_content)} className={`px-3 py-1.5 rounded-lg text-sm ${copiedKey === 'improved' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>{copiedKey === 'improved' ? t.copied : t.copy}</button>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white whitespace-pre-wrap">{result.improved_content}</p>
                </div>
              </div>
            )}

            {/* Hooks */}
            {result.alternative_hooks?.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                <h3 className="text-red-400 font-semibold mb-3">🎣 {t.hooks}</h3>
                <div className="space-y-2">
                  {result.alternative_hooks.map((h: string, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                      <p className="text-white text-sm">{h}</p>
                      <button onClick={() => copyText(`hook-${i}`, h)} className="text-xs text-red-400 ml-2">{copiedKey === `hook-${i}` ? t.copied : t.copy}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            {result.cta_suggestions?.length > 0 && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                <h3 className="text-blue-400 font-semibold mb-3">📢 {t.ctas}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.cta_suggestions.map((cta: string, i: number) => <span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-sm cursor-pointer hover:bg-blue-500/20" onClick={() => copyText(`cta-${i}`, cta)}>{cta}</span>)}
                </div>
              </div>
            )}

            {/* Tips */}
            {result.engagement_tips?.length > 0 && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
                <h3 className="text-yellow-400 font-semibold mb-3">💡 {t.tips}</h3>
                <ul className="space-y-2">{result.engagement_tips.map((tip: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {tip}</li>)}</ul>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newBoost}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
