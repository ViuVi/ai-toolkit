'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Hero() {
  const { language } = useLanguage()

  const texts = {
    title: language === 'tr' ? 'AI Destekli Sosyal Medya' : language === 'ru' ? 'ИИ-инструменты для' : language === 'de' ? 'KI-gestützte Social Media' : language === 'fr' ? 'Outils de contenu' : 'AI-Powered Social Media',
    titleHighlight: language === 'tr' ? 'İçerik Araçları' : language === 'ru' ? 'социальных сетей' : language === 'de' ? 'Content-Tools' : language === 'fr' ? "propulsés par l'IA" : 'Content Tools',
    subtitle: language === 'tr' ? 'AI destekli araçlarımızla viral içerik oluşturun, hashtag üretin, script yazın ve daha fazlası.' : language === 'ru' ? 'Создавайте вирусный контент, генерируйте хэштеги, пишите сценарии и многое другое.' : language === 'de' ? 'Erstellen Sie virale Inhalte, generieren Sie Hashtags, schreiben Sie Skripte und mehr.' : language === 'fr' ? "Créez du contenu viral, générez des hashtags, écrivez des scripts et plus encore." : 'Create viral content, generate hashtags, write scripts and more with our AI-powered tools.',
    cta: language === 'tr' ? 'Ücretsiz Başla' : language === 'ru' ? 'Начать бесплатно' : language === 'de' ? 'Kostenlos starten' : language === 'fr' ? 'Commencer gratuitement' : 'Get Started Free',
    ctaSecondary: language === 'tr' ? 'Fiyatları Gör' : language === 'ru' ? 'Посмотреть цены' : language === 'de' ? 'Preise ansehen' : language === 'fr' ? 'Voir les tarifs' : 'View Pricing'
  }

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          {texts.title}{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {texts.titleHighlight}
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
          {texts.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold text-lg transition shadow-lg">
            {texts.cta} →
          </Link>
          <a href="#pricing" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold text-lg transition border border-gray-700">
            {texts.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  )
}
