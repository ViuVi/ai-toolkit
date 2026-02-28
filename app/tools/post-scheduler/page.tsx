'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back', title: 'Post Scheduler', subtitle: 'Find the best times to post on social media', credits: 'FREE',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', youtube: 'YouTube', facebook: 'Facebook' },
    timezoneLabel: 'Timezone', contentTypeLabel: 'Content Type',
    contentTypes: { post: 'Regular Post', story: 'Story', reel: 'Reel/Short', live: 'Live Stream' },
    getSchedule: 'Get Best Times', getting: 'Analyzing...',
    results: 'Recommended Schedule', bestTimes: 'Best Posting Times', bestDays: 'Best Days',
    weeklyPlan: 'Weekly Plan', day: 'Day', time: 'Time', priority: 'Priority',
    recommendations: 'Tips',
    success: 'Schedule ready!', error: 'Error occurred'
  },
  tr: {
    back: '← Geri', title: 'Paylaşım Zamanlayıcı', subtitle: 'Sosyal medyada paylaşım için en iyi saatleri bulun', credits: 'ÜCRETSİZ',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', youtube: 'YouTube', facebook: 'Facebook' },
    timezoneLabel: 'Saat Dilimi', contentTypeLabel: 'İçerik Türü',
    contentTypes: { post: 'Normal Gönderi', story: 'Hikaye', reel: 'Reels/Short', live: 'Canlı Yayın' },
    getSchedule: 'En İyi Saatleri Bul', getting: 'Analiz ediliyor...',
    results: 'Önerilen Program', bestTimes: 'En İyi Paylaşım Saatleri', bestDays: 'En İyi Günler',
    weeklyPlan: 'Haftalık Plan', day: 'Gün', time: 'Saat', priority: 'Öncelik',
    recommendations: 'İpuçları',
    success: 'Program hazır!', error: 'Hata oluştu'
  },
  ru: { back: '← Назад', title: 'Планировщик постов', subtitle: 'Найдите лучшее время для публикации', credits: 'БЕСПЛАТНО', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', youtube: 'YouTube', facebook: 'Facebook' }, timezoneLabel: 'Часовой пояс', contentTypeLabel: 'Тип контента', contentTypes: { post: 'Пост', story: 'История', reel: 'Reels', live: 'Прямой эфир' }, getSchedule: 'Найти время', getting: 'Анализ...', results: 'Расписание', bestTimes: 'Лучшее время', bestDays: 'Лучшие дни', weeklyPlan: 'Недельный план', day: 'День', time: 'Время', priority: 'Приоритет', recommendations: 'Советы', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Post-Planer', subtitle: 'Finden Sie die besten Posting-Zeiten', credits: 'KOSTENLOS', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', youtube: 'YouTube', facebook: 'Facebook' }, timezoneLabel: 'Zeitzone', contentTypeLabel: 'Inhaltstyp', contentTypes: { post: 'Beitrag', story: 'Story', reel: 'Reel', live: 'Live' }, getSchedule: 'Zeiten finden', getting: 'Analyse...', results: 'Zeitplan', bestTimes: 'Beste Zeiten', bestDays: 'Beste Tage', weeklyPlan: 'Wochenplan', day: 'Tag', time: 'Zeit', priority: 'Priorität', recommendations: 'Tipps', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Planificateur de posts', subtitle: 'Trouvez les meilleurs moments pour publier', credits: 'GRATUIT', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', youtube: 'YouTube', facebook: 'Facebook' }, timezoneLabel: 'Fuseau horaire', contentTypeLabel: 'Type de contenu', contentTypes: { post: 'Publication', story: 'Story', reel: 'Reel', live: 'Live' }, getSchedule: 'Trouver les horaires', getting: 'Analyse...', results: 'Calendrier', bestTimes: 'Meilleurs horaires', bestDays: 'Meilleurs jours', weeklyPlan: 'Plan hebdo', day: 'Jour', time: 'Heure', priority: 'Priorité', recommendations: 'Conseils', success: 'Terminé!', error: 'Erreur' }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' }, { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' }, { code: 'de', flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

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

  const handleGetSchedule = async () => {
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
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}
              </div>
            </div>
            <span className="text-3xl">📅</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.contentTypeLabel}</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {Object.entries(t.contentTypes).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.timezoneLabel}</label>
              <input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white" />
            </div>
          </div>
        </div>

        <button onClick={handleGetSchedule} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.getting}</>) : (<><span>📅</span>{t.getSchedule}</>)}
        </button>

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><span>⏰</span>{t.bestTimes}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.bestTimes?.map((time: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full font-bold">{time}</span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><span>📆</span>{t.bestDays}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.bestDays?.map((day: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full font-medium">{day}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>📋</span>{t.weeklyPlan}</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-3">{t.day}</th>
                      <th className="pb-3">{t.time}</th>
                      <th className="pb-3">{t.priority}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {result.weeklyPlan?.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="py-3 font-medium">{item.day}</td>
                        <td className="py-3 text-green-400">{item.suggestedTime}</td>
                        <td className="py-3"><span className={`px-2 py-1 rounded text-xs ${item.priority === 'High' || item.priority === 'Yüksek' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.priority}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>💡</span>{t.recommendations}</h3>
              <ul className="space-y-2">
                {result.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300"><span className="text-green-400">•</span>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
