'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', nicheLabel: 'Niş', nichePlaceholder: 'örn: fitness, yemek, teknoloji...', platformLabel: 'Platform', audienceLabel: 'Hedef Kitle', btn: 'Optimal Zamanları Bul', loading: 'Analiz ediliyor...', bestTimes: 'En İyi Zamanlar', weeklySchedule: 'Haftalık Program', tips: 'İpuçları', newAnalysis: 'Yeni Analiz' },
  en: { back: 'Dashboard', nicheLabel: 'Niche', nichePlaceholder: 'e.g., fitness, food, tech...', platformLabel: 'Platform', audienceLabel: 'Target Audience', btn: 'Find Optimal Times', loading: 'Analyzing...', bestTimes: 'Best Times', weeklySchedule: 'Weekly Schedule', tips: 'Tips', newAnalysis: 'New Analysis' },
  ru: { back: 'Панель', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', audienceLabel: 'Аудитория', btn: 'Найти', loading: 'Анализ...', bestTimes: 'Лучшее время', weeklySchedule: 'Расписание', tips: 'Советы', newAnalysis: 'Новый' },
  de: { back: 'Dashboard', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', audienceLabel: 'Zielgruppe', btn: 'Finden', loading: 'Analyse...', bestTimes: 'Beste Zeiten', weeklySchedule: 'Wochenplan', tips: 'Tipps', newAnalysis: 'Neu' },
  fr: { back: 'Tableau', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', audienceLabel: 'Public', btn: 'Trouver', loading: 'Analyse...', bestTimes: 'Meilleurs moments', weeklySchedule: 'Programme', tips: 'Conseils', newAnalysis: 'Nouveau' }
}

const dayNames: any = {
  tr: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
}

export default function PostingOptimizerPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [audience, setAudience] = useState('general')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en
  const days = dayNames[language] || dayNames.en

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
      const res = await fetch('/api/posting-optimizer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ niche, platform, audience, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // if (credits >= X) { // await supabase.from("credits").update({ balance: credits - 2 }).eq('user_id', user.id); // setCredits(prev => prev - X) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">⏰</span><h1 className="font-semibold">Smart Posting Times</h1></div>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-xl mx-auto">
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
                    <option value="twitter">Twitter/X</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.audienceLabel}</label>
                  <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="general">🌍 Genel</option>
                    <option value="students">🎓 Öğrenciler</option>
                    <option value="professionals">💼 Profesyoneller</option>
                    <option value="parents">👨‍👩‍👧 Ebeveynler</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !niche.trim() || credits < 2} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 2 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Best Times */}
            {result.best_times && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                <h3 className="text-green-400 font-semibold mb-4">🏆 {t.bestTimes}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(result.best_times.top_3 || result.best_times).slice?.(0,3).map((time: any, i: number) => (
                    <div key={i} className={`p-4 rounded-xl text-center ${i === 0 ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}>
                      <div className="text-2xl mb-1">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                      <div className="text-white font-bold">{typeof time === 'string' ? time : time.time}</div>
                      {time.day && <div className="text-gray-500 text-sm">{time.day}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly Schedule */}
            {result.weekly_schedule && (
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                <h3 className="font-semibold mb-4">📅 {t.weeklySchedule}</h3>
                <div className="space-y-2">
                  {Object.entries(result.weekly_schedule).map(([day, times]: [string, any], i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-gray-400">{day}</span>
                      <div className="flex gap-2">
                        {(Array.isArray(times) ? times : [times]).map((time: string, j: number) => (
                          <span key={j} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">{time}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {result.tips?.length > 0 && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
                <h3 className="text-yellow-400 font-semibold mb-3">💡 {t.tips}</h3>
                <ul className="space-y-2">{result.tips.map((tip: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {tip}</li>)}</ul>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newAnalysis}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
