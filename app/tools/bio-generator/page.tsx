'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Bio Generator', subtitle: 'Create compelling profile bios that stand out', credits: 'FREE', inputLabel: 'Tell us about yourself', inputPlaceholder: 'Your profession, interests, achievements...', platformLabel: 'Platform', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', personal: 'Personal Website' }, styleLabel: 'Style', styles: { professional: 'Professional', creative: 'Creative', minimal: 'Minimal', fun: 'Fun & Quirky' }, generate: 'Generate Bio', generating: 'Creating your bio...', result: 'Your Bio', copy: 'Copy', copied: 'Copied!', emptyInput: 'Please tell us about yourself', success: 'Bio generated!', error: 'Error occurred' },
  tr: { back: '← Geri', title: 'Bio Üretici', subtitle: 'Dikkat çeken profil bioları oluşturun', credits: 'ÜCRETSİZ', inputLabel: 'Kendinizi tanıtın', inputPlaceholder: 'Mesleğiniz, ilgi alanlarınız, başarılarınız...', platformLabel: 'Platform', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', personal: 'Kişisel Site' }, styleLabel: 'Stil', styles: { professional: 'Profesyonel', creative: 'Yaratıcı', minimal: 'Minimal', fun: 'Eğlenceli' }, generate: 'Bio Oluştur', generating: 'Bio oluşturuluyor...', result: 'Bionuz', copy: 'Kopyala', copied: 'Kopyalandı!', emptyInput: 'Lütfen kendinizi tanıtın', success: 'Bio oluşturuldu!', error: 'Hata oluştu' },
  ru: { back: '← Назад', title: 'Генератор био', subtitle: 'Создавайте привлекательные био профиля', credits: 'БЕСПЛАТНО', inputLabel: 'Расскажите о себе', inputPlaceholder: 'Ваша профессия, интересы, достижения...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', personal: 'Личный сайт' }, styleLabel: 'Стиль', styles: { professional: 'Профессиональный', creative: 'Креативный', minimal: 'Минимальный', fun: 'Весёлый' }, generate: 'Создать био', generating: 'Создание...', result: 'Ваше био', copy: 'Копировать', copied: 'Скопировано!', emptyInput: 'Расскажите о себе', success: 'Био создано!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Bio-Generator', subtitle: 'Erstellen Sie überzeugende Profil-Bios', credits: 'KOSTENLOS', inputLabel: 'Erzählen Sie über sich', inputPlaceholder: 'Ihr Beruf, Interessen, Erfolge...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', personal: 'Persönliche Website' }, styleLabel: 'Stil', styles: { professional: 'Professionell', creative: 'Kreativ', minimal: 'Minimal', fun: 'Lustig' }, generate: 'Bio generieren', generating: 'Wird erstellt...', result: 'Ihr Bio', copy: 'Kopieren', copied: 'Kopiert!', emptyInput: 'Erzählen Sie über sich', success: 'Bio erstellt!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Générateur de bio', subtitle: 'Créez des bios de profil captivantes', credits: 'GRATUIT', inputLabel: 'Parlez-nous de vous', inputPlaceholder: 'Votre profession, intérêts, réalisations...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', personal: 'Site personnel' }, styleLabel: 'Style', styles: { professional: 'Professionnel', creative: 'Créatif', minimal: 'Minimal', fun: 'Amusant' }, generate: 'Générer le bio', generating: 'Création...', result: 'Votre bio', copy: 'Copier', copied: 'Copié!', emptyInput: 'Parlez-nous de vous', success: 'Bio créé!', error: 'Erreur' }
}

const langs: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]

export default function BioGeneratorPage() {
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [style, setStyle] = useState('professional')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleGenerate = async () => {
    if (!input.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult('')
    try {
      const response = await fetch('/api/bio-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input, platform, style, userId, language }) })
      const data = await response.json()
      if (data.error) { showToast(data.error, 'error') } else { setResult(data.bio || JSON.stringify(data)); showToast(t.success, 'success') }
    } catch (err) { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = () => { navigator.clipboard.writeText(result); setCopied(true); showToast(t.copied, 'success'); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-800 rounded-xl p-1 border border-gray-700">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`px-2.5 py-1.5 rounded-lg text-sm transition ${language === l.code ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>{l.flag}</button>))}</div>
            <span className="text-2xl">👤</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div>
          <div className="text-5xl mb-4">👤</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.inputLabel}</label><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.inputPlaceholder} className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.styleLabel}</label><select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.styles).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>👤</span>{t.generate}</>)}</button>
        {result && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">{t.result}</h2><button onClick={handleCopy} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copied ? t.copied : t.copy}</button></div><div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700"><p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</p></div></div>)}
      </main>
    </div>
  )
}
