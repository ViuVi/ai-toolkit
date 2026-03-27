'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 5
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Carousel Planlayıcı', topic: 'Konu', topicPlaceholder: 'örn: 10 Verimlilik İpucu...', slides: 'Slayt Sayısı', style: 'Stil', generate: 'Carousel Oluştur', generating: 'Oluşturuluyor...', copy: 'Kopyala', emptyTitle: 'Carousel İçeriği', emptyDesc: 'Konunuzu girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', educational: 'Eğitici', storytelling: 'Hikaye', tips: 'İpuçları', listicle: 'Liste', caption: 'Caption', hashtags: 'Hashtagler', designTips: 'Tasarım İpuçları' },
  en: { title: 'Carousel Planner', topic: 'Topic', topicPlaceholder: 'e.g: 10 Productivity Tips...', slides: 'Number of Slides', style: 'Style', generate: 'Create Carousel', generating: 'Creating...', copy: 'Copy', emptyTitle: 'Carousel Content', emptyDesc: 'Enter your topic', insufficientCredits: 'Insufficient credits', error: 'Error', educational: 'Educational', storytelling: 'Storytelling', tips: 'Tips', listicle: 'Listicle', caption: 'Caption', hashtags: 'Hashtags', designTips: 'Design Tips' },
  ru: { title: 'Планировщик Карусели', topic: 'Тема', topicPlaceholder: 'напр: 10 Советов...', slides: 'Количество Слайдов', style: 'Стиль', generate: 'Создать Карусель', generating: 'Создаём...', copy: 'Копировать', emptyTitle: 'Контент Карусели', emptyDesc: 'Введите тему', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', educational: 'Обучающий', storytelling: 'История', tips: 'Советы', listicle: 'Список', caption: 'Подпись', hashtags: 'Хештеги', designTips: 'Советы по Дизайну' },
  de: { title: 'Carousel-Planer', topic: 'Thema', topicPlaceholder: 'z.B: 10 Produktivitätstipps...', slides: 'Anzahl Slides', style: 'Stil', generate: 'Carousel Erstellen', generating: 'Erstellen...', copy: 'Kopieren', emptyTitle: 'Carousel-Inhalt', emptyDesc: 'Thema eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', educational: 'Lehrreich', storytelling: 'Geschichte', tips: 'Tipps', listicle: 'Liste', caption: 'Caption', hashtags: 'Hashtags', designTips: 'Design-Tipps' },
  fr: { title: 'Planificateur Carrousel', topic: 'Sujet', topicPlaceholder: 'ex: 10 Conseils...', slides: 'Nombre de Slides', style: 'Style', generate: 'Créer Carrousel', generating: 'Création...', copy: 'Copier', emptyTitle: 'Contenu Carrousel', emptyDesc: 'Entrez votre sujet', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', educational: 'Éducatif', storytelling: 'Narration', tips: 'Conseils', listicle: 'Liste', caption: 'Légende', hashtags: 'Hashtags', designTips: 'Conseils Design' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function CarouselPlannerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [slides, setSlides] = useState('10')
  const [style, setStyle] = useState('educational')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!topic.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/carousel-planner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, slides, style, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const styles = [{ value: 'educational', label: t.educational }, { value: 'storytelling', label: t.storytelling }, { value: 'tips', label: t.tips }, { value: 'listicle', label: t.listicle }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">🎠</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.topic}</label><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.slides}</label><div className="flex gap-2">{['5', '7', '10', '12'].map(s => (<button key={s} onClick={() => setSlides(s)} className={`px-4 py-2 rounded-xl border text-sm transition ${slides === s ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{s}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.style}</label><div className="flex flex-wrap gap-2">{styles.map(st => (<button key={st.value} onClick={() => setStyle(st.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${style === st.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{st.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>🎠 {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🎠</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              {result.carousel?.slides && (<div className="space-y-3 max-h-[50vh] overflow-y-auto">{result.carousel.slides.map((slide: any, i: number) => (<div key={i} className={`p-4 rounded-xl border ${slide.type === 'hook' ? 'bg-yellow-500/10 border-yellow-500/20' : slide.type === 'cta' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/[0.02] border-white/5'}`}><div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xs font-bold">{slide.slide_number || i + 1}</span><span className="text-xs text-gray-500">{slide.type}</span></div><h3 className="font-medium mb-1">{slide.headline}</h3>{slide.subtext && <p className="text-sm text-gray-400">{slide.subtext}</p>}{slide.visual_suggestion && <p className="text-xs text-blue-400 mt-2">🎨 {slide.visual_suggestion}</p>}</div>))}</div>)}
              {result.carousel?.caption && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-1">📝 {t.caption}</div><p className="text-sm">{result.carousel.caption}</p></div>)}
              {result.carousel?.hashtags && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-2"># {t.hashtags}</div><div className="flex flex-wrap gap-2">{result.carousel.hashtags.map((tag: string, i: number) => (<span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-sm">{tag}</span>))}</div></div>)}
              {result.design_tips && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-2">💡 {t.designTips}</div><ul className="text-sm space-y-1">{result.design_tips.map((tip: string, i: number) => (<li key={i}>• {tip}</li>))}</ul></div>)}
              {result.raw && !result.carousel && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
