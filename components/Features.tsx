'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Features() {
  const { language } = useLanguage()

  const texts = {
    title: language === 'tr' ? 'Güçlü Özellikler' : language === 'ru' ? 'Мощные функции' : language === 'de' ? 'Leistungsstarke Funktionen' : language === 'fr' ? 'Fonctionnalités puissantes' : 'Powerful Features',
    subtitle: language === 'tr' ? 'İçerik üretiminizi hızlandıracak araçlar' : language === 'ru' ? 'Инструменты для ускорения создания контента' : language === 'de' ? 'Tools zur Beschleunigung Ihrer Content-Erstellung' : language === 'fr' ? 'Des outils pour accélérer votre création de contenu' : 'Tools to accelerate your content creation'
  }

  const features = [
    {
      icon: '🎣',
      title: language === 'tr' ? 'Hook Oluşturucu' : 'Hook Generator',
      description: language === 'tr' ? 'Dikkat çekici açılışlar oluşturun' : 'Create attention-grabbing openings'
    },
    {
      icon: '✍️',
      title: language === 'tr' ? 'Caption Yazıcı' : 'Caption Writer',
      description: language === 'tr' ? 'Etkileyici altyazılar yazın' : 'Write engaging captions'
    },
    {
      icon: '#️⃣',
      title: language === 'tr' ? 'Hashtag Üretici' : 'Hashtag Generator',
      description: language === 'tr' ? 'Trend hashtagler bulun' : 'Find trending hashtags'
    },
    {
      icon: '📊',
      title: language === 'tr' ? 'Viral Skor' : 'Viral Score',
      description: language === 'tr' ? 'İçerik potansiyelini analiz edin' : 'Analyze content potential'
    },
    {
      icon: '🎬',
      title: language === 'tr' ? 'Video Script' : 'Video Script',
      description: language === 'tr' ? 'Profesyonel scriptler yazın' : 'Write professional scripts'
    },
    {
      icon: '📅',
      title: language === 'tr' ? 'İçerik Takvimi' : 'Content Calendar',
      description: language === 'tr' ? 'Paylaşımlarınızı planlayın' : 'Plan your posts'
    }
  ]

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{texts.title}</h2>
          <p className="text-xl text-gray-400">{texts.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
