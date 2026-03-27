'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 5
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'A/B Test', contentA: 'Versiyon A', contentB: 'Versiyon B', placeholder: 'İçeriği buraya yapıştırın...', platform: 'Platform', generate: 'Karşılaştır', generating: 'Analiz ediliyor...', emptyTitle: 'A/B Karşılaştırma', emptyDesc: 'İki versiyonu girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', winner: 'Kazanan', confidence: 'Güven', comparison: 'Karşılaştırma', recommendation: 'Öneri', improved: 'Geliştirilmiş Versiyon' },
  en: { title: 'A/B Tester', contentA: 'Version A', contentB: 'Version B', placeholder: 'Paste content here...', platform: 'Platform', generate: 'Compare', generating: 'Analyzing...', emptyTitle: 'A/B Comparison', emptyDesc: 'Enter both versions', insufficientCredits: 'Insufficient credits', error: 'Error', winner: 'Winner', confidence: 'Confidence', comparison: 'Comparison', recommendation: 'Recommendation', improved: 'Improved Version' },
  ru: { title: 'A/B Тест', contentA: 'Версия A', contentB: 'Версия B', placeholder: 'Вставьте контент...', platform: 'Платформа', generate: 'Сравнить', generating: 'Анализируем...', emptyTitle: 'A/B Сравнение', emptyDesc: 'Введите обе версии', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', winner: 'Победитель', confidence: 'Уверенность', comparison: 'Сравнение', recommendation: 'Рекомендация', improved: 'Улучшенная Версия' },
  de: { title: 'A/B Test', contentA: 'Version A', contentB: 'Version B', placeholder: 'Inhalt einfügen...', platform: 'Plattform', generate: 'Vergleichen', generating: 'Analysieren...', emptyTitle: 'A/B Vergleich', emptyDesc: 'Beide Versionen eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', winner: 'Gewinner', confidence: 'Konfidenz', comparison: 'Vergleich', recommendation: 'Empfehlung', improved: 'Verbesserte Version' },
  fr: { title: 'Test A/B', contentA: 'Version A', contentB: 'Version B', placeholder: 'Collez le contenu...', platform: 'Plateforme', generate: 'Comparer', generating: 'Analyse...', emptyTitle: 'Comparaison A/B', emptyDesc: 'Entrez les deux versions', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', winner: 'Gagnant', confidence: 'Confiance', comparison: 'Comparaison', recommendation: 'Recommandation', improved: 'Version Améliorée' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function ABTesterPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [contentA, setContentA] = useState('')
  const [contentB, setContentB] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!contentA.trim() || !contentB.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/ab-tester', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contentA, contentB, platform, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const platforms = [{ value: 'tiktok', label: 'TikTok' }, { value: 'instagram', label: 'Instagram' }, { value: 'youtube', label: 'YouTube' }]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">⚔️</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl"><label className="block text-sm text-purple-400 mb-2">{t.contentA}</label><textarea value={contentA} onChange={(e) => setContentA(e.target.value)} placeholder={t.placeholder} rows={6} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none resize-none" /></div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl"><label className="block text-sm text-pink-400 mb-2">{t.contentB}</label><textarea value={contentB} onChange={(e) => setContentB(e.target.value)} placeholder={t.placeholder} rows={6} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-pink-500/50 focus:outline-none resize-none" /></div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div>
          <button onClick={handleGenerate} disabled={loading || !contentA.trim() || !contentB.trim()} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>⚔️ {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
        </div>
        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6">{error}</div>}
        {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">⚔️</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
        {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
        {result && (<div className="space-y-4">
          <div className={`p-6 rounded-2xl text-center ${result.winner === 'A' ? 'bg-gradient-to-r from-purple-500/20 to-purple-500/10 border border-purple-500/30' : 'bg-gradient-to-r from-pink-500/20 to-pink-500/10 border border-pink-500/30'}`}><div className="text-sm text-gray-400 mb-2">{t.winner}</div><div className="text-4xl font-bold mb-2">{result.winner === 'A' ? '🅰️' : '🅱️'} Version {result.winner}</div>{result.confidence && <div className="text-sm text-gray-400">{t.confidence}: {result.confidence}%</div>}</div>
          {result.comparison && (<div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Object.entries(result.comparison).map(([key, val]: [string, any]) => (<div key={key} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center"><div className="text-xs text-gray-500 mb-1">{key.replace(/_/g, ' ')}</div><div className="flex justify-center gap-2"><span className="text-purple-400">{val.a}</span><span className="text-gray-600">vs</span><span className="text-pink-400">{val.b}</span></div></div>))}</div>)}
          {result.recommendation && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-1">💡 {t.recommendation}</div><p className="text-sm">{result.recommendation}</p></div>)}
          {result.improved_version && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-1">✨ {t.improved}</div><p className="text-sm">{result.improved_version}</p></div>)}
          {result.raw && !result.winner && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
        </div>)}
      </main>
    </div>
  )
}
