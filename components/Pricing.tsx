'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'

interface Plan {
  key: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
}

export default function Pricing() {
  const { t } = useLanguage()
  const [yearly, setYearly] = useState(false)

  const freePlan = t.pricing?.plans?.free || {}
  const proPlan = t.pricing?.plans?.pro || {}

  const plans: Plan[] = [
    { key: 'free', name: freePlan.name || 'Free', price: freePlan.price || '$0', period: freePlan.period || '/month', description: freePlan.description || '', features: freePlan.features || [], cta: freePlan.cta || 'Start Free', popular: false },
    { key: 'pro', name: proPlan.name || 'Pro', price: yearly ? '$49.99' : (proPlan.price || '$4.99'), period: yearly ? '/year' : (proPlan.period || '/month'), description: proPlan.description || '', features: proPlan.features || [], cta: proPlan.cta || 'Upgrade to Pro', popular: true },
  ]

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            {t.pricing?.title || 'Pricing'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">
            {t.pricing?.subtitle || ''}
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-2 sm:gap-4 bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 sm:px-6 py-2 rounded-full transition text-sm sm:text-base ${
                !yearly ? 'bg-purple-600 text-white' : 'text-gray-400'
              }`}
            >
              {t.pricing?.monthly || 'Monthly'}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 sm:px-6 py-2 rounded-full transition flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                yearly ? 'bg-purple-600 text-white' : 'text-gray-400'
              }`}
            >
              {t.pricing?.yearly || 'Yearly'}
              <span className="text-[10px] sm:text-xs bg-green-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full">
                {t.pricing?.save || 'Save 17%'}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {plans.map((plan: Plan) => (
            <div 
              key={plan.key}
              className={`relative bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 border ${
                plan.popular 
                  ? 'border-purple-500 md:scale-105' 
                  : 'border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-sm sm:text-base">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {(plan.features || []).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block text-center py-3 rounded-xl font-semibold transition text-sm sm:text-base ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 active:scale-95'
                    : 'bg-gray-700 text-white hover:bg-gray-600 active:scale-95'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
