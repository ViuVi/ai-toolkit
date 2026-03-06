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
    title: 'Refund Policy',
    lastUpdated: 'Last Updated: March 2025',
    intro: 'At Media Tool Kit, we prioritize customer satisfaction. This policy explains our refund conditions for subscriptions.',
    copyright: '© 2025 Media Tool Kit. All rights reserved.',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    sections: [
      { title: '💳 Subscription Refunds', content: 'You can request a refund within 7 days of your first purchase. For your refund request to be approved:\n\n• You must not have used more than 50% of your credits\n• Your account must not be suspended or banned\n• You must submit your refund request via email' },
      { title: '⏱️ Processing Time', content: 'Refund requests are processed within 3-5 business days. Refunds are made to the original payment method. Refund processing time may vary depending on your bank.' },
      { title: '❌ Non-Refundable Cases', content: 'Refunds cannot be processed in the following cases:\n\n• More than 7 days have passed since the first purchase\n• More than 50% of credits have been used\n• Account has been suspended due to terms violation\n• Renewal payments (only first purchase is refundable)' },
      { title: '🔄 Subscription Cancellation', content: 'You can cancel your subscription at any time:\n\n• Cancellation takes effect at the end of the billing period\n• Your credits remain valid until the end of the period\n• Unused credits are not refunded upon cancellation' },
      { title: '📧 Contact', content: 'For refund requests and questions:\n\nEmail: ahmetemresozer@gmail.com\n\nPlease include your registered email address and reason for refund in your request.' }
    ]
  },
  tr: {
    home: 'Ana Sayfa',
    title: 'İade Politikası',
    lastUpdated: 'Son Güncelleme: Mart 2025',
    intro: 'Media Tool Kit olarak müşteri memnuniyetini ön planda tutuyoruz. Bu politika, abonelik iadelerimizle ilgili koşulları açıklar.',
    copyright: '© 2025 Media Tool Kit. Tüm hakları saklıdır.',
    terms: 'Kullanım Şartları',
    privacy: 'Gizlilik Politikası',
    sections: [
      { title: '💳 Abonelik İadeleri', content: 'İlk satın alma tarihinden itibaren 7 gün içinde iade talep edebilirsiniz. İade talebinizin onaylanması için:\n\n• Kredilerinizin %50\'sinden fazlasını kullanmamış olmanız gerekmektedir\n• Hesabınız askıya alınmış veya yasaklanmış olmamalıdır\n• İade talebini e-posta ile iletmeniz gerekmektedir' },
      { title: '⏱️ İşlem Süresi', content: 'İade talepleri 3-5 iş günü içinde işleme alınır. İadeler orijinal ödeme yöntemine yapılır. Bankanıza bağlı olarak iade süresi değişebilir.' },
      { title: '❌ İade Edilemeyen Durumlar', content: 'Aşağıdaki durumlarda iade yapılmaz:\n\n• İlk satın almadan 7 günden fazla süre geçmişse\n• Kredilerin %50\'sinden fazlası kullanılmışsa\n• Hesap şartlar ihlali nedeniyle askıya alınmışsa\n• Yenileme ödemeleri (sadece ilk satın alma iade edilebilir)' },
      { title: '🔄 Abonelik İptali', content: 'Aboneliğinizi istediğiniz zaman iptal edebilirsiniz:\n\n• İptal, fatura döneminin sonunda geçerli olur\n• Kredileriniz dönem sonuna kadar geçerli kalır\n• İptal durumunda kullanılmayan krediler iade edilmez' },
      { title: '📧 İletişim', content: 'İade talepleri ve sorularınız için:\n\nE-posta: ahmetemresozer@gmail.com\n\nTalebinizde kayıtlı e-posta adresinizi ve iade nedeninizi belirtin.' }
    ]
  },
  ru: {
    home: 'Главная',
    title: 'Политика возврата',
    lastUpdated: 'Последнее обновление: Март 2025',
    intro: 'В Media Tool Kit мы ставим удовлетворённость клиентов на первое место. Эта политика объясняет условия возврата средств за подписки.',
    copyright: '© 2025 Media Tool Kit. Все права защищены.',
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
    sections: [
      { title: '💳 Возврат за подписку', content: 'Вы можете запросить возврат в течение 7 дней после первой покупки. Для одобрения возврата:\n\n• Вы не должны использовать более 50% кредитов\n• Ваш аккаунт не должен быть заблокирован\n• Запрос на возврат должен быть отправлен по email' },
      { title: '⏱️ Время обработки', content: 'Запросы на возврат обрабатываются в течение 3-5 рабочих дней. Возврат осуществляется на исходный способ оплаты.' },
      { title: '❌ Невозвратные случаи', content: 'Возврат не производится в следующих случаях:\n\n• Прошло более 7 дней с первой покупки\n• Использовано более 50% кредитов\n• Аккаунт заблокирован за нарушение правил\n• Платежи за продление' },
      { title: '🔄 Отмена подписки', content: 'Вы можете отменить подписку в любое время:\n\n• Отмена вступает в силу в конце периода\n• Кредиты действительны до конца периода' },
      { title: '📧 Контакты', content: 'Для запросов на возврат:\n\nEmail: ahmetemresozer@gmail.com' }
    ]
  },
  de: {
    home: 'Startseite',
    title: 'Rückerstattungsrichtlinie',
    lastUpdated: 'Letzte Aktualisierung: März 2025',
    intro: 'Bei Media Tool Kit steht die Kundenzufriedenheit an erster Stelle. Diese Richtlinie erklärt unsere Rückerstattungsbedingungen für Abonnements.',
    copyright: '© 2025 Media Tool Kit. Alle Rechte vorbehalten.',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutzrichtlinie',
    sections: [
      { title: '💳 Abonnement-Rückerstattungen', content: 'Sie können innerhalb von 7 Tagen nach dem ersten Kauf eine Rückerstattung beantragen. Für die Genehmigung:\n\n• Sie dürfen nicht mehr als 50% Ihrer Credits verwendet haben\n• Ihr Konto darf nicht gesperrt sein\n• Der Antrag muss per E-Mail eingereicht werden' },
      { title: '⏱️ Bearbeitungszeit', content: 'Rückerstattungsanträge werden innerhalb von 3-5 Werktagen bearbeitet. Rückerstattungen erfolgen auf die ursprüngliche Zahlungsmethode.' },
      { title: '❌ Nicht erstattungsfähige Fälle', content: 'Keine Rückerstattung in folgenden Fällen:\n\n• Mehr als 7 Tage seit dem ersten Kauf\n• Mehr als 50% der Credits verwendet\n• Konto wegen Verstoß gesperrt\n• Verlängerungszahlungen' },
      { title: '🔄 Abonnement-Kündigung', content: 'Sie können Ihr Abonnement jederzeit kündigen:\n\n• Die Kündigung wird am Ende des Zeitraums wirksam\n• Credits bleiben bis zum Ende gültig' },
      { title: '📧 Kontakt', content: 'Für Rückerstattungsanfragen:\n\nE-Mail: ahmetemresozer@gmail.com' }
    ]
  },
  fr: {
    home: 'Accueil',
    title: 'Politique de remboursement',
    lastUpdated: 'Dernière mise à jour: Mars 2025',
    intro: 'Chez Media Tool Kit, la satisfaction client est notre priorité. Cette politique explique nos conditions de remboursement pour les abonnements.',
    copyright: '© 2025 Media Tool Kit. Tous droits réservés.',
    terms: 'Conditions d\'utilisation',
    privacy: 'Politique de confidentialité',
    sections: [
      { title: '💳 Remboursements d\'abonnement', content: 'Vous pouvez demander un remboursement dans les 7 jours suivant votre premier achat. Pour l\'approbation:\n\n• Vous ne devez pas avoir utilisé plus de 50% de vos crédits\n• Votre compte ne doit pas être suspendu\n• La demande doit être soumise par email' },
      { title: '⏱️ Délai de traitement', content: 'Les demandes de remboursement sont traitées sous 3-5 jours ouvrables. Les remboursements sont effectués sur le mode de paiement original.' },
      { title: '❌ Cas non remboursables', content: 'Pas de remboursement dans les cas suivants:\n\n• Plus de 7 jours depuis le premier achat\n• Plus de 50% des crédits utilisés\n• Compte suspendu pour violation\n• Paiements de renouvellement' },
      { title: '🔄 Annulation d\'abonnement', content: 'Vous pouvez annuler votre abonnement à tout moment:\n\n• L\'annulation prend effet à la fin de la période\n• Les crédits restent valides jusqu\'à la fin' },
      { title: '📧 Contact', content: 'Pour les demandes de remboursement:\n\nEmail: ahmetemresozer@gmail.com' }
    ]
  }
}

export default function RefundPage() {
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
            <Link href="/privacy" className="hover:text-purple-400 transition">{t.privacy}</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
