// Multi-language translations

export type Language = 'en' | 'tr' | 'ru' | 'de' | 'fr'

interface TranslationData {
  common: {
    loading: string
    error: string
    success: string
    copy: string
    copied: string
    generate: string
    credits: string
    back: string
    backToDashboard: string
    close: string
  }
  nav: {
    features: string
    pricing: string
    faq: string
    login: string
    signup: string
    dashboard: string
    logout: string
  }
  hero: {
    badge: string
    title: string
    titleHighlight: string
    subtitle: string
    cta: string
    ctaSecondary: string
    stats: {
      users: string
      tools: string
      requests: string
    }
  }
  features: {
    title: string
    subtitle: string
    items: Array<{ icon: string; title: string; description: string }>
  }
  howItWorks: {
    title: string
    subtitle: string
    steps: Array<{ number: string; title: string; description: string }>
  }
  pricing: {
    title: string
    subtitle: string
    monthly: string
    yearly: string
    save: string
    plans: {
      free: { name: string; price: string; period: string; description: string; features: string[]; cta: string; popular: boolean }
      starter: { name: string; price: string; period: string; description: string; features: string[]; cta: string; popular: boolean }
      pro: { name: string; price: string; period: string; description: string; features: string[]; cta: string; popular: boolean }
    }
  }
  faq: {
    title: string
    subtitle: string
    items: Array<{ question: string; answer: string }>
  }
  testimonials: {
    title: string
    subtitle: string
    items: Array<{ name: string; role: string; text: string; avatar: string; rating: number }>
  }
  footer: {
    description: string
    product: string
    company: string
    legal: string
    links: {
      features: string
      pricing: string
      api: string
      about: string
      blog: string
      careers: string
      privacy: string
      terms: string
    }
    copyright: string
  }
  dashboard: {
    welcome: string
    credits: string
    searchTools: string
    categories: {
      all: string
      video: string
      content: string
      analysis: string
      optimization: string
      helper: string
    }
    free: string
    new: string
  }
  auth: {
    login: {
      title: string
      subtitle: string
      email: string
      password: string
      button: string
      noAccount: string
      signUp: string
      forgotPassword: string
    }
    register: {
      title: string
      subtitle: string
      name: string
      email: string
      password: string
      button: string
      hasAccount: string
      signIn: string
      terms: string
    }
  }
}

export const translations: Record<Language, TranslationData> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      success: 'Success!',
      copy: 'Copy',
      copied: 'Copied!',
      generate: 'Generate',
      credits: 'credits',
      back: 'Back',
      backToDashboard: '← Back to Dashboard',
      close: 'Close'
    },
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      faq: 'FAQ',
      login: 'Login',
      signup: 'Sign Up',
      dashboard: 'Dashboard',
      logout: 'Logout'
    },
    hero: {
      badge: '🚀 AI-Powered Productivity',
      title: 'Clear Your Mind.',
      titleHighlight: 'Amplify Your Work.',
      subtitle: 'Stop wasting hours on repetitive tasks. Our AI tools help you write better, decide faster, and communicate clearer.',
      cta: 'Start Free',
      ctaSecondary: 'See How It Works',
      stats: { users: '10K+', tools: '17+', requests: '500K+' }
    },
    features: {
      title: 'Tools That Actually Matter',
      subtitle: 'Not just another AI tool. Real solutions for real problems.',
      items: [
        { icon: '⚡', title: 'Save Hours Daily', description: 'Turn one piece of content into 4 platform-ready posts in seconds.' },
        { icon: '💰', title: 'Boost Your Sales', description: 'Analyze and improve your sales copy with proven persuasion frameworks.' },
        { icon: '🎯', title: 'Simplify Complexity', description: 'Transform jargon-filled text into clear, simple language anyone can understand.' },
        { icon: '🛡️', title: 'Prevent Mistakes', description: 'Check your content for errors, bias, and tone issues before publishing.' },
        { icon: '⚖️', title: 'Decide Confidently', description: 'Analyze options with pros and cons to make better decisions.' },
        { icon: '🧘', title: 'Clear Your Thoughts', description: 'Organize chaotic thoughts into structured, actionable clarity.' }
      ]
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Get results in 3 simple steps',
      steps: [
        { number: '1', title: 'Paste Your Content', description: 'Drop in your text, idea, or problem.' },
        { number: '2', title: 'Choose Your Tool', description: 'Select what you need: adapt, analyze, simplify, or decide.' },
        { number: '3', title: 'Get Instant Results', description: 'Receive polished output ready to use immediately.' }
      ]
    },
    pricing: {
      title: 'Simple, Honest Pricing',
      subtitle: 'Start free. Upgrade when you need more.',
      monthly: 'Monthly',
      yearly: 'Yearly',
      save: 'Save 17%',
      plans: {
        free: { name: 'Free', price: '$0', period: '/month', description: 'For getting started', features: ['50 credits/month', 'Basic tools', 'Email support'], cta: 'Start Free', popular: false },
        starter: { name: 'Starter', price: '$2.99', period: '/month', description: 'For hobbyists', features: ['200 credits/month', 'All AI tools', 'Standard support'], cta: 'Get Started', popular: false },
        pro: { name: 'Pro', price: '$4.99', period: '/month', description: 'For professionals', features: ['1000 credits/month', 'All AI tools', 'Priority support', 'No ads'], cta: 'Upgrade to Pro', popular: true }
      }
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know',
      items: [
        { question: 'What are credits?', answer: 'Credits are units used for AI tools. Each tool uses a different amount of credits based on complexity.' },
        { question: 'Can I cancel anytime?', answer: 'Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.' },
        { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, and PayPal.' },
        { question: 'How long is the free plan available?', answer: 'The free plan is available forever. You get 50 credits every month to use our tools.' }
      ]
    },
    testimonials: {
      title: 'What Our Users Say',
      subtitle: 'Thousands of content creators trust us',
      items: [
        { name: 'Sarah K.', role: 'Content Creator', text: 'These tools have cut my content creation time in half!', avatar: '👩‍💼', rating: 5 },
        { name: 'Mike R.', role: 'Social Media Manager', text: 'The hook generator is incredibly effective. My engagement went up 200%.', avatar: '👨‍💻', rating: 5 },
        { name: 'Emma L.', role: 'YouTuber', text: 'Perfect for video scripts. No more spending hours thinking about what to say.', avatar: '👩‍🎤', rating: 5 }
      ]
    },
    footer: {
      description: 'AI tools that actually make your life easier.',
      product: 'Product',
      company: 'Company',
      legal: 'Legal',
      links: { features: 'Features', pricing: 'Pricing', api: 'API', about: 'About', blog: 'Blog', careers: 'Careers', privacy: 'Privacy Policy', terms: 'Terms of Service' },
      copyright: '© 2024 Media Tool Kit. All rights reserved.'
    },
    dashboard: {
      welcome: 'Welcome back',
      credits: 'Credits',
      searchTools: 'Search tools...',
      categories: { all: 'All', video: 'Video', content: 'Content', analysis: 'Analysis', optimization: 'Optimization', helper: 'Helper' },
      free: 'FREE',
      new: 'NEW'
    },
    auth: {
      login: { title: 'Welcome Back', subtitle: 'Sign in to continue', email: 'Email', password: 'Password', button: 'Sign In', noAccount: 'No account yet?', signUp: 'Create one', forgotPassword: 'Forgot password?' },
      register: { title: 'Start Free Today', subtitle: 'No credit card required', name: 'Full Name', email: 'Email', password: 'Password', button: 'Create Account', hasAccount: 'Already have an account?', signIn: 'Sign in', terms: 'By signing up, you agree to our Terms of Service and Privacy Policy.' }
    },
    landing: {
      toolsAvailable: '16 Professional Tools Available',
      heroTitle1: 'Create Viral Content',
      heroTitle2: '10x Faster',
      heroDesc: 'AI-powered content creation toolkit for modern social media managers. From hooks to hashtags, all in one place.',
      startFreeTrial: 'Start Free Trial',
      exploreTools: 'Explore Tools',
      stats: { tools: 'Tools', users: 'Users', contents: 'Contents Created', rating: 'Rating' },
      featuresTitle1: 'Everything You Need to',
      featuresTitle2: ' Go Viral',
      featuresDesc: '16 AI-powered tools designed for modern content creators. Save time, increase engagement, grow your audience.',
      videoTools: 'Video Tools', videoToolsDesc: 'Subtitle generator, script writer and more',
      contentCreation: 'Content Creation', contentCreationDesc: 'Hooks, captions, and platform adapters',
      analytics: 'Analytics', analyticsDesc: 'Competitor analysis, trends, engagement',
      optimization: 'Optimization', optimizationDesc: 'Hashtags, bio generator, QR codes',
      aiPowered: 'AI-Powered', aiPoweredDesc: 'Viral score predictor, brand voice analyzer',
      planning: 'Planning', planningDesc: 'Content calendar, post scheduler',
      toolsTitle1: '16 Powerful Tools', toolsTitle2: 'One Platform',
      toolsDesc: 'Everything you need to create viral content, analyze performance, and grow your social media presence.',
      freeTools: 'Free Tools', noCreditCard: 'No credit card required',
      premiumTools: 'Premium Tools', creditsMonth: 'credits/month',
      ctaTitle: 'Ready to Create Viral Content?',
      ctaDesc: 'Join thousands of content creators using Media Tool Kit to grow their audience.',
      ctaButton: 'Start Creating for Free',
      aboutTitle: 'About Us',
      aboutText1: 'Media Tool Kit is an AI-powered content creation platform developed by a passionate team.',
      aboutText2: 'Our mission is to help content creators save time and create more engaging content.',
      aboutText3: 'Founded in 2024, we serve thousands of creators worldwide.',
      contactTitle: 'Contact', contactEmail: 'Email', contactSocial: 'Social Media'
    }
  },

  tr: {
    common: { loading: 'Yükleniyor...', error: 'Bir hata oluştu', success: 'Başarılı!', copy: 'Kopyala', copied: 'Kopyalandı!', generate: 'Oluştur', credits: 'kredi', back: 'Geri', backToDashboard: '← Panele Dön', close: 'Kapat' },
    nav: { features: 'Özellikler', pricing: 'Fiyatlar', faq: 'SSS', login: 'Giriş', signup: 'Kayıt Ol', dashboard: 'Panel', logout: 'Çıkış' },
    hero: { badge: '🚀 AI Destekli Üretkenlik', title: 'Zihninizi Temizleyin.', titleHighlight: 'İşinizi Güçlendirin.', subtitle: 'Tekrarlayan görevlere saatler harcamayı bırakın. AI araçlarımız daha iyi yazmanıza ve daha hızlı karar vermenize yardımcı olur.', cta: 'Ücretsiz Başla', ctaSecondary: 'Nasıl Çalışır', stats: { users: '10K+', tools: '17+', requests: '500K+' } },
    features: { title: 'Gerçekten Önemli Araçlar', subtitle: 'Sadece başka bir AI aracı değil. Gerçek sorunlar için gerçek çözümler.', items: [
      { icon: '⚡', title: 'Günde Saatler Kazanın', description: 'Tek bir içeriği saniyeler içinde 4 platforma uygun posta dönüştürün.' },
      { icon: '💰', title: 'Satışlarınızı Artırın', description: 'Satış metinlerinizi kanıtlanmış ikna teknikleriyle analiz edin.' },
      { icon: '🎯', title: 'Karmaşıklığı Basitleştirin', description: 'Jargon dolu metni herkesin anlayabileceği dile dönüştürün.' },
      { icon: '🛡️', title: 'Hataları Önleyin', description: 'İçeriğinizi yayınlamadan önce kontrol edin.' },
      { icon: '⚖️', title: 'Güvenle Karar Verin', description: 'Artıları ve eksileriyle seçenekleri analiz edin.' },
      { icon: '🧘', title: 'Düşüncelerinizi Netleştirin', description: 'Kaotik düşünceleri yapılandırılmış netliğe dönüştürün.' }
    ] },
    howItWorks: { title: 'Nasıl Çalışır', subtitle: '3 basit adımda sonuç alın', steps: [
      { number: '1', title: 'İçeriğinizi Yapıştırın', description: 'Metninizi, fikrinizi veya sorununuzu girin.' },
      { number: '2', title: 'Aracınızı Seçin', description: 'İhtiyacınız olanı seçin: uyarla, analiz et, basitleştir.' },
      { number: '3', title: 'Anında Sonuç Alın', description: 'Hemen kullanıma hazır çıktı alın.' }
    ] },
    pricing: { title: 'Basit, Dürüst Fiyatlandırma', subtitle: 'Ücretsiz başlayın. İhtiyacınız olduğunda yükseltin.', monthly: 'Aylık', yearly: 'Yıllık', save: '%17 Tasarruf', plans: {
      free: { name: 'Ücretsiz', price: '$0', period: '/ay', description: 'Başlamak için', features: ['50 kredi/ay', 'Temel araçlar', 'E-posta desteği'], cta: 'Ücretsiz Başla', popular: false },
      starter: { name: 'Başlangıç', price: '$2.99', period: '/ay', description: 'Hobi için', features: ['200 kredi/ay', 'Tüm AI araçları', 'Standart destek'], cta: 'Başla', popular: false },
      pro: { name: 'Pro', price: '$4.99', period: '/ay', description: 'Profesyoneller için', features: ['1000 kredi/ay', 'Tüm AI araçları', 'Öncelikli destek', 'Reklamsız'], cta: 'Pro\'ya Yükselt', popular: true }
    } },
    faq: { title: 'Sıkça Sorulan Sorular', subtitle: 'Bilmeniz gereken her şey', items: [
      { question: 'Krediler nedir?', answer: 'Krediler AI araçları için kullanılan birimlerdir. Her araç farklı miktarda kredi kullanır.' },
      { question: 'İstediğim zaman iptal edebilir miyim?', answer: 'Evet! Aboneliğinizi istediğiniz zaman iptal edebilirsiniz.' },
      { question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', answer: 'Kredi kartı, banka kartı ve PayPal kabul ediyoruz.' },
      { question: 'Ücretsiz plan ne kadar süre geçerli?', answer: 'Ücretsiz plan sonsuza kadar geçerlidir. Her ay 50 kredi alırsınız.' }
    ] },
    testimonials: { title: 'Kullanıcılarımız Ne Diyor', subtitle: 'Binlerce içerik üreticisi bize güveniyor', items: [
      { name: 'Ayşe K.', role: 'İçerik Üreticisi', text: 'Bu araçlar içerik oluşturma süremin yarıya indirdi!', avatar: '👩‍💼', rating: 5 },
      { name: 'Mehmet R.', role: 'Sosyal Medya Yöneticisi', text: 'Hook üretici inanılmaz etkili. Etkileşimim %200 arttı.', avatar: '👨‍💻', rating: 5 },
      { name: 'Elif L.', role: 'YouTuber', text: 'Video scriptleri için mükemmel.', avatar: '👩‍🎤', rating: 5 }
    ] },
    footer: { description: 'Hayatınızı kolaylaştıran AI araçları.', product: 'Ürün', company: 'Şirket', legal: 'Yasal', links: { features: 'Özellikler', pricing: 'Fiyatlar', api: 'API', about: 'Hakkımızda', blog: 'Blog', careers: 'Kariyer', privacy: 'Gizlilik', terms: 'Şartlar' }, copyright: '© 2024 Media Tool Kit. Tüm hakları saklıdır.' },
    dashboard: { welcome: 'Hoş geldin', credits: 'Kredi', searchTools: 'Araç ara...', categories: { all: 'Tümü', video: 'Video', content: 'İçerik', analysis: 'Analiz', optimization: 'Optimizasyon', helper: 'Yardımcı' }, free: 'ÜCRETSİZ', new: 'YENİ' },
    auth: { login: { title: 'Tekrar Hoş Geldin', subtitle: 'Devam etmek için giriş yap', email: 'E-posta', password: 'Şifre', button: 'Giriş Yap', noAccount: 'Hesabın yok mu?', signUp: 'Oluştur', forgotPassword: 'Şifreni mi unuttun?' }, register: { title: 'Bugün Ücretsiz Başla', subtitle: 'Kredi kartı gerekmez', name: 'Ad Soyad', email: 'E-posta', password: 'Şifre', button: 'Hesap Oluştur', hasAccount: 'Zaten hesabın var mı?', signIn: 'Giriş yap', terms: 'Kayıt olarak Kullanım Şartlarını kabul edersiniz.' } },
    landing: {
      toolsAvailable: '16 Profesyonel Araç Mevcut',
      heroTitle1: 'Viral İçerikler Üret',
      heroTitle2: '10x Daha Hızlı',
      heroDesc: 'Modern sosyal medya yöneticileri için yapay zeka destekli içerik oluşturma araç seti. Hook\'lardan hashtag\'lere, hepsi tek yerde.',
      startFreeTrial: 'Ücretsiz Dene',
      exploreTools: 'Araçları Keşfet',
      stats: { tools: 'Araç', users: 'Kullanıcı', contents: 'Oluşturulan İçerik', rating: 'Puan' },
      featuresTitle1: 'Viral Olman İçin',
      featuresTitle2: ' Gereken Her Şey',
      featuresDesc: 'Modern içerik üreticileri için tasarlanmış 16 AI destekli araç. Zamandan tasarruf edin, etkileşimi artırın, kitlenizi büyütün.',
      videoTools: 'Video Araçları', videoToolsDesc: 'Alt yazı ekleme, script yazma ve daha fazlası',
      contentCreation: 'İçerik Üretimi', contentCreationDesc: 'Hook, caption ve platform adaptörleri',
      analytics: 'Analiz', analyticsDesc: 'Rakip analizi, trendler, etkileşim',
      optimization: 'Optimizasyon', optimizationDesc: 'Hashtag, bio oluşturma, QR kod',
      aiPowered: 'Yapay Zeka', aiPoweredDesc: 'Viral tahmin, marka sesi analizi',
      planning: 'Planlama', planningDesc: 'İçerik takvimi, paylaşım planlayıcı',
      toolsTitle1: '16 Güçlü Araç', toolsTitle2: 'Tek Platform',
      toolsDesc: 'Viral içerik oluşturmak, performansı analiz etmek ve sosyal medya varlığınızı büyütmek için ihtiyacınız olan her şey.',
      freeTools: 'Ücretsiz Araçlar', noCreditCard: 'Kredi kartı gerekmez',
      premiumTools: 'Premium Araçlar', creditsMonth: 'kredi/ay',
      ctaTitle: 'Viral İçerik Oluşturmaya Hazır mısın?',
      ctaDesc: 'Kitlelerini büyütmek için Media Tool Kit kullanan binlerce içerik üreticisine katıl.',
      ctaButton: 'Ücretsiz Başla',
      aboutTitle: 'Hakkımızda',
      aboutText1: 'Media Tool Kit, tutkulu bir ekip tarafından geliştirilen yapay zeka destekli içerik oluşturma platformudur.',
      aboutText2: 'Misyonumuz, içerik üreticilerinin zaman kazanmasına ve daha ilgi çekici içerikler oluşturmasına yardımcı olmaktır.',
      aboutText3: '2024 yılında kurulan platformumuz, dünya genelinde binlerce içerik üreticisine hizmet vermektedir.',
      contactTitle: 'İletişim', contactEmail: 'E-posta', contactSocial: 'Sosyal Medya'
    }
  },

  ru: {
    common: { loading: 'Загрузка...', error: 'Произошла ошибка', success: 'Успешно!', copy: 'Копировать', copied: 'Скопировано!', generate: 'Создать', credits: 'кредитов', back: 'Назад', backToDashboard: '← Назад к панели', close: 'Закрыть' },
    nav: { features: 'Функции', pricing: 'Цены', faq: 'FAQ', login: 'Вход', signup: 'Регистрация', dashboard: 'Панель', logout: 'Выход' },
    hero: { badge: '🚀 AI Продуктивность', title: 'Освободите разум.', titleHighlight: 'Усильте работу.', subtitle: 'Перестаньте тратить часы на рутину. Наши AI-инструменты помогут писать лучше.', cta: 'Начать бесплатно', ctaSecondary: 'Как это работает', stats: { users: '10K+', tools: '17+', requests: '500K+' } },
    features: { title: 'Инструменты, которые важны', subtitle: 'Реальные решения для реальных проблем.', items: [
      { icon: '⚡', title: 'Экономьте часы', description: 'Превратите контент в 4 поста за секунды.' },
      { icon: '💰', title: 'Увеличьте продажи', description: 'Анализируйте продающие тексты.' },
      { icon: '🎯', title: 'Упростите сложное', description: 'Превратите жаргон в понятный язык.' },
      { icon: '🛡️', title: 'Избегайте ошибок', description: 'Проверяйте контент перед публикацией.' },
      { icon: '⚖️', title: 'Решайте уверенно', description: 'Анализируйте варианты.' },
      { icon: '🧘', title: 'Упорядочьте мысли', description: 'Организуйте хаос в структуру.' }
    ] },
    howItWorks: { title: 'Как это работает', subtitle: 'Результат за 3 шага', steps: [
      { number: '1', title: 'Вставьте контент', description: 'Введите текст или идею.' },
      { number: '2', title: 'Выберите инструмент', description: 'Выберите что нужно.' },
      { number: '3', title: 'Получите результат', description: 'Готовый результат.' }
    ] },
    pricing: { title: 'Простые цены', subtitle: 'Начните бесплатно.', monthly: 'Ежемесячно', yearly: 'Ежегодно', save: 'Скидка 17%', plans: {
      free: { name: 'Бесплатно', price: '$0', period: '/мес', description: 'Для начала', features: ['50 кредитов/мес', 'Базовые инструменты', 'Email поддержка'], cta: 'Начать', popular: false },
      starter: { name: 'Стартер', price: '$2.99', period: '/мес', description: 'Для хобби', features: ['200 кредитов/мес', 'Все AI инструменты', 'Стандартная поддержка'], cta: 'Начать', popular: false },
      pro: { name: 'Pro', price: '$4.99', period: '/мес', description: 'Для профессионалов', features: ['1000 кредитов/мес', 'Все AI инструменты', 'Приоритетная поддержка', 'Без рекламы'], cta: 'Перейти на Pro', popular: true }
    } },
    faq: { title: 'Частые вопросы', subtitle: 'Ответы на ваши вопросы', items: [
      { question: 'Что такое кредиты?', answer: 'Кредиты — единицы для использования AI инструментов.' },
      { question: 'Могу отменить?', answer: 'Да! Отмените когда угодно.' },
      { question: 'Способы оплаты?', answer: 'Карты и PayPal.' },
      { question: 'Как долго бесплатный план?', answer: 'Бессрочно. 50 кредитов каждый месяц.' }
    ] },
    testimonials: { title: 'Отзывы', subtitle: 'Тысячи создателей доверяют нам', items: [
      { name: 'Анна К.', role: 'Контент-мейкер', text: 'Эти инструменты сократили время вдвое!', avatar: '👩‍💼', rating: 5 },
      { name: 'Михаил Р.', role: 'SMM', text: 'Генератор хуков невероятен.', avatar: '👨‍💻', rating: 5 },
      { name: 'Елена Л.', role: 'YouTuber', text: 'Идеально для видео скриптов.', avatar: '👩‍🎤', rating: 5 }
    ] },
    footer: { description: 'AI инструменты для жизни.', product: 'Продукт', company: 'Компания', legal: 'Правовая информация', links: { features: 'Функции', pricing: 'Цены', api: 'API', about: 'О нас', blog: 'Блог', careers: 'Карьера', privacy: 'Конфиденциальность', terms: 'Условия' }, copyright: '© 2024 Media Tool Kit.' },
    dashboard: { welcome: 'С возвращением', credits: 'Кредиты', searchTools: 'Поиск...', categories: { all: 'Все', video: 'Видео', content: 'Контент', analysis: 'Анализ', optimization: 'Оптимизация', helper: 'Помощник' }, free: 'БЕСПЛАТНО', new: 'НОВОЕ' },
    auth: { login: { title: 'С возвращением', subtitle: 'Войдите', email: 'Email', password: 'Пароль', button: 'Войти', noAccount: 'Нет аккаунта?', signUp: 'Создать', forgotPassword: 'Забыли пароль?' }, register: { title: 'Начните бесплатно', subtitle: 'Без карты', name: 'Имя', email: 'Email', password: 'Пароль', button: 'Создать', hasAccount: 'Есть аккаунт?', signIn: 'Войти', terms: 'Регистрируясь, вы соглашаетесь с Условиями.' } },
    landing: {
      toolsAvailable: '16 профессиональных инструментов',
      heroTitle1: 'Создавайте вирусный контент',
      heroTitle2: 'в 10 раз быстрее',
      heroDesc: 'Набор инструментов для создания контента на базе ИИ для современных SMM-специалистов.',
      startFreeTrial: 'Попробовать бесплатно',
      exploreTools: 'Изучить инструменты',
      stats: { tools: 'Инструментов', users: 'Пользователей', contents: 'Создано контента', rating: 'Рейтинг' },
      featuresTitle1: 'Всё, что нужно для',
      featuresTitle2: ' вирусного контента',
      featuresDesc: '16 инструментов на базе ИИ для современных создателей контента.',
      videoTools: 'Видео инструменты', videoToolsDesc: 'Субтитры, сценарии и другое',
      contentCreation: 'Создание контента', contentCreationDesc: 'Хуки, подписи и адаптеры',
      analytics: 'Аналитика', analyticsDesc: 'Анализ конкурентов, тренды',
      optimization: 'Оптимизация', optimizationDesc: 'Хэштеги, био, QR-коды',
      aiPowered: 'На базе ИИ', aiPoweredDesc: 'Прогноз виральности',
      planning: 'Планирование', planningDesc: 'Контент-календарь',
      toolsTitle1: '16 мощных инструментов', toolsTitle2: 'Одна платформа',
      toolsDesc: 'Всё для создания вирусного контента и роста в соцсетях.',
      freeTools: 'Бесплатные инструменты', noCreditCard: 'Карта не требуется',
      premiumTools: 'Премиум инструменты', creditsMonth: 'кредитов/мес',
      ctaTitle: 'Готовы создавать вирусный контент?',
      ctaDesc: 'Присоединяйтесь к тысячам создателей контента.',
      ctaButton: 'Начать бесплатно',
      aboutTitle: 'О нас',
      aboutText1: 'Media Tool Kit — платформа для создания контента на базе ИИ.',
      aboutText2: 'Наша миссия — помочь создателям контента экономить время.',
      aboutText3: 'Основанная в 2024 году, мы обслуживаем тысячи создателей.',
      contactTitle: 'Контакты', contactEmail: 'Email', contactSocial: 'Социальные сети'
    }
  },

  de: {
    common: { loading: 'Laden...', error: 'Ein Fehler ist aufgetreten', success: 'Erfolgreich!', copy: 'Kopieren', copied: 'Kopiert!', generate: 'Generieren', credits: 'Credits', back: 'Zurück', backToDashboard: '← Zurück zum Dashboard', close: 'Schließen' },
    nav: { features: 'Funktionen', pricing: 'Preise', faq: 'FAQ', login: 'Anmelden', signup: 'Registrieren', dashboard: 'Dashboard', logout: 'Abmelden' },
    hero: { badge: '🚀 KI-Produktivität', title: 'Klarer Kopf.', titleHighlight: 'Bessere Arbeit.', subtitle: 'Verschwenden Sie keine Stunden mehr mit Routineaufgaben.', cta: 'Kostenlos starten', ctaSecondary: 'So funktioniert es', stats: { users: '10K+', tools: '17+', requests: '500K+' } },
    features: { title: 'Tools die zählen', subtitle: 'Echte Lösungen für echte Probleme.', items: [
      { icon: '⚡', title: 'Stunden sparen', description: 'Verwandeln Sie Inhalt in 4 Posts.' },
      { icon: '💰', title: 'Umsatz steigern', description: 'Analysieren Sie Verkaufstexte.' },
      { icon: '🎯', title: 'Komplexes vereinfachen', description: 'Klare Sprache.' },
      { icon: '🛡️', title: 'Fehler vermeiden', description: 'Prüfen Sie Inhalte.' },
      { icon: '⚖️', title: 'Sicher entscheiden', description: 'Analysieren Sie Optionen.' },
      { icon: '🧘', title: 'Gedanken ordnen', description: 'Organisieren Sie Chaos.' }
    ] },
    howItWorks: { title: 'So funktioniert es', subtitle: 'Ergebnisse in 3 Schritten', steps: [
      { number: '1', title: 'Inhalt einfügen', description: 'Geben Sie Text ein.' },
      { number: '2', title: 'Tool wählen', description: 'Wählen Sie was Sie brauchen.' },
      { number: '3', title: 'Ergebnis erhalten', description: 'Fertiges Ergebnis.' }
    ] },
    pricing: { title: 'Einfache Preise', subtitle: 'Kostenlos starten.', monthly: 'Monatlich', yearly: 'Jährlich', save: '17% sparen', plans: {
      free: { name: 'Kostenlos', price: '$0', period: '/Monat', description: 'Zum Einstieg', features: ['50 Credits/Monat', 'Basis-Tools', 'E-Mail Support'], cta: 'Kostenlos starten', popular: false },
      starter: { name: 'Starter', price: '$2.99', period: '/Monat', description: 'Für Hobbies', features: ['200 Credits/Monat', 'Alle KI-Tools', 'Standard Support'], cta: 'Starten', popular: false },
      pro: { name: 'Pro', price: '$4.99', period: '/Monat', description: 'Für Profis', features: ['1000 Credits/Monat', 'Alle KI-Tools', 'Prioritäts-Support', 'Keine Werbung'], cta: 'Auf Pro upgraden', popular: true }
    } },
    faq: { title: 'Häufige Fragen', subtitle: 'Antworten', items: [
      { question: 'Was sind Credits?', answer: 'Einheiten zur Nutzung von KI-Tools.' },
      { question: 'Kann ich kündigen?', answer: 'Ja! Jederzeit.' },
      { question: 'Zahlungsmethoden?', answer: 'Karten und PayPal.' },
      { question: 'Wie lange kostenlos?', answer: 'Unbegrenzt. 50 Credits monatlich.' }
    ] },
    testimonials: { title: 'Was Nutzer sagen', subtitle: 'Tausende vertrauen uns', items: [
      { name: 'Sarah K.', role: 'Creator', text: 'Diese Tools haben meine Zeit halbiert!', avatar: '👩‍💼', rating: 5 },
      { name: 'Mike R.', role: 'Manager', text: 'Der Hook-Generator ist effektiv.', avatar: '👨‍💻', rating: 5 },
      { name: 'Emma L.', role: 'YouTuber', text: 'Perfekt für Skripte.', avatar: '👩‍🎤', rating: 5 }
    ] },
    footer: { description: 'KI-Tools die das Leben vereinfachen.', product: 'Produkt', company: 'Unternehmen', legal: 'Rechtliches', links: { features: 'Funktionen', pricing: 'Preise', api: 'API', about: 'Über uns', blog: 'Blog', careers: 'Karriere', privacy: 'Datenschutz', terms: 'AGB' }, copyright: '© 2024 Media Tool Kit.' },
    dashboard: { welcome: 'Willkommen', credits: 'Credits', searchTools: 'Suchen...', categories: { all: 'Alle', video: 'Video', content: 'Inhalt', analysis: 'Analyse', optimization: 'Optimierung', helper: 'Helfer' }, free: 'KOSTENLOS', new: 'NEU' },
    auth: { login: { title: 'Willkommen zurück', subtitle: 'Anmelden', email: 'E-Mail', password: 'Passwort', button: 'Anmelden', noAccount: 'Kein Konto?', signUp: 'Erstellen', forgotPassword: 'Passwort vergessen?' }, register: { title: 'Kostenlos starten', subtitle: 'Keine Karte nötig', name: 'Name', email: 'E-Mail', password: 'Passwort', button: 'Konto erstellen', hasAccount: 'Bereits ein Konto?', signIn: 'Anmelden', terms: 'Mit der Registrierung stimmen Sie den Nutzungsbedingungen zu.' } },
    landing: {
      toolsAvailable: '16 professionelle Werkzeuge verfügbar',
      heroTitle1: 'Viralen Content erstellen',
      heroTitle2: '10x schneller',
      heroDesc: 'KI-gestütztes Content-Erstellungs-Toolkit für moderne Social-Media-Manager.',
      startFreeTrial: 'Kostenlos testen',
      exploreTools: 'Werkzeuge erkunden',
      stats: { tools: 'Werkzeuge', users: 'Benutzer', contents: 'Erstellte Inhalte', rating: 'Bewertung' },
      featuresTitle1: 'Alles was Sie brauchen um',
      featuresTitle2: ' viral zu gehen',
      featuresDesc: '16 KI-gestützte Werkzeuge für moderne Content-Ersteller.',
      videoTools: 'Video-Werkzeuge', videoToolsDesc: 'Untertitel, Skripte und mehr',
      contentCreation: 'Content-Erstellung', contentCreationDesc: 'Hooks, Captions und Adapter',
      analytics: 'Analytik', analyticsDesc: 'Wettbewerbsanalyse, Trends',
      optimization: 'Optimierung', optimizationDesc: 'Hashtags, Bio, QR-Codes',
      aiPowered: 'KI-gestützt', aiPoweredDesc: 'Viral-Score-Prognose',
      planning: 'Planung', planningDesc: 'Content-Kalender',
      toolsTitle1: '16 leistungsstarke Werkzeuge', toolsTitle2: 'Eine Plattform',
      toolsDesc: 'Alles für viralen Content und Social-Media-Wachstum.',
      freeTools: 'Kostenlose Werkzeuge', noCreditCard: 'Keine Kreditkarte erforderlich',
      premiumTools: 'Premium-Werkzeuge', creditsMonth: 'Credits/Monat',
      ctaTitle: 'Bereit für viralen Content?',
      ctaDesc: 'Schließen Sie sich Tausenden von Content-Erstellern an.',
      ctaButton: 'Kostenlos starten',
      aboutTitle: 'Über uns',
      aboutText1: 'Media Tool Kit ist eine KI-gestützte Content-Erstellungsplattform.',
      aboutText2: 'Unsere Mission ist es, Content-Erstellern Zeit zu sparen.',
      aboutText3: 'Gegründet 2024, bedienen wir Tausende von Erstellern.',
      contactTitle: 'Kontakt', contactEmail: 'E-Mail', contactSocial: 'Soziale Medien'
    }
  },

  fr: {
    common: { loading: 'Chargement...', error: 'Une erreur est survenue', success: 'Succès!', copy: 'Copier', copied: 'Copié!', generate: 'Générer', credits: 'crédits', back: 'Retour', backToDashboard: '← Retour au tableau de bord', close: 'Fermer' },
    nav: { features: 'Fonctionnalités', pricing: 'Tarifs', faq: 'FAQ', login: 'Connexion', signup: 'Inscription', dashboard: 'Tableau de bord', logout: 'Déconnexion' },
    hero: { badge: '🚀 Productivité IA', title: 'Libérez votre esprit.', titleHighlight: 'Amplifiez votre travail.', subtitle: 'Arrêtez de perdre des heures sur des tâches répétitives.', cta: 'Commencer gratuitement', ctaSecondary: 'Comment ça marche', stats: { users: '10K+', tools: '17+', requests: '500K+' } },
    features: { title: 'Des outils qui comptent', subtitle: 'De vraies solutions pour de vrais problèmes.', items: [
      { icon: '⚡', title: 'Gagnez des heures', description: 'Transformez un contenu en 4 posts.' },
      { icon: '💰', title: 'Boostez vos ventes', description: 'Analysez vos textes.' },
      { icon: '🎯', title: 'Simplifiez le complexe', description: 'Langage clair.' },
      { icon: '🛡️', title: 'Évitez les erreurs', description: 'Vérifiez le contenu.' },
      { icon: '⚖️', title: 'Décidez sereinement', description: 'Analysez les options.' },
      { icon: '🧘', title: 'Clarifiez vos pensées', description: 'Organisez le chaos.' }
    ] },
    howItWorks: { title: 'Comment ça marche', subtitle: 'Résultats en 3 étapes', steps: [
      { number: '1', title: 'Collez votre contenu', description: 'Entrez votre texte.' },
      { number: '2', title: 'Choisissez l\'outil', description: 'Sélectionnez ce dont vous avez besoin.' },
      { number: '3', title: 'Obtenez le résultat', description: 'Résultat prêt à l\'emploi.' }
    ] },
    pricing: { title: 'Tarifs simples', subtitle: 'Commencez gratuitement.', monthly: 'Mensuel', yearly: 'Annuel', save: '17% d\'économie', plans: {
      free: { name: 'Gratuit', price: '$0', period: '/mois', description: 'Pour commencer', features: ['50 crédits/mois', 'Outils de base', 'Support email'], cta: 'Commencer', popular: false },
      starter: { name: 'Starter', price: '$2.99', period: '/mois', description: 'Pour les hobbies', features: ['200 crédits/mois', 'Tous les outils IA', 'Support standard'], cta: 'Commencer', popular: false },
      pro: { name: 'Pro', price: '$4.99', period: '/mois', description: 'Pour les pros', features: ['1000 crédits/mois', 'Tous les outils IA', 'Support prioritaire', 'Sans publicité'], cta: 'Passer à Pro', popular: true }
    } },
    faq: { title: 'Questions fréquentes', subtitle: 'Réponses', items: [
      { question: 'Que sont les crédits?', answer: 'Unités pour utiliser les outils IA.' },
      { question: 'Puis-je annuler?', answer: 'Oui! À tout moment.' },
      { question: 'Modes de paiement?', answer: 'Cartes et PayPal.' },
      { question: 'Durée du plan gratuit?', answer: 'Illimité. 50 crédits par mois.' }
    ] },
    testimonials: { title: 'Ce que disent nos utilisateurs', subtitle: 'Des milliers nous font confiance', items: [
      { name: 'Sarah K.', role: 'Créatrice', text: 'Ces outils ont réduit mon temps de moitié!', avatar: '👩‍💼', rating: 5 },
      { name: 'Mike R.', role: 'Manager', text: 'Le générateur de hooks est efficace.', avatar: '👨‍💻', rating: 5 },
      { name: 'Emma L.', role: 'YouTuber', text: 'Parfait pour les scripts.', avatar: '👩‍🎤', rating: 5 }
    ] },
    footer: { description: 'Outils IA qui simplifient la vie.', product: 'Produit', company: 'Entreprise', legal: 'Mentions légales', links: { features: 'Fonctionnalités', pricing: 'Tarifs', api: 'API', about: 'À propos', blog: 'Blog', careers: 'Carrières', privacy: 'Confidentialité', terms: 'CGU' }, copyright: '© 2024 Media Tool Kit.' },
    dashboard: { welcome: 'Bon retour', credits: 'Crédits', searchTools: 'Rechercher...', categories: { all: 'Tous', video: 'Vidéo', content: 'Contenu', analysis: 'Analyse', optimization: 'Optimisation', helper: 'Assistant' }, free: 'GRATUIT', new: 'NOUVEAU' },
    auth: { login: { title: 'Bon retour', subtitle: 'Connectez-vous', email: 'Email', password: 'Mot de passe', button: 'Se connecter', noAccount: 'Pas de compte?', signUp: 'Créer', forgotPassword: 'Mot de passe oublié?' }, register: { title: 'Commencez gratuitement', subtitle: 'Aucune carte requise', name: 'Nom', email: 'Email', password: 'Mot de passe', button: 'Créer un compte', hasAccount: 'Déjà un compte?', signIn: 'Se connecter', terms: 'En vous inscrivant, vous acceptez nos Conditions.' } },
    landing: {
      toolsAvailable: '16 outils professionnels disponibles',
      heroTitle1: 'Créez du contenu viral',
      heroTitle2: '10x plus vite',
      heroDesc: 'Boîte à outils de création de contenu alimentée par l\'IA pour les gestionnaires de médias sociaux modernes.',
      startFreeTrial: 'Essai gratuit',
      exploreTools: 'Explorer les outils',
      stats: { tools: 'Outils', users: 'Utilisateurs', contents: 'Contenus créés', rating: 'Note' },
      featuresTitle1: 'Tout ce dont vous avez besoin pour',
      featuresTitle2: ' devenir viral',
      featuresDesc: '16 outils alimentés par l\'IA pour les créateurs de contenu modernes.',
      videoTools: 'Outils vidéo', videoToolsDesc: 'Sous-titres, scripts et plus',
      contentCreation: 'Création de contenu', contentCreationDesc: 'Hooks, légendes et adaptateurs',
      analytics: 'Analytique', analyticsDesc: 'Analyse concurrents, tendances',
      optimization: 'Optimisation', optimizationDesc: 'Hashtags, bio, QR codes',
      aiPowered: 'Propulsé par l\'IA', aiPoweredDesc: 'Prédicteur de viralité',
      planning: 'Planification', planningDesc: 'Calendrier de contenu',
      toolsTitle1: '16 outils puissants', toolsTitle2: 'Une plateforme',
      toolsDesc: 'Tout pour créer du contenu viral et grandir sur les réseaux.',
      freeTools: 'Outils gratuits', noCreditCard: 'Pas de carte requise',
      premiumTools: 'Outils Premium', creditsMonth: 'crédits/mois',
      ctaTitle: 'Prêt à créer du contenu viral?',
      ctaDesc: 'Rejoignez des milliers de créateurs de contenu.',
      ctaButton: 'Commencer gratuitement',
      aboutTitle: 'À propos',
      aboutText1: 'Media Tool Kit est une plateforme de création de contenu alimentée par l\'IA.',
      aboutText2: 'Notre mission est d\'aider les créateurs à gagner du temps.',
      aboutText3: 'Fondée en 2024, nous servons des milliers de créateurs.',
      contactTitle: 'Contact', contactEmail: 'Email', contactSocial: 'Réseaux sociaux'
    }
  }
}
