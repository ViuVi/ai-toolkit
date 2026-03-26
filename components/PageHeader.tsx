'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const headerTexts: Record<string, Record<string, string>> = {
  en: { home: 'Home', dashboard: 'Dashboard' },
  tr: { home: 'Ana Sayfa', dashboard: 'Dashboard' },
  ru: { home: 'Главная', dashboard: 'Панель' },
  de: { home: 'Startseite', dashboard: 'Dashboard' },
  fr: { home: 'Accueil', dashboard: 'Tableau de bord' }
}

export default function PageHeader() {
  const { language, setLanguage } = useLanguage()
  const t = headerTexts[language] || headerTexts.en

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" scroll={false} className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg sm:text-xl font-bold">M</div>
          <span className="text-lg sm:text-xl font-bold hidden sm:block">MediaToolkit</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" scroll={false} className="text-gray-400 hover:text-white transition text-sm">{t.home}</Link>
          <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium hover:opacity-90 transition">
            {t.dashboard}
          </Link>
          
          <div className="relative group">
            <button className="px-2 py-1.5 text-sm text-gray-400 hover:text-white transition">🌐</button>
            <div className="absolute right-0 mt-2 w-28 bg-[#1a1a2e] border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
              {['en','tr','ru','de','fr'].map(l => (
                <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
