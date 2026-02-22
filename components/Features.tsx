'use client'

import { useLanguage, Language } from '@/lib/LanguageContext'

interface FeatureItem {
  icon: string
  title: string
  description: string
}

const featuresTexts: Record<Language, { title: string; subtitle: string; items: FeatureItem[] }> = {
  en: {
    title: 'Tools That Actually Matter',
    subtitle: 'Not just another AI tool. Real solutions for real problems.',
    items: [
      { icon: '⚡', title: 'Save Hours Daily', description: 'Turn one piece of content into 4 platform-ready posts in seconds.' },
      { icon: '💰', title: 'Boost Your Sales', description: 'Analyze and improve your sales copy with proven persuasion frameworks.' },
      { icon: '🎯', title: 'Simplify Complexity', description: 'Transform jargon-filled text into clear, simple language anyone can understand.' },
      { icon: '🛡️', title: 'Prevent Mistakes', description: 'Check your content for errors, bias, and tone issues before publishing.' },
      { icon: '⚖️', title: 'Decide Confidently', description: 'Analyze options with pros and cons to make better decisions.' },
      { icon: '🧘', title: 'Clear Your Thoughts', description: 'Organize chaotic thoughts into structured, actionable clarity.' },
    ],
  },
  tr: {
    title: 'Gerçekten Önemli Araçlar',
    subtitle: 'Sadece başka bir AI aracı değil. Gerçek sorunlar için gerçek çözümler.',
    items: [
      { icon: '⚡', title: 'Günde Saatler Kazanın', description: 'Tek bir içeriği saniyeler içinde 4 platforma uygun posta dönüştürün.' },
      { icon: '💰', title: 'Satışlarınızı Artırın', description: 'Satış metinlerinizi kanıtlanmış ikna teknikleriyle analiz edin ve geliştirin.' },
      { icon: '🎯', title: 'Karmaşıklığı Basitleştirin', description: 'Jargon dolu metni herkesin anlayabileceği net, basit bir dile dönüştürün.' },
      { icon: '🛡️', title: 'Hataları Önleyin', description: 'İçeriğinizi yayınlamadan önce hatalar, önyargılar ve ton sorunları için kontrol edin.' },
      { icon: '⚖️', title: 'Güvenle Karar Verin', description: 'Daha iyi kararlar almak için artıları ve eksileriyle seçenekleri analiz edin.' },
      { icon: '🧘', title: 'Düşüncelerinizi Netleştirin', description: 'Kaotik düşünceleri yapılandırılmış, eyleme dönüştürülebilir netliğe dönüştürün.' },
    ],
  },
  ru: {
    title: 'Инструменты, которые важны',
    subtitle: 'Не просто еще один AI инструмент. Реальные решения для реальных проблем.',
    items: [
      { icon: '⚡', title: 'Экономьте часы', description: 'Превратите один контент в 4 поста за секунды.' },
      { icon: '💰', title: 'Увеличьте продажи', description: 'Анализируйте и улучшайте продающие тексты.' },
      { icon: '🎯', title: 'Упростите сложное', description: 'Превратите жаргон в понятный язык.' },
      { icon: '🛡️', title: 'Избегайте ошибок', description: 'Проверяйте контент перед публикацией.' },
      { icon: '⚖️', title: 'Решайте уверенно', description: 'Анализируйте варианты для лучших решений.' },
      { icon: '🧘', title: 'Упорядочьте мысли', description: 'Организуйте хаос в структуру.' },
    ],
  },
  de: {
    title: 'Tools die zählen',
    subtitle: 'Nicht nur ein weiteres KI-Tool. Echte Lösungen für echte Probleme.',
    items: [
      { icon: '⚡', title: 'Stunden sparen', description: 'Verwandeln Sie einen Inhalt in 4 Posts in Sekunden.' },
      { icon: '💰', title: 'Umsatz steigern', description: 'Analysieren und verbessern Sie Ihre Verkaufstexte.' },
      { icon: '🎯', title: 'Komplexes vereinfachen', description: 'Verwandeln Sie Fachjargon in klare Sprache.' },
      { icon: '🛡️', title: 'Fehler vermeiden', description: 'Prüfen Sie Inhalte vor der Veröffentlichung.' },
      { icon: '⚖️', title: 'Sicher entscheiden', description: 'Analysieren Sie Optionen für bessere Entscheidungen.' },
      { icon: '🧘', title: 'Gedanken ordnen', description: 'Organisieren Sie Chaos in Struktur.' },
    ],
  },
  fr: {
    title: 'Des outils qui comptent',
    subtitle: 'Pas juste un autre outil IA. De vraies solutions pour de vrais problèmes.',
    items: [
      { icon: '⚡', title: 'Gagnez des heures', description: 'Transformez un contenu en 4 posts en secondes.' },
      { icon: '💰', title: 'Boostez vos ventes', description: 'Analysez et améliorez vos textes de vente.' },
      { icon: '🎯', title: 'Simplifiez le complexe', description: 'Transformez le jargon en langage clair.' },
      { icon: '🛡️', title: 'Évitez les erreurs', description: 'Vérifiez le contenu avant publication.' },
      { icon: '⚖️', title: 'Décidez sereinement', description: 'Analysez les options pour de meilleures décisions.' },
      { icon: '🧘', title: 'Clarifiez vos pensées', description: 'Organisez le chaos en structure.' },
    ],
  },
}

export default function Features() {
  const { language } = useLanguage()
  const txt = featuresTexts[language]

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{txt.title}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">{txt.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {txt.items.map((item, index) => (
            <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-purple-500/50 transition-all hover:transform hover:scale-[1.02] active:scale-[0.98]">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
