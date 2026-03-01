'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Bio Generator', subtitle: 'Create professional bios for social profiles', credits: 'FREE', nameLabel: 'Name/Brand', namePlaceholder: 'Your name', professionLabel: 'Profession', professionPlaceholder: 'e.g. Digital Marketer', platformLabel: 'Platform', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, styleLabel: 'Style', styles: { professional: 'Professional', creative: 'Creative', minimal: 'Minimal', fun: 'Fun' }, generate: 'Generate', generating: 'Creating...', result: 'Your Bio', copy: 'Copy', copied: 'Copied!', chars: 'chars', emptyInput: 'Fill all fields', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Bio Üretici', subtitle: 'Sosyal profiller için profesyonel biyografiler', credits: 'ÜCRETSİZ', nameLabel: 'İsim/Marka', namePlaceholder: 'İsminiz', professionLabel: 'Meslek', professionPlaceholder: 'örn: Dijital Pazarlamacı', platformLabel: 'Platform', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, styleLabel: 'Stil', styles: { professional: 'Profesyonel', creative: 'Yaratıcı', minimal: 'Minimal', fun: 'Eğlenceli' }, generate: 'Oluştur', generating: 'Oluşturuluyor...', result: 'Biyografiniz', copy: 'Kopyala', copied: 'Kopyalandı!', chars: 'karakter', emptyInput: 'Alanları doldurun', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Генератор био', subtitle: 'Профессиональные био', credits: 'БЕСПЛАТНО', nameLabel: 'Имя', namePlaceholder: 'Ваше имя', professionLabel: 'Профессия', professionPlaceholder: 'напр: Маркетолог', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, styleLabel: 'Стиль', styles: { professional: 'Профессиональный', creative: 'Креативный', minimal: 'Минимальный', fun: 'Веселый' }, generate: 'Создать', generating: 'Создание...', result: 'Ваше био', copy: 'Копировать', copied: 'Скопировано!', chars: 'символов', emptyInput: 'Заполните поля', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Bio-Generator', subtitle: 'Professionelle Bios', credits: 'KOSTENLOS', nameLabel: 'Name', namePlaceholder: 'Ihr Name', professionLabel: 'Beruf', professionPlaceholder: 'z.B. Marketing', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, styleLabel: 'Stil', styles: { professional: 'Professionell', creative: 'Kreativ', minimal: 'Minimal', fun: 'Lustig' }, generate: 'Erstellen', generating: 'Wird erstellt...', result: 'Ihr Bio', copy: 'Kopieren', copied: 'Kopiert!', chars: 'Zeichen', emptyInput: 'Felder ausfüllen', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Générateur de bio', subtitle: 'Bios professionnelles', credits: 'GRATUIT', nameLabel: 'Nom', namePlaceholder: 'Votre nom', professionLabel: 'Profession', professionPlaceholder: 'ex: Marketing', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok' }, styleLabel: 'Style', styles: { professional: 'Professionnel', creative: 'Créatif', minimal: 'Minimal', fun: 'Amusant' }, generate: 'Créer', generating: 'Création...', result: 'Votre bio', copy: 'Copier', copied: 'Copié!', chars: 'caractères', emptyInput: 'Remplir champs', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function BioGeneratorPage() {
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [style, setStyle] = useState('professional')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  const handleGenerate = async () => {
    if (!name.trim() || !profession.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/bio-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, profession, platform, style, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.bio); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = () => { navigator.clipboard.writeText(result?.bio || ''); setCopied(true); showToast(t.copied, 'success'); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">👤</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.nameLabel}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.professionLabel}</label><input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} placeholder={t.professionPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.styleLabel}</label><select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.styles).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>👤</span>{t.generate}</>)}</button>
        {result && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">{t.result}</h2><button onClick={handleCopy} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copied ? t.copied : t.copy}</button></div><div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700"><p className="text-gray-200 leading-relaxed">{result.bio}</p><p className="text-sm text-gray-500 mt-3">{result.characterCount} {t.chars}</p></div></div>)}
      </main>
    </div>
  )
}
