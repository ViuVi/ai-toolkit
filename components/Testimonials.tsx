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
    <section className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.testimonials?.title || 'Testimonials'}
          </h2>
          <p className="text-xl text-gray-400">
            {t.testimonials?.subtitle || ''}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item: Testimonial, index: number) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{item.avatar}</div>
                <div>
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-sm text-gray-400">{item.role}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">"{item.text}"</p>
              <div className="text-yellow-400">{'★'.repeat(item.rating || 5)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
