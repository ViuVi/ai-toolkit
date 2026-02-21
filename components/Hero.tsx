'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
          <span className="text-blue-400 text-sm font-medium">{t.hero.badge}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          {t.hero.title}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {t.hero.titleHighlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          {t.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link 
            href="/register"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition transform hover:scale-105"
          >
            {t.hero.cta} →
          </Link>
          <a 
            href="#pricing"
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition border border-gray-700"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{t.hero.stats.users}</div>
            <div className="text-gray-500">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{t.hero.stats.tools}</div>
            <div className="text-gray-500">AI Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{t.hero.stats.requests}</div>
            <div className="text-gray-500">Requests Processed</div>
          </div>
        </div>

        {/* Demo Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 pointer-events-none" />
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">📝</div>
                <div>
                  <div className="text-white font-semibold">Text Summarizer</div>
                  <div className="text-gray-400 text-sm">Summarize any text instantly</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="text-gray-400 text-sm mb-2">Input</div>
                <div className="text-gray-300 text-sm">
                  Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans...
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="text-blue-400 text-sm mb-2">✨ AI Summary</div>
                <div className="text-white text-sm">
                  AI is machine-demonstrated intelligence that mimics human cognitive functions like learning and problem-solving.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}