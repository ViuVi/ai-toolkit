'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Bu Videoyu Çal', videoDesc: 'Viral Video Açıklaması', videoPlaceholder: 'Viral videonun ne hakkında olduğunu açıklayın...', yourNiche: 'Sizin Nişiniz', nichePlaceholder: 'örn: Fitness, Girişimcilik...', generate: 'İçeriği Çal ve Dönüştür', generating: 'Analiz Ediliyor...', emptyTitle: 'Steal This Video', emptyDesc: 'Viral bir videoyu analiz edip sizin nişinize uyarlayın', script: 'Script', shots: 'Çekimler', caption: 'Caption', fullScript: 'Tam Script', copy: 'Kopyala', copied: 'Kopyalandı' },
  en: { title: 'Steal This Video', videoDesc: 'Viral Video Description', videoPlaceholder: 'Describe the viral video...', yourNiche: 'Your Niche', nichePlaceholder: 'e.g: Fitness, Entrepreneurship...', generate: 'Steal & Transform', generating: 'Analyzing...', emptyTitle: 'Steal This Video', emptyDesc: 'Analyze a viral video and adapt it to your niche', script: 'Script', shots: 'Shots', caption: 'Caption', fullScript: 'Full Script', copy: 'Copy', copied: 'Copied' },
  ru: { title: 'Укради это видео', videoDesc: 'Описание вирусного видео', videoPlaceholder: 'Опишите вирусное видео...', yourNiche: 'Ваша ниша', nichePlaceholder: 'напр: Фитнес, Бизнес...', generate: 'Украсть и адаптировать', generating: 'Анализируем...', emptyTitle: 'Укради это видео', emptyDesc: 'Проанализируйте вирусное видео и адаптируйте', script: 'Скрипт', shots: 'Кадры', caption: 'Подпись', fullScript: 'Полный скрипт', copy: 'Копировать', copied: 'Скопировано' },
  de: { title: 'Video stehlen', videoDesc: 'Virales Video Beschreibung', videoPlaceholder: 'Beschreiben Sie das virale Video...', yourNiche: 'Ihre Nische', nichePlaceholder: 'z.B: Fitness, Unternehmertum...', generate: 'Stehlen & Umwandeln', generating: 'Wird analysiert...', emptyTitle: 'Video stehlen', emptyDesc: 'Analysieren Sie ein virales Video und passen Sie es an', script: 'Script', shots: 'Shots', caption: 'Caption', fullScript: 'Vollständiges Script', copy: 'Kopieren', copied: 'Kopiert' },
  fr: { title: 'Voler cette vidéo', videoDesc: 'Description de la vidéo virale', videoPlaceholder: 'Décrivez la vidéo virale...', yourNiche: 'Votre niche', nichePlaceholder: 'ex: Fitness, Entrepreneuriat...', generate: 'Voler et transformer', generating: 'Analyse...', emptyTitle: 'Voler cette vidéo', emptyDesc: 'Analysez une vidéo virale et adaptez-la', script: 'Script', shots: 'Plans', caption: 'Légende', fullScript: 'Script complet', copy: 'Copier', copied: 'Copié' }
}

export default function StealVideoPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [videoDescription, setVideoDescription] = useState('')
  const [creatorNiche, setCreatorNiche] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('script')
  const [copied, setCopied] = useState(false)
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
    if (!videoDescription.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/steal-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoDescription, creatorNiche, platform, language, userId: user.id })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">🎯 {t.title}</h1>
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
                <label className="block text-sm text-gray-400 mb-2">{t.videoDesc}</label>
                <textarea value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} placeholder={t.videoPlaceholder} rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.yourNiche}</label>
                <input type="text" value={creatorNiche} onChange={(e) => setCreatorNiche(e.target.value)} placeholder={t.nichePlaceholder || "e.g: Fitness..."} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <button onClick={handleGenerate} disabled={loading || !videoDescription.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `🎯 ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🎯</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                  {[['script', '📝 Script'], ['shots', '🎬 Shots'], ['caption', '✍️ Caption']].map(([key, label]) => (
                    <button key={key} onClick={() => setActiveTab(key)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${activeTab === key ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{label}</button>
                  ))}
                </div>

                {/* Script Tab */}
                {activeTab === 'script' && (
                  <div className="space-y-4">
                    {result.script?.full_script && (
                      <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="flex justify-between mb-3">
                          <h3 className="font-semibold text-purple-400">{`📝 ${t.fullScript}`}</h3>
                          <button onClick={() => copyText(result.script.full_script)} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">{copied ? '✓' : t.copy}</button>
                        </div>
                        <p className="whitespace-pre-wrap text-gray-200">{result.script.full_script}</p>
                      </div>
                    )}
                    {result.hook && (
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        <h4 className="font-semibold text-orange-400 mb-2">🎯 Hook</h4>
                        <p className="text-gray-200">{result.hook.text}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Shots Tab */}
                {activeTab === 'shots' && result.shot_list && (
                  <div className="space-y-3">
                    {result.shot_list.map((shot: any, i: number) => (
                      <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">{shot.scene}</span>
                          <div>
                            <span className="font-semibold">{shot.name}</span>
                            <span className="text-gray-500 text-sm ml-2">({shot.shot_type} - {shot.duration})</span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm ml-11">{shot.description}</p>
                        {shot.notes && <p className="text-gray-500 text-xs ml-11 mt-1">{shot.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Caption Tab */}
                {activeTab === 'caption' && (
                  <div className="space-y-4">
                    {result.caption && (
                      <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <h3 className="font-semibold text-purple-400 mb-3">{`✍️ ${t.caption}`}</h3>
                        <p className="text-gray-200">{result.caption.text}</p>
                      </div>
                    )}
                    {result.hashtags && (
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <h4 className="font-semibold text-purple-400 mb-2">#️⃣ Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.hashtags.map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-sm">{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {result.raw && !result.script && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
