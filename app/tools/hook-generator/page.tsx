'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const CREDIT_COST = 3

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Hook Üretici Pro', topic: 'Konu / Niş', topicPlaceholder: 'örn: Yapay zeka, Fitness, Para kazanma...', platform: 'Platform', tone: 'Ton', generate: '20 Viral Hook Üret', generating: '20 Hook Üretiliyor...', bestHook: 'En İyi Hook', topicInsight: 'Konu Analizi', copy: 'Kopyala', copied: '✓', copyAll: 'Tümünü Kopyala', download: 'TXT İndir', professional: 'Profesyonel', casual: 'Samimi', humorous: 'Esprili', dramatic: 'Dramatik', emptyTitle: '20 Viral Hook', emptyDesc: 'Konunuzu girin, scroll-durduran hook\'lar üretelim', insufficientCredits: 'Yetersiz kredi! Bu araç {cost} kredi gerektiriyor.', creditsRequired: 'Gerekli: {cost} kredi' },
  en: { title: 'Hook Generator Pro', topic: 'Topic / Niche', topicPlaceholder: 'e.g: AI, Fitness, Making money...', platform: 'Platform', tone: 'Tone', generate: 'Generate 20 Viral Hooks', generating: 'Generating 20 Hooks...', bestHook: 'Best Hook', topicInsight: 'Topic Insight', copy: 'Copy', copied: '✓', copyAll: 'Copy All', download: 'Download TXT', professional: 'Professional', casual: 'Casual', humorous: 'Humorous', dramatic: 'Dramatic', emptyTitle: '20 Viral Hooks', emptyDesc: 'Enter your topic to generate scroll-stopping hooks', insufficientCredits: 'Insufficient credits! This tool requires {cost} credits.', creditsRequired: 'Required: {cost} credits' },
  ru: { title: 'Генератор Хуков Pro', topic: 'Тема / Ниша', topicPlaceholder: 'напр: ИИ, Фитнес, Заработок...', platform: 'Платформа', tone: 'Тон', generate: 'Создать 20 Хуков', generating: 'Создаём 20 хуков...', bestHook: 'Лучший Хук', topicInsight: 'Анализ Темы', copy: 'Копировать', copied: '✓', copyAll: 'Копировать всё', download: 'Скачать TXT', professional: 'Профессиональный', casual: 'Дружеский', humorous: 'Юмор', dramatic: 'Драматический', emptyTitle: '20 Вирусных Хуков', emptyDesc: 'Введите тему для генерации хуков', insufficientCredits: 'Недостаточно кредитов! Требуется {cost} кредитов.', creditsRequired: 'Требуется: {cost} кредитов' },
  de: { title: 'Hook Generator Pro', topic: 'Thema / Nische', topicPlaceholder: 'z.B: KI, Fitness, Geld verdienen...', platform: 'Plattform', tone: 'Ton', generate: '20 Virale Hooks Erstellen', generating: '20 Hooks werden erstellt...', bestHook: 'Bester Hook', topicInsight: 'Themen-Einblick', copy: 'Kopieren', copied: '✓', copyAll: 'Alle kopieren', download: 'TXT Herunterladen', professional: 'Professionell', casual: 'Locker', humorous: 'Humorvoll', dramatic: 'Dramatisch', emptyTitle: '20 Virale Hooks', emptyDesc: 'Geben Sie Ihr Thema ein', insufficientCredits: 'Nicht genügend Credits! Dieses Tool benötigt {cost} Credits.', creditsRequired: 'Erforderlich: {cost} Credits' },
  fr: { title: 'Générateur de Hooks Pro', topic: 'Sujet / Niche', topicPlaceholder: 'ex: IA, Fitness, Gagner de l\'argent...', platform: 'Plateforme', tone: 'Ton', generate: 'Générer 20 Hooks Viraux', generating: 'Génération de 20 hooks...', bestHook: 'Meilleur Hook', topicInsight: 'Analyse du Sujet', copy: 'Copier', copied: '✓', copyAll: 'Tout copier', download: 'Télécharger TXT', professional: 'Professionnel', casual: 'Décontracté', humorous: 'Humoristique', dramatic: 'Dramatique', emptyTitle: '20 Hooks Viraux', emptyDesc: 'Entrez votre sujet pour générer des hooks', insufficientCredits: 'Crédits insuffisants! Cet outil nécessite {cost} crédits.', creditsRequired: 'Requis: {cost} crédits' }
}

export default function HookGeneratorPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [tone, setTone] = useState('professional')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
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
    if (!topic.trim() || loading || !user) return
    
    // Önce kredi kontrolü (client-side uyarı için)
    if (credits < CREDIT_COST) {
      setError(t.insufficientCredits.replace('{cost}', String(CREDIT_COST)))
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/hook-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          platform, 
          tone, 
          language,
          userId: user.id  // Kullanıcı ID'sini gönder
        })
      })
      const data = await res.json()
      
      if (res.ok && data.result) {
        setResult(data.result)
        // Yeni kredi bakiyesini güncelle
        if (data.newBalance !== undefined) {
          setCredits(data.newBalance)
        }
      } else if (res.status === 402) {
        // Yetersiz kredi
        setError(t.insufficientCredits.replace('{cost}', String(CREDIT_COST)))
        if (data.current !== undefined) {
          setCredits(data.current)
        }
      } else {
        setError(data.error || 'Bir hata oluştu')
      }
    } catch (err) {
      setError('Bağlantı hatası')
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAllHooks = () => {
    if (!result?.hooks) return
    const allText = result.hooks.map((h: any, i: number) => `${i + 1}. ${h.text}`).join('\n\n')
    navigator.clipboard.writeText(allText)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  const downloadAsTxt = () => {
    if (!result?.hooks) return
    let content = `${t.title}\n${'='.repeat(30)}\n\n`
    content += `Topic: ${topic}\nPlatform: ${platform}\nTone: ${tone}\n\n`
    content += `${'='.repeat(30)}\n\n`
    
    if (result.best_hook) {
      content += `🏆 ${t.bestHook}:\n${result.best_hook.text}\n\n`
    }
    
    result.hooks.forEach((h: any, i: number) => {
      content += `${i + 1}. ${h.text}\n`
      if (h.pattern) content += `   Pattern: ${h.pattern}\n`
      if (h.virality_score) content += `   Virality: ${h.virality_score}/10\n`
      content += '\n'
    })
    
    if (result.topic_insight) {
      content += `\n💡 ${t.topicInsight}:\n${result.topic_insight}\n`
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hooks-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <span>←</span>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
            <h1 className="text-lg font-semibold hidden sm:block">{t.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
              <span className="text-yellow-500">⚡</span>
              <span className="text-sm">{credits}</span>
            </div>
            <div className="text-xs text-gray-500">
              {t.creditsRequired?.replace('{cost}', String(CREDIT_COST)) || `Cost: ${CREDIT_COST}`}
            </div>
            <div className="relative group">
              <button className="px-2 py-1.5 text-sm text-gray-400 hover:text-white transition">
                🌐 {language.toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-[#1a1a2e] border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {(['en', 'tr', 'ru', 'de', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.topic}</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t.topicPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t.platform}</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="tiktok" className="bg-gray-900">TikTok</option>
                      <option value="instagram" className="bg-gray-900">Instagram</option>
                      <option value="youtube" className="bg-gray-900">YouTube</option>
                      <option value="twitter" className="bg-gray-900">Twitter/X</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t.tone}</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="professional" className="bg-gray-900">{t.professional}</option>
                      <option value="casual" className="bg-gray-900">{t.casual}</option>
                      <option value="humorous" className="bg-gray-900">{t.humorous}</option>
                      <option value="dramatic" className="bg-gray-900">{t.dramatic}</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim() || credits < CREDIT_COST}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                  {loading ? t.generating : t.generate}
                  {!loading && <span className="text-sm opacity-70">({CREDIT_COST} ⚡)</span>}
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl min-h-[400px]">
              {result ? (
                <div className="space-y-4">
                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button onClick={copyAllHooks} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition flex items-center gap-2">
                      {copiedAll ? '✓' : '📋'} {copiedAll ? t.copied : t.copyAll}
                    </button>
                    <button onClick={downloadAsTxt} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition flex items-center gap-2">
                      📄 {t.download}
                    </button>
                  </div>

                  {/* Best Hook */}
                  {result.best_hook && (
                    <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl mb-4">
                      <div className="text-xs text-yellow-500 mb-2">🏆 {t.bestHook}</div>
                      <p className="text-lg font-medium">{result.best_hook.text}</p>
                      {result.best_hook.reason && (
                        <p className="text-sm text-gray-400 mt-2">{result.best_hook.reason}</p>
                      )}
                    </div>
                  )}

                  {/* Hooks List */}
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {result.hooks?.map((hook: any, i: number) => (
                      <div key={i} className="p-3 bg-white/[0.03] border border-white/5 rounded-lg group hover:border-purple-500/30 transition">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="text-purple-400 text-sm mr-2">{i + 1}.</span>
                            <span>{hook.text}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(hook.text, i)}
                            className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20 transition"
                          >
                            {copiedIndex === i ? t.copied : t.copy}
                          </button>
                        </div>
                        {(hook.pattern || hook.virality_score) && (
                          <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            {hook.pattern && <span>🎯 {hook.pattern}</span>}
                            {hook.virality_score && <span>🔥 {hook.virality_score}/10</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Topic Insight */}
                  {result.topic_insight && (
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mt-4">
                      <div className="text-xs text-purple-400 mb-2">💡 {t.topicInsight}</div>
                      <p className="text-sm text-gray-300">{result.topic_insight}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="text-6xl mb-4">🎣</div>
                  <h3 className="text-xl font-semibold mb-2">{t.emptyTitle}</h3>
                  <p className="text-gray-500">{t.emptyDesc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
