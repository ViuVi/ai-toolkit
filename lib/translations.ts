export type Language = 'en' | 'tr' | 'ru' | 'de' | 'fr'

// Ana sayfa çevirileri
export const t = {
  nav: {
    en: { features: 'Features', pricing: 'Pricing', faq: 'FAQ', login: 'Login', signup: 'Sign Up', logout: 'Logout' },
    tr: { features: 'Özellikler', pricing: 'Fiyatlar', faq: 'SSS', login: 'Giriş', signup: 'Kayıt Ol', logout: 'Çıkış' },
    ru: { features: 'Функции', pricing: 'Цены', faq: 'FAQ', login: 'Вход', signup: 'Регистрация', logout: 'Выход' },
    de: { features: 'Funktionen', pricing: 'Preise', faq: 'FAQ', login: 'Anmelden', signup: 'Registrieren', logout: 'Abmelden' },
    fr: { features: 'Fonctionnalités', pricing: 'Tarifs', faq: 'FAQ', login: 'Connexion', signup: 'Inscription', logout: 'Déconnexion' }
  },
  hero: {
    en: { badge: '🚀 AI-Powered', title: 'Clear Your Mind.', highlight: 'Amplify Your Work.', subtitle: 'Stop wasting hours. AI tools help you write better.', cta: 'Start Free', cta2: 'See How It Works' },
    tr: { badge: '🚀 AI Destekli', title: 'Zihninizi Temizleyin.', highlight: 'İşinizi Güçlendirin.', subtitle: 'Saatler harcamayı bırakın. AI araçları size yardımcı olur.', cta: 'Ücretsiz Başla', cta2: 'Nasıl Çalışır' },
    ru: { badge: '🚀 AI', title: 'Освободите разум.', highlight: 'Усильте работу.', subtitle: 'Перестаньте тратить часы. AI поможет вам.', cta: 'Начать бесплатно', cta2: 'Как это работает' },
    de: { badge: '🚀 KI-gestützt', title: 'Klarer Kopf.', highlight: 'Bessere Arbeit.', subtitle: 'Verschwenden Sie keine Stunden mehr.', cta: 'Kostenlos starten', cta2: 'So funktioniert es' },
    fr: { badge: '🚀 IA', title: 'Libérez votre esprit.', highlight: 'Amplifiez votre travail.', subtitle: 'Arrêtez de perdre des heures.', cta: 'Commencer gratuitement', cta2: 'Comment ça marche' }
  },
  features: {
    en: { title: 'Tools That Matter', subtitle: 'Real solutions for real problems.', items: [
      { icon: '⚡', title: 'Save Hours', desc: 'Transform content into 4 posts in seconds.' },
      { icon: '💰', title: 'Boost Sales', desc: 'Analyze your sales copy.' },
      { icon: '🎯', title: 'Simplify', desc: 'Turn jargon into clear language.' },
      { icon: '🛡️', title: 'Avoid Mistakes', desc: 'Check content before publishing.' },
      { icon: '⚖️', title: 'Decide Better', desc: 'Analyze options with pros and cons.' },
      { icon: '🧘', title: 'Clarify Thoughts', desc: 'Turn chaos into structure.' }
    ]},
    tr: { title: 'Önemli Araçlar', subtitle: 'Gerçek sorunlar için gerçek çözümler.', items: [
      { icon: '⚡', title: 'Saatler Kazanın', desc: 'İçeriği saniyede 4 posta dönüştürün.' },
      { icon: '💰', title: 'Satışları Artırın', desc: 'Satış metinlerinizi analiz edin.' },
      { icon: '🎯', title: 'Basitleştirin', desc: 'Jargonu anlaşılır dile çevirin.' },
      { icon: '🛡️', title: 'Hatalardan Kaçının', desc: 'Yayınlamadan önce kontrol edin.' },
      { icon: '⚖️', title: 'Daha İyi Karar Verin', desc: 'Artı ve eksileri analiz edin.' },
      { icon: '🧘', title: 'Düşünceleri Netleştirin', desc: 'Kaosu yapıya dönüştürün.' }
    ]},
    ru: { title: 'Важные инструменты', subtitle: 'Реальные решения.', items: [
      { icon: '⚡', title: 'Экономьте часы', desc: 'Превратите контент в 4 поста.' },
      { icon: '💰', title: 'Увеличьте продажи', desc: 'Анализируйте тексты.' },
      { icon: '🎯', title: 'Упростите', desc: 'Понятный язык.' },
      { icon: '🛡️', title: 'Избегайте ошибок', desc: 'Проверяйте контент.' },
      { icon: '⚖️', title: 'Решайте лучше', desc: 'Анализируйте варианты.' },
      { icon: '🧘', title: 'Ясность мыслей', desc: 'Структурируйте хаос.' }
    ]},
    de: { title: 'Wichtige Tools', subtitle: 'Echte Lösungen.', items: [
      { icon: '⚡', title: 'Stunden sparen', desc: 'Inhalt in 4 Posts verwandeln.' },
      { icon: '💰', title: 'Umsatz steigern', desc: 'Verkaufstexte analysieren.' },
      { icon: '🎯', title: 'Vereinfachen', desc: 'Klare Sprache.' },
      { icon: '🛡️', title: 'Fehler vermeiden', desc: 'Inhalte prüfen.' },
      { icon: '⚖️', title: 'Besser entscheiden', desc: 'Optionen analysieren.' },
      { icon: '🧘', title: 'Gedanken klären', desc: 'Chaos strukturieren.' }
    ]},
    fr: { title: 'Outils essentiels', subtitle: 'Solutions réelles.', items: [
      { icon: '⚡', title: 'Gagnez du temps', desc: 'Transformez en 4 posts.' },
      { icon: '💰', title: 'Boostez les ventes', desc: 'Analysez vos textes.' },
      { icon: '🎯', title: 'Simplifiez', desc: 'Langage clair.' },
      { icon: '🛡️', title: 'Évitez les erreurs', desc: 'Vérifiez le contenu.' },
      { icon: '⚖️', title: 'Décidez mieux', desc: 'Analysez les options.' },
      { icon: '🧘', title: 'Clarifiez', desc: 'Structurez le chaos.' }
    ]}
  },
  howItWorks: {
    en: { title: 'How It Works', subtitle: '3 simple steps', steps: [{ n: '1', t: 'Paste Content', d: 'Enter your text.' }, { n: '2', t: 'Choose Tool', d: 'Select what you need.' }, { n: '3', t: 'Get Results', d: 'Instant output.' }] },
    tr: { title: 'Nasıl Çalışır', subtitle: '3 basit adım', steps: [{ n: '1', t: 'İçerik Yapıştır', d: 'Metninizi girin.' }, { n: '2', t: 'Araç Seç', d: 'İhtiyacınızı seçin.' }, { n: '3', t: 'Sonuç Al', d: 'Anında çıktı.' }] },
    ru: { title: 'Как это работает', subtitle: '3 шага', steps: [{ n: '1', t: 'Вставьте контент', d: 'Введите текст.' }, { n: '2', t: 'Выберите инструмент', d: 'Выберите нужное.' }, { n: '3', t: 'Получите результат', d: 'Мгновенно.' }] },
    de: { title: 'So funktioniert es', subtitle: '3 Schritte', steps: [{ n: '1', t: 'Inhalt einfügen', d: 'Text eingeben.' }, { n: '2', t: 'Tool wählen', d: 'Auswählen.' }, { n: '3', t: 'Ergebnis', d: 'Sofort.' }] },
    fr: { title: 'Comment ça marche', subtitle: '3 étapes', steps: [{ n: '1', t: 'Collez le contenu', d: 'Entrez le texte.' }, { n: '2', t: 'Choisissez', d: 'Sélectionnez.' }, { n: '3', t: 'Résultat', d: 'Instantané.' }] }
  },
  pricing: {
    en: { title: 'Simple Pricing', subtitle: 'Start free.', monthly: 'Monthly', yearly: 'Yearly', save: 'Save 17%', free: { name: 'Free', price: '$0', period: '/mo', desc: 'To start', features: ['50 credits/mo', 'Basic tools', 'Email support'], cta: 'Start Free' }, starter: { name: 'Starter', price: '$2.99', period: '/mo', desc: 'For hobbyists', features: ['200 credits/mo', 'All AI tools', 'Standard support'], cta: 'Get Started' }, pro: { name: 'Pro', price: '$4.99', period: '/mo', desc: 'For pros', features: ['1000 credits/mo', 'All AI tools', 'Priority support', 'No ads'], cta: 'Upgrade to Pro', popular: true } },
    tr: { title: 'Basit Fiyatlandırma', subtitle: 'Ücretsiz başla.', monthly: 'Aylık', yearly: 'Yıllık', save: '%17 Tasarruf', free: { name: 'Ücretsiz', price: '$0', period: '/ay', desc: 'Başlangıç', features: ['50 kredi/ay', 'Temel araçlar', 'E-posta desteği'], cta: 'Ücretsiz Başla' }, starter: { name: 'Başlangıç', price: '$2.99', period: '/ay', desc: 'Hobi için', features: ['200 kredi/ay', 'Tüm AI araçları', 'Standart destek'], cta: 'Başla' }, pro: { name: 'Pro', price: '$4.99', period: '/ay', desc: 'Profesyoneller', features: ['1000 kredi/ay', 'Tüm AI araçları', 'Öncelikli destek', 'Reklamsız'], cta: 'Pro Yükselt', popular: true } },
    ru: { title: 'Простые цены', subtitle: 'Начните бесплатно.', monthly: 'Ежемесячно', yearly: 'Ежегодно', save: 'Скидка 17%', free: { name: 'Бесплатно', price: '$0', period: '/мес', desc: 'Для начала', features: ['50 кредитов/мес', 'Базовые инструменты', 'Email поддержка'], cta: 'Начать бесплатно' }, starter: { name: 'Стартовый', price: '$2.99', period: '/мес', desc: 'Для хобби', features: ['200 кредитов/мес', 'Все AI инструменты', 'Стандартная поддержка'], cta: 'Начать' }, pro: { name: 'Pro', price: '$4.99', period: '/мес', desc: 'Для профи', features: ['1000 кредитов/мес', 'Все AI инструменты', 'Приоритетная поддержка', 'Без рекламы'], cta: 'Перейти на Pro', popular: true } },
    de: { title: 'Einfache Preise', subtitle: 'Kostenlos starten.', monthly: 'Monatlich', yearly: 'Jährlich', save: '17% sparen', free: { name: 'Kostenlos', price: '$0', period: '/Mo', desc: 'Zum Starten', features: ['50 Credits/Mo', 'Basis-Tools', 'Email-Support'], cta: 'Kostenlos starten' }, starter: { name: 'Starter', price: '$2.99', period: '/Mo', desc: 'Für Hobbyisten', features: ['200 Credits/Mo', 'Alle AI-Tools', 'Standard-Support'], cta: 'Starten' }, pro: { name: 'Pro', price: '$4.99', period: '/Mo', desc: 'Für Profis', features: ['1000 Credits/Mo', 'Alle AI-Tools', 'Prioritäts-Support', 'Werbefrei'], cta: 'Zu Pro', popular: true } },
    fr: { title: 'Tarifs simples', subtitle: 'Commencez gratuitement.', monthly: 'Mensuel', yearly: 'Annuel', save: '17% économie', free: { name: 'Gratuit', price: '$0', period: '/mois', desc: 'Pour commencer', features: ['50 crédits/mois', 'Outils de base', 'Support email'], cta: 'Commencer gratuitement' }, starter: { name: 'Starter', price: '$2.99', period: '/mois', desc: 'Pour amateurs', features: ['200 crédits/mois', 'Tous les outils IA', 'Support standard'], cta: 'Commencer' }, pro: { name: 'Pro', price: '$4.99', period: '/mois', desc: 'Pour les pros', features: ['1000 crédits/mois', 'Tous les outils IA', 'Support prioritaire', 'Sans pub'], cta: 'Passer à Pro', popular: true } }
  },
  faq: {
    en: { title: 'FAQ', subtitle: 'Everything you need to know', items: [{ q: 'What are credits?', a: 'Credits are units for AI tools.' }, { q: 'Can I cancel?', a: 'Yes, anytime.' }, { q: 'Payment methods?', a: 'Cards and PayPal.' }, { q: 'Free plan duration?', a: 'Forever.' }] },
    tr: { title: 'SSS', subtitle: 'Bilmeniz gereken her şey', items: [{ q: 'Krediler nedir?', a: 'AI araçları için birimler.' }, { q: 'İptal edebilir miyim?', a: 'Evet, istediğiniz zaman.' }, { q: 'Ödeme yöntemleri?', a: 'Kartlar ve PayPal.' }, { q: 'Ücretsiz plan süresi?', a: 'Sonsuza kadar.' }] },
    ru: { title: 'FAQ', subtitle: 'Всё что нужно знать', items: [{ q: 'Что такое кредиты?', a: 'Единицы для AI.' }, { q: 'Можно отменить?', a: 'Да, в любое время.' }, { q: 'Способы оплаты?', a: 'Карты и PayPal.' }, { q: 'Срок бесплатного плана?', a: 'Навсегда.' }] },
    de: { title: 'FAQ', subtitle: 'Alles was Sie wissen müssen', items: [{ q: 'Was sind Credits?', a: 'Einheiten für AI-Tools.' }, { q: 'Kann ich kündigen?', a: 'Ja, jederzeit.' }, { q: 'Zahlungsmethoden?', a: 'Karten und PayPal.' }, { q: 'Wie lange kostenlos?', a: 'Für immer.' }] },
    fr: { title: 'FAQ', subtitle: 'Tout ce que vous devez savoir', items: [{ q: 'Que sont les crédits?', a: 'Unités pour les outils IA.' }, { q: 'Puis-je annuler?', a: 'Oui, à tout moment.' }, { q: 'Modes de paiement?', a: 'Cartes et PayPal.' }, { q: 'Durée du plan gratuit?', a: 'Pour toujours.' }] }
  },
  testimonials: {
    en: { title: 'What Users Say', subtitle: 'Thousands trust us', items: [{ name: 'Sarah M.', role: 'Creator', text: 'Cut my time in half!', avatar: '👩‍💼' }, { name: 'John R.', role: 'SMM', text: 'Hook generator is amazing.', avatar: '👨‍💻' }, { name: 'Emily L.', role: 'YouTuber', text: 'Perfect for scripts.', avatar: '👩‍🎤' }] },
    tr: { title: 'Kullanıcılar Ne Diyor', subtitle: 'Binlerce kişi güveniyor', items: [{ name: 'Ayşe K.', role: 'İçerik Üreticisi', text: 'Süremin yarıya indirdi!', avatar: '👩‍💼' }, { name: 'Mehmet R.', role: 'SMM', text: 'Hook üretici harika.', avatar: '👨‍💻' }, { name: 'Elif L.', role: 'YouTuber', text: 'Scriptler için mükemmel.', avatar: '👩‍🎤' }] },
    ru: { title: 'Отзывы', subtitle: 'Тысячи доверяют нам', items: [{ name: 'Анна М.', role: 'Создатель', text: 'Сократила время вдвое!', avatar: '👩‍💼' }, { name: 'Иван Р.', role: 'SMM', text: 'Генератор хуков супер.', avatar: '👨‍💻' }, { name: 'Елена Л.', role: 'YouTuber', text: 'Идеально для скриптов.', avatar: '👩‍🎤' }] },
    de: { title: 'Was Nutzer sagen', subtitle: 'Tausende vertrauen uns', items: [{ name: 'Sarah M.', role: 'Creator', text: 'Zeit halbiert!', avatar: '👩‍💼' }, { name: 'Max R.', role: 'SMM', text: 'Hook-Generator ist toll.', avatar: '👨‍💻' }, { name: 'Lisa L.', role: 'YouTuber', text: 'Perfekt für Skripte.', avatar: '👩‍🎤' }] },
    fr: { title: 'Ce que disent les utilisateurs', subtitle: 'Des milliers nous font confiance', items: [{ name: 'Marie M.', role: 'Créatrice', text: 'Temps divisé par deux!', avatar: '👩‍💼' }, { name: 'Jean R.', role: 'SMM', text: 'Générateur de hooks génial.', avatar: '👨‍💻' }, { name: 'Sophie L.', role: 'YouTuber', text: 'Parfait pour les scripts.', avatar: '👩‍🎤' }] }
  },
  footer: {
    en: { desc: 'AI tools that simplify life.', product: 'Product', company: 'Company', legal: 'Legal', features: 'Features', pricing: 'Pricing', api: 'API', about: 'About', blog: 'Blog', careers: 'Careers', privacy: 'Privacy', terms: 'Terms', copyright: '© 2024 Media Tool Kit' },
    tr: { desc: 'Hayatı kolaylaştıran AI araçları.', product: 'Ürün', company: 'Şirket', legal: 'Yasal', features: 'Özellikler', pricing: 'Fiyatlar', api: 'API', about: 'Hakkımızda', blog: 'Blog', careers: 'Kariyer', privacy: 'Gizlilik', terms: 'Şartlar', copyright: '© 2024 Media Tool Kit' },
    ru: { desc: 'AI инструменты для жизни.', product: 'Продукт', company: 'Компания', legal: 'Правовая', features: 'Функции', pricing: 'Цены', api: 'API', about: 'О нас', blog: 'Блог', careers: 'Карьера', privacy: 'Конфиденциальность', terms: 'Условия', copyright: '© 2024 Media Tool Kit' },
    de: { desc: 'KI-Tools die Leben vereinfachen.', product: 'Produkt', company: 'Unternehmen', legal: 'Rechtliches', features: 'Funktionen', pricing: 'Preise', api: 'API', about: 'Über uns', blog: 'Blog', careers: 'Karriere', privacy: 'Datenschutz', terms: 'AGB', copyright: '© 2024 Media Tool Kit' },
    fr: { desc: 'Outils IA qui simplifient la vie.', product: 'Produit', company: 'Entreprise', legal: 'Légal', features: 'Fonctionnalités', pricing: 'Tarifs', api: 'API', about: 'À propos', blog: 'Blog', careers: 'Carrières', privacy: 'Confidentialité', terms: 'CGU', copyright: '© 2024 Media Tool Kit' }
  },
  auth: {
    en: { loginTitle: 'Welcome Back', loginSubtitle: 'Sign in to continue', registerTitle: 'Start Free Today', registerSubtitle: 'No credit card required', email: 'Email', password: 'Password', name: 'Full Name', loginBtn: 'Sign In', registerBtn: 'Create Account', noAccount: 'No account?', hasAccount: 'Have an account?', createOne: 'Create one', signIn: 'Sign in', forgot: 'Forgot password?', terms: 'By signing up, you agree to our Terms.' },
    tr: { loginTitle: 'Tekrar Hoş Geldin', loginSubtitle: 'Devam etmek için giriş yap', registerTitle: 'Bugün Ücretsiz Başla', registerSubtitle: 'Kredi kartı gerekmez', email: 'E-posta', password: 'Şifre', name: 'Ad Soyad', loginBtn: 'Giriş Yap', registerBtn: 'Hesap Oluştur', noAccount: 'Hesabın yok mu?', hasAccount: 'Hesabın var mı?', createOne: 'Oluştur', signIn: 'Giriş yap', forgot: 'Şifreni mi unuttun?', terms: 'Kayıt olarak Şartları kabul edersiniz.' },
    ru: { loginTitle: 'С возвращением', loginSubtitle: 'Войдите для продолжения', registerTitle: 'Начните бесплатно', registerSubtitle: 'Карта не нужна', email: 'Email', password: 'Пароль', name: 'Имя', loginBtn: 'Войти', registerBtn: 'Создать аккаунт', noAccount: 'Нет аккаунта?', hasAccount: 'Есть аккаунт?', createOne: 'Создать', signIn: 'Войти', forgot: 'Забыли пароль?', terms: 'Регистрируясь, вы принимаете Условия.' },
    de: { loginTitle: 'Willkommen zurück', loginSubtitle: 'Zum Fortfahren anmelden', registerTitle: 'Kostenlos starten', registerSubtitle: 'Keine Karte erforderlich', email: 'Email', password: 'Passwort', name: 'Name', loginBtn: 'Anmelden', registerBtn: 'Konto erstellen', noAccount: 'Kein Konto?', hasAccount: 'Haben Sie ein Konto?', createOne: 'Erstellen', signIn: 'Anmelden', forgot: 'Passwort vergessen?', terms: 'Mit Registrierung akzeptieren Sie die AGB.' },
    fr: { loginTitle: 'Bon retour', loginSubtitle: 'Connectez-vous', registerTitle: 'Commencez gratuitement', registerSubtitle: 'Pas de carte requise', email: 'Email', password: 'Mot de passe', name: 'Nom', loginBtn: 'Se connecter', registerBtn: 'Créer un compte', noAccount: 'Pas de compte?', hasAccount: 'Avez-vous un compte?', createOne: 'Créer', signIn: 'Se connecter', forgot: 'Mot de passe oublié?', terms: 'En vous inscrivant, vous acceptez les CGU.' }
  }
}

// Dashboard çevirileri
export const dashboard = {
  en: { welcome: 'Welcome back', credits: 'Credits', search: 'Search tools...', logout: 'Logout', watchAd: '🎬 Watch Ad (+5)', adsLeft: 'ads remaining', loading: 'Loading...', noTools: 'No tools found', free: 'FREE', new: 'NEW', categories: { all: 'All', video: 'Video', content: 'Content', analysis: 'Analysis', optimization: 'Optimization', helper: 'Helper' }, adModal: { title: 'Watch Ad', subtitle: 'Watch 15s ad for 5 credits', watching: 'Watching...', earn: 'Earn 5 Credits', close: 'Close', limit: 'Daily limit reached' } },
  tr: { welcome: 'Hoş geldin', credits: 'Kredi', search: 'Araç ara...', logout: 'Çıkış', watchAd: '🎬 Reklam İzle (+5)', adsLeft: 'reklam hakkı', loading: 'Yükleniyor...', noTools: 'Araç bulunamadı', free: 'ÜCRETSİZ', new: 'YENİ', categories: { all: 'Tümü', video: 'Video', content: 'İçerik', analysis: 'Analiz', optimization: 'Optimizasyon', helper: 'Yardımcı' }, adModal: { title: 'Reklam İzle', subtitle: '5 kredi için 15sn reklam izle', watching: 'İzleniyor...', earn: '5 Kredi Kazan', close: 'Kapat', limit: 'Günlük limit doldu' } },
  ru: { welcome: 'С возвращением', credits: 'Кредиты', search: 'Поиск...', logout: 'Выход', watchAd: '🎬 Реклама (+5)', adsLeft: 'реклам осталось', loading: 'Загрузка...', noTools: 'Ничего не найдено', free: 'БЕСПЛАТНО', new: 'НОВОЕ', categories: { all: 'Все', video: 'Видео', content: 'Контент', analysis: 'Анализ', optimization: 'Оптимизация', helper: 'Помощник' }, adModal: { title: 'Смотреть рекламу', subtitle: '15с рекламы = 5 кредитов', watching: 'Просмотр...', earn: 'Получить 5', close: 'Закрыть', limit: 'Лимит достигнут' } },
  de: { welcome: 'Willkommen zurück', credits: 'Credits', search: 'Suchen...', logout: 'Abmelden', watchAd: '🎬 Werbung (+5)', adsLeft: 'Werbungen übrig', loading: 'Laden...', noTools: 'Keine Tools gefunden', free: 'KOSTENLOS', new: 'NEU', categories: { all: 'Alle', video: 'Video', content: 'Inhalt', analysis: 'Analyse', optimization: 'Optimierung', helper: 'Helfer' }, adModal: { title: 'Werbung ansehen', subtitle: '15s Werbung = 5 Credits', watching: 'Lädt...', earn: '5 Credits', close: 'Schließen', limit: 'Limit erreicht' } },
  fr: { welcome: 'Bon retour', credits: 'Crédits', search: 'Rechercher...', logout: 'Déconnexion', watchAd: '🎬 Pub (+5)', adsLeft: 'pubs restantes', loading: 'Chargement...', noTools: 'Aucun outil trouvé', free: 'GRATUIT', new: 'NOUVEAU', categories: { all: 'Tous', video: 'Vidéo', content: 'Contenu', analysis: 'Analyse', optimization: 'Optimisation', helper: 'Assistant' }, adModal: { title: 'Regarder une pub', subtitle: '15s de pub = 5 crédits', watching: 'Lecture...', earn: '5 Crédits', close: 'Fermer', limit: 'Limite atteinte' } }
}

// Tool isimleri
export const toolNames = {
  en: { videoScript: 'Video Script Writer', textToSpeech: 'Text to Speech', subtitleGen: 'Subtitle Generator', hookGen: 'Hook Generator', captionWriter: 'Caption Writer', platformAdapter: 'Platform Adapter', summarizer: 'Summarizer', competitorAnalysis: 'Competitor Analysis', trendDetector: 'Trend Detector', engagementPredictor: 'Engagement Predictor', brandVoice: 'Brand Voice', sentiment: 'Sentiment Analysis', hashtagGen: 'Hashtag Generator', viralScore: 'Viral Score', bioGen: 'Bio Generator', contentCalendar: 'Content Calendar', postScheduler: 'Post Scheduler', qrCode: 'QR Code Generator' },
  tr: { videoScript: 'Video Script Yazarı', textToSpeech: 'Seslendirme', subtitleGen: 'Altyazı Üretici', hookGen: 'Hook Üretici', captionWriter: 'Caption Yazarı', platformAdapter: 'Platform Uyarlayıcı', summarizer: 'Metin Özetleyici', competitorAnalysis: 'Rakip Analizi', trendDetector: 'Trend Dedektörü', engagementPredictor: 'Etkileşim Tahmini', brandVoice: 'Marka Sesi', sentiment: 'Duygu Analizi', hashtagGen: 'Hashtag Üretici', viralScore: 'Viral Skoru', bioGen: 'Bio Üretici', contentCalendar: 'İçerik Takvimi', postScheduler: 'Gönderi Planlayıcı', qrCode: 'QR Kod Üretici' },
  ru: { videoScript: 'Сценарист видео', textToSpeech: 'Озвучка текста', subtitleGen: 'Субтитры', hookGen: 'Генератор хуков', captionWriter: 'Автор подписей', platformAdapter: 'Адаптер платформ', summarizer: 'Суммаризатор', competitorAnalysis: 'Анализ конкурентов', trendDetector: 'Детектор трендов', engagementPredictor: 'Прогноз вовлеченности', brandVoice: 'Голос бренда', sentiment: 'Анализ настроений', hashtagGen: 'Хэштеги', viralScore: 'Вирусный рейтинг', bioGen: 'Генератор био', contentCalendar: 'Контент-календарь', postScheduler: 'Планировщик постов', qrCode: 'QR-код' },
  de: { videoScript: 'Video-Skript', textToSpeech: 'Text zu Sprache', subtitleGen: 'Untertitel', hookGen: 'Hook-Generator', captionWriter: 'Caption-Autor', platformAdapter: 'Plattform-Adapter', summarizer: 'Zusammenfasser', competitorAnalysis: 'Wettbewerbsanalyse', trendDetector: 'Trend-Detektor', engagementPredictor: 'Engagement-Vorhersage', brandVoice: 'Markenstimme', sentiment: 'Stimmungsanalyse', hashtagGen: 'Hashtag-Generator', viralScore: 'Viral-Score', bioGen: 'Bio-Generator', contentCalendar: 'Content-Kalender', postScheduler: 'Post-Planer', qrCode: 'QR-Code' },
  fr: { videoScript: 'Scénariste', textToSpeech: 'Synthèse vocale', subtitleGen: 'Sous-titres', hookGen: 'Générateur de hooks', captionWriter: 'Rédacteur', platformAdapter: 'Adaptateur', summarizer: 'Résumeur', competitorAnalysis: 'Analyse concurrentielle', trendDetector: 'Détecteur de tendances', engagementPredictor: "Prédiction d'engagement", brandVoice: 'Voix de marque', sentiment: 'Analyse de sentiment', hashtagGen: 'Générateur de hashtags', viralScore: 'Score viral', bioGen: 'Générateur de bio', contentCalendar: 'Calendrier', postScheduler: 'Planificateur', qrCode: 'QR Code' }
}

// Tool sayfaları için ortak çeviriler
export const toolPage = {
  en: { back: '← Back to Dashboard', generate: 'Generate', generating: 'Generating...', copy: 'Copy', copied: 'Copied!', result: 'Result', required: 'Input required', success: 'Done!', error: 'Error occurred' },
  tr: { back: '← Panele Dön', generate: 'Oluştur', generating: 'Oluşturuluyor...', copy: 'Kopyala', copied: 'Kopyalandı!', result: 'Sonuç', required: 'Giriş gerekli', success: 'Tamam!', error: 'Hata oluştu' },
  ru: { back: '← Назад', generate: 'Создать', generating: 'Создание...', copy: 'Копировать', copied: 'Скопировано!', result: 'Результат', required: 'Ввод обязателен', success: 'Готово!', error: 'Ошибка' },
  de: { back: '← Zurück', generate: 'Erstellen', generating: 'Erstellen...', copy: 'Kopieren', copied: 'Kopiert!', result: 'Ergebnis', required: 'Eingabe erforderlich', success: 'Fertig!', error: 'Fehler' },
  fr: { back: '← Retour', generate: 'Générer', generating: 'Génération...', copy: 'Copier', copied: 'Copié!', result: 'Résultat', required: 'Entrée requise', success: 'Terminé!', error: 'Erreur' }
}
