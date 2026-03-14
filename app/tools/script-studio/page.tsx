'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Script Studio', icon: '🎬', credits: '6 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'TikTok, Reels ve Shorts için viral video scriptleri oluşturur.', topicLabel: 'Video Konusu', topicPlaceholder: 'örn: 5 dakikada kahvaltı tarifleri...', durationLabel: 'Süre', platformLabel: 'Platform', styleLabel: 'Stil', btn: 'Script Oluştur', loading: 'Yazılıyor...', copy: 'Kopyala', copied: 'Kopyalandı!', fullScript: 'Tam Script', download: '📥 İndir' },
  en: { title: 'Script Studio', icon: '🎬', credits: '6 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Creates viral video scripts for TikTok, Reels and Shorts.', topicLabel: 'Video Topic', topicPlaceholder: 'e.g., 5-minute breakfast recipes...', durationLabel: 'Duration', platformLabel: 'Platform', styleLabel: 'Style', btn: 'Create Script', loading: 'Writing...', copy: 'Copy', copied: 'Copied!', fullScript: 'Full Script', download: '📥 Download' },
  ru: { title: 'Script Studio', icon: '🎬', credits: '6', back: '← Назад', testMode: '🧪 Тест', purpose: 'Создаёт вирусные видео-сценарии.', topicLabel: 'Тема', topicPlaceholder: 'напр: рецепты...', durationLabel: 'Длительность', platformLabel: 'Платформа', styleLabel: 'Стиль', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: 'Скопировано!', fullScript: 'Полный сценарий', download: '📥 Скачать' },
  de: { title: 'Script Studio', icon: '🎬', credits: '6', back: '← Zurück', testMode: '🧪 Test', purpose: 'Erstellt virale Video-Skripte.', topicLabel: 'Thema', topicPlaceholder: 'z.B. Rezepte...', durationLabel: 'Dauer', platformLabel: 'Plattform', styleLabel: 'Stil', btn: 'Erstellen', loading: 'Erstelle...', copy: 'Kopieren', copied: 'Kopiert!', fullScript: 'Vollständiges Skript', download: '📥 Herunterladen' },
  fr: { title: 'Script Studio', icon: '🎬', credits: '6', back: '← Retour', testMode: '🧪 Test', purpose: 'Crée des scripts vidéo viraux.', topicLabel: 'Sujet', topicPlaceholder: 'ex: recettes...', durationLabel: 'Durée', platformLabel: 'Plateforme', styleLabel: 'Style', btn: 'Créer', loading: 'Création...', copy: 'Copier', copied: 'Copié!', fullScript: 'Script complet', download: '📥 Télécharger' }
}

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('30')
  const [platform, setPlatform] = useState('tiktok')
  const [style, setStyle] = useState('educational')
  const [copied, setCopied] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!topic.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/script-studio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, duration, platform, style, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000) }

  const downloadScript = () => {
    if (!result) return
    let txt = `🎬 VİDEO SCRİPTİ\n${'═'.repeat(50)}\n\n`
    txt += `Konu: ${topic}\nPlatform: ${platform}\nSüre: ${duration} saniye\n\n`
    txt += `${'─'.repeat(50)}\n🎣 HOOK (0-3 saniye)\n${'─'.repeat(50)}\n${result.main_script?.hook?.text || result.hook || ''}\n\n`
    txt += `${'─'.repeat(50)}\n📝 ANA İÇERİK\n${'─'.repeat(50)}\n${result.main_script?.body?.map((b: any) => b.text).join('\n\n') || result.body || ''}\n\n`
    txt += `${'─'.repeat(50)}\n🎯 CTA\n${'─'.repeat(50)}\n${result.main_script?.cta?.text || result.cta || ''}\n\n`
    if (result.full_script) { txt += `${'─'.repeat(50)}\n📋 TAM SCRİPT\n${'─'.repeat(50)}\n${result.full_script}\n\n` }
    if (result.hashtags) { txt += `\nHashtags: ${result.hashtags.join(' ')}` }
    
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob)
    link.download = `script-${topic.replace(/\s+/g, '-').slice(0, 20)}.txt`; link.click()
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
              <div><label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label><input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-sm text-gray-400 mb-2">{t.durationLabel}</label><select value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white"><option value="15">15 sn</option><option value="30">30 sn</option><option value="60">60 sn</option><option value="90">90 sn</option></select></div>
                <div><label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label><select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white"><option value="tiktok">TikTok</option><option value="reels">Reels</option><option value="shorts">Shorts</option></select></div>
                <div><label className="block text-sm text-gray-400 mb-2">{t.styleLabel}</label><select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white"><option value="educational">Eğitici</option><option value="entertaining">Eğlenceli</option><option value="storytelling">Hikaye</option><option value="motivational">Motivasyon</option></select></div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result ? (
              <>
                {/* Hook Alternatifleri */}
                {result.hook_options && result.hook_options.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <h3 className="text-red-400 font-semibold mb-3">🎣 Hook Seçenekleri (ilk 3 saniye)</h3>
                    {result.hook_options.map((h: any, i: number) => (
                      <div key={i} className="bg-gray-900/50 rounded-lg p-3 mb-2 last:mb-0">
                        <div className="flex justify-between items-start">
                          <span className="text-xs text-gray-500">{h.type}</span>
                          <button onClick={() => copyText(`hook-${i}`, h.script)} className="text-xs text-purple-400">{copied === `hook-${i}` ? t.copied : t.copy}</button>
                        </div>
                        <p className="text-white mt-1">{h.script}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Ana Script */}
                {result.main_script && (
                  <div className="space-y-3">
                    {/* Hook */}
                    {result.main_script.hook && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-red-400 font-medium">🎣 Hook ({result.main_script.hook.duration})</h4>
                          <button onClick={() => copyText('main-hook', result.main_script.hook.text)} className="text-xs text-purple-400">{copied === 'main-hook' ? t.copied : t.copy}</button>
                        </div>
                        <p className="text-white">{result.main_script.hook.text}</p>
                        {result.main_script.hook.visual && <p className="text-gray-500 text-xs mt-2">🎥 {result.main_script.hook.visual}</p>}
                      </div>
                    )}
                    
                    {/* Body */}
                    {result.main_script.body && (
                      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-3">📝 Ana İçerik</h4>
                        {Array.isArray(result.main_script.body) ? result.main_script.body.map((b: any, i: number) => (
                          <div key={i} className="bg-gray-900/50 rounded-lg p-3 mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-purple-400 text-xs">{b.duration}</span>
                              <button onClick={() => copyText(`body-${i}`, b.text)} className="text-xs text-gray-400">{copied === `body-${i}` ? t.copied : t.copy}</button>
                            </div>
                            <p className="text-gray-300 text-sm">{b.text}</p>
                            {b.visual && <p className="text-gray-500 text-xs mt-1">🎥 {b.visual}</p>}
                          </div>
                        )) : <p className="text-gray-300">{result.main_script.body}</p>}
                      </div>
                    )}
                    
                    {/* CTA */}
                    {result.main_script.cta && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-green-400 font-medium">🎯 CTA ({result.main_script.cta.duration})</h4>
                          <button onClick={() => copyText('cta', result.main_script.cta.text)} className="text-xs text-purple-400">{copied === 'cta' ? t.copied : t.copy}</button>
                        </div>
                        <p className="text-white">{result.main_script.cta.text}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tam Script */}
                {result.full_script && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-purple-400 font-medium">📋 {t.fullScript}</h4>
                      <button onClick={() => copyText('full', result.full_script)} className="text-xs text-purple-400">{copied === 'full' ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap text-sm">{result.full_script}</p>
                  </div>
                )}
                
                {/* Prodüksiyon Notları */}
                {result.production_notes && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h4 className="text-yellow-400 font-medium mb-2">🎬 Prodüksiyon Notları</h4>
                    {result.production_notes.camera_angles && <p className="text-gray-300 text-sm">📷 {result.production_notes.camera_angles.join(', ')}</p>}
                    {result.production_notes.sound_suggestions && <p className="text-gray-300 text-sm mt-1">🎵 {result.production_notes.sound_suggestions.join(', ')}</p>}
                  </div>
                )}
                
                {/* Hashtags */}
                {result.hashtags && result.hashtags.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-blue-400 font-medium">Hashtags</h4>
                      <button onClick={() => copyText('hashtags', result.hashtags.join(' '))} className="text-xs text-blue-400">{copied === 'hashtags' ? t.copied : t.copy}</button>
                    </div>
                    <div className="flex flex-wrap gap-1">{result.hashtags.map((h: string, i: number) => <span key={i} className="text-blue-300 text-sm">{h}</span>)}</div>
                  </div>
                )}
                
                <button onClick={downloadScript} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-500">{t.download}</button>
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
