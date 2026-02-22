'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import { translations } from './translations'

export type Language = 'en' | 'tr' | 'ru' | 'de' | 'fr'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedLang = localStorage.getItem('language') as Language
      if (savedLang && ['en', 'tr', 'ru', 'de', 'fr'].includes(savedLang)) {
        setLanguageState(savedLang)
      }
    } catch (e) {}
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('language', lang)
    } catch (e) {}
  }

  const t = useMemo(() => translations[language] || translations.en, [language])

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: 'en', setLanguage, t: translations.en }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
