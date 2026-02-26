'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { t } from '@/lib/translations'

export default function HowItWorks() {
  const { language } = useLanguage()
  const h = t.howItWorks[language]

  return (
    <section className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{h.title}</h2>
          <p className="text-gray-400 text-lg">{h.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {h.steps.map((step: any, i: number) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">{step.n}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.t}</h3>
              <p className="text-gray-400">{step.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
