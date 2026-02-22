'use client'

import { useLanguage, Language } from '@/lib/LanguageContext'

interface Testimonial {
  name: string
  role: string
  text: string
  avatar: string
  rating: number
}

const testimonialsTexts: Record<Language, { title: string; subtitle: string; items: Testimonial[] }> = {
  en: {
    title: 'What Our Users Say',
    subtitle: 'Thousands of content creators trust us',
    items: [
      { name: 'Sarah K.', role: 'Content Creator', text: 'These tools have cut my content creation time in half!', avatar: '👩‍💼', rating: 5 },
      { name: 'Mike R.', role: 'Social Media Manager', text: 'The hook generator is incredibly effective. My engagement went up 200%.', avatar: '👨‍💻', rating: 5 },
      { name: 'Emma L.', role: 'YouTuber', text: 'Perfect for video scripts. No more spending hours thinking about what to say.', avatar: '👩‍🎤', rating: 5 },
    ],
  },
  tr: {
    title: 'Kullanıcılarımız Ne Diyor',
    subtitle: 'Binlerce içerik üreticisi bize güveniyor',
    items: [
      { name: 'Ayşe K.', role: 'İçerik Üreticisi', text: 'Bu araçlar içerik oluşturma süremin yarıya indirdi!', avatar: '👩‍💼', rating: 5 },
      { name: 'Mehmet R.', role: 'Sosyal Medya Yöneticisi', text: 'Hook üretici inanılmaz etkili. Etkileşimim %200 arttı.', avatar: '👨‍💻', rating: 5 },
      { name: 'Elif L.', role: 'YouTuber', text: 'Video scriptleri için mükemmel. Artık ne söyleyeceğimi düşünmek için saatler harcamıyorum.', avatar: '👩‍🎤', rating: 5 },
    ],
  },
  ru: {
    title: 'Отзывы пользователей',
    subtitle: 'Тысячи создателей контента доверяют нам',
    items: [
      { name: 'Анна К.', role: 'Контент-мейкер', text: 'Эти инструменты сократили время создания контента вдвое!', avatar: '👩‍💼', rating: 5 },
      { name: 'Михаил Р.', role: 'SMM менеджер', text: 'Генератор хуков невероятно эффективен. Вовлеченность выросла на 200%.', avatar: '👨‍💻', rating: 5 },
      { name: 'Елена Л.', role: 'YouTuber', text: 'Идеально для видео скриптов. Больше не трачу часы на написание.', avatar: '👩‍🎤', rating: 5 },
    ],
  },
  de: {
    title: 'Was Nutzer sagen',
    subtitle: 'Tausende Content-Ersteller vertrauen uns',
    items: [
      { name: 'Sarah K.', role: 'Content Creator', text: 'Diese Tools haben meine Content-Zeit halbiert!', avatar: '👩‍💼', rating: 5 },
      { name: 'Mike R.', role: 'Social Media Manager', text: 'Der Hook-Generator ist unglaublich effektiv. Engagement um 200% gestiegen.', avatar: '👨‍💻', rating: 5 },
      { name: 'Emma L.', role: 'YouTuber', text: 'Perfekt für Video-Skripte. Keine stundenlange Überlegung mehr.', avatar: '👩‍🎤', rating: 5 },
    ],
  },
  fr: {
    title: 'Ce que disent nos utilisateurs',
    subtitle: 'Des milliers de créateurs nous font confiance',
    items: [
      { name: 'Sarah K.', role: 'Créatrice de contenu', text: 'Ces outils ont réduit mon temps de création de moitié!', avatar: '👩‍💼', rating: 5 },
      { name: 'Mike R.', role: 'Social Media Manager', text: 'Le générateur de hooks est incroyablement efficace. L\'engagement a augmenté de 200%.', avatar: '👨‍💻', rating: 5 },
      { name: 'Emma L.', role: 'YouTuber', text: 'Parfait pour les scripts vidéo. Plus besoin de réfléchir pendant des heures.', avatar: '👩‍🎤', rating: 5 },
    ],
  },
}

export default function Testimonials() {
  const { language } = useLanguage()
  const txt = testimonialsTexts[language]

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{txt.title}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400">{txt.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {txt.items.map((item, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="text-3xl sm:text-4xl">{item.avatar}</div>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base">{item.name}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{item.role}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">"{item.text}"</p>
              <div className="text-yellow-400 text-sm sm:text-base">{'★'.repeat(item.rating)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
