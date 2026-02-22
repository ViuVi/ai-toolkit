'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import QRCode from 'qrcode'

export default function QRGeneratorPage() {
  const [text, setText] = useState('')
  const [qrImage, setQrImage] = useState('')
  const [size, setSize] = useState(300)
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  const handleGenerate = async () => {
    if (!text.trim()) {
      showToast(language === 'en' ? 'Please enter text or URL' : 'Lütfen bir metin veya URL girin', 'warning')
      return
    }

    setLoading(true)

    try {
      const qr = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bgColor
        }
      })
      setQrImage(qr)
      showToast(language === 'en' ? 'QR Code generated!' : 'QR Kod oluşturuldu!', 'success')
    } catch (err) {
      showToast((language === 'tr' ? 'Hata oluştu' : 'An error occurred'), 'error')
    }

    setLoading(false)
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = 'qr-code.png'
    link.href = qrImage
    link.click()
    showToast(language === 'en' ? 'Downloaded!' : 'İndirildi!', 'success')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{(language === 'tr' ? 'Panele Dön' : 'Back to Dashboard')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">📱</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-green-400 text-sm font-medium">
              {language === 'en' ? '📱 FREE TOOL' : '📱 ÜCRETSİZ ARAÇ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'QR Code Generator' : 'QR Kod Oluşturucu'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Create custom QR codes for links, text, and more' : 'Link, metin ve daha fazlası için özel QR kodlar oluşturun'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            {language === 'en' ? 'Text or URL' : 'Metin veya URL'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none mb-4"
            placeholder={language === 'en' ? 'Enter text, URL, or any data...' : 'Metin, URL veya herhangi bir veri girin...'}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Size' : 'Boyut'}
              </label>
              <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none">
                <option value={200}>200x200</option>
                <option value={300}>300x300</option>
                <option value={400}>400x400</option>
                <option value={500}>500x500</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'QR Color' : 'QR Rengi'}
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-12 rounded-xl bg-gray-900 border border-gray-700 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Background' : 'Arka Plan'}
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-12 rounded-xl bg-gray-900 border border-gray-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8"
        >
          {loading ? <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</> : <>📱 {language === 'en' ? 'Generate QR Code' : 'QR Kod Oluştur'}</>}
        </button>

        {qrImage && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
              <img src={qrImage} alt="QR Code" className="mx-auto mb-6 rounded-xl shadow-2xl" />
              <button
                onClick={downloadQR}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
              >
                ⬇️ {language === 'en' ? 'Download QR Code' : 'QR Kodu İndir'}
              </button>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                💡 {language === 'en' ? 'Tips' : 'İpuçları'}
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• {language === 'en' ? 'Test your QR code before printing' : 'Yazdırmadan önce QR kodunuzu test edin'}</li>
                <li>• {language === 'en' ? 'Use high contrast colors for better scanning' : 'Daha iyi tarama için yüksek kontrast renkler kullanın'}</li>
                <li>• {language === 'en' ? 'Keep URLs short for simpler QR codes' : 'Daha basit QR kodlar için URL\'leri kısa tutun'}</li>
                <li>• {language === 'en' ? 'Larger sizes work better for printing' : 'Büyük boyutlar yazdırma için daha iyidir'}</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}