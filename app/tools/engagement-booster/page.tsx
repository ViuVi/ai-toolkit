'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Engagement Booster', icon: '🚀', credits: '4 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'İçeriğiniz için hook, CTA ve yorum çekici sorular üretir.', contentLabel: 'İçerik', contentPlaceholder: 'Caption veya içerik metnini yapıştır...', nicheLabel: 'Niş', nichePlaceholder: 'örn: fitness, moda...', platformLabel: 'Platform', btn: 'Boost Et', loading: 'Üretiliyor...', copy: 'Kopyala', copied: '✓' },
  en: { title: 'Engagement Booster', icon: '🚀', credits: '4 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Creates hooks, CTAs and engagement questions for your content.', contentLabel: 'Content', contentPlaceholder: 'Paste your caption or content...', nicheLabel: 'Niche', nichePlaceholder: 'e.g., fitness, fashion...', platformLabel: 'Platform', btn: 'Boost', loading: 'Creating...', copy: 'Copy', copied: '✓' },
  ru: { title: 'Engagement Booster', icon: '🚀', credits: '4', back: '← Назад', testMode: '🧪 Тест', purpose: 'Создаёт хуки и вопросы.', contentLabel: 'Контент', contentPlaceholder: 'Вставьте текст...', nicheLabel: 'Ниша', nichePlaceholder: 'напр: фитнес...', platformLabel: 'Платформа', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓' },
  de: { title: 'Engagement Booster', icon: '🚀', credits: '4', back: '← Zurück', testMode: '🧪 Test', purpose: 'Erstellt Hooks und Fragen.', contentLabel: 'Inhalt', contentPlaceholder: 'Text einfügen...', nicheLabel: 'Nische', nichePlaceholder: 'z.B. Fitness...', platformLabel: 'Plattform', btn: 'Erstellen', loading: 'Erstelle...', copy: 'Kopieren', copied: '✓' },
  fr: { title: 'Engagement Booster', icon: '🚀', credits: '4', back: '← Retour', testMode: '🧪 Test', purpose: 'Crée des hooks et questions.', contentLabel: 'Contenu', contentPlaceholder: 'Collez le texte...', nicheLabel: 'Niche', nichePlaceholder: 'ex: fitness...', platformLabel: 'Plateforme', btn: 'Créer', loading: 'Création...', copy: 'Copier', copied: '✓' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [content, setContent] = useState('')
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/engagement-booster', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, niche, platform, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500) }

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
              <div><label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label><textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label><input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white placeholder-gray-500" /></div>
                <div><label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label><select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white"><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="twitter">Twitter</option><option value="linkedin">LinkedIn</option></select></div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result ? (
              <>
                {/* Hooks */}
                {result.hooks && result.hooks.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <h3 className="text-red-400 font-semibold mb-3">🎣 Hook Önerileri</h3>
                    <div className="space-y-2">
                      {result.hooks.map((h: any, i: number) => (
                        <div key={i} className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-gray-500">{h.type}</span>
                            <button onClick={() => copyText(`hook-${i}`, h.hook)} className="text-xs text-purple-400">{copiedKey === `hook-${i}` ? t.copied : t.copy}</button>
                          </div>
                          <p className="text-white text-sm mt-1">{h.hook}</p>
                          {h.why_works && <p className="text-gray-500 text-xs mt-1">💡 {h.why_works}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* CTAs */}
                {result.ctas && result.ctas.length > 0 && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <h3 className="text-green-400 font-semibold mb-3">📢 CTA Önerileri</h3>
                    <div className="space-y-2">
                      {result.ctas.map((c: any, i: number) => (
                        <div key={i} className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-gray-500">{c.type}</span>
                            <button onClick={() => copyText(`cta-${i}`, c.cta)} className="text-xs text-purple-400">{copiedKey === `cta-${i}` ? t.copied : t.copy}</button>
                          </div>
                          <p className="text-white text-sm mt-1">{c.cta}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Sorular */}
                {result.questions && result.questions.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h3 className="text-yellow-400 font-semibold mb-3">❓ Yorum Çekici Sorular</h3>
                    <div className="space-y-2">
                      {result.questions.map((q: any, i: number) => (
                        <div key={i} className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <span className="text-xs text-gray-500">{q.type}</span>
                            <button onClick={() => copyText(`q-${i}`, q.question)} className="text-xs text-purple-400">{copiedKey === `q-${i}` ? t.copied : t.copy}</button>
                          </div>
                          <p className="text-white text-sm mt-1">{q.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Comment Bait */}
                {result.comment_bait && result.comment_bait.length > 0 && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <h3 className="text-purple-400 font-semibold mb-3">💬 Yorum Tuzakları</h3>
                    <div className="space-y-2">
                      {result.comment_bait.map((cb: any, i: number) => (
                        <div key={i} className="bg-gray-900/50 rounded-lg p-3">
                          <p className="text-white text-sm">{cb.example}</p>
                          <p className="text-gray-500 text-xs mt-1">Teknik: {cb.technique}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* İyileştirilmiş Caption */}
                {result.caption_rewrite && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-blue-400 font-semibold">✨ İyileştirilmiş Caption</h3>
                      <button onClick={() => copyText('improved', result.caption_rewrite.improved_version)} className="text-xs text-blue-400">{copiedKey === 'improved' ? t.copied : t.copy}</button>
                    </div>
                    {result.caption_rewrite.original_issue && <p className="text-red-400 text-xs mb-2">⚠️ {result.caption_rewrite.original_issue}</p>}
                    <p className="text-white text-sm whitespace-pre-wrap">{result.caption_rewrite.improved_version}</p>
                  </div>
                )}
                
                {/* Hashtag Stratejisi */}
                {result.hashtag_strategy && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">🏷️ Hashtag Stratejisi</h3>
                    {result.hashtag_strategy.engagement_hashtags && (
                      <div className="flex flex-wrap gap-1">
                        {result.hashtag_strategy.engagement_hashtags.map((h: string, i: number) => <span key={i} className="text-blue-400 text-xs">{h}</span>)}
                      </div>
                    )}
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
