'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Hashtag Generator', subtitle: 'Generate trending hashtags for maximum reach', credits: 'FREE', inputLabel: 'What is your content about?', inputPlaceholder: 'Describe your post, photo, or video...', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube', linkedin: 'LinkedIn' }, countLabel: 'Number of hashtags', counts: { '10': '10 hashtags', '20': '20 hashtags', '30': '30 hashtags' }, generate: 'Generate Hashtags', generating: 'Finding best hashtags...', result: 'Your Hashtags', copy: 'Copy All', copied: 'Copied!', emptyInput: 'Please describe your content', success: 'Hashtags generated!', error: 'Error occurred' },
  tr: { back: '← Geri', title: 'Hashtag Üretici', subtitle: 'Maksimum erişim için trend hashtagler', credits: 'ÜCRETSİZ', inputLabel: 'İçeriğiniz ne hakkında?', inputPlaceholder: 'Postunuzu, fotoğrafınızı veya videonuzu tanımlayın...', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube', linkedin: 'LinkedIn' }, countLabel: 'Hashtag sayısı', counts: { '10': '10 hashtag', '20': '20 hashtag', '30': '30 hashtag' }, generate: 'Hashtag Oluştur', generating: 'En iyi hashtagler bulunuyor...', result: 'Hashtagleriniz', copy: 'Tümünü Kopyala', copied: 'Kopyalandı!', emptyInput: 'Lütfen içeriğinizi tanımlayın', success: 'Hashtagler oluşturuldu!', error: 'Hata oluştu' },
  ru: { back: '← Назад', title: 'Генератор хэштегов', subtitle: 'Трендовые хэштеги для максимального охвата', credits: 'БЕСПЛАТНО', inputLabel: 'О чём ваш контент?', inputPlaceholder: 'Опишите ваш пост, фото или видео...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube', linkedin: 'LinkedIn' }, countLabel: 'Количество хэштегов', counts: { '10': '10 хэштегов', '20': '20 хэштегов', '30': '30 хэштегов' }, generate: 'Создать хэштеги', generating: 'Поиск лучших хэштегов...', result: 'Ваши хэштеги', copy: 'Копировать все', copied: 'Скопировано!', emptyInput: 'Опишите контент', success: 'Хэштеги созданы!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Hashtag-Generator', subtitle: 'Trendige Hashtags für maximale Reichweite', credits: 'KOSTENLOS', inputLabel: 'Worum geht es in Ihrem Inhalt?', inputPlaceholder: 'Beschreiben Sie Ihren Post, Foto oder Video...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube', linkedin: 'LinkedIn' }, countLabel: 'Anzahl der Hashtags', counts: { '10': '10 Hashtags', '20': '20 Hashtags', '30': '30 Hashtags' }, generate: 'Hashtags generieren', generating: 'Suche beste Hashtags...', result: 'Ihre Hashtags', copy: 'Alle kopieren', copied: 'Kopiert!', emptyInput: 'Beschreiben Sie den Inhalt', success: 'Hashtags erstellt!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Générateur de hashtags', subtitle: 'Hashtags tendance pour une portée maximale', credits: 'GRATUIT', inputLabel: 'De quoi parle votre contenu?', inputPlaceholder: 'Décrivez votre post, photo ou vidéo...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', youtube: 'YouTube', linkedin: 'LinkedIn' }, countLabel: 'Nombre de hashtags', counts: { '10': '10 hashtags', '20': '20 hashtags', '30': '30 hashtags' }, generate: 'Générer les hashtags', generating: 'Recherche des meilleurs hashtags...', result: 'Vos hashtags', copy: 'Tout copier', copied: 'Copié!', emptyInput: 'Décrivez le contenu', success: 'Hashtags créés!', error: 'Erreur' }
}

const langs: { code: Language; flag: string }[] = [{ code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }]

export default function HashtagGeneratorPage() {
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [count, setCount] = useState('20')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleGenerate = async () => {
    if (!input.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setHashtags([])
    try {
      const response = await fetch('/api/hashtag-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input, platform, count: parseInt(count), userId, language }) })
      const data = await response.json()
      if (data.error) { showToast(data.error, 'error') } else { setHashtags(data.hashtags || []); showToast(t.success, 'success') }
    } catch (err) { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = () => { navigator.clipboard.writeText(hashtags.join(' ')); setCopied(true); showToast(t.copied, 'success'); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-800 rounded-xl p-1 border border-gray-700">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`px-2.5 py-1.5 rounded-lg text-sm transition ${language === l.code ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>{l.flag}</button>))}</div>
            <span className="text-2xl">#️⃣</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>🎁</span><span>{t.credits}</span></div>
          <div className="text-5xl mb-4">#️⃣</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.inputLabel}</label><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.inputPlaceholder} className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.countLabel}</label><select value={count} onChange={(e) => setCount(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.counts).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>#️⃣</span>{t.generate}</>)}</button>
        {hashtags.length > 0 && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">{t.result}</h2><button onClick={handleCopy} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copied ? t.copied : t.copy}</button></div><div className="flex flex-wrap gap-2">{hashtags.map((tag, i) => (<span key={i} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">{tag}</span>))}</div></div>)}
      </main>
    </div>
  )
}
