'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { t, language, setLanguage } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span className="text-3xl">🧠</span>
            <span className="text-2xl font-bold">AI Toolkit</span>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-md text-sm transition ${
                language === 'en' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('tr')}
              className={`px-3 py-1 rounded-md text-sm transition ${
                language === 'tr' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              TR
            </button>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold mb-2">{t.auth.login.title}</h1>
          <p className="text-gray-400 mb-8">{t.auth.login.subtitle}</p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.auth.login.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none transition"
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.auth.login.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
            >
              {loading ? t.common.loading : t.auth.login.button}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-gray-400">
            {t.auth.login.noAccount}{' '}
            <Link href="/register" className="text-blue-400 hover:underline">
              {t.auth.login.signUp}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 items-center justify-center p-12">
        <div className="text-center">
          <div className="text-8xl mb-8">🧠</div>
          <h2 className="text-4xl font-bold mb-4">AI Toolkit</h2>
          <p className="text-xl text-white/80 max-w-md">
            Powerful AI tools to boost your productivity. Summarize, analyze, and create with AI.
          </p>
        </div>
      </div>
    </div>
  )
}