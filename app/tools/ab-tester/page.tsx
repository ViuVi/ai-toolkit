'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'İki caption\'ı karşılaştırır ve hangisinin daha iyi performans göstereceğini analiz eder.', captionALabel: 'Caption A', captionBLabel: 'Caption B', placeholder: 'Caption metnini gir...', platformLabel: 'Platform', goalLabel: 'Hedef', btn: 'Karşılaştır', loading: 'Analiz ediliyor...', winner: 'Kazanan', hybrid: 'En İyi Versiyon', newTest: '← Yeni Karşılaştırma' },
  en: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Compares two captions and analyzes which one will perform better.', captionALabel: 'Caption A', captionBLabel: 'Caption B', placeholder: 'Enter caption...', platformLabel: 'Platform', goalLabel: 'Goal', btn: 'Compare', loading: 'Analyzing...', winner: 'Winner', hybrid: 'Best Version', newTest: '← New Comparison' },
  ru: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Сравнивает две подписи.', captionALabel: 'Подпись A', captionBLabel: 'Подпись B', placeholder: 'Введите текст...', platformLabel: 'Платформа', goalLabel: 'Цель', btn: 'Сравнить', loading: 'Анализ...', winner: 'Победитель', hybrid: 'Лучшая версия', newTest: '← Новое' },
  de: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Vergleicht zwei Captions.', captionALabel: 'Caption A', captionBLabel: 'Caption B', placeholder: 'Text eingeben...', platformLabel: 'Plattform', goalLabel: 'Ziel', btn: 'Vergleichen', loading: 'Analyse...', winner: 'Gewinner', hybrid: 'Beste Version', newTest: '← Neu' },
  fr: { title: 'A/B Caption Tester', icon: '⚖️', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Compare deux légendes.', captionALabel: 'Légende A', captionBLabel: 'Légende B', placeholder: 'Entrez le texte...', platformLabel: 'Plateforme', goalLabel: 'Objectif', btn: 'Comparer', loading: 'Analyse...', winner: 'Gagnant', hybrid: 'Meilleure version', newTest: '← Nouveau' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [captionA, setCaptionA] = useState('')
  const [captionB, setCaptionB] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [goal, setGoal] = useState('engagement')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!captionA.trim() || !captionB.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ab-tester', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ captionA, captionB, platform, goal, language }) })
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
      
      <main className="pt-32 pb-12 px-4 max-w-5xl mx-auto">
        {!result ? (
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6"><p className="text-gray-400 text-sm">{t.purpose}</p></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <label className="block text-sm text-purple-400 font-semibold mb-2">📝 {t.captionALabel}</label>
                <textarea value={captionA} onChange={e => setCaptionA(e.target.value)} placeholder={t.placeholder} className="w-full h-40 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <label className="block text-sm text-pink-400 font-semibold mb-2">📝 {t.captionBLabel}</label>
                <textarea value={captionB} onChange={e => setCaptionB(e.target.value)} placeholder={t.placeholder} className="w-full h-40 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label><select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white"><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="twitter">Twitter/X</option><option value="linkedin">LinkedIn</option></select></div>
              <div><label className="block text-sm text-gray-400 mb-2">{t.goalLabel}</label><select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white"><option value="engagement">Engagement</option><option value="reach">Reach</option><option value="conversions">Conversions</option></select></div>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Kazanan Banner */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-2">🏆</div>
              <h2 className="text-2xl font-bold text-yellow-400">{t.winner}: Caption {result.winner}</h2>
              {result.confidence && <p className="text-gray-400 mt-1">Güven: {result.confidence}</p>}
              {result.verdict && <p className="text-gray-300 mt-2">{result.verdict}</p>}
            </div>
            
            {/* Karşılaştırma */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Caption A */}
              <div className={`rounded-2xl p-6 border-2 ${result.winner === 'A' ? 'bg-green-500/10 border-green-500' : 'bg-gray-800/50 border-gray-700'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-purple-400">Caption A</h3>
                  <div className="text-right"><span className="text-3xl font-bold text-white">{result.score_a || 0}</span><span className="text-gray-400">/100</span></div>
                </div>
                {result.winner === 'A' && <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm mb-3">🏆 Kazanan</span>}
                {result.analysis_a && (
                  <div className="space-y-3">
                    {result.analysis_a.overall_impression && <p className="text-gray-300 text-sm">{result.analysis_a.overall_impression}</p>}
                    <div className="space-y-2">
                      {result.analysis_a.hook_score && (
                        <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">🎣 Hook</span><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{width: `${result.analysis_a.hook_score}%`}}></div></div><span className="text-white text-sm w-8">{result.analysis_a.hook_score}</span></div></div>
                      )}
                      {result.analysis_a.emotional_score && (
                        <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">💖 Duygusal</span><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-pink-500 rounded-full" style={{width: `${result.analysis_a.emotional_score}%`}}></div></div><span className="text-white text-sm w-8">{result.analysis_a.emotional_score}</span></div></div>
                      )}
                      {result.analysis_a.cta_score && (
                        <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">📢 CTA</span><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{width: `${result.analysis_a.cta_score}%`}}></div></div><span className="text-white text-sm w-8">{result.analysis_a.cta_score}</span></div></div>
                      )}
                    </div>
                    {result.analysis_a.strengths && <div className="pt-2 border-t border-gray-700"><span className="text-green-400 text-xs">✅ Güçlü:</span><p className="text-gray-300 text-sm">{result.analysis_a.strengths.join(', ')}</p></div>}
                  </div>
                )}
              </div>
              
              {/* Caption B */}
              <div className={`rounded-2xl p-6 border-2 ${result.winner === 'B' ? 'bg-green-500/10 border-green-500' : 'bg-gray-800/50 border-gray-700'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-pink-400">Caption B</h3>
                  <div className="text-right"><span className="text-3xl font-bold text-white">{result.score_b || 0}</span><span className="text-gray-400">/100</span></div>
                </div>
                {result.winner === 'B' && <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm mb-3">🏆 Kazanan</span>}
                {result.analysis_b && (
                  <div className="space-y-3">
                    {result.analysis_b.overall_impression && <p className="text-gray-300 text-sm">{result.analysis_b.overall_impression}</p>}
                    <div className="space-y-2">
                      {result.analysis_b.hook_score && (
                        <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">🎣 Hook</span><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{width: `${result.analysis_b.hook_score}%`}}></div></div><span className="text-white text-sm w-8">{result.analysis_b.hook_score}</span></div></div>
                      )}
                      {result.analysis_b.emotional_score && (
                        <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">💖 Duygusal</span><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-pink-500 rounded-full" style={{width: `${result.analysis_b.emotional_score}%`}}></div></div><span className="text-white text-sm w-8">{result.analysis_b.emotional_score}</span></div></div>
                      )}
                      {result.analysis_b.cta_score && (
                        <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">📢 CTA</span><div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{width: `${result.analysis_b.cta_score}%`}}></div></div><span className="text-white text-sm w-8">{result.analysis_b.cta_score}</span></div></div>
                      )}
                    </div>
                    {result.analysis_b.strengths && <div className="pt-2 border-t border-gray-700"><span className="text-green-400 text-xs">✅ Güçlü:</span><p className="text-gray-300 text-sm">{result.analysis_b.strengths.join(', ')}</p></div>}
                  </div>
                )}
              </div>
            </div>
            
            {/* Hibrit */}
            {result.hybrid_suggestion && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-purple-400 font-semibold mb-2">✨ {t.hybrid}</h3>
                <p className="text-white">{result.hybrid_suggestion}</p>
              </div>
            )}
            
            <div className="text-center"><button onClick={() => setResult(null)} className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600">{t.newTest}</button></div>
          </div>
        )}
      </main>
    </div>
  )
}
