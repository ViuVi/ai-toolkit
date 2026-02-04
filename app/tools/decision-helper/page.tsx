'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function DecisionHelperPage() {
  const [decision, setDecision] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
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

  const handleAnalyze = async () => {
    if (!decision.trim()) {
      showToast(language === 'en' ? 'Please describe your decision' : 'Lütfen kararınızı açıklayın', 'warning')
      return
    }

    setLoading(true)
    setAnalysis(null)

    try {
      const response = await fetch('/api/decision-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setAnalysis(data.analysis)
        showToast(language === 'en' ? 'Decision analyzed!' : 'Karar analiz edildi!', 'success')
      }
    } catch (err) {
      showToast(t.common.error, 'error')
    }

    setLoading(false)
  }

  const exampleDecisions = [
    language === 'en' 
      ? "Should I take the new job offer or stay at my current company?"
      : "Yeni iş teklifini kabul etmeli miyim yoksa mevcut şirkette mi kalmalıyım?",
    language === 'en'
      ? "I'm deciding between starting my own business or pursuing a master's degree"
      : "Kendi işimi kurmak mı yoksa yüksek lisans yapmak mı arasında karar veriyorum",
    language === 'en'
      ? "Should I move to a new city for better opportunities or stay close to family?"
      : "Daha iyi fırsatlar için yeni bir şehre mi taşınmalıyım yoksa ailemin yanında mı kalmalıyım?",
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
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">⚖️</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-indigo-400 text-sm">{t.tools.decisionHelper.credits}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.tools.decisionHelper.title}</h1>
          <p className="text-gray-400">{t.tools.decisionHelper.description}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3">{t.tools.decisionHelper.inputLabel}</label>
          <textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="w-full h-36 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:outline-none resize-none transition"
            placeholder={t.tools.decisionHelper.inputPlaceholder}
          />
          
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">{language === 'en' ? 'Example decisions:' : 'Örnek kararlar:'}</p>
            <div className="space-y-2">
              {exampleDecisions.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setDecision(ex)}
                  className="block w-full text-left text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-6"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {t.common.loading}</>
          ) : (
            <>⚖️ {t.tools.decisionHelper.button}</>
          )}
        </button>

        {analysis && (
          <div className="space-y-6 animate-fade-in">
            {/* Options Analysis */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">📊 {language === 'en' ? 'Options Analysis' : 'Seçenek Analizi'}</h2>
              <div className="space-y-4">
                {analysis.options?.map((opt: any, index: number) => (
                  <div key={index} className="bg-gray-900 rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-3 text-indigo-400">{opt.option}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-green-400 text-sm font-medium mb-2">✅ {language === 'en' ? 'Pros' : 'Artılar'}</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {opt.pros?.map((pro: string, i: number) => (
                            <li key={i}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-red-400 text-sm font-medium mb-2">❌ {language === 'en' ? 'Cons' : 'Eksiler'}</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {opt.cons?.map((con: string, i: number) => (
                            <li key={i}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <span className={`text-xs px-2 py-1 rounded ${
                        opt.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                        opt.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {language === 'en' ? 'Risk Level' : 'Risk Seviyesi'}: {opt.riskLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Factors */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">🔑 {language === 'en' ? 'Key Factors' : 'Temel Faktörler'}</h2>
              <ul className="space-y-2">
                {analysis.keyFactors?.map((factor: string, index: number) => (
                  <li key={index} className="text-gray-300">{factor}</li>
                ))}
              </ul>
            </div>

            {/* Recommendation */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">💡 {language === 'en' ? 'Recommendation' : 'Öneri'}</h2>
              <div className="text-gray-300 whitespace-pre-wrap">{analysis.recommendation}</div>
            </div>

            {/* Questions to Consider */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">❓ {language === 'en' ? 'Questions to Consider' : 'Düşünülecek Sorular'}</h2>
              <ul className="space-y-2">
                {analysis.questionsToConsider?.map((q: string, index: number) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <span className="text-indigo-400">→</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}