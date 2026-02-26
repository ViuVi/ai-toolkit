'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

const texts: Record<Language, any> = {
  en: { back: '← Back to Dashboard', title: 'QR Code Generator', subtitle: 'Create QR codes', free: '💫 FREE', input: 'URL or Text', placeholder: 'https://example.com', generate: 'Generate QR Code', generating: 'Generating...', download: 'Download', required: 'URL or text is required', success: 'QR code generated!', error: 'An error occurred' },
  tr: { back: '← Panele Dön', title: 'QR Kod Üretici', subtitle: 'QR kod oluştur', free: '💫 ÜCRETSİZ', input: 'URL veya Metin', placeholder: 'https://ornek.com', generate: 'QR Kod Oluştur', generating: 'Oluşturuluyor...', download: 'İndir', required: 'URL veya metin gerekli', success: 'QR kod oluşturuldu!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Генератор QR-кодов', subtitle: 'Создайте QR-коды', free: '💫 БЕСПЛАТНО', input: 'URL или текст', placeholder: 'https://example.com', generate: 'Создать QR-код', generating: 'Создание...', download: 'Скачать', required: 'URL или текст обязателен', success: 'QR-код создан!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'QR-Code-Generator', subtitle: 'QR-Codes erstellen', free: '💫 KOSTENLOS', input: 'URL oder Text', placeholder: 'https://beispiel.de', generate: 'QR-Code erstellen', generating: 'Erstellen...', download: 'Herunterladen', required: 'URL oder Text erforderlich', success: 'QR-Code erstellt!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Générateur de QR code', subtitle: 'Créez des QR codes', free: '💫 GRATUIT', input: 'URL ou texte', placeholder: 'https://exemple.com', generate: 'Générer un QR code', generating: 'Génération...', download: 'Télécharger', required: 'URL ou texte requis', success: 'QR code généré!', error: 'Erreur' }
}
const languages: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState(''); const [qrCode, setQrCode] = useState(''); const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage(); const { showToast } = useToast(); const t = texts[language]

  const handleGenerate = async () => {
    if (!text) { showToast(t.required, 'warning'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/qr-code-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
      const data = await res.json()
      if (data.qrCode) { setQrCode(data.qrCode); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const downloadQR = () => { const link = document.createElement('a'); link.download = 'qrcode.png'; link.href = qrCode; link.click() }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">{languages.map((lang) => (<button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-2 py-1 rounded text-xs transition ${language === lang.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{lang.flag}</button>))}</div>
            <span className="text-2xl">📱</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full mb-4">{t.free}</span><h1 className="text-4xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <label className="block text-sm font-medium mb-2">{t.input}</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.placeholder} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none" />
          <button onClick={handleGenerate} disabled={loading} className="w-full mt-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold transition disabled:opacity-50">{loading ? t.generating : t.generate}</button>
        </div>
        {qrCode && (
          <div className="bg-gray-800 rounded-2xl p-6 text-center">
            <img src={qrCode} alt="QR Code" className="mx-auto mb-4 rounded-xl" />
            <button onClick={downloadQR} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition">{t.download}</button>
          </div>
        )}
      </main>
    </div>
  )
}
