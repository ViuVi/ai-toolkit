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
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: March 2025',
    intro: 'At Media Tool Kit, we value your privacy. This policy explains how we collect, use, and protect your personal data.',
    copyright: '© 2025 Media Tool Kit. All rights reserved.',
    terms: 'Terms of Service',
    refund: 'Refund Policy',
    sections: [
      { title: '📋 Information We Collect', content: 'We collect the following information to provide our services:\n\n• Account Information: Email address, encrypted password\n• Usage Data: Tools used, credit consumption, session information\n• Payment Information: Payments are processed securely by Lemon Squeezy; we do not store your credit card information\n• Technical Data: IP address, browser type, device information' },
      { title: '🎯 How We Use Information', content: 'We use collected information for:\n\n• Providing and improving our services\n• Managing and securing your account\n• Processing subscriptions and payments\n• Providing technical support\n• Informing about service updates' },
      { title: '🔒 Data Security', content: 'We implement industry-standard security measures:\n\n• SSL/TLS encryption\n• Secure server infrastructure (Vercel)\n• Encrypted database (Supabase)\n• Regular security audits' },
      { title: '🤝 Third-Party Sharing', content: 'We only share data with necessary third parties:\n\n• Supabase: Database and authentication\n• Lemon Squeezy: Payment processing\n• Vercel: Web hosting\n• Hugging Face: AI model APIs\n\nWe never sell your personal data.' },
      { title: '🍪 Cookies', content: 'We use cookies for:\n\n• Keeping you logged in\n• Remembering your preferences\n• Analytics (anonymized)\n\nYou can manage cookies through your browser settings.' },
      { title: '⚖️ Your Rights', content: 'Under GDPR/KVKK, you have the right to:\n\n• Access your personal data\n• Correct inaccurate data\n• Delete your data\n• Data portability\n• Object to processing\n\nContact us to exercise these rights.' },
      { title: '📧 Contact', content: 'For privacy-related questions:\n\nEmail: ahmetemresozer@gmail.com' }
    ]
  },
  tr: {
    home: 'Ana Sayfa',
    title: 'Gizlilik Politikası',
    lastUpdated: 'Son Güncelleme: Mart 2025',
    intro: 'Media Tool Kit olarak gizliliğinize önem veriyoruz. Bu politika, kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.',
    copyright: '© 2025 Media Tool Kit. Tüm hakları saklıdır.',
    terms: 'Kullanım Şartları',
    refund: 'İade Politikası',
    sections: [
      { title: '📋 Toplanan Bilgiler', content: 'Hizmetlerimizi sağlamak için şu bilgileri topluyoruz:\n\n• Hesap Bilgileri: E-posta adresi, şifrelenmiş şifre\n• Kullanım Verileri: Kullanılan araçlar, kredi tüketimi, oturum bilgileri\n• Ödeme Bilgileri: Ödemeler Lemon Squeezy tarafından güvenli şekilde işlenir; kredi kartı bilgilerinizi saklamıyoruz\n• Teknik Veriler: IP adresi, tarayıcı türü, cihaz bilgileri' },
      { title: '🎯 Bilgilerin Kullanımı', content: 'Toplanan bilgileri şu amaçlarla kullanıyoruz:\n\n• Hizmetlerimizi sağlamak ve geliştirmek\n• Hesabınızı yönetmek ve güvence altına almak\n• Abonelikleri ve ödemeleri işlemek\n• Teknik destek sağlamak\n• Hizmet güncellemeleri hakkında bilgilendirmek' },
      { title: '🔒 Veri Güvenliği', content: 'Endüstri standardı güvenlik önlemleri uyguluyoruz:\n\n• SSL/TLS şifrelemesi\n• Güvenli sunucu altyapısı (Vercel)\n• Şifrelenmiş veritabanı (Supabase)\n• Düzenli güvenlik denetimleri' },
      { title: '🤝 Üçüncü Taraf Paylaşımı', content: 'Verileri yalnızca gerekli üçüncü taraflarla paylaşıyoruz:\n\n• Supabase: Veritabanı ve kimlik doğrulama\n• Lemon Squeezy: Ödeme işleme\n• Vercel: Web barındırma\n• Hugging Face: AI model API\'leri\n\nKişisel verilerinizi asla satmıyoruz.' },
      { title: '🍪 Çerezler', content: 'Çerezleri şu amaçlarla kullanıyoruz:\n\n• Oturumunuzu açık tutmak\n• Tercihlerinizi hatırlamak\n• Analitik (anonimleştirilmiş)\n\nÇerezleri tarayıcı ayarlarınızdan yönetebilirsiniz.' },
      { title: '⚖️ Haklarınız', content: 'KVKK kapsamında şu haklara sahipsiniz:\n\n• Kişisel verilerinize erişim\n• Yanlış verileri düzeltme\n• Verilerinizi silme\n• Veri taşınabilirliği\n• İşlemeye itiraz\n\nBu haklarınızı kullanmak için bizimle iletişime geçin.' },
      { title: '📧 İletişim', content: 'Gizlilikle ilgili sorularınız için:\n\nE-posta: ahmetemresozer@gmail.com' }
    ]
  },
  ru: {
    home: 'Главная',
    title: 'Политика конфиденциальности',
    lastUpdated: 'Последнее обновление: Март 2025',
    intro: 'В Media Tool Kit мы ценим вашу конфиденциальность. Эта политика объясняет, как мы собираем, используем и защищаем ваши персональные данные.',
    copyright: '© 2025 Media Tool Kit. Все права защищены.',
    terms: 'Условия использования',
    refund: 'Политика возврата',
    sections: [
      { title: '📋 Собираемая информация', content: 'Мы собираем следующую информацию:\n\n• Данные аккаунта: Email, зашифрованный пароль\n• Данные использования: Используемые инструменты, расход кредитов\n• Платежная информация: Платежи обрабатываются Lemon Squeezy\n• Технические данные: IP-адрес, тип браузера' },
      { title: '🎯 Использование информации', content: 'Мы используем информацию для:\n\n• Предоставления и улучшения услуг\n• Управления вашим аккаунтом\n• Обработки платежей\n• Технической поддержки' },
      { title: '🔒 Безопасность данных', content: 'Мы применяем стандартные меры безопасности:\n\n• SSL/TLS шифрование\n• Безопасная инфраструктура (Vercel)\n• Зашифрованная база данных (Supabase)' },
      { title: '🤝 Передача третьим лицам', content: 'Мы передаём данные только необходимым партнёрам:\n\n• Supabase: База данных\n• Lemon Squeezy: Платежи\n• Vercel: Хостинг\n\nМы никогда не продаём ваши данные.' },
      { title: '🍪 Cookies', content: 'Мы используем cookies для:\n\n• Поддержания сессии\n• Сохранения настроек\n• Аналитики' },
      { title: '⚖️ Ваши права', content: 'Вы имеете право на:\n\n• Доступ к данным\n• Исправление данных\n• Удаление данных\n• Перенос данных' },
      { title: '📧 Контакты', content: 'По вопросам конфиденциальности:\n\nEmail: ahmetemresozer@gmail.com' }
    ]
  },
  de: {
    home: 'Startseite',
    title: 'Datenschutzrichtlinie',
    lastUpdated: 'Letzte Aktualisierung: März 2025',
    intro: 'Bei Media Tool Kit schätzen wir Ihre Privatsphäre. Diese Richtlinie erklärt, wie wir Ihre persönlichen Daten sammeln, verwenden und schützen.',
    copyright: '© 2025 Media Tool Kit. Alle Rechte vorbehalten.',
    terms: 'Nutzungsbedingungen',
    refund: 'Rückerstattungsrichtlinie',
    sections: [
      { title: '📋 Gesammelte Informationen', content: 'Wir sammeln folgende Informationen:\n\n• Kontodaten: E-Mail, verschlüsseltes Passwort\n• Nutzungsdaten: Verwendete Tools, Kreditverbrauch\n• Zahlungsinformationen: Zahlungen werden von Lemon Squeezy verarbeitet\n• Technische Daten: IP-Adresse, Browsertyp' },
      { title: '🎯 Verwendung der Informationen', content: 'Wir verwenden die Informationen für:\n\n• Bereitstellung und Verbesserung unserer Dienste\n• Kontoverwaltung\n• Zahlungsabwicklung\n• Technischen Support' },
      { title: '🔒 Datensicherheit', content: 'Wir implementieren Sicherheitsmaßnahmen:\n\n• SSL/TLS-Verschlüsselung\n• Sichere Serverinfrastruktur (Vercel)\n• Verschlüsselte Datenbank (Supabase)' },
      { title: '🤝 Weitergabe an Dritte', content: 'Wir teilen Daten nur mit notwendigen Partnern:\n\n• Supabase: Datenbank\n• Lemon Squeezy: Zahlungen\n• Vercel: Hosting\n\nWir verkaufen Ihre Daten niemals.' },
      { title: '🍪 Cookies', content: 'Wir verwenden Cookies für:\n\n• Anmeldung aufrechterhalten\n• Einstellungen speichern\n• Analytik' },
      { title: '⚖️ Ihre Rechte', content: 'Sie haben das Recht auf:\n\n• Datenzugriff\n• Datenkorrektur\n• Datenlöschung\n• Datenportabilität' },
      { title: '📧 Kontakt', content: 'Bei Datenschutzfragen:\n\nE-Mail: ahmetemresozer@gmail.com' }
    ]
  },
  fr: {
    home: 'Accueil',
    title: 'Politique de confidentialité',
    lastUpdated: 'Dernière mise à jour: Mars 2025',
    intro: 'Chez Media Tool Kit, nous valorisons votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos données personnelles.',
    copyright: '© 2025 Media Tool Kit. Tous droits réservés.',
    terms: 'Conditions d\'utilisation',
    refund: 'Politique de remboursement',
    sections: [
      { title: '📋 Informations collectées', content: 'Nous collectons les informations suivantes:\n\n• Données de compte: Email, mot de passe chiffré\n• Données d\'utilisation: Outils utilisés, consommation de crédits\n• Informations de paiement: Paiements traités par Lemon Squeezy\n• Données techniques: Adresse IP, type de navigateur' },
      { title: '🎯 Utilisation des informations', content: 'Nous utilisons les informations pour:\n\n• Fournir et améliorer nos services\n• Gérer votre compte\n• Traiter les paiements\n• Support technique' },
      { title: '🔒 Sécurité des données', content: 'Nous appliquons des mesures de sécurité:\n\n• Chiffrement SSL/TLS\n• Infrastructure sécurisée (Vercel)\n• Base de données chiffrée (Supabase)' },
      { title: '🤝 Partage avec des tiers', content: 'Nous partageons les données uniquement avec:\n\n• Supabase: Base de données\n• Lemon Squeezy: Paiements\n• Vercel: Hébergement\n\nNous ne vendons jamais vos données.' },
      { title: '🍪 Cookies', content: 'Nous utilisons les cookies pour:\n\n• Maintenir votre session\n• Mémoriser vos préférences\n• Analytique' },
      { title: '⚖️ Vos droits', content: 'Vous avez le droit de:\n\n• Accéder à vos données\n• Corriger vos données\n• Supprimer vos données\n• Portabilité des données' },
      { title: '📧 Contact', content: 'Pour les questions de confidentialité:\n\nEmail: ahmetemresozer@gmail.com' }
    ]
  }
}

export default function PrivacyPage() {
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
        <p className="text-gray-400 mb-4">{t.lastUpdated}</p>
        <p className="text-gray-300 mb-8 text-lg">{t.intro}</p>
        
        <div className="space-y-6">
          {t.sections.map((section, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-purple-400 mb-3">{section.title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700/50 text-center text-gray-400">
          <p>{t.copyright}</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/terms" className="hover:text-purple-400 transition">{t.terms}</Link>
            <Link href="/refund" className="hover:text-purple-400 transition">{t.refund}</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
