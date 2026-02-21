'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <span className="text-xl font-bold text-white">Media Tool Kit</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">
              {t.nav?.features || 'Features'}
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">
              {t.nav?.pricing || 'Pricing'}
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white transition">
              {t.nav?.faq || 'FAQ'}
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition border border-gray-700">
                🌐 {language.toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button onClick={() => setLanguage('en')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 rounded-t-lg ' + (language === 'en' ? 'text-purple-400' : 'text-gray-300')}>🇺🇸 English</button>
                <button onClick={() => setLanguage('tr')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ' + (language === 'tr' ? 'text-purple-400' : 'text-gray-300')}>🇹🇷 Türkçe</button>
                <button onClick={() => setLanguage('ru')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ' + (language === 'ru' ? 'text-purple-400' : 'text-gray-300')}>🇷🇺 Русский</button>
                <button onClick={() => setLanguage('de')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ' + (language === 'de' ? 'text-purple-400' : 'text-gray-300')}>🇩🇪 Deutsch</button>
                <button onClick={() => setLanguage('fr')} className={'w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 rounded-b-lg ' + (language === 'fr' ? 'text-purple-400' : 'text-gray-300')}>🇫🇷 Français</button>
              </div>
            </div>

            <Link href="/login" className="text-gray-300 hover:text-white transition">
              {t.nav?.login || 'Login'}
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition">
              {t.nav?.signup || 'Sign Up'}
            </Link>
          </div>

          <button className="md:hidden text-white text-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-gray-300 hover:text-white">{t.nav?.features || 'Features'}</a>
              <a href="#pricing" className="text-gray-300 hover:text-white">{t.nav?.pricing || 'Pricing'}</a>
              <a href="#faq" className="text-gray-300 hover:text-white">{t.nav?.faq || 'FAQ'}</a>
              
              <div className="flex flex-wrap gap-2">
                {['en', 'tr', 'ru', 'de', 'fr'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as 'en' | 'tr' | 'ru' | 'de' | 'fr')}
                    className={`px-3 py-1 rounded text-sm ${language === lang ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-800">
                <Link href="/login" className="text-gray-300">{t.nav?.login || 'Login'}</Link>
                <Link href="/register" className="bg-purple-600 text-white px-4 py-2 rounded-lg">{t.nav?.signup || 'Sign Up'}</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
