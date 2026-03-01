'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const texts: Record<Language, any> = {
  en: { back: '← Back', title: 'Text to Speech', subtitle: 'Convert text into natural sounding audio', credits: '3 Credits', textLabel: 'Your Text', textPlaceholder: 'Enter text to convert...', voiceLabel: 'Voice', langLabel: 'Language', generate: 'Generate Audio', generating: 'Converting...', result: 'Your Audio', play: 'Play', pause: 'Pause', download: 'Download', chars: 'characters', emptyInput: 'Enter text', success: 'Audio ready!', error: 'Error' },
  tr: { back: '← Geri', title: 'Metinden Sese', subtitle: 'Metni doğal sese dönüştürün', credits: '3 Kredi', textLabel: 'Metniniz', textPlaceholder: 'Dönüştürülecek metni girin...', voiceLabel: 'Ses', langLabel: 'Dil', generate: 'Ses Oluştur', generating: 'Dönüştürülüyor...', result: 'Sesiniz', play: 'Oynat', pause: 'Durdur', download: 'İndir', chars: 'karakter', emptyInput: 'Metin girin', success: 'Ses hazır!', error: 'Hata' },
  ru: { back: '← Назад', title: 'Текст в речь', subtitle: 'Конвертируйте текст в аудио', credits: '3 кредита', textLabel: 'Текст', textPlaceholder: 'Введите текст...', voiceLabel: 'Голос', langLabel: 'Язык', generate: 'Создать', generating: 'Создание...', result: 'Аудио', play: 'Воспроизвести', pause: 'Пауза', download: 'Скачать', chars: 'символов', emptyInput: 'Введите текст', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', title: 'Text zu Sprache', subtitle: 'Text in natürliche Sprache', credits: '3 Credits', textLabel: 'Text', textPlaceholder: 'Text eingeben...', voiceLabel: 'Stimme', langLabel: 'Sprache', generate: 'Erstellen', generating: 'Konvertierung...', result: 'Audio', play: 'Abspielen', pause: 'Pause', download: 'Download', chars: 'Zeichen', emptyInput: 'Text eingeben', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', title: 'Texte en parole', subtitle: 'Convertir texte en audio', credits: '3 crédits', textLabel: 'Texte', textPlaceholder: 'Entrez le texte...', voiceLabel: 'Voix', langLabel: 'Langue', generate: 'Créer', generating: 'Conversion...', result: 'Audio', play: 'Lecture', pause: 'Pause', download: 'Télécharger', chars: 'caractères', emptyInput: 'Entrez texte', success: 'Terminé!', error: 'Erreur' }
}
const voiceGroups: Record<string, {id: string, name: string}[]> = {
  'English (US)': [{ id: 'Joanna', name: 'Joanna (F)' }, { id: 'Matthew', name: 'Matthew (M)' }],
  'English (UK)': [{ id: 'Amy', name: 'Amy (F)' }, { id: 'Brian', name: 'Brian (M)' }],
  'Turkish': [{ id: 'Filiz', name: 'Filiz (F)' }],
  'German': [{ id: 'Marlene', name: 'Marlene (F)' }, { id: 'Hans', name: 'Hans (M)' }],
  'French': [{ id: 'Celine', name: 'Céline (F)' }, { id: 'Mathieu', name: 'Mathieu (M)' }],
  'Spanish': [{ id: 'Lucia', name: 'Lucia (F)' }, { id: 'Enrique', name: 'Enrique (M)' }],
  'Russian': [{ id: 'Tatyana', name: 'Tatyana (F)' }, { id: 'Maxim', name: 'Maxim (M)' }],
  'Japanese': [{ id: 'Mizuki', name: 'Mizuki (F)' }],
  'Korean': [{ id: 'Seoyeon', name: 'Seoyeon (F)' }],
  'Chinese': [{ id: 'Zhiyu', name: 'Zhiyu (F)' }],
  'Italian': [{ id: 'Carla', name: 'Carla (F)' }],
  'Portuguese': [{ id: 'Camila', name: 'Camila (F)' }]
}
const langs = [{ code: 'en' as Language, flag: '🇺🇸', name: 'English' }, { code: 'tr' as Language, flag: '🇹🇷', name: 'Türkçe' }, { code: 'ru' as Language, flag: '🇷🇺', name: 'Русский' }, { code: 'de' as Language, flag: '🇩🇪', name: 'Deutsch' }, { code: 'fr' as Language, flag: '🇫🇷', name: 'Français' }]

export default function TextToSpeechPage() {
  const [text, setText] = useState('')
  const [voiceLang, setVoiceLang] = useState('English (US)')
  const [voice, setVoice] = useState('Joanna')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const t = texts[language]

  useEffect(() => { supabase.auth.getUser().then(({ data: { user } }) => { if (user) setUserId(user.id) }) }, [])

  const handleGenerate = async () => {
    if (!text.trim()) { showToast(t.emptyInput, 'warning'); return }
    setLoading(true); setAudioUrl(null)
    try {
      const res = await fetch('/api/text-to-speech', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text.slice(0,3000), voice, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setAudioUrl(data.audioUrl); showToast(t.success, 'success') }
    } catch { showToast(t.error, 'error') }
    setLoading(false)
  }

  const togglePlay = () => { if (!audioRef.current) return; isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying) }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{t.back}</Link>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700 hover:bg-gray-700 transition"><span>🌐</span><span>{language.toUpperCase()}</span></button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>{l.flag} {l.name}</button>))}
              </div>
            </div>
            <span className="text-3xl">🔊</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4"><span>💎</span><span>{t.credits}</span></div>
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div><div className="flex justify-between mb-2"><label className="text-sm font-medium text-gray-300">{t.textLabel}</label><span className="text-xs text-gray-500">{text.length}/3000</span></div><textarea value={text} onChange={(e) => setText(e.target.value.slice(0,3000))} placeholder={t.textPlaceholder} className="w-full h-40 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.langLabel}</label><select value={voiceLang} onChange={(e) => { setVoiceLang(e.target.value); setVoice(voiceGroups[e.target.value][0].id) }} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{Object.keys(voiceGroups).map(g => (<option key={g} value={g}>{g}</option>))}</select></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{t.voiceLabel}</label><select value={voice} onChange={(e) => setVoice(e.target.value)} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white">{voiceGroups[voiceLang].map(v => (<option key={v.id} value={v.id}>{v.name}</option>))}</select></div>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 mb-8">{loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{t.generating}</>) : (<><span>🔊</span>{t.generate}</>)}</button>
        {audioUrl && (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">{t.result}</h2>
            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
            <div className="flex items-center justify-center gap-4">
              <button onClick={togglePlay} className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl hover:scale-105 transition">{isPlaying ? '⏸️' : '▶️'}</button>
              <a href={audioUrl} download="audio.mp3" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition flex items-center gap-2"><span>⬇️</span>{t.download}</a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
