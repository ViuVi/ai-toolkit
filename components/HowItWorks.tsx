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
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            {t.howItWorks?.title || 'How It Works'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            {t.howItWorks?.subtitle || ''}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 lg:gap-8">
          {steps.map((step: Step, index: number) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs relative w-full md:w-auto">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 shadow-lg shadow-purple-500/25">
                {step.number}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{step.description}</p>
              
              {/* Arrow - Desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-full w-6 lg:w-12 text-gray-600 text-xl lg:text-2xl">
                  →
                </div>
              )}
              
              {/* Arrow - Mobile only */}
              {index < steps.length - 1 && (
                <div className="md:hidden text-gray-600 text-2xl mt-4">
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
