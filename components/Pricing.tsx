'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { t } from '@/lib/translations'

export default function Pricing() {
  const [yearly, setYearly] = useState(false)
  const { language } = useLanguage()
  const p = t.pricing[language]

  const plans = [p.free, p.starter, p.pro]

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{p.title}</h2>
          <p className="text-gray-400 text-lg mb-8">{p.subtitle}</p>
          <div className="inline-flex items-center gap-4 bg-gray-800 rounded-full p-1">
            <button onClick={() => setYearly(false)} className={`px-6 py-2 rounded-full transition ${!yearly ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>{p.monthly}</button>
            <button onClick={() => setYearly(true)} className={`px-6 py-2 rounded-full transition ${yearly ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>{p.yearly} <span className="text-green-400 text-sm ml-1">{p.save}</span></button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan: any, i: number) => (
            <div key={i} className={`bg-gray-800 border rounded-2xl p-8 relative ${plan.popular ? 'border-purple-500' : 'border-gray-700'}`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-1 rounded-full">POPULAR</div>}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.desc}</p>
              <div className="mb-6"><span className="text-4xl font-bold text-white">{plan.price}</span><span className="text-gray-400">{plan.period}</span></div>
              <ul className="space-y-3 mb-8">{plan.features.map((f: string, j: number) => (<li key={j} className="flex items-center gap-2 text-gray-300"><span className="text-green-400">✓</span>{f}</li>))}</ul>
              <Link href="/register" className={`block text-center py-3 rounded-xl font-semibold transition ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>{plan.cta}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
