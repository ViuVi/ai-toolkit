'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Content Calendar', subtitle: 'Plan your monthly content', credits: 'FREE', nicheLabel: 'Niche', nichePlaceholder: 'e.g. fitness, tech...', platformsLabel: 'Platforms', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter' }, postsLabel: 'Posts/Week', generate: 'Generate', generating: 'Planning...', week: 'Week', tips: 'Tips', emptyInput: 'Enter niche', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'İçerik Takvimi', subtitle: 'Aylık içeriklerinizi planlayın', credits: 'ÜCRETSİZ', nicheLabel: 'Niş', nichePlaceholder: 'örn: fitness, teknoloji...', platformsLabel: 'Platformlar', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter' }, postsLabel: 'Haftalık Gönderi', generate: 'Oluştur', generating: 'Planlanıyor...', week: 'Hafta', tips: 'İpuçları', emptyInput: 'Niş girin', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Контент-календарь', subtitle: 'Планируйте контент на месяц', credits: 'БЕСПЛАТНО', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', platformsLabel: 'Платформы', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter' }, postsLabel: 'Постов/неделю', generate: 'Создать', generating: 'Планирование...', week: 'Неделя', tips: 'Советы', emptyInput: 'Введите нишу', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Content-Kalender', subtitle: 'Monatsinhalt planen', credits: 'KOSTENLOS', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', platformsLabel: 'Plattformen', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter' }, postsLabel: 'Posts/Woche', generate: 'Erstellen', generating: 'Planung...', week: 'Woche', tips: 'Tipps', emptyInput: 'Nische eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Calendrier de contenu', subtitle: 'Planifiez votre contenu mensuel', credits: 'GRATUIT', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', platformsLabel: 'Plateformes', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter' }, postsLabel: 'Posts/semaine', generate: 'Créer', generating: 'Planification...', week: 'Semaine', tips: 'Conseils', emptyInput: 'Entrez niche', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]
const platformIcons: Record<string, string> = { instagram: '📸', tiktok: '🎵', youtube: '▶️', twitter: '🐦' }

export default function ContentCalendarPage() {
  const [niche, setNiche] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram'])
  const [postsPerWeek, setPostsPerWeek] = useState(5)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  const togglePlatform = (p: string) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const handleGenerate = async () => {
    if (!niche.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/content-calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platforms: selectedPlatforms, postsPerWeek, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.calendar); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">🗓️</span></div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.nicheLabel}</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-3">{t.platformsLabel}</label><div className="flex flex-wrap gap-2">{Object.entries(t.platforms).map(([k, v]) => (<button key={k} onClick={() => togglePlatform(k)} className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${selectedPlatforms.includes(k) ? 'bg-purple-600' : 'bg-gray-700'}`}><span>{platformIcons[k]}</span>{v as string}</button>))}</div></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.postsLabel}</label><select value={postsPerWeek} onChange={(e) => setPostsPerWeek(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{[3,5,7,10,14].map(n => (<option key={n} value={n}>{n}</option>))}</select></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>🗓️</span>{t.generate}</>)}</button>
        {result && (
          <div className="space-y-6">
            {result.weeks?.map((week: any) => (
              <div key={week.week} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="font-semibold mb-4 text-lg">{t.week} {week.week}</h3>
                <div className="grid gap-3">{week.posts?.map((post: any, i: number) => (
                  <div key={i} className="bg-gray-900/50 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-xl">{platformIcons[post.platform] || '📝'}</div>
                    <div className="flex-1"><p className="font-medium">{post.topic}</p><p className="text-sm text-gray-400">{post.contentType}</p></div>
                    <div className="text-right"><p className="text-green-400 font-medium">{post.suggestedTime}</p></div>
                  </div>
                ))}</div>
              </div>
            ))}
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="font-semibold mb-4 flex items-center gap-2"><span>💡</span>{t.tips}</h3><ul className="space-y-2">{result.tips?.map((tip: string, i: number) => (<li key={i} className="flex items-start gap-2 text-gray-300"><span className="text-green-400">•</span>{tip}</li>))}</ul></div>
          </div>
        )}
      </main>
    </div>
  )
}
