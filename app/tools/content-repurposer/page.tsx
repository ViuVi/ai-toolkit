'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const getTexts = (lang: string) => {
  const data: any = {
    tr: {
      title: 'Content Repurposer',
      icon: '🔄',
      credits: '8 Kredi',
      back: '← Dashboard\'a Dön',
      testMode: '🧪 Test Modu - Kredi düşmüyor',
      purpose: 'Bu araç ne işe yarar?',
      purposeDesc: 'Tek bir içeriği 7 farklı sosyal medya platformuna (Instagram, TikTok, Twitter, LinkedIn, YouTube, Facebook, Pinterest) otomatik olarak uyarlar.',
      howTo: 'Nasıl kullanılır?',
      howToSteps: ['Orijinal içeriğini yapıştır', 'Hedef platformları seç', '"Dönüştür" butonuna tıkla'],
      contentLabel: 'Orijinal İçerik',
      contentPlaceholder: 'Dönüştürmek istediğin içeriği yapıştır...',
      platformsLabel: 'Hedef Platformlar',
      generateBtn: 'Dönüştür',
      generating: 'Dönüştürülüyor...',
      copyAll: 'Tümünü Kopyala',
      copied: 'Kopyalandı!'
    },
    en: {
      title: 'Content Repurposer',
      icon: '🔄',
      credits: '8 Credits',
      back: '← Back to Dashboard',
      testMode: '🧪 Test Mode - No credits deducted',
      purpose: 'What does this tool do?',
      purposeDesc: 'Automatically adapts a single piece of content to 7 different social media platforms (Instagram, TikTok, Twitter, LinkedIn, YouTube, Facebook, Pinterest).',
      howTo: 'How to use?',
      howToSteps: ['Paste your original content', 'Select target platforms', 'Click "Repurpose"'],
      contentLabel: 'Original Content',
      contentPlaceholder: 'Paste the content you want to repurpose...',
      platformsLabel: 'Target Platforms',
      generateBtn: 'Repurpose',
      generating: 'Repurposing...',
      copyAll: 'Copy All',
      copied: 'Copied!'
    },
    ru: { title: 'Content Repurposer', icon: '🔄', credits: '8 Кредитов', back: '← Назад', testMode: '🧪 Тест режим', purpose: 'Что делает?', purposeDesc: 'Адаптирует контент для 7 платформ', howTo: 'Как использовать?', howToSteps: ['Вставьте контент', 'Выберите платформы', 'Нажмите кнопку'], contentLabel: 'Контент', contentPlaceholder: 'Вставьте контент...', platformsLabel: 'Платформы', generateBtn: 'Создать', generating: 'Создаём...', copyAll: 'Копировать', copied: 'Скопировано!' },
    de: { title: 'Content Repurposer', icon: '🔄', credits: '8 Credits', back: '← Zurück', testMode: '🧪 Testmodus', purpose: 'Was macht es?', purposeDesc: 'Passt Inhalte für 7 Plattformen an', howTo: 'Wie benutzen?', howToSteps: ['Inhalt einfügen', 'Plattformen wählen', 'Klicken'], contentLabel: 'Inhalt', contentPlaceholder: 'Inhalt einfügen...', platformsLabel: 'Plattformen', generateBtn: 'Erstellen', generating: 'Erstelle...', copyAll: 'Kopieren', copied: 'Kopiert!' },
    fr: { title: 'Content Repurposer', icon: '🔄', credits: '8 Crédits', back: '← Retour', testMode: '🧪 Mode Test', purpose: 'Que fait-il?', purposeDesc: 'Adapte le contenu pour 7 plateformes', howTo: 'Comment utiliser?', howToSteps: ['Collez le contenu', 'Sélectionnez les plateformes', 'Cliquez'], contentLabel: 'Contenu', contentPlaceholder: 'Collez le contenu...', platformsLabel: 'Plateformes', generateBtn: 'Créer', generating: 'Création...', copyAll: 'Copier', copied: 'Copié!' }
  }
  return data[lang] || data.en
}

const platforms = ['Instagram', 'TikTok', 'Twitter/X', 'LinkedIn', 'YouTube', 'Facebook', 'Pinterest']

export default function ContentRepurposerPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram', 'TikTok', 'Twitter/X'])
  
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = getTexts(language)

  useEffect(() => { checkUser() }, [])
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    setUser(user)
  }

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const handleGenerate = async () => {
    if (!content.trim()) { setError('Content required'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/content-repurposer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platforms: selectedPlatforms, userId: user?.id, language })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.result)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
                  <label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-40 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformsLabel}</label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map(p => (
                      <button key={p} onClick={() => togglePlatform(p)} className={`px-3 py-2 rounded-lg text-sm transition ${selectedPlatforms.includes(p) ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>{p}</button>
                    ))}
                  </div>
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
                  {Object.entries(result).map(([platform, content]: [string, any]) => (
                    <div key={platform} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-white">{platform}</h3>
                        <button onClick={() => handleCopy(content)} className="text-xs text-purple-400 hover:text-purple-300">{copied ? t.copied : 'Copy'}</button>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{content}</p>
                    </div>
                  ))}
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
