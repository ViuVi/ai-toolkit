'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function CaptionWriterPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [tone, setTone] = useState('casual')
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [captions, setCaptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { t, language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast(
        language === 'en' ? 'Please enter a topic' : 'Lütfen bir konu girin',
        'warning'
      )
      return
    }

    setLoading(true)
    setCaptions([])

    try {
      const response = await fetch('/api/caption-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, includeEmojis, includeHashtags, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setCaptions(data.captions)
        showToast(
          language === 'en' ? 'Captions generated!' : 'Captionlar oluşturuldu!',
          'success'
        )
      }
    } catch (err) {
      showToast(t.common.error, 'error')
      console.error('Caption generation error:', err)
    }

    setLoading(false)
  }

  const copyCaption = (caption: string, index: number) => {
    navigator.clipboard.writeText(caption)
    setCopiedIndex(index)
    showToast(
      language === 'en' ? 'Copied!' : 'Kopyalandı!',
      'success'
    )
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  ]

  const tones = [
    { value: 'casual', label: language === 'tr' ? 'Gündelik' : 'Casual', icon: '😊' },
    { value: 'professional', label: language === 'tr' ? 'Profesyonel' : 'Professional', icon: '💼' },
    { value: 'inspirational', label: language === 'tr' ? 'İlham Verici' : 'Inspirational', icon: '✨' },
    { value: 'funny', label: language === 'tr' ? 'Komik' : 'Funny', icon: '😂' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{t.common.backToDashboard}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-pink-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-pink-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">✍️</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-pink-400 text-sm font-medium">
              {language === 'en' ? '✍️ 2 CREDITS - CAPTION TOOL' : '✍️ 2 KREDİ - CAPTION ARACI'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Caption Writer' : 'Caption Writer'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' 
              ? 'Generate engaging captions for Instagram & TikTok' 
              : 'Instagram ve TikTok için etkileşim artıran captionlar'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          {/* Platform */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '1. Platform' : '1. Platform'}
          </label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {platforms.map(p => (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={`p-4 rounded-xl border-2 transition ${
                  platform === p.value
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="text-sm font-medium">{p.label}</div>
              </button>
            ))}
          </div>

          {/* Topic */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '2. Topic' : '2. Konu'}
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-pink-500 focus:outline-none transition mb-6"
            placeholder={language === 'en' ? 'e.g., Morning coffee, Sunset vibes...' : 'örn., Sabah kahvesi, Gün batımı...'}
          />

          {/* Tone */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '3. Tone' : '3. Ton'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {tones.map(t => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`p-3 rounded-xl border-2 transition ${
                  tone === t.value
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{t.icon}</div>
                <div className="text-xs font-medium">{t.label}</div>
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEmojis}
                onChange={(e) => setIncludeEmojis(e.target.checked)}
                className="w-4 h-4 bg-gray-700 border-gray-600 rounded"
              />
              <span className="text-sm">{language === 'en' ? 'Include Emojis' : 'Emoji Ekle'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="w-4 h-4 bg-gray-700 border-gray-600 rounded"
              />
              <span className="text-sm">{language === 'en' ? 'Include Hashtags' : 'Hashtag Ekle'}</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {t.common.loading}</>
          ) : (
            <>✍️ {language === 'en' ? 'Generate Captions' : 'Caption Oluştur'}</>
          )}
        </button>

        {captions.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            {captions.map((caption, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-400">
                    {language === 'en' ? 'Caption' : 'Caption'} {index + 1}
                  </h3>
                  <button
                    onClick={() => copyCaption(caption, index)}
                    className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg text-sm transition"
                  >
                    {copiedIndex === index ? '✓' : '📋'} {language === 'en' ? 'Copy' : 'Kopyala'}
                  </button>
                </div>
                <p className="text-white whitespace-pre-line">{caption}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}