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
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.features?.title || 'Features'}
          </h2>
          <p className="text-xl text-gray-400">
            {t.features?.subtitle || ''}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: FeatureItem, index: number) => (
            <div 
              key={index}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
