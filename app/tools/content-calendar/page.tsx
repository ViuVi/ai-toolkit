'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back', title: 'Content Calendar', subtitle: 'Plan your content for the entire month', credits: 'FREE',
    nicheLabel: 'Your Niche/Topic', nichePlaceholder: 'e.g., fitness, cooking, tech...',
    platformsLabel: 'Platforms', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' },
    postsLabel: 'Posts per Week', monthLabel: 'Month',
    generate: 'Generate Calendar', generating: 'Planning...',
    results: 'Your Content Calendar', week: 'Week', contentType: 'Content Type',
    platform: 'Platform', topic: 'Topic', time: 'Time', tips: 'Planning Tips',
    emptyInput: 'Please enter your niche', selectPlatform: 'Select at least one platform',
    success: 'Calendar ready!', error: 'Error occurred'
  },
  tr: {
    back: '← Geri', title: 'İçerik Takvimi', subtitle: 'Tüm ay için içeriklerinizi planlayın', credits: 'ÜCRETSİZ',
    nicheLabel: 'Niş/Konunuz', nichePlaceholder: 'örn: fitness, yemek, teknoloji...',
    platformsLabel: 'Platformlar', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' },
    postsLabel: 'Haftalık Paylaşım', monthLabel: 'Ay',
    generate: 'Takvim Oluştur', generating: 'Planlanıyor...',
    results: 'İçerik Takviminiz', week: 'Hafta', contentType: 'İçerik Türü',
    platform: 'Platform', topic: 'Konu', time: 'Saat', tips: 'Planlama İpuçları',
    emptyInput: 'Lütfen niş girin', selectPlatform: 'En az bir platform seçin',
    success: 'Takvim hazır!', error: 'Hata oluştu'
  },
  ru: { back: '← Назад', title: 'Контент-календарь', subtitle: 'Планируйте контент на месяц', credits: 'БЕСПЛАТНО', nicheLabel: 'Ваша ниша', nichePlaceholder: 'напр: фитнес, еда...', platformsLabel: 'Платформы', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, postsLabel: 'Постов в неделю', monthLabel: 'Месяц', generate: 'Создать', generating: 'Планирование...', results: 'Ваш календарь', week: 'Неделя', contentType: 'Тип', platform: 'Платформа', topic: 'Тема', time: 'Время', tips: 'Советы', emptyInput: 'Введите нишу', selectPlatform: 'Выберите платформу', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Content-Kalender', subtitle: 'Planen Sie Ihren Monatsinhalt', credits: 'KOSTENLOS', nicheLabel: 'Ihre Nische', nichePlaceholder: 'z.B: Fitness, Kochen...', platformsLabel: 'Plattformen', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, postsLabel: 'Posts pro Woche', monthLabel: 'Monat', generate: 'Erstellen', generating: 'Planung...', results: 'Ihr Kalender', week: 'Woche', contentType: 'Typ', platform: 'Plattform', topic: 'Thema', time: 'Zeit', tips: 'Tipps', emptyInput: 'Nische eingeben', selectPlatform: 'Plattform wählen', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Calendrier de contenu', subtitle: 'Planifiez votre contenu mensuel', credits: 'GRATUIT', nicheLabel: 'Votre niche', nichePlaceholder: 'ex: fitness, cuisine...', platformsLabel: 'Plateformes', platforms: { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter/X' }, postsLabel: 'Posts par semaine', monthLabel: 'Mois', generate: 'Créer', generating: 'Planification...', results: 'Votre calendrier', week: 'Semaine', contentType: 'Type', platform: 'Plateforme', topic: 'Sujet', time: 'Heure', tips: 'Conseils', emptyInput: 'Entrez votre niche', selectPlatform: 'Choisir une plateforme', success: 'Terminé!', error: 'Erreur' }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' }, { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' }, { code: 'de', flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

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

  const currentMonth = new Date().toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' })

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const handleGenerate = async () => {
    if (!niche.trim()) { showToast(t.emptyInput, 'warning'); return }
    if (selectedPlatforms.length === 0) { showToast(t.selectPlatform, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/content-calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platforms: selectedPlatforms, postsPerWeek, month: currentMonth, language }) })
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
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}
              </div>
            </div>
            <span className="text-3xl">🗓️</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.nicheLabel}</label>
            <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{t.platformsLabel}</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(t.platforms).map(([k, v]) => (
                <button key={k} onClick={() => togglePlatform(k)} className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${selectedPlatforms.includes(k) ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  <span>{platformIcons[k]}</span><span>{v as string}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.postsLabel}</label>
              <select value={postsPerWeek} onChange={(e) => setPostsPerWeek(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {[3, 5, 7, 10, 14].map(n => (<option key={n} value={n}>{n}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.monthLabel}</label>
              <input type="text" value={currentMonth} disabled className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-400" />
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>🗓️</span>{t.generate}</>)}
        </button>

        {result && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6 text-center">
              <h2 className="text-2xl font-bold">{result.month}</h2>
              <p className="text-gray-400">{result.niche} • {result.postsPerWeek} {t.postsLabel.toLowerCase()}</p>
            </div>

            {result.weeks?.map((week: any) => (
              <div key={week.week} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
                <h3 className="font-semibold mb-4 text-lg">{t.week} {week.week}</h3>
                <div className="grid gap-3">
                  {week.posts?.map((post: any, i: number) => (
                    <div key={i} className="bg-gray-900/50 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-xl">
                        {platformIcons[post.platform] || '📝'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{post.topic}</p>
                        <p className="text-sm text-gray-400">{post.contentType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-medium">{post.suggestedTime}</p>
                        <p className="text-xs text-gray-500">{t.platform}: {post.platform}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><span>💡</span>{t.tips}</h3>
              <ul className="space-y-2">
                {result.tips?.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300"><span className="text-green-400">•</span>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
