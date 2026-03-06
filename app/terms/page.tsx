'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function TermsPage() {
  const { language } = useLanguage()
  
  const content = language === 'tr' ? {
    title: 'Kullanım Şartları',
    lastUpdated: 'Son Güncelleme: Mart 2025',
    sections: [
      {
        title: '1. Hizmet Tanımı',
        content: `Media Tool Kit, sosyal medya içerik üreticileri için AI destekli araçlar sunan bir SaaS (Hizmet Olarak Yazılım) platformudur. Platformumuz video script yazımı, caption oluşturma, hashtag üretimi ve daha birçok içerik oluşturma aracı sağlar.`
      },
      {
        title: '2. Hesap Kaydı',
        content: `Hizmetlerimizi kullanmak için bir hesap oluşturmanız gerekmektedir. Hesap bilgilerinizin doğruluğundan ve güvenliğinden siz sorumlusunuz. Hesabınızda gerçekleşen tüm aktivitelerden siz sorumlu tutulursunuz.`
      },
      {
        title: '3. Kredi Sistemi',
        content: `Media Tool Kit kredi tabanlı bir sistem kullanır. Krediler, abonelik planınıza göre aylık olarak yenilenir. Kullanılmayan krediler bir sonraki aya devretmez. Her araç farklı miktarda kredi tüketir ve bu bilgi araç sayfasında belirtilir.`
      },
      {
        title: '4. Abonelik ve Ödemeler',
        content: `Abonelikler aylık olarak faturalandırılır. Ödemeler Lemon Squeezy aracılığıyla güvenli bir şekilde işlenir. Aboneliğinizi istediğiniz zaman iptal edebilirsiniz; iptal, mevcut fatura döneminin sonunda geçerli olur.`
      },
      {
        title: '5. Kabul Edilebilir Kullanım',
        content: `Platformumuzu yasa dışı, zararlı veya başkalarının haklarını ihlal eden içerikler oluşturmak için kullanamazsınız. Spam, yanıltıcı içerik veya kötü amaçlı faaliyetler için kullanım kesinlikle yasaktır. Bu kuralların ihlali hesabınızın askıya alınmasına veya sonlandırılmasına neden olabilir.`
      },
      {
        title: '6. Fikri Mülkiyet',
        content: `Platformumuz kullanılarak oluşturulan içerikler size aittir. Ancak, Media Tool Kit markası, logoları ve platform altyapısı şirketimize aittir. AI tarafından oluşturulan içeriklerin özgünlüğünü doğrulamak sizin sorumluluğunuzdadır.`
      },
      {
        title: '7. Hizmet Değişiklikleri',
        content: `Hizmetlerimizi, özelliklerimizi ve fiyatlandırmamızı önceden bildirimde bulunarak değiştirme hakkını saklı tutarız. Önemli değişiklikler e-posta yoluyla bildirilecektir.`
      },
      {
        title: '8. Sorumluluk Sınırlaması',
        content: `Media Tool Kit "olduğu gibi" sunulmaktadır. AI tarafından oluşturulan içeriklerin doğruluğunu garanti etmiyoruz. Platformun kullanımından kaynaklanan dolaylı, arızi veya sonuç olarak ortaya çıkan zararlardan sorumlu değiliz.`
      },
      {
        title: '9. Hesap Sonlandırma',
        content: `Bu şartların ihlali durumunda hesabınızı askıya alma veya sonlandırma hakkını saklı tutarız. Hesabınızı istediğiniz zaman kapatabilirsiniz.`
      },
      {
        title: '10. İletişim',
        content: `Bu kullanım şartlarıyla ilgili sorularınız için bizimle iletişime geçebilirsiniz.`
      }
    ]
  } : {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated: March 2025',
    sections: [
      {
        title: '1. Service Description',
        content: `Media Tool Kit is a SaaS (Software as a Service) platform that provides AI-powered tools for social media content creators. Our platform offers video script writing, caption generation, hashtag generation, and many other content creation tools.`
      },
      {
        title: '2. Account Registration',
        content: `You must create an account to use our services. You are responsible for the accuracy and security of your account information. You are responsible for all activities that occur under your account.`
      },
      {
        title: '3. Credit System',
        content: `Media Tool Kit uses a credit-based system. Credits are renewed monthly according to your subscription plan. Unused credits do not roll over to the next month. Each tool consumes a different amount of credits, which is indicated on the tool page.`
      },
      {
        title: '4. Subscriptions and Payments',
        content: `Subscriptions are billed monthly. Payments are processed securely through Lemon Squeezy. You can cancel your subscription at any time; cancellation takes effect at the end of the current billing period.`
      },
      {
        title: '5. Acceptable Use',
        content: `You may not use our platform to create content that is illegal, harmful, or violates the rights of others. Use for spam, misleading content, or malicious activities is strictly prohibited. Violation of these rules may result in suspension or termination of your account.`
      },
      {
        title: '6. Intellectual Property',
        content: `Content created using our platform belongs to you. However, the Media Tool Kit brand, logos, and platform infrastructure belong to our company. It is your responsibility to verify the originality of AI-generated content.`
      },
      {
        title: '7. Service Changes',
        content: `We reserve the right to modify our services, features, and pricing with prior notice. Significant changes will be communicated via email.`
      },
      {
        title: '8. Limitation of Liability',
        content: `Media Tool Kit is provided "as is." We do not guarantee the accuracy of AI-generated content. We are not liable for indirect, incidental, or consequential damages arising from the use of the platform.`
      },
      {
        title: '9. Account Termination',
        content: `We reserve the right to suspend or terminate your account in case of violation of these terms. You can close your account at any time.`
      },
      {
        title: '10. Contact',
        content: `For questions about these terms of service, please contact us.`
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
        <p className="text-gray-400 mb-8">{content.lastUpdated}</p>
        
        <div className="space-y-8">
          {content.sections.map((section, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-purple-400 mb-3">{section.title}</h2>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700/50 text-center text-gray-400">
          <p>© 2025 Media Tool Kit. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-purple-400 transition">{language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}</Link>
            <Link href="/refund" className="hover:text-purple-400 transition">{language === 'tr' ? 'İade Politikası' : 'Refund Policy'}</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
