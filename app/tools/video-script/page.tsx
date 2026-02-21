'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function VideoScriptPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('youtube')
  const [duration, setDuration] = useState('60')
  const [style, setStyle] = useState('question')
  const [script, setScript] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
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
      showToast(language === 'en' ? 'Please enter a topic' : 'Lütfen bir konu girin', 'warning')
      return
    }

    setLoading(true)
    setScript(null)

    try {
      const response = await fetch('/api/video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, duration, style, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setScript(data.script)
        showToast(language === 'en' ? 'Script generated!' : 'Script oluşturuldu!', 'success')
      }
    } catch (err) {
      showToast((language === 'tr' ? 'Hata oluştu' : 'An error occurred'), 'error')
    }

    setLoading(false)
  }

  const copyScript = () => {
    if (!script) return
    const text = script.sections.map((s: any) => `[${s.timestamp}] ${s.title}\n${s.content}`).join('\n\n')
    navigator.clipboard.writeText(text)
    showToast(language === 'en' ? 'Copied!' : 'Kopyalandı!', 'success')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{(language === 'tr' ? 'Panele Dön' : 'Back to Dashboard')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-red-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-red-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🎬</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-red-400 text-sm font-medium">
              {language === 'en' ? '🎬 4 CREDITS' : '🎬 4 KREDİ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Video Script Writer' : 'Video Script Writer'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Professional scripts for YouTube & TikTok' : 'YouTube ve TikTok için profesyonel scriptler'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 focus:outline-none">
                <option value="youtube">📺 YouTube</option>
                <option value="tiktok">🎵 TikTok</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Duration' : 'Süre'}</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 focus:outline-none">
                <option value="30">30 {language === 'en' ? 'seconds' : 'saniye'}</option>
                <option value="60">60 {language === 'en' ? 'seconds' : 'saniye'}</option>
                <option value="180">3 {language === 'en' ? 'minutes' : 'dakika'}</option>
              </select>
            </div>
          </div>

          <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Hook Style' : 'Hook Stili'}</label>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: 'question', label: language === 'en' ? 'Question' : 'Soru', icon: '❓' },
              { value: 'shocking', label: language === 'en' ? 'Shocking' : 'Şok', icon: '🔥' },
              { value: 'storytelling', label: language === 'en' ? 'Story' : 'Hikaye', icon: '📖' }
            ].map(s => (
              <button key={s.value} onClick={() => setStyle(s.value)} className={`p-3 rounded-xl border-2 transition ${style === s.value ? 'border-red-500 bg-red-500/10' : 'border-gray-700'}`}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Topic' : 'Konu'}</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 focus:outline-none" placeholder={language === 'en' ? 'e.g., Morning Routine' : 'örn., Sabah Rutini'} />
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8">
          {loading ? <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</> : <>🎬 {language === 'en' ? 'Generate Script' : 'Script Oluştur'}</>}
        </button>

        {script && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                <span className="mr-4">📊 {script.totalWords} {language === 'en' ? 'words' : 'kelime'}</span>
                <span>⏱️ {script.estimatedReadingTime}</span>
              </div>
              <button onClick={copyScript} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition">
                📋 {language === 'en' ? 'Copy' : 'Kopyala'}
              </button>
            </div>
            {script.sections.map((section: any, i: number) => (
              <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-red-400 font-mono text-sm">{section.timestamp}</span>
                  <h3 className="font-bold">{section.title}</h3>
                </div>
                <p className="text-gray-300">{section.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}