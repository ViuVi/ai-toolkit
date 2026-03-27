'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 6

const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Script Studio', topic: 'Video Konusu', topicPlaceholder: 'örn: 5 Verimlilik İpucu...', duration: 'Süre', platform: 'Platform', style: 'Stil', generate: 'Script Oluştur', generating: 'Oluşturuluyor...', copy: 'Kopyala', copied: '✓', download: 'İndir', emptyTitle: 'Video Script', emptyDesc: 'Konunuzu girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', hook: 'Hook', intro: 'Giriş', mainPoints: 'Ana Noktalar', climax: 'Doruk', cta: 'CTA', outro: 'Kapanış', fullScript: 'Tam Script', tips: 'İpuçları', educational: 'Eğitici', entertaining: 'Eğlenceli', motivational: 'Motivasyonel', storytelling: 'Hikaye' },
  en: { title: 'Script Studio', topic: 'Video Topic', topicPlaceholder: 'e.g: 5 Productivity Tips...', duration: 'Duration', platform: 'Platform', style: 'Style', generate: 'Generate Script', generating: 'Generating...', copy: 'Copy', copied: '✓', download: 'Download', emptyTitle: 'Video Script', emptyDesc: 'Enter your topic', insufficientCredits: 'Insufficient credits', error: 'Error', hook: 'Hook', intro: 'Intro', mainPoints: 'Main Points', climax: 'Climax', cta: 'CTA', outro: 'Outro', fullScript: 'Full Script', tips: 'Tips', educational: 'Educational', entertaining: 'Entertaining', motivational: 'Motivational', storytelling: 'Storytelling' },
  ru: { title: 'Script Studio', topic: 'Тема Видео', topicPlaceholder: 'напр: 5 Советов...', duration: 'Длительность', platform: 'Платформа', style: 'Стиль', generate: 'Создать Скрипт', generating: 'Создаём...', copy: 'Копировать', copied: '✓', download: 'Скачать', emptyTitle: 'Видео Скрипт', emptyDesc: 'Введите тему', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', hook: 'Хук', intro: 'Вступление', mainPoints: 'Основные Пункты', climax: 'Кульминация', cta: 'CTA', outro: 'Завершение', fullScript: 'Полный Скрипт', tips: 'Советы', educational: 'Обучающий', entertaining: 'Развлекательный', motivational: 'Мотивационный', storytelling: 'История' },
  de: { title: 'Script Studio', topic: 'Video-Thema', topicPlaceholder: 'z.B: 5 Produktivitätstipps...', duration: 'Dauer', platform: 'Plattform', style: 'Stil', generate: 'Script Erstellen', generating: 'Erstellen...', copy: 'Kopieren', copied: '✓', download: 'Herunterladen', emptyTitle: 'Video Script', emptyDesc: 'Thema eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', hook: 'Hook', intro: 'Intro', mainPoints: 'Hauptpunkte', climax: 'Höhepunkt', cta: 'CTA', outro: 'Outro', fullScript: 'Vollständiges Script', tips: 'Tipps', educational: 'Lehrreich', entertaining: 'Unterhaltsam', motivational: 'Motivierend', storytelling: 'Geschichte' },
  fr: { title: 'Script Studio', topic: 'Sujet Vidéo', topicPlaceholder: 'ex: 5 Conseils...', duration: 'Durée', platform: 'Plateforme', style: 'Style', generate: 'Générer Script', generating: 'Génération...', copy: 'Copier', copied: '✓', download: 'Télécharger', emptyTitle: 'Script Vidéo', emptyDesc: 'Entrez votre sujet', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', hook: 'Accroche', intro: 'Intro', mainPoints: 'Points Principaux', climax: 'Climax', cta: 'CTA', outro: 'Conclusion', fullScript: 'Script Complet', tips: 'Conseils', educational: 'Éducatif', entertaining: 'Divertissant', motivational: 'Motivant', storytelling: 'Narration' }
}

const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function ScriptStudioPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('60')
  const [platform, setPlatform] = useState('tiktok')
  const [style, setStyle] = useState('educational')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
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
      const res = await fetch('/api/script-studio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, duration, platform, style, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const copyScript = () => { if (!result?.full_script) return; navigator.clipboard.writeText(result.full_script); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const platforms = [{ value: 'tiktok', label: 'TikTok', icon: '🎵' }, { value: 'youtube', label: 'YouTube', icon: '🎬' }, { value: 'instagram', label: 'Reels', icon: '📸' }]
  const durations = [{ value: '15', label: '15s' }, { value: '30', label: '30s' }, { value: '60', label: '60s' }, { value: '180', label: '3m' }]
  const styles = [{ value: 'educational', label: t.educational }, { value: 'entertaining', label: t.entertaining }, { value: 'motivational', label: t.motivational }, { value: 'storytelling', label: t.storytelling }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link>
            <div className="flex items-center gap-2"><span className="text-2xl">🎬</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div>
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
              <div><label className="block text-sm text-gray-400 mb-2">{t.duration}</label><div className="flex gap-2">{durations.map(d => (<button key={d.value} onClick={() => setDuration(d.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${duration === d.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>{d.label}</button>))}</div></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="flex gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>{p.icon} {p.label}</button>))}</div></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.style}</label><div className="flex flex-wrap gap-2">{styles.map(s => (<button key={s.value} onClick={() => setStyle(s.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${style === s.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>{s.label}</button>))}</div></div>
              <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>🎬 {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🎬</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              <div className="flex gap-2 justify-end"><button onClick={copyScript} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white transition">{copied ? '✓' : '📋'} {t.copy}</button></div>
              {result.script && (<div className="space-y-3">
                {result.script.hook && (<div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"><div className="text-sm text-yellow-400 mb-1">🎣 {t.hook}</div><p className="font-medium">{result.script.hook}</p></div>)}
                {result.script.intro && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-1">📍 {t.intro}</div><p>{result.script.intro}</p></div>)}
                {result.script.main_points?.map((point: any, i: number) => (<div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-purple-400 mb-1">📌 {point.point}</div><p>{point.script}</p>{point.visual_cue && <p className="text-xs text-gray-500 mt-2">🎥 {point.visual_cue}</p>}</div>))}
                {result.script.cta && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-1">🎯 {t.cta}</div><p className="font-medium">{result.script.cta}</p></div>)}
              </div>)}
              {result.full_script && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-2">📝 {t.fullScript}</div><p className="text-sm whitespace-pre-wrap">{result.full_script}</p></div>)}
              {result.tips && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-2">💡 {t.tips}</div><ul className="text-sm space-y-1">{result.tips.map((tip: string, i: number) => (<li key={i}>• {tip}</li>))}</ul></div>)}
              {result.raw && !result.script && (<div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl"><pre className="whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre></div>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
