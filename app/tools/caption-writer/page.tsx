'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Caption Writer', subtitle: 'Generate engaging captions for posts', credits: '2 Credits', topicLabel: 'Topic', topicPlaceholder: 'What is your post about?', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', youtube: 'YouTube' }, toneLabel: 'Tone', tones: { professional: 'Professional', casual: 'Casual', humorous: 'Humorous', inspirational: 'Inspirational' }, optionsLabel: 'Options', emoji: 'Emojis', hashtag: 'Hashtags', generate: 'Generate', generating: 'Writing...', results: 'Captions', copy: 'Copy', copied: 'Copied!', chars: 'chars', emptyInput: 'Enter topic', success: 'Done!', error: 'Error' },
  tr: { back: '← Geri', title: 'Caption Yazarı', subtitle: 'Paylaşımlar için etkileyici captionlar', credits: '2 Kredi', topicLabel: 'Konu', topicPlaceholder: 'Paylaşımınız ne hakkında?', platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', youtube: 'YouTube' }, toneLabel: 'Ton', tones: { professional: 'Profesyonel', casual: 'Samimi', humorous: 'Eğlenceli', inspirational: 'İlham Verici' }, optionsLabel: 'Seçenekler', emoji: 'Emoji', hashtag: 'Hashtag', generate: 'Oluştur', generating: 'Yazılıyor...', results: 'Captionlar', copy: 'Kopyala', copied: 'Kopyalandı!', chars: 'karakter', emptyInput: 'Konu girin', success: 'Tamamlandı!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Генератор подписей', subtitle: 'Подписи для постов', credits: '2 кредита', topicLabel: 'Тема', topicPlaceholder: 'О чём пост?', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', youtube: 'YouTube' }, toneLabel: 'Тон', tones: { professional: 'Профессиональный', casual: 'Дружелюбный', humorous: 'Юмористический', inspirational: 'Вдохновляющий' }, optionsLabel: 'Опции', emoji: 'Эмодзи', hashtag: 'Хэштеги', generate: 'Создать', generating: 'Создание...', results: 'Подписи', copy: 'Копировать', copied: 'Скопировано!', chars: 'символов', emptyInput: 'Введите тему', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Caption-Schreiber', subtitle: 'Captions für Posts', credits: '2 Credits', topicLabel: 'Thema', topicPlaceholder: 'Worum geht es?', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', youtube: 'YouTube' }, toneLabel: 'Ton', tones: { professional: 'Professionell', casual: 'Freundlich', humorous: 'Humorvoll', inspirational: 'Inspirierend' }, optionsLabel: 'Optionen', emoji: 'Emojis', hashtag: 'Hashtags', generate: 'Erstellen', generating: 'Wird erstellt...', results: 'Captions', copy: 'Kopieren', copied: 'Kopiert!', chars: 'Zeichen', emptyInput: 'Thema eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Rédacteur de légendes', subtitle: 'Légendes pour posts', credits: '2 crédits', topicLabel: 'Sujet', topicPlaceholder: 'De quoi parle le post?', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook', youtube: 'YouTube' }, toneLabel: 'Ton', tones: { professional: 'Professionnel', casual: 'Amical', humorous: 'Humoristique', inspirational: 'Inspirant' }, optionsLabel: 'Options', emoji: 'Emojis', hashtag: 'Hashtags', generate: 'Créer', generating: 'Création...', results: 'Légendes', copy: 'Copier', copied: 'Copié!', chars: 'caractères', emptyInput: 'Entrez sujet', success: 'Terminé!', error: 'Erreur' }
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function CaptionWriterPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('casual')
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult([])
    try {
      const res = await fetch('/api/caption-writer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, platform, tone, includeEmojis, includeHashtags, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data.captions); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = (text: string, id: number) => { navigator.clipboard.writeText(text); setCopiedId(id); showToast(t.copied, 'success'); setTimeout(() => setCopiedId(null), 2000) }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3">
            <div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div>
            <span className="text-3xl">✍️</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.topicLabel}</label><textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full h-24 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div><div><label className="block text-sm font-medium text-gray-300 mb-2">{t.toneLabel}</label><select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.tones).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-3">{t.optionsLabel}</label><div className="flex gap-3"><button onClick={() => setIncludeEmojis(!includeEmojis)} className={`px-4 py-2 rounded-xl font-medium transition ${includeEmojis ? 'bg-purple-600' : 'bg-gray-700'}`}>😊 {t.emoji}</button><button onClick={() => setIncludeHashtags(!includeHashtags)} className={`px-4 py-2 rounded-xl font-medium transition ${includeHashtags ? 'bg-purple-600' : 'bg-gray-700'}`}># {t.hashtag}</button></div></div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>✍️</span>{t.generate}</>)}</button>
        {result.length > 0 && (<div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6"><h2 className="text-xl font-semibold mb-4">{t.results}</h2><div className="space-y-4">{result.map((c, i) => (<div key={i} className="bg-gray-900/50 rounded-xl p-5 border border-gray-700"><div className="flex items-center justify-between mb-3"><span className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">{c.id}</span><button onClick={() => handleCopy(c.caption, c.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${copiedId === c.id ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copiedId === c.id ? t.copied : t.copy}</button></div><p className="text-gray-200 whitespace-pre-wrap">{c.caption}</p><p className="text-sm text-gray-500 mt-3">{c.characterCount} {t.chars}</p></div>))}</div></div>)}
      </main>
    </div>
  )
}
