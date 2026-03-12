'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { 
    back: '← Back', title: 'Caption Writer', subtitle: 'Generate professional, engaging captions for your posts', credits: '2 Credits',
    topicLabel: 'Topic / Content Description', topicPlaceholder: 'Describe what your post is about...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook' },
    toneLabel: 'Tone', tones: { professional: 'Professional', casual: 'Casual & Friendly', humorous: 'Humorous', inspirational: 'Inspirational' },
    optionsLabel: 'Options', emojis: 'Include Emojis', hashtags: 'Include Hashtags',
    generate: 'Generate Captions', generating: 'AI writing captions...',
    results: 'Your Captions', hookType: 'Hook', cta: 'CTA', chars: 'chars', copy: 'Copy', copied: 'Copied!',
    emptyInput: 'Enter your topic', success: 'Captions generated!', error: 'Error'
  },
  tr: { 
    back: '← Geri', title: 'Caption Yazarı', subtitle: 'Profesyonel ve etkileyici caption\'lar oluşturun', credits: '2 Kredi',
    topicLabel: 'Konu / İçerik Açıklaması', topicPlaceholder: 'Gönderinizin ne hakkında olduğunu açıklayın...',
    platformLabel: 'Platform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook' },
    toneLabel: 'Ton', tones: { professional: 'Profesyonel', casual: 'Samimi & Arkadaşça', humorous: 'Eğlenceli', inspirational: 'İlham Verici' },
    optionsLabel: 'Seçenekler', emojis: 'Emoji Ekle', hashtags: 'Hashtag Ekle',
    generate: 'Caption Oluştur', generating: 'AI caption yazıyor...',
    results: 'Caption\'larınız', hookType: 'Hook', cta: 'CTA', chars: 'karakter', copy: 'Kopyala', copied: 'Kopyalandı!',
    emptyInput: 'Konunuzu girin', success: 'Caption\'lar oluşturuldu!', error: 'Hata'
  },
  ru: { back: '← Назад', title: 'Автор подписей', subtitle: 'Создавайте профессиональные подписи', credits: '2 кредита', topicLabel: 'Тема', topicPlaceholder: 'Опишите тему...', platformLabel: 'Платформа', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook' }, toneLabel: 'Тон', tones: { professional: 'Профессиональный', casual: 'Дружелюбный', humorous: 'Юмористический', inspirational: 'Вдохновляющий' }, optionsLabel: 'Опции', emojis: 'Эмодзи', hashtags: 'Хэштеги', generate: 'Создать', generating: 'Создание...', results: 'Результаты', hookType: 'Хук', cta: 'CTA', chars: 'символов', copy: 'Копировать', copied: 'Скопировано!', emptyInput: 'Введите тему', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Caption-Schreiber', subtitle: 'Professionelle Captions erstellen', credits: '2 Credits', topicLabel: 'Thema', topicPlaceholder: 'Thema beschreiben...', platformLabel: 'Plattform', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook' }, toneLabel: 'Ton', tones: { professional: 'Professionell', casual: 'Freundlich', humorous: 'Humorvoll', inspirational: 'Inspirierend' }, optionsLabel: 'Optionen', emojis: 'Emojis', hashtags: 'Hashtags', generate: 'Erstellen', generating: 'Erstelle...', results: 'Ergebnisse', hookType: 'Hook', cta: 'CTA', chars: 'Zeichen', copy: 'Kopieren', copied: 'Kopiert!', emptyInput: 'Thema eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Rédacteur de légendes', subtitle: 'Créez des légendes professionnelles', credits: '2 crédits', topicLabel: 'Sujet', topicPlaceholder: 'Décrivez le sujet...', platformLabel: 'Plateforme', platforms: { instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter/X', linkedin: 'LinkedIn', facebook: 'Facebook' }, toneLabel: 'Ton', tones: { professional: 'Professionnel', casual: 'Amical', humorous: 'Humoristique', inspirational: 'Inspirant' }, optionsLabel: 'Options', emojis: 'Emojis', hashtags: 'Hashtags', generate: 'Créer', generating: 'Création...', results: 'Résultats', hookType: 'Hook', cta: 'CTA', chars: 'caractères', copy: 'Copier', copied: 'Copié!', emptyInput: 'Entrez sujet', success: 'Terminé!', error: 'Erreur' }
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
      if (data.error) { showToast(data.error, 'error'); setLoading(false); return }
      
      // API'den gelen veriyi normalize et
      let captions = data.captions || []
      if (!Array.isArray(captions)) captions = []
      
      // Her caption'ın doğru formatta olduğundan emin ol
      const normalizedCaptions = captions.map((c: any, i: number) => ({
        id: c.id || i + 1,
        caption: c.caption || c.text || c.content || String(c),
        characterCount: c.characterCount || c.character_count || (c.caption || c.text || '').length,
        hookType: c.hookType || c.hook_type || '',
        cta: c.cta || ''
      }))
      
      setResult(normalizedCaptions)
      if (normalizedCaptions.length > 0) showToast(t.success, 'success')
    } catch (err) { console.error('Caption error:', err); showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    showToast(t.copied, 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3"><div className="relative group"><button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700"><span>🌐</span><span>{language.toUpperCase()}</span></button><div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">{langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}</div></div><span className="text-3xl">✍️</span></div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-400">{t.subtitle}</p></div>
        
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.topicLabel}</label><textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full h-24 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.toneLabel}</label><select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.entries(t.tones).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}</select></div>
          </div>

          <div><label className="block text-sm font-medium text-gray-300 mb-3">{t.optionsLabel}</label><div className="flex gap-4"><button onClick={() => setIncludeEmojis(!includeEmojis)} className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${includeEmojis ? 'bg-purple-600' : 'bg-gray-700'}`}><span>😀</span>{t.emojis}</button><button onClick={() => setIncludeHashtags(!includeHashtags)} className={`px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${includeHashtags ? 'bg-purple-600' : 'bg-gray-700'}`}><span>#️⃣</span>{t.hashtags}</button></div></div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>✍️</span>{t.generate}</>)}</button>

        {result.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><span>📝</span>{t.results}</h2>
            {result.map((caption, i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl border border-gray-700 p-5 hover:border-purple-500/50 transition">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{caption.id}</span>
                  <button onClick={() => handleCopy(caption.caption, caption.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition flex-shrink-0 ${copiedId === caption.id ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copiedId === caption.id ? t.copied : t.copy}</button>
                </div>
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed mb-4">{caption.caption}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">{caption.characterCount} {t.chars}</span>
                  {caption.hookType && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{t.hookType}: {caption.hookType}</span>}
                  {caption.cta && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">{t.cta}: {caption.cta}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
