'use client'

import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useState } from 'react'

interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular: boolean
}

const pricingTexts: Record<Language, { title: string; subtitle: string; monthly: string; yearly: string; save: string; free: Plan; pro: Plan }> = {
  en: {
    title: 'Simple, Honest Pricing',
    subtitle: 'Start free. Upgrade when you need more.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save: 'Save 17%',
    free: { name: 'Free', price: '$0', period: '/month', description: 'For getting started', features: ['50 credits/month', 'Basic tools', 'Email support'], cta: 'Start Free', popular: false },
    pro: { name: 'Pro', price: '$4.99', period: '/month', description: 'For professionals', features: ['1000 credits/month', 'All AI tools', 'Priority support', 'No ads'], cta: 'Upgrade to Pro', popular: true },
  },
  tr: {
    title: 'Basit, Dürüst Fiyatlandırma',
    subtitle: 'Ücretsiz başlayın. İhtiyacınız olduğunda yükseltin.',
    monthly: 'Aylık',
    yearly: 'Yıllık',
    save: '%17 Tasarruf',
    free: { name: 'Ücretsiz', price: '$0', period: '/ay', description: 'Başlamak için', features: ['50 kredi/ay', 'Temel araçlar', 'E-posta desteği'], cta: 'Ücretsiz Başla', popular: false },
    pro: { name: 'Pro', price: '$4.99', period: '/ay', description: 'Profesyoneller için', features: ['1000 kredi/ay', 'Tüm AI araçları', 'Öncelikli destek', 'Reklamsız'], cta: 'Pro\'ya Yükselt', popular: true },
  },
  ru: {
    title: 'Простые цены',
    subtitle: 'Начните бесплатно. Обновите когда нужно.',
    monthly: 'Ежемесячно',
    yearly: 'Ежегодно',
    save: 'Скидка 17%',
    free: { name: 'Бесплатно', price: '$0', period: '/месяц', description: 'Для начала', features: ['50 кредитов/месяц', 'Базовые инструменты', 'Email поддержка'], cta: 'Начать бесплатно', popular: false },
    pro: { name: 'Pro', price: '$4.99', period: '/месяц', description: 'Для профессионалов', features: ['1000 кредитов/месяц', 'Все AI инструменты', 'Приоритетная поддержка', 'Без рекламы'], cta: 'Перейти на Pro', popular: true },
  },
  de: {
    title: 'Einfache Preise',
    subtitle: 'Kostenlos starten. Upgraden wenn nötig.',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    save: '17% sparen',
    free: { name: 'Kostenlos', price: '$0', period: '/Monat', description: 'Zum Einstieg', features: ['50 Credits/Monat', 'Basis-Tools', 'E-Mail Support'], cta: 'Kostenlos starten', popular: false },
    pro: { name: 'Pro', price: '$4.99', period: '/Monat', description: 'Für Profis', features: ['1000 Credits/Monat', 'Alle KI-Tools', 'Prioritäts-Support', 'Keine Werbung'], cta: 'Auf Pro upgraden', popular: true },
  },
  fr: {
    title: 'Tarifs simples',
    subtitle: 'Commencez gratuitement. Passez à la version supérieure quand nécessaire.',
    monthly: 'Mensuel',
    yearly: 'Annuel',
    save: '17% d\'économie',
    free: { name: 'Gratuit', price: '$0', period: '/mois', description: 'Pour commencer', features: ['50 crédits/mois', 'Outils de base', 'Support email'], cta: 'Commencer gratuitement', popular: false },
    pro: { name: 'Pro', price: '$4.99', period: '/mois', description: 'Pour les pros', features: ['1000 crédits/mois', 'Tous les outils IA', 'Support prioritaire', 'Sans publicité'], cta: 'Passer à Pro', popular: true },
  },
}

export default function Pricing() {
  const { language } = useLanguage()
  const [yearly, setYearly] = useState(false)
  const txt = pricingTexts[language]

  const plans = [txt.free, { ...txt.pro, price: yearly ? '$49.99' : txt.pro.price, period: yearly ? '/year' : txt.pro.period }]

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{txt.title}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">{txt.subtitle}</p>

          <div className="inline-flex items-center gap-2 sm:gap-4 bg-gray-800 rounded-full p-1">
            <button onClick={() => setYearly(false)} className={`px-4 sm:px-6 py-2 rounded-full transition text-sm sm:text-base ${!yearly ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>{txt.monthly}</button>
            <button onClick={() => setYearly(true)} className={`px-4 sm:px-6 py-2 rounded-full transition flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${yearly ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>
              {txt.yearly}
              <span className="text-[10px] sm:text-xs bg-green-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full">{txt.save}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 border ${plan.popular ? 'border-purple-500 md:scale-105' : 'border-gray-700'}`}>
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 rounded-full whitespace-nowrap">Most Popular</div>
              )}

              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm sm:text-base">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className={`block text-center py-3 rounded-xl font-semibold transition text-sm sm:text-base ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 active:scale-95' : 'bg-gray-700 text-white hover:bg-gray-600 active:scale-95'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
