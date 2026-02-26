'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function SubtitleGeneratorPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [targetLanguage, setTargetLanguage] = useState('tr')
  const [format, setFormat] = useState('srt')
  const [subtitles, setSubtitles] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { t, language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  const uiLanguages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'tr', label: 'TR' },
    { code: 'ru', label: 'RU' },
    { code: 'de', label: 'DE' },
    { code: 'fr', label: 'FR' }
  ]

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Video dosyası kontrolü
      if (!file.type.startsWith('video/')) {
        showToast(
          language === 'tr'
            ? 'Lütfen bir video dosyası seçin'
            : language === 'ru'
            ? 'Пожалуйста, выберите видеофайл'
            : language === 'de'
            ? 'Bitte wählen Sie eine Videodatei aus'
            : language === 'fr'
            ? 'Veuillez sélectionner un fichier vidéo'
            : 'Please select a video file',
          'warning'
        )
        return
      }
      
      // Boyut kontrolü (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        showToast(
          language === 'tr'
            ? 'Dosya çok büyük (maksimum 100MB)'
            : language === 'ru'
            ? 'Файл слишком большой (макс. 100 МБ)'
            : language === 'de'
            ? 'Datei zu groß (max. 100 MB)'
            : language === 'fr'
            ? 'Fichier trop volumineux (max 100 Mo)'
            : 'File too large (max 100MB)',
          'warning'
        )
        return
      }
      
      setVideoFile(file)
      showToast(
        language === 'tr'
          ? `Dosya seçildi: ${file.name}`
          : language === 'ru'
          ? `Файл выбран: ${file.name}`
          : language === 'de'
          ? `Datei ausgewählt: ${file.name}`
          : language === 'fr'
          ? `Fichier sélectionné : ${file.name}`
          : `File selected: ${file.name}`,
        'success'
      )
    }
  }

  const handleGenerate = async () => {
    if (!videoFile) {
      showToast(
        language === 'tr'
          ? 'Lütfen bir video dosyası seçin'
          : language === 'ru'
          ? 'Пожалуйста, выберите видеофайл'
          : language === 'de'
          ? 'Bitte wählen Sie eine Videodatei aus'
          : language === 'fr'
          ? 'Veuillez sélectionner un fichier vidéo'
          : 'Please select a video file',
        'warning'
      )
      return
    }

    setLoading(true)
    setSubtitles(null)

    try {
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('targetLanguage', targetLanguage)
      formData.append('format', format)
      if (userId) formData.append('userId', userId)
      formData.append('language', language)

      const response = await fetch('/api/subtitle-generator', {
        method: 'POST',
        body: formData, // FormData otomatik olarak multipart/form-data olur
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setSubtitles(data.subtitles)
        showToast(
          language === 'tr'
            ? 'Alt yazılar oluşturuldu!'
            : language === 'ru'
            ? 'Субтитры сгенерированы!'
            : language === 'de'
            ? 'Untertitel wurden erstellt!'
            : language === 'fr'
            ? 'Sous-titres générés !'
            : 'Subtitles generated!',
          'success'
        )
      }
    } catch (err) {
      showToast(
        language === 'tr'
          ? 'Bir hata oluştu'
          : language === 'ru'
          ? 'Произошла ошибка'
          : language === 'de'
          ? 'Ein Fehler ist aufgetreten'
          : language === 'fr'
          ? 'Une erreur est survenue'
          : 'An error occurred',
        'error'
      )
      console.error('Subtitle generation error:', err)
    }

    setLoading(false)
  }

  const copyToClipboard = () => {
    if (subtitles?.subtitle) {
      navigator.clipboard.writeText(subtitles.subtitle)
      setCopied(true)
      showToast(
        language === 'tr'
          ? 'Panoya kopyalandı!'
          : language === 'ru'
          ? 'Скопировано в буфер обмена!'
          : language === 'de'
          ? 'In die Zwischenablage kopiert!'
          : language === 'fr'
          ? 'Copié dans le presse-papiers !'
          : 'Copied to clipboard!',
        'success'
      )
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadSubtitle = () => {
    if (subtitles?.subtitle) {
      const blob = new Blob([subtitles.subtitle], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `subtitle.${format}`
      a.click()
      URL.revokeObjectURL(url)
      showToast(
        language === 'tr'
          ? 'İndirildi!'
          : language === 'ru'
          ? 'Скачано!'
          : language === 'de'
          ? 'Heruntergeladen!'
          : language === 'fr'
          ? 'Téléchargé !'
          : 'Downloaded!',
        'success'
      )
    }
  }

  const languages = [
    { value: 'tr', label: language === 'tr' ? '🇹🇷 Türkçe' : '🇹🇷 Turkish' },
    { value: 'en', label: language === 'tr' ? '🇬🇧 İngilizce' : '🇬🇧 English' },
    { value: 'es', label: language === 'tr' ? '🇪🇸 İspanyolca' : '🇪🇸 Spanish' },
    { value: 'fr', label: language === 'tr' ? '🇫🇷 Fransızca' : '🇫🇷 French' },
    { value: 'de', label: language === 'tr' ? '🇩🇪 Almanca' : '🇩🇪 German' },
    { value: 'ar', label: language === 'tr' ? '🇸🇦 Arapça' : '🇸🇦 Arabic' },
  ]

  const formats = [
    { value: 'srt', label: 'SRT', desc: language === 'tr' ? 'En yaygın format' : 'Most common format' },
    { value: 'vtt', label: 'VTT', desc: language === 'tr' ? 'Web videoları için' : 'For web videos' },
    { value: 'txt', label: 'TXT', desc: language === 'tr' ? 'Sadece metin' : 'Text only' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>
              {language === 'tr'
                ? 'Panele Dön'
                : language === 'ru'
                ? 'Назад к панели'
                : language === 'de'
                ? 'Zurück zum Dashboard'
                : language === 'fr'
                ? 'Retour au tableau de bord'
                : 'Back to Dashboard'}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              {uiLanguages.map((langOpt) => (
                <button
                  key={langOpt.code}
                  onClick={() => setLanguage(langOpt.code)}
                  className={`px-2 py-1 rounded text-xs transition ${
                    language === langOpt.code ? 'bg-purple-500 text-white' : 'text-gray-400'
                  }`}
                >
                  {langOpt.label}
                </button>
              ))}
            </div>
            <span className="text-2xl">📝</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-purple-400 text-sm font-medium">
              {language === 'en' ? '📝 4 CREDITS - AI POWERED' : '📝 4 KREDİ - AI DESTEKLİ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Subtitle Generator' : 'Alt Yazı Ekleyici'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' 
              ? 'Add AI-generated subtitles to your videos with Whisper' 
              : 'Whisper ile videolarınıza AI destekli alt yazı ekleyin'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          {/* Video Upload */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '1. Upload Video' : '1. Video Yükle'}
          </label>
          <div className="mb-6">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="block w-full p-8 border-2 border-dashed border-gray-700 rounded-xl hover:border-purple-500 transition cursor-pointer text-center"
            >
              {videoFile ? (
                <div>
                  <div className="text-4xl mb-2">✅</div>
                  <div className="font-medium mb-1">{videoFile.name}</div>
                  <div className="text-sm text-gray-400">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">📹</div>
                  <div className="font-medium mb-1">
                    {language === 'en' ? 'Click to upload video' : 'Video yüklemek için tıklayın'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {language === 'en' ? 'MP4, MOV, AVI (max 100MB)' : 'MP4, MOV, AVI (maks 100MB)'}
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Language Selection */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '2. Subtitle Language' : '2. Alt Yazı Dili'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {languages.map(lang => (
              <button
                key={lang.value}
                onClick={() => setTargetLanguage(lang.value)}
                className={`p-3 rounded-xl border-2 transition ${
                  targetLanguage === lang.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium">{lang.label}</div>
              </button>
            ))}
          </div>

          {/* Format Selection */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? '3. Output Format' : '3. Çıktı Formatı'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {formats.map(f => (
              <button
                key={f.value}
                onClick={() => setFormat(f.value)}
                className={`p-4 rounded-xl border-2 transition ${
                  format === f.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="font-bold mb-1">{f.label}</div>
                <div className="text-xs text-gray-400">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !videoFile}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {language === 'en' ? 'Generating...' : 'Oluşturuluyor...'}</>
          ) : (
            <>📝 {language === 'en' ? 'Generate Subtitles' : 'Alt Yazı Oluştur'}</>
          )}
        </button>

        {subtitles && (
          <div className="animate-fade-in space-y-6">
            {/* Warning if demo mode */}
            {subtitles.warning && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-sm text-yellow-400">{subtitles.warning}</p>
              </div>
            )}

            {/* Info */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4">
                {language === 'en' ? '📋 Subtitle Information' : '📋 Alt Yazı Bilgisi'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    {language === 'en' ? 'Video' : 'Video'}
                  </div>
                  <div className="font-medium text-sm truncate">{subtitles.videoName}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    {language === 'en' ? 'Language' : 'Dil'}
                  </div>
                  <div className="font-medium">{subtitles.language.toUpperCase()}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    {language === 'en' ? 'Format' : 'Format'}
                  </div>
                  <div className="font-medium">{subtitles.format.toUpperCase()}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    {language === 'en' ? 'Lines' : 'Satır'}
                  </div>
                  <div className="font-medium">{subtitles.lineCount}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    {language === 'en' ? 'Source' : 'Kaynak'}
                  </div>
                  <div className="font-medium text-xs">{subtitles.source}</div>
                </div>
              </div>
            </div>

            {/* Subtitle Content */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {language === 'en' ? '📄 Subtitle File' : '📄 Alt Yazı Dosyası'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm flex items-center gap-2"
                  >
                    {copied ? '✓' : '📋'} {language === 'en' ? 'Copy' : 'Kopyala'}
                  </button>
                  <button
                    onClick={downloadSubtitle}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition text-sm flex items-center gap-2"
                  >
                    ⬇️ {language === 'en' ? 'Download' : 'İndir'}
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                  {subtitles.subtitle}
                </pre>
              </div>
            </div>
          </div>
        )}

        {!subtitles && (
          <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              💡 {language === 'en' ? 'How it works' : 'Nasıl Çalışır'}
            </h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>• {language === 'en' ? 'Upload your video file (max 100MB)' : 'Video dosyanızı yükleyin (max 100MB)'}</li>
              <li>• {language === 'en' ? 'Select subtitle language (6 languages)' : 'Alt yazı dilini seçin (6 dil)'}</li>
              <li>• {language === 'en' ? 'Choose output format (SRT/VTT/TXT)' : 'Çıktı formatını seçin (SRT/VTT/TXT)'}</li>
              <li>• {language === 'en' ? 'AI transcribes with Whisper (OpenAI)' : 'AI Whisper ile transkribe eder (OpenAI)'}</li>
              <li>• {language === 'en' ? 'Download or copy subtitles' : 'Alt yazıları indirin veya kopyalayın'}</li>
              <li>• {language === 'en' ? 'Use in any video editor' : 'Tüm video editörlerde kullanın'}</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}