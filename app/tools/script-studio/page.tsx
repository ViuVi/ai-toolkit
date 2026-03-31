'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Script Studio', topic: 'Video Konusu', topicPlaceholder: 'örn: Yapay zeka ile 5 dakikada logo tasarımı...', platform: 'Platform', duration: 'Süre', style: 'Stil', generate: 'Script Oluştur', generating: 'Script Yazılıyor...', emptyTitle: 'Video Script', emptyDesc: 'Konunuzu girin, çekime hazır script oluşturalım', script: 'Script', scenes: 'Sahneler', extras: 'Extras', fullScript: 'Tam Script', copy: 'Kopyala', copied: 'Kopyalandı', videoInfo: 'Video Bilgileri', titleSuggestions: 'Başlık Önerileri', hashtags: "Hashtag'ler", filmingTips: 'Çekim İpuçları', educational: 'Eğitici', entertaining: 'Eğlenceli', storytelling: 'Hikaye', tutorial: 'Tutorial', sec15: '15 sn', sec30: '30 sn', sec60: '60 sn', min3: '3 dk' },
  en: { title: 'Script Studio', topic: 'Video Topic', topicPlaceholder: 'e.g: Design a logo with AI in 5 minutes...', platform: 'Platform', duration: 'Duration', style: 'Style', generate: 'Create Script', generating: 'Writing Script...', emptyTitle: 'Video Script', emptyDesc: 'Enter your topic to create a shoot-ready script', script: 'Script', scenes: 'Scenes', extras: 'Extras', fullScript: 'Full Script', copy: 'Copy', copied: 'Copied', videoInfo: 'Video Info', titleSuggestions: 'Title Suggestions', hashtags: 'Hashtags', filmingTips: 'Filming Tips', educational: 'Educational', entertaining: 'Entertaining', storytelling: 'Storytelling', tutorial: 'Tutorial', sec15: '15s', sec30: '30s', sec60: '60s', min3: '3 min' },
  ru: { title: 'Студия скриптов', topic: 'Тема видео', topicPlaceholder: 'напр: Дизайн логотипа с ИИ за 5 минут...', platform: 'Платформа', duration: 'Длительность', style: 'Стиль', generate: 'Создать скрипт', generating: 'Пишем скрипт...', emptyTitle: 'Видео скрипт', emptyDesc: 'Введите тему для создания скрипта', script: 'Скрипт', scenes: 'Сцены', extras: 'Доп. материалы', fullScript: 'Полный скрипт', copy: 'Копировать', copied: 'Скопировано', videoInfo: 'Информация о видео', titleSuggestions: 'Варианты заголовков', hashtags: 'Хештеги', filmingTips: 'Советы по съёмке', educational: 'Обучающий', entertaining: 'Развлекательный', storytelling: 'Сторителлинг', tutorial: 'Туториал', sec15: '15 сек', sec30: '30 сек', sec60: '60 сек', min3: '3 мин' },
  de: { title: 'Script Studio', topic: 'Video-Thema', topicPlaceholder: 'z.B: Logo-Design mit KI in 5 Minuten...', platform: 'Plattform', duration: 'Dauer', style: 'Stil', generate: 'Script erstellen', generating: 'Script wird geschrieben...', emptyTitle: 'Video-Script', emptyDesc: 'Thema eingeben, um ein drehfertiges Script zu erstellen', script: 'Script', scenes: 'Szenen', extras: 'Extras', fullScript: 'Vollständiges Script', copy: 'Kopieren', copied: 'Kopiert', videoInfo: 'Video-Info', titleSuggestions: 'Titelvorschläge', hashtags: 'Hashtags', filmingTips: 'Drehtipps', educational: 'Lehrreich', entertaining: 'Unterhaltsam', storytelling: 'Storytelling', tutorial: 'Tutorial', sec15: '15 Sek', sec30: '30 Sek', sec60: '60 Sek', min3: '3 Min' },
  fr: { title: 'Studio de Scripts', topic: 'Sujet vidéo', topicPlaceholder: "ex: Créer un logo avec l'IA en 5 minutes...", platform: 'Plateforme', duration: 'Durée', style: 'Style', generate: 'Créer le script', generating: 'Écriture du script...', emptyTitle: 'Script vidéo', emptyDesc: 'Entrez votre sujet pour créer un script prêt au tournage', script: 'Script', scenes: 'Scènes', extras: 'Extras', fullScript: 'Script complet', copy: 'Copier', copied: 'Copié', videoInfo: 'Infos vidéo', titleSuggestions: 'Suggestions de titres', hashtags: 'Hashtags', filmingTips: 'Conseils de tournage', educational: 'Éducatif', entertaining: 'Divertissant', storytelling: 'Storytelling', tutorial: 'Tutoriel', sec15: '15s', sec30: '30s', sec60: '60s', min3: '3 min' }
}

export default function ScriptStudioPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [duration, setDuration] = useState('60')
  const [style, setStyle] = useState('educational')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('script')
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
    if (!topic.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/script-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ topic, platform, duration, style, language })
      })
      const data = await res.json()
      

    // Normalize API response
    if (data.result && !data.result.script && data.result.full_script) {
      data.result = { script: { full_script: data.result.full_script, hook: data.result.script?.hook || data.result.hook, ...data.result }, ...data.result }
    }
    if (data.result?.script && !data.result.script.full_script && data.result.full_script) {
      data.result.script.full_script = data.result.full_script
    }
    if (data.result && !data.result.scene_breakdown && data.result.script?.main_points) {
      data.result.scene_breakdown = data.result.script.main_points.map((p: any, i: number) => ({ scene: i+1, section: p.point, text: p.script, duration: '', visual: p.visual_cue }))
    }
    if (data.result && !data.result.title_options && data.result.tips) {
      data.result.title_options = data.result.tips
    }
      if (res.ok && data.result) {
        setResult(data.result)
      } else {
        setError(data.error || 'Error')
      }
    } catch (err) {
      setError('Connection error')
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const platforms = [
    { value: 'tiktok', label: 'TikTok' },
    { value: 'reels', label: 'Reels' },
    { value: 'shorts', label: 'Shorts' },
    { value: 'youtube', label: 'YouTube' }
  ]

  const durations = [
    { value: '15', label: t.sec15 },
    { value: '30', label: t.sec30 },
    { value: '60', label: t.sec60 },
    { value: '180', label: t.min3 }
  ]

  const styles = [
    { value: 'educational', label: `📚 ${t.educational}` },
    { value: 'entertaining', label: `🎭 ${t.entertaining}` },
    { value: 'storytelling', label: `📖 ${t.storytelling}` },
    { value: 'tutorial', label: `🎯 ${t.tutorial}` }
  ]
  const fillExample = () => { setTopic('5 AI tools that will replace your job in 2025') }


  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎬</span>
              <h1 className="font-bold text-lg">{t.title}</h1>
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
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <span className="text-purple-400">✦ {credits}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topic}</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t.topicPlaceholder}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Platform</label>
                <div className="grid grid-cols-4 gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPlatform(p.value)}
                      className={`p-2 rounded-xl border text-sm font-medium transition ${
                        platform === p.value
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.duration}</label>
                <div className="grid grid-cols-4 gap-2">
                  {durations.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={`p-2 rounded-xl border text-sm font-medium transition ${
                        duration === d.value
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Stil</label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`p-2 rounded-xl border text-sm font-medium transition ${
                        style === s.value
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={fillExample} className="w-full py-2 bg-white/5 border border-dashed border-white/20 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition mb-2">🧪 Try Example</button>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {t.generating}
                  </>
                ) : (
                  <>{`🎬 ${t.generate}`}</>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3>
                <p className="text-gray-500">{t.emptyDesc}</p>
              </div>
            )}

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
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                  <button
                    onClick={() => setActiveTab('script')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                      activeTab === 'script' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    📝 Script
                  </button>
                  <button
                    onClick={() => setActiveTab('scenes')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                      activeTab === 'scenes' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🎬 Sahneler
                  </button>
                  <button
                    onClick={() => setActiveTab('extras')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                      activeTab === 'extras' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    ✨ Extras
                  </button>
                </div>

                {/* Script Tab */}
                {activeTab === 'script' && result.script && (
                  <div className="space-y-4">
                    {/* Full Script */}
                    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-purple-400">{`📝 ${t.fullScript}`}</h3>
                        <button
                          onClick={() => copyToClipboard(result.script.full_script || '')}
                          className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition"
                        >
                          {copied ? `✓ ${t.copied}` : t.copy}
                        </button>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                          {result.script.full_script}
                        </p>
                      </div>
                    </div>

                    {/* Script Sections */}
                    {result.script.hook && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-red-400">🎯 HOOK ({result.script.hook.duration})</span>
                        </div>
                        <p className="text-gray-200">{result.script.hook.text}</p>
                        <p className="text-xs text-gray-500 mt-2">{result.script.hook.delivery}</p>
                      </div>
                    )}

                    {result.script.problem && (
                      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        <span className="text-sm font-semibold text-orange-400">⚠️ PROBLEM</span>
                        <p className="text-gray-200 mt-2">{result.script.problem.text}</p>
                      </div>
                    )}

                    {result.script.buildup && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <span className="text-sm font-semibold text-yellow-400">📈 BUILD-UP</span>
                        <p className="text-gray-200 mt-2">{result.script.buildup.text}</p>
                      </div>
                    )}

                    {result.script.solution && (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <span className="text-sm font-semibold text-green-400">✅ SOLUTION</span>
                        <p className="text-gray-200 mt-2">{result.script.solution.text}</p>
                      </div>
                    )}

                    {result.script.cta && (
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                        <span className="text-sm font-semibold text-purple-400">👉 CTA</span>
                        <p className="text-gray-200 mt-2">{result.script.cta.text}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Scenes Tab */}
                {activeTab === 'scenes' && result.scene_breakdown && (
                  <div className="space-y-3">
                    {result.scene_breakdown.map((scene: any, index: number) => (
                      <div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">
                            {scene.scene}
                          </span>
                          <div>
                            <span className="font-semibold text-white">{scene.section}</span>
                            <span className="text-gray-500 text-sm ml-2">({scene.shot} - {scene.duration})</span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm ml-11">{scene.text}</p>
                        <p className="text-gray-500 text-xs ml-11 mt-1">{scene.action}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extras Tab */}
                {activeTab === 'extras' && (
                  <div className="space-y-4">
                    {/* Metadata */}
                    {result.metadata && (
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <h4 className="font-semibold text-purple-400 mb-3">{`📊 ${t.videoInfo}`}</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <span className="text-gray-500">{t.duration}:</span>
                            <span className="text-white ml-2">{result.metadata.total_duration}</span>
                          </div>
                          <div className="p-2 bg-white/5 rounded-lg">
                            <span className="text-gray-500">Kelime:</span>
                            <span className="text-white ml-2">{result.metadata.word_count}</span>
                          </div>
                          <div className="p-2 bg-white/5 rounded-lg col-span-2">
                            <span className="text-gray-500">Stil:</span>
                            <span className="text-white ml-2">{result.metadata.speaking_style}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Title Options */}
                    {result.title_options && (
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <h4 className="font-semibold text-purple-400 mb-3">{`📌 ${t.titleSuggestions}`}</h4>
                        <div className="space-y-2">
                          {result.title_options.map((title: string, i: number) => (
                            <div key={i} className="p-2 bg-white/5 rounded-lg text-sm text-gray-300">
                              {title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hashtags */}
                    {result.hashtags && (
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <h4 className="font-semibold text-purple-400 mb-3">#️⃣ {t.hashtags}</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.hashtags.map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Filming Tips */}
                    {result.filming_tips && (
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                        <h4 className="font-semibold text-purple-400 mb-3">{`💡 ${t.filmingTips}`}</h4>
                        <ul className="space-y-2">
                          {result.filming_tips.map((tip: string, i: number) => (
                            <li key={i} className="text-sm text-gray-300 flex gap-2">
                              <span className="text-purple-400">•</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Raw fallback */}
                {result.raw && !result.script && (
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
