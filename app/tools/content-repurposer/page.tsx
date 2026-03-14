'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const platforms = ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube', 'Facebook']

const texts: any = {
  tr: { title: 'Content Repurposer', icon: '🔄', credits: '8 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Bir içeriği tüm platformlara uygun formatlara dönüştürür.', contentLabel: 'Orijinal İçerik', contentPlaceholder: 'Dönüştürmek istediğin içeriği yapıştır...', platformsLabel: 'Hedef Platformlar', btn: 'Dönüştür', loading: 'Dönüştürülüyor...', copy: 'Kopyala', copied: 'Kopyalandı!' },
  en: { title: 'Content Repurposer', icon: '🔄', credits: '8 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Transforms content into formats suitable for all platforms.', contentLabel: 'Original Content', contentPlaceholder: 'Paste the content you want to transform...', platformsLabel: 'Target Platforms', btn: 'Transform', loading: 'Transforming...', copy: 'Copy', copied: 'Copied!' },
  ru: { title: 'Content Repurposer', icon: '🔄', credits: '8', back: '← Назад', testMode: '🧪 Тест', purpose: 'Преобразует контент для всех платформ.', contentLabel: 'Контент', contentPlaceholder: 'Вставьте контент...', platformsLabel: 'Платформы', btn: 'Преобразовать', loading: 'Преобразование...', copy: 'Копировать', copied: 'Скопировано!' },
  de: { title: 'Content Repurposer', icon: '🔄', credits: '8', back: '← Zurück', testMode: '🧪 Test', purpose: 'Transformiert Inhalte für alle Plattformen.', contentLabel: 'Inhalt', contentPlaceholder: 'Inhalt einfügen...', platformsLabel: 'Plattformen', btn: 'Transformieren', loading: 'Transformiere...', copy: 'Kopieren', copied: 'Kopiert!' },
  fr: { title: 'Content Repurposer', icon: '🔄', credits: '8', back: '← Retour', testMode: '🧪 Test', purpose: 'Transforme le contenu pour toutes les plateformes.', contentLabel: 'Contenu', contentPlaceholder: 'Collez le contenu...', platformsLabel: 'Plateformes', btn: 'Transformer', loading: 'Transformation...', copy: 'Copier', copied: 'Copié!' }
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [])

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const handleSubmit = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/content-repurposer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platforms: selectedPlatforms, language })
      })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyToClipboard = (platform: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPlatform(platform)
    setTimeout(() => setCopiedPlatform(null), 2000)
  }

  const getPlatformContent = (platform: string) => {
    if (!result?.platforms?.[platform]) return null
    const p = result.platforms[platform]
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
                <label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-40 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platformsLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map(p => (
                    <button key={p} onClick={() => togglePlatform(p)} className={`px-3 py-2 rounded-lg text-sm transition ${selectedPlatforms.includes(p) ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result?.platforms ? (
              <>
                {result.original_analysis && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-gray-300 text-sm">{result.original_analysis}</p>
                  </div>
                )}
                {selectedPlatforms.map(platform => {
                  const platformData = result.platforms[platform]
                  if (!platformData) return null
                  return (
                    <div key={platform} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-white text-lg">{platform}</h3>
                        <button onClick={() => copyToClipboard(platform, getPlatformContent(platform) || '')} className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg hover:bg-purple-500/30">
                          {copiedPlatform === platform ? t.copied : t.copy}
                        </button>
                      </div>
                      
                      {platform === 'Instagram' && (
                        <div className="space-y-3">
                          <div><span className="text-purple-400 text-xs">Caption:</span><p className="text-gray-300 text-sm mt-1">{platformData.caption}</p></div>
                          {platformData.format_suggestion && <div><span className="text-blue-400 text-xs">Format:</span><p className="text-gray-400 text-sm">{platformData.format_suggestion}</p></div>}
                          {platformData.hashtags && <div className="flex flex-wrap gap-1 mt-2">{platformData.hashtags.slice(0,10).map((h:string,i:number) => <span key={i} className="text-xs text-blue-400">{h}</span>)}</div>}
                        </div>
                      )}
                      
                      {platform === 'TikTok' && (
                        <div className="space-y-3">
                          {platformData.hook && <div><span className="text-red-400 text-xs">🎣 Hook:</span><p className="text-white text-sm mt-1">{platformData.hook}</p></div>}
                          <div><span className="text-purple-400 text-xs">Script:</span><p className="text-gray-300 text-sm mt-1">{platformData.script}</p></div>
                          {platformData.sound_suggestion && <div><span className="text-yellow-400 text-xs">🎵 Ses:</span><p className="text-gray-400 text-sm">{platformData.sound_suggestion}</p></div>}
                        </div>
                      )}
                      
                      {platform === 'Twitter' && (
                        <div className="space-y-3">
                          <div><span className="text-blue-400 text-xs">Tweet:</span><p className="text-gray-300 text-sm mt-1">{platformData.tweet}</p></div>
                          {platformData.thread && platformData.thread.length > 0 && (
                            <div className="border-t border-gray-700 pt-3 mt-3">
                              <span className="text-purple-400 text-xs">🧵 Thread:</span>
                              {platformData.thread.map((tweet:string, i:number) => (
                                <p key={i} className="text-gray-400 text-sm mt-2 pl-3 border-l-2 border-gray-600">{i+1}. {tweet}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {platform === 'LinkedIn' && (
                        <div className="space-y-3">
                          {platformData.hook && <div><span className="text-blue-400 text-xs">Hook:</span><p className="text-white text-sm mt-1">{platformData.hook}</p></div>}
                          <div><span className="text-purple-400 text-xs">Post:</span><p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap">{platformData.post}</p></div>
                        </div>
                      )}
                      
                      {platform === 'YouTube' && (
                        <div className="space-y-3">
                          {platformData.title_suggestion && <div><span className="text-red-400 text-xs">Başlık:</span><p className="text-white text-sm mt-1">{platformData.title_suggestion}</p></div>}
                          <div><span className="text-purple-400 text-xs">Shorts Script:</span><p className="text-gray-300 text-sm mt-1">{platformData.shorts_script}</p></div>
                        </div>
                      )}
                      
                      {platform === 'Facebook' && (
                        <div className="space-y-3">
                          <div><span className="text-blue-400 text-xs">Post:</span><p className="text-gray-300 text-sm mt-1">{platformData.post}</p></div>
                          {platformData.share_hook && <div><span className="text-green-400 text-xs">Paylaşım Hook:</span><p className="text-gray-400 text-sm">{platformData.share_hook}</p></div>}
                        </div>
                      )}
                    </div>
                  )
                })}
                
                {result.cross_platform_strategy && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <span className="text-yellow-400 text-xs font-semibold">📊 Strateji:</span>
                    <p className="text-gray-300 text-sm mt-1">{result.cross_platform_strategy}</p>
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
