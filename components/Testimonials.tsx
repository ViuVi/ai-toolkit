'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Testimonials() {
  const { language } = useLanguage()

  const texts = {
    title: language === 'tr' ? 'Kullanıcılarımız Ne Diyor?' : language === 'ru' ? 'Что говорят наши пользователи?' : language === 'de' ? 'Was sagen unsere Nutzer?' : language === 'fr' ? 'Que disent nos utilisateurs ?' : 'What Our Users Say',
    subtitle: language === 'tr' ? 'Binlerce içerik üreticisi bize güveniyor' : language === 'ru' ? 'Тысячи создателей контента доверяют нам' : language === 'de' ? 'Tausende Content-Ersteller vertrauen uns' : language === 'fr' ? 'Des milliers de créateurs de contenu nous font confiance' : 'Thousands of content creators trust us'
  }

  const testimonials = [
    {
      name: 'Sarah K.',
      role: language === 'tr' ? 'İçerik Üreticisi' : 'Content Creator',
      avatar: '👩‍💼',
      text: language === 'tr' ? 'Bu araçlar sayesinde içerik üretim sürem yarıya indi. Harika!' : 'These tools cut my content creation time in half. Amazing!'
    },
    {
      name: 'Mike R.',
      role: language === 'tr' ? 'Sosyal Medya Yöneticisi' : 'Social Media Manager',
      avatar: '👨‍💻',
      text: language === 'tr' ? 'Hook oluşturucu gerçekten çok etkili. Etkileşimlerim %200 arttı.' : 'The hook generator is really effective. My engagement increased by 200%.'
    },
    {
      name: 'Emma L.',
      role: language === 'tr' ? 'YouTuber' : 'YouTuber',
      avatar: '👩‍🎤',
      text: language === 'tr' ? 'Video scriptleri için mükemmel. Artık saatlerce düşünmeme gerek yok.' : "Perfect for video scripts. I don't need to think for hours anymore."
    }
  ]

  return (
    <section className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{texts.title}</h2>
          <p className="text-xl text-gray-400">{texts.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-300">"{testimonial.text}"</p>
              <div className="mt-4 text-yellow-400">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
