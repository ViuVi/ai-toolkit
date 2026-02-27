'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Caption Writer', subtitle: 'Write engaging captions for any social media platform', credits: '2 Credits', inputLabel: 'Describe your post or content', inputPlaceholder: 'e.g., Photo of sunset at the beach, product launch announcement...', platformLabel: 'Platform', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', tiktok: 'TikTok' }, toneLabel: 'Tone', tones: { casual: 'Casual', professional: 'Professional', humorous: 'Humorous', inspirational: 'Inspirational' }, generate: 'Generate Caption', generating: 'Writing caption...', result: 'Your Caption', copy: 'Copy', copied: 'Copied!', emptyInput: 'Please describe your content', success: 'Caption generated!', error: 'Error occurred' },
  tr: { back: '← Geri', title: 'Caption Yazarı', subtitle: 'Sosyal medya platformları için etkileyici captionlar', credits: '2 Kredi', inputLabel: 'Postunuzu veya içeriğinizi tanımlayın', inputPlaceholder: 'örn: Sahilde gün batımı fotoğrafı, ürün lansmanı duyurusu...', platformLabel: 'Platform', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', tiktok: 'TikTok' }, toneLabel: 'Ton', tones: { casual: 'Samimi', professional: 'Profesyonel', humorous: 'Esprili', inspirational: 'İlham Verici' }, generate: 'Caption Oluştur', generating: 'Caption yazılıyor...', result: 'Captioniniz', copy: 'Kopyala', copied: 'Kopyalandı!', emptyInput: 'Lütfen içeriğinizi tanımlayın', success: 'Caption oluşturuldu!', error: 'Hata oluştu' },
  ru: { back: '← Назад', title: 'Автор подписей', subtitle: 'Создавайте подписи для социальных сетей', credits: '2 кредита', inputLabel: 'Опишите ваш пост', inputPlaceholder: 'например: Фото заката на пляже...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', tiktok: 'TikTok' }, toneLabel: 'Тон', tones: { casual: 'Непринуждённый', professional: 'Профессиональный', humorous: 'Юмористический', inspirational: 'Вдохновляющий' }, generate: 'Создать подпись', generating: 'Создание...', result: 'Ваша подпись', copy: 'Копировать', copied: 'Скопировано!', emptyInput: 'Опишите контент', success: 'Подпись создана!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Caption-Autor', subtitle: 'Schreiben Sie Captions für Social Media', credits: '2 Credits', inputLabel: 'Beschreiben Sie Ihren Post', inputPlaceholder: 'z.B.: Sonnenuntergangsfoto am Strand...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', tiktok: 'TikTok' }, toneLabel: 'Ton', tones: { casual: 'Locker', professional: 'Professionell', humorous: 'Humorvoll', inspirational: 'Inspirierend' }, generate: 'Caption generieren', generating: 'Wird geschrieben...', result: 'Ihre Caption', copy: 'Kopieren', copied: 'Kopiert!', emptyInput: 'Bitte beschreiben Sie den Inhalt', success: 'Caption erstellt!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Rédacteur de légendes', subtitle: 'Écrivez des légendes pour les réseaux sociaux', credits: '2 Crédits', inputLabel: 'Décrivez votre post', inputPlaceholder: 'ex: Photo de coucher de soleil à la plage...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', tiktok: 'TikTok' }, toneLabel: 'Ton', tones: { casual: 'Décontracté', professional: 'Professionnel', humorous: 'Humoristique', inspirational: 'Inspirant' }, generate: 'Générer la légende', generating: 'Écriture...', result: 'Votre légende', copy: 'Copier', copied: 'Copié!', emptyInput: 'Décrivez le contenu', success: 'Légende créée!', error: 'Erreur' }
}

const langs: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]

export default function CaptionWriterPage() {
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('casual')
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
      const response = await fetch('/api/caption-writer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input, platform, tone, userId, language }) })
      const data = await response.json()
      if (data.error) { showToast(data.error, 'error') } else { setResult(data.caption || JSON.stringify(data)); showToast(t.success, 'success') }
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
            <div className="flex bg-gray-800 rounded-xl p-1 border border-gray-700">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`px-2.5 py-1.5 rounded-lg text-sm transition ${language === l.code ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>{l.flag}</button>))}</div>
            <span className="text-2xl">✍️</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>⚡</span><span>{t.credits}</span></div>
          <div className="text-5xl mb-4">✍️</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.inputLabel}</label><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.inputPlaceholder} className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.toneLabel}</label><select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.tones).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>✍️</span>{t.generate}</>)}</button>
        {result && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">{t.result}</h2><button onClick={handleCopy} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copied ? t.copied : t.copy}</button></div><div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700"><p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</p></div></div>)}
      </main>
    </div>
  )
}
