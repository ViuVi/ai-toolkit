'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const getTexts = (lang: string) => {
  const data: any = {
    tr: {
      title: 'Hashtag Research',
      icon: '#️⃣',
      credits: '3 Kredi',
      back: '← Dashboard\'a Dön',
      testMode: '🧪 Test Modu - Kredi düşmüyor',
      purpose: 'Bu araç ne işe yarar?',
      purposeDesc: 'Nişine özel hashtag önerileri sunar. Her hashtag için hacim, rekabet seviyesi ve trend durumunu analiz eder.',
      howTo: 'Nasıl kullanılır?',
      howToSteps: ['Nişini veya konunu yaz', 'Platformu seç', '"Araştır" butonuna tıkla'],
      topicLabel: 'Konu / Niş',
      topicPlaceholder: 'örn: fitness, yemek tarifleri, teknoloji...',
      platformLabel: 'Platform',
      generateBtn: 'Araştır',
      generating: 'Araştırılıyor...',
      highVolume: 'Yüksek Hacim',
      mediumVolume: 'Orta Hacim',
      lowVolume: 'Düşük Hacim',
      trending: 'Trend',
      copyAll: 'Tümünü Kopyala',
      copied: 'Kopyalandı!'
    },
    en: {
      title: 'Hashtag Research',
      icon: '#️⃣',
      credits: '3 Credits',
      back: '← Back to Dashboard',
      testMode: '🧪 Test Mode - No credits deducted',
      purpose: 'What does this tool do?',
      purposeDesc: 'Provides hashtag suggestions specific to your niche. Analyzes volume, competition level, and trend status for each hashtag.',
      howTo: 'How to use?',
      howToSteps: ['Enter your niche or topic', 'Select platform', 'Click "Research"'],
      topicLabel: 'Topic / Niche',
      topicPlaceholder: 'e.g., fitness, recipes, tech...',
      platformLabel: 'Platform',
      generateBtn: 'Research',
      generating: 'Researching...',
      highVolume: 'High Volume',
      mediumVolume: 'Medium Volume',
      lowVolume: 'Low Volume',
      trending: 'Trending',
      copyAll: 'Copy All',
      copied: 'Copied!'
    },
    ru: { title: 'Hashtag Research', icon: '#️⃣', credits: '3 Кредита', back: '← Назад', testMode: '🧪 Тест режим', purpose: 'Что делает?', purposeDesc: 'Предлагает хештеги для вашей ниши', howTo: 'Как использовать?', howToSteps: ['Введите тему', 'Выберите платформу', 'Нажмите кнопку'], topicLabel: 'Тема', topicPlaceholder: 'напр: фитнес, еда...', platformLabel: 'Платформа', generateBtn: 'Исследовать', generating: 'Исследуем...', highVolume: 'Высокий', mediumVolume: 'Средний', lowVolume: 'Низкий', trending: 'Тренд', copyAll: 'Копировать', copied: 'Скопировано!' },
    de: { title: 'Hashtag Research', icon: '#️⃣', credits: '3 Credits', back: '← Zurück', testMode: '🧪 Testmodus', purpose: 'Was macht es?', purposeDesc: 'Bietet Hashtag-Vorschläge für deine Nische', howTo: 'Wie benutzen?', howToSteps: ['Thema eingeben', 'Plattform wählen', 'Klicken'], topicLabel: 'Thema', topicPlaceholder: 'z.B. Fitness, Kochen...', platformLabel: 'Plattform', generateBtn: 'Recherche', generating: 'Recherchiere...', highVolume: 'Hoch', mediumVolume: 'Mittel', lowVolume: 'Niedrig', trending: 'Trend', copyAll: 'Kopieren', copied: 'Kopiert!' },
    fr: { title: 'Hashtag Research', icon: '#️⃣', credits: '3 Crédits', back: '← Retour', testMode: '🧪 Mode Test', purpose: 'Que fait-il?', purposeDesc: 'Propose des hashtags pour votre niche', howTo: 'Comment utiliser?', howToSteps: ['Entrez le sujet', 'Sélectionnez la plateforme', 'Cliquez'], topicLabel: 'Sujet', topicPlaceholder: 'ex: fitness, cuisine...', platformLabel: 'Plateforme', generateBtn: 'Rechercher', generating: 'Recherche...', highVolume: 'Élevé', mediumVolume: 'Moyen', lowVolume: 'Faible', trending: 'Tendance', copyAll: 'Copier', copied: 'Copié!' }
  }
  return data[lang] || data.en
}

export default function HashtagResearchPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = getTexts(language)

  useEffect(() => { checkUser() }, [])
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)
  }

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Topic required'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/hashtag-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, userId: user?.id, language })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.result)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleCopyAll = () => {
    if (result?.hashtags) {
      navigator.clipboard.writeText(result.hashtags.map((h: any) => h.tag).join(' '))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <h1 className="text-xl font-bold">{t.title}</h1>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">{t.credits}</span>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/80 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition border border-gray-700">
                <span>🌐</span><span>{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {['en', 'tr', 'ru', 'de', 'fr'].map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition ${language === lang ? 'text-purple-400' : 'text-gray-300'}`}>
                    {lang === 'en' && '🇺🇸 English'}{lang === 'tr' && '🇹🇷 Türkçe'}{lang === 'ru' && '🇷🇺 Русский'}{lang === 'de' && '🇩🇪 Deutsch'}{lang === 'fr' && '🇫🇷 Français'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="fixed top-16 left-0 right-0 z-40 bg-green-500/10 border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-4 py-2 text-center text-green-400 text-sm">{t.testMode}</div>
      </div>

      <main className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-2">{t.purpose}</h2>
                <p className="text-gray-400 text-sm mb-4">{t.purposeDesc}</p>
                <h3 className="text-md font-semibold text-white mb-2">{t.howTo}</h3>
                <ol className="text-gray-500 text-sm space-y-1 list-decimal list-inside">
                  {t.howToSteps.map((step: string, i: number) => <li key={i}>{step}</li>)}
                </ol>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                  <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
                <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                  {loading ? t.generating : `${t.icon} ${t.generateBtn}`}
                </button>
              </div>
            </div>

            <div>
              {result ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Hashtags</h3>
                    <button onClick={handleCopyAll} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition">
                      {copied ? t.copied : t.copyAll}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {result.hashtags?.map((h: any, i: number) => (
                      <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <span className="text-purple-400 font-medium">{h.tag}</span>
                          {h.trending && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{t.trending}</span>}
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded ${h.volume === 'high' ? 'bg-green-500/20 text-green-400' : h.volume === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {h.volume === 'high' ? t.highVolume : h.volume === 'medium' ? t.mediumVolume : t.lowVolume}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {result.tips && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <h4 className="text-purple-400 font-medium mb-2">💡 Tips</h4>
                      <p className="text-gray-300 text-sm">{result.tips}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4">{t.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t.title}</h3>
                  <p className="text-gray-500">{t.purposeDesc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
