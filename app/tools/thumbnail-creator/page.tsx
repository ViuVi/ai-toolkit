'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'Thumbnail Oluşturucu', topic: 'Video Konusu', topicPlaceholder: 'örn: 5 Dakikada Sabah Rutini, ChatGPT ile Para Kazan...', platform: 'Platform', style: 'Stil', generate: '5 Thumbnail Üret', generating: 'Tasarlanıyor...', download: 'PNG İndir', emptyTitle: 'Thumbnail Oluşturucu', emptyDesc: 'Video konunuzu girin, tıklanma oranını artıracak thumbnaillar oluşturalım', bestPick: 'En İyi Seçim', bold: 'Cesur', minimal: 'Minimal', neon: 'Neon', gradient: 'Gradient', ctrTips: 'CTR İpuçları' },
  en: { title: 'Thumbnail Creator', topic: 'Video Topic', topicPlaceholder: 'e.g: 5 Minute Morning Routine, Make Money with ChatGPT...', platform: 'Platform', style: 'Style', generate: 'Generate 5 Thumbnails', generating: 'Designing...', download: 'Download PNG', emptyTitle: 'Thumbnail Creator', emptyDesc: 'Enter your video topic to create high-CTR thumbnails', bestPick: 'Best Pick', bold: 'Bold', minimal: 'Minimal', neon: 'Neon', gradient: 'Gradient', ctrTips: 'CTR Tips' },
  ru: { title: 'Создатель обложек', topic: 'Тема видео', topicPlaceholder: 'напр: Утренняя рутина за 5 минут...', platform: 'Платформа', style: 'Стиль', generate: 'Создать 5 обложек', generating: 'Создание...', download: 'Скачать PNG', emptyTitle: 'Создатель обложек', emptyDesc: 'Введите тему видео', bestPick: 'Лучший выбор', bold: 'Жирный', minimal: 'Минимальный', neon: 'Неон', gradient: 'Градиент', ctrTips: 'Советы по CTR' },
  de: { title: 'Thumbnail-Ersteller', topic: 'Video-Thema', topicPlaceholder: 'z.B: 5-Minuten Morgenroutine...', platform: 'Plattform', style: 'Stil', generate: '5 Thumbnails erstellen', generating: 'Wird erstellt...', download: 'PNG herunterladen', emptyTitle: 'Thumbnail-Ersteller', emptyDesc: 'Thema eingeben', bestPick: 'Beste Wahl', bold: 'Fett', minimal: 'Minimal', neon: 'Neon', gradient: 'Gradient', ctrTips: 'CTR-Tipps' },
  fr: { title: 'Créateur de Miniatures', topic: 'Sujet de la vidéo', topicPlaceholder: 'ex: Routine matinale de 5 minutes...', platform: 'Plateforme', style: 'Style', generate: 'Générer 5 miniatures', generating: 'Création...', download: 'Télécharger PNG', emptyTitle: 'Créateur de Miniatures', emptyDesc: 'Entrez votre sujet', bestPick: 'Meilleur choix', bold: 'Audacieux', minimal: 'Minimal', neon: 'Néon', gradient: 'Dégradé', ctrTips: 'Conseils CTR' }
}

export default function ThumbnailCreatorPage() {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('youtube')
  const [style, setStyle] = useState('bold')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = toolTexts[language] || toolTexts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else {
        setUser(session.user)
        setSession(session)
        supabase.from('credits').select('balance').eq('user_id', session.user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [router])

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/thumbnail-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ topic, platform, style, language })
      })
      const data = await res.json()
      if (res.ok && data.result) { setResult(data.result); if (data.newBalance !== undefined) setCredits(data.newBalance) }
      else setError(data.error || 'Error')
    } catch { setError('Connection error') }
    setLoading(false)
  }

  const downloadThumbnail = async (thumb: any, index: number) => {
    setDownloading(index)
    try {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 1280
      canvas.height = 720

      // Background gradient
      const colors = thumb.bg_gradient || ['#6b21a8', '#ec4899']
      const grad = ctx.createLinearGradient(0, 0, 1280, 720)
      grad.addColorStop(0, colors[0])
      grad.addColorStop(1, colors[1])
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1280, 720)

      // Headline text
      const textColor = thumb.text_color || '#ffffff'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const headline = thumb.headline || ''
      const fontSize = headline.length > 20 ? 72 : headline.length > 12 ? 90 : 110
      ctx.font = `900 ${fontSize}px Arial, sans-serif`

      // Text shadow
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 4
      ctx.shadowOffsetY = 4

      // Draw headline (word wrap)
      const words = headline.split(' ')
      const lines: string[] = []
      let currentLine = ''
      for (const word of words) {
        const test = currentLine ? currentLine + ' ' + word : word
        if (ctx.measureText(test).width > 1100) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = test
        }
      }
      if (currentLine) lines.push(currentLine)

      const lineHeight = fontSize * 1.2
      const totalHeight = lines.length * lineHeight
      const startY = 360 - totalHeight / 2 + lineHeight / 2

      lines.forEach((line, i) => {
        // Outline effect
        ctx.strokeStyle = 'rgba(0,0,0,0.8)'
        ctx.lineWidth = 8
        ctx.strokeText(line, 640, startY + i * lineHeight)
        ctx.fillText(line, 640, startY + i * lineHeight)
      })

      // Subtext
      if (thumb.subtext) {
        ctx.shadowBlur = 8
        ctx.font = '600 36px Arial, sans-serif'
        ctx.fillStyle = thumb.accent_color || '#fbbf24'
        ctx.fillText(thumb.subtext, 640, startY + lines.length * lineHeight + 30)
      }

      // Emoji
      if (thumb.emoji) {
        ctx.shadowBlur = 0
        ctx.font = '120px Arial'
        ctx.fillText(thumb.emoji, 1150, 120)
      }

      // Accent bar at bottom
      ctx.shadowBlur = 0
      ctx.fillStyle = thumb.accent_color || '#fbbf24'
      ctx.fillRect(0, 690, 1280, 30)

      // Download
      const link = document.createElement('a')
      link.download = `thumbnail-${index + 1}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download error:', err)
    }
    setDownloading(null)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <canvas ref={canvasRef} className="hidden" />
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">🎨 {t.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {(['en', 'tr', 'ru', 'de', 'fr'] as const).map(l => (
                  <button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">✦ {credits}</div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.topic}</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.platform}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[['youtube', '🎬 YouTube'], ['tiktok', '🎵 TikTok'], ['instagram', '📸 IG']].map(([val, label]) => (
                    <button key={val} onClick={() => setPlatform(val)} className={`p-2 rounded-xl border text-xs ${platform === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.style}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['bold', t.bold], ['minimal', t.minimal], ['neon', t.neon], ['gradient', t.gradient]].map(([val, label]) => (
                    <button key={val} onClick={() => setStyle(val)} className={`p-2 rounded-xl border text-sm ${style === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>{t.generating}</> : `🎨 ${t.generate}`}
              </button>
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
              {result?.ctr_tips && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <h4 className="font-semibold text-purple-400 mb-2">💡 {t.ctrTips}</h4>
                  {result.ctr_tips.map((tip: string, i: number) => <p key={i} className="text-sm text-gray-300 mb-1">• {tip}</p>)}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
            {!result && !loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="text-5xl mb-4">🎨</div><h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3><p className="text-gray-500">{t.emptyDesc}</p></div>}
            {loading && <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center"><div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div></div>}
            {result?.thumbnails && (
              <div className="space-y-6">
                {result.thumbnails.map((thumb: any, i: number) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-white/10 group">
                    {result.best_pick?.index === i && (
                      <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30 flex items-center gap-2">
                        <span className="text-yellow-400 font-semibold text-sm">🏆 {t.bestPick}</span>
                        <span className="text-xs text-gray-400">{result.best_pick.reason}</span>
                      </div>
                    )}
                    {/* Thumbnail Preview */}
                    <div 
                      className="relative aspect-video flex flex-col items-center justify-center p-8 overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${thumb.bg_gradient?.[0] || '#6b21a8'}, ${thumb.bg_gradient?.[1] || '#ec4899'})` }}
                    >
                      {thumb.emoji && <div className="absolute top-4 right-6 text-5xl opacity-80">{thumb.emoji}</div>}
                      <h2 
                        className="text-4xl md:text-5xl font-black text-center leading-tight drop-shadow-lg"
                        style={{ color: thumb.text_color || '#ffffff', textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}
                      >
                        {thumb.headline}
                      </h2>
                      {thumb.subtext && (
                        <p className="mt-3 text-lg font-semibold" style={{ color: thumb.accent_color || '#fbbf24' }}>
                          {thumb.subtext}
                        </p>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-2" style={{ backgroundColor: thumb.accent_color || '#fbbf24' }}></div>
                    </div>
                    {/* Controls */}
                    <div className="p-4 bg-white/[0.03] flex items-center justify-between">
                      <div className="flex gap-2 text-xs text-gray-400">
                        <span className="px-2 py-1 bg-white/5 rounded">{thumb.style}</span>
                        <span className="px-2 py-1 bg-white/5 rounded">{thumb.layout}</span>
                      </div>
                      <button 
                        onClick={() => downloadThumbnail(thumb, i)}
                        disabled={downloading === i}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {downloading === i ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : '📥'} {t.download}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {result?.raw && !result?.thumbnails && <pre className="p-4 bg-white/[0.02] rounded-xl whitespace-pre-wrap text-sm">{result.raw}</pre>}
          </div>
        </div>
      </main>
    </div>
  )
}
