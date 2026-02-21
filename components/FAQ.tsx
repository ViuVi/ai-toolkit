'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQ() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const items: FAQItem[] = t.faq?.items || []

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.faq?.title || 'FAQ'}
          </h2>
          <p className="text-xl text-gray-400">
            {t.faq?.subtitle || ''}
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item: FAQItem, index: number) => (
            <div 
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-white font-semibold pr-4">
                  {item.question}
                </span>
                <span className={`text-2xl text-gray-400 transition-transform ${
                  openIndex === index ? 'rotate-45' : ''
                }`}>
                  +
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-400">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
