'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const countries = [
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
  { code: 'US', name: 'Amerika (Doğu)', flag: '🇺🇸' },
  { code: 'US_WEST', name: 'Amerika (Batı)', flag: '🇺🇸' },
  { code: 'UK', name: 'İngiltere', flag: '🇬🇧' },
  { code: 'DE', name: 'Almanya', flag: '🇩🇪' },
  { code: 'FR', name: 'Fransa', flag: '🇫🇷' },
  { code: 'RU', name: 'Rusya', flag: '🇷🇺' },
  { code: 'JP', name: 'Japonya', flag: '🇯🇵' },
  { code: 'KR', name: 'Güney Kore', flag: '🇰🇷' },
  { code: 'CN', name: 'Çin', flag: '🇨🇳' },
  { code: 'IN', name: 'Hindistan', flag: '🇮🇳' },
  { code: 'BR', name: 'Brezilya', flag: '🇧🇷' },
  { code: 'AU', name: 'Avustralya', flag: '🇦🇺' },
  { code: 'AE', name: 'BAE / Dubai', flag: '🇦🇪' },
]

const texts: any = {
  tr: { title: 'Smart Posting Times', icon: '⏰', credits: '2 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Farklı ülkelerdeki hedef kitleniz için en optimal paylaşım zamanlarını analiz eder.', nicheLabel: 'Niş', nichePlaceholder: 'örn: fitness, teknoloji...', platformLabel: 'Platform', targetLabel: '🎯 Hedef Ülke', userLabel: '📍 Senin Konumun', audienceLabel: 'Hedef Kitle', btn: 'Analiz Et', loading: 'Analiz ediliyor...', goldenHours: '🌟 Altın Saatler', schedule: '📅 Haftalık Program', tips: '💡 İpuçları' },
  en: { title: 'Smart Posting Times', icon: '⏰', credits: '2 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Analyzes optimal posting times for your target audience in different countries.', nicheLabel: 'Niche', nichePlaceholder: 'e.g., fitness, tech...', platformLabel: 'Platform', targetLabel: '🎯 Target Country', userLabel: '📍 Your Location', audienceLabel: 'Target Audience', btn: 'Analyze', loading: 'Analyzing...', goldenHours: '🌟 Golden Hours', schedule: '📅 Weekly Schedule', tips: '💡 Tips' },
  ru: { title: 'Smart Posting Times', icon: '⏰', credits: '2', back: '← Назад', testMode: '🧪 Тест', purpose: 'Анализирует лучшее время.', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', targetLabel: '🎯 Страна', userLabel: '📍 Ваше место', audienceLabel: 'Аудитория', btn: 'Анализ', loading: 'Анализ...', goldenHours: '🌟 Золотые часы', schedule: '📅 Расписание', tips: '💡 Советы' },
  de: { title: 'Smart Posting Times', icon: '⏰', credits: '2', back: '← Zurück', testMode: '🧪 Test', purpose: 'Analysiert die besten Posting-Zeiten.', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', targetLabel: '🎯 Zielland', userLabel: '📍 Ihr Standort', audienceLabel: 'Zielgruppe', btn: 'Analysieren', loading: 'Analyse...', goldenHours: '🌟 Goldene Stunden', schedule: '📅 Wochenplan', tips: '💡 Tipps' },
  fr: { title: 'Smart Posting Times', icon: '⏰', credits: '2', back: '← Retour', testMode: '🧪 Test', purpose: 'Analyse les meilleurs moments.', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', targetLabel: '🎯 Pays cible', userLabel: '📍 Votre emplacement', audienceLabel: 'Audience', btn: 'Analyser', loading: 'Analyse...', goldenHours: '🌟 Heures d\'or', schedule: '📅 Programme', tips: '💡 Conseils' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [targetCountry, setTargetCountry] = useState('US')
  const [userCountry, setUserCountry] = useState('TR')
  const [audienceType, setAudienceType] = useState('general')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!niche.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/posting-optimizer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, targetCountry, userCountry, audienceType, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">{t.back}</Link>
            <span className="text-2xl">{t.icon}</span><h1 className="text-xl font-bold">{t.title}</h1>
            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">{t.credits}</span>
          </div>
          <div className="relative group">
            <button className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">🌐 {language.toUpperCase()}</button>
            <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${language === l ? 'text-purple-400' : 'text-gray-300'}`}>{l.toUpperCase()}</button>)}
            </div>
          </div>
        </div>
      </header>
      <div className="fixed top-16 left-0 right-0 z-40 bg-green-500/10 border-b border-green-500/30 py-2 text-center text-green-400 text-sm">{t.testMode}</div>
      
      <main className="pt-32 pb-12 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6"><p className="text-gray-400 text-sm">{t.purpose}</p></div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div><label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label><input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label><select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white"><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="twitter">Twitter/X</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option></select></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.targetLabel}</label><select value={targetCountry} onChange={e => setTargetCountry(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white">{countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}</select></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.userLabel}</label><select value={userCountry} onChange={e => setUserCountry(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white">{countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}</select></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.audienceLabel}</label><select value={audienceType} onChange={e => setAudienceType(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white"><option value="general">Genel</option><option value="young">Genç (18-24)</option><option value="adult">Yetişkin (25-34)</option><option value="professional">Profesyonel</option></select></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result ? (
              <>
                {result.analysis_summary && <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4"><p className="text-gray-300">{result.analysis_summary}</p></div>}
                
                {result.golden_hours && result.golden_hours.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h3 className="text-yellow-400 font-semibold mb-3">{t.goldenHours}</h3>
                    <div className="space-y-2">
                      {result.golden_hours.map((gh: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                          <div><span className="text-white">{gh.day}</span><p className="text-xs text-gray-400">{gh.why}</p></div>
                          <div className="text-right"><div className="text-yellow-400 font-bold">{gh.target_time}</div><div className="text-xs text-gray-500">Senin: {gh.your_time}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.schedule && result.schedule.length > 0 && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">{t.schedule}</h3>
                    <div className="space-y-3">
                      {result.schedule.map((day: any, i: number) => (
                        <div key={i} className="border-b border-gray-700 pb-3 last:border-0">
                          <span className="text-purple-400 font-medium">{day.day}</span>
                          <div className="space-y-1 mt-2">
                            {day.slots?.map((slot: any, j: number) => (
                              <div key={j} className={`flex justify-between items-center p-2 rounded-lg ${slot.priority === 'high' ? 'bg-green-500/10' : 'bg-gray-700/30'}`}>
                                <div><span className="text-white text-sm">{slot.content_type}</span><p className="text-xs text-gray-400">{slot.reason}</p></div>
                                <div className="text-right"><div className="text-white text-sm">{slot.target_time}</div><div className="text-xs text-gray-500">{slot.your_time}</div></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.timezone_tips && result.timezone_tips.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h3 className="text-blue-400 font-semibold mb-2">{t.tips}</h3>
                    <ul className="space-y-1">{result.timezone_tips.map((tip: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {tip}</li>)}</ul>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">{t.icon}</div>
                <p className="text-gray-500">{t.purpose}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
