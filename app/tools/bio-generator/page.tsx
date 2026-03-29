'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Bio Üretici', niche: 'Niş / Alan', nichePlaceholder: 'örn: Fitness, Yazılım, Yemek...', platform: 'Platform', tone: 'Ton', keywords: 'Anahtar Kelimeler', keywordsPlaceholder: 'örn: coach, mentor, CEO...', generate: '10 Bio Üret', generating: 'Üretiliyor...', bestBio: 'En İyi Bio', copy: 'Kopyala', copied: '✓', chars: 'karakter', emptyTitle: 'Bio Üretici', emptyDesc: 'Nişinizi girin, platform bio yazalım', professional: 'Profesyonel', casual: 'Samimi', humorous: 'Esprili', minimal: 'Minimal' },
  en: { title: 'Bio Generator', niche: 'Niche / Area', nichePlaceholder: 'e.g: Fitness, Software, Food...', platform: 'Platform', tone: 'Tone', keywords: 'Keywords', keywordsPlaceholder: 'e.g: coach, mentor, CEO...', generate: 'Generate 10 Bios', generating: 'Generating...', bestBio: 'Best Bio', copy: 'Copy', copied: '✓', chars: 'chars', emptyTitle: 'Bio Generator', emptyDesc: 'Enter your niche to generate platform bios', professional: 'Professional', casual: 'Casual', humorous: 'Humorous', minimal: 'Minimal' },
  ru: { title: 'Генератор Bio', niche: 'Ниша', nichePlaceholder: 'напр: Фитнес, ИТ, Еда...', platform: 'Платформа', tone: 'Тон', keywords: 'Ключевые слова', keywordsPlaceholder: 'напр: коуч, ментор...', generate: 'Создать 10 Bio', generating: 'Создание...', bestBio: 'Лучший Bio', copy: 'Копировать', copied: '✓', chars: 'символов', emptyTitle: 'Генератор Bio', emptyDesc: 'Введите нишу', professional: 'Профессиональный', casual: 'Дружеский', humorous: 'Юмор', minimal: 'Минимальный' },
  de: { title: 'Bio Generator', niche: 'Nische', nichePlaceholder: 'z.B: Fitness, Software...', platform: 'Plattform', tone: 'Ton', keywords: 'Schlüsselwörter', keywordsPlaceholder: 'z.B: Coach, Mentor...', generate: '10 Bios erstellen', generating: 'Wird erstellt...', bestBio: 'Bestes Bio', copy: 'Kopieren', copied: '✓', chars: 'Zeichen', emptyTitle: 'Bio Generator', emptyDesc: 'Nische eingeben', professional: 'Professionell', casual: 'Locker', humorous: 'Humorvoll', minimal: 'Minimal' },
  fr: { title: 'Générateur de Bio', niche: 'Niche', nichePlaceholder: 'ex: Fitness, Tech...', platform: 'Plateforme', tone: 'Ton', keywords: 'Mots-clés', keywordsPlaceholder: 'ex: coach, mentor...', generate: 'Générer 10 Bios', generating: 'Génération...', bestBio: 'Meilleur Bio', copy: 'Copier', copied: '✓', chars: 'caractères', emptyTitle: 'Générateur de Bio', emptyDesc: 'Entrez votre niche', professional: 'Professionnel', casual: 'Décontracté', humorous: 'Humoristique', minimal: 'Minimal' }
}

const charLimits: Record<string, number> = { instagram: 150, tiktok: 80, youtube: 1000, twitter: 160, linkedin: 2600 }

export default function BioGeneratorPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('professional')
  const [keywords, setKeywords] = useState('')
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
        setSession(session)
        supabase.from('credits').select('balance').eq('user_id', session.user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [router])

  const handleGenerate = async () => {
    if (!niche.trim() || loading) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/bio-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ niche, platform, tone, keywords, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch { setError('Connection error') }
    setLoading(false)
  }

  const copyBio = (text: string, index: number) => {
    navigator.clipboard.writeText(text); setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

    const fillExample = () => { setNiche('Fitness coach and nutrition expert') }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">📝 {t.title}</h1>
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
                <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-400">{t.platform}</label>
                  <span className="text-xs text-gray-500">max {charLimits[platform]} {t.chars}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[['instagram', '📸 IG'], ['tiktok', '🎵 TikTok'], ['twitter', '🐦 X'], ['youtube', '🎬 YT'], ['linkedin', '💼 LinkedIn']].map(([val, label]) => (
                    <button key={val} onClick={() => setPlatform(val)} className={`p-2 rounded-xl border text-xs ${platform === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.tone}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['professional', t.professional], ['casual', t.casual], ['humorous', t.humorous], ['minimal', t.minimal]].map(([val, label]) => (
                    <button key={val} onClick={() => setTone(val)} className={`p-2 rounded-xl border text-sm ${tone === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.keywords}</label>
                <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder={t.keywordsPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <button onClick={fillExample} className="w-full py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition mb-2">🧪 Try Example</button>

              <button onClick={handleGenerate} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `📝 ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">📝</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
                        {loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                </div>
                <p className="text-gray-400">{t.generating}</p>
                <div className="flex justify-center gap-1.5 mt-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            {result && (
              <div className="space-y-3">
                {result.best_bio && (
                  <div className="p-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-yellow-400">🏆 {t.bestBio}</span>
                      <button onClick={() => copyBio(result.best_bio.text, -1)} className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">{copiedIndex === -1 ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-lg text-white mb-2">{result.best_bio.text}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="text-gray-500">{result.best_bio.text?.length || 0} {t.chars}</span>
                      <span className="text-yellow-400">{result.best_bio.reason}</span>
                    </div>
                  </div>
                )}
                {result.bios?.map((bio: any, i: number) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-purple-500/20 transition group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <span className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded flex items-center justify-center text-xs font-bold">{i + 1}</span>
                        <span className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-xs">{bio.style}</span>
                        {bio.has_emoji && <span className="text-xs">✨</span>}
                        {bio.has_cta && <span className="text-xs">👉</span>}
                      </div>
                      <button onClick={() => copyBio(bio.text, i)} className="px-3 py-1 bg-white/5 text-gray-400 rounded text-xs opacity-0 group-hover:opacity-100 transition">{copiedIndex === i ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-gray-200 mb-2">{bio.text}</p>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>{bio.char_count || bio.text?.length || 0} {t.chars}</span>
                      {bio.hook_type && <span className="text-purple-400">{bio.hook_type}</span>}
                    </div>
                  </div>
                ))}
                {result.tips && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">💡 Tips</h4>
                    {result.tips.map((tip: string, i: number) => <p key={i} className="text-sm text-gray-300 mb-1">• {tip}</p>)}
                  </div>
                )}
                {result.raw && !result.bios && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
