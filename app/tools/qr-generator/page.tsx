'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import QRCode from 'qrcode'

const toolTexts: Record<string, Record<string, string>> = {
  tr: { title: 'QR Kod Oluşturucu', subtitle: 'Sosyal medya profillerin için özel QR kodlar', link: 'Link / URL', linkPlaceholder: 'https://instagram.com/kullaniciadi', quickLinks: 'Hızlı Bağlantılar', fgColor: 'QR Rengi', bgColor: 'Arka Plan', size: 'Boyut', style: 'Çerçeve', download: 'PNG İndir', downloadSvg: 'SVG İndir', free: 'ÜCRETSİZ', emptyTitle: 'QR Kod Oluşturucu', emptyDesc: 'Linkinizi girin, profesyonel QR kod oluşturun', noFrame: 'Çerçevesiz', scanMe: 'Tara Beni', followMe: 'Takip Et', visitSite: 'Siteyi Ziyaret Et', small: 'Küçük', medium: 'Orta', large: 'Büyük', xlarge: 'Çok Büyük' },
  en: { title: 'QR Code Generator', subtitle: 'Custom QR codes for your social profiles', link: 'Link / URL', linkPlaceholder: 'https://instagram.com/username', quickLinks: 'Quick Links', fgColor: 'QR Color', bgColor: 'Background', size: 'Size', style: 'Frame', download: 'Download PNG', downloadSvg: 'Download SVG', free: 'FREE', emptyTitle: 'QR Code Generator', emptyDesc: 'Enter your link to create a professional QR code', noFrame: 'No Frame', scanMe: 'Scan Me', followMe: 'Follow Me', visitSite: 'Visit Site', small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'X-Large' },
  ru: { title: 'Генератор QR-кодов', subtitle: 'QR-коды для ваших соцсетей', link: 'Ссылка / URL', linkPlaceholder: 'https://instagram.com/username', quickLinks: 'Быстрые ссылки', fgColor: 'Цвет QR', bgColor: 'Фон', size: 'Размер', style: 'Рамка', download: 'Скачать PNG', downloadSvg: 'Скачать SVG', free: 'БЕСПЛАТНО', emptyTitle: 'Генератор QR-кодов', emptyDesc: 'Введите ссылку', noFrame: 'Без рамки', scanMe: 'Сканируй', followMe: 'Подпишись', visitSite: 'Перейти', small: 'Маленький', medium: 'Средний', large: 'Большой', xlarge: 'Очень большой' },
  de: { title: 'QR-Code Generator', subtitle: 'QR-Codes für Ihre Social-Profile', link: 'Link / URL', linkPlaceholder: 'https://instagram.com/username', quickLinks: 'Schnelllinks', fgColor: 'QR-Farbe', bgColor: 'Hintergrund', size: 'Größe', style: 'Rahmen', download: 'PNG herunterladen', downloadSvg: 'SVG herunterladen', free: 'KOSTENLOS', emptyTitle: 'QR-Code Generator', emptyDesc: 'Link eingeben', noFrame: 'Kein Rahmen', scanMe: 'Scan mich', followMe: 'Folge mir', visitSite: 'Seite besuchen', small: 'Klein', medium: 'Mittel', large: 'Groß', xlarge: 'Sehr groß' },
  fr: { title: 'Générateur de QR Code', subtitle: 'QR codes personnalisés pour vos profils', link: 'Lien / URL', linkPlaceholder: 'https://instagram.com/username', quickLinks: 'Liens rapides', fgColor: 'Couleur QR', bgColor: 'Arrière-plan', size: 'Taille', style: 'Cadre', download: 'Télécharger PNG', downloadSvg: 'Télécharger SVG', free: 'GRATUIT', emptyTitle: 'Générateur de QR Code', emptyDesc: 'Entrez votre lien', noFrame: 'Sans cadre', scanMe: 'Scannez-moi', followMe: 'Suivez-moi', visitSite: 'Visiter le site', small: 'Petit', medium: 'Moyen', large: 'Grand', xlarge: 'Très grand' }
}

const presetColors = [
  { name: 'Black', fg: '#000000', bg: '#ffffff' },
  { name: 'Purple', fg: '#7c3aed', bg: '#ffffff' },
  { name: 'Pink', fg: '#ec4899', bg: '#ffffff' },
  { name: 'Blue', fg: '#3b82f6', bg: '#ffffff' },
  { name: 'Red', fg: '#ef4444', bg: '#ffffff' },
  { name: 'Green', fg: '#10b981', bg: '#ffffff' },
  { name: 'Dark', fg: '#a855f7', bg: '#0a0a0f' },
  { name: 'Neon', fg: '#00ff88', bg: '#000000' },
]

const quickLinkTemplates = [
  { icon: '📸', label: 'Instagram', url: 'https://instagram.com/' },
  { icon: '🎵', label: 'TikTok', url: 'https://tiktok.com/@' },
  { icon: '🎬', label: 'YouTube', url: 'https://youtube.com/@' },
  { icon: '🐦', label: 'Twitter/X', url: 'https://x.com/' },
  { icon: '💼', label: 'LinkedIn', url: 'https://linkedin.com/in/' },
  { icon: '🌐', label: 'Website', url: 'https://' },
  { icon: '📱', label: 'WhatsApp', url: 'https://wa.me/' },
  { icon: '✈️', label: 'Telegram', url: 'https://t.me/' },
]

export default function QRGeneratorPage() {
  const [user, setUser] = useState<any>(null)
  const [link, setLink] = useState('')
  const [fgColor, setFgColor] = useState('#7c3aed')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(300)
  const [frame, setFrame] = useState('none')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrSvg, setQrSvg] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = toolTexts[language] || toolTexts.en

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setUser(session.user)
    })
  }, [router])

  const generateQR = useCallback(async () => {
    if (!link.trim()) { setQrDataUrl(''); setQrSvg(''); return }
    try {
      const dataUrl = await QRCode.toDataURL(link, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'H'
      })
      setQrDataUrl(dataUrl)

      const svg = await QRCode.toString(link, {
        type: 'svg',
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'H'
      })
      setQrSvg(svg)
    } catch (err) {
      console.error('QR generation error:', err)
    }
  }, [link, fgColor, bgColor, size])

  useEffect(() => {
    const timer = setTimeout(() => generateQR(), 300)
    return () => clearTimeout(timer)
  }, [generateQR])

  const downloadPNG = async () => {
    if (!qrDataUrl) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const padding = frame !== 'none' ? 60 : 20
    const totalSize = size + padding * 2
    canvas.width = totalSize
    canvas.height = totalSize + (frame !== 'none' ? 40 : 0)

    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Frame border
    if (frame !== 'none') {
      ctx.strokeStyle = fgColor
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 16)
      ctx.stroke()
    }

    // QR Image
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, padding, padding, size, size)

      // Frame text
      if (frame !== 'none') {
        const frameTexts: Record<string, string> = {
          scanMe: t.scanMe,
          followMe: t.followMe,
          visitSite: t.visitSite
        }
        ctx.fillStyle = fgColor
        ctx.font = `bold ${Math.max(16, size / 15)}px Arial, sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(frameTexts[frame] || '', canvas.width / 2, canvas.height - 20)
      }

      const a = document.createElement('a')
      a.download = `qr-code-${Date.now()}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = qrDataUrl
  }

  const downloadSVG = () => {
    if (!qrSvg) return
    const blob = new Blob([qrSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = `qr-code-${Date.now()}.svg`
    a.href = url
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <canvas ref={canvasRef} className="hidden" />
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">← Dashboard</Link>
            <h1 className="font-bold">📱 {t.title}</h1>
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-bold">{t.free}</span>
          </div>
          <div className="relative group">
            <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">🌐</button>
            <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
              {(['en', 'tr', 'ru', 'de', 'fr'] as const).map(l => (
                <button key={l} onClick={() => setLanguage(l)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5">
              {/* URL Input */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.link}</label>
                <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder={t.linkPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" />
              </div>

              {/* Quick Links */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.quickLinks}</label>
                <div className="grid grid-cols-4 gap-2">
                  {quickLinkTemplates.map(ql => (
                    <button key={ql.label} onClick={() => setLink(ql.url)} className="p-2 bg-white/5 border border-white/10 rounded-xl text-center hover:bg-white/10 transition">
                      <div className="text-lg">{ql.icon}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{ql.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.fgColor}</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {presetColors.map(pc => (
                    <button key={pc.name} onClick={() => { setFgColor(pc.fg); setBgColor(pc.bg) }} className={`w-8 h-8 rounded-lg border-2 transition ${fgColor === pc.fg && bgColor === pc.bg ? 'border-purple-500 scale-110' : 'border-white/10'}`} style={{ background: pc.fg }} title={pc.name} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">{t.fgColor}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                      <input type="text" value={fgColor} onChange={e => setFgColor(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white font-mono" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">{t.bgColor}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                      <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white font-mono" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.size}</label>
                <div className="grid grid-cols-4 gap-2">
                  {[[200, t.small], [300, t.medium], [500, t.large], [800, t.xlarge]].map(([val, label]) => (
                    <button key={val as number} onClick={() => setSize(val as number)} className={`p-2 rounded-xl border text-xs ${size === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label as string}</button>
                  ))}
                </div>
              </div>

              {/* Frame */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.style}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['none', t.noFrame], ['scanMe', t.scanMe], ['followMe', t.followMe], ['visitSite', t.visitSite]].map(([val, label]) => (
                    <button key={val} onClick={() => setFrame(val)} className={`p-2 rounded-xl border text-xs ${frame === val ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>{label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3 space-y-4">
            {!link.trim() ? (
              <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-medium mb-2">{t.emptyTitle}</h3>
                <p className="text-gray-500">{t.emptyDesc}</p>
              </div>
            ) : (
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                {/* QR Preview */}
                <div className="flex justify-center mb-6">
                  <div className="relative inline-block" style={{ padding: frame !== 'none' ? '24px' : '0', border: frame !== 'none' ? `3px solid ${fgColor}` : 'none', borderRadius: frame !== 'none' ? '16px' : '0', backgroundColor: bgColor }}>
                    {qrDataUrl && <img src={qrDataUrl} alt="QR Code" style={{ width: Math.min(size, 400), height: Math.min(size, 400) }} className="rounded" />}
                    {frame !== 'none' && (
                      <p className="text-center mt-3 font-bold text-sm" style={{ color: fgColor }}>
                        {frame === 'scanMe' ? t.scanMe : frame === 'followMe' ? t.followMe : t.visitSite}
                      </p>
                    )}
                  </div>
                </div>

                {/* URL Display */}
                <div className="text-center mb-6">
                  <p className="text-xs text-gray-500 break-all">{link}</p>
                </div>

                {/* Download Buttons */}
                <div className="flex justify-center gap-4">
                  <button onClick={downloadPNG} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2">
                    📥 {t.download}
                  </button>
                  <button onClick={downloadSVG} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition flex items-center gap-2">
                    📐 {t.downloadSvg}
                  </button>
                </div>

                {/* Size info */}
                <p className="text-center text-xs text-gray-500 mt-4">{size} × {size} px</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
