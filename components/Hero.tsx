'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
          <span className="text-purple-400 text-xs sm:text-sm font-medium">{t.hero?.badge || '🚀 AI-Powered'}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          {t.hero?.title || 'AI-Powered'}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {t.hero?.titleHighlight || 'Content Tools'}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
          {t.hero?.subtitle || 'Create amazing content with AI'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0">
          <Link 
            href="/register"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition transform hover:scale-105 active:scale-95"
          >
            {t.hero?.cta || 'Get Started'} →
          </Link>
          <a 
            href="#pricing"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition border border-gray-700"
          >
            {t.hero?.ctaSecondary || 'View Pricing'}
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16">
          <div className="text-center min-w-[80px]">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{t.hero?.stats?.users || '10K+'}</div>
            <div className="text-gray-500 text-sm sm:text-base">Users</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{t.hero?.stats?.tools || '17+'}</div>
            <div className="text-gray-500 text-sm sm:text-base">AI Tools</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{t.hero?.stats?.requests || '500K+'}</div>
            <div className="text-gray-500 text-sm sm:text-base">Tasks Done</div>
          </div>
        </div>
      </div>
    </section>
  )
}
