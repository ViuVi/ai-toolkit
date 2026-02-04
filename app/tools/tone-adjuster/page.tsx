'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function ToneAdjusterPage() {
  const [message, setMessage] = useState('')
  const [tones, setTones] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const { t, language, setLanguage } = useLanguage()
  const { showToast } = useToast()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleAdjust = async () => {
    if (!message.trim()) {
      showToast(language === 'en' ? 'Please enter a message' : 'Lütfen mesaj girin', 'warning')
      return
    }

    setLoading(true)
    setTones([])

    try {
      const response = await fetch('/api/tone-adjuster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userId }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setTones(data.tones)
        showToast(language === 'en' ? 'Tones generated!' : 'Tonlar oluşturuldu!', 'success')
      }
    } catch (err) {
      showToast(t.common.error, 'error')
    }

    setLoading(false)
  }

  const handleCopy = (tone: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(tone)
    showToast(t.common.copied, 'success')
    setTimeout(() => setCopied(null), 2000)
  }

  const toneColors: {[key: string]: string} = {
    professional: 'from-blue-500 to-blue-700',
    friendly: 'from-green-400 to-green-600',
    persuasive: 'from-orange-500 to-red-500',
    empathetic: 'from-pink-400 to-pink-600',
    confident: 'from-purple-500 to-purple-700',
  }

  const exampleMessages = [
    language === 'en' 
      ? "I need you to finish the report by Friday. It's important."
      : "Raporu Cuma'ya kadar bitirmeni istiyorum. Önemli.",
    language === 'en'
      ? "We have a problem with the project timeline."
      : "Proje zaman çizelgesinde bir sorunumuz var.",
    language === 'en'
      ? "Can you help me with this task?"
      : "Bu konuda bana yardımcı olabilir misin?",
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{t.common.backToDashboard}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-cyan-500 text-black' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-cyan-500 text-black' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">💬</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-cyan-400 text-sm">{t.tools.toneAdjuster.credits}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.tools.toneAdjuster.title}</h1>
          <p className="text-gray-400">{t.tools.toneAdjuster.description}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3">{t.tools.toneAdjuster.inputLabel}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-cyan-500 focus:outline-none resize-none transition"
            placeholder={t.tools.toneAdjuster.inputPlaceholder}
          />
          
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">{language === 'en' ? 'Example messages:' : 'Örnek mesajlar:'}</p>
            <div className="flex flex-wrap gap-2">
              {exampleMessages.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(ex)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition text-left"
                >
                  {ex.substring(0, 40)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleAdjust}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-6"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {t.common.loading}</>
          ) : (
            <>💬 {t.tools.toneAdjuster.button}</>
          )}
        </button>

        {tones.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">{t.tools.toneAdjuster.resultLabel}</h2>
            
            {tones.map((tone, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className={`bg-gradient-to-r ${toneColors[tone.tone]} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tone.emoji}</span>
                    <span className="font-semibold capitalize">{tone.tone}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(tone.tone, tone.text)}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition"
                  >
                    {copied === tone.tone ? '✓' : '📋'}
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-200 whitespace-pre-wrap mb-3">{tone.text}</p>
                  <p className="text-xs text-gray-500">
                    ✨ {language === 'en' ? 'Best for:' : 'En iyi:'} {tone.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 {language === 'en' ? 'Communication Tips' : 'İletişim İpuçları'}
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• {language === 'en' ? 'Match your tone to your audience and situation' : 'Tonunu hedef kitlene ve duruma göre ayarla'}</li>
            <li>• {language === 'en' ? 'Professional tone builds credibility' : 'Profesyonel ton güvenilirlik oluşturur'}</li>
            <li>• {language === 'en' ? 'Empathetic tone defuses tense situations' : 'Empatik ton gergin durumları yumuşatır'}</li>
            <li>• {language === 'en' ? 'Confident tone shows leadership' : 'Özgüvenli ton liderlik gösterir'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}