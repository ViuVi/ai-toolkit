'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', contentLabel: 'İçerik', contentPlaceholder: 'Analiz etmek istediğiniz içeriği yapıştırın...', platformLabel: 'Platform', nicheLabel: 'Niş', nichePlaceholder: 'örn: fitness, teknoloji...', btn: 'Analiz Et', loading: 'Analiz ediliyor...', copy: 'Kopyala', copied: '✓', score: 'Viral Skor', strengths: 'Güçlü Yönler', weaknesses: 'Geliştirme Alanları', improvements: 'İyileştirme Önerileri', suggestedHook: 'Önerilen Hook', hashtags: 'Önerilen Hashtags', newAnalysis: 'Yeni Analiz' },
  en: { back: 'Dashboard', contentLabel: 'Content', contentPlaceholder: 'Paste the content you want to analyze...', platformLabel: 'Platform', nicheLabel: 'Niche', nichePlaceholder: 'e.g., fitness, tech...', btn: 'Analyze', loading: 'Analyzing...', copy: 'Copy', copied: '✓', score: 'Viral Score', strengths: 'Strengths', weaknesses: 'Weaknesses', improvements: 'Improvements', suggestedHook: 'Suggested Hook', hashtags: 'Suggested Hashtags', newAnalysis: 'New Analysis' },
  ru: { back: 'Панель', contentLabel: 'Контент', contentPlaceholder: 'Вставьте контент...', platformLabel: 'Платформа', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', btn: 'Анализ', loading: 'Анализ...', copy: 'Копировать', copied: '✓', score: 'Вирусность', strengths: 'Сильные', weaknesses: 'Слабые', improvements: 'Улучшения', suggestedHook: 'Хук', hashtags: 'Хештеги', newAnalysis: 'Новый' },
  de: { back: 'Dashboard', contentLabel: 'Inhalt', contentPlaceholder: 'Inhalt einfügen...', platformLabel: 'Plattform', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', btn: 'Analysieren', loading: 'Analyse...', copy: 'Kopieren', copied: '✓', score: 'Viral Score', strengths: 'Stärken', weaknesses: 'Schwächen', improvements: 'Verbesserungen', suggestedHook: 'Hook', hashtags: 'Hashtags', newAnalysis: 'Neu' },
  fr: { back: 'Tableau', contentLabel: 'Contenu', contentPlaceholder: 'Collez le contenu...', platformLabel: 'Plateforme', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', btn: 'Analyser', loading: 'Analyse...', copy: 'Copier', copied: '✓', score: 'Score Viral', strengths: 'Forces', weaknesses: 'Faiblesses', improvements: 'Améliorations', suggestedHook: 'Hook', hashtags: 'Hashtags', newAnalysis: 'Nouveau' }
}

export default function ViralAnalyzerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [niche, setNiche] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else {
        setUser(user)
        supabase.from('credits').select('balance').eq('user_id', user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [])

  const handleSubmit = async () => {
    if (!content.trim() || loading) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/viral-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform, niche, language })
      })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // if (credits >= X) {
          // await supabase.from("credits").update({ balance: credits - 5 }).eq('user_id', user.id)
          // setCredits(prev => prev - X)
        // }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const getScoreColor = (score: number) => score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : score >= 40 ? 'text-orange-400' : 'text-red-400'
  const getScoreBg = (score: number) => score >= 80 ? 'from-green-500 to-emerald-500' : score >= 60 ? 'from-yellow-500 to-orange-500' : score >= 40 ? 'from-orange-500 to-red-500' : 'from-red-500 to-red-600'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">🔬</span><h1 className="font-semibold">Viral Analyzer</h1></div>
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
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                  <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !content.trim() || credits < 5} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 5 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score Card */}
            <div className={`bg-gradient-to-r ${getScoreBg(result.score)} p-[1px] rounded-2xl`}>
              <div className="bg-[#0a0a0f] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">{t.score}</div>
                    <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>{result.score}<span className="text-2xl text-gray-500">/100</span></div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-semibold ${getScoreColor(result.score)}`}>{result.verdict}</div>
                    {result.summary && <p className="text-gray-400 text-sm mt-1 max-w-xs">{result.summary}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            {result.breakdown && (
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">📊 Detaylı Analiz</h3>
                <div className="space-y-4">
                  {Object.entries(result.breakdown).map(([key, val]: [string, any]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className={`font-semibold ${getScoreColor(val.score)}`}>{val.score}</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${getScoreBg(val.score)} rounded-full transition-all`} style={{width: `${val.score}%`}}></div>
                      </div>
                      {val.analysis && <p className="text-gray-500 text-xs mt-1">{val.analysis}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-4">
              {result.strengths?.length > 0 && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                  <h3 className="text-green-400 font-semibold mb-3">✅ {t.strengths}</h3>
                  <ul className="space-y-2">{result.strengths.map((s: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {s}</li>)}</ul>
                </div>
              )}
              {result.weaknesses?.length > 0 && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                  <h3 className="text-red-400 font-semibold mb-3">⚠️ {t.weaknesses}</h3>
                  <ul className="space-y-2">{result.weaknesses.map((w: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {w}</li>)}</ul>
                </div>
              )}
            </div>

            {/* Suggested Hook */}
            {result.rewritten_hook && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-yellow-400 font-semibold">🎣 {t.suggestedHook}</h3>
                  <button onClick={() => copyText('hook', result.rewritten_hook)} className="text-xs text-yellow-400">{copiedKey === 'hook' ? t.copied : t.copy}</button>
                </div>
                <p className="text-white text-lg">{result.rewritten_hook}</p>
              </div>
            )}

            {/* Hashtags */}
            {result.best_hashtags?.length > 0 && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-blue-400 font-semibold">🏷️ {t.hashtags}</h3>
                  <button onClick={() => copyText('tags', result.best_hashtags.join(' '))} className="text-xs text-blue-400">{copiedKey === 'tags' ? t.copied : t.copy}</button>
                </div>
                <div className="flex flex-wrap gap-2">{result.best_hashtags.map((h: string, i: number) => <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm">{h}</span>)}</div>
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
