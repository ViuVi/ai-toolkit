'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { t } from '@/lib/translations'

export default function Testimonials() {
  const { language } = useLanguage()
  const te = t.testimonials[language]

  return (
    <section className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{te.title}</h2>
          <p className="text-gray-400 text-lg">{te.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {te.items.map((item: any, i: number) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{item.avatar}</div>
                <div><div className="font-semibold text-white">{item.name}</div><div className="text-gray-400 text-sm">{item.role}</div></div>
              </div>
              <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(n => <span key={n} className="text-yellow-400">★</span>)}</div>
              <p className="text-gray-300">"{item.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
