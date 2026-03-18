'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', topicLabel: 'Konu', topicPlaceholder: 'örn: 10 fitness hatası, para biriktirme yolları...', slidesLabel: 'Slide Sayısı', styleLabel: 'Stil', btn: 'Carousel Planla', loading: 'Planlanıyor...', copy: 'Kopyala', copied: '✓', slides: 'Slide\'lar', caption: 'Caption', newPlan: 'Yeni Plan' },
  en: { back: 'Dashboard', topicLabel: 'Topic', topicPlaceholder: 'e.g., 10 fitness mistakes, saving money tips...', slidesLabel: 'Number of Slides', styleLabel: 'Style', btn: 'Plan Carousel', loading: 'Planning...', copy: 'Copy', copied: '✓', slides: 'Slides', caption: 'Caption', newPlan: 'New Plan' },
  ru: { back: 'Панель', topicLabel: 'Тема', topicPlaceholder: 'напр: 10 ошибок...', slidesLabel: 'Слайдов', styleLabel: 'Стиль', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓', slides: 'Слайды', caption: 'Подпись', newPlan: 'Новый' },
  de: { back: 'Dashboard', topicLabel: 'Thema', topicPlaceholder: 'z.B. 10 Fehler...', slidesLabel: 'Anzahl', styleLabel: 'Stil', btn: 'Planen', loading: 'Plane...', copy: 'Kopieren', copied: '✓', slides: 'Slides', caption: 'Caption', newPlan: 'Neu' },
  fr: { back: 'Tableau', topicLabel: 'Sujet', topicPlaceholder: 'ex: 10 erreurs...', slidesLabel: 'Nombre', styleLabel: 'Style', btn: 'Planifier', loading: 'Planification...', copy: 'Copier', copied: '✓', slides: 'Slides', caption: 'Légende', newPlan: 'Nouveau' }
}

export default function CarouselPlannerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [slides, setSlides] = useState('10')
  const [style, setStyle] = useState('educational')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else { setUser(user); supabase.from('credits').select('balance').eq('user_id', user.id).single().then(({ data }) => setCredits(data?.balance || 0)) }
    })
  }, [])

  const handleSubmit = async () => {
    if (!topic.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/carousel-planner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, slides, style, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // if (credits >= X) { // await supabase.from("credits").update({ balance: credits - 5 }).eq('user_id', user.id); // setCredits(prev => prev - X) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500) }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">🎠</span><h1 className="font-semibold">Carousel Planner</h1></div>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.slidesLabel}</label>
                  <select value={slides} onChange={e => setSlides(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="5">5 Slides</option>
                    <option value="7">7 Slides</option>
                    <option value="10">10 Slides</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.styleLabel}</label>
                  <select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="educational">📚 Eğitici</option>
                    <option value="tips">💡 İpuçları</option>
                    <option value="story">📖 Hikaye</option>
                    <option value="comparison">⚖️ Karşılaştırma</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !topic.trim() || credits < 5} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 5 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">🎠 {t.slides}</h2>
            <div className="grid gap-3">
              {result.slides?.map((slide: any, i: number) => (
                <div key={i} className={`rounded-xl p-5 border ${i === 0 ? 'bg-red-500/5 border-red-500/20' : i === (result.slides?.length - 1) ? 'bg-green-500/5 border-green-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">{i + 1}</span>
                      <span className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded">{slide.type || (i === 0 ? 'Hook' : i === result.slides?.length - 1 ? 'CTA' : 'Content')}</span>
                    </div>
                    <button onClick={() => copyText(`slide-${i}`, slide.text || slide.content)} className="text-xs text-purple-400">{copiedKey === `slide-${i}` ? t.copied : t.copy}</button>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{slide.headline || slide.title}</h3>
                  <p className="text-gray-400 text-sm">{slide.text || slide.content}</p>
                  {slide.visual_suggestion && <p className="text-gray-500 text-xs mt-2">🎨 {slide.visual_suggestion}</p>}
                </div>
              ))}
            </div>

            {/* Caption */}
            {result.caption && (
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-blue-400 font-semibold">✍️ {t.caption}</h3>
                  <button onClick={() => copyText('caption', result.caption)} className="text-xs text-blue-400">{copiedKey === 'caption' ? t.copied : t.copy}</button>
                </div>
                <p className="text-gray-300">{result.caption}</p>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newPlan}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
