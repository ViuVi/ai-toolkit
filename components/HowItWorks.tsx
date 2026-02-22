'use client'

import { useLanguage, Language } from '@/lib/LanguageContext'

interface Step {
  number: string
  title: string
  description: string
}

const howItWorksTexts: Record<Language, { title: string; subtitle: string; steps: Step[] }> = {
  en: {
    title: 'How It Works',
    subtitle: 'Get results in 3 simple steps',
    steps: [
      { number: '1', title: 'Paste Your Content', description: 'Drop in your text, idea, or problem.' },
      { number: '2', title: 'Choose Your Tool', description: 'Select what you need: adapt, analyze, simplify, or decide.' },
      { number: '3', title: 'Get Instant Results', description: 'Receive polished output ready to use immediately.' },
    ],
  },
  tr: {
    title: 'Nasıl Çalışır',
    subtitle: '3 basit adımda sonuç alın',
    steps: [
      { number: '1', title: 'İçeriğinizi Yapıştırın', description: 'Metninizi, fikrinizi veya sorununuzu girin.' },
      { number: '2', title: 'Aracınızı Seçin', description: 'İhtiyacınız olanı seçin: uyarla, analiz et, basitleştir veya karar ver.' },
      { number: '3', title: 'Anında Sonuç Alın', description: 'Hemen kullanıma hazır çıktı alın.' },
    ],
  },
  ru: {
    title: 'Как это работает',
    subtitle: 'Результат за 3 простых шага',
    steps: [
      { number: '1', title: 'Вставьте контент', description: 'Введите текст, идею или проблему.' },
      { number: '2', title: 'Выберите инструмент', description: 'Выберите что нужно: адаптировать, анализировать.' },
      { number: '3', title: 'Получите результат', description: 'Готовый результат для использования.' },
    ],
  },
  de: {
    title: 'So funktioniert es',
    subtitle: 'Ergebnisse in 3 einfachen Schritten',
    steps: [
      { number: '1', title: 'Inhalt einfügen', description: 'Geben Sie Text, Idee oder Problem ein.' },
      { number: '2', title: 'Tool wählen', description: 'Wählen Sie was Sie brauchen: anpassen, analysieren.' },
      { number: '3', title: 'Ergebnis erhalten', description: 'Fertiges Ergebnis zur sofortigen Nutzung.' },
    ],
  },
  fr: {
    title: 'Comment ça marche',
    subtitle: 'Des résultats en 3 étapes simples',
    steps: [
      { number: '1', title: 'Collez votre contenu', description: 'Entrez votre texte, idée ou problème.' },
      { number: '2', title: 'Choisissez l\'outil', description: 'Sélectionnez ce dont vous avez besoin.' },
      { number: '3', title: 'Obtenez le résultat', description: 'Résultat prêt à l\'emploi instantanément.' },
    ],
  },
}

export default function HowItWorks() {
  const { language } = useLanguage()
  const txt = howItWorksTexts[language]

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{txt.title}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">{txt.subtitle}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 lg:gap-8">
          {txt.steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs relative w-full md:w-auto">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 shadow-lg shadow-purple-500/25">
                {step.number}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{step.description}</p>
              
              {index < txt.steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-full w-6 lg:w-12 text-gray-600 text-xl lg:text-2xl">→</div>
              )}
              {index < txt.steps.length - 1 && (
                <div className="md:hidden text-gray-600 text-2xl mt-4">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
