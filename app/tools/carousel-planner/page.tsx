'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Carousel Planner', icon: '🎠', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Instagram carousel\'leri için slide-by-slide içerik planı oluşturur.', topicLabel: 'Carousel Konusu', topicPlaceholder: 'örn: 10 tasarruf ipucu...', slideCountLabel: 'Slide Sayısı', platformLabel: 'Platform', btn: 'Carousel Planla', loading: 'Planlanıyor...', copy: 'Kopyala', copied: '✓', download: '📥 İndir' },
  en: { title: 'Carousel Planner', icon: '🎠', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Creates slide-by-slide content plans for Instagram carousels.', topicLabel: 'Carousel Topic', topicPlaceholder: 'e.g., 10 saving tips...', slideCountLabel: 'Slide Count', platformLabel: 'Platform', btn: 'Plan Carousel', loading: 'Planning...', copy: 'Copy', copied: '✓', download: '📥 Download' },
  ru: { title: 'Carousel Planner', icon: '🎠', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Планирует карусели.', topicLabel: 'Тема', topicPlaceholder: 'напр: 10 советов...', slideCountLabel: 'Слайдов', platformLabel: 'Платформа', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓', download: '📥 Скачать' },
  de: { title: 'Carousel Planner', icon: '🎠', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Plant Karusselle.', topicLabel: 'Thema', topicPlaceholder: 'z.B. 10 Tipps...', slideCountLabel: 'Slides', platformLabel: 'Plattform', btn: 'Erstellen', loading: 'Erstelle...', copy: 'Kopieren', copied: '✓', download: '📥 Herunterladen' },
  fr: { title: 'Carousel Planner', icon: '🎠', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Planifie les carrousels.', topicLabel: 'Sujet', topicPlaceholder: 'ex: 10 conseils...', slideCountLabel: 'Slides', platformLabel: 'Plateforme', btn: 'Créer', loading: 'Création...', copy: 'Copier', copied: '✓', download: '📥 Télécharger' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [slideCount, setSlideCount] = useState('10')
  const [platform, setPlatform] = useState('instagram')
  const [copiedSlide, setCopiedSlide] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!topic.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/carousel-planner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, slideCount, platform, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copySlide = (index: number, slide: any) => {
    const text = `${slide.headline}\n${slide.subheadline || ''}\n${slide.body || ''}`
    navigator.clipboard.writeText(text)
    setCopiedSlide(index); setTimeout(() => setCopiedSlide(null), 1500)
  }

  const downloadCarousel = () => {
    if (!result?.slides) return
    let txt = `🎠 CAROUSEL PLANI\n${'═'.repeat(50)}\n\n`
    txt += `Konu: ${topic}\nPlatform: ${platform}\n\n`
    
    result.slides.forEach((slide: any) => {
      txt += `${'─'.repeat(50)}\n`
      txt += `SLIDE ${slide.number} (${slide.type})\n`
      txt += `${'─'.repeat(50)}\n`
      txt += `Başlık: ${slide.headline}\n`
      if (slide.subheadline) txt += `Alt Başlık: ${slide.subheadline}\n`
      if (slide.body) txt += `İçerik: ${slide.body}\n`
      if (slide.visual_suggestion) txt += `Görsel: ${slide.visual_suggestion}\n`
      if (slide.design_tip) txt += `Tasarım: ${slide.design_tip}\n`
      txt += `\n`
    })
    
    if (result.caption) {
      txt += `${'═'.repeat(50)}\nCAPTION\n${'═'.repeat(50)}\n`
      txt += `${result.caption.hook}\n\n${result.caption.body}\n\n${result.caption.cta}\n\n`
      if (result.caption.hashtags) txt += `Hashtags: ${result.caption.hashtags.join(' ')}`
    }
    
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob)
    link.download = `carousel-${topic.replace(/\s+/g, '-').slice(0, 20)}.txt`; link.click()
  }

  const typeColors: any = { 'cover': 'bg-purple-500/20 text-purple-400 border-purple-500/50', 'hook': 'bg-red-500/20 text-red-400 border-red-500/50', 'content': 'bg-blue-500/20 text-blue-400 border-blue-500/50', 'bonus': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50', 'cta': 'bg-green-500/20 text-green-400 border-green-500/50' }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">{t.back}</Link>
            <span className="text-2xl">{t.icon}</span><h1 className="text-xl font-bold">{t.title}</h1>
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
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6"><p className="text-gray-400 text-sm">{t.purpose}</p></div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div><label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label><input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-gray-400 mb-2">{t.slideCountLabel}</label><select value={slideCount} onChange={e => setSlideCount(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white"><option value="5">5 slide</option><option value="7">7 slide</option><option value="10">10 slide</option></select></div>
                <div><label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label><select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white"><option value="instagram">Instagram</option><option value="linkedin">LinkedIn</option></select></div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
            
            {/* Caption */}
            {result?.caption && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-blue-400 font-medium mb-3">📝 Caption</h4>
                <div className="space-y-2">
                  <p className="text-white text-sm font-medium">{result.caption.hook}</p>
                  <p className="text-gray-300 text-sm">{result.caption.body}</p>
                  <p className="text-green-400 text-sm">{result.caption.cta}</p>
                  {result.caption.hashtags && <div className="flex flex-wrap gap-1 mt-2">{result.caption.hashtags.slice(0,10).map((h: string, i: number) => <span key={i} className="text-blue-400 text-xs">{h}</span>)}</div>}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3 max-h-[700px] overflow-y-auto">
            {result?.slides ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">{result.slides.length} slide</span>
                  <button onClick={downloadCarousel} className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-lg">{t.download}</button>
                </div>
                
                {result.slides.map((slide: any, i: number) => (
                  <div key={i} className={`rounded-xl p-4 border ${typeColors[slide.type] || 'bg-gray-800/50 border-gray-700'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold">{slide.number}</span>
                        <span className="text-xs uppercase opacity-70">{slide.type}</span>
                      </div>
                      <button onClick={() => copySlide(i, slide)} className={`text-xs px-2 py-1 rounded ${copiedSlide === i ? 'bg-green-500/30 text-green-400' : 'bg-white/10'}`}>{copiedSlide === i ? t.copied : t.copy}</button>
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-1">{slide.headline}</h3>
                    {slide.subheadline && <p className="text-gray-300 text-sm mb-2">{slide.subheadline}</p>}
                    {slide.body && <p className="text-gray-400 text-sm">{slide.body}</p>}
                    
                    {(slide.visual_suggestion || slide.design_tip) && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                        {slide.visual_suggestion && <p className="text-xs text-gray-500">🎨 {slide.visual_suggestion}</p>}
                        {slide.design_tip && <p className="text-xs text-gray-500">💡 {slide.design_tip}</p>}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Design Guidelines */}
                {result.design_guidelines && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mt-4">
                    <h4 className="text-purple-400 font-medium mb-2">🎨 Tasarım Önerileri</h4>
                    {result.design_guidelines.color_palette && <p className="text-gray-300 text-sm">Renkler: {result.design_guidelines.color_palette}</p>}
                    {result.design_guidelines.overall_style && <p className="text-gray-300 text-sm">Stil: {result.design_guidelines.overall_style}</p>}
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
