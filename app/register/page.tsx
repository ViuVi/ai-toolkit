'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { t } from '@/lib/translations'

const langs: { code: Language; flag: string }[] = [
  { code: 'en', flag: '🇺🇸' }, { code: 'tr', flag: '🇹🇷' }, { code: 'ru', flag: '🇷🇺' }, { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }
]

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const auth = t.auth[language]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) setError(error.message)
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          {langs.map((l) => (<button key={l.code} onClick={() => setLanguage(l.code)} className={`px-3 py-1 mx-1 rounded ${language === l.code ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{l.flag}</button>))}
        </div>
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6"><div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"><span className="text-2xl font-bold text-white">M</span></div></Link>
            <h1 className="text-2xl font-bold text-white">{auth.registerTitle}</h1>
            <p className="text-gray-400">{auth.registerSubtitle}</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{auth.name}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none" required /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{auth.email}</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none" required /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-2">{auth.password}</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none" required /></div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-white transition disabled:opacity-50">{loading ? '...' : auth.registerBtn}</button>
            <p className="text-xs text-gray-500 text-center">{auth.terms}</p>
          </form>
          <p className="text-center text-gray-400 mt-6">{auth.hasAccount} <Link href="/login" className="text-purple-400 hover:text-purple-300">{auth.signIn}</Link></p>
        </div>
      </div>
    </div>
  )
}
