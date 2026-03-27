'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 3

const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Caption Üretici', topic: 'Konu', topicPlaceholder: 'örn: Sabah rutini, Yeni ürün...', platform: 'Platform', style: 'Stil', generate: '15 Caption Üret', generating: 'Üretiliyor...', copy: 'Kopyala', copied: '✓', copyAll: 'Tümünü Kopyala', emptyTitle: 'Viral Captionlar', emptyDesc: 'Konunuzu girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata oluştu', engaging: 'İlgi Çekici', storytelling: 'Hikaye', promotional: 'Tanıtım', educational: 'Eğitici', emoji: 'Emoji Ekle', hashtags: 'Hashtag Ekle', bestCaption: 'En İyi Caption' },
  en: { title: 'Caption Generator', topic: 'Topic', topicPlaceholder: 'e.g: Morning routine, New product...', platform: 'Platform', style: 'Style', generate: 'Generate 15 Captions', generating: 'Generating...', copy: 'Copy', copied: '✓', copyAll: 'Copy All', emptyTitle: 'Viral Captions', emptyDesc: 'Enter your topic', insufficientCredits: 'Insufficient credits', error: 'Error occurred', engaging: 'Engaging', storytelling: 'Storytelling', promotional: 'Promotional', educational: 'Educational', emoji: 'Add Emoji', hashtags: 'Add Hashtags', bestCaption: 'Best Caption' },
  ru: { title: 'Генератор Подписей', topic: 'Тема', topicPlaceholder: 'напр: Утренний ритуал...', platform: 'Платформа', style: 'Стиль', generate: 'Создать 15 Подписей', generating: 'Создаём...', copy: 'Копировать', copied: '✓', copyAll: 'Копировать всё', emptyTitle: 'Подписи', emptyDesc: 'Введите тему', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', engaging: 'Вовлекающий', storytelling: 'История', promotional: 'Промо', educational: 'Обучающий', emoji: 'Добавить Emoji', hashtags: 'Добавить Хештеги', bestCaption: 'Лучшая Подпись' },
  de: { title: 'Caption Generator', topic: 'Thema', topicPlaceholder: 'z.B: Morgenroutine...', platform: 'Plattform', style: 'Stil', generate: '15 Captions Erstellen', generating: 'Erstellen...', copy: 'Kopieren', copied: '✓', copyAll: 'Alle kopieren', emptyTitle: 'Captions', emptyDesc: 'Thema eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', engaging: 'Ansprechend', storytelling: 'Geschichte', promotional: 'Werbung', educational: 'Lehrreich', emoji: 'Emoji hinzufügen', hashtags: 'Hashtags hinzufügen', bestCaption: 'Beste Caption' },
  fr: { title: 'Générateur de Légendes', topic: 'Sujet', topicPlaceholder: 'ex: Routine matinale...', platform: 'Plateforme', style: 'Style', generate: 'Générer 15 Légendes', generating: 'Génération...', copy: 'Copier', copied: '✓', copyAll: 'Tout copier', emptyTitle: 'Légendes', emptyDesc: 'Entrez votre sujet', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', engaging: 'Engageant', storytelling: 'Narration', promotional: 'Promotionnel', educational: 'Éducatif', emoji: 'Ajouter Emoji', hashtags: 'Ajouter Hashtags', bestCaption: 'Meilleure Légende' }
}

const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function CaptionGeneratorPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [style, setStyle] = useState('engaging')
  const [includeEmoji, setIncludeEmoji] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) }
    })
  }, [router])

  const handleGenerate = async () => {
    if (!topic.trim() || loading || !user) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/caption-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, style, includeEmoji, includeHashtags, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const copyToClipboard = (text: string, index: number) => { navigator.clipboard.writeText(text); setCopiedIndex(index); setTimeout(() => setCopiedIndex(null), 2000) }

  const platforms = [{ value: 'instagram', label: 'Instagram', icon: '📸' }, { value: 'tiktok', label: 'TikTok', icon: '🎵' }, { value: 'facebook', label: 'Facebook', icon: '👍' }, { value: 'linkedin', label: 'LinkedIn', icon: '💼' }]
  const styles = [{ value: 'engaging', label: t.engaging }, { value: 'storytelling', label: t.storytelling }, { value: 'promotional', label: t.promotional }, { value: 'educational', label: t.educational }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link>
            <div className="flex items-center gap-2"><span className="text-2xl">✍️</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button>
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}
              </div>
            </div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div><label className="block text-sm text-gray-400 mb-2">{t.topic}</label><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none transition" /></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="grid grid-cols-2 gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>{p.icon} {p.label}</button>))}</div></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.style}</label><div className="flex flex-wrap gap-2">{styles.map(s => (<button key={s.value} onClick={() => setStyle(s.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${style === s.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>{s.label}</button>))}</div></div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={includeEmoji} onChange={(e) => setIncludeEmoji(e.target.checked)} className="w-4 h-4 rounded bg-white/10 border-white/20" /><span className="text-sm text-gray-400">{t.emoji}</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={includeHashtags} onChange={(e) => setIncludeHashtags(e.target.checked)} className="w-4 h-4 rounded bg-white/10 border-white/20" /><span className="text-sm text-gray-400">{t.hashtags}</span></label>
              </div>
              <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>✍️ {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">✍️</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-3">
              {result.best_caption && (<div className="p-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl"><div className="flex items-center gap-2 mb-3"><span className="text-xl">🏆</span><span className="font-semibold text-yellow-400">{t.bestCaption}</span></div><p className="font-medium">{result.best_caption.text}</p></div>)}
              <div className="max-h-[60vh] overflow-y-auto space-y-3">{result.captions?.map((caption: any, index: number) => (<div key={index} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-purple-500/30 transition group"><div className="flex justify-between items-start gap-3"><p className="flex-1">{caption.text}</p><button onClick={() => copyToClipboard(caption.text, index)} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">{copiedIndex === index ? '✓' : t.copy}</button></div>{caption.style && <span className="mt-2 inline-block px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs">{caption.style}</span>}</div>))}</div>
              {result.tips && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><p className="text-sm text-gray-300">{result.tips.join(' • ')}</p></div>)}
              {result.raw && !result.captions?.length && (<div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl"><pre className="whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre></div>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
