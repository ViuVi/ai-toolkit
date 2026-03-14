'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Engagement Booster', icon: '💬', credits: '5 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Yorum ve etkileşimleri artıracak CTA\'lar, sorular ve hook\'lar üretir. Post\'larına ekleyerek engagement\'ı artır.', contentLabel: 'Post İçeriği', contentPlaceholder: 'Post\'unun içeriğini yapıştır...', nicheLabel: 'Niş', nichePlaceholder: 'örn: fitness, yemek...', btn: 'CTA\'lar Üret', loading: 'Üretiliyor...' },
  en: { title: 'Engagement Booster', icon: '💬', credits: '5 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Generates CTAs, questions and hooks to boost comments and engagement. Add to your posts to increase interaction.', contentLabel: 'Post Content', contentPlaceholder: 'Paste your post content...', nicheLabel: 'Niche', nichePlaceholder: 'e.g., fitness, food...', btn: 'Generate CTAs', loading: 'Generating...' },
  ru: { title: 'Engagement Booster', icon: '💬', credits: '5', back: '← Назад', testMode: '🧪 Тест', purpose: 'Генерирует CTA для увеличения вовлечённости.', contentLabel: 'Контент', contentPlaceholder: 'Вставьте контент...', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', btn: 'Создать', loading: 'Создание...' },
  de: { title: 'Engagement Booster', icon: '💬', credits: '5', back: '← Zurück', testMode: '🧪 Test', purpose: 'Generiert CTAs für mehr Engagement.', contentLabel: 'Inhalt', contentPlaceholder: 'Inhalt einfügen...', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', btn: 'Erstellen', loading: 'Erstelle...' },
  fr: { title: 'Engagement Booster', icon: '💬', credits: '5', back: '← Retour', testMode: '🧪 Test', purpose: 'Génère des CTAs pour plus d\'engagement.', contentLabel: 'Contenu', contentPlaceholder: 'Collez le contenu...', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', btn: 'Créer', loading: 'Création...' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [content, setContent] = useState('')
  const [niche, setNiche] = useState('')
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
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/engagement-booster', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, niche, userId: user?.id, language })
      })
      const data = await res.json()
      if (res.ok) setResult(data.result)
    } catch (e) {}
    setLoading(false)
  }

  const copyText = (text: string) => navigator.clipboard.writeText(text)

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
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          <div>
            {result ? (
              <div className="space-y-4">
                {result.ctas && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <h4 className="text-purple-400 font-medium mb-3">🎯 CTAs</h4>
                    <div className="space-y-2">
                      {result.ctas.map((cta: string, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg">
                          <span className="text-sm text-white">{cta}</span>
                          <button onClick={() => copyText(cta)} className="text-xs text-purple-400 hover:text-purple-300">Copy</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {result.questions && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h4 className="text-yellow-400 font-medium mb-3">❓ Questions</h4>
                    <div className="space-y-2">
                      {result.questions.map((q: string, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg">
                          <span className="text-sm text-white">{q}</span>
                          <button onClick={() => copyText(q)} className="text-xs text-yellow-400 hover:text-yellow-300">Copy</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {result.hooks && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <h4 className="text-green-400 font-medium mb-3">🎣 Hooks</h4>
                    <div className="space-y-2">
                      {result.hooks.map((h: string, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-lg">
                          <span className="text-sm text-white">{h}</span>
                          <button onClick={() => copyText(h)} className="text-xs text-green-400 hover:text-green-300">Copy</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
