'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Hashtag Research', icon: '#️⃣', credits: '3 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Konunuza özel hashtag araştırması yapar. Hacim, rekabet ve trend durumlarını analiz eder.', topicLabel: 'Konu / Niş', topicPlaceholder: 'örn: fitness, vegan yemek, teknoloji...', platformLabel: 'Platform', btn: 'Hashtag Bul', loading: 'Araştırılıyor...', copyAll: 'Tümünü Kopyala', copied: 'Kopyalandı!' },
  en: { title: 'Hashtag Research', icon: '#️⃣', credits: '3 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Researches hashtags for your topic. Analyzes volume, competition and trending status.', topicLabel: 'Topic / Niche', topicPlaceholder: 'e.g., fitness, vegan food, tech...', platformLabel: 'Platform', btn: 'Find Hashtags', loading: 'Researching...', copyAll: 'Copy All', copied: 'Copied!' },
  ru: { title: 'Hashtag Research', icon: '#️⃣', credits: '3', back: '← Назад', testMode: '🧪 Тест', purpose: 'Исследует хештеги.', topicLabel: 'Тема', topicPlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', btn: 'Найти', loading: 'Поиск...', copyAll: 'Копировать все', copied: 'Скопировано!' },
  de: { title: 'Hashtag Research', icon: '#️⃣', credits: '3', back: '← Zurück', testMode: '🧪 Test', purpose: 'Recherchiert Hashtags.', topicLabel: 'Thema', topicPlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', btn: 'Finden', loading: 'Suche...', copyAll: 'Alle kopieren', copied: 'Kopiert!' },
  fr: { title: 'Hashtag Research', icon: '#️⃣', credits: '3', back: '← Retour', testMode: '🧪 Test', purpose: 'Recherche des hashtags.', topicLabel: 'Sujet', topicPlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', btn: 'Trouver', loading: 'Recherche...', copyAll: 'Copier tout', copied: 'Copié!' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [copied, setCopied] = useState(false)
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
    if (!topic.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, language })
      })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyHashtags = (hashtags: any[]) => {
    const text = hashtags.map(h => h.tag || h).join(' ')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copySet = (setKey: string) => {
    if (!result?.ready_to_use_sets?.[setKey]) return
    const text = result.ready_to_use_sets[setKey].join(' ')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result ? (
              <>
                {/* Hazır Setler */}
                {result.ready_to_use_sets && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <h3 className="text-purple-400 font-semibold mb-3">📋 Kullanıma Hazır Setler</h3>
                    <div className="space-y-3">
                      {Object.entries(result.ready_to_use_sets).map(([key, hashtags]: [string, any]) => (
                        <div key={key} className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                            <button onClick={() => copySet(key)} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded hover:bg-purple-500/30">
                              {copied ? t.copied : t.copyAll}
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {hashtags.slice(0, 15).map((tag: string, i: number) => (
                              <span key={i} className="text-xs text-blue-400">{tag}</span>
                            ))}
                            {hashtags.length > 15 && <span className="text-xs text-gray-500">+{hashtags.length - 15}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* High Volume */}
                {result.hashtag_sets?.high_volume && result.hashtag_sets.high_volume.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <h3 className="text-red-400 font-semibold mb-3">🔥 Yüksek Hacim (1M+)</h3>
                    <div className="space-y-2">
                      {result.hashtag_sets.high_volume.map((h: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-gray-900/50 rounded-lg p-2">
                          <div>
                            <span className="text-blue-400">{h.tag}</span>
                            {h.tip && <p className="text-gray-500 text-xs">{h.tip}</p>}
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-400">{h.estimated_posts}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Medium Volume */}
                {result.hashtag_sets?.medium_volume && result.hashtag_sets.medium_volume.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h3 className="text-yellow-400 font-semibold mb-3">📊 Orta Hacim (100K-1M)</h3>
                    <div className="space-y-2">
                      {result.hashtag_sets.medium_volume.map((h: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-gray-900/50 rounded-lg p-2">
                          <span className="text-blue-400">{h.tag}</span>
                          <span className="text-xs text-gray-400">{h.estimated_posts}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Low Volume */}
                {result.hashtag_sets?.low_volume && result.hashtag_sets.low_volume.length > 0 && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <h3 className="text-green-400 font-semibold mb-3">🎯 Düşük Hacim (10K-100K)</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtag_sets.low_volume.map((h: any, i: number) => (
                        <span key={i} className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded">{h.tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Trending */}
                {result.hashtag_sets?.trending && result.hashtag_sets.trending.length > 0 && (
                  <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
                    <h3 className="text-pink-400 font-semibold mb-3">📈 Trend Hashtagler</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtag_sets.trending.map((h: any, i: number) => (
                        <div key={i} className="bg-pink-500/20 rounded-lg px-3 py-1">
                          <span className="text-pink-300">{h.tag}</span>
                          <span className="text-xs text-gray-400 ml-2">{h.trend_level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Stratejiler */}
                {result.rotation_strategy && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">🔄 Rotasyon Stratejisi</h3>
                    <p className="text-gray-300 text-sm">{result.rotation_strategy}</p>
                  </div>
                )}
                
                {/* Pro Tips */}
                {result.pro_tips && result.pro_tips.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h3 className="text-blue-400 font-semibold mb-2">💡 Pro İpuçları</h3>
                    <ul className="space-y-1">
                      {result.pro_tips.map((tip: string, i: number) => (
                        <li key={i} className="text-gray-300 text-sm">• {tip}</li>
                      ))}
                    </ul>
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
