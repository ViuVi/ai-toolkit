'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: {
    back: 'Geri',
    title: 'Gizlilik Politikası',
    updated: 'Son güncelleme: Ocak 2025',
    sections: [
      { title: '1. Topladığımız Bilgiler', content: 'Hesap oluştururken, hizmetlerimizi kullanırken veya bizimle iletişime geçtiğinizde doğrudan bize sağladığınız bilgileri topluyoruz. Bu bilgiler e-posta adresi, ödeme bilgileri (Lemon Squeezy üzerinden), oluşturduğunuz içerikler ve kullanım verilerini içerir.' },
      { title: '2. Bilgilerinizi Nasıl Kullanıyoruz', content: 'Topladığımız bilgileri hizmetlerimizi sağlamak ve geliştirmek, işlemleri gerçekleştirmek, teknik bildirimler göndermek ve sorularınıza yanıt vermek için kullanıyoruz.' },
      { title: '3. Veri Güvenliği', content: 'Kişisel bilgilerinizi korumak için uygun güvenlik önlemleri uyguluyoruz. Verileriniz aktarım sırasında ve depolamada endüstri standartlarına uygun şekilde şifrelenir.' },
      { title: '4. Üçüncü Taraf Hizmetler', content: 'Supabase (kimlik doğrulama/veritabanı), Lemon Squeezy (ödemeler), Vercel (barındırma) ve Groq (AI işleme) dahil güvenilir hizmetler kullanıyoruz.' },
      { title: '5. Haklarınız', content: 'Kişisel bilgilerinize erişme, düzeltme veya silme hakkına sahipsiniz. Verilerinizle ilgili yardım için bizimle iletişime geçin.' }
    ]
  },
  en: {
    back: 'Back',
    title: 'Privacy Policy',
    updated: 'Last updated: January 2025',
    sections: [
      { title: '1. Information We Collect', content: 'We collect information you provide directly to us when you create an account, use our services, or contact us. This includes email address, payment information (via Lemon Squeezy), content you create, and usage data.' },
      { title: '2. How We Use Your Information', content: 'We use collected information to provide and improve our services, process transactions, send technical notices, and respond to your inquiries.' },
      { title: '3. Data Security', content: 'We implement appropriate security measures to protect your personal information. Your data is encrypted in transit and at rest using industry-standard practices.' },
      { title: '4. Third-Party Services', content: 'We use trusted services including Supabase (authentication/database), Lemon Squeezy (payments), Vercel (hosting), and Groq (AI processing).' },
      { title: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal information. Contact us for assistance with your data.' }
    ]
  },
  ru: {
    back: 'Назад',
    title: 'Политика конфиденциальности',
    updated: 'Последнее обновление: Январь 2025',
    sections: [
      { title: '1. Собираемая информация', content: 'Мы собираем информацию, которую вы предоставляете при создании аккаунта, использовании наших услуг или связи с нами. Это включает email, платежную информацию, созданный контент и данные использования.' },
      { title: '2. Использование информации', content: 'Мы используем собранную информацию для предоставления и улучшения услуг, обработки транзакций, отправки уведомлений и ответов на запросы.' },
      { title: '3. Безопасность данных', content: 'Мы применяем соответствующие меры безопасности для защиты вашей информации. Данные шифруются при передаче и хранении.' },
      { title: '4. Сторонние сервисы', content: 'Мы используем надежные сервисы: Supabase, Lemon Squeezy, Vercel и Groq.' },
      { title: '5. Ваши права', content: 'Вы имеете право на доступ, исправление или удаление вашей информации.' }
    ]
  },
  de: {
    back: 'Zurück',
    title: 'Datenschutzrichtlinie',
    updated: 'Letzte Aktualisierung: Januar 2025',
    sections: [
      { title: '1. Gesammelte Informationen', content: 'Wir sammeln Informationen, die Sie uns direkt bereitstellen, wenn Sie ein Konto erstellen, unsere Dienste nutzen oder uns kontaktieren. Dies umfasst E-Mail, Zahlungsinformationen, erstellte Inhalte und Nutzungsdaten.' },
      { title: '2. Verwendung der Informationen', content: 'Wir verwenden gesammelte Informationen zur Bereitstellung und Verbesserung unserer Dienste, Transaktionsverarbeitung und Beantwortung von Anfragen.' },
      { title: '3. Datensicherheit', content: 'Wir implementieren angemessene Sicherheitsmaßnahmen zum Schutz Ihrer Informationen. Daten werden bei der Übertragung und Speicherung verschlüsselt.' },
      { title: '4. Drittanbieter-Dienste', content: 'Wir nutzen vertrauenswürdige Dienste: Supabase, Lemon Squeezy, Vercel und Groq.' },
      { title: '5. Ihre Rechte', content: 'Sie haben das Recht auf Zugang, Berichtigung oder Löschung Ihrer Informationen.' }
    ]
  },
  fr: {
    back: 'Retour',
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour: Janvier 2025',
    sections: [
      { title: '1. Informations collectées', content: 'Nous collectons les informations que vous nous fournissez lors de la création d\'un compte, l\'utilisation de nos services ou nous contacter. Cela inclut l\'email, les informations de paiement, le contenu créé et les données d\'utilisation.' },
      { title: '2. Utilisation des informations', content: 'Nous utilisons les informations collectées pour fournir et améliorer nos services, traiter les transactions et répondre aux demandes.' },
      { title: '3. Sécurité des données', content: 'Nous mettons en œuvre des mesures de sécurité appropriées. Les données sont cryptées en transit et au repos.' },
      { title: '4. Services tiers', content: 'Nous utilisons des services de confiance: Supabase, Lemon Squeezy, Vercel et Groq.' },
      { title: '5. Vos droits', content: 'Vous avez le droit d\'accéder, de corriger ou de supprimer vos informations.' }
    ]
  }
}

export default function PrivacyPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">M</div>
            <span className="font-bold">MediaToolkit</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition flex items-center gap-1">🌐 {language.toUpperCase()}</button>
              <div className="absolute right-0 mt-2 w-28 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition">← {t.back}</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-gray-400 mb-12">{t.updated}</p>
        <div className="space-y-8">
          {t.sections.map((section: any, i: number) => (
            <section key={i} className="space-y-3">
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
