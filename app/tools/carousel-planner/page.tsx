'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Carousel Planner', topic: 'Carousel Konusu', topicPlaceholder: 'örn: 5 adımda viral olmak...', slideCount: 'Slide Sayısı', style: 'Stil', generate: 'Carousel Oluştur', generating: '{t.generating}', copy: t.copy, emptyTitle: 'Carousel Planner', emptyDesc: "{t.emptyDesc}", concept: 'Konsept', caption: 'Caption', design: 'Tasarım', educational: 'Eğitici', storytelling: 'Hikaye', listicle: 'Liste', howTo: 'Nasıl Yapılır' },
  en: { title: 'Carousel Planner', topic: 'Carousel Topic', topicPlaceholder: 'e.g: 5 steps to go viral...', slideCount: 'Slide Count', style: 'Style', generate: 'Create Carousel', generating: 'Planning...', copy: 'Copy', emptyTitle: 'Carousel Planner', emptyDesc: 'Enter your topic to plan slides', concept: 'Concept', caption: 'Caption', design: 'Design', educational: 'Educational', storytelling: 'Storytelling', listicle: 'Listicle', howTo: 'How-To' },
  ru: { title: 'Планировщик Карусели', topic: 'Тема карусели', topicPlaceholder: 'напр: 5 шагов к вирусности...', slideCount: 'Кол-во слайдов', style: 'Стиль', generate: 'Создать карусель', generating: 'Планирование...', copy: 'Копировать', emptyTitle: 'Планировщик Карусели', emptyDesc: 'Введите тему для планирования слайдов', concept: 'Концепция', caption: 'Подпись', design: 'Дизайн', educational: 'Обучающий', storytelling: 'Сторителлинг', listicle: 'Список', howTo: 'Инструкция' },
  de: { title: 'Karussell-Planer', topic: 'Karussell-Thema', topicPlaceholder: 'z.B: 5 Schritte viral zu gehen...', slideCount: 'Slide-Anzahl', style: 'Stil', generate: 'Karussell erstellen', generating: 'Wird geplant...', copy: 'Kopieren', emptyTitle: 'Karussell-Planer', emptyDesc: 'Thema eingeben, um Slides zu planen', concept: 'Konzept', caption: 'Caption', design: 'Design', educational: 'Lehrreich', storytelling: 'Storytelling', listicle: 'Liste', howTo: 'Anleitung' },
  fr: { title: 'Planificateur Carrousel', topic: 'Sujet du carrousel', topicPlaceholder: 'ex: 5 étapes pour devenir viral...', slideCount: 'Nombre de slides', style: 'Style', generate: 'Créer le carrousel', generating: 'Planification...', copy: 'Copier', emptyTitle: 'Planificateur Carrousel', emptyDesc: 'Entrez votre sujet pour planifier les slides', concept: 'Concept', caption: 'Légende', design: 'Design', educational: 'Éducatif', storytelling: 'Storytelling', listicle: 'Liste', howTo: 'Tutoriel' }
}

export default function CarouselPlannerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [slideCount, setSlideCount] = useState('7')
  const [style, setStyle] = useState('educational')
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
      const res = await fetch('/api/carousel-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, slideCount, style, language, userId: user.id })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch (e) { setError('Connection error') }
    setLoading(false)
  }

  const copyCaption = () => {
    if (result?.caption?.full_caption) {
      navigator.clipboard.writeText(result.caption.full_caption)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">🎠 {t.title}</h1>
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
                <label className="block text-sm text-gray-400 mb-2">{t.slideCount}</label>
                <div className="grid grid-cols-4 gap-2">
                  {['5', '7', '10', '12'].map((n) => (
                    <button key={n} onClick={() => setSlideCount(n)} className={`p-3 rounded-xl border text-sm ${slideCount === n ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Stil</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['educational', `📚 ${t.educational}`], ['storytelling', `📖 ${t.storytelling}`], ['listicle', `📋 ${t.listicle}`], ['how-to', `🎯 ${t.howTo}`]].map(([val, label]) => (
                    <button key={val} onClick={() => setStyle(val)} className={`p-2 rounded-xl border text-sm ${style === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : '🎠 Carousel Oluştur'}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🎠</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result && (
              <div className="space-y-4">
                {/* Concept */}
                {result.carousel_concept && (
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">{`💡 ${t.concept}`}</h4>
                    <p className="text-sm text-gray-300">{result.carousel_concept}</p>
                  </div>
                )}

                {/* Slides */}
                {result.slides?.map((slide: any, i: number) => (
                  <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm font-bold">{slide.number || i + 1}</span>
                      <span className={`text-xs px-2 py-1 rounded ${slide.type === 'hook' ? 'bg-red-500/20 text-red-400' : slide.type === 'cta' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{slide.type?.toUpperCase() || 'CONTENT'}</span>
                    </div>
                    <h4 className="font-medium mb-1">{slide.headline}</h4>
                    {(slide.body || slide.subtext) && <p className="text-sm text-gray-400">{slide.body || slide.subtext}</p>}
                    {slide.visual_direction && <p className="text-xs text-purple-400 mt-2">🎨 {slide.visual_direction}</p>}
                  </div>
                ))}

                {/* Caption */}
                {result.caption && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-purple-400">{`✍️ ${t.caption}`}</h4>
                      <button onClick={copyCaption} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">{copied ? '✓' : t.copy}</button>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{result.caption.full_caption || result.caption}</p>
                  </div>
                )}

                {/* Design Specs */}
                {result.design_specs && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <h4 className="font-semibold text-purple-400 mb-2">{`📐 ${t.design}`}</h4>
                    <p className="text-sm text-gray-400">Boyut: {result.design_specs.dimensions}</p>
                    {result.design_specs.font_recommendation && <p className="text-sm text-gray-400">Font: {result.design_specs.font_recommendation}</p>}
                  </div>
                )}

                {result.raw && !result.slides && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
