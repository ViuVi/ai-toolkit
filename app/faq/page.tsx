'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import Footer from '@/components/Footer'

const headerTexts: Record<string, Record<string, string>> = {
  en: { home: 'Home', dashboard: 'Dashboard' },
  tr: { home: 'Ana Sayfa', dashboard: 'Dashboard' },
  ru: { home: 'Главная', dashboard: 'Панель' },
  de: { home: 'Startseite', dashboard: 'Dashboard' },
  fr: { home: 'Accueil', dashboard: 'Tableau de bord' }
}

const content: Record<string, any> = {
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions about MediaToolkit',
    categories: [
      {
        name: 'Getting Started',
        icon: '🚀',
        questions: [
          { q: 'What is MediaToolkit?', a: 'MediaToolkit is an AI-powered platform with 16+ tools designed to help content creators generate viral hooks, scripts, captions, and more. It uses advanced AI to help you create engaging content faster.' },
          { q: 'How do I create an account?', a: 'Simply click "Get Started" on our homepage and sign up with your email or Google account. You\'ll receive 100 free credits immediately to start creating content.' },
          { q: 'Is MediaToolkit free to use?', a: 'Yes! We offer a free plan with 100 credits per month and access to all 16 tools. You can also watch ads to earn additional credits. Paid plans offer more credits and additional features.' },
          { q: 'What platforms does MediaToolkit support?', a: 'MediaToolkit works in any modern web browser. The content you create can be used on any platform including TikTok, Instagram, YouTube, Twitter/X, LinkedIn, and more.' }
        ]
      },
      {
        name: 'Credits & Billing',
        icon: '💳',
        questions: [
          { q: 'How do credits work?', a: 'Each tool uses a certain number of credits when you generate content. Free users get 100 credits/month, Pro users get 1000 credits/month, and Agency users get unlimited credits.' },
          { q: 'How can I earn more credits?', a: 'You can earn additional credits by: 1) Watching short ads (+10 credits), 2) Referring friends (+100 credits for both), 3) Upgrading to a paid plan.' },
          { q: 'Do unused credits roll over?', a: 'No, unused credits do not roll over to the next month. Your credit balance resets at the beginning of each billing cycle.' },
          { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, and PayPal through our secure payment processor Lemon Squeezy.' },
          { q: 'Can I get a refund?', a: 'Yes, we offer refunds within 7 days of purchase if you\'re not satisfied. Contact our support team to request a refund.' }
        ]
      },
      {
        name: 'Tools & Features',
        icon: '🛠️',
        questions: [
          { q: 'What tools are included?', a: 'MediaToolkit includes 16 AI tools: Hook Generator, Caption Generator, Script Studio, Video Finder, Trend Radar, Steal This Video, Content Planner, Viral Analyzer, Hashtag Research, Competitor Spy, A/B Tester, Carousel Planner, Thread Composer, Engagement Booster, Posting Optimizer, and Content Repurposer.' },
          { q: 'How accurate is the AI?', a: 'Our AI is trained on millions of viral content pieces and continuously improves. While results are highly optimized for engagement, we recommend reviewing and personalizing the output to match your brand voice.' },
          { q: 'Can I use the generated content commercially?', a: 'Yes! All content generated through MediaToolkit can be used freely for personal and commercial purposes without attribution.' },
          { q: 'What languages are supported?', a: 'Our interface supports 5 languages (English, Turkish, Russian, German, French). The AI can generate content in many more languages based on your input.' }
        ]
      },
      {
        name: 'Account & Security',
        icon: '🔒',
        questions: [
          { q: 'How do I delete my account?', a: 'You can delete your account from Dashboard → Settings → Delete Account. This will permanently remove all your data. Contact support if you need help.' },
          { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption (SSL/TLS) for all data transfers. We never sell your personal information to third parties.' },
          { q: 'Can I change my email address?', a: 'Currently, email changes require contacting our support team. We\'re working on adding this feature to the dashboard.' },
          { q: 'What happens if I forget my password?', a: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a link to reset your password.' }
        ]
      }
    ],
    contact: {
      title: 'Still have questions?',
      subtitle: 'Our support team is here to help',
      button: 'Contact Support'
    }
  },
  tr: {
    title: 'Sıkça Sorulan Sorular',
    subtitle: 'MediaToolkit hakkında sık sorulan soruların cevapları',
    categories: [
      {
        name: 'Başlarken',
        icon: '🚀',
        questions: [
          { q: 'MediaToolkit nedir?', a: 'MediaToolkit, içerik üreticilerinin viral hook, script, caption ve daha fazlasını oluşturmasına yardımcı olmak için tasarlanmış 16+ araç içeren AI destekli bir platformdur.' },
          { q: 'Nasıl hesap oluştururum?', a: 'Ana sayfamızda "Başla" butonuna tıklayın ve e-posta veya Google hesabınızla kaydolun. İçerik oluşturmaya başlamak için hemen 100 ücretsiz kredi alacaksınız.' },
          { q: 'MediaToolkit ücretsiz mi?', a: 'Evet! Ayda 100 kredi ve tüm 16 araca erişim içeren ücretsiz bir plan sunuyoruz. Ayrıca ek kredi kazanmak için reklam izleyebilirsiniz.' },
          { q: 'MediaToolkit hangi platformları destekliyor?', a: 'MediaToolkit herhangi bir modern web tarayıcısında çalışır. Oluşturduğunuz içerik TikTok, Instagram, YouTube, Twitter/X, LinkedIn ve daha fazlası dahil herhangi bir platformda kullanılabilir.' }
        ]
      },
      {
        name: 'Krediler ve Faturalandırma',
        icon: '💳',
        questions: [
          { q: 'Krediler nasıl çalışır?', a: 'Her araç, içerik oluşturduğunuzda belirli sayıda kredi kullanır. Ücretsiz kullanıcılar ayda 100, Pro kullanıcılar ayda 1000, Agency kullanıcılar sınırsız kredi alır.' },
          { q: 'Nasıl daha fazla kredi kazanabilirim?', a: 'Ek kredi kazanabilirsiniz: 1) Kısa reklamlar izleyerek (+10 kredi), 2) Arkadaşlarınızı davet ederek (her ikisi için +100 kredi), 3) Ücretli plana yükselterek.' },
          { q: 'Kullanılmayan krediler bir sonraki aya aktarılır mı?', a: 'Hayır, kullanılmayan krediler bir sonraki aya aktarılmaz. Kredi bakiyeniz her fatura döneminin başında sıfırlanır.' },
          { q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', a: 'Güvenli ödeme işlemcimiz Lemon Squeezy aracılığıyla tüm büyük kredi kartlarını, banka kartlarını ve PayPal\'ı kabul ediyoruz.' },
          { q: 'İade alabilir miyim?', a: 'Evet, memnun kalmazsanız satın alma tarihinden itibaren 7 gün içinde iade sunuyoruz. İade talep etmek için destek ekibimizle iletişime geçin.' }
        ]
      },
      {
        name: 'Araçlar ve Özellikler',
        icon: '🛠️',
        questions: [
          { q: 'Hangi araçlar dahil?', a: 'MediaToolkit 16 AI aracı içerir: Hook Generator, Caption Generator, Script Studio, Video Finder, Trend Radar, Steal This Video, Content Planner, Viral Analyzer, Hashtag Research, Competitor Spy, A/B Tester, Carousel Planner, Thread Composer, Engagement Booster, Posting Optimizer ve Content Repurposer.' },
          { q: 'AI ne kadar doğru?', a: 'AI\'mız milyonlarca viral içerik üzerinde eğitilmiştir ve sürekli gelişmektedir. Sonuçlar yüksek etkileşim için optimize edilmiş olsa da, çıktıyı marka sesinize uyacak şekilde incelemenizi ve kişiselleştirmenizi öneririz.' },
          { q: 'Oluşturulan içeriği ticari olarak kullanabilir miyim?', a: 'Evet! MediaToolkit aracılığıyla oluşturulan tüm içerikler, atıf gerektirmeden kişisel ve ticari amaçlarla serbestçe kullanılabilir.' },
          { q: 'Hangi diller destekleniyor?', a: 'Arayüzümüz 5 dili destekler (İngilizce, Türkçe, Rusça, Almanca, Fransızca). AI, girdinize göre çok daha fazla dilde içerik oluşturabilir.' }
        ]
      },
      {
        name: 'Hesap ve Güvenlik',
        icon: '🔒',
        questions: [
          { q: 'Hesabımı nasıl silerim?', a: 'Hesabınızı Dashboard → Ayarlar → Hesabı Sil bölümünden silebilirsiniz. Bu, tüm verilerinizi kalıcı olarak kaldıracaktır. Yardıma ihtiyacınız varsa destek ile iletişime geçin.' },
          { q: 'Verilerim güvende mi?', a: 'Evet, tüm veri aktarımları için endüstri standardı şifreleme (SSL/TLS) kullanıyoruz. Kişisel bilgilerinizi asla üçüncü taraflara satmıyoruz.' },
          { q: 'E-posta adresimi değiştirebilir miyim?', a: 'Şu anda e-posta değişiklikleri destek ekibimizle iletişim gerektirir. Bu özelliği kontrol paneline eklemeye çalışıyoruz.' },
          { q: 'Şifremi unutursam ne olur?', a: 'Giriş sayfasında "Şifremi Unuttum" seçeneğine tıklayın ve e-postanızı girin. Şifrenizi sıfırlamak için bir link alacaksınız.' }
        ]
      }
    ],
    contact: {
      title: 'Hala sorunuz mu var?',
      subtitle: 'Destek ekibimiz yardımcı olmak için burada',
      button: 'Destek ile İletişim'
    }
  },
  ru: {
    title: 'Часто задаваемые вопросы',
    subtitle: 'Найдите ответы на распространенные вопросы о MediaToolkit',
    categories: [
      {
        name: 'Начало работы',
        icon: '🚀',
        questions: [
          { q: 'Что такое MediaToolkit?', a: 'MediaToolkit - это платформа с ИИ, включающая 16+ инструментов для создателей контента для генерации вирусных хуков, скриптов, подписей и многого другого.' },
          { q: 'Как создать аккаунт?', a: 'Нажмите "Начать" на главной странице и зарегистрируйтесь через email или Google. Вы сразу получите 100 бесплатных кредитов.' },
          { q: 'MediaToolkit бесплатный?', a: 'Да! Мы предлагаем бесплатный план со 100 кредитами в месяц и доступом ко всем 16 инструментам.' },
          { q: 'Какие платформы поддерживаются?', a: 'MediaToolkit работает в любом современном браузере. Контент можно использовать на TikTok, Instagram, YouTube, Twitter/X, LinkedIn и других.' }
        ]
      },
      {
        name: 'Кредиты и оплата',
        icon: '💳',
        questions: [
          { q: 'Как работают кредиты?', a: 'Каждый инструмент использует определенное количество кредитов. Бесплатно: 100/месяц, Pro: 1000/месяц, Agency: безлимит.' },
          { q: 'Как заработать больше кредитов?', a: '1) Просмотр рекламы (+10), 2) Приглашение друзей (+100 обоим), 3) Платная подписка.' },
          { q: 'Кредиты переносятся?', a: 'Нет, неиспользованные кредиты не переносятся на следующий месяц.' },
          { q: 'Какие способы оплаты?', a: 'Принимаем карты и PayPal через Lemon Squeezy.' },
          { q: 'Можно ли вернуть деньги?', a: 'Да, возврат в течение 7 дней после покупки.' }
        ]
      },
      {
        name: 'Инструменты',
        icon: '🛠️',
        questions: [
          { q: 'Какие инструменты включены?', a: '16 ИИ-инструментов: Hook Generator, Caption Generator, Script Studio, Video Finder, Trend Radar и другие.' },
          { q: 'Насколько точен ИИ?', a: 'Наш ИИ обучен на миллионах вирусных материалов и постоянно улучшается.' },
          { q: 'Можно использовать контент коммерчески?', a: 'Да! Весь контент можно использовать без ограничений.' },
          { q: 'Какие языки поддерживаются?', a: 'Интерфейс на 5 языках. ИИ может генерировать на многих языках.' }
        ]
      },
      {
        name: 'Аккаунт и безопасность',
        icon: '🔒',
        questions: [
          { q: 'Как удалить аккаунт?', a: 'Dashboard → Настройки → Удалить аккаунт. Это удалит все данные.' },
          { q: 'Мои данные в безопасности?', a: 'Да, используем SSL/TLS шифрование. Не продаем данные третьим лицам.' },
          { q: 'Можно изменить email?', a: 'Сейчас требуется обращение в поддержку.' },
          { q: 'Забыл пароль?', a: 'Нажмите "Забыли пароль" на странице входа.' }
        ]
      }
    ],
    contact: {
      title: 'Остались вопросы?',
      subtitle: 'Наша поддержка готова помочь',
      button: 'Связаться с поддержкой'
    }
  },
  de: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Finden Sie Antworten auf häufige Fragen zu MediaToolkit',
    categories: [
      {
        name: 'Erste Schritte',
        icon: '🚀',
        questions: [
          { q: 'Was ist MediaToolkit?', a: 'MediaToolkit ist eine KI-Plattform mit 16+ Tools für Content-Ersteller.' },
          { q: 'Wie erstelle ich ein Konto?', a: 'Klicken Sie auf "Starten" und registrieren Sie sich. Sie erhalten sofort 100 kostenlose Credits.' },
          { q: 'Ist MediaToolkit kostenlos?', a: 'Ja! Wir bieten einen kostenlosen Plan mit 100 Credits/Monat.' },
          { q: 'Welche Plattformen werden unterstützt?', a: 'Funktioniert in jedem Browser. Content für TikTok, Instagram, YouTube usw.' }
        ]
      },
      {
        name: 'Credits & Abrechnung',
        icon: '💳',
        questions: [
          { q: 'Wie funktionieren Credits?', a: 'Jedes Tool verbraucht Credits. Kostenlos: 100/Monat, Pro: 1000/Monat, Agency: unbegrenzt.' },
          { q: 'Wie verdiene ich mehr Credits?', a: '1) Werbung ansehen (+10), 2) Freunde einladen (+100), 3) Upgrade.' },
          { q: 'Werden Credits übertragen?', a: 'Nein, ungenutzte Credits verfallen am Monatsende.' },
          { q: 'Welche Zahlungsmethoden?', a: 'Kreditkarten und PayPal über Lemon Squeezy.' },
          { q: 'Kann ich eine Rückerstattung bekommen?', a: 'Ja, innerhalb von 7 Tagen nach dem Kauf.' }
        ]
      },
      {
        name: 'Tools & Funktionen',
        icon: '🛠️',
        questions: [
          { q: 'Welche Tools sind enthalten?', a: '16 KI-Tools einschließlich Hook Generator, Caption Generator, Script Studio und mehr.' },
          { q: 'Wie genau ist die KI?', a: 'Unsere KI wurde mit Millionen viraler Inhalte trainiert.' },
          { q: 'Kann ich Inhalte kommerziell nutzen?', a: 'Ja! Alle Inhalte können frei genutzt werden.' },
          { q: 'Welche Sprachen?', a: 'Interface in 5 Sprachen. KI generiert in vielen Sprachen.' }
        ]
      },
      {
        name: 'Konto & Sicherheit',
        icon: '🔒',
        questions: [
          { q: 'Wie lösche ich mein Konto?', a: 'Dashboard → Einstellungen → Konto löschen.' },
          { q: 'Sind meine Daten sicher?', a: 'Ja, wir verwenden SSL/TLS-Verschlüsselung.' },
          { q: 'Kann ich meine E-Mail ändern?', a: 'Derzeit über Support-Kontakt.' },
          { q: 'Passwort vergessen?', a: 'Klicken Sie auf "Passwort vergessen" auf der Login-Seite.' }
        ]
      }
    ],
    contact: {
      title: 'Noch Fragen?',
      subtitle: 'Unser Support-Team hilft Ihnen gerne',
      button: 'Support kontaktieren'
    }
  },
  fr: {
    title: 'Questions fréquentes',
    subtitle: 'Trouvez les réponses aux questions courantes sur MediaToolkit',
    categories: [
      {
        name: 'Premiers pas',
        icon: '🚀',
        questions: [
          { q: 'Qu\'est-ce que MediaToolkit?', a: 'MediaToolkit est une plateforme IA avec 16+ outils pour les créateurs de contenu.' },
          { q: 'Comment créer un compte?', a: 'Cliquez sur "Commencer" et inscrivez-vous. Vous recevrez 100 crédits gratuits.' },
          { q: 'MediaToolkit est-il gratuit?', a: 'Oui! Nous offrons un plan gratuit avec 100 crédits/mois.' },
          { q: 'Quelles plateformes sont supportées?', a: 'Fonctionne dans tout navigateur. Contenu pour TikTok, Instagram, YouTube, etc.' }
        ]
      },
      {
        name: 'Crédits & Facturation',
        icon: '💳',
        questions: [
          { q: 'Comment fonctionnent les crédits?', a: 'Chaque outil utilise des crédits. Gratuit: 100/mois, Pro: 1000/mois, Agency: illimité.' },
          { q: 'Comment gagner plus de crédits?', a: '1) Regarder des pubs (+10), 2) Inviter des amis (+100), 3) Mise à niveau.' },
          { q: 'Les crédits sont-ils reportés?', a: 'Non, les crédits non utilisés expirent à la fin du mois.' },
          { q: 'Quels moyens de paiement?', a: 'Cartes et PayPal via Lemon Squeezy.' },
          { q: 'Puis-je être remboursé?', a: 'Oui, dans les 7 jours suivant l\'achat.' }
        ]
      },
      {
        name: 'Outils & Fonctionnalités',
        icon: '🛠️',
        questions: [
          { q: 'Quels outils sont inclus?', a: '16 outils IA dont Hook Generator, Caption Generator, Script Studio et plus.' },
          { q: 'L\'IA est-elle précise?', a: 'Notre IA est entraînée sur des millions de contenus viraux.' },
          { q: 'Puis-je utiliser le contenu commercialement?', a: 'Oui! Tout le contenu peut être utilisé librement.' },
          { q: 'Quelles langues?', a: 'Interface en 5 langues. L\'IA génère dans plusieurs langues.' }
        ]
      },
      {
        name: 'Compte & Sécurité',
        icon: '🔒',
        questions: [
          { q: 'Comment supprimer mon compte?', a: 'Dashboard → Paramètres → Supprimer le compte.' },
          { q: 'Mes données sont-elles sécurisées?', a: 'Oui, nous utilisons le chiffrement SSL/TLS.' },
          { q: 'Puis-je changer mon email?', a: 'Actuellement via le support.' },
          { q: 'Mot de passe oublié?', a: 'Cliquez sur "Mot de passe oublié" sur la page de connexion.' }
        ]
      }
    ],
    contact: {
      title: 'Encore des questions?',
      subtitle: 'Notre équipe est là pour vous aider',
      button: 'Contacter le support'
    }
  }
}

export default function FAQPage() {
  const { language, setLanguage } = useLanguage()
  const t = content[language] || content.en
  const h = headerTexts[language] || headerTexts.en
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" scroll={false} className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg sm:text-xl font-bold">M</div>
            <span className="text-lg sm:text-xl font-bold hidden sm:block">MediaToolkit</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" scroll={false} className="text-gray-400 hover:text-white transition text-sm">{h.home}</Link>
            <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium hover:opacity-90 transition">{h.dashboard}</Link>
            <div className="relative group">
              <button className="px-2 py-1.5 text-sm text-gray-400 hover:text-white transition">🌐</button>
              <div className="absolute right-0 mt-2 w-28 bg-[#1a1a2e] border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t.title}</h1>
            <p className="text-gray-400 text-lg">{t.subtitle}</p>
          </div>
          
          <div className="space-y-8">
            {t.categories.map((category: any, catIndex: number) => (
              <div key={catIndex} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  {category.name}
                </h2>
                
                <div className="space-y-3">
                  {category.questions.map((item: any, qIndex: number) => {
                    const key = `${catIndex}-${qIndex}`
                    const isOpen = openItems[key]
                    
                    return (
                      <div key={qIndex} className="border border-white/5 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-white/[0.02] transition"
                        >
                          <span className="font-medium pr-4">{item.q}</span>
                          <span className={`text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                        
                        {isOpen && (
                          <div className="px-4 pb-4 text-gray-400 leading-relaxed">
                            {item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Contact CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-white/5 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-2">{t.contact.title}</h3>
            <p className="text-gray-400 mb-6">{t.contact.subtitle}</p>
            <a href="/contact" className="inline-flex px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition">
              {t.contact.button}
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
