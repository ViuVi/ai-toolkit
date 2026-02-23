'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'

const languages: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <span className="text-xl font-bold text-white">Media Tool Kit</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">{t.nav?.features || 'Features'}</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">{t.nav?.pricing || 'Pricing'}</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition">{t.nav?.faq || 'FAQ'}</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition border border-gray-700">
                {languages.find(l => l.code === language)?.flag} {language.toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${
                      language === lang.code ? 'text-purple-400' : 'text-gray-300'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <Link href="/login" className="text-gray-300 hover:text-white transition">{t.nav?.login || 'Login'}</Link>
            <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition">
              {t.nav?.signup || 'Get Started'}
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-gray-300 hover:text-white">{t.nav?.features || 'Features'}</a>
              <a href="#pricing" className="text-gray-300 hover:text-white">{t.nav?.pricing || 'Pricing'}</a>
              <a href="#faq" className="text-gray-300 hover:text-white">{t.nav?.faq || 'FAQ'}</a>
              <div className="flex flex-wrap gap-2 pt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1 rounded text-sm ${
                      language === lang.code ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {lang.flag} {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 pt-4 border-t border-gray-800">
                <Link href="/login" className="text-gray-300">{t.nav?.login || 'Login'}</Link>
                <Link href="/register" className="px-4 py-2 bg-purple-600 rounded-lg">{t.nav?.signup || 'Get Started'}</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
