'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 8
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'İçerik Analizi', video: 'Video Açıklaması', videoPlaceholder: 'Viral videonun ne hakkında olduğunu açıklayın...', platform: 'Platform', goal: 'Hedef', generate: 'Analiz Et & Versiyon Oluştur', generating: 'Oluşturuluyor...', copy: 'Kopyala', emptyTitle: 'Viral Reverse Engineering', emptyDesc: 'Viral videoyu açıklayın', insufficientCredits: 'Yetersiz kredi', error: 'Hata', recreate: 'Yeniden Yarat', improve: 'Geliştir', adapt: 'Uyarla', analysis: 'Analiz', yourVersions: 'Sizin Versiyonlarınız', scriptTemplate: 'Script Şablonu', tips: 'İpuçları' },
  en: { title: 'Content Analysis', video: 'Video Description', videoPlaceholder: 'Describe what the viral video is about...', platform: 'Platform', goal: 'Goal', generate: 'Analyze & Create Versions', generating: 'Creating...', copy: 'Copy', emptyTitle: 'Viral Reverse Engineering', emptyDesc: 'Describe the viral video', insufficientCredits: 'Insufficient credits', error: 'Error', recreate: 'Recreate', improve: 'Improve', adapt: 'Adapt', analysis: 'Analysis', yourVersions: 'Your Versions', scriptTemplate: 'Script Template', tips: 'Tips' },
  ru: { title: 'Анализ Контента', video: 'Описание Видео', videoPlaceholder: 'Опишите вирусное видео...', platform: 'Платформа', goal: 'Цель', generate: 'Анализ и Версии', generating: 'Создаём...', copy: 'Копировать', emptyTitle: 'Reverse Engineering', emptyDesc: 'Опишите видео', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', recreate: 'Воссоздать', improve: 'Улучшить', adapt: 'Адаптировать', analysis: 'Анализ', yourVersions: 'Ваши Версии', scriptTemplate: 'Шаблон Скрипта', tips: 'Советы' },
  de: { title: 'Content-Analyse', video: 'Video-Beschreibung', videoPlaceholder: 'Beschreiben Sie das virale Video...', platform: 'Plattform', goal: 'Ziel', generate: 'Analysieren & Erstellen', generating: 'Erstellen...', copy: 'Kopieren', emptyTitle: 'Viral Reverse Engineering', emptyDesc: 'Video beschreiben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', recreate: 'Neu erstellen', improve: 'Verbessern', adapt: 'Anpassen', analysis: 'Analyse', yourVersions: 'Ihre Versionen', scriptTemplate: 'Script-Vorlage', tips: 'Tipps' },
  fr: { title: 'Analyse de Contenu', video: 'Description Vidéo', videoPlaceholder: 'Décrivez la vidéo virale...', platform: 'Plateforme', goal: 'Objectif', generate: 'Analyser & Créer', generating: 'Création...', copy: 'Copier', emptyTitle: 'Reverse Engineering', emptyDesc: 'Décrivez la vidéo', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', recreate: 'Recréer', improve: 'Améliorer', adapt: 'Adapter', analysis: 'Analyse', yourVersions: 'Vos Versions', scriptTemplate: 'Modèle de Script', tips: 'Conseils' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function StealVideoPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [videoDescription, setVideoDescription] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [goal, setGoal] = useState('recreate')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!videoDescription.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/steal-video', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoDescription, platform, goal, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const copyText = (text: string, index: number) => { navigator.clipboard.writeText(text); setCopied(index); setTimeout(() => setCopied(null), 2000) }

  const platforms = [{ value: 'tiktok', label: 'TikTok' }, { value: 'instagram', label: 'Instagram' }, { value: 'youtube', label: 'YouTube' }]
  const goals = [{ value: 'recreate', label: t.recreate }, { value: 'improve', label: t.improve }, { value: 'adapt', label: t.adapt }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">🎯</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.video}</label><textarea value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} placeholder={t.videoPlaceholder} rows={5} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none resize-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="flex gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.goal}</label><div className="flex gap-2">{goals.map(g => (<button key={g.value} onClick={() => setGoal(g.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${goal === g.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{g.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !videoDescription.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>🎯 {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🎯</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              {result.analysis && (<div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"><div className="text-sm text-blue-400 mb-2">🔍 {t.analysis}</div><p className="text-sm mb-2">{result.analysis.hook_breakdown}</p>{result.analysis.viral_elements && <div className="flex flex-wrap gap-2">{result.analysis.viral_elements.map((el: string, i: number) => (<span key={i} className="px-2 py-1 bg-white/5 rounded text-xs">{el}</span>))}</div>}</div>)}
              {result.your_versions && (<div className="space-y-3"><div className="text-sm text-purple-400 mb-2">✨ {t.yourVersions}</div>{result.your_versions.map((version: any, i: number) => (<div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl group"><div className="flex justify-between items-start mb-2"><h3 className="font-medium text-purple-400">{version.angle}</h3><button onClick={() => copyText(version.hook + '\n\n' + version.outline, i)} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">{copied === i ? '✓' : t.copy}</button></div><p className="text-sm mb-2">🎣 {version.hook}</p><p className="text-xs text-gray-400">{version.outline}</p></div>))}</div>)}
              {result.script_template && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-2">📝 {t.scriptTemplate}</div><p className="text-sm whitespace-pre-wrap">{result.script_template}</p></div>)}
              {result.production_tips && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-2">💡 {t.tips}</div><ul className="text-sm space-y-1">{result.production_tips.map((tip: string, i: number) => (<li key={i}>• {tip}</li>))}</ul></div>)}
              {result.raw && !result.your_versions && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
