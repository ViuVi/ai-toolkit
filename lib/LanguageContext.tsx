'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { en } from '@/locales/en'
import { tr } from '@/locales/tr'
import { ru } from '@/locales/ru'
import { de } from '@/locales/de'
import { fr } from '@/locales/fr'

export type Language = 'en' | 'tr' | 'ru' | 'de' | 'fr'

const translations = { en, tr, ru, de, fr }

type TranslationType = typeof en

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationType
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [t, setT] = useState<TranslationType>(en)

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['en', 'tr', 'ru', 'de', 'fr'].includes(savedLang)) {
      setLanguageState(savedLang)
      setT(translations[savedLang])
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setT(translations[lang])
    localStorage.setItem('language', lang)
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
