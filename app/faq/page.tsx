'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const texts: Record<string, Record<string, string>> = {
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about MediaToolKit',
    stillQuestions: 'Still have questions?',
    contactUs: 'Contact Us'
  },
  tr: {
    title: 'Sıkça Sorulan Sorular',
    subtitle: 'MediaToolKit hakkında bilmeniz gereken her şey',
    stillQuestions: 'Hala sorularınız mı var?',
    contactUs: 'Bize Ulaşın'
  },
  ru: {
    title: 'Часто задаваемые вопросы',
    subtitle: 'Всё, что нужно знать о MediaToolKit',
    stillQuestions: 'Остались вопросы?',
    contactUs: 'Свяжитесь с нами'
  },
  de: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Alles, was Sie über MediaToolKit wissen müssen',
    stillQuestions: 'Noch Fragen?',
    contactUs: 'Kontaktieren Sie uns'
  },
  fr: {
    title: 'Questions fréquemment posées',
    subtitle: 'Tout ce que vous devez savoir sur MediaToolKit',
    stillQuestions: 'Encore des questions?',
    contactUs: 'Contactez-nous'
  }
}

const faqs = [
  {
    category: { en: 'General', tr: 'Genel', ru: 'Общие', de: 'Allgemein', fr: 'Général' },
    items: [
      {
        q: {
          en: 'What is MediaToolKit?',
          tr: 'MediaToolKit nedir?',
          ru: 'Что такое MediaToolKit?',
          de: 'Was ist MediaToolKit?',
          fr: 'Qu\'est-ce que MediaToolKit?'
        },
        a: {
          en: 'MediaToolKit is an AI-powered platform with 16+ tools designed specifically for content creators. From generating viral hooks to analyzing competitor content, we help you create better content faster.',
          tr: 'MediaToolKit, içerik üreticileri için özel olarak tasarlanmış 16+ AI destekli araç sunan bir platformdur. Viral hooklar oluşturmaktan rakip içerikleri analiz etmeye kadar, daha iyi içerikler oluşturmanıza yardımcı oluyoruz.',
          ru: 'MediaToolKit — это платформа с ИИ, включающая 16+ инструментов для создателей контента. От создания вирусных хуков до анализа контента конкурентов.',
          de: 'MediaToolKit ist eine KI-gestützte Plattform mit über 16 Tools für Content Creator. Von viralen Hooks bis zur Konkurrenzanalyse.',
          fr: 'MediaToolKit est une plateforme IA avec plus de 16 outils pour les créateurs de contenu. Des hooks viraux à l\'analyse de la concurrence.'
        }
      },
      {
        q: {
          en: 'Which social media platforms does it support?',
          tr: 'Hangi sosyal medya platformlarını destekliyor?',
          ru: 'Какие социальные сети поддерживаются?',
          de: 'Welche Social-Media-Plattformen werden unterstützt?',
          fr: 'Quelles plateformes de médias sociaux sont prises en charge?'
        },
        a: {
          en: 'MediaToolKit supports all major platforms including TikTok, Instagram, YouTube, Twitter/X, LinkedIn, Facebook, and Pinterest. Our tools are optimized for each platform\'s unique requirements.',
          tr: 'MediaToolKit, TikTok, Instagram, YouTube, Twitter/X, LinkedIn, Facebook ve Pinterest dahil tüm büyük platformları destekler. Araçlarımız her platformun benzersiz gereksinimlerine göre optimize edilmiştir.',
          ru: 'MediaToolKit поддерживает все основные платформы: TikTok, Instagram, YouTube, Twitter/X, LinkedIn, Facebook и Pinterest.',
          de: 'MediaToolKit unterstützt alle wichtigen Plattformen wie TikTok, Instagram, YouTube, Twitter/X, LinkedIn, Facebook und Pinterest.',
          fr: 'MediaToolKit prend en charge toutes les principales plateformes: TikTok, Instagram, YouTube, Twitter/X, LinkedIn, Facebook et Pinterest.'
        }
      }
    ]
  },
  {
    category: { en: 'Credits & Pricing', tr: 'Krediler & Fiyatlandırma', ru: 'Кредиты и цены', de: 'Credits & Preise', fr: 'Crédits et tarifs' },
    items: [
      {
        q: {
          en: 'How do credits work?',
          tr: 'Krediler nasıl çalışır?',
          ru: 'Как работают кредиты?',
          de: 'Wie funktionieren Credits?',
          fr: 'Comment fonctionnent les crédits?'
        },
        a: {
          en: 'Each tool uses a certain number of credits per use. Simple tools like Hashtag Research use 3 credits, while more complex tools like Content Planner use 10 credits. You can see the credit cost on each tool card.',
          tr: 'Her araç, kullanım başına belirli sayıda kredi kullanır. Hashtag Araştırma gibi basit araçlar 3 kredi kullanırken, İçerik Planlayıcı gibi daha karmaşık araçlar 10 kredi kullanır. Her araç kartında kredi maliyetini görebilirsiniz.',
          ru: 'Каждый инструмент использует определённое количество кредитов. Простые инструменты — 3 кредита, сложные — до 10 кредитов.',
          de: 'Jedes Tool verbraucht eine bestimmte Anzahl an Credits. Einfache Tools kosten 3 Credits, komplexere bis zu 10 Credits.',
          fr: 'Chaque outil utilise un certain nombre de crédits. Les outils simples coûtent 3 crédits, les plus complexes jusqu\'à 10 crédits.'
        }
      },
      {
        q: {
          en: 'How can I get free credits?',
          tr: 'Ücretsiz kredi nasıl alabilirim?',
          ru: 'Как получить бесплатные кредиты?',
          de: 'Wie kann ich kostenlose Credits bekommen?',
          fr: 'Comment puis-je obtenir des crédits gratuits?'
        },
        a: {
          en: 'Free users get 100 credits per month. You can also earn +10 credits by watching a short ad. The "Watch Ad" button is available in your dashboard.',
          tr: 'Ücretsiz kullanıcılar ayda 100 kredi alır. Ayrıca kısa bir reklam izleyerek +10 kredi kazanabilirsiniz. "Reklam İzle" butonu panelinizde mevcuttur.',
          ru: 'Бесплатные пользователи получают 100 кредитов в месяц. Также можно заработать +10 кредитов, посмотрев рекламу.',
          de: 'Kostenlose Nutzer erhalten 100 Credits pro Monat. Sie können auch +10 Credits durch Anschauen einer Werbung verdienen.',
          fr: 'Les utilisateurs gratuits reçoivent 100 crédits par mois. Vous pouvez aussi gagner +10 crédits en regardant une pub.'
        }
      },
      {
        q: {
          en: 'What\'s included in the Pro plan?',
          tr: 'Pro plan neleri içeriyor?',
          ru: 'Что включено в план Pro?',
          de: 'Was ist im Pro-Plan enthalten?',
          fr: 'Qu\'est-ce qui est inclus dans le plan Pro?'
        },
        a: {
          en: 'Pro plan includes 1000 credits per month, access to all 16 tools, ad-free experience, priority support, and early access to new features. It\'s perfect for serious content creators.',
          tr: 'Pro plan ayda 1000 kredi, tüm 16 araca erişim, reklamsız deneyim, öncelikli destek ve yeni özelliklere erken erişim içerir. Ciddi içerik üreticileri için mükemmeldir.',
          ru: 'Pro план включает 1000 кредитов в месяц, доступ ко всем 16 инструментам, без рекламы, приоритетную поддержку.',
          de: 'Der Pro-Plan umfasst 1000 Credits/Monat, Zugang zu allen 16 Tools, werbefreie Nutzung und Priority-Support.',
          fr: 'Le plan Pro comprend 1000 crédits/mois, accès aux 16 outils, sans publicité et support prioritaire.'
        }
      }
    ]
  },
  {
    category: { en: 'Tools & Features', tr: 'Araçlar & Özellikler', ru: 'Инструменты', de: 'Tools & Funktionen', fr: 'Outils et fonctionnalités' },
    items: [
      {
        q: {
          en: 'What AI model powers the tools?',
          tr: 'Araçları hangi AI modeli güçlendiriyor?',
          ru: 'Какая модель ИИ используется?',
          de: 'Welches KI-Modell wird verwendet?',
          fr: 'Quel modèle d\'IA est utilisé?'
        },
        a: {
          en: 'We use the latest Llama 3.3 70B model via Groq for lightning-fast responses. This ensures high-quality, contextually relevant outputs for all your content needs.',
          tr: 'Yıldırım hızında yanıtlar için Groq üzerinden en son Llama 3.3 70B modelini kullanıyoruz. Bu, tüm içerik ihtiyaçlarınız için yüksek kaliteli, bağlamsal olarak alakalı çıktılar sağlar.',
          ru: 'Мы используем модель Llama 3.3 70B через Groq для молниеносных ответов высокого качества.',
          de: 'Wir nutzen das neueste Llama 3.3 70B Modell via Groq für blitzschnelle Antworten.',
          fr: 'Nous utilisons le dernier modèle Llama 3.3 70B via Groq pour des réponses ultra-rapides.'
        }
      },
      {
        q: {
          en: 'Can I use the generated content commercially?',
          tr: 'Oluşturulan içeriği ticari olarak kullanabilir miyim?',
          ru: 'Можно ли использовать контент коммерчески?',
          de: 'Kann ich den generierten Inhalt kommerziell nutzen?',
          fr: 'Puis-je utiliser le contenu généré commercialement?'
        },
        a: {
          en: 'Yes! All content generated by MediaToolKit is yours to use however you want, including for commercial purposes. There are no restrictions on how you use your generated content.',
          tr: 'Evet! MediaToolKit tarafından oluşturulan tüm içerikler, ticari amaçlar dahil istediğiniz gibi kullanmanız için sizindir. Oluşturulan içeriğinizi nasıl kullandığınıza dair herhangi bir kısıtlama yoktur.',
          ru: 'Да! Весь контент, созданный MediaToolKit, принадлежит вам и может использоваться коммерчески без ограничений.',
          de: 'Ja! Alle von MediaToolKit generierten Inhalte gehören Ihnen und können kommerziell genutzt werden.',
          fr: 'Oui! Tout le contenu généré par MediaToolKit vous appartient et peut être utilisé commercialement sans restrictions.'
        }
      },
      {
        q: {
          en: 'Which tool should I start with?',
          tr: 'Hangi araçla başlamalıyım?',
          ru: 'С какого инструмента начать?',
          de: 'Mit welchem Tool sollte ich beginnen?',
          fr: 'Par quel outil dois-je commencer?'
        },
        a: {
          en: 'We recommend starting with the Hook Generator (3 credits) to create attention-grabbing openings for your content. Then try the Viral Analyzer to understand what makes content go viral in your niche.',
          tr: 'İçeriğiniz için dikkat çekici açılışlar oluşturmak üzere Hook Generator (3 kredi) ile başlamanızı öneririz. Ardından nişinizde içeriğin neden viral olduğunu anlamak için Viral Analyzer\'ı deneyin.',
          ru: 'Рекомендуем начать с Hook Generator (3 кредита) для создания цепляющих вступлений. Затем попробуйте Viral Analyzer.',
          de: 'Wir empfehlen, mit dem Hook Generator (3 Credits) zu beginnen. Dann probieren Sie den Viral Analyzer.',
          fr: 'Nous recommandons de commencer par le Hook Generator (3 crédits), puis d\'essayer le Viral Analyzer.'
        }
      }
    ]
  },
  {
    category: { en: 'Account & Support', tr: 'Hesap & Destek', ru: 'Аккаунт и поддержка', de: 'Konto & Support', fr: 'Compte et support' },
    items: [
      {
        q: {
          en: 'How do I cancel my subscription?',
          tr: 'Aboneliğimi nasıl iptal ederim?',
          ru: 'Как отменить подписку?',
          de: 'Wie kündige ich mein Abo?',
          fr: 'Comment annuler mon abonnement?'
        },
        a: {
          en: 'You can cancel your subscription anytime from your account settings. Your access will continue until the end of your billing period. No questions asked, no hidden fees.',
          tr: 'Aboneliğinizi hesap ayarlarınızdan istediğiniz zaman iptal edebilirsiniz. Erişiminiz fatura döneminizin sonuna kadar devam eder. Soru sorulmaz, gizli ücret yoktur.',
          ru: 'Вы можете отменить подписку в любое время в настройках аккаунта. Доступ сохранится до конца оплаченного периода.',
          de: 'Sie können Ihr Abo jederzeit in den Kontoeinstellungen kündigen. Der Zugang bleibt bis zum Ende des Abrechnungszeitraums.',
          fr: 'Vous pouvez annuler à tout moment dans les paramètres du compte. L\'accès reste actif jusqu\'à la fin de la période de facturation.'
        }
      },
      {
        q: {
          en: 'Is my data safe?',
          tr: 'Verilerim güvende mi?',
          ru: 'Мои данные в безопасности?',
          de: 'Sind meine Daten sicher?',
          fr: 'Mes données sont-elles sécurisées?'
        },
        a: {
          en: 'Absolutely. We use industry-standard encryption and never share your data with third parties. Your content and account information are protected with the highest security standards.',
          tr: 'Kesinlikle. Endüstri standardı şifreleme kullanıyoruz ve verilerinizi asla üçüncü taraflarla paylaşmıyoruz. İçeriğiniz ve hesap bilgileriniz en yüksek güvenlik standartlarıyla korunmaktadır.',
          ru: 'Абсолютно. Мы используем шифрование отраслевого стандарта и никогда не передаём ваши данные третьим лицам.',
          de: 'Absolut. Wir verwenden Industriestandard-Verschlüsselung und teilen Ihre Daten niemals mit Dritten.',
          fr: 'Absolument. Nous utilisons un chiffrement standard et ne partageons jamais vos données avec des tiers.'
        }
      }
    ]
  }
]

export default function FAQPage() {
  const { language } = useLanguage()
  const t = texts[language] || texts.en
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg">MediaToolKit</span>
          </Link>
          <Link href="/dashboard" className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition">
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-gray-400">{t.subtitle}</p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-xl font-semibold mb-4 text-purple-400">
                {section.category[language as keyof typeof section.category] || section.category.en}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const id = `${sectionIndex}-${itemIndex}`
                  const isOpen = openItems[id]
                  
                  return (
                    <div 
                      key={id} 
                      className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
                      >
                        <span className="font-medium pr-4">
                          {item.q[language as keyof typeof item.q] || item.q.en}
                        </span>
                        <span className={`text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-gray-400 leading-relaxed">
                          {item.a[language as keyof typeof item.a] || item.a.en}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">{t.stillQuestions}</h3>
            <p className="text-gray-400 mb-4">support@mediatoolkit.site</p>
            <Link 
              href="mailto:support@mediatoolkit.site"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition"
            >
              {t.contactUs}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          © 2025 MediaToolKit. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
