'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Content DNA Analyzer', subtitle: 'Viral içeriklerin DNA kodunu çöz', content: 'Viral İçerik', contentPlaceholder: 'Viral olan bir videonun/postun metnini, açıklamasını veya URL bilgisini yapıştırın...', platform: 'Platform', analyze: 'DNA Analiz Et', analyzing: 'DNA Çözümleniyor...', regenerate: 'Bu DNA ile Yeni İçerik Üret', regenerating: 'Yeni İçerik Üretiliyor...', emptyTitle: 'Content DNA Analyzer', emptyDesc: 'Viral bir içeriği yapıştırın, neden viral olduğunu keşfedelim', dnaCode: 'DNA Kodu', viralScore: 'Viral Skor', structure: 'Yapı', hookAnalysis: 'Hook Analizi', emotions: 'Duygusal Tetikleyiciler', pacing: 'Tempo', engagement: 'Etkileşim Mekaniği', cta: 'CTA Analizi', weaknesses: 'Zayıf Noktalar', newContent: 'Yeni İçerik', variations: 'Varyasyonlar', postingStrategy: 'Paylaşım Stratejisi', copy: 'Kopyala', copied: 'Kopyalandı' },
  en: { title: 'Content DNA Analyzer', subtitle: 'Decode the DNA of viral content', content: 'Viral Content', contentPlaceholder: 'Paste the text, description, or URL of a viral video/post...', platform: 'Platform', analyze: 'Analyze DNA', analyzing: 'Decoding DNA...', regenerate: 'Generate New Content with this DNA', regenerating: 'Generating New Content...', emptyTitle: 'Content DNA Analyzer', emptyDesc: 'Paste a viral content to discover why it went viral', dnaCode: 'DNA Code', viralScore: 'Viral Score', structure: 'Structure', hookAnalysis: 'Hook Analysis', emotions: 'Emotional Triggers', pacing: 'Pacing', engagement: 'Engagement Mechanics', cta: 'CTA Analysis', weaknesses: 'Weaknesses', newContent: 'New Content', variations: 'Variations', postingStrategy: 'Posting Strategy', copy: 'Copy', copied: 'Copied' },
  ru: { title: 'Content DNA Analyzer', subtitle: 'Расшифруйте ДНК вирусного контента', content: 'Вирусный контент', contentPlaceholder: 'Вставьте текст или описание вирусного видео/поста...', platform: 'Платформа', analyze: 'Анализировать ДНК', analyzing: 'Расшифровка ДНК...', regenerate: 'Создать новый контент с этой ДНК', regenerating: 'Генерация...', emptyTitle: 'Content DNA Analyzer', emptyDesc: 'Вставьте вирусный контент', dnaCode: 'Код ДНК', viralScore: 'Вирусный балл', structure: 'Структура', hookAnalysis: 'Анализ хука', emotions: 'Эмоциональные триггеры', pacing: 'Темп', engagement: 'Механика вовлечения', cta: 'Анализ CTA', weaknesses: 'Слабые стороны', newContent: 'Новый контент', variations: 'Вариации', postingStrategy: 'Стратегия публикации', copy: 'Копировать', copied: 'Скопировано' },
  de: { title: 'Content DNA Analyzer', subtitle: 'Entschlüsseln Sie die DNA viraler Inhalte', content: 'Viraler Inhalt', contentPlaceholder: 'Fügen Sie den Text eines viralen Videos/Posts ein...', platform: 'Plattform', analyze: 'DNA analysieren', analyzing: 'DNA wird entschlüsselt...', regenerate: 'Neuen Inhalt mit dieser DNA erstellen', regenerating: 'Wird generiert...', emptyTitle: 'Content DNA Analyzer', emptyDesc: 'Fügen Sie viralen Inhalt ein', dnaCode: 'DNA-Code', viralScore: 'Viral-Score', structure: 'Struktur', hookAnalysis: 'Hook-Analyse', emotions: 'Emotionale Trigger', pacing: 'Tempo', engagement: 'Engagement-Mechanik', cta: 'CTA-Analyse', weaknesses: 'Schwächen', newContent: 'Neuer Inhalt', variations: 'Variationen', postingStrategy: 'Posting-Strategie', copy: 'Kopieren', copied: 'Kopiert' },
  fr: { title: 'Content DNA Analyzer', subtitle: "Décodez l'ADN du contenu viral", content: 'Contenu viral', contentPlaceholder: "Collez le texte ou la description d'un contenu viral...", platform: 'Plateforme', analyze: "Analyser l'ADN", analyzing: "Décodage de l'ADN...", regenerate: 'Générer du nouveau contenu avec cet ADN', regenerating: 'Génération...', emptyTitle: 'Content DNA Analyzer', emptyDesc: 'Collez un contenu viral', dnaCode: 'Code ADN', viralScore: 'Score viral', structure: 'Structure', hookAnalysis: 'Analyse du hook', emotions: 'Déclencheurs émotionnels', pacing: 'Rythme', engagement: "Mécanique d'engagement", cta: 'Analyse CTA', weaknesses: 'Faiblesses', newContent: 'Nouveau contenu', variations: 'Variations', postingStrategy: 'Stratégie de publication', copy: 'Copier', copied: 'Copié' }
}

export default function ContentDNAPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [loading, setLoading] = useState(false)
  const [regenLoading, setRegenLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [regenerated, setRegenerated] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
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

  const handleAnalyze = async () => {
    if (!content.trim() || loading) return
    setLoading(true); setError(''); setAnalysis(null); setRegenerated(null)
    try {
      const res = await fetch('/api/content-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ content, mode: 'analyze', platform, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setAnalysis(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch { setError('Connection error') }
    setLoading(false)
  }

  const handleRegenerate = async () => {
    if (!analysis || regenLoading) return
    setRegenLoading(true); setError(''); setRegenerated(null)
    try {
      const dnaString = JSON.stringify(analysis)
      const res = await fetch('/api/content-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ content: dnaString, mode: 'regenerate', platform, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setRegenerated(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch { setError('Connection error') }
    setRegenLoading(false)
  }

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const getScoreColor = (score: number) => score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : score >= 40 ? 'text-orange-400' : 'text-red-400'
  const getIntensityBar = (val: number, max: number = 10) => `${Math.min((val / max) * 100, 100)}%`

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <div>
              <h1 className="font-bold">🧬 {t.title}</h1>
            </div>
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.content}</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t.contentPlaceholder} rows={8} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platform}</label>
                <div className="grid grid-cols-4 gap-2">
                  {['tiktok', 'instagram', 'youtube', 'twitter'].map(p => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-2 rounded-xl border text-xs capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleAnalyze} disabled={loading || !content.trim()} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.analyzing}</> : `🧬 ${t.analyze}`}
              </button>

              {analysis && (
                <button onClick={handleRegenerate} disabled={regenLoading} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {regenLoading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.regenerating}</> : `🔄 ${t.regenerate}`}
                </button>
              )}

              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!analysis && !loading && !regenerated && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="text-5xl mb-4">🧬</div>
                <h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3>
                <p className="text-gray-500">{t.emptyDesc}</p>
              </div>
            )}

            {loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-3 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                </div>
                <p className="text-gray-400">{t.analyzing}</p>
              </div>
            )}

            {analysis && !analysis.raw && (
              <div className="space-y-4">
                {/* DNA Summary + Score */}
                <div className="p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-cyan-400 font-semibold mb-1">🧬 {t.dnaCode}</p>
                      <p className="text-xs text-gray-400 font-mono bg-black/30 px-3 py-2 rounded-lg break-all">{analysis.dna_code || '-'}</p>
                    </div>
                    {analysis.viral_score && (
                      <div className="text-center ml-4">
                        <div className={`text-4xl font-bold ${getScoreColor(analysis.viral_score)}`}>{analysis.viral_score}</div>
                        <p className="text-xs text-gray-500">{t.viralScore}</p>
                      </div>
                    )}
                  </div>
                  {analysis.dna_summary && <p className="text-sm text-gray-300">{analysis.dna_summary}</p>}
                </div>

                {/* Structure / Framework */}
                {analysis.structure && (
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="font-semibold text-blue-400 mb-3">📐 {t.structure}: {analysis.structure.framework}</h4>
                    <div className="space-y-2">
                      {analysis.structure.framework_breakdown?.map((phase: any, i: number) => (
                        <div key={i} className="flex gap-3 p-3 bg-white/[0.03] rounded-xl">
                          <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                          <div>
                            <p className="text-sm font-medium text-white">{phase.phase}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{phase.content}</p>
                            <p className="text-xs text-blue-400 mt-0.5">{phase.purpose}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hook Analysis */}
                {analysis.hook_analysis && (
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="font-semibold text-red-400 mb-3">🎯 {t.hookAnalysis}</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-3 bg-white/[0.03] rounded-xl">
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="text-sm text-white font-medium">{analysis.hook_analysis.type}</p>
                      </div>
                      <div className="p-3 bg-white/[0.03] rounded-xl">
                        <p className="text-xs text-gray-500">Scroll-Stop Score</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${getScoreColor(analysis.hook_analysis.scroll_stop_score * 10)}`}>{analysis.hook_analysis.scroll_stop_score}/10</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-3">
                      <p className="text-xs text-red-400 font-semibold mb-1">Pattern</p>
                      <p className="text-sm text-gray-200">{analysis.hook_analysis.pattern}</p>
                    </div>
                    {analysis.hook_analysis.power_words && (
                      <div className="flex flex-wrap gap-1">
                        {analysis.hook_analysis.power_words.map((w: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">{w}</span>
                        ))}
                      </div>
                    )}
                    {analysis.hook_analysis.why_it_works && <p className="text-xs text-gray-400 mt-2">{analysis.hook_analysis.why_it_works}</p>}
                  </div>
                )}

                {/* Emotional Triggers */}
                {analysis.emotional_triggers && (
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="font-semibold text-pink-400 mb-3">💗 {t.emotions}</h4>
                    <div className="space-y-3">
                      {analysis.emotional_triggers.map((trigger: any, i: number) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300 capitalize">{trigger.emotion}</span>
                            <span className="text-pink-400">{trigger.intensity}/10</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all" style={{ width: getIntensityBar(trigger.intensity) }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{trigger.where}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pacing */}
                {analysis.pacing && (
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="font-semibold text-yellow-400 mb-3">⚡ {t.pacing}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/[0.03] rounded-xl">
                        <p className="text-xs text-gray-500">Tempo</p>
                        <p className="text-sm text-white font-medium capitalize">{analysis.pacing.tempo}</p>
                      </div>
                      <div className="p-3 bg-white/[0.03] rounded-xl">
                        <p className="text-xs text-gray-500">Pattern</p>
                        <p className="text-sm text-white">{analysis.pacing.pattern}</p>
                      </div>
                    </div>
                    {analysis.pacing.retention_hooks && (
                      <div className="mt-3 space-y-1">
                        {analysis.pacing.retention_hooks.map((h: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs"><span className="text-yellow-400">📌</span><span className="text-gray-300">{h}</span></div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Engagement Mechanics */}
                {analysis.engagement_mechanics && (
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="font-semibold text-green-400 mb-3">🎮 {t.engagement}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['💬', 'Comments', analysis.engagement_mechanics.comment_bait],
                        ['🔄', 'Shares', analysis.engagement_mechanics.share_trigger],
                        ['🔖', 'Saves', analysis.engagement_mechanics.save_reason],
                        ['➕', 'Follows', analysis.engagement_mechanics.follow_hook]
                      ].map(([icon, label, value], i) => (
                        <div key={i} className="p-3 bg-white/[0.03] rounded-xl">
                          <p className="text-xs text-gray-500">{icon} {label}</p>
                          <p className="text-xs text-gray-300 mt-1">{value || '-'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA + Weaknesses */}
                <div className="grid grid-cols-2 gap-4">
                  {analysis.cta_analysis && (
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <h4 className="font-semibold text-purple-400 mb-2">📢 {t.cta}</h4>
                      <p className="text-xs text-gray-400">Type: <span className="text-white">{analysis.cta_analysis.type}</span></p>
                      <p className="text-xs text-gray-400">Placement: <span className="text-white">{analysis.cta_analysis.placement}</span></p>
                      <p className="text-xs text-gray-400">Score: <span className="text-purple-400">{analysis.cta_analysis.effectiveness}/10</span></p>
                    </div>
                  )}
                  {analysis.weaknesses && (
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <h4 className="font-semibold text-orange-400 mb-2">⚠️ {t.weaknesses}</h4>
                      {analysis.weaknesses.map((w: string, i: number) => (
                        <p key={i} className="text-xs text-gray-300 mb-1">• {w}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Regenerated Content */}
            {regenerated && !regenerated.raw && (
              <div className="space-y-4 mt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                <h3 className="text-lg font-bold text-center text-purple-400">🔄 {t.newContent}</h3>

                {regenerated.new_content && (
                  <div className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                    {regenerated.new_content.hook && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-3">
                        <div className="flex justify-between"><span className="text-xs text-red-400 font-semibold">🎯 HOOK</span><button onClick={() => copyText(regenerated.new_content.hook, 'hook')} className="text-xs text-gray-500 hover:text-white">{copied === 'hook' ? t.copied : t.copy}</button></div>
                        <p className="text-sm text-white mt-1">{regenerated.new_content.hook}</p>
                      </div>
                    )}
                    {regenerated.new_content.full_script && (
                      <div className="mb-3">
                        <div className="flex justify-between mb-1"><span className="text-xs text-purple-400 font-semibold">📝 Script</span><button onClick={() => copyText(regenerated.new_content.full_script, 'script')} className="text-xs text-gray-500 hover:text-white">{copied === 'script' ? t.copied : t.copy}</button></div>
                        <p className="text-sm text-gray-200 whitespace-pre-wrap">{regenerated.new_content.full_script}</p>
                      </div>
                    )}
                    {regenerated.new_content.cta && (
                      <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <span className="text-xs text-green-400 font-semibold">📢 CTA:</span>
                        <span className="text-sm text-gray-200 ml-2">{regenerated.new_content.cta}</span>
                      </div>
                    )}
                    {regenerated.adaptation_notes && <p className="text-xs text-gray-500 mt-3">💡 {regenerated.adaptation_notes}</p>}
                  </div>
                )}

                {regenerated.variations && (
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="font-semibold text-purple-400 mb-3">🎭 {t.variations}</h4>
                    {regenerated.variations.map((v: any, i: number) => (
                      <div key={i} className="p-3 bg-white/[0.03] rounded-xl mb-2">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">{v.angle}</span>
                          <button onClick={() => copyText(v.hook, `var-${i}`)} className="text-xs text-gray-500 hover:text-white">{copied === `var-${i}` ? t.copied : t.copy}</button>
                        </div>
                        <p className="text-sm text-white mt-2 font-medium">{v.hook}</p>
                        <p className="text-xs text-gray-400 mt-1">{v.one_liner}</p>
                      </div>
                    ))}
                  </div>
                )}

                {regenerated.posting_strategy && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="font-semibold text-green-400 mb-2">📊 {t.postingStrategy}</h4>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {regenerated.posting_strategy.best_time && <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg">⏰ {regenerated.posting_strategy.best_time}</span>}
                      {regenerated.posting_strategy.caption_style && <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg">✍️ {regenerated.posting_strategy.caption_style}</span>}
                    </div>
                    {regenerated.posting_strategy.hashtags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {regenerated.posting_strategy.hashtags.map((tag: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Raw fallback */}
            {analysis?.raw && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{analysis.raw}</pre>}
            {regenerated?.raw && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{regenerated.raw}</pre>}
          </div>
        </div>
      </main>
    </div>
  )
}
