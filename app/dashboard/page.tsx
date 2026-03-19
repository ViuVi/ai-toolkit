'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const languages = ['en', 'tr', 'ru', 'de', 'fr'] as const
const languageNames: Record<string, string> = {
  en: '🇺🇸 English',
  tr: '🇹🇷 Türkçe',
  ru: '🇷🇺 Русский',
  de: '🇩🇪 Deutsch',
  fr: '🇫🇷 Français'
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState(0)
  const [plan, setPlan] = useState('free')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [showAdModal, setShowAdModal] = useState(false)
  const [adCountdown, setAdCountdown] = useState(30)
  const [adComplete, setAdComplete] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        fetchCredits(session.user.id)
      }
    })
  }, [router])

  const fetchCredits = async (userId: string) => {
    const { data } = await supabase
      .from('credits')
      .select('balance, plan, avatar_url')
      .eq('user_id', userId)
      .single()
    
    if (data) {
      setCredits(data.balance || 0)
      setPlan(data.plan || 'free')
      setAvatarUrl(data.avatar_url)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Watch Ad for Credits
  const startWatchingAd = () => {
    setShowAdModal(true)
    setAdCountdown(30)
    setAdComplete(false)
  }

  useEffect(() => {
    if (showAdModal && adCountdown > 0 && !adComplete) {
      const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showAdModal && adCountdown === 0 && !adComplete) {
      addAdCredits()
    }
  }, [showAdModal, adCountdown, adComplete])

  const addAdCredits = async () => {
    if (!user) return
    setAdComplete(true)
    
    const { error } = await supabase
      .from('credits')
      .update({ balance: credits + 10 })
      .eq('user_id', user.id)
    
    if (!error) {
      setCredits(credits + 10)
    }
    
    setTimeout(() => {
      setShowAdModal(false)
    }, 2000)
  }

  const tools = [
    { key: 'hookGenerator', icon: '🎣', href: '/tools/hook-generator', credits: 3, color: 'purple' },
    { key: 'captionGenerator', icon: '✍️', href: '/tools/caption-generator', credits: 3, color: 'pink' },
    { key: 'scriptStudio', icon: '🎬', href: '/tools/script-studio', credits: 6, color: 'blue' },
    { key: 'viralAnalyzer', icon: '📊', href: '/tools/viral-analyzer', credits: 5, color: 'green' },
    { key: 'stealVideo', icon: '🎯', href: '/tools/steal-video', credits: 8, color: 'orange' },
    { key: 'videoFinder', icon: '🔍', href: '/tools/video-finder', credits: 5, color: 'cyan' },
    { key: 'trendRadar', icon: '📡', href: '/tools/trend-radar', credits: 4, color: 'red' },
    { key: 'competitorSpy', icon: '🕵️', href: '/tools/competitor-spy', credits: 8, color: 'yellow' },
    { key: 'hashtagResearch', icon: '#️⃣', href: '/tools/hashtag-research', credits: 3, color: 'indigo' },
    { key: 'contentPlanner', icon: '📅', href: '/tools/content-planner', credits: 10, color: 'emerald' },
    { key: 'contentRepurposer', icon: '♻️', href: '/tools/content-repurposer', credits: 8, color: 'violet' },
    { key: 'abTester', icon: '⚔️', href: '/tools/ab-tester', credits: 5, color: 'rose' },
    { key: 'carouselPlanner', icon: '🎠', href: '/tools/carousel-planner', credits: 5, color: 'amber' },
    { key: 'engagementBooster', icon: '🚀', href: '/tools/engagement-booster', credits: 4, color: 'sky' },
    { key: 'postingOptimizer', icon: '⏰', href: '/tools/posting-optimizer', credits: 2, color: 'lime' },
    { key: 'threadComposer', icon: '🧵', href: '/tools/thread-composer', credits: 5, color: 'fuchsia' },
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo - Ana sayfaya yönlendir */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">MediaToolKit</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-sm"
              >
                {languageNames[language].split(' ')[0]}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLangMenu(false) }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition ${language === lang ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300'}`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Credits */}
            <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <span className="text-purple-400 font-medium">✦ {credits}</span>
            </div>

            {/* Watch Ad Button */}
            <button
              onClick={startWatchingAd}
              className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium hover:from-green-500/30 hover:to-emerald-500/30 transition hidden sm:block"
            >
              🎬 +10
            </button>

            {/* Avatar / User Menu */}
            <div className="flex items-center gap-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 text-sm">{user.email?.[0].toUpperCase()}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition hidden sm:block"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}, {user.email?.split('@')[0]}! 👋</h1>
          <p className="text-gray-400">{t('dashboard.credits')}: <span className="text-purple-400 font-semibold">{credits}</span></p>
        </div>

        {/* Watch Ad Card - Mobile */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl sm:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-400">{t('ad.title')}</h3>
              <p className="text-sm text-gray-400">{t('ad.description')}</p>
            </div>
            <button
              onClick={startWatchingAd}
              className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium"
            >
              +10 🎬
            </button>
          </div>
        </div>

        {/* Tools Grid */}
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.tools')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.key}
              href={tool.href}
              className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/30 hover:bg-white/[0.04] transition"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{tool.icon}</span>
                <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg">
                  {tool.credits} {t('dashboard.credits').toLowerCase()}
                </span>
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition">
                {t(`tool.${tool.key}`)}
              </h3>
              <p className="text-sm text-gray-500">
                {t(`tool.${tool.key}.desc`)}
              </p>
            </Link>
          ))}
        </div>
      </main>

      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-md w-full text-center">
            {!adComplete ? (
              <>
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-xl font-bold mb-2">{t('ad.watching')}</h3>
                
                {/* Fake Ad Content */}
                <div className="my-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                  <p className="text-sm text-gray-300 mb-2">✨ MediaToolKit Pro ✨</p>
                  <p className="text-xs text-gray-400">Unlock unlimited credits and premium features!</p>
                </div>

                {/* Countdown */}
                <div className="mb-4">
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((30 - adCountdown) / 30) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">{adCountdown} {t('ad.remaining')}</p>
                </div>

                <button
                  onClick={() => setShowAdModal(false)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition"
                >
                  {t('common.cancel')}
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">{t('ad.complete')}</h3>
                <p className="text-gray-400">+10 {t('dashboard.credits')}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
