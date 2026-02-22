'use client'

import { useLanguage } from '@/lib/LanguageContext'

interface Testimonial {
  name: string
  role: string
  text: string
  avatar: string
  rating: number
}

export default function Testimonials() {
  const { t } = useLanguage()

  const items: Testimonial[] = t.testimonials?.items || []

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            {t.testimonials?.title || 'Testimonials'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            {t.testimonials?.subtitle || ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {items.map((item: Testimonial, index: number) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="text-3xl sm:text-4xl">{item.avatar}</div>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base">{item.name}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{item.role}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">"{item.text}"</p>
              <div className="text-yellow-400 text-sm sm:text-base">{'★'.repeat(item.rating || 5)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
