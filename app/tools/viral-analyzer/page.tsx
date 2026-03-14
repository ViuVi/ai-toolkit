'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Viral Analyzer', icon: '🔬', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'İçeriğinizin viral potansiyelini analiz eder ve iyileştirme önerileri sunar.', contentLabel: 'İçerik', contentPlaceholder: 'Analiz etmek istediğiniz içeriği yapıştırın...', platformLabel: 'Platform', nicheLabel: 'Niş', nichePlaceholder: 'örn: fitness, teknoloji...', btn: 'Analiz Et', loading: 'Analiz ediliyor...', copy: 'Kopyala', copied: '✓' },
  en: { title: 'Viral Analyzer', icon: '🔬', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Analyzes viral potential of your content and provides improvement suggestions.', contentLabel: 'Content', contentPlaceholder: 'Paste the content you want to analyze...', platformLabel: 'Platform', nicheLabel: 'Niche', nichePlaceholder: 'e.g., fitness, tech...', btn: 'Analyze', loading: 'Analyzing...', copy: 'Copy', copied: '✓' },
  ru: { title: 'Viral Analyzer', icon: '🔬', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Анализирует вирусный потенциал.', contentLabel: 'Контент', contentPlaceholder: 'Вставьте контент...', platformLabel: 'Платформа', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', btn: 'Анализ', loading: 'Анализ...', copy: 'Копировать', copied: '✓' },
  de: { title: 'Viral Analyzer', icon: '🔬', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Analysiert virales Potenzial.', contentLabel: 'Inhalt', contentPlaceholder: 'Inhalt einfügen...', platformLabel: 'Plattform', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', btn: 'Analysieren', loading: 'Analyse...', copy: 'Kopieren', copied: '✓' },
  fr: { title: 'Viral Analyzer', icon: '🔬', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Analyse le potentiel viral.', contentLabel: 'Contenu', contentPlaceholder: 'Collez le contenu...', platformLabel: 'Plateforme', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', btn: 'Analyser', loading: 'Analyse...', copy: 'Copier', copied: '✓' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [niche, setNiche] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/viral-analyzer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platform, niche, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500) }
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }
  
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
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
              <div><label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label><textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-40 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label><select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white"><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="twitter">Twitter</option><option value="youtube">YouTube</option></select></div>
                <div><label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label><input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white placeholder-gray-500" /></div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result ? (
              <>
                {/* Ana Skor */}
                <div className={`rounded-2xl p-6 border-2 ${result.score >= 70 ? 'bg-green-500/10 border-green-500/50' : result.score >= 50 ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className={`text-4xl font-bold ${getScoreColor(result.score)}`}>{result.score}</h2>
                      <p className="text-gray-400 text-sm">/100 Viral Skor</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-semibold ${getScoreColor(result.score)}`}>{result.verdict}</span>
                    </div>
                  </div>
                  {result.summary && <p className="text-gray-300 text-sm">{result.summary}</p>}
                </div>
                
                {/* Detaylı Puanlar */}
                {result.breakdown && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-4">📊 Detaylı Analiz</h3>
                    <div className="space-y-3">
                      {Object.entries(result.breakdown).map(([key, val]: [string, any]) => (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className={`text-sm font-semibold ${getScoreColor(val.score)}`}>{val.score}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full ${getScoreBg(val.score)} rounded-full transition-all`} style={{width: `${val.score}%`}}></div>
                          </div>
                          {val.analysis && <p className="text-gray-500 text-xs mt-1">{val.analysis}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Güçlü Yönler */}
                {result.strengths && result.strengths.length > 0 && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <h3 className="text-green-400 font-semibold mb-2">✅ Güçlü Yönler</h3>
                    <ul className="space-y-1">
                      {result.strengths.map((s: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {s}</li>)}
                    </ul>
                  </div>
                )}
                
                {/* Zayıf Yönler */}
                {result.weaknesses && result.weaknesses.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <h3 className="text-red-400 font-semibold mb-2">⚠️ Geliştirme Alanları</h3>
                    <ul className="space-y-1">
                      {result.weaknesses.map((w: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {w}</li>)}
                    </ul>
                  </div>
                )}
                
                {/* İyileştirme Önerileri */}
                {result.improvements && result.improvements.length > 0 && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <h3 className="text-purple-400 font-semibold mb-3">💡 İyileştirme Önerileri</h3>
                    <div className="space-y-3">
                      {result.improvements.map((imp: any, i: number) => (
                        <div key={i} className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${imp.priority === 'high' ? 'bg-red-500/30 text-red-400' : imp.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-400' : 'bg-gray-600 text-gray-300'}`}>{imp.priority === 'high' ? 'Yüksek' : imp.priority === 'medium' ? 'Orta' : 'Düşük'}</span>
                          </div>
                          <p className="text-white text-sm">{imp.suggestion}</p>
                          {imp.example && <p className="text-gray-400 text-xs mt-1">Örnek: {imp.example}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Yeniden Yazılmış Hook */}
                {result.rewritten_hook && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-yellow-400 font-semibold">🎣 Önerilen Hook</h3>
                      <button onClick={() => copyText('hook', result.rewritten_hook)} className="text-xs text-yellow-400">{copiedKey === 'hook' ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-white">{result.rewritten_hook}</p>
                  </div>
                )}
                
                {/* Hashtag Önerileri */}
                {result.best_hashtags && result.best_hashtags.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-blue-400 font-semibold">🏷️ Önerilen Hashtagler</h3>
                      <button onClick={() => copyText('tags', result.best_hashtags.join(' '))} className="text-xs text-blue-400">{copiedKey === 'tags' ? t.copied : t.copy}</button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.best_hashtags.map((h: string, i: number) => <span key={i} className="text-blue-300 text-sm">{h}</span>)}
                    </div>
                  </div>
                )}
                
                {/* Tahmini Performans */}
                {result.predicted_performance && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">📈 Tahmini Performans</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {result.predicted_performance.views && <div className="text-center p-2 bg-gray-900/50 rounded-lg"><span className="text-gray-400 text-xs">Görüntülenme</span><p className="text-white font-semibold">{result.predicted_performance.views}</p></div>}
                      {result.predicted_performance.likes && <div className="text-center p-2 bg-gray-900/50 rounded-lg"><span className="text-gray-400 text-xs">Beğeni</span><p className="text-white font-semibold">{result.predicted_performance.likes}</p></div>}
                      {result.predicted_performance.comments && <div className="text-center p-2 bg-gray-900/50 rounded-lg"><span className="text-gray-400 text-xs">Yorum</span><p className="text-white font-semibold">{result.predicted_performance.comments}</p></div>}
                      {result.predicted_performance.shares && <div className="text-center p-2 bg-gray-900/50 rounded-lg"><span className="text-gray-400 text-xs">Paylaşım</span><p className="text-white font-semibold">{result.predicted_performance.shares}</p></div>}
                    </div>
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
