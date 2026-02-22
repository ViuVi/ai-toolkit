'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

export default function ContentCalendarPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [platform, setPlatform] = useState('instagram')
  const [niche, setNiche] = useState('business')
  const [calendar, setCalendar] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { t, language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  const handleGenerate = async () => {
    setLoading(true)
    setCalendar(null)

    try {
      const response = await fetch('/api/content-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year, platform, niche, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setCalendar(data.calendar)
        showToast(language === 'en' ? 'Calendar generated!' : 'Takvim oluşturuldu!', 'success')
      }
    } catch (err) {
      showToast((language === 'tr' ? 'Hata oluştu' : 'An error occurred'), 'error')
    }

    setLoading(false)
  }

  const exportCalendar = () => {
    if (!calendar) return
    
    const text = calendar.days.map((d: any) => 
      `${d.date} (${d.dayName}) - ${d.contentType}: ${d.topic}${d.specialDay ? ' - ' + d.specialDay : ''} - ${d.bestTime}`
    ).join('\n')
    
    navigator.clipboard.writeText(text)
    showToast(language === 'en' ? 'Calendar copied!' : 'Takvim kopyalandı!', 'success')
  }

  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i)

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' }
  ]

  const niches = [
    { value: 'fitness', label: language === 'en' ? 'Fitness' : 'Fitness', icon: '💪' },
    { value: 'food', label: language === 'en' ? 'Food' : 'Yemek', icon: '🍔' },
    { value: 'tech', label: language === 'en' ? 'Tech' : 'Teknoloji', icon: '💻' },
    { value: 'fashion', label: language === 'en' ? 'Fashion' : 'Moda', icon: '👗' },
    { value: 'travel', label: language === 'en' ? 'Travel' : 'Seyahat', icon: '✈️' },
    { value: 'business', label: language === 'en' ? 'Business' : 'İş', icon: '📊' },
    { value: 'beauty', label: language === 'en' ? 'Beauty' : 'Güzellik', icon: '💄' }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{(language === 'tr' ? 'Panele Dön' : 'Back to Dashboard')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">📅</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-green-400 text-sm font-medium">
              {language === 'en' ? '📅 FREE TOOL' : '📅 ÜCRETSİZ ARAÇ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Content Calendar Generator' : 'İçerik Takvimi Oluşturucu'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Plan your entire month with AI-powered suggestions' : 'Yapay zeka destekli önerilerle tüm ayınızı planlayın'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Month' : 'Ay'}</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none">
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Year' : 'Yıl'}</label>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none">
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none">
                {platforms.map(p => (
                  <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Niche' : 'Kategori'}</label>
              <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none">
                {niches.map(n => (
                  <option key={n.value} value={n.value}>{n.icon} {n.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8">
          {loading ? <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</> : <>📅 {language === 'en' ? 'Generate Calendar' : 'Takvim Oluştur'}</>}
        </button>

        {calendar && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{calendar.month} {calendar.year}</h2>
              <button onClick={exportCalendar} className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm transition">
                📋 {language === 'en' ? 'Copy Calendar' : 'Takvimi Kopyala'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-400">{calendar.weeklyPlan.totalPosts}</div>
                <div className="text-sm text-gray-400">{language === 'en' ? 'Total Posts' : 'Toplam Paylaşım'}</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-400">{calendar.weeklyPlan.reels}</div>
                <div className="text-sm text-gray-400">{language === 'en' ? 'Videos/Reels' : 'Video/Reel'}</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
                <div className="text-3xl font-bold text-orange-400">{calendar.weeklyPlan.specialDaysCount}</div>
                <div className="text-sm text-gray-400">{language === 'en' ? 'Special Days' : 'Özel Günler'}</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">{language === 'en' ? 'Date' : 'Tarih'}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">{language === 'en' ? 'Content' : 'İçerik'}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">{language === 'en' ? 'Topic' : 'Konu'}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">{language === 'en' ? 'Time' : 'Saat'}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">{language === 'en' ? 'Special' : 'Özel'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {calendar.days.map((day: any, i: number) => (
                      <tr key={i} className={`hover:bg-gray-700/30 transition ${day.isWeekend ? 'bg-blue-500/5' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{day.day}</div>
                          <div className="text-xs text-gray-500">{day.dayName}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{day.icon}</span>
                            <span className="text-sm">{day.contentType}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{day.topic}</td>
                        <td className="px-4 py-3 text-sm font-mono text-cyan-400">{day.bestTime}</td>
                        <td className="px-4 py-3 text-sm">{day.specialDay || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                💡 {language === 'en' ? 'Pro Tips' : 'Pro İpuçları'}
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {calendar.tips.map((tip: string, i: number) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}