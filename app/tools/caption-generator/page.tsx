'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: { title: 'Viral Caption Generator', icon: '✍️', credits: '3 Kredi', back: '← Geri', testMode: '🧪 Test Modu', purpose: 'Engagement oranı yüksek, viral potansiyelli caption\'lar üretir.', topicLabel: 'Video/Post Konusu', topicPlaceholder: 'örn: 30 günde 10kg verdim...', platformLabel: 'Platform', toneLabel: 'Ton', contentLabel: 'İçerik Tipi', btn: 'Caption Üret', loading: 'Üretiliyor...', copy: 'Kopyala', copied: '✓', ctas: '📢 CTA Seçenekleri', hashtags: '#️⃣ Hashtag Önerileri', tips: '💡 İpuçları' },
  en: { title: 'Viral Caption Generator', icon: '✍️', credits: '3 Credits', back: '← Back', testMode: '🧪 Test Mode', purpose: 'Creates high-engagement, viral-potential captions.', topicLabel: 'Video/Post Topic', topicPlaceholder: 'e.g., I lost 10kg in 30 days...', platformLabel: 'Platform', toneLabel: 'Tone', contentLabel: 'Content Type', btn: 'Generate Caption', loading: 'Generating...', copy: 'Copy', copied: '✓', ctas: '📢 CTA Options', hashtags: '#️⃣ Hashtag Suggestions', tips: '💡 Tips' },
  ru: { title: 'Viral Caption Generator', icon: '✍️', credits: '3', back: '← Назад', testMode: '🧪 Тест', purpose: 'Создаёт вирусные подписи.', topicLabel: 'Тема', topicPlaceholder: 'напр: Похудел на 10кг...', platformLabel: 'Платформа', toneLabel: 'Тон', contentLabel: 'Тип', btn: 'Создать', loading: 'Создание...', copy: 'Копировать', copied: '✓', ctas: '📢 CTA', hashtags: '#️⃣ Хештеги', tips: '💡 Советы' },
  de: { title: 'Viral Caption Generator', icon: '✍️', credits: '3', back: '← Zurück', testMode: '🧪 Test', purpose: 'Erstellt virale Captions.', topicLabel: 'Thema', topicPlaceholder: 'z.B. 10kg in 30 Tagen...', platformLabel: 'Plattform', toneLabel: 'Ton', contentLabel: 'Typ', btn: 'Generieren', loading: 'Generiere...', copy: 'Kopieren', copied: '✓', ctas: '📢 CTAs', hashtags: '#️⃣ Hashtags', tips: '💡 Tipps' },
  fr: { title: 'Viral Caption Generator', icon: '✍️', credits: '3', back: '← Retour', testMode: '🧪 Test', purpose: 'Crée des légendes virales.', topicLabel: 'Sujet', topicPlaceholder: 'ex: J\'ai perdu 10kg...', platformLabel: 'Plateforme', toneLabel: 'Ton', contentLabel: 'Type', btn: 'Générer', loading: 'Génération...', copy: 'Copier', copied: '✓', ctas: '📢 CTAs', hashtags: '#️⃣ Hashtags', tips: '💡 Conseils' }
}

const toneOptions = [
  { value: 'casual', label: '😊 Samimi', labelEn: '😊 Casual' },
  { value: 'professional', label: '💼 Profesyonel', labelEn: '💼 Professional' },
  { value: 'humorous', label: '😂 Eğlenceli', labelEn: '😂 Humorous' },
  { value: 'inspirational', label: '✨ İlham Verici', labelEn: '✨ Inspirational' },
  { value: 'educational', label: '📚 Eğitici', labelEn: '📚 Educational' }
]

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('casual')
  const [contentType, setContentType] = useState('reel')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (!user) router.push('/login'); else setUser(user) }) }, [])

  const handleSubmit = async () => {
    if (!topic.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/caption-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, tone, contentType, language }) })
      const data = await res.json()
      if (res.ok && data.result) setResult(data.result)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const copyCaption = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  const engagementColor: any = {
    'high': 'bg-green-500/20 text-green-400 border-green-500/30',
    'medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'low': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sol Panel */}
          <div className="space-y-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4">
              <p className="text-gray-400 text-sm">{t.purpose}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topicLabel}</label>
                <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full h-24 bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.platformLabel}</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white">
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.contentLabel}</label>
                  <select value={contentType} onChange={e => setContentType(e.target.value)} className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-3 py-3 text-white">
                    <option value="reel">Reel / Short</option>
                    <option value="carousel">Carousel</option>
                    <option value="post">Static Post</option>
                    <option value="story">Story</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.toneLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map(opt => (
                    <button key={opt.value} onClick={() => setTone(opt.value)} className={`px-3 py-2 rounded-lg text-sm transition-all ${tone === opt.value ? 'bg-purple-500/20 border border-purple-500 text-purple-300' : 'bg-gray-900/50 border border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                      {language === 'tr' ? opt.label : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50">{loading ? t.loading : t.btn}</button>
            </div>

            {/* CTA Variations */}
            {result?.cta_variations && result.cta_variations.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                <h3 className="text-green-400 font-semibold mb-3">{t.ctas}</h3>
                <div className="space-y-2">
                  {result.cta_variations.map((cta: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-gray-900/50 rounded-lg p-2">
                      <span className="text-white text-sm">{cta.cta}</span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">{cta.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags */}
            {result?.hashtag_suggestions && result.hashtag_suggestions.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                <h3 className="text-blue-400 font-semibold mb-2">{t.hashtags}</h3>
                <div className="flex flex-wrap gap-1">
                  {result.hashtag_suggestions.map((tag: string, i: number) => (
                    <span key={i} className="text-blue-300 text-sm">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sağ Panel - Sonuçlar */}
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            {result?.captions && result.captions.length > 0 ? (
              <>
                {result.topic_insight && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
                    <p className="text-gray-300 text-sm">{result.topic_insight}</p>
                  </div>
                )}
                
                {result.captions.map((cap: any, i: number) => (
                  <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">{i + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${engagementColor[cap.engagement_prediction] || engagementColor.medium}`}>
                          {cap.engagement_prediction === 'high' ? '🔥 Yüksek' : cap.engagement_prediction === 'medium' ? '⚡ Orta' : '📊 Normal'}
                        </span>
                      </div>
                      <button onClick={() => copyCaption(i, cap.caption)} className={`text-xs px-3 py-1 rounded-lg ${copiedIndex === i ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                        {copiedIndex === i ? t.copied : t.copy}
                      </button>
                    </div>
                    
                    {/* Caption */}
                    <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
                      <p className="text-white whitespace-pre-wrap">{cap.caption}</p>
                    </div>
                    
                    {/* Detaylar */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {cap.style && (
                        <div className="bg-gray-900/30 rounded p-2">
                          <span className="text-gray-500 text-xs">Stil</span>
                          <p className="text-gray-300">{cap.style}</p>
                        </div>
                      )}
                      {cap.best_for && (
                        <div className="bg-gray-900/30 rounded p-2">
                          <span className="text-gray-500 text-xs">En İyi</span>
                          <p className="text-gray-300">{cap.best_for}</p>
                        </div>
                      )}
                    </div>
                    
                    {cap.character_count && (
                      <div className="mt-2 text-xs text-gray-500 text-right">{cap.character_count} karakter</div>
                    )}
                  </div>
                ))}

                {/* Tips */}
                {result.formatting_tips && result.formatting_tips.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h3 className="text-yellow-400 font-semibold mb-2">{t.tips}</h3>
                    <ul className="space-y-1">
                      {result.formatting_tips.map((tip: string, i: number) => (
                        <li key={i} className="text-gray-400 text-sm">💡 {tip}</li>
                      ))}
                    </ul>
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
