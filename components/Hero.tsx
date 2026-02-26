'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { t } from '@/lib/translations'

export default function Hero() {
  const { language } = useLanguage()
  const hero = t.hero[language]

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
          <span className="text-purple-400 text-sm font-medium">{hero.badge}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {hero.title}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{hero.highlight}</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">{hero.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/register" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg">{hero.cta} →</Link>
          <a href="#pricing" className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-gray-700">{hero.cta2}</a>
        </div>
        <div className="flex justify-center gap-16">
          <div className="text-center"><div className="text-3xl font-bold text-white">10K+</div><div className="text-gray-500">Users</div></div>
          <div className="text-center"><div className="text-3xl font-bold text-white">17+</div><div className="text-gray-500">AI Tools</div></div>
          <div className="text-center"><div className="text-3xl font-bold text-white">500K+</div><div className="text-gray-500">Tasks Done</div></div>
        </div>
      </div>
    </section>
  )
}
