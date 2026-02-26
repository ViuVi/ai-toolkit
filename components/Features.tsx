'use client'
import { useLanguage } from '@/lib/LanguageContext'
import { t } from '@/lib/translations'

export default function Features() {
  const { language } = useLanguage()
  const f = t.features[language]

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{f.title}</h2>
          <p className="text-gray-400 text-lg">{f.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {f.items.map((item: any, i: number) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
