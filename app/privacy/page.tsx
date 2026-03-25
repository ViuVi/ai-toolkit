'use client'
import { useLanguage } from '@/lib/LanguageContext'
import PageHeader from '@/components/PageHeader'
import Footer from '@/components/Footer'

const content: Record<string, any> = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 2026',
    sections: [
      {
        title: '1. Information We Collect',
        content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

**Personal Information:**
- Email address
- Name (optional)
- Profile picture (optional)
- Payment information (processed securely by Lemon Squeezy)

**Usage Information:**
- Tools you use and how often
- Credits consumed
- Device and browser information`
      },
      {
        title: '2. How We Use Your Information',
        content: `We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices, updates, and support messages
- Respond to your comments, questions, and requests
- Monitor and analyze trends, usage, and activities`
      },
      {
        title: '3. Information Sharing',
        content: `We do not sell, trade, or otherwise transfer your personal information to third parties except:
- With your consent
- To comply with legal obligations
- To protect our rights and safety
- With service providers who assist our operations (e.g., payment processors)`
      },
      {
        title: '4. Data Security',
        content: `We implement appropriate security measures to protect your personal information:
- SSL/TLS encryption for all data transfers
- Secure password hashing
- Regular security audits
- Limited access to personal data`
      },
      {
        title: '5. Your Rights',
        content: `You have the right to:
- Access your personal data
- Correct inaccurate data
- Delete your account and data
- Export your data
- Opt-out of marketing communications`
      },
      {
        title: '6. Cookies',
        content: `We use essential cookies to:
- Keep you signed in
- Remember your preferences
- Analyze site traffic (anonymized)

You can disable cookies in your browser settings, but some features may not work properly.`
      },
      {
        title: '7. Contact Us',
        content: `If you have questions about this Privacy Policy, please contact us at:
- Email: privacy@mediatoolkit.site`
      }
    ]
  },
  tr: {
    title: 'Gizlilik Politikası',
    lastUpdated: 'Son güncelleme: Ocak 2026',
    sections: [
      {
        title: '1. Topladığımız Bilgiler',
        content: `Hesap oluştururken, hizmetlerimizi kullanırken veya destek için bizimle iletişime geçtiğinizde bize doğrudan sağladığınız bilgileri topluyoruz.

**Kişisel Bilgiler:**
- E-posta adresi
- İsim (isteğe bağlı)
- Profil fotoğrafı (isteğe bağlı)
- Ödeme bilgileri (Lemon Squeezy tarafından güvenli şekilde işlenir)

**Kullanım Bilgileri:**
- Kullandığınız araçlar ve ne sıklıkla
- Harcanan krediler
- Cihaz ve tarayıcı bilgileri`
      },
      {
        title: '2. Bilgilerinizi Nasıl Kullanıyoruz',
        content: `Topladığımız bilgileri şu amaçlarla kullanıyoruz:
- Hizmetlerimizi sağlamak, sürdürmek ve geliştirmek
- İşlemleri gerçekleştirmek ve ilgili bilgileri göndermek
- Teknik bildirimler, güncellemeler ve destek mesajları göndermek
- Yorumlarınıza, sorularınıza ve taleplerinize yanıt vermek
- Trendleri, kullanımı ve etkinlikleri izlemek ve analiz etmek`
      },
      {
        title: '3. Bilgi Paylaşımı',
        content: `Kişisel bilgilerinizi üçüncü taraflara satmıyor, takas etmiyor veya başka şekilde aktarmıyoruz, ancak:
- Sizin onayınızla
- Yasal yükümlülüklere uymak için
- Haklarımızı ve güvenliğimizi korumak için
- Operasyonlarımıza yardımcı olan hizmet sağlayıcılarla (örn. ödeme işlemcileri)`
      },
      {
        title: '4. Veri Güvenliği',
        content: `Kişisel bilgilerinizi korumak için uygun güvenlik önlemleri uyguluyoruz:
- Tüm veri aktarımları için SSL/TLS şifreleme
- Güvenli şifre hashleme
- Düzenli güvenlik denetimleri
- Kişisel verilere sınırlı erişim`
      },
      {
        title: '5. Haklarınız',
        content: `Şu haklara sahipsiniz:
- Kişisel verilerinize erişim
- Hatalı verileri düzeltme
- Hesabınızı ve verilerinizi silme
- Verilerinizi dışa aktarma
- Pazarlama iletişimlerinden çıkma`
      },
      {
        title: '6. Çerezler',
        content: `Temel çerezleri şu amaçlarla kullanıyoruz:
- Oturumunuzu açık tutmak
- Tercihlerinizi hatırlamak
- Site trafiğini analiz etmek (anonim)

Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bazı özellikler düzgün çalışmayabilir.`
      },
      {
        title: '7. Bize Ulaşın',
        content: `Bu Gizlilik Politikası hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
- E-posta: privacy@mediatoolkit.site`
      }
    ]
  },
  ru: {
    title: 'Политика конфиденциальности',
    lastUpdated: 'Последнее обновление: Январь 2026',
    sections: [
      {
        title: '1. Собираемая информация',
        content: `Мы собираем информацию, которую вы предоставляете напрямую, например, при создании учетной записи, использовании наших услуг или обращении в поддержку.

**Личная информация:**
- Адрес электронной почты
- Имя (необязательно)
- Фото профиля (необязательно)
- Платежная информация (безопасно обрабатывается Lemon Squeezy)

**Информация об использовании:**
- Используемые инструменты и частота
- Потраченные кредиты
- Информация об устройстве и браузере`
      },
      {
        title: '2. Как мы используем информацию',
        content: `Мы используем собранную информацию для:
- Предоставления, поддержки и улучшения наших услуг
- Обработки транзакций и отправки связанной информации
- Отправки технических уведомлений и сообщений поддержки
- Ответов на ваши комментарии и вопросы
- Мониторинга и анализа тенденций и использования`
      },
      {
        title: '3. Передача информации',
        content: `Мы не продаем и не передаем вашу личную информацию третьим лицам, за исключением:
- С вашего согласия
- Для соблюдения законодательства
- Для защиты наших прав и безопасности
- Поставщикам услуг, помогающим в работе`
      },
      {
        title: '4. Безопасность данных',
        content: `Мы применяем соответствующие меры безопасности:
- SSL/TLS шифрование
- Безопасное хеширование паролей
- Регулярные проверки безопасности
- Ограниченный доступ к данным`
      },
      {
        title: '5. Ваши права',
        content: `Вы имеете право:
- Получить доступ к своим данным
- Исправить неточные данные
- Удалить учетную запись и данные
- Экспортировать данные
- Отказаться от маркетинговых сообщений`
      },
      {
        title: '6. Файлы cookie',
        content: `Мы используем необходимые файлы cookie для:
- Поддержания входа в систему
- Запоминания настроек
- Анализа трафика (анонимно)`
      },
      {
        title: '7. Связаться с нами',
        content: `По вопросам политики конфиденциальности:
- Email: privacy@mediatoolkit.site`
      }
    ]
  },
  de: {
    title: 'Datenschutzrichtlinie',
    lastUpdated: 'Letzte Aktualisierung: Januar 2026',
    sections: [
      {
        title: '1. Gesammelte Informationen',
        content: `Wir sammeln Informationen, die Sie uns direkt bereitstellen, z.B. bei der Kontoerstellung oder Nutzung unserer Dienste.

**Persönliche Daten:**
- E-Mail-Adresse
- Name (optional)
- Profilbild (optional)
- Zahlungsinformationen (sicher über Lemon Squeezy)

**Nutzungsdaten:**
- Verwendete Tools und Häufigkeit
- Verbrauchte Credits
- Geräte- und Browserinformationen`
      },
      {
        title: '2. Verwendung der Informationen',
        content: `Wir verwenden die Informationen um:
- Unsere Dienste bereitzustellen und zu verbessern
- Transaktionen zu verarbeiten
- Technische Mitteilungen zu senden
- Auf Ihre Anfragen zu antworten
- Trends und Nutzung zu analysieren`
      },
      {
        title: '3. Weitergabe von Informationen',
        content: `Wir verkaufen Ihre Daten nicht an Dritte, außer:
- Mit Ihrer Zustimmung
- Zur Erfüllung rechtlicher Pflichten
- Zum Schutz unserer Rechte
- An Dienstleister, die uns unterstützen`
      },
      {
        title: '4. Datensicherheit',
        content: `Wir implementieren Sicherheitsmaßnahmen:
- SSL/TLS-Verschlüsselung
- Sicheres Passwort-Hashing
- Regelmäßige Sicherheitsaudits
- Eingeschränkter Datenzugriff`
      },
      {
        title: '5. Ihre Rechte',
        content: `Sie haben das Recht auf:
- Zugang zu Ihren Daten
- Korrektur ungenauer Daten
- Löschung Ihres Kontos
- Datenexport
- Abmeldung von Marketing`
      },
      {
        title: '6. Cookies',
        content: `Wir verwenden notwendige Cookies für:
- Anmeldung
- Einstellungen speichern
- Anonyme Traffic-Analyse`
      },
      {
        title: '7. Kontakt',
        content: `Bei Fragen zur Datenschutzrichtlinie:
- E-Mail: privacy@mediatoolkit.site`
      }
    ]
  },
  fr: {
    title: 'Politique de confidentialité',
    lastUpdated: 'Dernière mise à jour: Janvier 2026',
    sections: [
      {
        title: '1. Informations collectées',
        content: `Nous collectons les informations que vous nous fournissez directement lors de la création de compte ou de l'utilisation de nos services.

**Informations personnelles:**
- Adresse e-mail
- Nom (facultatif)
- Photo de profil (facultatif)
- Informations de paiement (traitées par Lemon Squeezy)

**Informations d'utilisation:**
- Outils utilisés et fréquence
- Crédits consommés
- Informations sur l'appareil et le navigateur`
      },
      {
        title: '2. Utilisation des informations',
        content: `Nous utilisons les informations pour:
- Fournir et améliorer nos services
- Traiter les transactions
- Envoyer des notifications techniques
- Répondre à vos demandes
- Analyser les tendances et l'utilisation`
      },
      {
        title: '3. Partage des informations',
        content: `Nous ne vendons pas vos données, sauf:
- Avec votre consentement
- Pour respecter la loi
- Pour protéger nos droits
- Avec nos prestataires de services`
      },
      {
        title: '4. Sécurité des données',
        content: `Nous mettons en œuvre des mesures de sécurité:
- Chiffrement SSL/TLS
- Hachage sécurisé des mots de passe
- Audits de sécurité réguliers
- Accès limité aux données`
      },
      {
        title: '5. Vos droits',
        content: `Vous avez le droit de:
- Accéder à vos données
- Corriger les données inexactes
- Supprimer votre compte
- Exporter vos données
- Vous désinscrire du marketing`
      },
      {
        title: '6. Cookies',
        content: `Nous utilisons des cookies essentiels pour:
- Maintenir votre connexion
- Mémoriser vos préférences
- Analyser le trafic (anonyme)`
      },
      {
        title: '7. Contact',
        content: `Pour toute question sur cette politique:
- E-mail: privacy@mediatoolkit.site`
      }
    ]
  }
}

export default function PrivacyPage() {
  const { language } = useLanguage()
  const t = content[language] || content.en

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <PageHeader />
      
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-500 mb-8">{t.lastUpdated}</p>
          
          <div className="space-y-8">
            {t.sections.map((section: any, i: number) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">{section.title}</h2>
                <div className="text-gray-400 whitespace-pre-line leading-relaxed">{section.content}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
