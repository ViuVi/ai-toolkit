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

  const plans: Plan[] = [
    { key: 'free', ...(t.pricing?.plans?.free || {}) },
    { key: 'pro', ...(t.pricing?.plans?.pro || {}) },
  ].filter((plan): plan is Plan => plan.name !== undefined)

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.pricing?.title || 'Pricing'}
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            {t.pricing?.subtitle || ''}
          </p>

          <div className="inline-flex items-center gap-4 bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-6 py-2 rounded-full transition ${
                !yearly ? 'bg-purple-600 text-white' : 'text-gray-400'
              }`}
            >
              {t.pricing?.monthly || 'Monthly'}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-6 py-2 rounded-full transition flex items-center gap-2 ${
                yearly ? 'bg-purple-600 text-white' : 'text-gray-400'
              }`}
            >
              {t.pricing?.yearly || 'Yearly'}
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                {t.pricing?.save || 'Save 17%'}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan: Plan) => (
            <div 
              key={plan.key}
              className={`relative bg-gray-800 rounded-2xl p-8 border ${
                plan.popular 
                  ? 'border-purple-500 scale-105' 
                  : 'border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Popular
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

              <ul className="space-y-4 mb-8">
                {(plan.features || []).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <span className="text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block text-center py-3 rounded-xl font-semibold transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
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
