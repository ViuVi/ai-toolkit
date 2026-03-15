'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const texts: any = {
  tr: {
    back: 'Geri',
    title: 'Kullanım Şartları',
    updated: 'Son güncelleme: Ocak 2025',
    sections: [
      { title: '1. Şartların Kabulü', content: 'MediaToolkit\'e erişerek bu şartları kabul etmiş olursunuz. Kabul etmiyorsanız hizmetimizi kullanmayın.' },
      { title: '2. Hizmet Açıklaması', content: 'MediaToolkit, içerik üreticileri için AI destekli araçlar sunar: hook oluşturma, script yazma, caption oluşturma, trend analizi ve içerik planlama.' },
      { title: '3. Kullanıcı Hesapları', content: 'Hesap bilgilerinizin gizliliğini korumak ve hesabınızdaki tüm aktivitelerden sorumlusunuz.' },
      { title: '4. Krediler ve Ödemeler', content: 'AI araçlarını kullanmak için kredi gerekir. Kullanılmayan krediler sonraki döneme aktarılmaz. Fiyatlar önceden bildirimle değişebilir.' },
      { title: '5. Kabul Edilebilir Kullanım', content: 'MediaToolkit\'i yasadışı, zararlı veya saldırgan içerik oluşturmak, yasaları ihlal etmek, fikri mülkiyet haklarını ihlal etmek veya spam yapmak için kullanmayın.' },
      { title: '6. Fikri Mülkiyet', content: 'Araçlarımızı kullanarak oluşturduğunuz içerik size aittir. MediaToolkit, platform, araçlar ve teknoloji üzerindeki haklarını saklı tutar.' },
      { title: '7. Sorumluluk Sınırlaması', content: 'MediaToolkit "olduğu gibi" garanti olmaksızın sunulmaktadır. Dolaylı veya sonuçsal zararlardan sorumlu değiliz.' }
    ]
  },
  en: {
    back: 'Back',
    title: 'Terms of Service',
    updated: 'Last updated: January 2025',
    sections: [
      { title: '1. Acceptance of Terms', content: 'By accessing MediaToolkit, you agree to be bound by these terms. If you do not agree, please do not use our service.' },
      { title: '2. Description of Service', content: 'MediaToolkit provides AI-powered tools for content creators including hook generation, script writing, caption creation, trend analysis, and content planning.' },
      { title: '3. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account and for all activities under your account.' },
      { title: '4. Credits and Payments', content: 'Credits are required to use AI tools. Unused credits do not roll over. Prices may change with notice.' },
      { title: '5. Acceptable Use', content: 'Do not use MediaToolkit to generate illegal, harmful, or offensive content, violate laws, infringe IP rights, or engage in spam/abuse.' },
      { title: '6. Intellectual Property', content: 'Content you create belongs to you. MediaToolkit retains rights to the platform, tools, and underlying technology.' },
      { title: '7. Limitation of Liability', content: 'MediaToolkit is provided "as is" without warranties. We are not liable for indirect or consequential damages.' }
    ]
  },
  ru: {
    back: 'Назад',
    title: 'Условия использования',
    updated: 'Последнее обновление: Январь 2025',
    sections: [
      { title: '1. Принятие условий', content: 'Используя MediaToolkit, вы соглашаетесь с этими условиями. Если не согласны, не используйте сервис.' },
      { title: '2. Описание сервиса', content: 'MediaToolkit предоставляет AI-инструменты для создателей контента: генерация хуков, написание скриптов, создание подписей, анализ трендов и планирование контента.' },
      { title: '3. Аккаунты', content: 'Вы несете ответственность за конфиденциальность аккаунта и все действия под ним.' },
      { title: '4. Кредиты и платежи', content: 'Для использования AI-инструментов нужны кредиты. Неиспользованные кредиты не переносятся.' },
      { title: '5. Допустимое использование', content: 'Не используйте MediaToolkit для создания незаконного или вредного контента.' },
      { title: '6. Интеллектуальная собственность', content: 'Созданный вами контент принадлежит вам. MediaToolkit сохраняет права на платформу.' },
      { title: '7. Ограничение ответственности', content: 'MediaToolkit предоставляется "как есть" без гарантий.' }
    ]
  },
  de: {
    back: 'Zurück',
    title: 'Nutzungsbedingungen',
    updated: 'Letzte Aktualisierung: Januar 2025',
    sections: [
      { title: '1. Annahme der Bedingungen', content: 'Durch die Nutzung von MediaToolkit stimmen Sie diesen Bedingungen zu.' },
      { title: '2. Dienstbeschreibung', content: 'MediaToolkit bietet AI-Tools für Content-Ersteller: Hook-Generierung, Script-Schreiben, Caption-Erstellung, Trendanalyse und Content-Planung.' },
      { title: '3. Benutzerkonten', content: 'Sie sind für die Vertraulichkeit Ihres Kontos und alle Aktivitäten verantwortlich.' },
      { title: '4. Credits und Zahlungen', content: 'Credits sind für AI-Tools erforderlich. Ungenutzte Credits verfallen.' },
      { title: '5. Akzeptable Nutzung', content: 'Verwenden Sie MediaToolkit nicht für illegale oder schädliche Inhalte.' },
      { title: '6. Geistiges Eigentum', content: 'Erstellte Inhalte gehören Ihnen. MediaToolkit behält Rechte an der Plattform.' },
      { title: '7. Haftungsbeschränkung', content: 'MediaToolkit wird "wie besehen" ohne Garantien bereitgestellt.' }
    ]
  },
  fr: {
    back: 'Retour',
    title: 'Conditions d\'utilisation',
    updated: 'Dernière mise à jour: Janvier 2025',
    sections: [
      { title: '1. Acceptation des conditions', content: 'En utilisant MediaToolkit, vous acceptez ces conditions.' },
      { title: '2. Description du service', content: 'MediaToolkit fournit des outils AI pour les créateurs: génération de hooks, écriture de scripts, création de légendes, analyse des tendances et planification de contenu.' },
      { title: '3. Comptes utilisateurs', content: 'Vous êtes responsable de la confidentialité de votre compte et de toutes les activités.' },
      { title: '4. Crédits et paiements', content: 'Les crédits sont nécessaires pour les outils AI. Les crédits non utilisés expirent.' },
      { title: '5. Utilisation acceptable', content: 'N\'utilisez pas MediaToolkit pour du contenu illégal ou nuisible.' },
      { title: '6. Propriété intellectuelle', content: 'Le contenu créé vous appartient. MediaToolkit conserve les droits sur la plateforme.' },
      { title: '7. Limitation de responsabilité', content: 'MediaToolkit est fourni "tel quel" sans garanties.' }
    ]
  }
}

export default function TermsPage() {
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
