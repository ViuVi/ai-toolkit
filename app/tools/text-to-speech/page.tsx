'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase } from '@/lib/supabase'

export default function TextToSpeechPage() {
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('Joanna')
  const [voices, setVoices] = useState<{[key: string]: any[]}>({})
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    fetchVoices()
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      const { data: creditsData } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user.id)
        .single()
      if (creditsData) setCredits(creditsData.balance)
    }
  }

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/text-to-speech')
      const data = await response.json()
      if (data.voices) {
        setVoices(data.voices)
      }
    } catch (err) {
      console.error('Error fetching voices:', err)
    }
  }

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError(language === 'tr' ? 'Lütfen bir metin girin' : 'Please enter some text')
      return
    }

    if (text.length > 3000) {
      setError(language === 'tr' ? 'Metin çok uzun (max 3000 karakter)' : 'Text too long (max 3000 characters)')
      return
    }

    setLoading(true)
    setError('')
    setAudioUrl(null)

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice: selectedVoice,
          userId,
          language
        })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else if (data.audioUrl) {
        setAudioUrl(data.audioUrl)
        setCredits(prev => prev - 3)
        
        // Otomatik çal
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play()
          }
        }, 500)
      }
    } catch (err) {
      setError(language === 'tr' ? 'Bir hata oluştu' : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = `speech-${Date.now()}.mp3`
      link.click()
    }
  }

  // Ses listesi sıralama
  const languageOrder = [
    'Turkish', 'US English', 'British English', 'Australian English', 'Indian English',
    'German', 'French', 'Canadian French', 'Castilian Spanish', 'Mexican Spanish', 'US Spanish',
    'Italian', 'Brazilian Portuguese', 'Portuguese', 'Russian', 'Japanese', 'Korean',
    'Chinese Mandarin', 'Arabic', 'Dutch', 'Polish', 'Danish', 'Norwegian', 'Swedish',
    'Romanian', 'Icelandic', 'Welsh', 'Welsh English'
  ]

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
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Credits Badge */}
        <div className="text-center mb-6">
          <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
            💰 3 {language === 'tr' ? 'Kredi' : 'Credits'} | {language === 'tr' ? 'Bakiye' : 'Balance'}: {credits}
          </span>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          {/* Voice Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              {language === 'tr' ? 'Ses Seçin' : 'Select Voice'}
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
            >
              {languageOrder.map(lang => (
                voices[lang] && (
                  <optgroup key={lang} label={lang}>
                    {voices[lang].map((voice: any) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} ({voice.gender})
                      </option>
                    ))}
                  </optgroup>
                )
              ))}
            </select>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {language === 'tr' ? 'Metin' : 'Text'} 
              <span className="text-gray-400 ml-2">({text.length}/3000)</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 3000))}
              placeholder={language === 'tr' ? 'Seslendirmek istediğiniz metni yazın...' : 'Enter the text you want to convert to speech...'}
              className="w-full h-48 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 resize-none font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">
              {language === 'tr' 
                ? 'İpucu: Daha iyi telaffuz için cümle sonlarında nokta ve boşluk bırakın.'
                : 'Hint: Leave a space after the dot for better pronunciation.'}
            </p>
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
            disabled={loading || !text.trim() || credits < 3}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                {language === 'tr' ? 'Oluşturuluyor...' : 'Generating...'}
              </>
            ) : credits < 3 ? (
              <>
                <span>⚠️</span>
                {language === 'tr' ? 'Yetersiz Kredi' : 'Insufficient Credits'}
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
        {audioUrl && (
          <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🎧</span>
              {language === 'tr' ? 'Ses Oynatıcı' : 'Audio Player'}
            </h3>

            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              className="w-full mb-4"
              style={{ filter: 'invert(1)' }}
            />

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>⬇️</span>
              {language === 'tr' ? 'MP3 İndir' : 'Download MP3'}
            </button>
          </div>
        )}

        {/* SSML Tips */}
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span>💡</span>
            {language === 'tr' ? 'Gelişmiş Özellikler' : 'Advanced Features'}
          </h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-purple-400 font-medium mb-1">{language === 'tr' ? 'Duraklama ekle:' : 'Add a break:'}</p>
              <code className="bg-gray-700 px-2 py-1 rounded text-gray-300">
                {'Mary had a little lamb <break time="1s"/> Whose fleece was white as snow.'}
              </code>
            </div>
            
            <div>
              <p className="text-purple-400 font-medium mb-1">{language === 'tr' ? 'Vurgulama:' : 'Emphasizing words:'}</p>
              <code className="bg-gray-700 px-2 py-1 rounded text-gray-300">
                {'I <emphasis level="strong">really like</emphasis> that.'}
              </code>
            </div>
            
            <div>
              <p className="text-purple-400 font-medium mb-1">{language === 'tr' ? 'Hız ayarı:' : 'Speed control:'}</p>
              <code className="bg-gray-700 px-2 py-1 rounded text-gray-300">
                {'<prosody rate="slow">Slow speech</prosody>'}
              </code>
            </div>
            
            <div>
              <p className="text-purple-400 font-medium mb-1">{language === 'tr' ? 'Fısıltı:' : 'Whisper:'}</p>
              <code className="bg-gray-700 px-2 py-1 rounded text-gray-300">
                {'<amazon:effect name="whispered">This is a secret</amazon:effect>'}
              </code>
            </div>
          </div>
        </div>

        {/* Supported Languages */}
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span>🌍</span>
            {language === 'tr' ? 'Desteklenen Diller' : 'Supported Languages'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(voices).map(lang => (
              <span key={lang} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
