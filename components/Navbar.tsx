'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  const texts = {
    features: language === 'tr' ? 'Özellikler' : language === 'ru' ? 'Функции' : language === 'de' ? 'Funktionen' : language === 'fr' ? 'Fonctionnalités' : 'Features',
    pricing: language === 'tr' ? 'Fiyatlar' : language === 'ru' ? 'Цены' : language === 'de' ? 'Preise' : language === 'fr' ? 'Tarifs' : 'Pricing',
    faq: 'FAQ',
    login: language === 'tr' ? 'Giriş' : language === 'ru' ? 'Вход' : language === 'de' ? 'Anmelden' : language === 'fr' ? 'Connexion' : 'Login',
    signup: language === 'tr' ? 'Başla' : language === 'ru' ? 'Начать' : language === 'de' ? 'Starten' : language === 'fr' ? 'Commencer' : 'Get Started'
  }

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
            <a href="#features" className="text-gray-300 hover:text-white transition">{texts.features}</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">{texts.pricing}</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition">{texts.faq}</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
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
            <Link href="/login" className="text-gray-300 hover:text-white transition">{texts.login}</Link>
            <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition">{texts.signup}</Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#features" className="block text-gray-300 hover:text-white">{texts.features}</a>
            <a href="#pricing" className="block text-gray-300 hover:text-white">{texts.pricing}</a>
            <a href="#faq" className="block text-gray-300 hover:text-white">{texts.faq}</a>
            <div className="pt-4 space-y-2">
              <Link href="/login" className="block text-gray-300 hover:text-white">{texts.login}</Link>
              <Link href="/register" className="block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-center">{texts.signup}</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
