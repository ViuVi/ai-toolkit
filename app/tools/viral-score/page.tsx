'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Viral Skor Tahmincisi', content: 'İçeriğini yaz', contentPlaceholder: 'Hook, caption veya script yazın... Anlık skor hesaplanacak', platform: 'Platform', optimize: 'AI ile Optimize Et', optimizing: 'Optimize Ediliyor...', score: 'Viral Skor', live: 'CANLI', hook: 'Hook Gücü', length: 'Uzunluk', emoji: 'Emoji', question: 'Soru', cta: 'CTA', hashtag: 'Hashtag', readability: 'Okunabilirlik', emptyTitle: 'Anlık Viral Skor', emptyDesc: 'Yazmaya başla, skor canlı hesaplansın' },
  en: { title: 'Viral Score Predictor', content: 'Write your content', contentPlaceholder: 'Write your hook, caption or script... Score updates in real-time', platform: 'Platform', optimize: 'Optimize with AI', optimizing: 'Optimizing...', score: 'Viral Score', live: 'LIVE', hook: 'Hook Power', length: 'Length', emoji: 'Emoji', question: 'Question', cta: 'CTA', hashtag: 'Hashtag', readability: 'Readability', emptyTitle: 'Real-time Viral Score', emptyDesc: 'Start typing to see your live score' },
  ru: { title: 'Предсказатель вирусности', content: 'Напишите контент', contentPlaceholder: 'Напишите хук, подпись или скрипт... Балл обновляется в реальном времени', platform: 'Платформа', optimize: 'Оптимизировать с ИИ', optimizing: 'Оптимизация...', score: 'Вирусный балл', live: 'LIVE', hook: 'Сила хука', length: 'Длина', emoji: 'Эмодзи', question: 'Вопрос', cta: 'CTA', hashtag: 'Хештег', readability: 'Читаемость', emptyTitle: 'Вирусный балл в реальном времени', emptyDesc: 'Начните печатать' },
  de: { title: 'Viral-Score-Prediktor', content: 'Inhalt schreiben', contentPlaceholder: 'Schreiben Sie Ihren Hook, Caption oder Script...', platform: 'Plattform', optimize: 'Mit KI optimieren', optimizing: 'Wird optimiert...', score: 'Viral-Score', live: 'LIVE', hook: 'Hook-Kraft', length: 'Länge', emoji: 'Emoji', question: 'Frage', cta: 'CTA', hashtag: 'Hashtag', readability: 'Lesbarkeit', emptyTitle: 'Echtzeit Viral-Score', emptyDesc: 'Tippen Sie los' },
  fr: { title: 'Prédicteur de viralité', content: 'Écrivez votre contenu', contentPlaceholder: 'Écrivez votre hook, légende ou script...', platform: 'Plateforme', optimize: 'Optimiser avec IA', optimizing: 'Optimisation...', score: 'Score viral', live: 'LIVE', hook: 'Puissance du hook', length: 'Longueur', emoji: 'Emoji', question: 'Question', cta: 'CTA', hashtag: 'Hashtag', readability: 'Lisibilité', emptyTitle: 'Score viral en temps réel', emptyDesc: 'Commencez à écrire' }
}

function calculateViralScore(text: string) {
  if (!text.trim()) return { total: 0, breakdown: {} }

  const scores: Record<string, { score: number; max: number; label: string }> = {}

  // Hook Power (0-20): starts with question, number, "you", power words
  let hookScore = 0
  const firstLine = text.split('\n')[0] || text.substring(0, 80)
  if (/^(how|why|what|when|did you|have you|are you|do you|nasıl|neden|niye)/i.test(firstLine)) hookScore += 8
  if (/^\d/.test(firstLine) || /\d+\s*(ways|steps|tips|things|secrets|adım|yol|ipucu)/i.test(firstLine)) hookScore += 7
  if (/stop|wait|warning|secret|truth|nobody|never|don't|yapma|dur|dikkat|sır|gerçek/i.test(firstLine)) hookScore += 5
  scores.hook = { score: Math.min(hookScore, 20), max: 20, label: 'hook' }

  // Length (0-15): optimal length varies by platform
  const wordCount = text.split(/\s+/).length
  let lengthScore = 0
  if (wordCount >= 10 && wordCount <= 30) lengthScore = 15
  else if (wordCount >= 5 && wordCount <= 50) lengthScore = 10
  else if (wordCount >= 3) lengthScore = 5
  scores.length = { score: lengthScore, max: 15, label: 'length' }

  // Emoji Usage (0-10)
  const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length
  let emojiScore = 0
  if (emojiCount >= 1 && emojiCount <= 5) emojiScore = 10
  else if (emojiCount > 5 && emojiCount <= 10) emojiScore = 7
  else if (emojiCount > 10) emojiScore = 4
  scores.emoji = { score: emojiScore, max: 10, label: 'emoji' }

  // Question Engagement (0-10)
  const questionCount = (text.match(/\?/g) || []).length
  scores.question = { score: Math.min(questionCount * 5, 10), max: 10, label: 'question' }

  // CTA Presence (0-15)
  let ctaScore = 0
  if (/follow|subscribe|like|comment|share|save|link|tap|click|dm|takip|beğen|yorum|paylaş|kaydet|tıkla/i.test(text)) ctaScore += 10
  if (/👇|⬇️|🔗|📩|💬|link in bio|profildeki link/i.test(text)) ctaScore += 5
  scores.cta = { score: Math.min(ctaScore, 15), max: 15, label: 'cta' }

  // Hashtag Strategy (0-10)
  const hashtagCount = (text.match(/#\w+/g) || []).length
  let hashtagScore = 0
  if (hashtagCount >= 3 && hashtagCount <= 10) hashtagScore = 10
  else if (hashtagCount >= 1 && hashtagCount <= 15) hashtagScore = 6
  else if (hashtagCount > 15) hashtagScore = 3
  scores.hashtag = { score: hashtagScore, max: 10, label: 'hashtag' }

  // Readability (0-20): short sentences, line breaks, formatting
  let readScore = 0
  const sentences = text.split(/[.!?\n]+/).filter(s => s.trim())
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / Math.max(sentences.length, 1)
  if (avgSentenceLength <= 15) readScore += 8
  if (text.includes('\n')) readScore += 6
  if (/[A-Z]{2,}|[!]{2,}|💥|🔥|⚡/.test(text)) readScore += 6
  scores.readability = { score: Math.min(readScore, 20), max: 20, label: 'readability' }

  const total = Object.values(scores).reduce((sum, s) => sum + s.score, 0)

  return { total, breakdown: scores }
}

export default function ViralScorePage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [loading, setLoading] = useState(false)
  const [optimized, setOptimized] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = toolTexts[language] || toolTexts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else {
        setUser(session.user)
        setSession(session)
        supabase.from('credits').select('balance').eq('user_id', session.user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [router])

  const liveScore = useMemo(() => calculateViralScore(content), [content])

  const handleOptimize = async () => {
    if (!content.trim() || loading) return
    setLoading(true)
    setError('')
    setOptimized(null)
    try {
      const res = await fetch('/api/viral-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ content, platform, scores: liveScore.breakdown, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setOptimized(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch { setError('Connection error') }
    setLoading(false)
  }

  const getScoreColor = (score: number) => score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'
  const getBarColor = (score: number, max: number) => {
    const pct = (score / max) * 100
    return pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-500'
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">⚡ {t.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {(['en', 'tr', 'ru', 'de', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-gray-400">{t.content}</label>
                {content && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-bold animate-pulse">{t.live}</span>}
              </div>
              <textarea
                value={content} onChange={e => setContent(e.target.value)}
                placeholder={t.contentPlaceholder} rows={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none text-lg"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">{content.split(/\s+/).filter(Boolean).length} words • {content.length} chars</span>
                <div className="flex gap-2">
                  {['tiktok', 'instagram', 'youtube', 'twitter'].map(p => (
                    <button key={p} onClick={() => setPlatform(p)} className={`px-3 py-1 rounded-lg text-xs capitalize ${platform === p ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400' : 'bg-white/5 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleOptimize} disabled={loading || !content.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.optimizing}</> : `🚀 ${t.optimize}`}
            </button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

            {/* AI Optimization Result */}
            {optimized && (
              <div className="space-y-4">
                {optimized.optimized_content && (
                  <div className="p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-green-400">✨ {language === 'tr' ? 'Optimize Edilmiş Versiyon' : 'Optimized Version'}</h3>
                      <button onClick={() => navigator.clipboard.writeText(optimized.optimized_content)} className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">📋</button>
                    </div>
                    <p className="text-gray-200 whitespace-pre-wrap">{optimized.optimized_content}</p>
                    {optimized.predicted_score_after && <p className="mt-3 text-sm text-green-400">📈 {language === 'tr' ? 'Tahmini skor' : 'Predicted score'}: {optimized.predicted_score_after}/100</p>}
                  </div>
                )}
                {optimized.hook_alternatives && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-3">🎯 {language === 'tr' ? 'Alternatif Hooklar' : 'Hook Alternatives'}</h4>
                    {optimized.hook_alternatives.map((h: string, i: number) => (
                      <div key={i} className="p-2 bg-white/5 rounded-lg mb-2 flex justify-between items-center">
                        <span className="text-sm text-gray-300">{h}</span>
                        <button onClick={() => navigator.clipboard.writeText(h)} className="text-xs text-gray-500 hover:text-white">📋</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Score Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Score */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <p className="text-sm text-gray-400 mb-2">{t.score}</p>
              <div className={`text-7xl font-bold ${getScoreColor(liveScore.total)} transition-all`}>
                {liveScore.total}
              </div>
              <p className="text-gray-500 text-sm mt-1">/100</p>
            </div>

            {/* Breakdown */}
            {content.trim() && (
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                {Object.entries(liveScore.breakdown).map(([key, data]: [string, any]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{t[data.label] || data.label}</span>
                      <span className="text-white font-medium">{data.score}/{data.max}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${getBarColor(data.score, data.max)}`} style={{ width: `${(data.score / data.max) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!content.trim() && (
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-medium mb-1">{t.emptyTitle}</h3>
                <p className="text-sm text-gray-500">{t.emptyDesc}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
