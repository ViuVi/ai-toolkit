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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="text-xl font-bold text-white">AI Toolkit</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">
              {t.nav.features}
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">
              {t.nav.pricing}
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white transition">
              {t.nav.faq}
            </a>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm transition ${
                  language === 'en' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`px-3 py-1 rounded-md text-sm transition ${
                  language === 'tr' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                TR
              </button>
            </div>

            <Link 
              href="/login" 
              className="text-gray-300 hover:text-white transition"
            >
              {t.nav.login}
            </Link>
            <Link 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              {t.nav.signup}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-gray-300 hover:text-white transition">
                {t.nav.features}
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">
                {t.nav.pricing}
              </a>
              <a href="#faq" className="text-gray-300 hover:text-white transition">
                {t.nav.faq}
              </a>
              
              {/* Language Switcher Mobile */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('tr')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    language === 'tr' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  TR
                </button>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-800">
                <Link href="/login" className="text-gray-300 hover:text-white">
                  {t.nav.login}
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  {t.nav.signup}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}