'use client'

import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useState, useEffect, useRef } from 'react'

const languages = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
]

const navTexts: Record<Language, Record<string, string>> = {
  en: { features: 'Features', pricing: 'Pricing', faq: 'FAQ', login: 'Login', signup: 'Sign Up', language: 'Language' },
  tr: { features: 'Özellikler', pricing: 'Fiyatlar', faq: 'SSS', login: 'Giriş', signup: 'Kayıt Ol', language: 'Dil' },
  ru: { features: 'Функции', pricing: 'Цены', faq: 'FAQ', login: 'Вход', signup: 'Регистрация', language: 'Язык' },
  de: { features: 'Funktionen', pricing: 'Preise', faq: 'FAQ', login: 'Anmelden', signup: 'Registrieren', language: 'Sprache' },
  fr: { features: 'Fonctionnalités', pricing: 'Tarifs', faq: 'FAQ', login: 'Connexion', signup: 'Inscription', language: 'Langue' },
}

export default function Navbar() {
  const { language, setLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const txt = navTexts[language]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setLangDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold text-white">M</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-white hidden sm:block">Media Tool Kit</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition text-sm lg:text-base">{txt.features}</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition text-sm lg:text-base">{txt.pricing}</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition text-sm lg:text-base">{txt.faq}</a>
          </div>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition border border-gray-700"
              >
                {languages.find(l => l.code === language)?.flag} {language.toUpperCase()}
                <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as Language)}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 ${
                        language === lang.code ? 'text-purple-400 bg-gray-700/50' : 'text-gray-300'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/login" className="text-gray-300 hover:text-white transition text-sm lg:text-base">{txt.login}</Link>
            <Link href="/register" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition text-sm lg:text-base font-medium">{txt.signup}</Link>
          </div>

          <button className="md:hidden text-white p-2 -mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-fadeIn">
            <div className="flex flex-col gap-1">
              <a href="#features" className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>{txt.features}</a>
              <a href="#pricing" className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>{txt.pricing}</a>
              <a href="#faq" className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>{txt.faq}</a>
              
              <div className="px-4 py-3">
                <p className="text-gray-500 text-sm mb-2">🌐 {txt.language}</p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code as Language)}
                      className={`px-3 py-2 rounded-lg text-sm transition flex items-center gap-1.5 ${
                        language === lang.code ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {lang.flag} {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-gray-800 px-4">
                <Link href="/login" className="text-gray-300 hover:text-white py-3 text-center rounded-lg border border-gray-700 hover:bg-gray-800 transition" onClick={() => setMobileMenuOpen(false)}>{txt.login}</Link>
                <Link href="/register" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 text-center rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>{txt.signup}</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
