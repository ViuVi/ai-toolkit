'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Açıklama Üretici', topic: 'Konu', topicPlaceholder: 'örn: Yeni ürün lansmanı, Motivasyon...', platform: 'Platform', tone: 'Ton', generate: '5 Caption Üret', generating: 'Üretiliyor...', copy: 'Kopyala', emptyTitle: 'Caption\'lar', emptyDesc: 'Konunuzu girin', professional: 'Profesyonel', casual: 'Samimi', humorous: 'Esprili', inspiring: 'İlham Verici', hashtags: 'Hashtag\'ler' },
  en: { title: 'Caption Generator', topic: 'Topic', topicPlaceholder: 'e.g: Product launch, Motivation...', platform: 'Platform', tone: 'Tone', generate: 'Generate 5 Captions', generating: 'Generating...', copy: 'Copy', emptyTitle: 'Captions', emptyDesc: 'Enter your topic', professional: 'Professional', casual: 'Casual', humorous: 'Humorous', inspiring: 'Inspiring', hashtags: 'Hashtags' },
  ru: { title: 'Генератор Подписей', topic: 'Тема', topicPlaceholder: 'напр: Запуск продукта...', platform: 'Платформа', tone: 'Тон', generate: 'Создать 5 Подписей', generating: 'Создание...', copy: 'Копировать', emptyTitle: 'Подписи', emptyDesc: 'Введите тему', professional: 'Профессиональный', casual: 'Дружеский', humorous: 'Юмор', inspiring: 'Вдохновляющий', hashtags: 'Хештеги' },
  de: { title: 'Caption Generator', topic: 'Thema', topicPlaceholder: 'z.B: Produktstart...', platform: 'Plattform', tone: 'Ton', generate: '5 Captions Erstellen', generating: 'Wird erstellt...', copy: 'Kopieren', emptyTitle: 'Captions', emptyDesc: 'Thema eingeben', professional: 'Professionell', casual: 'Locker', humorous: 'Humorvoll', inspiring: 'Inspirierend', hashtags: 'Hashtags' },
  fr: { title: 'Générateur de Légendes', topic: 'Sujet', topicPlaceholder: 'ex: Lancement produit...', platform: 'Plateforme', tone: 'Ton', generate: 'Générer 5 Légendes', generating: 'Génération...', copy: 'Copier', emptyTitle: 'Légendes', emptyDesc: 'Entrez votre sujet', professional: 'Professionnel', casual: 'Décontracté', humorous: 'Humoristique', inspiring: 'Inspirant', hashtags: 'Hashtags' }
}

export default function CaptionGeneratorPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('professional')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
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
    if (!topic.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/caption-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, language, includeHashtags: true, includeEmojis: true })
      })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }

  const copyCaption = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const tones = [
    { value: 'professional', label: t.professional },
    { value: 'casual', label: t.casual },
    { value: 'humorous', label: t.humorous },
    { value: 'inspiring', label: t.inspiring }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">✍️ {t.title}</h1>
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
                <label className="block text-sm text-gray-400 mb-2">{t.topic}</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platform}</label>
                <div className="grid grid-cols-2 gap-2">
                  {['instagram', 'tiktok', 'twitter', 'linkedin'].map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-3 rounded-xl border text-sm capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.tone}</label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((tn) => (
                    <button key={tn.value} onClick={() => setTone(tn.value)} className={`p-3 rounded-xl border text-sm ${tone === tn.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{tn.label}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : <>✍️ {t.generate}</>}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">✍️</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {result.captions?.map((cap: any, i: number) => (
                  <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{cap.emotion}</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">{cap.cta_type}</span>
                      </div>
                      <button onClick={() => copyCaption(cap.caption, i)} className="px-3 py-1 bg-white/5 text-gray-400 rounded text-sm hover:bg-white/10">{copiedIndex === i ? '✓' : t.copy}</button>
                    </div>
                    <p className="text-gray-200 whitespace-pre-wrap">{cap.caption}</p>
                    {cap.hook_line && <p className="mt-2 text-sm text-purple-400">🎯 Hook: {cap.hook_line}</p>}
                  </div>
                ))}
                {result.hashtags && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">#️⃣ {t.hashtags}</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.map((tag: string, i: number) => <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-sm">{tag}</span>)}
                    </div>
                  </div>
                )}
                {result.raw && !result.captions && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
