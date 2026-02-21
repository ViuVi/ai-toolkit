'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { language } = useLanguage()

  const texts = {
    title: language === 'tr' ? 'Sıkça Sorulan Sorular' : language === 'ru' ? 'Частые вопросы' : language === 'de' ? 'Häufige Fragen' : language === 'fr' ? 'Questions fréquentes' : 'Frequently Asked Questions',
    subtitle: language === 'tr' ? 'Merak ettikleriniz' : language === 'ru' ? 'Ответы на ваши вопросы' : language === 'de' ? 'Antworten auf Ihre Fragen' : language === 'fr' ? 'Réponses à vos questions' : 'Answers to your questions'
  }

  const faqs = [
    {
      question: language === 'tr' ? 'Kredi nedir?' : language === 'ru' ? 'Что такое кредиты?' : language === 'de' ? 'Was sind Credits?' : language === 'fr' ? 'Que sont les crédits ?' : 'What are credits?',
      answer: language === 'tr' ? 'Krediler, AI araçlarını kullanmak için harcadığınız birimlerdir. Her araç farklı miktarda kredi kullanır.' : language === 'ru' ? 'Кредиты — это единицы, которые вы тратите на использование AI инструментов.' : language === 'de' ? 'Credits sind Einheiten, die Sie für die Nutzung von AI-Tools ausgeben.' : language === 'fr' ? "Les crédits sont des unités que vous dépensez pour utiliser les outils AI." : 'Credits are units you spend to use AI tools. Each tool uses different amounts of credits.'
    },
    {
      question: language === 'tr' ? 'İstediğim zaman iptal edebilir miyim?' : language === 'ru' ? 'Могу ли я отменить в любое время?' : language === 'de' ? 'Kann ich jederzeit kündigen?' : language === 'fr' ? 'Puis-je annuler à tout moment ?' : 'Can I cancel anytime?',
      answer: language === 'tr' ? 'Evet! Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Dönem sonuna kadar erişiminiz devam eder.' : language === 'ru' ? 'Да! Вы можете отменить подписку в любое время.' : language === 'de' ? 'Ja! Sie können Ihr Abonnement jederzeit kündigen.' : language === 'fr' ? 'Oui ! Vous pouvez annuler votre abonnement à tout moment.' : "Yes! You can cancel your subscription anytime. You'll retain access until the end of your billing period."
    },
    {
      question: language === 'tr' ? 'Hangi ödeme yöntemlerini kabul ediyorsunuz?' : language === 'ru' ? 'Какие способы оплаты вы принимаете?' : language === 'de' ? 'Welche Zahlungsmethoden akzeptieren Sie?' : language === 'fr' ? 'Quels modes de paiement acceptez-vous ?' : 'What payment methods do you accept?',
      answer: language === 'tr' ? 'Kredi kartı, banka kartı ve PayPal ile ödeme yapabilirsiniz.' : language === 'ru' ? 'Мы принимаем кредитные карты, дебетовые карты и PayPal.' : language === 'de' ? 'Wir akzeptieren Kreditkarten, Debitkarten und PayPal.' : language === 'fr' ? 'Nous acceptons les cartes de crédit, les cartes de débit et PayPal.' : 'We accept credit cards, debit cards, and PayPal.'
    },
    {
      question: language === 'tr' ? 'Ücretsiz plan ne kadar süre kullanılabilir?' : language === 'ru' ? 'Как долго можно использовать бесплатный план?' : language === 'de' ? 'Wie lange kann ich den kostenlosen Plan nutzen?' : language === 'fr' ? 'Combien de temps puis-je utiliser le plan gratuit ?' : 'How long can I use the free plan?',
      answer: language === 'tr' ? 'Ücretsiz plan süresiz olarak kullanılabilir. Her ay 50 kredi yenilenir.' : language === 'ru' ? 'Бесплатный план можно использовать бессрочно. Каждый месяц вы получаете 50 кредитов.' : language === 'de' ? 'Der kostenlose Plan kann unbegrenzt genutzt werden. Jeden Monat werden 50 Credits erneuert.' : language === 'fr' ? 'Le plan gratuit peut être utilisé indéfiniment. 50 crédits sont renouvelés chaque mois.' : 'The free plan can be used indefinitely. 50 credits are renewed every month.'
    }
  ]

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{texts.title}</h2>
          <p className="text-xl text-gray-400">{texts.subtitle}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <span className="text-2xl text-gray-400">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
