'use client'
import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { t } from '@/lib/translations'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { language } = useLanguage()
  const f = t.faq[language]

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{f.title}</h2>
          <p className="text-gray-400 text-lg">{f.subtitle}</p>
        </div>
        <div className="space-y-4">
          {f.items.map((item: any, i: number) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full px-6 py-4 text-left flex items-center justify-between">
                <span className="font-semibold text-white">{item.q}</span>
                <span className="text-purple-400">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && <div className="px-6 pb-4 text-gray-400">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
