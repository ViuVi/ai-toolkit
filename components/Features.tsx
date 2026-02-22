'use client'

import { useLanguage } from '@/lib/LanguageContext'

interface FeatureItem {
  icon: string
  title: string
  description: string
}

export default function Features() {
  const { t } = useLanguage()

  const items: FeatureItem[] = t.features?.items || []

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            {t.features?.title || 'Features'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            {t.features?.subtitle || ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {items.map((item: FeatureItem, index: number) => (
            <div 
              key={index}
              className="bg-gray-800/50 border border-gray-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-purple-500/50 transition-all hover:transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
