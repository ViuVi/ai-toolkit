'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function HowItWorks() {
  const { language } = useLanguage()

  const texts = {
    title: language === 'tr' ? 'Nasıl Çalışır?' : language === 'ru' ? 'Как это работает?' : language === 'de' ? 'Wie es funktioniert' : language === 'fr' ? 'Comment ça marche ?' : 'How It Works',
    subtitle: language === 'tr' ? '3 basit adımda başlayın' : language === 'ru' ? 'Начните за 3 простых шага' : language === 'de' ? 'Starten Sie in 3 einfachen Schritten' : language === 'fr' ? 'Commencez en 3 étapes simples' : 'Get started in 3 simple steps'
  }

  const steps = [
    {
      number: '1',
      title: language === 'tr' ? 'Kayıt Ol' : language === 'ru' ? 'Зарегистрируйтесь' : language === 'de' ? 'Registrieren' : language === 'fr' ? 'Inscrivez-vous' : 'Sign Up',
      description: language === 'tr' ? 'Ücretsiz hesap oluşturun' : language === 'ru' ? 'Создайте бесплатный аккаунт' : language === 'de' ? 'Erstellen Sie ein kostenloses Konto' : language === 'fr' ? 'Créez un compte gratuit' : 'Create a free account'
    },
    {
      number: '2',
      title: language === 'tr' ? 'Araç Seç' : language === 'ru' ? 'Выберите инструмент' : language === 'de' ? 'Wählen Sie ein Tool' : language === 'fr' ? 'Choisissez un outil' : 'Choose a Tool',
      description: language === 'tr' ? 'İhtiyacınıza uygun aracı seçin' : language === 'ru' ? 'Выберите подходящий инструмент' : language === 'de' ? 'Wählen Sie das passende Tool' : language === 'fr' ? "Sélectionnez l'outil adapté" : 'Select the tool that fits your needs'
    },
    {
      number: '3',
      title: language === 'tr' ? 'İçerik Üret' : language === 'ru' ? 'Создайте контент' : language === 'de' ? 'Erstellen Sie Inhalte' : language === 'fr' ? 'Créez du contenu' : 'Create Content',
      description: language === 'tr' ? 'AI ile anında içerik oluşturun' : language === 'ru' ? 'Мгновенно создавайте контент с ИИ' : language === 'de' ? 'Erstellen Sie sofort Inhalte mit KI' : language === 'fr' ? "Créez instantanément du contenu avec l'IA" : 'Instantly generate content with AI'
    }
  ]

  return (
    <section className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{texts.title}</h2>
          <p className="text-xl text-gray-400">{texts.subtitle}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute transform translate-x-32 text-gray-600 text-4xl">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
