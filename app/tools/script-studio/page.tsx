'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { back: 'Dashboard', topicLabel: 'Video Konusu', topicPlaceholder: 'örn: 5 dakikada kahvaltı tarifleri...', platformLabel: 'Platform', durationLabel: 'Süre', styleLabel: 'Stil', btn: 'Script Yaz', loading: 'Yazılıyor...', copy: 'Kopyala', copied: '✓', fullScript: 'Tam Script', sections: 'Bölümler', tips: 'İpuçları', newScript: 'Yeni Script' },
  en: { back: 'Dashboard', topicLabel: 'Video Topic', topicPlaceholder: 'e.g., 5-minute breakfast recipes...', platformLabel: 'Platform', durationLabel: 'Duration', styleLabel: 'Style', btn: 'Write Script', loading: 'Writing...', copy: 'Copy', copied: '✓', fullScript: 'Full Script', sections: 'Sections', tips: 'Tips', newScript: 'New Script' },
  ru: { back: 'Панель', topicLabel: 'Тема', topicPlaceholder: 'напр: рецепты...', platformLabel: 'Платформа', durationLabel: 'Длительность', styleLabel: 'Стиль', btn: 'Написать', loading: 'Пишу...', copy: 'Копировать', copied: '✓', fullScript: 'Скрипт', sections: 'Разделы', tips: 'Советы', newScript: 'Новый' },
  de: { back: 'Dashboard', topicLabel: 'Thema', topicPlaceholder: 'z.B. Rezepte...', platformLabel: 'Plattform', durationLabel: 'Dauer', styleLabel: 'Stil', btn: 'Schreiben', loading: 'Schreibe...', copy: 'Kopieren', copied: '✓', fullScript: 'Skript', sections: 'Abschnitte', tips: 'Tipps', newScript: 'Neu' },
  fr: { back: 'Tableau', topicLabel: 'Sujet', topicPlaceholder: 'ex: recettes...', platformLabel: 'Plateforme', durationLabel: 'Durée', styleLabel: 'Style', btn: 'Écrire', loading: 'Écriture...', copy: 'Copier', copied: '✓', fullScript: 'Script', sections: 'Sections', tips: 'Conseils', newScript: 'Nouveau' }
}

const styleOptions = [
  { value: 'educational', icon: '📚', label: 'Eğitici', labelEn: 'Educational' },
  { value: 'entertaining', icon: '🎉', label: 'Eğlenceli', labelEn: 'Entertaining' },
  { value: 'storytelling', icon: '📖', label: 'Hikaye', labelEn: 'Storytelling' },
  { value: 'tutorial', icon: '🎯', label: 'Tutorial', labelEn: 'Tutorial' },
]

export default function ScriptStudioPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [duration, setDuration] = useState('30')
  const [style, setStyle] = useState('educational')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else { setUser(user); supabase.from('credits').select('balance').eq('user_id', user.id).single().then(({ data }) => setCredits(data?.balance || 0)) }
    })
  }, [])

  const handleSubmit = async () => {
    if (!topic.trim() || loading) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/script-studio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, duration, style, language }) })
      const data = await res.json()
      if (res.ok && data.result) {
        setResult(data.result)
        if (credits >= 6) { await supabase.from('credits').update({ balance: credits - 6 }).eq('user_id', user.id); setCredits(prev => prev - 6) }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyText = (key: string, text: string) => { navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500) }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition"><span>←</span><span className="hidden sm:inline">{t.back}</span></Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3"><span className="text-2xl">🎬</span><h1 className="font-semibold">Script Studio</h1></div>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Instagram Reels</option>
                    <option value="shorts">YouTube Shorts</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.durationLabel}</label>
                  <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50">
                    <option value="15">15 sn</option>
                    <option value="30">30 sn</option>
                    <option value="60">60 sn</option>
                    <option value="180">3 dk</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.styleLabel}</label>
                <div className="grid grid-cols-4 gap-2">
                  {styleOptions.map(opt => (
                    <button key={opt.value} onClick={() => setStyle(opt.value)} className={`p-3 rounded-xl border text-center transition-all ${style === opt.value ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                      <div className="text-xl mb-1">{opt.icon}</div>
                      <div className="text-xs">{language === 'tr' ? opt.label : opt.labelEn}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading || !topic.trim() || credits < 6} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> {t.loading}</> : <>{t.btn} <span className="text-white/70">• 6 ✦</span></>}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Full Script */}
            {result.full_script && (
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">📝 {t.fullScript}</h3>
                  <button onClick={() => copyText('full', result.full_script)} className={`px-4 py-2 rounded-lg text-sm transition ${copiedKey === 'full' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{copiedKey === 'full' ? t.copied : t.copy}</button>
                </div>
                <div className="bg-white/5 rounded-xl p-5">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{result.full_script}</p>
                </div>
              </div>
            )}

            {/* Sections */}
            {result.sections && (
              <div className="space-y-3">
                <h3 className="font-semibold">📋 {t.sections}</h3>
                {result.sections.map((sec: any, i: number) => (
                  <div key={i} className={`rounded-xl p-4 border ${sec.type === 'hook' ? 'bg-red-500/5 border-red-500/20' : sec.type === 'cta' ? 'bg-green-500/5 border-green-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase text-gray-400 font-semibold">{sec.type} • {sec.duration}</span>
                      <button onClick={() => copyText(`sec-${i}`, sec.text)} className="text-xs text-purple-400">{copiedKey === `sec-${i}` ? t.copied : t.copy}</button>
                    </div>
                    <p className="text-white">{sec.text}</p>
                    {sec.visual_note && <p className="text-gray-500 text-sm mt-2">🎥 {sec.visual_note}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            {result.production_tips?.length > 0 && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
                <h3 className="text-yellow-400 font-semibold mb-3">💡 {t.tips}</h3>
                <ul className="space-y-2">{result.production_tips.map((tip: string, i: number) => <li key={i} className="text-gray-300 text-sm">• {tip}</li>)}</ul>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">← {t.newScript}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
