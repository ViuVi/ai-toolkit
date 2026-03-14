'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const platforms = ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube', 'Facebook']
const texts: any = {
  tr: { title: 'Content Repurposer', icon: '🔄', credits: '8 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Bir içeriği tüm platformlara uygun formatlara dönüştürür.', contentLabel: 'Orijinal İçerik', contentPlaceholder: 'Dönüştürmek istediğin içeriği yapıştır...', platformsLabel: 'Hedef Platformlar', btn: 'Dönüştür', loading: 'Dönüştürülüyor...', copy: 'Kopyala', copied: '✓' },
  en: { title: 'Content Repurposer', icon: '🔄', credits: '8 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Transforms content for all platforms.', contentLabel: 'Original Content', contentPlaceholder: 'Paste content...', platformsLabel: 'Target Platforms', btn: 'Transform', loading: 'Transforming...', copy: 'Copy', copied: '✓' },
  ru: { title: 'Content Repurposer', icon: '🔄', credits: '8', back: '← Назад', testMode: '🧪 Тест', purpose: 'Преобразует контент.', contentLabel: 'Контент', contentPlaceholder: 'Вставьте...', platformsLabel: 'Платформы', btn: 'Преобразовать', loading: 'Преобразование...', copy: 'Копировать', copied: '✓' },
  de: { title: 'Content Repurposer', icon: '🔄', credits: '8', back: '← Zurück', testMode: '🧪 Test', purpose: 'Transformiert Inhalte.', contentLabel: 'Inhalt', contentPlaceholder: 'Einfügen...', platformsLabel: 'Plattformen', btn: 'Transformieren', loading: 'Transformiere...', copy: 'Kopieren', copied: '✓' },
  fr: { title: 'Content Repurposer', icon: '🔄', credits: '8', back: '← Retour', testMode: '🧪 Test', purpose: 'Transforme le contenu.', contentLabel: 'Contenu', contentPlaceholder: 'Collez...', platformsLabel: 'Plateformes', btn: 'Transformer', loading: 'Transformation...', copy: 'Copier', copied: '✓' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram', 'TikTok', 'Twitter'])
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])
  const togglePlatform = (p: string) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const handleSubmit = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/content-repurposer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, platforms: selectedPlatforms, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyToClipboard = (platform: string, text: string) => { navigator.clipboard.writeText(text); setCopiedPlatform(platform); setTimeout(() => setCopiedPlatform(null), 2000) }
  const getPlatformContent = (platform: string) => {
    const p = result?.platforms?.[platform]
    if (!p) return null
    if (platform === 'Instagram') return p.caption
    if (platform === 'TikTok') return p.script
    if (platform === 'Twitter') return p.tweet
    if (platform === 'LinkedIn') return p.post
    if (platform === 'YouTube') return p.shorts_script
    if (platform === 'Facebook') return p.post
    return JSON.stringify(p)
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
              <div><label className="block text-sm text-gray-400 mb-2">{t.platformsLabel}</label><div className="flex flex-wrap gap-2">{platforms.map(p => <button key={p} onClick={() => togglePlatform(p)} className={`px-3 py-2 rounded-lg text-sm transition ${selectedPlatforms.includes(p) ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}>{p}</button>)}</div></div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result?.platforms ? (
              <>
                {result.original_analysis && <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4"><p className="text-gray-300 text-sm">{result.original_analysis}</p></div>}
                {selectedPlatforms.map(platform => {
                  const pd = result.platforms[platform]
                  if (!pd) return null
                  return (
                    <div key={platform} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-white text-lg">{platform}</h3>
                        <button onClick={() => copyToClipboard(platform, getPlatformContent(platform) || '')} className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg">{copiedPlatform === platform ? t.copied : t.copy}</button>
                      </div>
                      {platform === 'Instagram' && <><p className="text-gray-300 text-sm">{pd.caption}</p>{pd.hashtags && <div className="flex flex-wrap gap-1 mt-2">{pd.hashtags.slice(0,10).map((h:string,i:number) => <span key={i} className="text-xs text-blue-400">{h}</span>)}</div>}</>}
                      {platform === 'TikTok' && <><p className="text-white text-sm font-medium mb-1">{pd.hook}</p><p className="text-gray-300 text-sm">{pd.script}</p></>}
                      {platform === 'Twitter' && <><p className="text-gray-300 text-sm">{pd.tweet}</p>{pd.thread && <div className="border-t border-gray-700 pt-2 mt-2"><span className="text-purple-400 text-xs">🧵 Thread:</span>{pd.thread.map((tw:string,i:number) => <p key={i} className="text-gray-400 text-sm mt-1 pl-3 border-l-2 border-gray-600">{i+1}. {tw}</p>)}</div>}</>}
                      {platform === 'LinkedIn' && <p className="text-gray-300 text-sm whitespace-pre-wrap">{pd.post}</p>}
                      {platform === 'YouTube' && <p className="text-gray-300 text-sm">{pd.shorts_script}</p>}
                      {platform === 'Facebook' && <p className="text-gray-300 text-sm">{pd.post}</p>}
                    </div>
                  )
                })}
              </>
            ) : <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-12 text-center"><div className="text-6xl mb-4">{t.icon}</div><p className="text-gray-500">{t.purpose}</p></div>}
          </div>
        </div>
      </main>
    </div>
  )
}
