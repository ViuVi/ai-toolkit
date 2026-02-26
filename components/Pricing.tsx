'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular: boolean
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false)
  const { t } = useLanguage()

  const freePlan: Plan = t.pricing?.plans?.free || { name: 'Free', price: '$0', period: '/month', description: '', features: [], cta: 'Start Free', popular: false }
  const starterPlan: Plan = t.pricing?.plans?.starter || { name: 'Starter', price: '$2.99', period: '/month', description: '', features: [], cta: 'Get Started', popular: false }
  const proPlan: Plan = t.pricing?.plans?.pro || { name: 'Pro', price: '$4.99', period: '/month', description: '', features: [], cta: 'Upgrade', popular: true }

  const plans: Plan[] = [freePlan, starterPlan, proPlan]

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.pricing?.title || 'Pricing'}</h2>
          <p className="text-xl text-gray-400 mb-8">{t.pricing?.subtitle || ''}</p>

          <div className="inline-flex items-center gap-4 bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-6 py-2 rounded-full transition ${!yearly ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
            >
              {t.pricing?.monthly || 'Monthly'}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-6 py-2 rounded-full transition flex items-center gap-2 ${yearly ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
            >
              {t.pricing?.yearly || 'Yearly'}
              <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">{t.pricing?.save || 'Save 17%'}</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan: Plan, index: number) => (
            <div key={index} className={`relative bg-gray-800 rounded-2xl p-8 border ${plan.popular ? 'border-purple-500 scale-105' : 'border-gray-700'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">
                    {yearly && plan.price !== '$0' ? `$${(parseFloat(plan.price.replace('$', '')) * 10).toFixed(0)}` : plan.price}
                  </span>
                  <span className="text-gray-400">{yearly ? '/year' : plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{feature}</span>
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
