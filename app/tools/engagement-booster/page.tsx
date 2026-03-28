'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Engagement Arttırıcı', niche: 'Niş', nichePlaceholder: 'örn: Fitness, E-ticaret...', contentType: 'İçerik Türü', platform: 'Platform', generate: 'Engagement Arttır', generating: 'Üretiliyor...', emptyTitle: 'Engagement Booster', emptyDesc: 'Sorular, CTA'lar ve engagement taktikleri', video: 'Video', post: 'Post', story: 'Story', carousel: 'Carousel', questions: 'Sorular', ctas: "CTA'lar", commentStarters: 'Yorum Başlatıcılar', saveTriggers: 'Kaydet Tetikleyiciler', shareTriggers: 'Paylaş Tetikleyiciler' },
  en: { title: 'Engagement Booster', niche: 'Niche', nichePlaceholder: 'e.g: Fitness, E-commerce...', contentType: 'Content Type', platform: 'Platform', generate: 'Boost Engagement', generating: 'Generating...', emptyTitle: 'Engagement Booster', emptyDesc: 'Questions, CTAs and engagement tactics', video: 'Video', post: 'Post', story: 'Story', carousel: 'Carousel', questions: 'Questions', ctas: 'CTAs', commentStarters: 'Comment Starters', saveTriggers: 'Save Triggers', shareTriggers: 'Share Triggers' },
  ru: { title: 'Усилитель вовлечённости', niche: 'Ниша', nichePlaceholder: 'напр: Фитнес, Е-коммерция...', contentType: 'Тип контента', platform: 'Платформа', generate: 'Повысить вовлечённость', generating: 'Генерация...', emptyTitle: 'Усилитель вовлечённости', emptyDesc: 'Вопросы, CTA и тактики вовлечения', video: 'Видео', post: 'Пост', story: 'Сторис', carousel: 'Карусель', questions: 'Вопросы', ctas: 'CTA', commentStarters: 'Стартеры комментариев', saveTriggers: 'Триггеры сохранения', shareTriggers: 'Триггеры репоста' },
  de: { title: 'Engagement-Booster', niche: 'Nische', nichePlaceholder: 'z.B: Fitness, E-Commerce...', contentType: 'Inhaltstyp', platform: 'Plattform', generate: 'Engagement steigern', generating: 'Wird erstellt...', emptyTitle: 'Engagement-Booster', emptyDesc: 'Fragen, CTAs und Engagement-Taktiken', video: 'Video', post: 'Post', story: 'Story', carousel: 'Karussell', questions: 'Fragen', ctas: 'CTAs', commentStarters: 'Kommentar-Starter', saveTriggers: 'Speicher-Trigger', shareTriggers: 'Teilen-Trigger' },
  fr: { title: "Booster d'engagement", niche: 'Niche', nichePlaceholder: 'ex: Fitness, E-commerce...', contentType: 'Type de contenu', platform: 'Plateforme', generate: "Booster l'engagement", generating: 'Génération...', emptyTitle: "Booster d'engagement", emptyDesc: "Questions, CTAs et tactiques d'engagement", video: 'Vidéo', post: 'Post', story: 'Story', carousel: 'Carrousel', questions: 'Questions', ctas: 'CTAs', commentStarters: 'Starters de commentaires', saveTriggers: 'Déclencheurs de sauvegarde', shareTriggers: 'Déclencheurs de partage' }
}

export default function EngagementBoosterPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [contentType, setContentType] = useState('video')
  const [platform, setPlatform] = useState('instagram')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = toolTexts[language] || toolTexts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else {
        setUser(session.user)
        supabase.from('credits').select('balance').eq('user_id', session.user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [router])

  const handleGenerate = async () => {
    if (!niche.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/engagement-booster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, contentType, platform, language, userId: user.id })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">🚀 {t.title}</h1>
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
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.niche}</label>
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder || "e.g: Fitness, E-commerce..."} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.contentType}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['video', '🎬 Video'], ['post', '📷 Post'], ['story', '📱 Story'], ['carousel', '🎠 Carousel']].map(([val, label]) => (
                    <button key={val} onClick={() => setContentType(val)} className={`p-2 rounded-xl border text-sm ${contentType === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {['instagram', 'tiktok', 'youtube', 'twitter'].map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-2 rounded-xl border text-sm capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerate} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : '🚀 Engagement Arttır'}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🚀</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {/* Questions */}
                {result.questions && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-3">{`❓ ${t.questions} (10)`}</h4>
                    <div className="space-y-2">
                      {result.questions.map((q: any, i: number) => (
                        <div key={i} className="p-2 bg-white/5 rounded-lg flex justify-between items-start">
                          <p className="text-sm text-gray-300">{q.question || q}</p>
                          {q.type && <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded shrink-0 ml-2">{q.type}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Lines */}
                {result.cta_lines && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-semibold text-green-400 mb-3">👉 {t.ctas} (5)</h4>
                    <div className="space-y-2">
                      {result.cta_lines.map((c: any, i: number) => (
                        <div key={i} className="p-2 bg-white/5 rounded-lg">
                          <p className="text-sm text-gray-300">{c.cta || c}</p>
                          {c.type && <span className="text-xs text-gray-500">{c.type}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comment Starters */}
                {result.comment_starters && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <h4 className="font-semibold text-orange-400 mb-3">{`💬 ${t.commentStarters}`}</h4>
                    <div className="space-y-1">
                      {result.comment_starters.map((c: string, i: number) => (
                        <p key={i} className="text-sm text-gray-300">• {c}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Triggers */}
                {result.save_triggers && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <h4 className="font-semibold text-blue-400 mb-3">{`🔖 ${t.saveTriggers}`}</h4>
                    <div className="space-y-1">
                      {result.save_triggers.map((s: string, i: number) => (
                        <p key={i} className="text-sm text-gray-300">• {s}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Triggers */}
                {result.share_triggers && (
                  <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                    <h4 className="font-semibold text-pink-400 mb-3">{`📤 ${t.shareTriggers}`}</h4>
                    <div className="space-y-1">
                      {result.share_triggers.map((s: string, i: number) => (
                        <p key={i} className="text-sm text-gray-300">• {s}</p>
                      ))}
                    </div>
                  </div>
                )}

                {result.raw && !result.questions && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
