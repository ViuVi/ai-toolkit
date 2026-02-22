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
    <section id="faq" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            {t.faq?.title || 'FAQ'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            {t.faq?.subtitle || ''}
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {items.map((item: FAQItem, index: number) => (
            <div 
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left"
              >
                <span className="text-white font-semibold pr-4 text-sm sm:text-base">
                  {item.question}
                </span>
                <span className={`text-xl sm:text-2xl text-gray-400 transition-transform flex-shrink-0 ${
                  openIndex === index ? 'rotate-45' : ''
                }`}>
                  +
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 animate-fadeIn">
                  <p className="text-gray-400 text-sm sm:text-base">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
