'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back',
    title: 'Video Script Writer',
    subtitle: 'Create viral scripts for short-form video',
    credits: '4 Credits',
    topicLabel: 'Video Topic',
    topicPlaceholder: 'What is your video about? e.g., "5 productivity tips"',
    platformLabel: 'Platform',
    platforms: { shorts: 'YouTube Shorts', tiktok: 'TikTok', reels: 'Instagram Reels' },
    durationLabel: 'Duration',
    durations: { '15': '15 seconds', '30': '30 seconds', '60': '60 seconds' },
    styleLabel: 'Hook Style',
    styles: { question: 'Question Hook', shocking: 'Shocking Statement', story: 'Story Hook' },
    generate: 'Generate Script',
    generating: 'Creating your script...',
    result: 'Your Script',
    copy: 'Copy All',
    copied: 'Copied!',
    emptyInput: 'Please enter a topic',
    success: 'Script created!',
    error: 'Error occurred'
  },
  tr: {
    back: '← Geri',
    title: 'Video Script Yazarı',
    subtitle: 'Kısa video için viral scriptler oluştur',
    credits: '4 Kredi',
    topicLabel: 'Video Konusu',
    topicPlaceholder: 'Videonuz ne hakkında? örn: "5 verimlilik ipucu"',
    platformLabel: 'Platform',
    platforms: { shorts: 'YouTube Shorts', tiktok: 'TikTok', reels: 'Instagram Reels' },
    durationLabel: 'Süre',
    durations: { '15': '15 saniye', '30': '30 saniye', '60': '60 saniye' },
    styleLabel: 'Hook Stili',
    styles: { question: 'Soru ile Aç', shocking: 'Şok Edici Açılış', story: 'Hikaye ile Başla' },
    generate: 'Script Oluştur',
    generating: 'Script oluşturuluyor...',
    result: 'Scriptiniz',
    copy: 'Tümünü Kopyala',
    copied: 'Kopyalandı!',
    emptyInput: 'Lütfen konu girin',
    success: 'Script oluşturuldu!',
    error: 'Hata oluştu'
  },
  ru: {
    back: '← Назад', title: 'Сценарист видео', subtitle: 'Создавайте вирусные сценарии', credits: '4 кредита',
    topicLabel: 'Тема видео', topicPlaceholder: 'О чём ваше видео?', platformLabel: 'Платформа',
    platforms: { shorts: 'YouTube Shorts', tiktok: 'TikTok', reels: 'Instagram Reels' },
    durationLabel: 'Длительность', durations: { '15': '15 секунд', '30': '30 секунд', '60': '60 секунд' },
    styleLabel: 'Стиль хука', styles: { question: 'Вопрос', shocking: 'Шокирующий', story: 'История' },
    generate: 'Создать', generating: 'Создание...', result: 'Ваш сценарий', copy: 'Копировать', copied: 'Скопировано!',
    emptyInput: 'Введите тему', success: 'Готово!', error: 'Ошибка'
  },
  de: {
    back: '← Zurück', title: 'Video-Skript-Autor', subtitle: 'Erstellen Sie virale Skripte', credits: '4 Credits',
    topicLabel: 'Video-Thema', topicPlaceholder: 'Worum geht es?', platformLabel: 'Plattform',
    platforms: { shorts: 'YouTube Shorts', tiktok: 'TikTok', reels: 'Instagram Reels' },
    durationLabel: 'Dauer', durations: { '15': '15 Sekunden', '30': '30 Sekunden', '60': '60 Sekunden' },
    styleLabel: 'Hook-Stil', styles: { question: 'Frage', shocking: 'Schockierend', story: 'Geschichte' },
    generate: 'Erstellen', generating: 'Wird erstellt...', result: 'Ihr Skript', copy: 'Kopieren', copied: 'Kopiert!',
    emptyInput: 'Thema eingeben', success: 'Fertig!', error: 'Fehler'
  },
  fr: {
    back: '← Retour', title: 'Scénariste vidéo', subtitle: 'Créez des scripts viraux', credits: '4 crédits',
    topicLabel: 'Sujet de la vidéo', topicPlaceholder: 'De quoi parle votre vidéo?', platformLabel: 'Plateforme',
    platforms: { shorts: 'YouTube Shorts', tiktok: 'TikTok', reels: 'Instagram Reels' },
    durationLabel: 'Durée', durations: { '15': '15 secondes', '30': '30 secondes', '60': '60 secondes' },
    styleLabel: 'Style de hook', styles: { question: 'Question', shocking: 'Choquant', story: 'Histoire' },
    generate: 'Créer', generating: 'Création...', result: 'Votre script', copy: 'Copier', copied: 'Copié!',
    emptyInput: 'Entrez un sujet', success: 'Terminé!', error: 'Erreur'
  }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function VideoScriptPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('tiktok')
  const [duration, setDuration] = useState('30')
  const [style, setStyle] = useState('question')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) })
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setResult(null)
    
    try {
      const response = await fetch('/api/video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, duration, style, userId, language })
      })
      const data = await response.json()
      if (data.error) { showToast(data.error, 'error') }
      else { setResult(data.script); showToast(t.success, 'success') }
    } catch (err) { showToast(t.error, 'error') }
    setLoading(false)
  }

  const handleCopy = () => {
    if (!result) return
    const text = result.sections.map((s: any) => `[${s.timestamp}] ${s.title}\n${s.content}`).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true); showToast(t.copied, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700 hover:bg-gray-700 transition">
                <span>🌐</span><span>{language.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {langs.map((l) => (
                  <button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-3xl">🎬</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>💎</span><span>{t.credits}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.topicLabel}</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.topicPlaceholder}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {Object.entries(t.platforms).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.durationLabel}</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {Object.entries(t.durations).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.styleLabel}</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">
                {Object.entries(t.styles).map(([k, v]) => (<option key={k} value={k}>{v as string}</option>))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8"
        >
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>🎬</span>{t.generate}</>)}
        </button>

        {result && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>📝</span>{t.result}
              </h2>
              <button onClick={handleCopy} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                {copied ? t.copied : t.copy}
              </button>
            </div>

            <div className="space-y-4">
              {result.sections?.map((section: any, index: number) => (
                <div key={index} className="bg-gray-900/50 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                      {section.timestamp}
                    </span>
                    <h3 className="font-semibold text-white">{section.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                </div>
              ))}
            </div>

            {result.totalWords && (
              <div className="mt-6 pt-4 border-t border-gray-700 flex items-center gap-6 text-sm text-gray-400">
                <span>📊 {result.totalWords} words</span>
                <span>⏱️ {result.readingTime}</span>
                <span>📱 {result.platform}</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
