'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Content Calendar', icon: '📅', credits: '10 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: '30 günlük içerik planı oluşturur. Her gün için konu, format ve paylaşım zamanı önerir.', nicheLabel: 'Niş', nichePlaceholder: 'örn: fitness, moda...', goalsLabel: 'Hedefler', goalsPlaceholder: 'örn: takipçi artışı, satış...', btn: 'Plan Oluştur', loading: 'Oluşturuluyor...' },
  en: { title: 'Content Calendar', icon: '📅', credits: '10 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Creates a 30-day content plan with topics, formats, and posting times.', nicheLabel: 'Niche', nichePlaceholder: 'e.g., fitness, fashion...', goalsLabel: 'Goals', goalsPlaceholder: 'e.g., follower growth, sales...', btn: 'Create Plan', loading: 'Creating...' },
  ru: { title: 'Content Calendar', icon: '📅', credits: '10', back: '← Назад', testMode: '🧪 Тест', purpose: 'Создаёт 30-дневный контент-план.', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', goalsLabel: 'Цели', goalsPlaceholder: 'напр: рост...', btn: 'Создать', loading: 'Создание...' },
  de: { title: 'Content Calendar', icon: '📅', credits: '10', back: '← Zurück', testMode: '🧪 Test', purpose: 'Erstellt einen 30-Tage Content-Plan.', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', goalsLabel: 'Ziele', goalsPlaceholder: 'z.B. Wachstum...', btn: 'Erstellen', loading: 'Erstelle...' },
  fr: { title: 'Content Calendar', icon: '📅', credits: '10', back: '← Retour', testMode: '🧪 Test', purpose: 'Crée un plan de contenu de 30 jours.', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', goalsLabel: 'Objectifs', goalsPlaceholder: 'ex: croissance...', btn: 'Créer', loading: 'Création...' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [niche, setNiche] = useState('')
  const [goals, setGoals] = useState('')
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
    try {
      const res = await fetch('/api/content-planner', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, goals, userId: user?.id, language })
      })
      const data = await res.json()
      if (res.ok) setResult(data.result)
    } catch (e) {}
    setLoading(false)
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
      <main className="pt-32 pb-12 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.goalsLabel}</label>
                <input type="text" value={goals} onChange={e => setGoals(e.target.value)} placeholder={t.goalsPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {result ? (
              <div className="space-y-3">
                {result.days?.map((day: any, i: number) => (
                  <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-400 font-medium">Day {day.day}</span>
                      <span className="text-xs text-gray-500">{day.time}</span>
                    </div>
                    <p className="text-white text-sm">{day.topic}</p>
                    <span className="text-xs text-gray-400">{day.format}</span>
                  </div>
                ))}
              </div>
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
