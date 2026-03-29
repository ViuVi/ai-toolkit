'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Hashtag Araştırma', topic: 'Konu', topicPlaceholder: 'örn: Fitness, Yemek tarifleri...', niche: 'Niş (opsiyonel)', nichePlaceholder: 'örn: Ev egzersizleri...', platform: 'Platform', generate: 'Hashtag Bul', generating: 'Aranıyor...', emptyTitle: "Hashtag'ler", emptyDesc: 'Konunuzu girin', recommendedSet: 'Önerilen Set', copyAll: 'Tümünü Kopyala', copied: 'Kopyalandı', trending: 'Trend', highVolume: 'Yüksek Hacim', medium: 'Orta', lowCompetition: 'Düşük Rekabet' },
  en: { title: 'Hashtag Research', topic: 'Topic', topicPlaceholder: 'e.g: Fitness, Recipes...', niche: 'Niche (optional)', nichePlaceholder: 'e.g: Home workouts...', platform: 'Platform', generate: 'Find Hashtags', generating: 'Searching...', emptyTitle: 'Hashtags', emptyDesc: 'Enter your topic', recommendedSet: 'Recommended Set', copyAll: 'Copy All', copied: 'Copied', trending: 'Trending', highVolume: 'High Volume', medium: 'Medium', lowCompetition: 'Low Competition' },
  ru: { title: 'Исследование хештегов', topic: 'Тема', topicPlaceholder: 'напр: Фитнес, Рецепты...', niche: 'Ниша (необязательно)', nichePlaceholder: 'напр: Домашние тренировки...', platform: 'Платформа', generate: 'Найти хештеги', generating: 'Поиск...', emptyTitle: 'Хештеги', emptyDesc: 'Введите тему', recommendedSet: 'Рекомендуемый набор', copyAll: 'Копировать всё', copied: 'Скопировано', trending: 'Трендовые', highVolume: 'Высокий объём', medium: 'Средние', lowCompetition: 'Низкая конкуренция' },
  de: { title: 'Hashtag-Recherche', topic: 'Thema', topicPlaceholder: 'z.B: Fitness, Rezepte...', niche: 'Nische (optional)', nichePlaceholder: 'z.B: Home-Workouts...', platform: 'Plattform', generate: 'Hashtags finden', generating: 'Suche...', emptyTitle: 'Hashtags', emptyDesc: 'Thema eingeben', recommendedSet: 'Empfohlenes Set', copyAll: 'Alle kopieren', copied: 'Kopiert', trending: 'Trending', highVolume: 'Hohes Volumen', medium: 'Mittel', lowCompetition: 'Geringe Konkurrenz' },
  fr: { title: 'Recherche Hashtags', topic: 'Sujet', topicPlaceholder: 'ex: Fitness, Recettes...', niche: 'Niche (optionnel)', nichePlaceholder: 'ex: Entraînements maison...', platform: 'Plateforme', generate: 'Trouver des hashtags', generating: 'Recherche...', emptyTitle: 'Hashtags', emptyDesc: 'Entrez votre sujet', recommendedSet: 'Set recommandé', copyAll: 'Tout copier', copied: 'Copié', trending: 'Tendance', highVolume: 'Haut volume', medium: 'Moyen', lowCompetition: 'Faible concurrence' }
}

export default function HashtagResearchPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
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

  const handleSearch = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ topic, niche, platform, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }

  const copyHashtags = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const fillExample = () => { setTopic('Home workout routines') }


  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">#️⃣ {t.title}</h1>
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
                <label className="block text-sm text-gray-400 mb-2">{t.niche}</label>
                <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {['instagram', 'tiktok', 'twitter', 'youtube'].map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`p-3 rounded-xl border text-sm capitalize ${platform === p ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={fillExample} className="w-full py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition mb-2">🧪 Try Example</button>

              <button onClick={handleSearch} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `#️⃣ ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">#️⃣</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">Konunuzu girin</p></div>}
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
              <div className="space-y-4">
                {(result.recommended_set || result.hashtag_sets) && (
                  <div className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-purple-400">{`📋 ${t.recommendedSet}`}</h3>
                      <button onClick={() => copyHashtags((result.recommended_set || result.hashtag_sets).copy_paste)} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">{copied ? `✓ ${t.copied}` : t.copyAll}</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(result.recommended_set || result.hashtag_sets).hashtags?.map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {[
                  { key: 'trending_hashtags', title: `🔥 ${t.trending}`, color: 'red' },
                  { key: 'high_volume_hashtags', title: `📈 ${t.highVolume}`, color: 'orange' },
                  { key: 'medium_hashtags', title: `⚖️ ${t.medium}`, color: 'yellow' },
                  { key: 'low_competition_hashtags', title: `💎 ${t.lowCompetition}`, color: 'green' },
                ].map(({ key, title, color }) => result[key] && (
                  <div key={key} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className={`font-semibold text-${color}-400 mb-3`}>{title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {result[key].map((tag: any, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/5 text-gray-300 rounded text-sm">{tag.hashtag || tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {result.raw && !(result.recommended_set || result.hashtag_sets) && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
