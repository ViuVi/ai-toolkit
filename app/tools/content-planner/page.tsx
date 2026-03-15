'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', nicheLabel: 'Niş/Konu', nichePlaceholder: 'örn: fitness, yemek tarifleri...', platformLabel: 'Platform', daysLabel: 'Gün Sayısı', goalsLabel: 'Hedefler', btn: 'Plan Oluştur', loading: 'Oluşturuluyor...', copy: 'Kopyala', copied: '✓', calendar: 'İçerik Takvimi', download: 'CSV İndir', newPlan: 'Yeni Plan' },
  en: { back: 'Dashboard', nicheLabel: 'Niche/Topic', nichePlaceholder: 'e.g., fitness, recipes...', platformLabel: 'Platform', daysLabel: 'Days', goalsLabel: 'Goals', btn: 'Create Plan', loading: 'Creating...', copy: 'Copy', copied: '✓', calendar: 'Content Calendar', download: 'Download CSV', newPlan: 'New Plan' },
  ru: { back: 'Панель', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', daysLabel: 'Дни', goalsLabel: 'Цели', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓', calendar: 'Календарь', download: 'Скачать', newPlan: 'Новый' },
  de: { back: 'Dashboard', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', daysLabel: 'Tage', goalsLabel: 'Ziele', btn: 'Erstellen', loading: 'Erstelle...', copy: 'Kopieren', copied: '✓', calendar: 'Kalender', download: 'CSV', newPlan: 'Neu' },
  fr: { back: 'Tableau', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', daysLabel: 'Jours', goalsLabel: 'Objectifs', btn: 'Créer', loading: 'Création...', copy: 'Copier', copied: '✓', calendar: 'Calendrier', download: 'CSV', newPlan: 'Nouveau' }
}

export default function ContentPlannerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [days, setDays] = useState('30')
  const [goals, setGoals] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else { setUser(user); supabase.from('credits').select('balance').eq('user_id', user.id).single().then(({ data }) => setCredits(data?.balance || 0)) }
    })
  }, [])

  const handleSubmit = async () => {
    if (!niche.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/content-planner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, days, goals, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        if (credits >= 10) { await supabase.from('credits').update({ balance: credits - 10 }).eq('user_id', user.id); setCredits(prev => prev - 10) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const downloadCSV = () => {
    if (!result?.calendar) return
    let csv = 'Gün,Başlık,Format,Hook,Açıklama\n'
    result.calendar.forEach((day: any) => {
      csv += `${day.day},"${day.title}","${day.format}","${day.hook || ''}","${day.description || ''}"\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `content-plan-${days}days.csv`
    link.click()
  }

  const formatColors: any = {
    'reel': 'bg-pink-500/20 text-pink-400',
    'carousel': 'bg-blue-500/20 text-blue-400',
    'story': 'bg-purple-500/20 text-purple-400',
    'post': 'bg-green-500/20 text-green-400',
    'live': 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">📅</span><h1 className="font-semibold">Content Calendar</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400 text-sm">✦</span><span className="font-medium">{credits}</span></div>
            <div className="relative group">
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="multi">Multi-Platform</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.daysLabel}</label>
                  <select value={days} onChange={e => setDays(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="7">7 Gün</option>
                    <option value="14">14 Gün</option>
                    <option value="30">30 Gün</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.goalsLabel}</label>
                <input type="text" value={goals} onChange={e => setGoals(e.target.value)} placeholder="örn: takipçi artışı, satış..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <button onClick={handleSubmit} disabled={loading || !niche.trim() || credits < 10} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 10 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">📅 {t.calendar}</h2>
              <button onClick={downloadCSV} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition">{t.download}</button>
            </div>

            <div className="grid gap-3">
              {result.calendar?.map((day: any, i: number) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-white/10 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">{day.day}</div>
                      <div>
                        <h3 className="font-medium text-white">{day.title}</h3>
                        {day.hook && <p className="text-gray-500 text-sm mt-1">🎣 {day.hook}</p>}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${formatColors[day.format?.toLowerCase()] || 'bg-gray-500/20 text-gray-400'}`}>{day.format}</span>
                  </div>
                  {day.description && <p className="text-gray-400 text-sm mt-3 pl-13">{day.description}</p>}
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newPlan}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
