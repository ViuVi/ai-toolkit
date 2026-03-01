'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Platform Adapter', subtitle: 'Adapt content for different platforms', credits: '3 Credits', contentLabel: 'Content', contentPlaceholder: 'Paste your content...', targetLabel: 'Target Platforms', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' }, adapt: 'Adapt', adapting: 'Adapting...', results: 'Adapted Content', chars: 'chars', copy: 'Copy', copied: 'Copied!', emptyInput: 'Enter content', selectPlatform: 'Select platform', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Platform Uyarlayıcı', subtitle: 'İçeriği farklı platformlara uyarlayın', credits: '3 Kredi', contentLabel: 'İçerik', contentPlaceholder: 'İçeriğinizi yapıştırın...', targetLabel: 'Hedef Platformlar', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' }, adapt: 'Uyarla', adapting: 'Uyarlanıyor...', results: 'Uyarlanmış İçerik', chars: 'karakter', copy: 'Kopyala', copied: 'Kopyalandı!', emptyInput: 'İçerik girin', selectPlatform: 'Platform seçin', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Адаптер платформ', subtitle: 'Адаптируйте контент', credits: '3 кредита', contentLabel: 'Контент', contentPlaceholder: 'Вставьте контент...', targetLabel: 'Платформы', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' }, adapt: 'Адаптировать', adapting: 'Адаптация...', results: 'Результат', chars: 'символов', copy: 'Копировать', copied: 'Скопировано!', emptyInput: 'Введите контент', selectPlatform: 'Выберите', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Plattform-Adapter', subtitle: 'Inhalte anpassen', credits: '3 Credits', contentLabel: 'Inhalt', contentPlaceholder: 'Inhalt einfügen...', targetLabel: 'Zielplattformen', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' }, adapt: 'Anpassen', adapting: 'Anpassung...', results: 'Ergebnis', chars: 'Zeichen', copy: 'Kopieren', copied: 'Kopiert!', emptyInput: 'Inhalt eingeben', selectPlatform: 'Wählen', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Adaptateur', subtitle: 'Adaptez le contenu', credits: '3 crédits', contentLabel: 'Contenu', contentPlaceholder: 'Collez contenu...', targetLabel: 'Plateformes', platforms: { instagram: 'Instagram', twitter: 'Twitter/X', linkedin: 'LinkedIn', tiktok: 'TikTok', facebook: 'Facebook' }, adapt: 'Adapter', adapting: 'Adaptation...', results: 'Résultat', chars: 'caractères', copy: 'Copier', copied: 'Copié!', emptyInput: 'Entrez contenu', selectPlatform: 'Choisir', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]
const platformIcons: Record<string, string> = { instagram: '📸', twitter: '🐦', linkedin: '💼', tiktok: '🎵', facebook: '👥' }

export default function PlatformAdapterPage() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'twitter'])
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])
  const togglePlatform = (p: string) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const handleAdapt = async () => {
    if (!content.trim()) { showToast(t.emptyInput, 'warning'); return }
    if (selectedPlatforms.length === 0) { showToast(t.selectPlatform, 'warning'); return }
    setLoading(true); setResult([])
    try {
      const res = await fetch('/api/platform-adapter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, targetPlatforms: selectedPlatforms, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.adaptations); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopiedId(id); showToast(t.copied, 'success'); setTimeout(() => setCopiedId(null), 2000) }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">🔄</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.contentLabel}</label><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={t.contentPlaceholder} className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-3">{t.targetLabel}</label><div className="flex flex-wrap gap-2">{Object.entries(t.platforms).map(([k, v]) => (<button key={k} onClick={() => togglePlatform(k)} className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${selectedPlatforms.includes(k) ? 'bg-purple-600' : 'bg-gray-700'}`}><span>{platformIcons[k]}</span>{v as string}</button>))}</div></div>
        </div>
        <button onClick={handleAdapt} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.adapting}</>) : (<><span>🔄</span>{t.adapt}</>)}</button>
        {result.length > 0 && (
          <div className="space-y-4"><h2 className="text-xl font-semibold">{t.results}</h2>{result.map((item, i) => (
            <div key={i} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-5">
              <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><span className="text-2xl">{platformIcons[item.platform]}</span><span className="font-semibold">{item.platformName}</span></div><button onClick={() => handleCopy(item.content, item.platform)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${copiedId === item.platform ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copiedId === item.platform ? t.copied : t.copy}</button></div>
              <p className="text-gray-300 whitespace-pre-wrap mb-3">{item.content}</p>
              <p className="text-sm text-gray-500">{item.characterCount} {t.chars}</p>
            </div>
          ))}</div>
        )}
      </main>
    </div>
  )
}
