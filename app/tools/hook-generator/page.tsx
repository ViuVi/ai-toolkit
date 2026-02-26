'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { toolPage, toolNames } from '@/lib/translations'
import { useToast } from '@/components/Toast'
import { supabase } from '@/lib/supabase'

const langs: { code: Language; flag: string }[] = [
  { code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }
]

export default function HookGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [hooks, setHooks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState<number | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const tp = toolPage[language]
  const title = toolNames[language].hookGen

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) { showToast(tp.required, 'warning'); return }
    setLoading(true); setHooks([])
    try {
      const res = await fetch('/api/hook-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setHooks(data.hooks || []); showToast(tp.success, 'success') }
    } catch { showToast(tp.error, 'error') }
    setLoading(false)
  }

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    showToast(tp.copied, 'success')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{tp.back}</Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`px-2 py-1 rounded text-xs transition ${language === l.code ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}>{l.flag}</button>))}
            </div>
            <span className="text-2xl">🎣</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full mb-4">⚡ 2 Credits</span>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <textarea value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full h-24 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-500 focus:outline-none resize-none" placeholder="Enter your topic..." />
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg text-black mb-6">
          {loading ? <><span className="animate-spin">⏳</span> {tp.generating}</> : <>🎣 {tp.generate}</>}
        </button>

        {hooks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{tp.result}</h2>
            <div className="space-y-4">
              {hooks.map((hook, index) => (
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
                    <button onClick={() => handleCopy(index, hook.text)} className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition shrink-0">
                      {copied === index ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
