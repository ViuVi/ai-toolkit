'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

export default function HookGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [hooks, setHooks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('all')
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
    if (!topic.trim()) {
      showToast(language === 'en' ? 'Please enter a topic' : 'Lütfen konu girin', 'warning')
      return
    }

    setLoading(true)
    setHooks([])

    try {
      const response = await fetch('/api/hook-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userId, language }),
      })

      const data = await response.json()

      if (data.error) {
        showToast(data.error, 'error')
      } else {
        setHooks(data.hooks)
        showToast(language === 'en' ? 'Hooks generated!' : 'Hook\'lar üretildi!', 'success')
      }
    } catch (err) {
      showToast(t.common.error, 'error')
    }

    setLoading(false)
  }

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    showToast(t.common.copied, 'success')
    setTimeout(() => setCopied(null), 2000)
  }

  const hookTypes = [
    { key: 'all', label: '🎯 All', labelTr: '🎯 Tümü' },
    { key: 'curiosity', label: '🤔 Curiosity', labelTr: '🤔 Merak' },
    { key: 'shocking', label: '😱 Shocking', labelTr: '😱 Şok' },
    { key: 'question', label: '❓ Question', labelTr: '❓ Soru' },
    { key: 'story', label: '📖 Story', labelTr: '📖 Hikaye' },
    { key: 'statistic', label: '📊 Statistic', labelTr: '📊 İstatistik' },
  ]

  const filteredHooks = filter === 'all' ? hooks : hooks.filter(h => h.type === filter)

  const exampleTopics = [
    language === 'en' ? 'productivity tips' : 'verimlilik ipuçları',
    language === 'en' ? 'making money online' : 'online para kazanma',
    language === 'en' ? 'personal growth' : 'kişisel gelişim',
    language === 'en' ? 'social media marketing' : 'sosyal medya pazarlama',
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
              <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded text-xs transition ${language === 'en' ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLanguage('tr')} className={`px-2 py-1 rounded text-xs transition ${language === 'tr' ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}>TR</button>
            </div>
            <span className="text-2xl">🎣</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-yellow-400 text-sm">{t.tools.hookGenerator.credits}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t.tools.hookGenerator.title}</h1>
          <p className="text-gray-400">{t.tools.hookGenerator.description}</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <label className="block text-sm font-medium mb-3">{t.tools.hookGenerator.inputLabel}</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full h-24 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-500 focus:outline-none resize-none transition"
            placeholder={t.tools.hookGenerator.inputPlaceholder}
          />
          
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">{language === 'en' ? 'Quick topics:' : 'Hızlı konular:'}</p>
            <div className="flex flex-wrap gap-2">
              {exampleTopics.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setTopic(ex)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg text-black mb-6"
        >
          {loading ? (
            <><span className="animate-spin">⏳</span> {t.common.loading}</>
          ) : (
            <>🎣 {t.tools.hookGenerator.button}</>
          )}
        </button>

        {hooks.length > 0 && (
          <div className="animate-fade-in">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {hookTypes.map(type => (
                <button
                  key={type.key}
                  onClick={() => setFilter(type.key)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${
                    filter === type.key
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {language === 'en' ? type.label : type.labelTr}
                </button>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-4">{t.tools.hookGenerator.resultLabel}</h2>
            
            <div className="space-y-4">
              {filteredHooks.map((hook, index) => (
                <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-yellow-500/50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{hook.emoji}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded capitalize">{hook.type}</span>
                      </div>
                      <p className="text-lg text-white mb-2">"{hook.text}"</p>
                      <p className="text-sm text-gray-400">💡 {hook.reason}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(index, hook.text)}
                      className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition shrink-0"
                    >
                      {copied === index ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            💡 {language === 'en' ? 'Hook Tips' : 'Hook İpuçları'}
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• {language === 'en' ? 'The first 3 seconds decide if people keep watching' : 'İlk 3 saniye izleyicinin devam edip etmeyeceğini belirler'}</li>
            <li>• {language === 'en' ? 'Use curiosity gaps to make people NEED to know more' : 'Merak boşlukları kullanarak izleyicinin bilmek istemesini sağla'}</li>
            <li>• {language === 'en' ? 'Personal stories outperform generic advice' : 'Kişisel hikayeler genel tavsiyelerden daha iyi performans gösterir'}</li>
            <li>• {language === 'en' ? 'Test different hooks on the same content' : 'Aynı içerik için farklı hook\'ları test et'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}