'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Hook Generator Pro', icon: '🎣', credits: '3 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Viral video hook\'ları üretir. Her hook için virality, curiosity ve retention skorları verir.', topicLabel: 'Konu', topicPlaceholder: 'örn: yapay zeka araçları, fitness ipuçları...', platformLabel: 'Platform', toneLabel: 'Ton', countLabel: 'Hook Sayısı', btn: 'Hook Üret', loading: 'Üretiliyor...', copy: 'Kopyala', copied: '✓', topPick: '⭐ En İyi Seçim', formulas: '📐 Hook Formülleri', avoid: '⚠️ Kaçınılacaklar' },
  en: { title: 'Hook Generator Pro', icon: '🎣', credits: '3 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Generates viral video hooks with virality, curiosity and retention scores.', topicLabel: 'Topic', topicPlaceholder: 'e.g., AI tools, fitness tips...', platformLabel: 'Platform', toneLabel: 'Tone', countLabel: 'Hook Count', btn: 'Generate Hooks', loading: 'Generating...', copy: 'Copy', copied: '✓', topPick: '⭐ Top Pick', formulas: '📐 Hook Formulas', avoid: '⚠️ Avoid' },
  ru: { title: 'Hook Generator Pro', icon: '🎣', credits: '3', back: '← Назад', testMode: '🧪 Тест', purpose: 'Генерирует вирусные хуки.', topicLabel: 'Тема', topicPlaceholder: 'напр: ИИ инструменты...', platformLabel: 'Платформа', toneLabel: 'Тон', countLabel: 'Количество', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓', topPick: '⭐ Лучший', formulas: '📐 Формулы', avoid: '⚠️ Избегать' },
  de: { title: 'Hook Generator Pro', icon: '🎣', credits: '3', back: '← Zurück', testMode: '🧪 Test', purpose: 'Generiert virale Video-Hooks.', topicLabel: 'Thema', topicPlaceholder: 'z.B. KI-Tools...', platformLabel: 'Plattform', toneLabel: 'Ton', countLabel: 'Anzahl', btn: 'Generieren', loading: 'Generiere...', copy: 'Kopieren', copied: '✓', topPick: '⭐ Top', formulas: '📐 Formeln', avoid: '⚠️ Vermeiden' },
  fr: { title: 'Hook Generator Pro', icon: '🎣', credits: '3', back: '← Retour', testMode: '🧪 Test', purpose: 'Génère des hooks viraux.', topicLabel: 'Sujet', topicPlaceholder: 'ex: outils IA...', platformLabel: 'Plateforme', toneLabel: 'Ton', countLabel: 'Nombre', btn: 'Générer', loading: 'Génération...', copy: 'Copier', copied: '✓', topPick: '⭐ Meilleur', formulas: '📐 Formules', avoid: '⚠️ Éviter' }
}

const toneOptions = [
  { value: 'curiosity', label: '🔮 Merak', labelEn: '🔮 Curiosity' },
  { value: 'controversial', label: '🔥 Tartışmalı', labelEn: '🔥 Controversial' },
  { value: 'educational', label: '📚 Eğitici', labelEn: '📚 Educational' },
  { value: 'storytelling', label: '📖 Hikaye', labelEn: '📖 Storytelling' }
]

export default function Page() {
  const [user, setUser] = useState<any>(null)
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

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!topic.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/hook-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, tone, hookCount, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyHook = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  const typeEmoji: any = {
    'question': '❓',
    'statement': '💬',
    'controversial': '🔥',
    'statistic': '📊',
    'story': '📖'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">{t.back}</Link>
            <span className="text-2xl">{t.icon}</span>
            <h1 className="text-xl font-bold">{t.title}</h1>
            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">{t.credits}</span>
          </div>
          <div className="relative group">
            <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">🌐 {language.toUpperCase()}</button>
            <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${language === l ? 'text-purple-400' : 'text-gray-300'}`}>{l.toUpperCase()}</button>)}
            </div>
          </div>
        </div>
      </header>
      <div className="fixed top-16 left-0 right-0 z-40 bg-green-500/10 border-b border-green-500/30 py-2 text-center text-green-400 text-sm">{t.testMode}</div>
      
      <main className="pt-32 pb-12 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sol Panel - Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white">
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Instagram Reels</option>
                    <option value="shorts">YouTube Shorts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.countLabel}</label>
                  <select value={hookCount} onChange={e => setHookCount(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white">
                    <option value="10">10 Hook</option>
                    <option value="25">25 Hook</option>
                    <option value="50">50 Hook</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.toneLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {toneOptions.map(opt => (
                    <button key={opt.value} onClick={() => setTone(opt.value)} className={`p-3 rounded-xl border text-sm transition-all ${tone === opt.value ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                      {language === 'tr' ? opt.label : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>

            {/* Top Pick */}
            {result?.top_pick && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4">
                <h3 className="text-yellow-400 font-semibold mb-2">{t.topPick}</h3>
                <p className="text-white font-medium">{result.top_pick.hook}</p>
                <p className="text-gray-400 text-sm mt-1">{result.top_pick.reason}</p>
              </div>
            )}

            {/* Formulas */}
            {result?.hook_formulas && result.hook_formulas.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                <h3 className="text-blue-400 font-semibold mb-2">{t.formulas}</h3>
                <div className="space-y-2">
                  {result.hook_formulas.map((f: any, i: number) => (
                    <div key={i} className="bg-gray-900/50 rounded-lg p-2">
                      <p className="text-white text-sm font-medium">{f.formula}</p>
                      <p className="text-gray-500 text-xs">{f.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sağ Panel - Sonuçlar */}
          <div className="lg:col-span-3 space-y-3 max-h-[800px] overflow-y-auto">
            {result?.hooks && result.hooks.length > 0 ? (
              <>
                {result.topic_analysis && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 mb-4">
                    <p className="text-gray-300 text-sm">{result.topic_analysis}</p>
                  </div>
                )}
                
                {result.hooks.map((hook: any, i: number) => (
                  <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">{i + 1}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{typeEmoji[hook.type] || '💬'} {hook.type}</span>
                      </div>
                      <button onClick={() => copyHook(i, hook.hook)} className={`text-xs px-3 py-1 rounded-lg ${copiedIndex === i ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                        {copiedIndex === i ? t.copied : t.copy}
                      </button>
                    </div>
                    
                    <p className="text-white font-medium text-lg mb-3">"{hook.hook}"</p>
                    
                    {/* Skorlar */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-500 mb-1">Virality</div>
                        <div className={`text-xl font-bold ${getScoreColor(hook.virality_score)}`}>{hook.virality_score}</div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full ${getScoreBg(hook.virality_score)} rounded-full`} style={{width: `${hook.virality_score}%`}}></div>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-500 mb-1">Curiosity</div>
                        <div className={`text-xl font-bold ${getScoreColor(hook.curiosity_score)}`}>{hook.curiosity_score}</div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full ${getScoreBg(hook.curiosity_score)} rounded-full`} style={{width: `${hook.curiosity_score}%`}}></div>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                        <div className="text-xs text-gray-500 mb-1">Retention</div>
                        <div className={`text-xl font-bold ${getScoreColor(hook.retention_score)}`}>{hook.retention_score}</div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full ${getScoreBg(hook.retention_score)} rounded-full`} style={{width: `${hook.retention_score}%`}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Detaylar */}
                    <div className="space-y-1 text-sm">
                      {hook.why_works && <p className="text-gray-400"><span className="text-green-400">✓</span> {hook.why_works}</p>}
                      {hook.best_for && <p className="text-gray-500">🎯 {hook.best_for}</p>}
                      {hook.opening_visual && <p className="text-gray-500">🎬 {hook.opening_visual}</p>}
                    </div>
                  </div>
                ))}

                {/* Kaçınılacaklar */}
                {result.avoid_list && result.avoid_list.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                    <h3 className="text-red-400 font-semibold mb-2">{t.avoid}</h3>
                    <ul className="space-y-1">
                      {result.avoid_list.map((item: string, i: number) => (
                        <li key={i} className="text-gray-400 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">{t.icon}</div>
                <p className="text-gray-500">{t.purpose}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
