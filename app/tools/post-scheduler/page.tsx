'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Post Scheduler', subtitle: 'Find the best times to post', credits: 'FREE', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, timezoneLabel: 'Timezone', contentLabel: 'Content', contents: { post: 'Post', story: 'Story', reel: 'Reel' }, generate: 'Get Times', generating: 'Analyzing...', bestTimes: 'Best Times', bestDays: 'Best Days', tips: 'Tips', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Paylaşım Zamanlayıcı', subtitle: 'En iyi paylaşım saatlerini bulun', credits: 'ÜCRETSİZ', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, timezoneLabel: 'Saat Dilimi', contentLabel: 'İçerik', contents: { post: 'Gönderi', story: 'Hikaye', reel: 'Reels' }, generate: 'Saatleri Bul', generating: 'Analiz...', bestTimes: 'En İyi Saatler', bestDays: 'En İyi Günler', tips: 'İpuçları', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Планировщик', subtitle: 'Лучшее время для постов', credits: 'БЕСПЛАТНО', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, timezoneLabel: 'Часовой пояс', contentLabel: 'Контент', contents: { post: 'Пост', story: 'История', reel: 'Reels' }, generate: 'Найти', generating: 'Анализ...', bestTimes: 'Лучшее время', bestDays: 'Лучшие дни', tips: 'Советы', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Post-Planer', subtitle: 'Beste Posting-Zeiten', credits: 'KOSTENLOS', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, timezoneLabel: 'Zeitzone', contentLabel: 'Inhalt', contents: { post: 'Beitrag', story: 'Story', reel: 'Reel' }, generate: 'Finden', generating: 'Analyse...', bestTimes: 'Beste Zeiten', bestDays: 'Beste Tage', tips: 'Tipps', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Planificateur', subtitle: 'Meilleurs moments pour poster', credits: 'GRATUIT', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn' }, timezoneLabel: 'Fuseau', contentLabel: 'Contenu', contents: { post: 'Post', story: 'Story', reel: 'Reel' }, generate: 'Trouver', generating: 'Analyse...', bestTimes: 'Meilleurs horaires', bestDays: 'Meilleurs jours', tips: 'Conseils', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function PostSchedulerPage() {
  const [platform, setPlatform] = useState('instagram')
  const [timezone, setTimezone] = useState('UTC')
  const [contentType, setContentType] = useState('post')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone) }, [])

  const handleGenerate = async () => {
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/post-scheduler', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform, timezone, contentType, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.schedule); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">📅</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.contentLabel}</label><select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.contents).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.timezoneLabel}</label><input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white" /></div>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>📅</span>{t.generate}</>)}</button>
        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="font-semibold mb-4 flex items-center gap-2"><span>⏰</span>{t.bestTimes}</h3><div className="flex flex-wrap gap-2">{result.bestTimes?.map((time: string, i: number) => (<span key={i} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full font-bold">{time}</span>))}</div></div>
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="font-semibold mb-4 flex items-center gap-2"><span>📆</span>{t.bestDays}</h3><div className="flex flex-wrap gap-2">{result.bestDays?.map((day: string, i: number) => (<span key={i} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full font-medium">{day}</span>))}</div></div>
            </div>
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h3 className="font-semibold mb-4 flex items-center gap-2"><span>💡</span>{t.tips}</h3><ul className="space-y-2">{result.recommendations?.map((tip: string, i: number) => (<li key={i} className="flex items-start gap-2 text-gray-300"><span className="text-green-400">•</span>{tip}</li>))}</ul></div>
          </div>
        )}
      </main>
    </div>
  )
}
