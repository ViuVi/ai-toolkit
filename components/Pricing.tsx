'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'

export default function Pricing() {
  const { t } = useLanguage()
  const [yearly, setYearly] = useState(false)

  const plans = [
    { key: 'free', ...t.pricing.plans.free },
    { key: 'starter', ...t.pricing.plans.starter },
    { key: 'pro', ...t.pricing.plans.pro },
  ]

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            {t.pricing.subtitle}
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-6 py-2 rounded-full transition ${
                !yearly ? 'bg-blue-600 text-white' : 'text-gray-400'
              }`}
            >
              {t.pricing.monthly}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-6 py-2 rounded-full transition flex items-center gap-2 ${
                yearly ? 'bg-blue-600 text-white' : 'text-gray-400'
              }`}
            >
              {t.pricing.yearly}
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                {t.pricing.save}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.key}
              className={`relative bg-gray-800 rounded-2xl p-8 border ${
                plan.popular 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-700'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <span className="text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/register"
                className={`block text-center py-3 rounded-xl font-semibold transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
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