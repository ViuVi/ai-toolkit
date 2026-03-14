'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'İki farklı caption\'ı karşılaştırır ve hangisinin daha iyi performans göstereceğini analiz eder.', captionALabel: 'Caption A', captionBLabel: 'Caption B', captionPlaceholder: 'Caption metnini gir...', btn: 'Karşılaştır', loading: 'Analiz ediliyor...' },
  en: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Compares two captions and analyzes which one will perform better.', captionALabel: 'Caption A', captionBLabel: 'Caption B', captionPlaceholder: 'Enter caption text...', btn: 'Compare', loading: 'Analyzing...' },
  ru: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Сравнивает две подписи и анализирует лучшую.', captionALabel: 'Подпись A', captionBLabel: 'Подпись B', captionPlaceholder: 'Введите текст...', btn: 'Сравнить', loading: 'Анализ...' },
  de: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Vergleicht zwei Captions und analysiert die bessere.', captionALabel: 'Caption A', captionBLabel: 'Caption B', captionPlaceholder: 'Text eingeben...', btn: 'Vergleichen', loading: 'Analyse...' },
  fr: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Compare deux légendes et analyse la meilleure.', captionALabel: 'Légende A', captionBLabel: 'Légende B', captionPlaceholder: 'Entrez le texte...', btn: 'Comparer', loading: 'Analyse...' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [captionA, setCaptionA] = useState('')
  const [captionB, setCaptionB] = useState('')
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
    if (!captionA.trim() || !captionB.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ab-tester', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captionA, captionB, userId: user?.id, language })
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
      <main className="pt-32 pb-12 px-4 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">{t.purpose}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <label className="block text-sm text-gray-400 mb-2">{t.captionALabel}</label>
              <textarea value={captionA} onChange={e => setCaptionA(e.target.value)} placeholder={t.captionPlaceholder} className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <label className="block text-sm text-gray-400 mb-2">{t.captionBLabel}</label>
              <textarea value={captionB} onChange={e => setCaptionB(e.target.value)} placeholder={t.captionPlaceholder} className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
          
          {result && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`rounded-2xl p-6 border-2 ${result.winner === 'A' ? 'bg-green-500/10 border-green-500' : 'bg-gray-800/50 border-gray-700'}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Caption A</span>
                  <span className="text-2xl font-bold text-purple-400">{result.scoreA}/100</span>
                </div>
                {result.winner === 'A' && <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">🏆 Winner</span>}
                <p className="text-gray-400 text-sm mt-4">{result.analysisA}</p>
              </div>
              <div className={`rounded-2xl p-6 border-2 ${result.winner === 'B' ? 'bg-green-500/10 border-green-500' : 'bg-gray-800/50 border-gray-700'}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Caption B</span>
                  <span className="text-2xl font-bold text-purple-400">{result.scoreB}/100</span>
                </div>
                {result.winner === 'B' && <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">🏆 Winner</span>}
                <p className="text-gray-400 text-sm mt-4">{result.analysisB}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
