'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'tr' | 'ru' | 'de' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {}
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>('en')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('site_lang') as Language
    if (saved && ['en', 'tr', 'ru', 'de', 'fr'].includes(saved)) {
      setLang(saved)
    }
    setReady(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLang(lang)
    localStorage.setItem('site_lang', lang)
  }

  if (!ready) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
