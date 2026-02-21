'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
          <span className="text-purple-400 text-sm font-medium">{t.hero?.badge || '🚀 AI-Powered'}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          {t.hero?.title || 'AI-Powered'}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {t.hero?.titleHighlight || 'Content Tools'}
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          {t.hero?.subtitle || 'Create amazing content with AI'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/register"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition transform hover:scale-105"
          >
            {t.hero?.cta || 'Get Started'} →
          </Link>
          <a 
            href="#pricing"
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition border border-gray-700"
          >
            {t.hero?.ctaSecondary || 'View Pricing'}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{t.hero?.stats?.users || '10K+'}</div>
            <div className="text-gray-500">Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{t.hero?.stats?.tools || '16+'}</div>
            <div className="text-gray-500">AI Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{t.hero?.stats?.requests || '500K+'}</div>
            <div className="text-gray-500">Tasks Done</div>
          </div>
        </div>
      </div>
    </section>
  )
}
