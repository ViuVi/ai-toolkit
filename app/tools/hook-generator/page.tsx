'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', credits: 'Kredi', topicLabel: 'Konu', topicPlaceholder: 'örn: yapay zeka araçları, fitness ipuçları...', platformLabel: 'Platform', toneLabel: 'Ton', countLabel: 'Hook Sayısı', btn: 'Hook Üret', loading: 'Üretiliyor...', copy: 'Kopyala', copied: '✓', topPick: 'En İyi Seçim', formulas: 'Hook Formülleri', results: 'Sonuçlar', newGenerate: 'Yeni Üret' },
  en: { back: 'Dashboard', credits: 'Credits', topicLabel: 'Topic', topicPlaceholder: 'e.g., AI tools, fitness tips...', platformLabel: 'Platform', toneLabel: 'Tone', countLabel: 'Hook Count', btn: 'Generate Hooks', loading: 'Generating...', copy: 'Copy', copied: '✓', topPick: 'Top Pick', formulas: 'Hook Formulas', results: 'Results', newGenerate: 'Generate New' },
  ru: { back: 'Панель', credits: 'Кредиты', topicLabel: 'Тема', topicPlaceholder: 'напр: ИИ инструменты...', platformLabel: 'Платформа', toneLabel: 'Тон', countLabel: 'Количество', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓', topPick: 'Лучший', formulas: 'Формулы', results: 'Результаты', newGenerate: 'Создать новый' },
  de: { back: 'Dashboard', credits: 'Credits', topicLabel: 'Thema', topicPlaceholder: 'z.B. KI-Tools...', platformLabel: 'Plattform', toneLabel: 'Ton', countLabel: 'Anzahl', btn: 'Generieren', loading: 'Generiere...', copy: 'Kopieren', copied: '✓', topPick: 'Top', formulas: 'Formeln', results: 'Ergebnisse', newGenerate: 'Neu generieren' },
  fr: { back: 'Tableau', credits: 'Crédits', topicLabel: 'Sujet', topicPlaceholder: 'ex: outils IA...', platformLabel: 'Plateforme', toneLabel: 'Ton', countLabel: 'Nombre', btn: 'Générer', loading: 'Génération...', copy: 'Copier', copied: '✓', topPick: 'Meilleur', formulas: 'Formules', results: 'Résultats', newGenerate: 'Nouveau' }
}

const toneOptions = [
  { value: 'curiosity', label: '🔮 Merak', labelEn: '🔮 Curiosity' },
  { value: 'controversial', label: '🔥 Tartışmalı', labelEn: '🔥 Controversial' },
  { value: 'educational', label: '📚 Eğitici', labelEn: '📚 Educational' },
  { value: 'storytelling', label: '📖 Hikaye', labelEn: '📖 Storytelling' }
]

export default function HookGeneratorPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [tone, setTone] = useState('curiosity')
  const [hookCount, setHookCount] = useState('10')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
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
    if (!topic.trim() || loading) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/hook-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, hookCount, language })
      })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // Deduct credits
        if (credits >= 3) {
          await supabase.from('credits').update({ balance: credits - 3 }).eq('user_id', user.id)
          setCredits(prev => prev - 3)
        }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyHook = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const getScoreColor = (score: number) => score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-orange-400'
  const getScoreBg = (score: number) => score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-orange-500'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <span>←</span>
              <span className="hidden sm:inline">{t.back}</span>
            </Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎣</span>
              <h1 className="font-semibold">Hook Generator Pro</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <span className="text-purple-400 text-sm">✦</span>
              <span className="font-medium">{credits}</span>
            </div>
            <div className="relative group">
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder={t.topicPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition"
                />
              </div>

              {/* Platform & Count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Instagram Reels</option>
                    <option value="shorts">YouTube Shorts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.countLabel}</label>
                  <select value={hookCount} onChange={e => setHookCount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="10">10 Hooks</option>
                    <option value="25">25 Hooks</option>
                    <option value="50">50 Hooks</option>
                  </select>
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.toneLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {toneOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setTone(opt.value)}
                      className={`p-3 rounded-xl border text-sm transition-all ${tone === opt.value ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                    >
                      {language === 'tr' ? opt.label : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading || !topic.trim() || credits < 3}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</>
                ) : (
                  <>{t.btn} <span className="text-white/70">• 3 ✦</span></>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Pick */}
            {result.top_pick && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-semibold text-yellow-400">{t.topPick}</span>
                </div>
                <p className="text-xl text-white font-medium">"{result.top_pick.hook}"</p>
                <p className="text-gray-400 text-sm mt-2">{result.top_pick.reason}</p>
              </div>
            )}

            {/* Hooks Grid */}
            <div className="grid gap-4">
              {result.hooks?.map((hook: any, i: number) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-white/10 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">{i + 1}</span>
                      <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">{hook.type}</span>
                    </div>
                    <button
                      onClick={() => copyHook(i, hook.hook)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition ${copiedIndex === i ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {copiedIndex === i ? t.copied : t.copy}
                    </button>
                  </div>
                  
                  <p className="text-lg text-white mb-4">"{hook.hook}"</p>
                  
                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-3">
                    {['virality', 'curiosity', 'retention'].map(metric => (
                      <div key={metric} className="bg-white/5 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-500 mb-1 capitalize">{metric}</div>
                        <div className={`text-lg font-bold ${getScoreColor(hook[`${metric}_score`])}`}>{hook[`${metric}_score`]}</div>
                        <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full ${getScoreBg(hook[`${metric}_score`])}`} style={{width: `${hook[`${metric}_score`]}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {hook.why_works && <p className="text-sm text-gray-500 mt-3">💡 {hook.why_works}</p>}
                </div>
              ))}
            </div>

            {/* Generate New */}
            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">
                ← {t.newGenerate}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
