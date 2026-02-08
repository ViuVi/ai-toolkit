'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const tones = [
  { value: 'balanced', label: '⚖️ Balanced', labelTr: '⚖️ Dengeli' },
  { value: 'friendly', label: '😊 Friendly', labelTr: '😊 Samimi' },
  { value: 'professional', label: '👔 Professional', labelTr: '👔 Profesyonel' },
]

export default function ReleaseNotesPage() {
  const [changes, setChanges] = useState('')
  const [version, setVersion] = useState('')
  const [tone, setTone] = useState('balanced')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
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
    if (!changes.trim()) {
      showToast(language === 'en' ? 'Please enter change notes' : 'Lütfen değişiklikleri yaz', 'warning')
      return
    }

    setLoading(true)
    setNotes('')

    try {
      const response = await fetch('/api/release-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes, version, tone, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setNotes(data.notes)
        showToast(language === 'en' ? 'Release notes ready!' : 'Sürüm notları hazır!', 'success')
      }
    } catch (err) {
      showToast(t.common.error, 'error')
    }

    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(notes)
    setCopied(true)
    showToast(t.common.copied, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const exampleChanges = language === 'en'
    ? 'Improved dashboard load time by 40%. Added Slack integration. Fixed duplicate invoices bug.'
    : 'Panel yükleme süresini %40 iyileştirdik. Slack entegrasyonu ekledik. Çift fatura hatasını düzelttik.'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{t.common.backToDashboard}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🗒️</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-purple-400 text-sm">{t.tools.releaseNotes.credits}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.tools.releaseNotes.title}</h1>
          <p className="text-gray-400">{t.tools.releaseNotes.description}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">{t.tools.releaseNotes.inputLabel}</label>
            <textarea
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
              className="w-full h-28 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none transition"
              placeholder={t.tools.releaseNotes.inputPlaceholder}
            />
            <button
              onClick={() => setChanges(exampleChanges)}
              className="mt-3 text-sm text-purple-400 hover:underline"
            >
              ✨ {language === 'en' ? 'Use example changes' : 'Örnek değişiklikleri kullan'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-3">{t.tools.releaseNotes.versionLabel}</label>
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none transition"
                placeholder={t.tools.releaseNotes.versionPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">{t.tools.releaseNotes.toneLabel}</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTone(option.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition ${tone === option.value ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                    {language === 'en' ? option.label : option.labelTr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg text-white mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {t.common.loading}</>
          ) : (
            <>🗒️ {t.tools.releaseNotes.button}</>
          )}
        </button>

        {notes && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t.tools.releaseNotes.resultLabel}</h2>
              <button
                onClick={handleCopy}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
              >
                {copied ? '✓' : t.common.copy}
              </button>
            </div>
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                {notes}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 {language === 'en' ? 'Release Note Tips' : 'Sürüm Notu İpuçları'}
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• {language === 'en' ? 'Highlight the user impact, not just the feature' : 'Sadece özelliği değil, kullanıcı etkisini vurgula'}</li>
            <li>• {language === 'en' ? 'Group changes by category (performance, fixes, new)' : 'Değişiklikleri kategoriye göre grupla (performans, düzeltme, yeni)'}</li>
            <li>• {language === 'en' ? 'Add a clear call-to-action at the end' : 'Sonunda net bir aksiyon çağrısı ekle'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
