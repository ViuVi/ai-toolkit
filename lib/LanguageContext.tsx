'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import { en } from '@/locales/en'
import { tr } from '@/locales/tr'
import { ru } from '@/locales/ru'
import { de } from '@/locales/de'
import { fr } from '@/locales/fr'

export type Language = 'en' | 'tr' | 'ru' | 'de' | 'fr'

const translations: Record<Language, any> = { en, tr, ru, de, fr }

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['en', 'tr', 'ru', 'de', 'fr'].includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  // useMemo ile t'yi language değiştiğinde otomatik güncelle
  const t = useMemo(() => translations[language], [language])

  // Hydration hatalarını önlemek için
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: 'en', setLanguage, t: en }}>
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
