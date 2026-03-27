'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const TOOL_COST = 3
const texts: Record<string, Record<string, string>> = {
  tr: { title: 'Paylaşım Zamanı Optimizasyonu', niche: 'Niş', nichePlaceholder: 'örn: Fitness, Teknoloji...', platform: 'Platform', timezone: 'Saat Dilimi', audience: 'Hedef Kitle', generate: 'Zamanları Bul', generating: 'Analiz ediliyor...', emptyTitle: 'En İyi Zamanlar', emptyDesc: 'Nişinizi girin', insufficientCredits: 'Yetersiz kredi', error: 'Hata', general: 'Genel', students: 'Öğrenciler', professionals: 'Profesyoneller', parents: 'Ebeveynler', bestTimes: 'En İyi Saatler', peakHours: 'Zirve Saatler', avoidTimes: 'Kaçının', frequency: 'Paylaşım Sıklığı', calendarTip: 'Takvim İpucu' },
  en: { title: 'Posting Time Optimizer', niche: 'Niche', nichePlaceholder: 'e.g: Fitness, Tech...', platform: 'Platform', timezone: 'Timezone', audience: 'Target Audience', generate: 'Find Best Times', generating: 'Analyzing...', emptyTitle: 'Best Posting Times', emptyDesc: 'Enter your niche', insufficientCredits: 'Insufficient credits', error: 'Error', general: 'General', students: 'Students', professionals: 'Professionals', parents: 'Parents', bestTimes: 'Best Times', peakHours: 'Peak Hours', avoidTimes: 'Avoid', frequency: 'Posting Frequency', calendarTip: 'Calendar Tip' },
  ru: { title: 'Оптимизация Времени Публикации', niche: 'Ниша', nichePlaceholder: 'напр: Фитнес...', platform: 'Платформа', timezone: 'Часовой Пояс', audience: 'Аудитория', generate: 'Найти Время', generating: 'Анализируем...', emptyTitle: 'Лучшее Время', emptyDesc: 'Введите нишу', insufficientCredits: 'Недостаточно кредитов', error: 'Ошибка', general: 'Общая', students: 'Студенты', professionals: 'Профессионалы', parents: 'Родители', bestTimes: 'Лучшее Время', peakHours: 'Пиковые Часы', avoidTimes: 'Избегать', frequency: 'Частота', calendarTip: 'Совет' },
  de: { title: 'Posting-Zeit-Optimierer', niche: 'Nische', nichePlaceholder: 'z.B: Fitness...', platform: 'Plattform', timezone: 'Zeitzone', audience: 'Zielgruppe', generate: 'Zeiten Finden', generating: 'Analysieren...', emptyTitle: 'Beste Zeiten', emptyDesc: 'Nische eingeben', insufficientCredits: 'Nicht genügend Credits', error: 'Fehler', general: 'Allgemein', students: 'Studenten', professionals: 'Profis', parents: 'Eltern', bestTimes: 'Beste Zeiten', peakHours: 'Spitzenzeiten', avoidTimes: 'Vermeiden', frequency: 'Häufigkeit', calendarTip: 'Kalender-Tipp' },
  fr: { title: 'Optimiseur de Publication', niche: 'Niche', nichePlaceholder: 'ex: Fitness...', platform: 'Plateforme', timezone: 'Fuseau Horaire', audience: 'Audience Cible', generate: 'Trouver les Meilleurs Moments', generating: 'Analyse...', emptyTitle: 'Meilleurs Moments', emptyDesc: 'Entrez votre niche', insufficientCredits: 'Crédits insuffisants', error: 'Erreur', general: 'Général', students: 'Étudiants', professionals: 'Professionnels', parents: 'Parents', bestTimes: 'Meilleurs Moments', peakHours: 'Heures de Pointe', avoidTimes: 'Éviter', frequency: 'Fréquence', calendarTip: 'Conseil Calendrier' }
}
const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const langNames: Record<string, string> = { en: '🇺🇸 EN', tr: '🇹🇷 TR', ru: '🇷🇺 RU', de: '🇩🇪 DE', fr: '🇫🇷 FR' }

export default function PostingOptimizerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [timezone, setTimezone] = useState('UTC')
  const [audienceType, setAudienceType] = useState('general')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (!session) router.push('/login'); else { setUser(session.user); supabase.from('credits').select('balance').eq('user_id', session.user.id).single().then(({ data }) => setCredits(data?.balance || 0)) } }) }, [router])

  const handleGenerate = async () => {
    if (!niche.trim() || loading || !user) return; setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/posting-optimizer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, timezone, audienceType, language, userId: user.id }) })
      const data = await res.json()
      if (res.status === 402) setError(t.insufficientCredits)
      else if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || t.error)
    } catch { setError(t.error) }
    setLoading(false)
  }

  const platforms = [{ value: 'instagram', label: 'Instagram' }, { value: 'tiktok', label: 'TikTok' }, { value: 'twitter', label: 'Twitter' }, { value: 'youtube', label: 'YouTube' }]
  const audiences = [{ value: 'general', label: t.general }, { value: 'students', label: t.students }, { value: 'professionals', label: t.professionals }, { value: 'parents', label: t.parents }]
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayNames: Record<string, Record<string, string>> = {
    tr: { monday: 'Pazartesi', tuesday: 'Salı', wednesday: 'Çarşamba', thursday: 'Perşembe', friday: 'Cuma', saturday: 'Cumartesi', sunday: 'Pazar' },
    en: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' },
    ru: { monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда', thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье' },
    de: { monday: 'Montag', tuesday: 'Dienstag', wednesday: 'Mittwoch', thursday: 'Donnerstag', friday: 'Freitag', saturday: 'Samstag', sunday: 'Sonntag' },
    fr: { monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche' }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-400 hover:text-white transition">← Dashboard</Link><div className="flex items-center gap-2"><span className="text-2xl">⏰</span><h1 className="font-bold text-lg hidden sm:block">{t.title}</h1></div></div>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition text-sm">{langNames[language]}</button><div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">{languages.map(l => (<button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{langNames[l]}</button>))}</div></div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400">✦ {credits}</span></div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
            <div><label className="block text-sm text-gray-400 mb-2">{t.niche}</label><input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.platform}</label><div className="flex flex-wrap gap-2">{platforms.map(p => (<button key={p.value} onClick={() => setPlatform(p.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${platform === p.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{p.label}</button>))}</div></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.timezone}</label><select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:outline-none"><option value="UTC">UTC</option><option value="EST">EST (US)</option><option value="PST">PST (US)</option><option value="CET">CET (Europe)</option><option value="GMT+3">GMT+3 (Turkey)</option></select></div>
            <div><label className="block text-sm text-gray-400 mb-2">{t.audience}</label><div className="flex flex-wrap gap-2">{audiences.map(a => (<button key={a.value} onClick={() => setAudienceType(a.value)} className={`px-4 py-2 rounded-xl border text-sm transition ${audienceType === a.value ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{a.label}</button>))}</div></div>
            <button onClick={handleGenerate} disabled={loading || !niche.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</>) : (<>⏰ {t.generate} <span className="text-sm opacity-70">({TOOL_COST} ✦)</span></>)}</button>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          </div></div>
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">⏰</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>)}
            {loading && (<div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div><p className="text-gray-400">{t.generating}</p></div>)}
            {result && (<div className="space-y-4">
              {result.best_times && (<div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"><div className="text-sm text-purple-400 mb-3">📅 {t.bestTimes}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{days.map(day => result.best_times[day] && (<div key={day} className="flex justify-between items-center p-2 bg-white/5 rounded-lg"><span className="text-sm font-medium">{(dayNames[language] || dayNames.en)[day]}</span><div className="flex gap-2">{result.best_times[day].map((time: string, i: number) => (<span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{time}</span>))}</div></div>))}</div></div>)}
              {result.peak_hours && (<div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"><div className="text-sm text-green-400 mb-2">🔥 {t.peakHours}</div><div className="flex flex-wrap gap-2">{result.peak_hours.map((h: string, i: number) => (<span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm">{h}</span>))}</div></div>)}
              {result.avoid_times && (<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"><div className="text-sm text-red-400 mb-2">⚠️ {t.avoidTimes}</div><div className="flex flex-wrap gap-2">{result.avoid_times.map((h: string, i: number) => (<span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm line-through">{h}</span>))}</div></div>)}
              {result.frequency_recommendation && (<div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl"><div className="text-sm text-gray-400 mb-1">📊 {t.frequency}</div><p className="text-sm">{result.frequency_recommendation}</p></div>)}
              {result.content_calendar_tip && (<div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"><div className="text-sm text-blue-400 mb-1">💡 {t.calendarTip}</div><p className="text-sm">{result.content_calendar_tip}</p></div>)}
              {result.raw && !result.best_times && (<pre className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl whitespace-pre-wrap text-sm text-gray-300">{result.raw}</pre>)}
            </div>)}
          </div>
        </div>
      </main>
    </div>
  )
}
