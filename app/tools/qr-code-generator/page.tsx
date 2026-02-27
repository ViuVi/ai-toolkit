'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'QR Code Generator', subtitle: 'Create custom QR codes for your links instantly', credits: 'FREE', inputLabel: 'Enter URL or text', inputPlaceholder: 'https://your-website.com or any text...', generate: 'Generate QR Code', generating: 'Creating QR code...', result: 'Your QR Code', download: 'Download', emptyInput: 'Please enter a URL or text', success: 'QR Code generated!' },
  tr: { back: '← Geri', title: 'QR Kod Üretici', subtitle: 'Linkleriniz için anında özel QR kodlar oluşturun', credits: 'ÜCRETSİZ', inputLabel: 'URL veya metin girin', inputPlaceholder: 'https://siteniz.com veya herhangi bir metin...', generate: 'QR Kod Oluştur', generating: 'QR kod oluşturuluyor...', result: 'QR Kodunuz', download: 'İndir', emptyInput: 'Lütfen URL veya metin girin', success: 'QR Kod oluşturuldu!' },
  ru: { back: '← Назад', title: 'Генератор QR кодов', subtitle: 'Создавайте QR коды для ваших ссылок', credits: 'БЕСПЛАТНО', inputLabel: 'Введите URL или текст', inputPlaceholder: 'https://ваш-сайт.com или любой текст...', generate: 'Создать QR код', generating: 'Создание QR кода...', result: 'Ваш QR код', download: 'Скачать', emptyInput: 'Введите URL или текст', success: 'QR код создан!' },
  de: { back: '← Zurück', title: 'QR-Code-Generator', subtitle: 'Erstellen Sie QR-Codes für Ihre Links', credits: 'KOSTENLOS', inputLabel: 'URL oder Text eingeben', inputPlaceholder: 'https://ihre-website.com oder Text...', generate: 'QR-Code erstellen', generating: 'QR-Code wird erstellt...', result: 'Ihr QR-Code', download: 'Herunterladen', emptyInput: 'Bitte URL oder Text eingeben', success: 'QR-Code erstellt!' },
  fr: { back: '← Retour', title: 'Générateur de QR Code', subtitle: 'Créez des QR codes pour vos liens', credits: 'GRATUIT', inputLabel: 'Entrez URL ou texte', inputPlaceholder: 'https://votre-site.com ou texte...', generate: 'Générer le QR Code', generating: 'Création du QR code...', result: 'Votre QR Code', download: 'Télécharger', emptyInput: 'Entrez une URL ou du texte', success: 'QR Code créé!' }
}

const langs: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]

export default function QRCodeGeneratorPage() {
  const [input, setInput] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  const handleGenerate = () => {
    if (!input.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true)
    const encoded = encodeURIComponent(input)
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`)
    setTimeout(() => { setLoading(false); showToast(t.success, 'success') }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-800 rounded-xl p-1 border border-gray-700">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`px-2.5 py-1.5 rounded-lg text-sm transition ${language === l.code ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>{l.flag}</button>))}</div>
            <span className="text-2xl">📱</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div>
          <div className="text-5xl mb-4">📱</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">{t.inputLabel}</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.inputPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500" />
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>📱</span>{t.generate}</>)}</button>
        {qrUrl && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 text-center"><h2 className="text-xl font-semibold mb-4">{t.result}</h2><div className="bg-white p-4 rounded-xl inline-block mb-4"><img src={qrUrl} alt="QR Code" className="w-64 h-64" /></div><br /><a href={qrUrl} download="qrcode.png" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition"><span>⬇️</span>{t.download}</a></div>)}
      </main>
    </div>
  )
}
