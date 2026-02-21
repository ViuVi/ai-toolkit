'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function BrandVoicePage() {
  const [sampleTexts, setSampleTexts] = useState(['', '', ''])
  const [brandName, setBrandName] = useState('')
  const [industry, setIndustry] = useState('business')
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

  const handleTextChange = (index: number, value: string) => {
    const newTexts = [...sampleTexts]
    newTexts[index] = value
    setSampleTexts(newTexts)
  }

  const addTextArea = () => {
    if (sampleTexts.length < 10) {
      setSampleTexts([...sampleTexts, ''])
    }
  }

  const handleAnalyze = async () => {
    const filledTexts = sampleTexts.filter(t => t.trim())
    
    if (filledTexts.length < 3) {
      showToast(language === 'en' ? 'Please enter at least 3 sample texts' : 'Lütfen en az 3 örnek metin girin', 'warning')
      return
    }

    setLoading(true)
    setAnalysis(null)

    try {
      const response = await fetch('/api/brand-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleTexts: filledTexts, brandName, industry, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setAnalysis(data.analysis)
        showToast(language === 'en' ? 'Analysis complete!' : 'Analiz tamamlandı!', 'success')
      }
    } catch (err) {
      showToast((language === 'tr' ? 'Hata oluştu' : 'An error occurred'), 'error')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{(language === 'tr' ? 'Panele Dön' : 'Back to Dashboard')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🎯</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-indigo-400 text-sm font-medium">
              {language === 'en' ? '🎯 2 CREDITS' : '🎯 2 KREDİ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Brand Voice Analyzer' : 'Marka Sesi Analiz Aracı'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' ? 'Analyze your brand\'s tone, consistency, and voice' : 'Markanızın tonunu, tutarlılığını ve sesini analiz edin'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Brand Name (Optional)' : 'Marka Adı (Opsiyonel)'}</label>
              <input 
                type="text" 
                value={brandName} 
                onChange={(e) => setBrandName(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:outline-none" 
                placeholder={language === 'en' ? 'Your Brand' : 'Markanız'} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Industry' : 'Sektör'}</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:outline-none">
                <option value="tech">{language === 'en' ? 'Tech' : 'Teknoloji'}</option>
                <option value="fashion">{language === 'en' ? 'Fashion' : 'Moda'}</option>
                <option value="food">{language === 'en' ? 'Food' : 'Yemek'}</option>
                <option value="fitness">Fitness</option>
                <option value="business">{language === 'en' ? 'Business' : 'İş'}</option>
                <option value="travel">{language === 'en' ? 'Travel' : 'Seyahat'}</option>
                <option value="beauty">{language === 'en' ? 'Beauty' : 'Güzellik'}</option>
              </select>
            </div>
          </div>

          <label className="block text-sm font-medium mb-2">
            {language === 'en' ? 'Sample Texts (minimum 3)' : 'Örnek Metinler (en az 3)'}
          </label>
          <div className="space-y-3">
            {sampleTexts.map((text, index) => (
              <textarea
                key={index}
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder={`${language === 'en' ? 'Sample text' : 'Örnek metin'} ${index + 1}...`}
              />
            ))}
          </div>
          {sampleTexts.length < 10 && (
            <button onClick={addTextArea} className="mt-3 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-sm transition">
              + {language === 'en' ? 'Add Another Text' : 'Başka Metin Ekle'}
            </button>
          )}
        </div>

        <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8">
          {loading ? <><span className="animate-spin">⏳</span> {(language === 'tr' ? 'Yükleniyor...' : 'Loading...')}</> : <>🎯 {language === 'en' ? 'Analyze Brand Voice' : 'Marka Sesini Analiz Et'}</>}
        </button>

        {analysis && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 text-center">
              <div className="text-5xl font-bold mb-2">{analysis.consistency}%</div>
              <div className="text-xl">{language === 'en' ? 'Brand Consistency Score' : 'Marka Tutarlılık Skoru'}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'Tone Analysis' : 'Ton Analizi'}</h3>
                <div className="space-y-3">
                  {Object.entries(analysis.toneAnalysis.scores).map(([tone, score]: [string, any]) => (
                    <div key={tone}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{tone}</span>
                        <span className="font-bold text-indigo-400">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-indigo-500/10 rounded-lg">
                  <div className="text-sm text-gray-400">{language === 'en' ? 'Dominant Tone' : 'Baskın Ton'}</div>
                  <div className="text-lg font-bold capitalize text-indigo-400">{analysis.toneAnalysis.dominant}</div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'Word Choice' : 'Kelime Seçimi'}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">{language === 'en' ? 'Vocabulary Richness' : 'Kelime Zenginliği'}</div>
                    <div className="text-3xl font-bold text-purple-400">{analysis.wordChoice.vocabularyRichness}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">{language === 'en' ? 'Complexity Level' : 'Karmaşıklık Seviyesi'}</div>
                    <div className="text-lg font-semibold">{analysis.wordChoice.complexityLevel}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <div className="text-gray-400">{language === 'en' ? 'Unique Words' : 'Benzersiz Kelime'}</div>
                      <div className="font-bold">{analysis.wordChoice.uniqueWordCount}</div>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <div className="text-gray-400">{language === 'en' ? 'Avg Word Length' : 'Ort. Kelime Uzunluğu'}</div>
                      <div className="font-bold">{analysis.wordChoice.averageWordLength}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'Sentiment Analysis' : 'Duygu Analizi'}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-400">{analysis.sentiment.score}%</div>
                  <div className="text-sm text-gray-400">{analysis.sentiment.label}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-green-400">+ {analysis.sentiment.positiveCount} {language === 'en' ? 'positive' : 'pozitif'}</div>
                  <div className="text-red-400">- {analysis.sentiment.negativeCount} {language === 'en' ? 'negative' : 'negatif'}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'vs Competitors' : 'Rakiplere Karşı'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold">{analysis.competitorComparison.averageConsistency}%</div>
                  <div className="text-sm text-gray-400">{language === 'en' ? 'Industry Average' : 'Sektör Ortalaması'}</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className={`text-2xl font-bold ${analysis.consistency > analysis.competitorComparison.averageConsistency ? 'text-green-400' : 'text-red-400'}`}>
                    {analysis.consistency > analysis.competitorComparison.averageConsistency ? '+' : ''}
                    {analysis.consistency - analysis.competitorComparison.averageConsistency}%
                  </div>
                  <div className="text-sm text-gray-400">{language === 'en' ? 'Your Difference' : 'Farkınız'}</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-400">{analysis.competitorComparison.topPerformers[0].score}%</div>
                  <div className="text-sm text-gray-400">{language === 'en' ? 'Top Performer' : 'En İyi'}</div>
                </div>
              </div>
            </div>

            {analysis.recommendations.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-400">
                  💡 {language === 'en' ? 'Recommendations' : 'Öneriler'}
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  {analysis.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-400">▸</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.keyPhrases.length > 0 && (
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className="font-bold text-lg mb-4">{language === 'en' ? 'Most Used Words' : 'En Çok Kullanılan Kelimeler'}</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyPhrases.map((phrase: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}