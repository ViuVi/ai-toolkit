'use client'
import { useLanguage } from '@/lib/LanguageContext'
import PageHeader from '@/components/PageHeader'
import Footer from '@/components/Footer'

const content: Record<string, any> = {
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: January 2026',
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: `By accessing or using MediaToolKit ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.`
      },
      {
        title: '2. Description of Service',
        content: `MediaToolKit provides AI-powered tools for content creators, including but not limited to:
- Hook generation
- Caption creation
- Script writing
- Trend analysis
- Content planning

The Service operates on a credit-based system where users receive credits to use various tools.`
      },
      {
        title: '3. User Accounts',
        content: `**Account Creation:**
- You must provide accurate and complete information
- You are responsible for maintaining account security
- You must be at least 13 years old to use the Service

**Account Responsibilities:**
- You are responsible for all activities under your account
- Notify us immediately of any unauthorized use
- We reserve the right to suspend accounts that violate these terms`
      },
      {
        title: '4. Credits and Payments',
        content: `**Free Plan:**
- 100 credits per month
- Access to all 16 tools
- Watch ads to earn additional credits

**Paid Plans:**
- Pro: $4.99/month for 1000 credits
- Agency: $14.99/month for unlimited credits

**Refund Policy:**
- Subscription refunds within 7 days of purchase
- Unused credits do not roll over to the next month
- No refunds for partially used billing periods`
      },
      {
        title: '5. Acceptable Use',
        content: `You agree NOT to use the Service to:
- Generate illegal, harmful, or offensive content
- Violate intellectual property rights
- Spam or harass others
- Attempt to hack or disrupt the Service
- Create misleading or fraudulent content
- Resell or redistribute generated content commercially without permission

We reserve the right to terminate accounts that violate these guidelines.`
      },
      {
        title: '6. Intellectual Property',
        content: `**Your Content:**
- You retain ownership of content you create using our tools
- You grant us a license to store and process your inputs

**Our Content:**
- MediaToolKit branding, design, and code are our property
- AI-generated outputs may be used freely for personal and commercial purposes`
      },
      {
        title: '7. Limitation of Liability',
        content: `The Service is provided "as is" without warranties of any kind. We are not liable for:
- Indirect, incidental, or consequential damages
- Loss of data or profits
- Service interruptions
- Third-party actions

Our total liability is limited to the amount you paid us in the past 12 months.`
      },
      {
        title: '8. Changes to Terms',
        content: `We may modify these terms at any time. We will notify users of significant changes via email or in-app notification. Continued use of the Service after changes constitutes acceptance.`
      },
      {
        title: '9. Termination',
        content: `We may terminate or suspend your account at any time for:
- Violation of these terms
- Fraudulent activity
- Extended periods of inactivity
- At our discretion with reasonable notice

You may delete your account at any time from your dashboard.`
      },
      {
        title: '10. Contact',
        content: `For questions about these Terms of Service:
- Email: legal@mediatoolkit.site`
      }
    ]
  },
  tr: {
    title: 'Kullanım Şartları',
    lastUpdated: 'Son güncelleme: Ocak 2026',
    sections: [
      {
        title: '1. Şartların Kabulü',
        content: `MediaToolKit'e ("Hizmet") erişerek veya kullanarak bu Kullanım Şartlarına bağlı olmayı kabul edersiniz. Şartların herhangi bir kısmına katılmıyorsanız, Hizmete erişemezsiniz.`
      },
      {
        title: '2. Hizmet Açıklaması',
        content: `MediaToolKit, içerik üreticileri için AI destekli araçlar sağlar:
- Hook oluşturma
- Caption oluşturma
- Script yazma
- Trend analizi
- İçerik planlama

Hizmet, kullanıcıların çeşitli araçları kullanmak için kredi aldığı kredi tabanlı bir sistemle çalışır.`
      },
      {
        title: '3. Kullanıcı Hesapları',
        content: `**Hesap Oluşturma:**
- Doğru ve eksiksiz bilgi sağlamalısınız
- Hesap güvenliğini korumaktan sorumlusunuz
- Hizmeti kullanmak için en az 13 yaşında olmalısınız

**Hesap Sorumlulukları:**
- Hesabınız altındaki tüm faaliyetlerden sorumlusunuz
- Yetkisiz kullanımı derhal bize bildirin
- Bu şartları ihlal eden hesapları askıya alma hakkımız saklıdır`
      },
      {
        title: '4. Krediler ve Ödemeler',
        content: `**Ücretsiz Plan:**
- Ayda 100 kredi
- Tüm 16 araca erişim
- Ek kredi kazanmak için reklam izleyin

**Ücretli Planlar:**
- Pro: 1000 kredi için aylık $4.99
- Agency: Sınırsız kredi için aylık $14.99

**İade Politikası:**
- Satın alma tarihinden itibaren 7 gün içinde abonelik iadesi
- Kullanılmayan krediler bir sonraki aya devretmez
- Kısmen kullanılan fatura dönemleri için iade yapılmaz`
      },
      {
        title: '5. Kabul Edilebilir Kullanım',
        content: `Hizmeti şu amaçlarla KULLANMAMAYI kabul edersiniz:
- Yasadışı, zararlı veya saldırgan içerik oluşturmak
- Fikri mülkiyet haklarını ihlal etmek
- Spam yapmak veya başkalarını taciz etmek
- Hizmeti hacklemeye veya bozmaya çalışmak
- Yanıltıcı veya dolandırıcı içerik oluşturmak
- Oluşturulan içeriği izinsiz ticari olarak yeniden satmak

Bu yönergeleri ihlal eden hesapları sonlandırma hakkımız saklıdır.`
      },
      {
        title: '6. Fikri Mülkiyet',
        content: `**İçeriğiniz:**
- Araçlarımızı kullanarak oluşturduğunuz içeriğin mülkiyeti size aittir
- Girdilerinizi saklamamız ve işlememiz için bize lisans verirsiniz

**Bizim İçeriğimiz:**
- MediaToolKit markası, tasarımı ve kodu bizim mülkümüzdür
- AI tarafından oluşturulan çıktılar kişisel ve ticari amaçlarla serbestçe kullanılabilir`
      },
      {
        title: '7. Sorumluluk Sınırlaması',
        content: `Hizmet, herhangi bir garanti olmaksızın "olduğu gibi" sağlanır. Şunlardan sorumlu değiliz:
- Dolaylı veya arızi zararlar
- Veri veya kar kaybı
- Hizmet kesintileri
- Üçüncü taraf eylemleri

Toplam sorumluluğumuz, son 12 ayda bize ödediğiniz miktarla sınırlıdır.`
      },
      {
        title: '8. Şartlarda Değişiklikler',
        content: `Bu şartları istediğimiz zaman değiştirebiliriz. Önemli değişiklikleri e-posta veya uygulama içi bildirim yoluyla kullanıcılara bildireceğiz. Değişikliklerden sonra Hizmeti kullanmaya devam etmek kabul anlamına gelir.`
      },
      {
        title: '9. Fesih',
        content: `Hesabınızı istediğimiz zaman şu nedenlerle feshedebilir veya askıya alabiliriz:
- Bu şartların ihlali
- Dolandırıcılık faaliyeti
- Uzun süreli hareketsizlik
- Makul bildirimle kendi takdirimize bağlı olarak

Hesabınızı istediğiniz zaman kontrol panelinizden silebilirsiniz.`
      },
      {
        title: '10. İletişim',
        content: `Bu Kullanım Şartları hakkında sorularınız için:
- E-posta: legal@mediatoolkit.site`
      }
    ]
  },
  ru: {
    title: 'Условия использования',
    lastUpdated: 'Последнее обновление: Январь 2026',
    sections: [
      {
        title: '1. Принятие условий',
        content: `Получая доступ к MediaToolKit ("Сервис") или используя его, вы соглашаетесь с настоящими Условиями использования.`
      },
      {
        title: '2. Описание сервиса',
        content: `MediaToolKit предоставляет AI-инструменты для создателей контента:
- Генерация хуков
- Создание подписей
- Написание скриптов
- Анализ трендов
- Планирование контента

Сервис работает на основе кредитной системы.`
      },
      {
        title: '3. Учетные записи',
        content: `**Создание учетной записи:**
- Необходимо предоставить точную информацию
- Вы отвечаете за безопасность учетной записи
- Минимальный возраст: 13 лет

**Обязанности:**
- Вы отвечаете за все действия под вашей учетной записью
- Немедленно сообщайте о несанкционированном доступе`
      },
      {
        title: '4. Кредиты и платежи',
        content: `**Бесплатный план:**
- 100 кредитов в месяц
- Доступ ко всем 16 инструментам

**Платные планы:**
- Pro: $4.99/месяц за 1000 кредитов
- Agency: $14.99/месяц за безлимит

**Возврат:**
- В течение 7 дней после покупки
- Неиспользованные кредиты не переносятся`
      },
      {
        title: '5. Допустимое использование',
        content: `Запрещено:
- Создавать незаконный или вредный контент
- Нарушать авторские права
- Рассылать спам
- Взламывать сервис
- Создавать мошеннический контент`
      },
      {
        title: '6. Интеллектуальная собственность',
        content: `**Ваш контент:**
- Вы сохраняете права на созданный контент

**Наш контент:**
- Бренд и код MediaToolKit - наша собственность`
      },
      {
        title: '7. Ограничение ответственности',
        content: `Сервис предоставляется "как есть" без гарантий. Мы не несем ответственности за косвенные убытки.`
      },
      {
        title: '8. Изменения условий',
        content: `Мы можем изменить условия в любое время с уведомлением пользователей.`
      },
      {
        title: '9. Прекращение',
        content: `Мы можем приостановить учетную запись за нарушение условий.`
      },
      {
        title: '10. Контакты',
        content: `По вопросам условий:
- Email: legal@mediatoolkit.site`
      }
    ]
  },
  de: {
    title: 'Nutzungsbedingungen',
    lastUpdated: 'Letzte Aktualisierung: Januar 2026',
    sections: [
      {
        title: '1. Annahme der Bedingungen',
        content: `Durch den Zugriff auf MediaToolKit stimmen Sie diesen Nutzungsbedingungen zu.`
      },
      {
        title: '2. Beschreibung des Dienstes',
        content: `MediaToolKit bietet KI-Tools für Content-Ersteller:
- Hook-Generierung
- Caption-Erstellung
- Skript-Schreiben
- Trendanalyse
- Content-Planung

Der Dienst arbeitet mit einem Kreditsystem.`
      },
      {
        title: '3. Benutzerkonten',
        content: `**Kontoerstellung:**
- Genaue Informationen erforderlich
- Sie sind für die Kontosicherheit verantwortlich
- Mindestalter: 13 Jahre`
      },
      {
        title: '4. Credits und Zahlungen',
        content: `**Kostenloser Plan:**
- 100 Credits pro Monat
- Zugang zu allen 16 Tools

**Bezahlte Pläne:**
- Pro: $4.99/Monat für 1000 Credits
- Agency: $14.99/Monat für unbegrenzt

**Rückerstattung:**
- Innerhalb von 7 Tagen nach Kauf`
      },
      {
        title: '5. Akzeptable Nutzung',
        content: `Verboten:
- Illegale oder schädliche Inhalte erstellen
- Urheberrechte verletzen
- Spam versenden
- Den Dienst hacken`
      },
      {
        title: '6. Geistiges Eigentum',
        content: `**Ihr Inhalt:**
- Sie behalten die Rechte an erstellten Inhalten

**Unser Inhalt:**
- MediaToolKit-Marke und Code sind unser Eigentum`
      },
      {
        title: '7. Haftungsbeschränkung',
        content: `Der Dienst wird "wie besehen" ohne Garantien bereitgestellt.`
      },
      {
        title: '8. Änderungen',
        content: `Wir können diese Bedingungen jederzeit ändern.`
      },
      {
        title: '9. Kündigung',
        content: `Wir können Konten bei Verstößen sperren.`
      },
      {
        title: '10. Kontakt',
        content: `Bei Fragen:
- E-Mail: legal@mediatoolkit.site`
      }
    ]
  },
  fr: {
    title: 'Conditions d\'utilisation',
    lastUpdated: 'Dernière mise à jour: Janvier 2026',
    sections: [
      {
        title: '1. Acceptation des conditions',
        content: `En accédant à MediaToolKit, vous acceptez ces Conditions d'utilisation.`
      },
      {
        title: '2. Description du service',
        content: `MediaToolKit fournit des outils IA pour les créateurs:
- Génération de hooks
- Création de légendes
- Écriture de scripts
- Analyse des tendances
- Planification de contenu

Le service fonctionne avec un système de crédits.`
      },
      {
        title: '3. Comptes utilisateurs',
        content: `**Création de compte:**
- Informations exactes requises
- Vous êtes responsable de la sécurité du compte
- Âge minimum: 13 ans`
      },
      {
        title: '4. Crédits et paiements',
        content: `**Plan gratuit:**
- 100 crédits par mois
- Accès aux 16 outils

**Plans payants:**
- Pro: $4.99/mois pour 1000 crédits
- Agency: $14.99/mois pour illimité

**Remboursement:**
- Dans les 7 jours suivant l'achat`
      },
      {
        title: '5. Utilisation acceptable',
        content: `Interdit:
- Créer du contenu illégal ou nuisible
- Violer les droits d'auteur
- Envoyer du spam
- Pirater le service`
      },
      {
        title: '6. Propriété intellectuelle',
        content: `**Votre contenu:**
- Vous conservez les droits sur le contenu créé

**Notre contenu:**
- La marque et le code MediaToolKit nous appartiennent`
      },
      {
        title: '7. Limitation de responsabilité',
        content: `Le service est fourni "tel quel" sans garanties.`
      },
      {
        title: '8. Modifications',
        content: `Nous pouvons modifier ces conditions à tout moment.`
      },
      {
        title: '9. Résiliation',
        content: `Nous pouvons suspendre les comptes en cas de violation.`
      },
      {
        title: '10. Contact',
        content: `Pour toute question:
- E-mail: legal@mediatoolkit.site`
      }
    ]
  }
}

export default function TermsPage() {
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
