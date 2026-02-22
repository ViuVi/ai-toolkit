'use client'

import { useLanguage, Language } from '@/lib/LanguageContext'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqTexts: Record<Language, { title: string; subtitle: string; items: FAQItem[] }> = {
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know',
    items: [
      { question: 'What are credits?', answer: 'Credits are units used for AI tools. Each tool uses a different amount of credits based on complexity.' },
      { question: 'Can I cancel anytime?', answer: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, and PayPal.' },
      { question: 'How long is the free plan available?', answer: 'The free plan is available forever. You get 50 credits every month to use our tools.' },
    ],
  },
  tr: {
    title: 'Sıkça Sorulan Sorular',
    subtitle: 'Bilmeniz gereken her şey',
    items: [
      { question: 'Krediler nedir?', answer: 'Krediler AI araçları için kullanılan birimlerdir. Her araç karmaşıklığına göre farklı miktarda kredi kullanır.' },
      { question: 'İstediğim zaman iptal edebilir miyim?', answer: 'Evet! Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Erişiminiz fatura döneminizin sonuna kadar devam eder.' },
      { question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', answer: 'Tüm büyük kredi kartlarını, banka kartlarını ve PayPal\'ı kabul ediyoruz.' },
      { question: 'Ücretsiz plan ne kadar süre geçerli?', answer: 'Ücretsiz plan sonsuza kadar geçerlidir. Her ay araçlarımızı kullanmak için 50 kredi alırsınız.' },
    ],
  },
  ru: {
    title: 'Частые вопросы',
    subtitle: 'Всё что нужно знать',
    items: [
      { question: 'Что такое кредиты?', answer: 'Кредиты — единицы для использования AI инструментов. Каждый инструмент использует разное количество.' },
      { question: 'Могу отменить в любое время?', answer: 'Да! Отмените когда угодно. Доступ сохранится до конца периода.' },
      { question: 'Какие способы оплаты?', answer: 'Кредитные карты, дебетовые карты и PayPal.' },
      { question: 'Как долго бесплатный план?', answer: 'Бесплатный план бессрочный. 50 кредитов каждый месяц.' },
    ],
  },
  de: {
    title: 'Häufige Fragen',
    subtitle: 'Alles was Sie wissen müssen',
    items: [
      { question: 'Was sind Credits?', answer: 'Credits sind Einheiten zur Nutzung von KI-Tools. Jedes Tool verbraucht unterschiedlich viele.' },
      { question: 'Kann ich jederzeit kündigen?', answer: 'Ja! Kündigen Sie jederzeit. Zugang bleibt bis Periodenende.' },
      { question: 'Welche Zahlungsmethoden?', answer: 'Kreditkarten, Debitkarten und PayPal.' },
      { question: 'Wie lange kostenloser Plan?', answer: 'Der kostenlose Plan ist unbegrenzt. 50 Credits jeden Monat.' },
    ],
  },
  fr: {
    title: 'Questions fréquentes',
    subtitle: 'Tout ce que vous devez savoir',
    items: [
      { question: 'Que sont les crédits?', answer: 'Les crédits sont des unités pour utiliser les outils IA. Chaque outil utilise un nombre différent.' },
      { question: 'Puis-je annuler à tout moment?', answer: 'Oui! Annulez quand vous voulez. L\'accès reste jusqu\'à la fin de la période.' },
      { question: 'Quels modes de paiement?', answer: 'Cartes de crédit, cartes de débit et PayPal.' },
      { question: 'Combien de temps le plan gratuit?', answer: 'Le plan gratuit est illimité. 50 crédits chaque mois.' },
    ],
  },
}

export default function FAQ() {
  const { language } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const txt = faqTexts[language]

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{txt.title}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">{txt.subtitle}</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {txt.items.map((item, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-4 sm:p-6 text-left">
                <span className="text-white font-semibold pr-4 text-sm sm:text-base">{item.question}</span>
                <span className={`text-xl sm:text-2xl text-gray-400 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-45' : ''}`}>+</span>
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
