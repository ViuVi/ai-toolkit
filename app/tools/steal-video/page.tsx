'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', videoLabel: 'Viral Video Açıklaması', videoPlaceholder: 'Viral videonun içeriğini, hook\'unu ve yapısını açıkla...', platformLabel: 'Platform', nicheLabel: 'Senin Nişin', nichePlaceholder: 'örn: kişisel finans, yemek...', btn: 'Videoyu Analiz Et', loading: 'Analiz ediliyor...', copy: 'Kopyala', copied: '✓', analysis: 'Orijinal Analiz', hooks: 'Yeni Hook\'lar', script: 'Yeni Script', shots: 'Shot List', caption: 'Caption', download: 'İndir', newAnalysis: 'Yeni Analiz' },
  en: { back: 'Dashboard', videoLabel: 'Viral Video Description', videoPlaceholder: 'Describe the viral video content, hook and structure...', platformLabel: 'Platform', nicheLabel: 'Your Niche', nichePlaceholder: 'e.g., finance, food...', btn: 'Analyze Video', loading: 'Analyzing...', copy: 'Copy', copied: '✓', analysis: 'Original Analysis', hooks: 'New Hooks', script: 'New Script', shots: 'Shot List', caption: 'Caption', download: 'Download', newAnalysis: 'New Analysis' },
  ru: { back: 'Панель', videoLabel: 'Описание видео', videoPlaceholder: 'Опишите видео...', platformLabel: 'Платформа', nicheLabel: 'Ваша ниша', nichePlaceholder: 'напр: финансы...', btn: 'Анализ', loading: 'Анализ...', copy: 'Копировать', copied: '✓', analysis: 'Анализ', hooks: 'Хуки', script: 'Скрипт', shots: 'Кадры', caption: 'Подпись', download: 'Скачать', newAnalysis: 'Новый' },
  de: { back: 'Dashboard', videoLabel: 'Video Beschreibung', videoPlaceholder: 'Video beschreiben...', platformLabel: 'Plattform', nicheLabel: 'Deine Nische', nichePlaceholder: 'z.B. Finanzen...', btn: 'Analysieren', loading: 'Analyse...', copy: 'Kopieren', copied: '✓', analysis: 'Analyse', hooks: 'Hooks', script: 'Skript', shots: 'Shots', caption: 'Caption', download: 'Download', newAnalysis: 'Neu' },
  fr: { back: 'Tableau', videoLabel: 'Description vidéo', videoPlaceholder: 'Décrivez la vidéo...', platformLabel: 'Plateforme', nicheLabel: 'Votre niche', nichePlaceholder: 'ex: finance...', btn: 'Analyser', loading: 'Analyse...', copy: 'Copier', copied: '✓', analysis: 'Analyse', hooks: 'Hooks', script: 'Script', shots: 'Plans', caption: 'Légende', download: 'Télécharger', newAnalysis: 'Nouveau' }
}

export default function StealVideoPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [videoDescription, setVideoDescription] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [yourNiche, setYourNiche] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('script')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else {
        setUser(user)
        supabase.from('credits').select('balance').eq('user_id', user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [])

  const handleSubmit = async () => {
    if (!videoDescription.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/steal-video', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoDescription, platform, yourNiche, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        // if (credits >= X) {
          // await supabase.from("credits").update({ balance: credits - 8 }).eq('user_id', user.id)
          // setCredits(prev => prev - X)
        // }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const tabs = [
    { id: 'script', label: '📝 Script', icon: '📝' },
    { id: 'shots', label: '🎥 Shots', icon: '🎥' },
    { id: 'caption', label: '✍️ Caption', icon: '✍️' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">🎯</span><h1 className="font-semibold">Steal This Video</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg"><span className="text-purple-400 text-sm">✦</span><span className="font-medium">{credits}</span></div>
            <div className="relative group">
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.videoLabel}</label>
                <textarea value={videoDescription} onChange={e => setVideoDescription(e.target.value)} placeholder={t.videoPlaceholder} className="w-full h-36 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Instagram Reels</option>
                    <option value="shorts">YouTube Shorts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                  <input type="text" value={yourNiche} onChange={e => setYourNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !videoDescription.trim() || credits < 8} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 8 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Analysis */}
            {result.original_analysis && (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-purple-400 font-semibold">🔍 {t.analysis}</h3>
                  <span className="text-2xl font-bold text-white">{result.original_analysis.virality_score}/100</span>
                </div>
                <p className="text-gray-300 mb-3">{result.original_analysis.why_viral}</p>
                <div className="flex flex-wrap gap-2">
                  {result.original_analysis.emotional_triggers?.map((t: string, i: number) => <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">{t}</span>)}
                </div>
              </div>
            )}

            {/* New Hooks */}
            {result.rewritten_hooks?.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-red-400 font-semibold mb-3">🎣 {t.hooks}</h3>
                <div className="space-y-2">
                  {result.rewritten_hooks.map((h: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                      <p className="text-white">"{h.hook}"</p>
                      <button onClick={() => copyText(`hook-${i}`, h.hook)} className="text-xs text-red-400 ml-2">{copiedKey === `hook-${i}` ? t.copied : t.copy}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/5 pb-3">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{tab.label}</button>
              ))}
            </div>

            {/* Script Tab */}
            {activeTab === 'script' && result.new_script && (
              <div className="space-y-3">
                {['hook', 'problem', 'buildup', 'solution', 'cta'].map(section => result.new_script[section] && (
                  <div key={section} className={`rounded-xl p-4 border ${section === 'hook' ? 'bg-red-500/5 border-red-500/20' : section === 'cta' ? 'bg-green-500/5 border-green-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase text-gray-400 font-semibold">{section}</span>
                      <button onClick={() => copyText(section, result.new_script[section].text)} className="text-xs text-purple-400">{copiedKey === section ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-white">{result.new_script[section].text}</p>
                    {result.new_script[section].visual && <p className="text-gray-500 text-sm mt-2">🎥 {result.new_script[section].visual}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Shots Tab */}
            {activeTab === 'shots' && result.shot_list && (
              <div className="space-y-3">
                {result.shot_list.map((shot: any, i: number) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">{shot.shot_number}</span>
                      <span className="text-gray-400 text-sm">{shot.duration}</span>
                    </div>
                    <p className="text-white mb-2">{shot.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📷 {shot.camera_angle}</span>
                      {shot.text_overlay && <span>📝 {shot.text_overlay}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Caption Tab */}
            {activeTab === 'caption' && (
              <div className="space-y-4">
                {result.caption && (
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Caption</h3>
                      <button onClick={() => copyText('caption', result.caption.main)} className="text-xs text-purple-400">{copiedKey === 'caption' ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{result.caption.main}</p>
                  </div>
                )}
                {result.hashtags && (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                    <h4 className="text-blue-400 font-semibold mb-3">🏷️ Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.primary?.map((h: string, i: number) => <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm">{h}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newAnalysis}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
