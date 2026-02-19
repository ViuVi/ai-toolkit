'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase } from '@/lib/supabase'

export default function TextToSpeechPage() {
  const [text, setText] = useState('')
  const [voiceLanguage, setVoiceLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [audioUrls, setAudioUrls] = useState<string[]>([])
  const [currentChunk, setCurrentChunk] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)
  const { language } = useLanguage()

  const voices = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ]

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError(language === 'tr' ? 'Lütfen bir metin girin' : 'Please enter some text')
      return
    }

    setLoading(true)
    setError('')
    setAudioUrls([])
    setCurrentChunk(0)

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          language: voiceLanguage
        })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setAudioUrls(data.audioUrls)
      }
    } catch (err) {
      setError(language === 'tr' ? 'Bir hata oluştu' : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const playAudio = () => {
    if (audioUrls.length > 0 && audioRef.current) {
      audioRef.current.src = audioUrls[currentChunk]
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleAudioEnded = () => {
    if (currentChunk < audioUrls.length - 1) {
      setCurrentChunk(prev => prev + 1)
    } else {
      setIsPlaying(false)
      setCurrentChunk(0)
    }
  }

  useEffect(() => {
    if (isPlaying && audioUrls.length > 0 && audioRef.current) {
      audioRef.current.src = audioUrls[currentChunk]
      audioRef.current.play()
    }
  }, [currentChunk])

  const downloadAudio = async () => {
    if (audioUrls.length === 0) return
    
    // İlk chunk'ı indir (tam metin için tüm chunk'ları birleştirmek daha karmaşık)
    const link = document.createElement('a')
    link.href = audioUrls[0]
    link.download = `speech-${Date.now()}.mp3`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{language === 'tr' ? 'Geri' : 'Back'}</span>
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span>🔊</span>
            {language === 'tr' ? 'Seslendirme' : 'Text to Speech'}
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Free Badge */}
        <div className="text-center mb-6">
          <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
            ✨ {language === 'tr' ? 'Ücretsiz Araç' : 'Free Tool'}
          </span>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {language === 'tr' ? 'Metin' : 'Text'} 
              <span className="text-gray-400 ml-2">({text.length}/5000)</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 5000))}
              placeholder={language === 'tr' ? 'Seslendirmek istediğiniz metni yazın...' : 'Enter the text you want to convert to speech...'}
              className="w-full h-40 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Voice Language Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {language === 'tr' ? 'Ses Dili' : 'Voice Language'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {voices.map((voice) => (
                <button
                  key={voice.code}
                  onClick={() => setVoiceLanguage(voice.code)}
                  className={`p-3 rounded-xl border transition text-center ${
                    voiceLanguage === voice.code
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{voice.flag}</div>
                  <div className="text-xs">{voice.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !text.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                {language === 'tr' ? 'Oluşturuluyor...' : 'Generating...'}
              </>
            ) : (
              <>
                <span>🔊</span>
                {language === 'tr' ? 'Seslendirmeyi Oluştur' : 'Generate Speech'}
              </>
            )}
          </button>
        </div>

        {/* Audio Player */}
        {audioUrls.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🎧</span>
              {language === 'tr' ? 'Ses Oynatıcı' : 'Audio Player'}
            </h3>

            <audio
              ref={audioRef}
              onEnded={handleAudioEnded}
              className="hidden"
            />

            {/* Player Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setCurrentChunk(Math.max(0, currentChunk - 1))}
                disabled={currentChunk === 0}
                className="p-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-full transition"
              >
                ⏮️
              </button>
              
              <button
                onClick={isPlaying ? pauseAudio : playAudio}
                className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition text-2xl"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <button
                onClick={() => setCurrentChunk(Math.min(audioUrls.length - 1, currentChunk + 1))}
                disabled={currentChunk >= audioUrls.length - 1}
                className="p-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-full transition"
              >
                ⏭️
              </button>
            </div>

            {/* Progress */}
            {audioUrls.length > 1 && (
              <div className="text-center text-gray-400 text-sm mb-4">
                {language === 'tr' ? 'Parça' : 'Part'} {currentChunk + 1} / {audioUrls.length}
              </div>
            )}

            {/* Text Preview */}
            <div className="bg-gray-700/50 rounded-xl p-4 mb-4 max-h-32 overflow-y-auto">
              <p className="text-gray-300 text-sm">{text}</p>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadAudio}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>⬇️</span>
              {language === 'tr' ? 'Ses Dosyasını İndir' : 'Download Audio'}
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>💡</span>
            {language === 'tr' ? 'İpuçları' : 'Tips'}
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• {language === 'tr' ? 'Maksimum 5000 karakter desteklenir' : 'Maximum 5000 characters supported'}</li>
            <li>• {language === 'tr' ? '12 farklı dilde seslendirme yapabilirsiniz' : 'Text to speech available in 12 languages'}</li>
            <li>• {language === 'tr' ? 'Uzun metinler otomatik olarak parçalara bölünür' : 'Long texts are automatically split into chunks'}</li>
            <li>• {language === 'tr' ? 'Video içerikleri, podcast ve sunumlar için idealdir' : 'Perfect for video content, podcasts and presentations'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
