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

export default function RefundPage() {
  const { language, setLanguage } = useLanguage()
  
  const content = language === 'tr' ? {
    title: 'İade Politikası',
    lastUpdated: 'Son Güncelleme: Mart 2025',
    intro: 'Media Tool Kit olarak müşteri memnuniyetini ön planda tutuyoruz. Bu politika, abonelik iadelerimizle ilgili koşulları açıklamaktadır.',
    sections: [
      {
        title: '💳 Abonelik İadeleri',
        content: `İlk satın alma tarihinden itibaren 7 gün içinde iade talep edebilirsiniz. İade talebinizin onaylanması için:
        
• Kredilerinizin %50'sinden fazlasını kullanmamış olmanız gerekmektedir
• Hesabınız askıya alınmış veya yasaklanmış olmamalıdır
• İade talebini e-posta ile iletmeniz gerekmektedir`
      },
      {
        title: '⏰ İade Süreci',
        content: `İade talepleriniz 3-5 iş günü içinde işleme alınır. Onaylanan iadeler, ödeme yönteminize bağlı olarak 5-10 iş günü içinde hesabınıza yansıtılır. İadeler orijinal ödeme yöntemine yapılır.`
      },
      {
        title: '❌ İade Edilemeyenler',
        content: `Aşağıdaki durumlarda iade yapılmaz:

• 7 günlük iade süresinin geçmiş olması
• Kredilerin %50'sinden fazlasının kullanılmış olması
• Kullanım şartlarının ihlal edilmesi nedeniyle hesabın askıya alınması
• Aynı hesap için daha önce iade yapılmış olması`
      },
      {
        title: '🔄 Abonelik İptali',
        content: `Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal, mevcut fatura döneminin sonunda geçerli olur. İptal sonrası:

• Kalan kredilerinizi dönem sonuna kadar kullanabilirsiniz
• Otomatik yenileme durdurulur
• Hesabınız ücretsiz plana düşürülür`
      },
      {
        title: '📧 İade Talebi Nasıl Yapılır?',
        content: `İade talebinizi aşağıdaki bilgilerle bize e-posta göndererek yapabilirsiniz:

• Kayıtlı e-posta adresiniz
• Satın alma tarihiniz
• İade gerekçeniz

Talebiniz en kısa sürede değerlendirilecektir.`
      },
      {
        title: '⚖️ Yasal Haklar',
        content: `Bu iade politikası, yerel tüketici koruma yasaları kapsamındaki haklarınızı etkilemez. Yasal haklarınız bu politikadaki koşullardan bağımsız olarak geçerlidir.`
      }
    ]
  } : {
    title: 'Refund Policy',
    lastUpdated: 'Last Updated: March 2025',
    intro: 'At Media Tool Kit, we prioritize customer satisfaction. This policy explains the conditions regarding our subscription refunds.',
    sections: [
      {
        title: '💳 Subscription Refunds',
        content: `You can request a refund within 7 days of your initial purchase date. For your refund request to be approved:
        
• You must not have used more than 50% of your credits
• Your account must not be suspended or banned
• You must submit the refund request via email`
      },
      {
        title: '⏰ Refund Process',
        content: `Refund requests are processed within 3-5 business days. Approved refunds are credited to your account within 5-10 business days, depending on your payment method. Refunds are made to the original payment method.`
      },
      {
        title: '❌ Non-Refundable Cases',
        content: `Refunds are not available in the following cases:

• The 7-day refund period has passed
• More than 50% of credits have been used
• Account suspension due to violation of terms of service
• A refund has already been issued for the same account`
      },
      {
        title: '🔄 Subscription Cancellation',
        content: `You can cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. After cancellation:

• You can use your remaining credits until the end of the period
• Automatic renewal is stopped
• Your account is downgraded to the free plan`
      },
      {
        title: '📧 How to Request a Refund',
        content: `You can request a refund by sending us an email with the following information:

• Your registered email address
• Your purchase date
• Reason for refund

Your request will be evaluated as soon as possible.`
      },
      {
        title: '⚖️ Legal Rights',
        content: `This refund policy does not affect your rights under local consumer protection laws. Your legal rights are valid regardless of the conditions in this policy.`
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition">← {language === 'tr' ? 'Ana Sayfa' : language === 'ru' ? 'Главная' : language === 'de' ? 'Startseite' : language === 'fr' ? 'Accueil' : 'Home'}</Link>
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
        <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
        <p className="text-gray-400 mb-4">{content.lastUpdated}</p>
        <p className="text-gray-300 mb-8 text-lg">{content.intro}</p>
        
        <div className="space-y-6">
          {content.sections.map((section, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-purple-400 mb-3">{section.title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold mb-2">{language === 'tr' ? '📬 İletişim' : '📬 Contact'}</h3>
          <p className="text-gray-300">
            {language === 'tr' 
              ? 'İade talepleriniz ve sorularınız için bize e-posta gönderebilirsiniz.'
              : 'You can email us for refund requests and questions.'}
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700/50 text-center text-gray-400">
          <p>© 2025 Media Tool Kit. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/terms" className="hover:text-purple-400 transition">{language === 'tr' ? 'Kullanım Şartları' : 'Terms of Service'}</Link>
            <Link href="/privacy" className="hover:text-purple-400 transition">{language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
