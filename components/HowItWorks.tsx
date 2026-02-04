'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-xl text-gray-400">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.howItWorks.steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < t.howItWorks.steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
              )}
              
              <div className="text-center">
                {/* Number */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-bold mb-6">
                  {step.number}
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}