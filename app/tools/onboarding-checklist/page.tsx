'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function OnboardingChecklistPage() {
  const [product, setProduct] = useState('')
  const [role, setRole] = useState('')
  const [checklist, setChecklist] = useState('')
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
    if (!product.trim()) {
      showToast(language === 'en' ? 'Please describe your product' : 'Lütfen ürününü anlat', 'warning')
      return
    }

    setLoading(true)
    setChecklist('')

    try {
      const response = await fetch('/api/onboarding-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, role, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setChecklist(data.checklist)
        showToast(language === 'en' ? 'Checklist ready!' : 'Kontrol listesi hazır!', 'success')
      }
    } catch (err) {
      showToast(t.common.error, 'error')
    }

    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(checklist)
    setCopied(true)
    showToast(t.common.copied, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const exampleProduct = language === 'en'
    ? 'Team collaboration tool for remote design teams'
    : 'Uzaktan tasarım ekipleri için işbirliği aracı'

  const exampleRole = language === 'en'
    ? 'Design team lead'
    : 'Tasarım ekip lideri'

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
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-sky-500 text-black' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-sky-500 text-black' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🧭</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-sky-400 text-sm">{t.tools.onboardingChecklist.credits}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.tools.onboardingChecklist.title}</h1>
          <p className="text-gray-400">{t.tools.onboardingChecklist.description}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">{t.tools.onboardingChecklist.inputLabel}</label>
            <textarea
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full h-28 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-sky-500 focus:outline-none resize-none transition"
              placeholder={t.tools.onboardingChecklist.inputPlaceholder}
            />
            <button
              onClick={() => setProduct(exampleProduct)}
              className="mt-3 text-sm text-sky-400 hover:underline"
            >
              ✨ {language === 'en' ? 'Use example product' : 'Örnek ürün kullan'}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">{t.tools.onboardingChecklist.roleLabel}</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-sky-500 focus:outline-none transition"
              placeholder={t.tools.onboardingChecklist.rolePlaceholder}
            />
            <button
              onClick={() => setRole(exampleRole)}
              className="mt-3 text-sm text-sky-400 hover:underline"
            >
              ✨ {language === 'en' ? 'Use example role' : 'Örnek rol kullan'}
            </button>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg text-black mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {t.common.loading}</>
          ) : (
            <>🧭 {t.tools.onboardingChecklist.button}</>
          )}
        </button>

        {checklist && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t.tools.onboardingChecklist.resultLabel}</h2>
              <button
                onClick={handleCopy}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
              >
                {copied ? '✓' : t.common.copy}
              </button>
            </div>
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                {checklist}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 {language === 'en' ? 'Onboarding Tips' : 'Onboarding İpuçları'}
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• {language === 'en' ? 'Start with one quick win in the first 5 minutes' : 'İlk 5 dakikada hızlı bir başarı planla'}</li>
            <li>• {language === 'en' ? 'Use checklists to reduce support tickets' : 'Destek taleplerini azaltmak için kontrol listesi kullan'}</li>
            <li>• {language === 'en' ? 'Personalize steps for each role' : 'Adımları role göre kişiselleştir'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
