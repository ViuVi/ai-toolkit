'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 5
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Viral Analiz', content: 'İçerik', contentPlaceholder: 'Analiz edilecek içeriği yapıştırın...', platform: 'Platform', contentType: 'Tür', generate: 'Analiz Et', generating: 'Analiz ediliyor...', emptyTitle: 'Viral Skor', emptyDesc: 'İçeriğinizi girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', video: 'Video', post: 'Post', reel: 'Reel', strengths: 'Güçlü Yanlar', weaknesses: 'Zayıf Yanlar', improvements: 'İyileştirmeler', prediction: 'Tahmin', score: 'Viral Skor' },
  en: { title: 'Viral Analyzer', content: 'Content', contentPlaceholder: 'Paste your content to analyze...', platform: 'Platform', contentType: 'Type', generate: 'Analyze', generating: 'Analyzing...', emptyTitle: 'Viral Score', emptyDesc: 'Enter your content', insufficientCredits: 'Insufficient credits', error: 'Error', video: 'Video', post: 'Post', reel: 'Reel', strengths: 'Strengths', weaknesses: 'Weaknesses', improvements: 'Improvements', prediction: 'Prediction', score: 'Viral Score' },
  ru: { title: 'Вирусный Анализ', content: 'Контент', contentPlaceholder: 'Вставьте контент...', platform: 'Платформа', contentType: 'Тип', generate: 'Анализировать', generating: 'Анализируем...', emptyTitle: 'Вирусный Балл', emptyDesc: 'Введите контент', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', video: 'Видео', post: 'Пост', reel: 'Рилс', strengths: 'Сильные стороны', weaknesses: 'Слабые стороны', improvements: 'Улучшения', prediction: 'Прогноз', score: 'Вирусный Балл' },
  de: { title: 'Viral Analyzer', content: 'Inhalt', contentPlaceholder: 'Inhalt einfügen...', platform: 'Plattform', contentType: 'Typ', generate: 'Analysieren', generating: 'Analysieren...', emptyTitle: 'Viral Score', emptyDesc: 'Inhalt eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', video: 'Video', post: 'Post', reel: 'Reel', strengths: 'Stärken', weaknesses: 'Schwächen', improvements: 'Verbesserungen', prediction: 'Vorhersage', score: 'Viral Score' },
  fr: { title: 'Analyseur Viral', content: 'Contenu', contentPlaceholder: 'Collez votre contenu...', platform: 'Plateforme', contentType: 'Type', generate: 'Analyser', generating: 'Analyse...', emptyTitle: 'Score Viral', emptyDesc: 'Entrez votre contenu', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', video: 'Vidéo', post: 'Post', reel: 'Reel', strengths: 'Forces', weaknesses: 'Faiblesses', improvements: 'Améliorations', prediction: 'Prédiction', score: 'Score Viral' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function ViralAnalyzerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [contentType, setContentType] = useState('video')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!content.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/viral-analyzer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platform, contentType, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const platforms = [{ value: 'tiktok', label: 'TikTok' }, { value: 'instagram', label: 'Instagram' }, { value: 'youtube', label: 'YouTube' }]
  const types = [{ value: 'video', label: t.video }, { value: 'post', label: t.post }, { value: 'reel', label: t.reel }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">📊</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.content}</label><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPlaceholder} rows={5} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none resize-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="flex gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.contentType}</label><div className="flex gap-2">{types.map(ty => (<button key={ty.value} onClick={() => setContentType(ty.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${contentType === ty.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{ty.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !content.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>📊 {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">📊</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              {result.viral_score && (<div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl text-center"><div className="text-sm text-purple-400 mb-2">{t.score}</div><div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{result.viral_score}/10</div></div>)}
              {result.breakdown && (<div className="grid grid-cols-2 gap-3">{Object.entries(result.breakdown).map(([key, value]: [string, any]) => (<div key={key} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-xs text-gray-500 mb-1">{key.replace(/_/g, ' ')}</div><div className="text-lg font-semibold text-purple-400">{value}/10</div></div>))}</div>)}
              {result.strengths && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-2">💪 {t.strengths}</div><ul className="text-sm space-y-1">{result.strengths.map((s: string, i: number) => (<li key={i}>• {s}</li>))}</ul></div>)}
              {result.weaknesses && (<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"><div className="text-sm text-red-400 mb-2">⚠️ {t.weaknesses}</div><ul className="text-sm space-y-1">{result.weaknesses.map((w: string, i: number) => (<li key={i}>• {w}</li>))}</ul></div>)}
              {result.improvements && (<div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"><div className="text-sm text-blue-400 mb-2">🎯 {t.improvements}</div><div className="space-y-2">{result.improvements.map((imp: any, i: number) => (<div key={i} className="text-sm"><span className="font-medium">{imp.area}:</span> {imp.suggestion}</div>))}</div></div>)}
              {result.predicted_performance && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-1">📈 {t.prediction}</div><p className="text-sm">{result.predicted_performance}</p></div>)}
              {result.raw && !result.viral_score && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
