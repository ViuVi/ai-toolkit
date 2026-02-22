// Multi-language translations

export type Language = 'en' | 'tr' | 'ru' | 'de' | 'fr'

export const translations: Record<Language, any> = {
  en: {
    // Common
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
    
    // Navigation
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      faq: 'FAQ',
      login: 'Login',
      signup: 'Sign Up',
      dashboard: 'Dashboard',
      logout: 'Logout'
    },
    
    // Hero Section
    hero: {
      badge: '🚀 AI-Powered Productivity',
      title: 'Clear Your Mind.',
      titleHighlight: 'Amplify Your Work.',
      subtitle: 'Stop wasting hours on repetitive tasks. Our AI tools help you write better, decide faster, and communicate clearer.',
      cta: 'Start Free',
      ctaSecondary: 'See How It Works',
      stats: {
        users: '10K+',
        tools: '17+',
        requests: '500K+'
      }
    },
    
    // Features Section
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
    
    // How It Works
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Get results in 3 simple steps',
      steps: [
        { number: '1', title: 'Paste Your Content', description: 'Drop in your text, idea, or problem.' },
        { number: '2', title: 'Choose Your Tool', description: 'Select what you need: adapt, analyze, simplify, or decide.' },
        { number: '3', title: 'Get Instant Results', description: 'Receive polished output ready to use immediately.' }
      ]
    },
    
    // Pricing
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
    
    // FAQ
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
    
    // Testimonials
    testimonials: {
      title: 'What Our Users Say',
      subtitle: 'Thousands of content creators trust us',
      items: [
        { name: 'Sarah K.', role: 'Content Creator', text: 'These tools have cut my content creation time in half!', avatar: '👩‍💼', rating: 5 },
        { name: 'Mike R.', role: 'Social Media Manager', text: 'The hook generator is incredibly effective. My engagement went up 200%.', avatar: '👨‍💻', rating: 5 },
        { name: 'Emma L.', role: 'YouTuber', text: 'Perfect for video scripts. No more spending hours thinking about what to say.', avatar: '👩‍🎤', rating: 5 }
      ]
    },
    
    // Footer
    footer: {
      description: 'AI tools that actually make your life easier.',
      product: 'Product',
      company: 'Company',
      legal: 'Legal',
      links: { features: 'Features', pricing: 'Pricing', api: 'API', about: 'About', blog: 'Blog', careers: 'Careers', privacy: 'Privacy Policy', terms: 'Terms of Service' },
      copyright: '© 2024 Media Tool Kit. All rights reserved.'
    },
    
    // Dashboard
    dashboard: {
      welcome: 'Welcome back',
      credits: 'Credits',
      searchTools: 'Search tools...',
      categories: { all: 'All', video: 'Video', content: 'Content', analysis: 'Analysis', optimization: 'Optimization', helper: 'Helper' },
      free: 'FREE',
      new: 'NEW'
    },
    
    // Auth
    auth: {
      login: { title: 'Welcome Back', subtitle: 'Sign in to continue', email: 'Email', password: 'Password', button: 'Sign In', noAccount: 'No account yet?', signUp: 'Create one', forgotPassword: 'Forgot password?' },
      register: { title: 'Start Free Today', subtitle: 'No credit card required', name: 'Full Name', email: 'Email', password: 'Password', button: 'Create Account', hasAccount: 'Already have an account?', signIn: 'Sign in', terms: 'By signing up, you agree to our Terms of Service and Privacy Policy.' }
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
    auth: { login: { title: 'Tekrar Hoş Geldin', subtitle: 'Devam etmek için giriş yap', email: 'E-posta', password: 'Şifre', button: 'Giriş Yap', noAccount: 'Hesabın yok mu?', signUp: 'Oluştur', forgotPassword: 'Şifreni mi unuttun?' }, register: { title: 'Bugün Ücretsiz Başla', subtitle: 'Kredi kartı gerekmez', name: 'Ad Soyad', email: 'E-posta', password: 'Şifre', button: 'Hesap Oluştur', hasAccount: 'Zaten hesabın var mı?', signIn: 'Giriş yap', terms: 'Kayıt olarak Kullanım Şartlarını kabul edersiniz.' } }
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
    auth: { login: { title: 'С возвращением', subtitle: 'Войдите', email: 'Email', password: 'Пароль', button: 'Войти', noAccount: 'Нет аккаунта?', signUp: 'Создать', forgotPassword: 'Забыли пароль?' }, register: { title: 'Начните бесплатно', subtitle: 'Без карты', name: 'Имя', email: 'Email', password: 'Пароль', button: 'Создать', hasAccount: 'Есть аккаунт?', signIn: 'Войти', terms: 'Регистрируясь, вы соглашаетесь с Условиями.' } }
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
    auth: { login: { title: 'Willkommen zurück', subtitle: 'Anmelden', email: 'E-Mail', password: 'Passwort', button: 'Anmelden', noAccount: 'Kein Konto?', signUp: 'Erstellen', forgotPassword: 'Passwort vergessen?' }, register: { title: 'Kostenlos starten', subtitle: 'Keine Karte nötig', name: 'Name', email: 'E-Mail', password: 'Passwort', button: 'Konto erstellen', hasAccount: 'Bereits ein Konto?', signIn: 'Anmelden', terms: 'Mit der Registrierung stimmen Sie den Nutzungsbedingungen zu.' } }
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
    auth: { login: { title: 'Bon retour', subtitle: 'Connectez-vous', email: 'Email', password: 'Mot de passe', button: 'Se connecter', noAccount: 'Pas de compte?', signUp: 'Créer', forgotPassword: 'Mot de passe oublié?' }, register: { title: 'Commencez gratuitement', subtitle: 'Aucune carte requise', name: 'Nom', email: 'Email', password: 'Mot de passe', button: 'Créer un compte', hasAccount: 'Déjà un compte?', signIn: 'Se connecter', terms: 'En vous inscrivant, vous acceptez nos Conditions.' } }
  }
}
