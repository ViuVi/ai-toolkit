'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

interface CompetitorAnalysis {
  platform: string
  summary: string
  bestContentType: {
    type: string
    reason: string
    avgEngagement: string
    recommendation: string
  }
  topTopics: Array<{
    topic: string
    frequency: string
    engagement: string
  }>
  postingSchedule: {
    bestDays: string[]
    bestTimes: string[]
    frequency: string
    consistency: string
  }
  engagementInsights: {
    avgRate: string
    topPerformers: string[]
    timing: string
  }
  strategyRecommendations: string[]
  competitorStrengths: string[]
  opportunityGaps: string[]
}

export default function CompetitorAnalyzerPage() {
  const [competitorUrl, setCompetitorUrl] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null)
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
    if (!competitorUrl.trim()) {
      showToast(language === 'en' ? 'Please enter competitor URL' : 'Lütfen rakip URL girin', 'warning')
      return
    }

    setLoading(true)
    setAnalysis(null)

    try {
      const response = await fetch('/api/competitor-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorUrl, platform, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setAnalysis(data.analysis)
        showToast(language === 'en' ? 'Analysis complete!' : 'Analiz tamamlandı!', 'success')
      }
    } catch (err) {
      showToast(t.common.error, 'error')
      console.error('Competitor analysis error:', err)
    }

    setLoading(false)
  }

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  ]

  const exampleUrls = {
    instagram: 'instagram.com/username',
    linkedin: 'linkedin.com/in/username',
    tiktok: 'tiktok.com/@username',
    twitter: 'twitter.com/username'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <span>←</span>
            <span>{t.common.backToDashboard}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🔍</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-purple-400 text-sm font-medium">
              {language === 'en' ? '🔍 8 CREDITS - PREMIUM ANALYSIS' : '🔍 8 KREDİ - PREMİUM ANALİZ'}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {language === 'en' ? 'Competitor Content Analyzer' : 'Rakip İçerik Analizi'}
          </h1>
          <p className="text-gray-400">
            {language === 'en' 
              ? 'Learn from competitors, create better content' 
              : 'Rakiplerden öğren, daha iyi içerik üret'}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          {/* Platform Selection */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? 'Platform' : 'Platform'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {platforms.map(p => (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={`p-4 rounded-xl border-2 transition ${
                  platform === p.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="text-sm font-medium">{p.label}</div>
              </button>
            ))}
          </div>

          {/* URL Input */}
          <label className="block text-sm font-medium mb-3">
            {language === 'en' ? 'Competitor Profile URL' : 'Rakip Profil URL'}
          </label>
          <input
            type="text"
            value={competitorUrl}
            onChange={(e) => setCompetitorUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none transition"
            placeholder={`${language === 'en' ? 'e.g.' : 'örn:'} ${exampleUrls[platform as keyof typeof exampleUrls]}`}
          />
          
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-400">
              💡 {language === 'en' 
                ? 'Enter your competitor\'s profile URL. We\'ll analyze their content strategy and give you actionable insights.' 
                : 'Rakibinizin profil URL\'sini girin. İçerik stratejilerini analiz edip size uygulanabilir öneriler vereceğiz.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-8"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {language === 'en' ? 'Analyzing...' : 'Analiz ediliyor...'}</>
          ) : (
            <>🔍 {language === 'en' ? 'Analyze Competitor' : 'Rakibi Analiz Et'}</>
          )}
        </button>

        {analysis && (
          <div className="animate-fade-in space-y-6">
            {/* Summary */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📊</span>
                <h2 className="text-2xl font-bold">{language === 'en' ? 'Analysis Summary' : 'Analiz Özeti'}</h2>
              </div>
              <p className="text-gray-300">{analysis.summary}</p>
              <div className="mt-4 inline-block bg-purple-500 px-4 py-2 rounded-lg">
                <span className="font-medium">Platform: {analysis.platform}</span>
              </div>
            </div>

            {/* Best Content Type */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏆</span>
                <h3 className="text-xl font-bold">
                  {language === 'en' ? 'Best Performing Content Type' : 'En İyi Performans Gösteren İçerik Tipi'}
                </h3>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                <div className="text-2xl font-bold text-purple-400 mb-2">{analysis.bestContentType.type}</div>
                <p className="text-gray-400 mb-2">{analysis.bestContentType.reason}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                    📈 {analysis.bestContentType.avgEngagement} {language === 'en' ? 'avg engagement' : 'ort. etkileşim'}
                  </span>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-400">💡 {analysis.bestContentType.recommendation}</p>
              </div>
            </div>

            {/* Top Topics */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📝</span>
                <h3 className="text-xl font-bold">
                  {language === 'en' ? 'Top Content Topics' : 'Popüler İçerik Konuları'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.topTopics.map((topic, idx) => (
                  <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                    <div className="font-semibold mb-2">{topic.topic}</div>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                        {language === 'en' ? 'Freq:' : 'Sıklık:'} {topic.frequency}
                      </span>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        {language === 'en' ? 'Eng:' : 'Etk:'} {topic.engagement}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Posting Schedule */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⏰</span>
                <h3 className="text-xl font-bold">
                  {language === 'en' ? 'Posting Schedule' : 'Paylaşım Programı'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">{language === 'en' ? 'Best Days' : 'En İyi Günler'}</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.postingSchedule.bestDays.map(day => (
                      <span key={day} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">{language === 'en' ? 'Best Times' : 'En İyi Saatler'}</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.postingSchedule.bestTimes.map(time => (
                      <span key={time} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">{language === 'en' ? 'Frequency' : 'Sıklık'}</div>
                <div className="font-medium">{analysis.postingSchedule.frequency}</div>
                <div className="text-sm text-gray-400 mt-2">{analysis.postingSchedule.consistency}</div>
              </div>
            </div>

            {/* Engagement Insights */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📊</span>
                <h3 className="text-xl font-bold">
                  {language === 'en' ? 'Engagement Insights' : 'Etkileşim İçgörüleri'}
                </h3>
              </div>
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-400">{language === 'en' ? 'Average Engagement Rate' : 'Ortalama Etkileşim Oranı'}</div>
                <div className="text-3xl font-bold text-green-400">{analysis.engagementInsights.avgRate}</div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-sm font-medium text-gray-400">
                  {language === 'en' ? 'Top Performers:' : 'En İyi Performans Gösterenler:'}
                </div>
                {analysis.engagementInsights.topPerformers.map((item, idx) => (
                  <div key={idx} className="bg-gray-900/50 rounded-lg p-3 text-sm">
                    ✓ {item}
                  </div>
                ))}
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-400">⏰ {analysis.engagementInsights.timing}</p>
              </div>
            </div>

            {/* Strategy Recommendations */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💡</span>
                <h3 className="text-xl font-bold">
                  {language === 'en' ? 'Your Strategy Recommendations' : 'Sizin İçin Strateji Önerileri'}
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.strategyRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-yellow-500">
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">💪</span>
                  <h3 className="text-lg font-bold">
                    {language === 'en' ? 'Competitor Strengths' : 'Rakibin Güçlü Yönleri'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {analysis.competitorStrengths.map((strength, idx) => (
                    <div key={idx} className="bg-green-500/10 rounded-lg p-3 text-sm">
                      ✓ {strength}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🎯</span>
                  <h3 className="text-lg font-bold">
                    {language === 'en' ? 'Opportunity Gaps' : 'Fırsat Boşlukları'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {analysis.opportunityGaps.map((gap, idx) => (
                    <div key={idx} className="bg-orange-500/10 rounded-lg p-3 text-sm">
                      {gap}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        {!analysis && (
          <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              💡 {language === 'en' ? 'What You\'ll Get' : 'Neler Öğreneceksiniz'}
            </h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>• {language === 'en' ? 'Best performing content formats' : 'En iyi performans gösteren içerik formatları'}</li>
              <li>• {language === 'en' ? 'Popular topics and themes' : 'Popüler konular ve temalar'}</li>
              <li>• {language === 'en' ? 'Optimal posting schedule' : 'Optimal paylaşım programı'}</li>
              <li>• {language === 'en' ? 'Engagement patterns and insights' : 'Etkileşim kalıpları ve içgörüler'}</li>
              <li>• {language === 'en' ? 'Actionable strategy recommendations' : 'Uygulanabilir strateji önerileri'}</li>
              <li>• {language === 'en' ? 'Gaps you can fill' : 'Doldurabileceğiniz boşluklar'}</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}