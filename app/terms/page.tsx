'use client'
import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'

const langs = [
  { code: 'en' as Language, flag: '🇺🇸', name: 'EN' },
  { code: 'tr' as Language, flag: '🇹🇷', name: 'TR' },
  { code: 'ru' as Language, flag: '🇷🇺', name: 'RU' },
  { code: 'de' as Language, flag: '🇩🇪', name: 'DE' },
  { code: 'fr' as Language, flag: '🇫🇷', name: 'FR' },
]

const translations = {
  en: {
    home: 'Home',
    title: 'Terms of Service',
    lastUpdated: 'Last Updated: March 2025',
    copyright: '© 2025 Media Tool Kit. All rights reserved.',
    privacy: 'Privacy Policy',
    refund: 'Refund Policy',
    sections: [
      { title: '1. Service Description', content: 'Media Tool Kit is a SaaS platform that provides AI-powered tools for social media content creators. Our platform offers video script writing, caption generation, hashtag generation, and many other content creation tools.' },
      { title: '2. Account Registration', content: 'You must create an account to use our services. You are responsible for the accuracy and security of your account information. You are responsible for all activities that occur under your account.' },
      { title: '3. Credit System', content: 'Media Tool Kit uses a credit-based system. Credits are renewed monthly according to your subscription plan. Unused credits do not roll over to the next month. Each tool consumes a different amount of credits.' },
      { title: '4. Subscriptions and Payments', content: 'Subscriptions are billed monthly. Payments are processed securely through Lemon Squeezy. You can cancel your subscription at any time; cancellation takes effect at the end of the current billing period.' },
      { title: '5. Acceptable Use', content: 'You may not use our platform to create content that is illegal, harmful, or violates the rights of others. Use for spam, misleading content, or malicious activities is strictly prohibited.' },
      { title: '6. Intellectual Property', content: 'Content created using our platform belongs to you. However, the Media Tool Kit brand, logos, and platform infrastructure belong to our company.' },
      { title: '7. Service Changes', content: 'We reserve the right to modify our services, features, and pricing with prior notice. Significant changes will be communicated via email.' },
      { title: '8. Limitation of Liability', content: 'Media Tool Kit is provided "as is." We do not guarantee the accuracy of AI-generated content. We are not liable for indirect or consequential damages.' },
      { title: '9. Account Termination', content: 'We reserve the right to suspend or terminate your account in case of violation of these terms. You can close your account at any time.' },
      { title: '10. Contact', content: 'For questions about these terms of service, please contact us at ahmetemresozer@gmail.com' }
    ]
  },
  tr: {
    home: 'Ana Sayfa',
    title: 'Kullanım Şartları',
    lastUpdated: 'Son Güncelleme: Mart 2025',
    copyright: '© 2025 Media Tool Kit. Tüm hakları saklıdır.',
    privacy: 'Gizlilik Politikası',
    refund: 'İade Politikası',
    sections: [
      { title: '1. Hizmet Tanımı', content: 'Media Tool Kit, sosyal medya içerik üreticileri için AI destekli araçlar sunan bir SaaS platformudur. Platformumuz video script yazımı, caption oluşturma, hashtag üretimi ve daha birçok içerik oluşturma aracı sağlar.' },
      { title: '2. Hesap Kaydı', content: 'Hizmetlerimizi kullanmak için bir hesap oluşturmanız gerekmektedir. Hesap bilgilerinizin doğruluğundan ve güvenliğinden siz sorumlusunuz.' },
      { title: '3. Kredi Sistemi', content: 'Media Tool Kit kredi tabanlı bir sistem kullanır. Krediler, abonelik planınıza göre aylık olarak yenilenir. Kullanılmayan krediler bir sonraki aya devretmez.' },
      { title: '4. Abonelik ve Ödemeler', content: 'Abonelikler aylık olarak faturalandırılır. Ödemeler Lemon Squeezy aracılığıyla güvenli bir şekilde işlenir. Aboneliğinizi istediğiniz zaman iptal edebilirsiniz.' },
      { title: '5. Kabul Edilebilir Kullanım', content: 'Platformumuzu yasa dışı, zararlı veya başkalarının haklarını ihlal eden içerikler oluşturmak için kullanamazsınız. Spam veya kötü amaçlı faaliyetler yasaktır.' },
      { title: '6. Fikri Mülkiyet', content: 'Platformumuz kullanılarak oluşturulan içerikler size aittir. Ancak, Media Tool Kit markası ve platform altyapısı şirketimize aittir.' },
      { title: '7. Hizmet Değişiklikleri', content: 'Hizmetlerimizi, özelliklerimizi ve fiyatlandırmamızı önceden bildirimde bulunarak değiştirme hakkını saklı tutarız.' },
      { title: '8. Sorumluluk Sınırlaması', content: 'Media Tool Kit "olduğu gibi" sunulmaktadır. AI tarafından oluşturulan içeriklerin doğruluğunu garanti etmiyoruz.' },
      { title: '9. Hesap Sonlandırma', content: 'Bu şartların ihlali durumunda hesabınızı askıya alma veya sonlandırma hakkını saklı tutarız. Hesabınızı istediğiniz zaman kapatabilirsiniz.' },
      { title: '10. İletişim', content: 'Sorularınız için ahmetemresozer@gmail.com adresinden bize ulaşabilirsiniz.' }
    ]
  },
  ru: {
    home: 'Главная',
    title: 'Условия использования',
    lastUpdated: 'Последнее обновление: Март 2025',
    copyright: '© 2025 Media Tool Kit. Все права защищены.',
    privacy: 'Политика конфиденциальности',
    refund: 'Политика возврата',
    sections: [
      { title: '1. Описание сервиса', content: 'Media Tool Kit — это SaaS-платформа, предоставляющая инструменты на базе ИИ для создателей контента в социальных сетях. Наша платформа предлагает написание видео-скриптов, генерацию подписей, хэштегов и многое другое.' },
      { title: '2. Регистрация аккаунта', content: 'Для использования наших услуг необходимо создать аккаунт. Вы несете ответственность за точность и безопасность данных вашего аккаунта.' },
      { title: '3. Система кредитов', content: 'Media Tool Kit использует систему кредитов. Кредиты обновляются ежемесячно в соответствии с вашим планом подписки. Неиспользованные кредиты не переносятся на следующий месяц.' },
      { title: '4. Подписки и платежи', content: 'Подписки оплачиваются ежемесячно. Платежи безопасно обрабатываются через Lemon Squeezy. Вы можете отменить подписку в любое время.' },
      { title: '5. Допустимое использование', content: 'Вы не можете использовать нашу платформу для создания незаконного, вредоносного контента или контента, нарушающего права других лиц.' },
      { title: '6. Интеллектуальная собственность', content: 'Контент, созданный с помощью нашей платформы, принадлежит вам. Однако бренд Media Tool Kit и инфраструктура платформы принадлежат нашей компании.' },
      { title: '7. Изменения в сервисе', content: 'Мы оставляем за собой право изменять наши услуги, функции и цены с предварительным уведомлением.' },
      { title: '8. Ограничение ответственности', content: 'Media Tool Kit предоставляется «как есть». Мы не гарантируем точность контента, созданного ИИ.' },
      { title: '9. Прекращение аккаунта', content: 'Мы оставляем за собой право приостановить или закрыть ваш аккаунт в случае нарушения этих условий.' },
      { title: '10. Контакты', content: 'По вопросам обращайтесь: ahmetemresozer@gmail.com' }
    ]
  },
  de: {
    home: 'Startseite',
    title: 'Nutzungsbedingungen',
    lastUpdated: 'Letzte Aktualisierung: März 2025',
    copyright: '© 2025 Media Tool Kit. Alle Rechte vorbehalten.',
    privacy: 'Datenschutzrichtlinie',
    refund: 'Rückerstattungsrichtlinie',
    sections: [
      { title: '1. Servicebeschreibung', content: 'Media Tool Kit ist eine SaaS-Plattform, die KI-gestützte Tools für Social-Media-Content-Ersteller bietet. Unsere Plattform bietet Video-Skript-Erstellung, Caption-Generierung, Hashtag-Generierung und vieles mehr.' },
      { title: '2. Kontoregistrierung', content: 'Sie müssen ein Konto erstellen, um unsere Dienste zu nutzen. Sie sind für die Richtigkeit und Sicherheit Ihrer Kontoinformationen verantwortlich.' },
      { title: '3. Kreditsystem', content: 'Media Tool Kit verwendet ein kreditbasiertes System. Kredite werden monatlich gemäß Ihrem Abonnementplan erneuert. Ungenutzte Kredite werden nicht auf den nächsten Monat übertragen.' },
      { title: '4. Abonnements und Zahlungen', content: 'Abonnements werden monatlich abgerechnet. Zahlungen werden sicher über Lemon Squeezy abgewickelt. Sie können Ihr Abonnement jederzeit kündigen.' },
      { title: '5. Akzeptable Nutzung', content: 'Sie dürfen unsere Plattform nicht verwenden, um illegale, schädliche Inhalte oder Inhalte zu erstellen, die die Rechte anderer verletzen.' },
      { title: '6. Geistiges Eigentum', content: 'Mit unserer Plattform erstellte Inhalte gehören Ihnen. Die Marke Media Tool Kit und die Plattforminfrastruktur gehören jedoch unserem Unternehmen.' },
      { title: '7. Serviceänderungen', content: 'Wir behalten uns das Recht vor, unsere Dienste, Funktionen und Preise mit vorheriger Ankündigung zu ändern.' },
      { title: '8. Haftungsbeschränkung', content: 'Media Tool Kit wird "wie besehen" bereitgestellt. Wir garantieren nicht die Richtigkeit von KI-generierten Inhalten.' },
      { title: '9. Kontobeendigung', content: 'Wir behalten uns das Recht vor, Ihr Konto bei Verstoß gegen diese Bedingungen zu sperren oder zu kündigen.' },
      { title: '10. Kontakt', content: 'Bei Fragen kontaktieren Sie uns unter ahmetemresozer@gmail.com' }
    ]
  },
  fr: {
    home: 'Accueil',
    title: 'Conditions d\'utilisation',
    lastUpdated: 'Dernière mise à jour: Mars 2025',
    copyright: '© 2025 Media Tool Kit. Tous droits réservés.',
    privacy: 'Politique de confidentialité',
    refund: 'Politique de remboursement',
    sections: [
      { title: '1. Description du service', content: 'Media Tool Kit est une plateforme SaaS qui fournit des outils alimentés par l\'IA pour les créateurs de contenu sur les réseaux sociaux. Notre plateforme propose l\'écriture de scripts vidéo, la génération de légendes, de hashtags et bien plus encore.' },
      { title: '2. Inscription au compte', content: 'Vous devez créer un compte pour utiliser nos services. Vous êtes responsable de l\'exactitude et de la sécurité des informations de votre compte.' },
      { title: '3. Système de crédits', content: 'Media Tool Kit utilise un système basé sur les crédits. Les crédits sont renouvelés mensuellement selon votre plan d\'abonnement. Les crédits non utilisés ne sont pas reportés au mois suivant.' },
      { title: '4. Abonnements et paiements', content: 'Les abonnements sont facturés mensuellement. Les paiements sont traités de manière sécurisée via Lemon Squeezy. Vous pouvez annuler votre abonnement à tout moment.' },
      { title: '5. Utilisation acceptable', content: 'Vous ne pouvez pas utiliser notre plateforme pour créer du contenu illégal, nuisible ou violant les droits d\'autrui.' },
      { title: '6. Propriété intellectuelle', content: 'Le contenu créé avec notre plateforme vous appartient. Cependant, la marque Media Tool Kit et l\'infrastructure de la plateforme appartiennent à notre entreprise.' },
      { title: '7. Modifications du service', content: 'Nous nous réservons le droit de modifier nos services, fonctionnalités et tarifs avec préavis.' },
      { title: '8. Limitation de responsabilité', content: 'Media Tool Kit est fourni "tel quel". Nous ne garantissons pas l\'exactitude du contenu généré par l\'IA.' },
      { title: '9. Résiliation du compte', content: 'Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions.' },
      { title: '10. Contact', content: 'Pour toute question, contactez-nous à ahmetemresozer@gmail.com' }
    ]
  }
}

export default function TermsPage() {
  const { language, setLanguage } = useLanguage()
  const t = translations[language] || translations.en

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition">← {t.home}</Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1 rounded text-xs font-medium transition ${language === l.code ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {l.flag}
                </button>
              ))}
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Media Tool Kit</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-400 mb-8">{t.lastUpdated}</p>
        
        <div className="space-y-8">
          {t.sections.map((section, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-purple-400 mb-3">{section.title}</h2>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700/50 text-center text-gray-400">
          <p>{t.copyright}</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-purple-400 transition">{t.privacy}</Link>
            <Link href="/refund" className="hover:text-purple-400 transition">{t.refund}</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
