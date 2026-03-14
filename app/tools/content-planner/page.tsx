'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { 
    title: 'Content Calendar', 
    icon: '📅', 
    credits: '10 Kredi', 
    back: '← Geri', 
    testMode: '🧪 Test Modu - Krediler düşmüyor', 
    purpose: '30 günlük kapsamlı içerik planı oluşturur. Her gün için konu, format, hook, hashtag ve paylaşım zamanı önerir.',
    nicheLabel: 'Niş / Sektör',
    nichePlaceholder: 'örn: fitness, kişisel finans, yemek...',
    goalsLabel: 'Hedefler',
    goalsPlaceholder: 'örn: takipçi artışı, satış, marka bilinirliği...',
    platformLabel: 'Platform',
    btn: '30 Günlük Plan Oluştur',
    loading: 'Plan oluşturuluyor... (30 gün)',
    strategy: '📊 Strateji Özeti',
    weeklyThemes: '🎯 Haftalık Temalar',
    calendar: '📅 30 Günlük Takvim',
    bonusIdeas: '💡 Bonus Fikirler',
    day: 'Gün',
    week: 'Hafta'
  },
  en: { 
    title: 'Content Calendar', 
    icon: '📅', 
    credits: '10 Credits', 
    back: '← Back', 
    testMode: '🧪 Test Mode - No credits deducted', 
    purpose: 'Creates a comprehensive 30-day content plan. Suggests topic, format, hook, hashtags and posting time for each day.',
    nicheLabel: 'Niche / Industry',
    nichePlaceholder: 'e.g., fitness, personal finance, food...',
    goalsLabel: 'Goals',
    goalsPlaceholder: 'e.g., follower growth, sales, brand awareness...',
    platformLabel: 'Platform',
    btn: 'Create 30-Day Plan',
    loading: 'Creating plan... (30 days)',
    strategy: '📊 Strategy Overview',
    weeklyThemes: '🎯 Weekly Themes',
    calendar: '📅 30-Day Calendar',
    bonusIdeas: '💡 Bonus Ideas',
    day: 'Day',
    week: 'Week'
  },
  ru: { title: 'Content Calendar', icon: '📅', credits: '10', back: '← Назад', testMode: '🧪 Тест', purpose: '30-дневный контент-план.', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', goalsLabel: 'Цели', goalsPlaceholder: 'напр: рост...', platformLabel: 'Платформа', btn: 'Создать план', loading: 'Создание...', strategy: '📊 Стратегия', weeklyThemes: '🎯 Темы', calendar: '📅 Календарь', bonusIdeas: '💡 Идеи', day: 'День', week: 'Неделя' },
  de: { title: 'Content Calendar', icon: '📅', credits: '10', back: '← Zurück', testMode: '🧪 Test', purpose: '30-Tage Content-Plan.', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', goalsLabel: 'Ziele', goalsPlaceholder: 'z.B. Wachstum...', platformLabel: 'Plattform', btn: 'Plan erstellen', loading: 'Erstelle...', strategy: '📊 Strategie', weeklyThemes: '🎯 Themen', calendar: '📅 Kalender', bonusIdeas: '💡 Ideen', day: 'Tag', week: 'Woche' },
  fr: { title: 'Content Calendar', icon: '📅', credits: '10', back: '← Retour', testMode: '🧪 Test', purpose: 'Plan de contenu 30 jours.', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', goalsLabel: 'Objectifs', goalsPlaceholder: 'ex: croissance...', platformLabel: 'Plateforme', btn: 'Créer le plan', loading: 'Création...', strategy: '📊 Stratégie', weeklyThemes: '🎯 Thèmes', calendar: '📅 Calendrier', bonusIdeas: '💡 Idées', day: 'Jour', week: 'Semaine' }
}

const contentTypeColors: any = {
  'Carousel': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Reel': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Post': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Story': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Live': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Video': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [niche, setNiche] = useState('')
  const [goals, setGoals] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [])

  const handleSubmit = async () => {
    if (!niche.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/content-planner', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, goals, platform, language })
      })
      const data = await res.json()
      if (res.ok) setResult(data.result)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const getWeekDays = (weekNum: number) => {
    if (!result?.days) return []
    const start = (weekNum - 1) * 7
    return result.days.slice(start, start + 7)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">{t.back}</Link>
            <span className="text-2xl">{t.icon}</span>
            <h1 className="text-xl font-bold">{t.title}</h1>
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
      
      <main className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
        {!result ? (
          // Form
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                <input 
                  type="text" 
                  value={niche} 
                  onChange={e => setNiche(e.target.value)} 
                  placeholder={t.nichePlaceholder} 
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.goalsLabel}</label>
                <input 
                  type="text" 
                  value={goals} 
                  onChange={e => setGoals(e.target.value)} 
                  placeholder={t.goalsPlaceholder} 
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity">
                {loading ? t.loading : t.btn}
              </button>
            </div>
          </div>
        ) : (
          // Sonuçlar
          <div className="space-y-8">
            {/* Strateji Özeti */}
            {result.strategy_overview && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{t.strategy}</h3>
                <p className="text-gray-300">{result.strategy_overview}</p>
              </div>
            )}
            
            {/* Haftalık Temalar */}
            {result.weekly_themes && result.weekly_themes.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{t.weeklyThemes}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {result.weekly_themes.map((wt: any, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedWeek(selectedWeek === wt.week ? null : wt.week)}
                      className={`p-4 rounded-xl border transition-all ${selectedWeek === wt.week ? 'bg-purple-500/20 border-purple-500' : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'}`}
                    >
                      <div className="text-purple-400 font-semibold">{t.week} {wt.week}</div>
                      <div className="text-white text-sm mt-1">{wt.theme}</div>
                      <div className="text-gray-500 text-xs mt-1">{wt.focus}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 30 Günlük Takvim */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{t.calendar}</h3>
              
              {/* Hafta Seçimi */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button 
                  onClick={() => setSelectedWeek(null)} 
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${!selectedWeek ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Tümü
                </button>
                {[1,2,3,4,5].map(w => (
                  <button 
                    key={w} 
                    onClick={() => setSelectedWeek(w)} 
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedWeek === w ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    {t.week} {w}
                  </button>
                ))}
              </div>
              
              {/* Günler */}
              <div className="grid gap-4">
                {(selectedWeek ? getWeekDays(selectedWeek) : result.days)?.map((day: any, i: number) => (
                  <div key={i} className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors">
                    <div className="flex flex-wrap items-start gap-4">
                      {/* Gün Numarası */}
                      <div className="w-16 text-center">
                        <div className="text-3xl font-bold text-purple-400">{day.day}</div>
                        <div className="text-xs text-gray-500">{day.weekday}</div>
                      </div>
                      
                      {/* İçerik Detayları */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs border ${contentTypeColors[day.content_type] || 'bg-gray-700 text-gray-300'}`}>
                            {day.content_type}
                          </span>
                          <span className="text-xs text-gray-500">{day.best_time}</span>
                          {day.content_pillar && (
                            <span className="text-xs text-gray-500">• {day.content_pillar}</span>
                          )}
                        </div>
                        
                        <h4 className="text-white font-medium mb-1">{day.topic}</h4>
                        
                        {day.hook && (
                          <p className="text-purple-400 text-sm mb-2">🎣 "{day.hook}"</p>
                        )}
                        
                        {day.description && (
                          <p className="text-gray-400 text-sm mb-2">{day.description}</p>
                        )}
                        
                        {day.cta && (
                          <p className="text-green-400 text-sm">📢 {day.cta}</p>
                        )}
                        
                        {day.hashtags && day.hashtags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {day.hashtags.slice(0, 5).map((tag: string, j: number) => (
                              <span key={j} className="text-xs text-blue-400">{tag}</span>
                            ))}
                          </div>
                        )}
                        
                        {day.engagement_tip && (
                          <p className="text-yellow-400 text-xs mt-2">💡 {day.engagement_tip}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bonus Fikirler */}
            {result.bonus_ideas && result.bonus_ideas.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">{t.bonusIdeas}</h3>
                <ul className="space-y-2">
                  {result.bonus_ideas.map((idea: string, i: number) => (
                    <li key={i} className="text-gray-300 text-sm">💡 {idea}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Yeni Plan Butonu */}
            <div className="text-center">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors">
                ← Yeni Plan Oluştur
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
