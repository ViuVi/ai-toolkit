'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const { language } = useLanguage()

  const texts = {
    title: language === 'tr' ? 'Basit Fiyatlandırma' : language === 'ru' ? 'Простые цены' : language === 'de' ? 'Einfache Preise' : language === 'fr' ? 'Tarifs simples' : 'Simple Pricing',
    subtitle: language === 'tr' ? 'İhtiyacınıza uygun planı seçin' : language === 'ru' ? 'Выберите подходящий план' : language === 'de' ? 'Wählen Sie den passenden Plan' : language === 'fr' ? 'Choisissez le plan adapté' : 'Choose the plan that fits your needs',
    monthly: language === 'tr' ? 'Aylık' : language === 'ru' ? 'Ежемесячно' : language === 'de' ? 'Monatlich' : language === 'fr' ? 'Mensuel' : 'Monthly',
    yearly: language === 'tr' ? 'Yıllık' : language === 'ru' ? 'Ежегодно' : language === 'de' ? 'Jährlich' : language === 'fr' ? 'Annuel' : 'Yearly',
    save: language === 'tr' ? '%17 Tasarruf' : language === 'ru' ? 'Скидка 17%' : language === 'de' ? '17% sparen' : language === 'fr' ? '17% de réduction' : 'Save 17%',
    free: language === 'tr' ? 'Ücretsiz' : language === 'ru' ? 'Бесплатно' : language === 'de' ? 'Kostenlos' : language === 'fr' ? 'Gratuit' : 'Free',
    recommended: language === 'tr' ? 'Önerilen' : language === 'ru' ? 'Рекомендуется' : language === 'de' ? 'Empfohlen' : language === 'fr' ? 'Recommandé' : 'Recommended',
    startFree: language === 'tr' ? 'Ücretsiz Başla' : language === 'ru' ? 'Начать бесплатно' : language === 'de' ? 'Kostenlos starten' : language === 'fr' ? 'Commencer gratuitement' : 'Start Free',
    upgradePro: language === 'tr' ? "Pro'ya Geç" : language === 'ru' ? 'Перейти на Pro' : language === 'de' ? 'Auf Pro upgraden' : language === 'fr' ? 'Passer à Pro' : 'Upgrade to Pro',
    perMonth: language === 'tr' ? '/ay' : language === 'ru' ? '/мес' : language === 'de' ? '/Monat' : language === 'fr' ? '/mois' : '/mo',
    perYear: language === 'tr' ? '/yıl' : language === 'ru' ? '/год' : language === 'de' ? '/Jahr' : language === 'fr' ? '/an' : '/year'
  }

  const freeFeatures = [
    language === 'tr' ? '50 kredi/ay' : '50 credits/month',
    language === 'tr' ? 'Ücretsiz araçlara erişim' : 'Access to free tools',
    language === 'tr' ? 'Temel destek' : 'Basic support',
    language === 'tr' ? 'Reklam izle kredi kazan' : 'Watch ads for credits'
  ]

  const proFeatures = [
    language === 'tr' ? '1000 kredi/ay' : '1000 credits/month',
    language === 'tr' ? 'Tüm AI araçlarına erişim' : 'All AI tools',
    language === 'tr' ? 'Öncelikli destek' : 'Priority support',
    language === 'tr' ? 'Reklamsız kullanım' : 'No ads',
    language === 'tr' ? 'Sınırsız üretim' : 'Unlimited generations'
  ]

  return (
    <section id="pricing" className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{texts.title}</h2>
          <p className="text-xl text-gray-400">{texts.subtitle}</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={isYearly ? 'text-gray-400' : 'text-white'}>{texts.monthly}</span>
          <button onClick={() => setIsYearly(!isYearly)} className="relative w-14 h-7 bg-gray-700 rounded-full transition">
            <div className={'absolute top-1 w-5 h-5 bg-purple-500 rounded-full transition-all ' + (isYearly ? 'left-8' : 'left-1')} />
          </button>
          <span className={isYearly ? 'text-white' : 'text-gray-400'}>{texts.yearly}</span>
          {isYearly && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">{texts.save}</span>}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-2">{texts.free}</h3>
            <div className="text-4xl font-bold text-white mb-6">
              $0<span className="text-lg text-gray-400">{texts.perMonth}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span> {feature}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block w-full py-3 bg-gray-700 hover:bg-gray-600 text-center rounded-lg font-semibold transition">
              {texts.startFree}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-2xl p-8 relative">
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
              {texts.recommended}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <div className="text-4xl font-bold text-white mb-6">
              ${isYearly ? '49.99' : '4.99'}<span className="text-lg text-gray-400">{isYearly ? texts.perYear : texts.perMonth}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span> {feature}
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-center rounded-lg font-semibold transition">
              {texts.upgradePro}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
