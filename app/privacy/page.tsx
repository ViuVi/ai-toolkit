'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function PrivacyPage() {
  const { language } = useLanguage()
  
  const content = language === 'tr' ? {
    title: 'Gizlilik Politikası',
    lastUpdated: 'Son Güncelleme: Mart 2025',
    intro: 'Media Tool Kit olarak gizliliğinize önem veriyoruz. Bu politika, kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklamaktadır.',
    sections: [
      {
        title: '📋 Toplanan Bilgiler',
        content: `Hizmetlerimizi sağlamak için aşağıdaki bilgileri topluyoruz:

• Hesap Bilgileri: E-posta adresi, şifre (şifrelenmiş)
• Kullanım Verileri: Kullandığınız araçlar, kredi tüketimi, oturum bilgileri
• Ödeme Bilgileri: Ödeme işlemleri Lemon Squeezy tarafından güvenli şekilde işlenir; kredi kartı bilgilerinizi saklamıyoruz
• Teknik Veriler: IP adresi, tarayıcı türü, cihaz bilgileri`
      },
      {
        title: '🎯 Bilgilerin Kullanımı',
        content: `Topladığımız bilgileri şu amaçlarla kullanıyoruz:

• Hizmetlerimizi sağlamak ve iyileştirmek
• Hesabınızı yönetmek ve güvenliğini sağlamak
• Abonelik ve ödeme işlemlerini gerçekleştirmek
• Teknik destek sağlamak
• Hizmet güncellemeleri hakkında bilgilendirmek`
      },
      {
        title: '🔒 Veri Güvenliği',
        content: `Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz:

• SSL/TLS şifreleme
• Güvenli sunucu altyapısı (Vercel)
• Şifrelenmiş veritabanı (Supabase)
• Düzenli güvenlik denetimleri`
      },
      {
        title: '🤝 Üçüncü Taraf Paylaşımı',
        content: `Verilerinizi yalnızca hizmet sağlamak için gerekli olan üçüncü taraflarla paylaşıyoruz:

• Supabase: Veritabanı ve kimlik doğrulama
• Lemon Squeezy: Ödeme işlemleri
• Vercel: Web barındırma
• Hugging Face: AI model API'leri

Bu sağlayıcılar kendi gizlilik politikalarına tabidir.`
      },
      {
        title: '🍪 Çerezler',
        content: `Web sitemizde oturum yönetimi ve kullanıcı deneyimini iyileştirmek için çerezler kullanıyoruz. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu bazı özelliklerin çalışmamasına neden olabilir.`
      },
      {
        title: '👤 Kullanıcı Hakları',
        content: `GDPR ve KVKK kapsamında aşağıdaki haklara sahipsiniz:

• Verilerinize erişim hakkı
• Verilerinizin düzeltilmesini talep etme hakkı
• Verilerinizin silinmesini talep etme hakkı
• Veri işlemeye itiraz etme hakkı
• Veri taşınabilirliği hakkı

Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.`
      },
      {
        title: '📧 İletişim',
        content: `Gizlilik ile ilgili sorularınız için bizimle iletişime geçebilirsiniz. Taleplerinize en kısa sürede yanıt vereceğiz.`
      },
      {
        title: '🔄 Politika Güncellemeleri',
        content: `Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler e-posta yoluyla bildirilecektir. Güncel politikayı düzenli olarak kontrol etmenizi öneririz.`
      }
    ]
  } : {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: March 2025',
    intro: 'At Media Tool Kit, we value your privacy. This policy explains how we collect, use, and protect your personal data.',
    sections: [
      {
        title: '📋 Information We Collect',
        content: `We collect the following information to provide our services:

• Account Information: Email address, password (encrypted)
• Usage Data: Tools you use, credit consumption, session information
• Payment Information: Payments are processed securely by Lemon Squeezy; we do not store your credit card information
• Technical Data: IP address, browser type, device information`
      },
      {
        title: '🎯 How We Use Information',
        content: `We use the information we collect for the following purposes:

• To provide and improve our services
• To manage and secure your account
• To process subscriptions and payments
• To provide technical support
• To inform about service updates`
      },
      {
        title: '🔒 Data Security',
        content: `We implement industry-standard security measures to protect your data:

• SSL/TLS encryption
• Secure server infrastructure (Vercel)
• Encrypted database (Supabase)
• Regular security audits`
      },
      {
        title: '🤝 Third-Party Sharing',
        content: `We only share your data with third parties necessary to provide our services:

• Supabase: Database and authentication
• Lemon Squeezy: Payment processing
• Vercel: Web hosting
• Hugging Face: AI model APIs

These providers are subject to their own privacy policies.`
      },
      {
        title: '🍪 Cookies',
        content: `We use cookies on our website for session management and to improve user experience. You can disable cookies in your browser settings, but this may cause some features to not work properly.`
      },
      {
        title: '👤 User Rights',
        content: `Under GDPR and similar regulations, you have the following rights:

• Right to access your data
• Right to request correction of your data
• Right to request deletion of your data
• Right to object to data processing
• Right to data portability

Contact us to exercise these rights.`
      },
      {
        title: '📧 Contact',
        content: `For questions about privacy, please contact us. We will respond to your requests as soon as possible.`
      },
      {
        title: '🔄 Policy Updates',
        content: `We may update this privacy policy from time to time. Significant changes will be communicated via email. We recommend checking the current policy regularly.`
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-white transition">← {language === 'tr' ? 'Ana Sayfa' : 'Home'}</Link>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Media Tool Kit</span>
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
        
        <div className="mt-12 pt-8 border-t border-gray-700/50 text-center text-gray-400">
          <p>© 2025 Media Tool Kit. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/terms" className="hover:text-purple-400 transition">{language === 'tr' ? 'Kullanım Şartları' : 'Terms of Service'}</Link>
            <Link href="/refund" className="hover:text-purple-400 transition">{language === 'tr' ? 'İade Politikası' : 'Refund Policy'}</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
