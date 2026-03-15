'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Steal This Video', icon: '🎬', credits: '8 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Viral videoları reverse engineer yaparak kendi nişine uygun yeni içerik oluştur.', videoLabel: 'Viral Video Açıklaması', videoPlaceholder: 'Viral videonun içeriğini, hook\'unu ve yapısını açıkla...\n\nÖrnek: "Bir fitness influencer\'ı, \'Herkes bu hareketi yanlış yapıyor\' diyerek başlıyor, yanlış squat formunu gösteriyor, sonra doğrusunu anlatıyor. 2M izlenme almış."', platformLabel: 'Platform', nicheLabel: 'Senin Nişin', nichePlaceholder: 'örn: kişisel finans, yemek, teknoloji...', btn: 'Videoyu Çal 🎯', loading: 'Analiz ediliyor...', copy: 'Kopyala', copied: '✓', analysis: '🔍 Orijinal Analiz', hooks: '🎣 Yeni Hook\'lar', script: '📝 Yeni Script', caption: '✍️ Caption', hashtags: '#️⃣ Hashtags', shots: '🎥 Shot List', tips: '💡 İpuçları', download: '📥 İndir' },
  en: { title: 'Steal This Video', icon: '🎬', credits: '8 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Reverse engineer viral videos and create new content for your niche.', videoLabel: 'Viral Video Description', videoPlaceholder: 'Describe the viral video content, hook and structure...', platformLabel: 'Platform', nicheLabel: 'Your Niche', nichePlaceholder: 'e.g., finance, food, tech...', btn: 'Steal Video 🎯', loading: 'Analyzing...', copy: 'Copy', copied: '✓', analysis: '🔍 Original Analysis', hooks: '🎣 New Hooks', script: '📝 New Script', caption: '✍️ Caption', hashtags: '#️⃣ Hashtags', shots: '🎥 Shot List', tips: '💡 Tips', download: '📥 Download' },
  ru: { title: 'Steal This Video', icon: '🎬', credits: '8', back: '← Назад', testMode: '🧪 Тест', purpose: 'Анализируй вирусные видео.', videoLabel: 'Описание видео', videoPlaceholder: 'Опишите видео...', platformLabel: 'Платформа', nicheLabel: 'Ваша ниша', nichePlaceholder: 'напр: финансы...', btn: 'Анализ 🎯', loading: 'Анализ...', copy: 'Копировать', copied: '✓', analysis: '🔍 Анализ', hooks: '🎣 Хуки', script: '📝 Скрипт', caption: '✍️ Подпись', hashtags: '#️⃣ Хештеги', shots: '🎥 Кадры', tips: '💡 Советы', download: '📥 Скачать' },
  de: { title: 'Steal This Video', icon: '🎬', credits: '8', back: '← Zurück', testMode: '🧪 Test', purpose: 'Virale Videos analysieren.', videoLabel: 'Video Beschreibung', videoPlaceholder: 'Video beschreiben...', platformLabel: 'Plattform', nicheLabel: 'Deine Nische', nichePlaceholder: 'z.B. Finanzen...', btn: 'Analysieren 🎯', loading: 'Analyse...', copy: 'Kopieren', copied: '✓', analysis: '🔍 Analyse', hooks: '🎣 Hooks', script: '📝 Skript', caption: '✍️ Caption', hashtags: '#️⃣ Hashtags', shots: '🎥 Shots', tips: '💡 Tipps', download: '📥 Download' },
  fr: { title: 'Steal This Video', icon: '🎬', credits: '8', back: '← Retour', testMode: '🧪 Test', purpose: 'Analyser les vidéos virales.', videoLabel: 'Description vidéo', videoPlaceholder: 'Décrivez la vidéo...', platformLabel: 'Plateforme', nicheLabel: 'Votre niche', nichePlaceholder: 'ex: finance...', btn: 'Analyser 🎯', loading: 'Analyse...', copy: 'Copier', copied: '✓', analysis: '🔍 Analyse', hooks: '🎣 Hooks', script: '📝 Script', caption: '✍️ Légende', hashtags: '#️⃣ Hashtags', shots: '🎥 Plans', tips: '💡 Conseils', download: '📥 Télécharger' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
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

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!videoDescription.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/steal-video', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoDescription, platform, yourNiche, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const downloadAll = () => {
    if (!result) return
    let txt = `🎬 STEAL THIS VIDEO - SONUÇLAR\n${'═'.repeat(50)}\n\n`
    
    if (result.original_analysis) {
      txt += `📊 ORİJİNAL ANALİZ\n${'─'.repeat(40)}\n`
      txt += `Neden Viral: ${result.original_analysis.why_viral}\n`
      txt += `Hook Tipi: ${result.original_analysis.hook_type}\n`
      txt += `Yapı: ${result.original_analysis.content_structure}\n\n`
    }
    
    if (result.rewritten_hooks) {
      txt += `🎣 YENİ HOOK'LAR\n${'─'.repeat(40)}\n`
      result.rewritten_hooks.forEach((h: any, i: number) => {
        txt += `${i+1}. ${h.hook}\n   Stil: ${h.style}\n\n`
      })
    }
    
    if (result.new_script) {
      txt += `📝 YENİ SCRİPT\n${'─'.repeat(40)}\n`
      txt += `HOOK: ${result.new_script.hook?.text}\n`
      txt += `PROBLEM: ${result.new_script.problem?.text}\n`
      txt += `BUILD-UP: ${result.new_script.buildup?.text}\n`
      txt += `SOLUTION: ${result.new_script.solution?.text}\n`
      txt += `CTA: ${result.new_script.cta?.text}\n\n`
      if (result.new_script.full_script) {
        txt += `TAM SCRİPT:\n${result.new_script.full_script}\n\n`
      }
    }
    
    if (result.caption) {
      txt += `✍️ CAPTION\n${'─'.repeat(40)}\n${result.caption.main}\n\n`
    }
    
    if (result.hashtags) {
      txt += `#️⃣ HASHTAGS\n${'─'.repeat(40)}\n`
      txt += `Ana: ${result.hashtags.primary?.join(' ')}\n`
      txt += `İkincil: ${result.hashtags.secondary?.join(' ')}\n\n`
    }
    
    if (result.shot_list) {
      txt += `🎥 SHOT LIST\n${'─'.repeat(40)}\n`
      result.shot_list.forEach((shot: any) => {
        txt += `Shot ${shot.shot_number} (${shot.duration}): ${shot.description}\n`
        txt += `   Kamera: ${shot.camera_angle}\n`
        if (shot.text_overlay) txt += `   Yazı: ${shot.text_overlay}\n`
        txt += `\n`
      })
    }
    
    txt += `\n${'═'.repeat(50)}\nMediaToolkit.site ile oluşturuldu\n`
    
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `steal-video-${new Date().toISOString().split('T')[0]}.txt`
    link.click()
  }

  const tabs = [
    { id: 'script', label: t.script },
    { id: 'shots', label: t.shots },
    { id: 'caption', label: t.caption },
  ]

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
        {!result ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
              <p className="text-gray-300">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.videoLabel}</label>
                <textarea value={videoDescription} onChange={e => setVideoDescription(e.target.value)} placeholder={t.videoPlaceholder} className="w-full h-40 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white">
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Instagram Reels</option>
                    <option value="shorts">YouTube Shorts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.nicheLabel}</label>
                  <input type="text" value={yourNiche} onChange={e => setYourNiche(e.target.value)} placeholder={t.nichePlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500" />
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 text-lg">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* İndir Butonu */}
            <div className="flex justify-end">
              <button onClick={downloadAll} className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-500 flex items-center gap-2">{t.download}</button>
            </div>
            
            {/* Orijinal Analiz */}
            {result.original_analysis && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5">
                <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">{t.analysis} <span className="text-2xl font-bold text-white ml-auto">{result.original_analysis.virality_score}/100</span></h3>
                <p className="text-white mb-3">{result.original_analysis.why_viral}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-900/50 rounded-lg p-2"><span className="text-gray-500">Hook Tipi:</span><p className="text-gray-300">{result.original_analysis.hook_type}</p></div>
                  <div className="bg-gray-900/50 rounded-lg p-2"><span className="text-gray-500">Yapı:</span><p className="text-gray-300">{result.original_analysis.content_structure}</p></div>
                </div>
                {result.original_analysis.emotional_triggers && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.original_analysis.emotional_triggers.map((t: string, i: number) => <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">{t}</span>)}
                  </div>
                )}
              </div>
            )}
            
            {/* Yeni Hook'lar */}
            {result.rewritten_hooks && result.rewritten_hooks.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                <h3 className="text-red-400 font-semibold mb-3">{t.hooks}</h3>
                <div className="space-y-2">
                  {result.rewritten_hooks.map((h: any, i: number) => (
                    <div key={i} className="bg-gray-900/50 rounded-xl p-3 flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">"{h.hook}"</p>
                        <p className="text-gray-500 text-xs mt-1">{h.style} • {h.why_works}</p>
                      </div>
                      <button onClick={() => copyText(`hook-${i}`, h.hook)} className="text-xs text-purple-400">{copiedKey === `hook-${i}` ? t.copied : t.copy}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-gray-700 pb-2">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{tab.label}</button>
              ))}
            </div>
            
            {/* Script Tab */}
            {activeTab === 'script' && result.new_script && (
              <div className="space-y-3">
                {['hook', 'problem', 'buildup', 'solution', 'cta'].map(section => result.new_script[section] && (
                  <div key={section} className={`rounded-xl p-4 border ${section === 'hook' ? 'bg-red-500/10 border-red-500/30' : section === 'cta' ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase text-gray-400">{section}</span>
                      <button onClick={() => copyText(section, result.new_script[section].text)} className="text-xs text-purple-400">{copiedKey === section ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-white">{result.new_script[section].text}</p>
                    {result.new_script[section].visual && <p className="text-gray-500 text-sm mt-1">🎥 {result.new_script[section].visual}</p>}
                  </div>
                ))}
                {result.new_script.full_script && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-400 font-semibold">📋 Tam Script</span>
                      <button onClick={() => copyText('full', result.new_script.full_script)} className="text-xs text-blue-400">{copiedKey === 'full' ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{result.new_script.full_script}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Shots Tab */}
            {activeTab === 'shots' && result.shot_list && (
              <div className="space-y-3">
                {result.shot_list.map((shot: any, i: number) => (
                  <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">{shot.shot_number}</span>
                      <span className="text-gray-400 text-sm">{shot.duration}</span>
                    </div>
                    <p className="text-white mb-2">{shot.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">📷</span> <span className="text-gray-300">{shot.camera_angle}</span></div>
                      {shot.text_overlay && <div><span className="text-gray-500">📝</span> <span className="text-gray-300">{shot.text_overlay}</span></div>}
                      {shot.audio_note && <div><span className="text-gray-500">🔊</span> <span className="text-gray-300">{shot.audio_note}</span></div>}
                    </div>
                  </div>
                ))}
                {result.filming_tips && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">🎬 Çekim İpuçları</h4>
                    <ul className="space-y-1">{result.filming_tips.map((tip: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {tip}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Caption Tab */}
            {activeTab === 'caption' && (
              <div className="space-y-4">
                {result.caption && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">{t.caption}</span>
                      <button onClick={() => copyText('caption', result.caption.main)} className="text-xs text-purple-400">{copiedKey === 'caption' ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{result.caption.main}</p>
                  </div>
                )}
                {result.hashtags && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">{t.hashtags}</h4>
                    <div className="space-y-2">
                      <div><span className="text-xs text-gray-500">Ana:</span><div className="flex flex-wrap gap-1 mt-1">{result.hashtags.primary?.map((h: string, i: number) => <span key={i} className="text-blue-300 text-sm">{h}</span>)}</div></div>
                      <div><span className="text-xs text-gray-500">İkincil:</span><div className="flex flex-wrap gap-1 mt-1">{result.hashtags.secondary?.map((h: string, i: number) => <span key={i} className="text-gray-400 text-sm">{h}</span>)}</div></div>
                    </div>
                  </div>
                )}
                {result.posting_strategy && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <h4 className="text-green-400 font-semibold mb-2">📊 Paylaşım Stratejisi</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">⏰ {result.posting_strategy.best_time}</p>
                      <p className="text-gray-300">💬 İlk yorum: {result.posting_strategy.first_comment}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Yeni Analiz */}
            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600">← Yeni Video Analiz Et</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
