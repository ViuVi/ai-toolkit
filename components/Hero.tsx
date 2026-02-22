'use client'

import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'

const heroTexts: Record<Language, Record<string, string>> = {
  en: { badge: '🚀 AI-Powered Productivity', title: 'Clear Your Mind.', titleHighlight: 'Amplify Your Work.', subtitle: 'Stop wasting hours on repetitive tasks. Our AI tools help you write better, decide faster, and communicate clearer.', cta: 'Start Free', ctaSecondary: 'See How It Works', users: '10K+ Users', tools: '17+ AI Tools', requests: '500K+ Tasks Done' },
  tr: { badge: '🚀 AI Destekli Üretkenlik', title: 'Zihninizi Temizleyin.', titleHighlight: 'İşinizi Güçlendirin.', subtitle: 'Tekrarlayan görevlere saatler harcamayı bırakın. AI araçlarımız daha iyi yazmanıza ve daha hızlı karar vermenize yardımcı olur.', cta: 'Ücretsiz Başla', ctaSecondary: 'Nasıl Çalışır', users: '10K+ Kullanıcı', tools: '17+ AI Araç', requests: '500K+ Görev' },
  ru: { badge: '🚀 AI Продуктивность', title: 'Освободите разум.', titleHighlight: 'Усильте работу.', subtitle: 'Перестаньте тратить часы на рутину. Наши AI-инструменты помогут писать лучше и решать быстрее.', cta: 'Начать бесплатно', ctaSecondary: 'Как это работает', users: '10K+ Пользователей', tools: '17+ AI Инструментов', requests: '500K+ Задач' },
  de: { badge: '🚀 KI-Produktivität', title: 'Klarer Kopf.', titleHighlight: 'Bessere Arbeit.', subtitle: 'Verschwenden Sie keine Stunden mehr mit Routineaufgaben. Unsere KI-Tools helfen Ihnen besser zu schreiben.', cta: 'Kostenlos starten', ctaSecondary: 'So funktioniert es', users: '10K+ Nutzer', tools: '17+ KI-Tools', requests: '500K+ Aufgaben' },
  fr: { badge: '🚀 Productivité IA', title: 'Libérez votre esprit.', titleHighlight: 'Amplifiez votre travail.', subtitle: 'Arrêtez de perdre des heures sur des tâches répétitives. Nos outils IA vous aident à mieux écrire.', cta: 'Commencer gratuitement', ctaSecondary: 'Comment ça marche', users: '10K+ Utilisateurs', tools: '17+ Outils IA', requests: '500K+ Tâches' },
}

export default function Hero() {
  const { language } = useLanguage()
  const txt = heroTexts[language]

  return (
    <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
          <span className="text-purple-400 text-xs sm:text-sm font-medium">{txt.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          {txt.title}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{txt.titleHighlight}</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">{txt.subtitle}</p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0">
          <Link href="/register" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition transform hover:scale-105 active:scale-95">
            {txt.cta} →
          </Link>
          <a href="#pricing" className="bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition border border-gray-700">
            {txt.ctaSecondary}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16">
          <div className="text-center min-w-[80px]">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{txt.users}</div>
            <div className="text-gray-500 text-sm sm:text-base">Users</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{txt.tools}</div>
            <div className="text-gray-500 text-sm sm:text-base">AI Tools</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{txt.requests}</div>
            <div className="text-gray-500 text-sm sm:text-base">Tasks Done</div>
          </div>
        </div>
      </div>
    </section>
  )
}
