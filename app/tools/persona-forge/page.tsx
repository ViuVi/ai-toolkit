'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function PersonaForgePage() {
  const [product, setProduct] = useState('')
  const [audience, setAudience] = useState('')
  const [personas, setPersonas] = useState('')
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
    setPersonas('')

    try {
      const response = await fetch('/api/persona-forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, audience, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setPersonas(data.personas)
        showToast(language === 'en' ? 'Personas generated!' : 'Personalar üretildi!', 'success')
      }
    } catch (err) {
      showToast(t.common.error, 'error')
    }

    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(personas)
    setCopied(true)
    showToast(t.common.copied, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  const exampleProduct = language === 'en'
    ? 'AI-powered customer success dashboard for SaaS teams'
    : 'SaaS ekipleri için yapay zeka destekli müşteri başarı paneli'

  const exampleAudience = language === 'en'
    ? 'Customer success managers at mid-size B2B SaaS companies'
    : 'Orta ölçekli B2B SaaS şirketlerinde müşteri başarı yöneticileri'

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
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-teal-500 text-black' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-teal-500 text-black' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🧬</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-teal-400 text-sm">{t.tools.personaForge.credits}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.tools.personaForge.title}</h1>
          <p className="text-gray-400">{t.tools.personaForge.description}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">{t.tools.personaForge.inputLabel}</label>
            <textarea
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full h-32 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none resize-none transition"
              placeholder={t.tools.personaForge.inputPlaceholder}
            />
            <button
              onClick={() => setProduct(exampleProduct)}
              className="mt-3 text-sm text-teal-400 hover:underline"
            >
              ✨ {language === 'en' ? 'Use example product' : 'Örnek ürün kullan'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">{t.tools.personaForge.audienceLabel}</label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-teal-500 focus:outline-none transition"
              placeholder={t.tools.personaForge.audiencePlaceholder}
            />
            <button
              onClick={() => setAudience(exampleAudience)}
              className="mt-3 text-sm text-teal-400 hover:underline"
            >
              ✨ {language === 'en' ? 'Use example audience' : 'Örnek hedef kitle kullan'}
            </button>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg text-black mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {t.common.loading}</>
          ) : (
            <>🧬 {t.tools.personaForge.button}</>
          )}
        </button>

        {personas && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t.tools.personaForge.resultLabel}</h2>
              <button
                onClick={handleCopy}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
              >
                {copied ? '✓' : t.common.copy}
              </button>
            </div>
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                {personas}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-teal-500/10 border border-teal-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 {language === 'en' ? 'Persona Tips' : 'Persona İpuçları'}
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• {language === 'en' ? 'Be specific about the job title and industry' : 'Ünvan ve sektör konusunda net ol'}</li>
            <li>• {language === 'en' ? 'Mention the key pains you want to solve' : 'Çözmek istediğin ana acılardan bahset'}</li>
            <li>• {language === 'en' ? 'Use personas to shape your onboarding and messaging' : 'Personaları onboarding ve mesajlaşma için kullan'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
