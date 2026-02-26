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

export default function ToolPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { language, setLanguage } = useLanguage()
  const { showToast } = useToast()
  const tp = toolPage[language]
  const title = toolNames[language].summarizer

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])

  const handleGenerate = async () => {
    if (!input.trim()) { showToast(tp.required, 'warning'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/summarize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input, userId, language }) })
      const data = await res.json()
      if (data.error) showToast(data.error, 'error')
      else { setResult(data); showToast(tp.success, 'success') }
    } catch { showToast(tp.error, 'error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">{tp.back}</Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`px-2 py-1 rounded text-xs transition ${language === l.code ? 'bg-purple-500 text-white' : 'text-gray-400'}`}>{l.flag}</button>))}
            </div>
            <span className="text-2xl">📋</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full mb-4">⚡ 2 Credits</span>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-6">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none" placeholder="Enter your content..." />
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg mb-6">
          {loading ? <><span className="animate-spin">⏳</span> {tp.generating}</> : <>📋 {tp.generate}</>}
        </button>

        {result && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{tp.result}</h2>
              <button onClick={() => {navigator.clipboard.writeText(JSON.stringify(result, null, 2)); showToast(tp.copied, 'success')}} className="px-4 py-2 bg-purple-600 rounded-lg text-sm">{tp.copy}</button>
            </div>
            <pre className="text-gray-300 whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  )
}
