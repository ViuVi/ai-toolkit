'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: {
    back: '← Back',
    title: 'Text to Speech',
    subtitle: 'Convert text to natural-sounding voice',
    credits: '3 Credits',
    textLabel: 'Enter your text',
    textPlaceholder: 'Type or paste your text here (max 3000 characters)...',
    voiceLabel: 'Select Voice',
    generate: 'Convert to Speech',
    generating: 'Converting...',
    result: 'Your Audio',
    play: 'Play',
    pause: 'Pause',
    download: 'Download MP3',
    charCount: 'characters',
    emptyInput: 'Please enter text',
    success: 'Audio created!',
    error: 'Error occurred'
  },
  tr: {
    back: '← Geri',
    title: 'Seslendirme',
    subtitle: 'Metni doğal sese dönüştür',
    credits: '3 Kredi',
    textLabel: 'Metninizi girin',
    textPlaceholder: 'Metninizi buraya yazın veya yapıştırın (max 3000 karakter)...',
    voiceLabel: 'Ses Seçin',
    generate: 'Sese Dönüştür',
    generating: 'Dönüştürülüyor...',
    result: 'Sesiniz',
    play: 'Oynat',
    pause: 'Duraklat',
    download: 'MP3 İndir',
    charCount: 'karakter',
    emptyInput: 'Lütfen metin girin',
    success: 'Ses oluşturuldu!',
    error: 'Hata oluştu'
  },
  ru: { back: '← Назад', title: 'Озвучка', subtitle: 'Преобразуйте текст в речь', credits: '3 кредита', textLabel: 'Введите текст', textPlaceholder: 'Введите текст...', voiceLabel: 'Выберите голос', generate: 'Преобразовать', generating: 'Преобразование...', result: 'Ваше аудио', play: 'Воспроизвести', pause: 'Пауза', download: 'Скачать MP3', charCount: 'символов', emptyInput: 'Введите текст', success: 'Аудио создано!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Text zu Sprache', subtitle: 'Text in natürliche Sprache umwandeln', credits: '3 Credits', textLabel: 'Text eingeben', textPlaceholder: 'Text hier eingeben...', voiceLabel: 'Stimme wählen', generate: 'Umwandeln', generating: 'Wird umgewandelt...', result: 'Ihr Audio', play: 'Abspielen', pause: 'Pause', download: 'MP3 herunterladen', charCount: 'Zeichen', emptyInput: 'Text eingeben', success: 'Audio erstellt!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Synthèse vocale', subtitle: 'Convertissez le texte en voix naturelle', credits: '3 crédits', textLabel: 'Entrez votre texte', textPlaceholder: 'Tapez votre texte ici...', voiceLabel: 'Choisir la voix', generate: 'Convertir', generating: 'Conversion...', result: 'Votre audio', play: 'Lire', pause: 'Pause', download: 'Télécharger MP3', charCount: 'caractères', emptyInput: 'Entrez un texte', success: 'Audio créé!', error: 'Erreur' }
}

// Ses listesi - ttsmp3.com benzeri
const VOICE_GROUPS = {
  'English (US)': [
    { id: 'Joanna', name: 'Joanna', gender: '♀ Female' },
    { id: 'Matthew', name: 'Matthew', gender: '♂ Male' },
    { id: 'Ivy', name: 'Ivy', gender: '♀ Child' },
    { id: 'Joey', name: 'Joey', gender: '♂ Male' },
    { id: 'Kendra', name: 'Kendra', gender: '♀ Female' },
    { id: 'Salli', name: 'Salli', gender: '♀ Female' },
  ],
  'English (UK)': [
    { id: 'Amy', name: 'Amy', gender: '♀ Female' },
    { id: 'Brian', name: 'Brian', gender: '♂ Male' },
    { id: 'Emma', name: 'Emma', gender: '♀ Female' },
  ],
  'Turkish': [
    { id: 'Filiz', name: 'Filiz', gender: '♀ Female' },
  ],
  'German': [
    { id: 'Marlene', name: 'Marlene', gender: '♀ Female' },
    { id: 'Hans', name: 'Hans', gender: '♂ Male' },
    { id: 'Vicki', name: 'Vicki', gender: '♀ Female' },
  ],
  'French': [
    { id: 'Celine', name: 'Céline', gender: '♀ Female' },
    { id: 'Mathieu', name: 'Mathieu', gender: '♂ Male' },
    { id: 'Lea', name: 'Léa', gender: '♀ Female' },
  ],
  'Spanish': [
    { id: 'Lucia', name: 'Lucia', gender: '♀ Female' },
    { id: 'Enrique', name: 'Enrique', gender: '♂ Male' },
    { id: 'Conchita', name: 'Conchita', gender: '♀ Female' },
  ],
  'Russian': [
    { id: 'Tatyana', name: 'Tatyana', gender: '♀ Female' },
    { id: 'Maxim', name: 'Maxim', gender: '♂ Male' },
  ],
  'Italian': [
    { id: 'Carla', name: 'Carla', gender: '♀ Female' },
    { id: 'Giorgio', name: 'Giorgio', gender: '♂ Male' },
  ],
  'Portuguese': [
    { id: 'Camila', name: 'Camila', gender: '♀ Female' },
    { id: 'Ricardo', name: 'Ricardo', gender: '♂ Male' },
  ],
  'Japanese': [
    { id: 'Mizuki', name: 'Mizuki', gender: '♀ Female' },
    { id: 'Takumi', name: 'Takumi', gender: '♂ Male' },
  ],
  'Korean': [
    { id: 'Seoyeon', name: 'Seoyeon', gender: '♀ Female' },
  ],
  'Chinese': [
    { id: 'Zhiyu', name: 'Zhiyu', gender: '♀ Female' },
  ],
  'Arabic': [
    { id: 'Zeina', name: 'Zeina', gender: '♀ Female' },
  ],
  'Dutch': [
    { id: 'Lotte', name: 'Lotte', gender: '♀ Female' },
    { id: 'Ruben', name: 'Ruben', gender: '♂ Male' },
  ],
  'Polish': [
    { id: 'Ewa', name: 'Ewa', gender: '♀ Female' },
    { id: 'Jacek', name: 'Jacek', gender: '♂ Male' },
  ],
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function TextToSpeechPage() {
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('Joanna')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) })
  }, [])

  const handleGenerate = async () => {
    if (!text.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setAudioUrl(null)
    
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, userId, language })
      })
      const data = await response.json()
      if (data.error) { showToast(data.error, 'error') }
      else if (data.audioUrl) { setAudioUrl(data.audioUrl); showToast(t.success, 'success') }
    } catch (err) { showToast(t.error, 'error') }
    setLoading(false)
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause() }
    else { audioRef.current.play() }
    setPlaying(!playing)
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
                {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}
              </div>
            </div>
            <span className="text-3xl">🔊</span>
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
          {/* Text Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">{t.textLabel}</label>
              <span className="text-xs text-gray-500">{text.length}/3000 {t.charCount}</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 3000))}
              placeholder={t.textPlaceholder}
              className="w-full h-40 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">{t.voiceLabel}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
              {Object.entries(VOICE_GROUPS).map(([group, voices]) => (
                <div key={group} className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase">{group}</h4>
                  {voices.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        voice === v.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <span className="font-medium">{v.name}</span>
                      <span className="text-xs ml-2 opacity-70">{v.gender}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8"
        >
          {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>🔊</span>{t.generate}</>)}
        </button>

        {audioUrl && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🎵</span>{t.result}
            </h2>
            
            <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
            
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-2xl hover:scale-105 transition"
              >
                {playing ? '⏸️' : '▶️'}
              </button>
              
              <div className="flex-1">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-0 transition-all duration-300" style={{ width: playing ? '100%' : '0%' }}></div>
                </div>
                <p className="text-sm text-gray-400 mt-2">Voice: {voice}</p>
              </div>
              
              <a
                href={audioUrl}
                download="speech.mp3"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition flex items-center gap-2"
              >
                <span>⬇️</span>{t.download}
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
