'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

export default function PostSchedulerPage() {
  const [platform, setPlatform] = useState('instagram')
  const [contentType, setContentType] = useState('photo')
  const [userTimezone, setUserTimezone] = useState('Europe/Istanbul')
  const [targetTimezone, setTargetTimezone] = useState('Europe/London')
  const [schedule, setSchedule] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { t, language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  const timezones = [
    { value: 'Europe/Istanbul', label: language === 'en' ? 'Turkey (Istanbul)' : 'Türkiye (İstanbul)', flag: '🇹🇷' },
    { value: 'Europe/London', label: language === 'en' ? 'UK (London)' : 'İngiltere (Londra)', flag: '🇬🇧' },
    { value: 'Europe/Paris', label: language === 'en' ? 'France (Paris)' : 'Fransa (Paris)', flag: '🇫🇷' },
    { value: 'Europe/Berlin', label: language === 'en' ? 'Germany (Berlin)' : 'Almanya (Berlin)', flag: '🇩🇪' },
    { value: 'America/New_York', label: language === 'en' ? 'USA (New York)' : 'ABD (New York)', flag: '🇺🇸' },
    { value: 'America/Los_Angeles', label: language === 'en' ? 'USA (LA)' : 'ABD (LA)', flag: '🇺🇸' },
    { value: 'Asia/Dubai', label: language === 'en' ? 'UAE (Dubai)' : 'BAE (Dubai)', flag: '🇦🇪' },
    { value: 'Asia/Tokyo', label: language === 'en' ? 'Japan (Tokyo)' : 'Japonya (Tokyo)', flag: '🇯🇵' },
    { value: 'Australia/Sydney', label: language === 'en' ? 'Australia (Sydney)' : 'Avustralya (Sidney)', flag: '🇦🇺' }
  ]

  const contentTypes: {[key: string]: {value: string, label: string}[]} = {
    instagram: [
      { value: 'photo', label: language === 'en' ? 'Photo' : 'Fotoğraf' },
      { value: 'video', label: language === 'en' ? 'Video' : 'Video' },
      { value: 'story', label: 'Story' },
      { value: 'reel', label: 'Reel' }
    ],
    tiktok: [
      { value: 'video', label: language === 'en' ? 'Video' : 'Video' },
      { value: 'entertainment', label: language === 'en' ? 'Entertainment' : 'Eğlence' },
      { value: 'educational', label: language === 'en' ? 'Educational' : 'Eğitim' }
    ],
    youtube: [
      { value: 'video', label: language === 'en' ? 'Video' : 'Video' },
      { value: 'short', label: 'Short' },
      { value: 'livestream', label: language === 'en' ? 'Live' : 'Canlı' }
    ],
    twitter: [
      { value: 'tweet', label: 'Tweet' },
      { value: 'thread', label: 'Thread' },
      { value: 'poll', label: language === 'en' ? 'Poll' : 'Anket' }
    ],
    linkedin: [
      { value: 'post', label: 'Post' },
      { value: 'article', label: language === 'en' ? 'Article' : 'Makale' },
      { value: 'video', label: 'Video' }
    ]
  }

  const handleGenerate = async () => {
    setLoading(true)
    setSchedule(null)

    try {
      const response = await fetch('/api/post-scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, contentType, userTimezone, targetTimezone, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setSchedule(data.schedule)
        showToast(language === 'en' ? 'Schedule generated!' : 'Program oluşturuldu!', 'success')
      }
    } catch (err) {
      showToast((language === 'tr' ? 'Hata oluştu' : 'An error occurred'), 'error')
    }

    setLoading(false)
  }

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
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-cyan-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-cyan-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">📅</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-green-400 text-sm font-medium">
              {language === 'en' ? '📅 FREE TOOL' : '📅 ÜCRETSİZ ARAÇ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Post Scheduler' : 'Post Scheduler'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Find the best times with timezone conversion' : 'Saat dilimi dönüşümü ile en iyi saatleri bul'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Your Location (Where you live)' : 'Konumunuz (Nerede yaşıyorsunuz)'}
              </label>
              <select value={userTimezone} onChange={(e) => setUserTimezone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-cyan-500 focus:outline-none">
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.flag} {tz.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Target Audience (Where they live)' : 'Hedef Kitle (Nerede yaşıyorlar)'}
              </label>
              <select value={targetTimezone} onChange={(e) => setTargetTimezone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-cyan-500 focus:outline-none">
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.flag} {tz.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select value={platform} onChange={(e) => { setPlatform(e.target.value); setContentType(contentTypes[e.target.value][0].value); }} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-cyan-500 focus:outline-none">
                <option value="instagram">📸 Instagram</option>
                <option value="tiktok">🎵 TikTok</option>
                <option value="youtube">📺 YouTube</option>
                <option value="twitter">🐦 Twitter</option>
                <option value="linkedin">💼 LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Content Type' : 'İçerik Tipi'}</label>
              <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-cyan-500 focus:outline-none">
                {contentTypes[platform].map(ct => (
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8">
          {loading ? <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</> : <>📅 {language === 'en' ? 'Generate Schedule' : 'Program Oluştur'}</>}
        </button>

        {schedule && (
          <div className="space-y-6 animate-fade-in">
            {schedule.timeDifference !== 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-2">
                  🌍 {language === 'en' ? 'Timezone Conversion' : 'Saat Dilimi Dönüşümü'}
                </h3>
                <p className="text-gray-300">
                  {language === 'en' 
                    ? `Time difference: ${Math.abs(schedule.timeDifference)} hours ${schedule.timeDifference > 0 ? 'ahead' : 'behind'}`
                    : `Saat farkı: ${Math.abs(schedule.timeDifference)} saat ${schedule.timeDifference > 0 ? 'ileri' : 'geri'}`
                  }
                </p>
              </div>
            )}

            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'Weekly Schedule' : 'Haftalık Program'}</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {schedule.weeklySchedule.map((day: any, i: number) => (
                  <div key={i} className="p-6 hover:bg-gray-700/30 transition">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{day.day}</h4>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        day.color === 'green' ? 'bg-green-500/20 text-green-400' :
                        day.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                        day.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {day.engagement}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {day.userTimes.map((time: string, j: number) => (
                        <div key={j} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                          <div>
                            <div className="text-sm text-gray-400">{language === 'en' ? 'Your time' : 'Sizin saatiniz'}:</div>
                            <div className="font-mono text-lg text-cyan-400">{time}</div>
                          </div>
                          <div className="text-gray-500">→</div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">{language === 'en' ? 'Target time' : 'Hedef saat'}:</div>
                            <div className="font-mono text-lg text-blue-400">{day.targetTimes[j]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                💡 {language === 'en' ? 'Pro Tips' : 'Pro İpuçları'}
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {schedule.tips.map((tip: string, i: number) => (
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