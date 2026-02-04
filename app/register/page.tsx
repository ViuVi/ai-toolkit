'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { t, language, setLanguage } = useLanguage()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Account created successfully! Redirecting...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Left Side - Image/Gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 items-center justify-center p-12">
        <div className="text-center">
          <div className="text-8xl mb-8">✨</div>
          <h2 className="text-4xl font-bold mb-4">Join AI Toolkit</h2>
          <p className="text-xl text-white/80 max-w-md">
            Start your free trial today. No credit card required.
          </p>
          
          {/* Features List */}
          <div className="mt-12 text-left max-w-sm mx-auto space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>50 free credits daily</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>Access to all AI tools</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
          <h1 className="text-3xl font-bold mb-2">{t.auth.register.title}</h1>
          <p className="text-gray-400 mb-8">{t.auth.register.subtitle}</p>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.auth.register.email}
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
                {t.auth.register.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none transition"
                placeholder="Min. 6 characters"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
            >
              {loading ? t.common.loading : t.auth.register.button}
            </button>

            <p className="text-xs text-gray-500 text-center">
              {t.auth.register.terms}
            </p>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-gray-400">
            {t.auth.register.hasAccount}{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              {t.auth.register.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}