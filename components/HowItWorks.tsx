'use client'

import { useLanguage } from '@/lib/LanguageContext'

interface Step {
  number: string
  title: string
  description: string
}

export default function HowItWorks() {
  const { t } = useLanguage()

  const steps: Step[] = t.howItWorks?.steps || []

  return (
    <section className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.howItWorks?.title || 'How It Works'}
          </h2>
          <p className="text-xl text-gray-400">
            {t.howItWorks?.subtitle || ''}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {steps.map((step: Step, index: number) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-16 text-gray-600 text-2xl">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
