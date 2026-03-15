'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

interface ToolLayoutProps {
  children: React.ReactNode
  toolName: string
  toolNameEn: string
  toolIcon: string
  toolCredits: number
  toolDescription: string
  toolDescriptionEn: string
}

const texts: any = {
  tr: { back: 'Dashboard', credits: 'Kredi', logout: 'Çıkış', insufficientCredits: 'Yetersiz kredi' },
  en: { back: 'Dashboard', credits: 'Credits', logout: 'Log out', insufficientCredits: 'Insufficient credits' },
  ru: { back: 'Панель', credits: 'Кредиты', logout: 'Выход', insufficientCredits: 'Недостаточно' },
  de: { back: 'Dashboard', credits: 'Credits', logout: 'Abmelden', insufficientCredits: 'Unzureichend' },
  fr: { back: 'Tableau', credits: 'Crédits', logout: 'Déconnexion', insufficientCredits: 'Insuffisant' },
}

export default function ToolLayout({ children, toolName, toolNameEn, toolIcon, toolCredits, toolDescription, toolDescriptionEn }: ToolLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else {
        setUser(user)
        supabase.from('credits').select('balance').eq('user_id', user.id).single()
          .then(({ data }) => setCredits(data?.balance || 0))
      }
    })
  }, [])

  const displayName = language === 'tr' ? toolName : toolNameEn
  const displayDesc = language === 'tr' ? toolDescription : toolDescriptionEn

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <span>←</span>
              <span className="hidden sm:inline">{t.back}</span>
            </Link>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{toolIcon}</span>
              <div>
                <h1 className="font-semibold text-white">{displayName}</h1>
                <p className="text-xs text-gray-500 hidden sm:block">{displayDesc}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Credits */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <span className="text-purple-400 text-sm">✦</span>
              <span className="font-medium">{credits}</span>
            </div>
            
            {/* Tool Cost */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm">
              <span className="text-gray-400">Cost:</span>
              <span className="text-white font-medium">{toolCredits}</span>
              <span className="text-gray-500">✦</span>
            </div>
            
            {/* Language */}
            <div className="relative group">
              <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition">
                🌐
              </button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
