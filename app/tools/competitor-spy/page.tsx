'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', competitorLabel: 'Rakip Hesabı', competitorPlaceholder: '@kullaniciadi veya hesap açıklaması', platformLabel: 'Platform', nicheLabel: 'Niş', btn: 'Analiz Et', loading: 'Analiz ediliyor...', overview: 'Genel Bakış', topContent: 'En İyi İçerikler', strategy: 'Strateji Analizi', weaknesses: 'Zayıf Noktalar', newAnalysis: 'Yeni Analiz' },
  en: { back: 'Dashboard', competitorLabel: 'Competitor Account', competitorPlaceholder: '@username or account description', platformLabel: 'Platform', nicheLabel: 'Niche', btn: 'Analyze', loading: 'Analyzing...', overview: 'Overview', topContent: 'Top Content', strategy: 'Strategy Analysis', weaknesses: 'Weaknesses', newAnalysis: 'New Analysis' },
  ru: { back: 'Панель', competitorLabel: 'Конкурент', competitorPlaceholder: '@username', platformLabel: 'Платформа', nicheLabel: 'Ниша', btn: 'Анализ', loading: 'Анализ...', overview: 'Обзор', topContent: 'Лучший контент', strategy: 'Стратегия', weaknesses: 'Слабости', newAnalysis: 'Новый' },
  de: { back: 'Dashboard', competitorLabel: 'Konkurrent', competitorPlaceholder: '@username', platformLabel: 'Plattform', nicheLabel: 'Nische', btn: 'Analysieren', loading: 'Analyse...', overview: 'Übersicht', topContent: 'Top Inhalte', strategy: 'Strategie', weaknesses: 'Schwächen', newAnalysis: 'Neu' },
  fr: { back: 'Tableau', competitorLabel: 'Concurrent', competitorPlaceholder: '@username', platformLabel: 'Plateforme', nicheLabel: 'Niche', btn: 'Analyser', loading: 'Analyse...', overview: 'Aperçu', topContent: 'Meilleur contenu', strategy: 'Stratégie', weaknesses: 'Faiblesses', newAnalysis: 'Nouveau' }
}

export default function CompetitorSpyPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [competitor, setCompetitor] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [niche, setNiche] = useState('')
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
    if (!competitor.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/competitor-spy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ competitor, platform, niche, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // if (credits >= X) { // await supabase.from("credits").update({ balance: credits - 8 }).eq('user_id', user.id); // setCredits(prev => prev - X) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">🕵️</span><h1 className="font-semibold">Competitor Spy</h1></div>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.competitorLabel}</label>
                <input type="text" value={competitor} onChange={e => setCompetitor(e.target.value)} placeholder={t.competitorPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" />
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
                  <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                  <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder="örn: fitness" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !competitor.trim() || credits < 8} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 8 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview */}
            {result.profile_analysis && (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5">
                <h3 className="text-purple-400 font-semibold mb-3">📊 {t.overview}</h3>
                <p className="text-gray-300">{result.profile_analysis}</p>
              </div>
            )}

            {/* Top Content */}
            {result.top_performing_content?.length > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-semibold mb-4">🏆 {t.topContent}</h3>
                <div className="space-y-3">
                  {result.top_performing_content.map((content: any, i: number) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4">
                      <h4 className="font-medium text-white mb-2">{content.title || content.topic}</h4>
                      {content.why_it_works && <p className="text-gray-500 text-sm">{content.why_it_works}</p>}
                      {content.engagement && <span className="text-xs text-green-400 mt-2 inline-block">{content.engagement}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy */}
            {result.content_strategy && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                <h3 className="text-blue-400 font-semibold mb-3">🎯 {t.strategy}</h3>
                <p className="text-gray-300">{typeof result.content_strategy === 'string' ? result.content_strategy : result.content_strategy.summary}</p>
              </div>
            )}

            {/* Weaknesses */}
            {result.weaknesses?.length > 0 && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">
                <h3 className="text-yellow-400 font-semibold mb-3">💡 {t.weaknesses}</h3>
                <ul className="space-y-2">
                  {result.weaknesses.map((w: string, i: number) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-yellow-400">→</span>{w}</li>)}
                </ul>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newAnalysis}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
