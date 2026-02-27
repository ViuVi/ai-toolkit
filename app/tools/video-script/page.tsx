'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back to Dashboard',
    title: 'Video Script Writer',
    subtitle: 'Create engaging scripts for YouTube, TikTok, Reels & more',
    credits: '4 Credits',
    topicLabel: 'Video Topic',
    topicPlaceholder: 'What is your video about?',
    platformLabel: 'Platform',
    platforms: { youtube: 'YouTube (Long-form)', tiktok: 'TikTok/Reels (Short)', shorts: 'YouTube Shorts' },
    toneLabel: 'Tone',
    tones: { professional: 'Professional', casual: 'Casual & Fun', educational: 'Educational', motivational: 'Motivational' },
    durationLabel: 'Duration',
    durations: { '30s': '30 seconds', '60s': '1 minute', '3min': '3 minutes', '10min': '10 minutes' },
    generate: 'Generate Script',
    generating: 'Writing your script...',
    result: 'Your Script',
    copy: 'Copy Script',
    copied: 'Copied!',
    emptyInput: 'Please enter a video topic',
    success: 'Script generated!',
    error: 'Something went wrong',
    sections: { hook: 'Hook', intro: 'Introduction', main: 'Main Content', cta: 'Call to Action', outro: 'Outro' }
  },
  tr: {
    back: '← Panele Dön',
    title: 'Video Script Yazarı',
    subtitle: 'YouTube, TikTok, Reels ve daha fazlası için etkileyici scriptler',
    credits: '4 Kredi',
    topicLabel: 'Video Konusu',
    topicPlaceholder: 'Videonuz ne hakkında?',
    platformLabel: 'Platform',
    platforms: { youtube: 'YouTube (Uzun)', tiktok: 'TikTok/Reels (Kısa)', shorts: 'YouTube Shorts' },
    toneLabel: 'Ton',
    tones: { professional: 'Profesyonel', casual: 'Samimi & Eğlenceli', educational: 'Eğitici', motivational: 'Motivasyonel' },
    durationLabel: 'Süre',
    durations: { '30s': '30 saniye', '60s': '1 dakika', '3min': '3 dakika', '10min': '10 dakika' },
    generate: 'Script Oluştur',
    generating: 'Script yazılıyor...',
    result: 'Scriptiniz',
    copy: 'Scripti Kopyala',
    copied: 'Kopyalandı!',
    emptyInput: 'Lütfen video konusu girin',
    success: 'Script oluşturuldu!',
    error: 'Bir hata oluştu',
    sections: { hook: 'Hook', intro: 'Giriş', main: 'Ana İçerik', cta: 'Aksiyon Çağrısı', outro: 'Kapanış' }
  },
  ru: {
    back: '← Назад',
    title: 'Сценарист видео',
    subtitle: 'Создавайте сценарии для YouTube, TikTok, Reels',
    credits: '4 кредита',
    topicLabel: 'Тема видео',
    topicPlaceholder: 'О чём ваше видео?',
    platformLabel: 'Платформа',
    platforms: { youtube: 'YouTube (Длинные)', tiktok: 'TikTok/Reels (Короткие)', shorts: 'YouTube Shorts' },
    toneLabel: 'Тон',
    tones: { professional: 'Профессиональный', casual: 'Непринуждённый', educational: 'Образовательный', motivational: 'Мотивационный' },
    durationLabel: 'Длительность',
    durations: { '30s': '30 секунд', '60s': '1 минута', '3min': '3 минуты', '10min': '10 минут' },
    generate: 'Создать сценарий',
    generating: 'Пишем сценарий...',
    result: 'Ваш сценарий',
    copy: 'Копировать',
    copied: 'Скопировано!',
    emptyInput: 'Введите тему видео',
    success: 'Сценарий создан!',
    error: 'Что-то пошло не так',
    sections: { hook: 'Хук', intro: 'Введение', main: 'Основной контент', cta: 'Призыв к действию', outro: 'Завершение' }
  },
  de: {
    back: '← Zurück',
    title: 'Video-Skript-Autor',
    subtitle: 'Erstellen Sie Skripte für YouTube, TikTok, Reels',
    credits: '4 Credits',
    topicLabel: 'Video-Thema',
    topicPlaceholder: 'Worum geht es in Ihrem Video?',
    platformLabel: 'Plattform',
    platforms: { youtube: 'YouTube (Lang)', tiktok: 'TikTok/Reels (Kurz)', shorts: 'YouTube Shorts' },
    toneLabel: 'Ton',
    tones: { professional: 'Professionell', casual: 'Locker', educational: 'Lehrreich', motivational: 'Motivierend' },
    durationLabel: 'Dauer',
    durations: { '30s': '30 Sekunden', '60s': '1 Minute', '3min': '3 Minuten', '10min': '10 Minuten' },
    generate: 'Skript generieren',
    generating: 'Skript wird geschrieben...',
    result: 'Ihr Skript',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    emptyInput: 'Bitte geben Sie ein Thema ein',
    success: 'Skript erstellt!',
    error: 'Etwas ist schief gelaufen',
    sections: { hook: 'Hook', intro: 'Einleitung', main: 'Hauptinhalt', cta: 'Handlungsaufforderung', outro: 'Abschluss' }
  },
  fr: {
    back: '← Retour',
    title: 'Scénariste Vidéo',
    subtitle: 'Créez des scripts pour YouTube, TikTok, Reels',
    credits: '4 Crédits',
    topicLabel: 'Sujet de la vidéo',
    topicPlaceholder: 'De quoi parle votre vidéo?',
    platformLabel: 'Plateforme',
    platforms: { youtube: 'YouTube (Long)', tiktok: 'TikTok/Reels (Court)', shorts: 'YouTube Shorts' },
    toneLabel: 'Ton',
    tones: { professional: 'Professionnel', casual: 'Décontracté', educational: 'Éducatif', motivational: 'Motivant' },
    durationLabel: 'Durée',
    durations: { '30s': '30 secondes', '60s': '1 minute', '3min': '3 minutes', '10min': '10 minutes' },
    generate: 'Générer le script',
    generating: 'Écriture du script...',
    result: 'Votre script',
    copy: 'Copier',
    copied: 'Copié!',
    emptyInput: 'Veuillez entrer un sujet',
    success: 'Script créé!',
    error: 'Une erreur est survenue',
    sections: { hook: 'Accroche', intro: 'Introduction', main: 'Contenu principal', cta: 'Appel à l\'action', outro: 'Conclusion' }
  }
}

const langs: { code: Language; flag: string }[] = [
  { code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }
]

export default function VideoScriptPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('youtube')
  const [tone, setTone] = useState('casual')
  const [duration, setDuration] = useState('60s')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast(t.emptyInput, 'warning')
      return
    }
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, duration, userId, language }),
      })
      const data = await response.json()
      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setResult(data.script || data)
        showToast(t.success, 'success')
      }
    } catch (err) {
      showToast(t.error, 'error')
    }
    setLoading(false)
  }

  const handleCopy = () => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
    navigator.clipboard.writeText(text)
    setCopied(true)
    showToast(t.copied, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-800 rounded-xl p-1 border border-gray-700">
              {langs.map((l) => (
                <button key={l.code} onClick={() => setLanguage(l.code)} className={`px-2.5 py-1.5 rounded-lg text-sm transition ${language === l.code ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>{l.flag}</button>
              ))}
            </div>
            <span className="text-2xl">🎬</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>⚡</span><span>{t.credits}</span>
          </div>
          <div className="text-5xl mb-4">🎬</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t.topicLabel}</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topicPlaceholder} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.platformLabel}</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500">
                {Object.entries(t.platforms).map(([key, val]) => (<option key={key} value={key}>{val as string}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.toneLabel}</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500">
                {Object.entries(t.tones).map(([key, val]) => (<option key={key} value={key}>{val as string}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t.durationLabel}</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500">
                {Object.entries(t.durations).map(([key, val]) => (<option key={key} value={key}>{val as string}</option>))}
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8 shadow-lg shadow-purple-500/25">
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>🎬</span>{t.generate}</>)}
        </button>

        {result && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t.result}</h2>
              <button onClick={handleCopy} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>{copied ? t.copied : t.copy}</button>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700">
              <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
