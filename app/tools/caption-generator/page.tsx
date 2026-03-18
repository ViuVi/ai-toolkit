'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', topicLabel: 'Konu', topicPlaceholder: 'örn: 30 günde 10kg verdim...', platformLabel: 'Platform', toneLabel: 'Ton', contentLabel: 'İçerik Tipi', btn: 'Caption Üret', loading: 'Üretiliyor...', copy: 'Kopyala', copied: '✓', ctas: 'CTA Seçenekleri', hashtags: 'Hashtag Önerileri', newGenerate: 'Yeni Üret' },
  en: { back: 'Dashboard', topicLabel: 'Topic', topicPlaceholder: 'e.g., I lost 10kg in 30 days...', platformLabel: 'Platform', toneLabel: 'Tone', contentLabel: 'Content Type', btn: 'Generate Caption', loading: 'Generating...', copy: 'Copy', copied: '✓', ctas: 'CTA Options', hashtags: 'Hashtag Suggestions', newGenerate: 'Generate New' },
  ru: { back: 'Панель', topicLabel: 'Тема', topicPlaceholder: 'напр: Похудел на 10кг...', platformLabel: 'Платформа', toneLabel: 'Тон', contentLabel: 'Тип', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓', ctas: 'CTA', hashtags: 'Хештеги', newGenerate: 'Новый' },
  de: { back: 'Dashboard', topicLabel: 'Thema', topicPlaceholder: 'z.B. 10kg in 30 Tagen...', platformLabel: 'Plattform', toneLabel: 'Ton', contentLabel: 'Typ', btn: 'Generieren', loading: 'Generiere...', copy: 'Kopieren', copied: '✓', ctas: 'CTAs', hashtags: 'Hashtags', newGenerate: 'Neu' },
  fr: { back: 'Tableau', topicLabel: 'Sujet', topicPlaceholder: 'ex: J\'ai perdu 10kg...', platformLabel: 'Plateforme', toneLabel: 'Ton', contentLabel: 'Type', btn: 'Générer', loading: 'Génération...', copy: 'Copier', copied: '✓', ctas: 'CTAs', hashtags: 'Hashtags', newGenerate: 'Nouveau' }
}

const toneOptions = [
  { value: 'casual', icon: '😊', label: 'Samimi', labelEn: 'Casual' },
  { value: 'professional', icon: '💼', label: 'Profesyonel', labelEn: 'Professional' },
  { value: 'humorous', icon: '😂', label: 'Eğlenceli', labelEn: 'Humorous' },
  { value: 'inspirational', icon: '✨', label: 'İlham Verici', labelEn: 'Inspirational' },
]

export default function CaptionGeneratorPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('casual')
  const [contentType, setContentType] = useState('reel')
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
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/caption-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, tone, contentType, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // if (credits >= X) {
          // await supabase.from("credits").update({ balance: credits - 3 }).eq('user_id', user.id)
          // setCredits(prev => prev - X)
        // }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyCaption = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const engagementBadge: any = {
    'high': { bg: 'bg-green-500/20', text: 'text-green-400', label: '🔥 High' },
    'medium': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '⚡ Medium' },
    'low': { bg: 'bg-gray-500/20', text: 'text-gray-400', label: '📊 Low' }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">✍️</span><h1 className="font-semibold">Caption Generator</h1></div>
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
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter/X</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label>
                  <select value={contentType} onChange={e => setContentType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="reel">Reel / Short</option>
                    <option value="carousel">Carousel</option>
                    <option value="post">Static Post</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.toneLabel}</label>
                <div className="grid grid-cols-4 gap-2">
                  {toneOptions.map(opt => (
                    <button key={opt.value} onClick={() => setTone(opt.value)} className={`p-3 rounded-xl border text-center transition-all ${tone === opt.value ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                      <div className="text-xl mb-1">{opt.icon}</div>
                      <div className="text-xs">{language === 'tr' ? opt.label : opt.labelEn}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !topic.trim() || credits < 3} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 3 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {result.captions?.map((cap: any, i: number) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-white/10 transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">{i + 1}</span>
                    {cap.engagement_prediction && (
                      <span className={`px-2 py-1 rounded-lg text-xs ${engagementBadge[cap.engagement_prediction]?.bg} ${engagementBadge[cap.engagement_prediction]?.text}`}>
                        {engagementBadge[cap.engagement_prediction]?.label}
                      </span>
                    )}
                  </div>
                  <button onClick={() => copyCaption(i, cap.caption)} className={`px-3 py-1.5 rounded-lg text-sm transition ${copiedIndex === i ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                    {copiedIndex === i ? t.copied : t.copy}
                  </button>
                </div>
                <div className="bg-white/5 rounded-lg p-4 mb-3">
                  <p className="text-white whitespace-pre-wrap">{cap.caption}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  {cap.style && <span className="text-gray-500">{cap.style}</span>}
                  {cap.character_count && <span className="text-gray-500">{cap.character_count} chars</span>}
                </div>
              </div>
            ))}

            {result.hashtag_suggestions?.length > 0 && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                <h3 className="text-blue-400 font-semibold mb-3">🏷️ {t.hashtags}</h3>
                <div className="flex flex-wrap gap-2">{result.hashtag_suggestions.map((h: string, i: number) => <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm">{h}</span>)}</div>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newGenerate}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
