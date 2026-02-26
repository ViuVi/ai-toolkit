'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage, Language } from '@/lib/LanguageContext'

// 5 DİLLİ ÇEVİRİLER
const texts: Record<Language, any> = {
  en: {
    nav: { features: 'Features', tools: 'Tools', pricing: 'Pricing', dashboard: 'Dashboard', signIn: 'Sign In', getStarted: 'Get Started' },
    hero: { badge: '16 Professional Tools Available', title: 'Create Viral Content', highlight: '10x Faster', subtitle: 'AI-powered tools for content creators. Generate captions, analyze trends, schedule posts, and predict viral potential - all in one platform.', cta: 'Start Free Trial', cta2: 'Explore Tools' },
    stats: { tools: 'Tools', users: 'Users', contents: 'Contents Created', rating: 'Rating' },
    features: { title: 'Everything You Need to', highlight: 'Go Viral', subtitle: 'Professional tools designed for modern content creators', items: [
      { icon: '📹', title: 'Video Tools', desc: 'Subtitle generator, script writer and more' },
      { icon: '✍️', title: 'Content Creation', desc: 'Hooks, captions, and platform adapters' },
      { icon: '📊', title: 'Analytics', desc: 'Competitor analysis, trends, engagement' },
      { icon: '⚡', title: 'Optimization', desc: 'Hashtags, bio generator, QR codes' },
      { icon: '🚀', title: 'AI-Powered', desc: 'Viral score predictor, brand voice analyzer' },
      { icon: '🗓️', title: 'Planning', desc: 'Content calendar, post scheduler' }
    ]},
    toolsSection: { title: '16 Powerful Tools', subtitle: 'One Platform', desc: "From content creation to analytics, we've got you covered", freeTitle: 'Free Tools', freeDesc: 'No credit card required', premiumTitle: 'Premium Tools', premiumDesc: 'AI-powered features', freeItems: ['Bio Generator', 'QR Code Generator', 'Hashtag Generator'], premiumItems: ['Subtitle Generator', 'Video Script Writer', 'Competitor Analysis', 'Trend Detector', 'And more...'] },
    pricing: { title: 'Simple, Transparent', highlight: 'Pricing', subtitle: 'Start free, upgrade when you need more', free: { name: 'Free', price: '$0', period: '/month', credits: '50 credits/month', features: ['Access to free tools', 'Basic support', 'Watch ads for credits'], cta: 'Start Free' }, pro: { name: 'Pro', price: '$4.99', period: '/month', credits: '1000 credits/month', badge: 'RECOMMENDED', features: ['All AI tools', 'Priority support', 'No ads', 'Unlimited generations'], cta: 'Upgrade to Pro' } },
    cta: { title: 'Ready to Go Viral?', subtitle: 'Join thousands of creators using Media Tool Kit', button: 'Start Free Trial - 50 Credits Free' },
    footer: { desc: 'AI-powered content creation tools for modern creators.', product: 'Product', info: 'Info', about: 'About', contact: 'Contact', privacy: 'Privacy', copyright: '© 2025 Media Tool Kit. All rights reserved.' }
  },
  tr: {
    nav: { features: 'Özellikler', tools: 'Araçlar', pricing: 'Fiyatlandırma', dashboard: 'Panel', signIn: 'Giriş Yap', getStarted: 'Başla' },
    hero: { badge: '16 Profesyonel Araç Mevcut', title: 'Viral İçerikler Üret', highlight: '10x Daha Hızlı', subtitle: 'İçerik üreticileri için yapay zeka destekli araçlar. Caption oluştur, trendleri analiz et, paylaşımları planla ve viral potansiyeli tahmin et.', cta: 'Ücretsiz Dene', cta2: 'Araçları Keşfet' },
    stats: { tools: 'Araç', users: 'Kullanıcı', contents: 'Oluşturulan İçerik', rating: 'Puan' },
    features: { title: 'Viral Olman İçin', highlight: 'Gereken Her Şey', subtitle: 'Modern içerik üreticileri için tasarlanmış profesyonel araçlar', items: [
      { icon: '📹', title: 'Video Araçları', desc: 'Alt yazı ekleme, script yazma ve daha fazlası' },
      { icon: '✍️', title: 'İçerik Üretimi', desc: 'Hook, caption ve platform adaptörleri' },
      { icon: '📊', title: 'Analiz', desc: 'Rakip analizi, trendler, etkileşim' },
      { icon: '⚡', title: 'Optimizasyon', desc: 'Hashtag, bio oluşturma, QR kod' },
      { icon: '🚀', title: 'Yapay Zeka', desc: 'Viral tahmin, marka sesi analizi' },
      { icon: '🗓️', title: 'Planlama', desc: 'İçerik takvimi, paylaşım planlayıcı' }
    ]},
    toolsSection: { title: '16 Güçlü Araç', subtitle: 'Tek Platform', desc: 'İçerik üretiminden analize, her şeyi kapsıyoruz', freeTitle: 'Ücretsiz Araçlar', freeDesc: 'Kredi kartı gerekmez', premiumTitle: 'Premium Araçlar', premiumDesc: 'Yapay zeka destekli', freeItems: ['Bio Oluşturucu', 'QR Kod Oluşturucu', 'Hashtag Üretici'], premiumItems: ['Alt Yazı Ekleyici', 'Video Script Yazıcı', 'Rakip Analizi', 'Trend Dedektörü', 've daha fazlası...'] },
    pricing: { title: 'Basit, Şeffaf', highlight: 'Fiyatlandırma', subtitle: 'Ücretsiz başla, ihtiyacın olduğunda yükselt', free: { name: 'Ücretsiz', price: '$0', period: '/ay', credits: '50 kredi/ay', features: ['Ücretsiz araçlara erişim', 'Temel destek', 'Reklam izle kredi kazan'], cta: 'Ücretsiz Başla' }, pro: { name: 'Pro', price: '$4.99', period: '/ay', credits: '1000 kredi/ay', badge: 'ÖNERİLEN', features: ['Tüm AI araçlarına erişim', 'Öncelikli destek', 'Reklamsız kullanım', 'Sınırsız üretim'], cta: "Pro'ya Geç" } },
    cta: { title: 'Viral Olmaya Hazır mısın?', subtitle: 'Media Tool Kit kullanan binlerce içerik üreticiye katıl', button: 'Ücretsiz Dene - 50 Kredi Bedava' },
    footer: { desc: 'Modern içerik üreticiler için yapay zeka destekli araçlar.', product: 'Ürün', info: 'Bilgi', about: 'Hakkımızda', contact: 'İletişim', privacy: 'Gizlilik', copyright: '© 2025 Media Tool Kit. Tüm hakları saklıdır.' }
  },
  ru: {
    nav: { features: 'Функции', tools: 'Инструменты', pricing: 'Цены', dashboard: 'Панель', signIn: 'Войти', getStarted: 'Начать' },
    hero: { badge: '16 профессиональных инструментов', title: 'Создавайте вирусный контент', highlight: 'в 10 раз быстрее', subtitle: 'AI-инструменты для создателей контента. Создавайте подписи, анализируйте тренды, планируйте посты.', cta: 'Начать бесплатно', cta2: 'Изучить инструменты' },
    stats: { tools: 'Инструментов', users: 'Пользователей', contents: 'Создано контента', rating: 'Рейтинг' },
    features: { title: 'Всё что нужно для', highlight: 'вирусности', subtitle: 'Профессиональные инструменты для создателей контента', items: [
      { icon: '📹', title: 'Видео инструменты', desc: 'Субтитры, сценарии и многое другое' },
      { icon: '✍️', title: 'Создание контента', desc: 'Хуки, подписи и адаптеры' },
      { icon: '📊', title: 'Аналитика', desc: 'Анализ конкурентов, тренды' },
      { icon: '⚡', title: 'Оптимизация', desc: 'Хэштеги, био, QR коды' },
      { icon: '🚀', title: 'AI', desc: 'Прогноз вирусности, голос бренда' },
      { icon: '🗓️', title: 'Планирование', desc: 'Календарь контента' }
    ]},
    toolsSection: { title: '16 мощных инструментов', subtitle: 'Одна платформа', desc: 'От создания контента до аналитики', freeTitle: 'Бесплатные', freeDesc: 'Без карты', premiumTitle: 'Премиум', premiumDesc: 'AI функции', freeItems: ['Генератор био', 'QR коды', 'Хэштеги'], premiumItems: ['Субтитры', 'Сценарии', 'Анализ конкурентов', 'Тренды', 'И ещё...'] },
    pricing: { title: 'Простые, прозрачные', highlight: 'цены', subtitle: 'Начните бесплатно', free: { name: 'Бесплатно', price: '$0', period: '/мес', credits: '50 кредитов/мес', features: ['Бесплатные инструменты', 'Базовая поддержка', 'Реклама за кредиты'], cta: 'Начать бесплатно' }, pro: { name: 'Pro', price: '$4.99', period: '/мес', credits: '1000 кредитов/мес', badge: 'РЕКОМЕНДУЕТСЯ', features: ['Все AI инструменты', 'Приоритетная поддержка', 'Без рекламы', 'Безлимит'], cta: 'Перейти на Pro' } },
    cta: { title: 'Готовы стать вирусными?', subtitle: 'Присоединяйтесь к тысячам создателей', button: 'Начать бесплатно - 50 кредитов' },
    footer: { desc: 'AI инструменты для создателей контента.', product: 'Продукт', info: 'Информация', about: 'О нас', contact: 'Контакты', privacy: 'Конфиденциальность', copyright: '© 2025 Media Tool Kit.' }
  },
  de: {
    nav: { features: 'Funktionen', tools: 'Tools', pricing: 'Preise', dashboard: 'Dashboard', signIn: 'Anmelden', getStarted: 'Starten' },
    hero: { badge: '16 professionelle Tools verfügbar', title: 'Erstellen Sie virale Inhalte', highlight: '10x schneller', subtitle: 'KI-Tools für Content-Ersteller. Captions erstellen, Trends analysieren, Posts planen.', cta: 'Kostenlos starten', cta2: 'Tools entdecken' },
    stats: { tools: 'Tools', users: 'Nutzer', contents: 'Erstellte Inhalte', rating: 'Bewertung' },
    features: { title: 'Alles was Sie brauchen um', highlight: 'viral zu gehen', subtitle: 'Professionelle Tools für Content-Ersteller', items: [
      { icon: '📹', title: 'Video-Tools', desc: 'Untertitel, Skripte und mehr' },
      { icon: '✍️', title: 'Content-Erstellung', desc: 'Hooks, Captions und Adapter' },
      { icon: '📊', title: 'Analytik', desc: 'Wettbewerbsanalyse, Trends' },
      { icon: '⚡', title: 'Optimierung', desc: 'Hashtags, Bio, QR-Codes' },
      { icon: '🚀', title: 'KI-gestützt', desc: 'Viral-Score, Markenstimme' },
      { icon: '🗓️', title: 'Planung', desc: 'Content-Kalender' }
    ]},
    toolsSection: { title: '16 leistungsstarke Tools', subtitle: 'Eine Plattform', desc: 'Von Content-Erstellung bis Analytik', freeTitle: 'Kostenlose Tools', freeDesc: 'Keine Karte nötig', premiumTitle: 'Premium Tools', premiumDesc: 'KI-Funktionen', freeItems: ['Bio-Generator', 'QR-Codes', 'Hashtags'], premiumItems: ['Untertitel', 'Video-Skripte', 'Wettbewerbsanalyse', 'Trends', 'Und mehr...'] },
    pricing: { title: 'Einfache, transparente', highlight: 'Preise', subtitle: 'Kostenlos starten', free: { name: 'Kostenlos', price: '$0', period: '/Monat', credits: '50 Credits/Monat', features: ['Kostenlose Tools', 'Basis-Support', 'Werbung für Credits'], cta: 'Kostenlos starten' }, pro: { name: 'Pro', price: '$4.99', period: '/Monat', credits: '1000 Credits/Monat', badge: 'EMPFOHLEN', features: ['Alle AI-Tools', 'Prioritäts-Support', 'Keine Werbung', 'Unbegrenzt'], cta: 'Auf Pro upgraden' } },
    cta: { title: 'Bereit viral zu gehen?', subtitle: 'Schließen Sie sich tausenden Content-Erstellern an', button: 'Kostenlos starten - 50 Credits' },
    footer: { desc: 'KI-Tools für Content-Ersteller.', product: 'Produkt', info: 'Info', about: 'Über uns', contact: 'Kontakt', privacy: 'Datenschutz', copyright: '© 2025 Media Tool Kit.' }
  },
  fr: {
    nav: { features: 'Fonctionnalités', tools: 'Outils', pricing: 'Tarifs', dashboard: 'Tableau de bord', signIn: 'Connexion', getStarted: 'Commencer' },
    hero: { badge: '16 outils professionnels disponibles', title: 'Créez du contenu viral', highlight: '10x plus vite', subtitle: 'Outils IA pour créateurs de contenu. Créez des légendes, analysez les tendances, planifiez vos posts.', cta: 'Essai gratuit', cta2: 'Découvrir les outils' },
    stats: { tools: 'Outils', users: 'Utilisateurs', contents: 'Contenus créés', rating: 'Note' },
    features: { title: 'Tout ce dont vous avez besoin pour', highlight: 'devenir viral', subtitle: 'Outils professionnels pour créateurs de contenu', items: [
      { icon: '📹', title: 'Outils vidéo', desc: 'Sous-titres, scripts et plus' },
      { icon: '✍️', title: 'Création de contenu', desc: 'Hooks, légendes et adaptateurs' },
      { icon: '📊', title: 'Analytique', desc: 'Analyse concurrentielle, tendances' },
      { icon: '⚡', title: 'Optimisation', desc: 'Hashtags, bio, QR codes' },
      { icon: '🚀', title: 'IA', desc: 'Score viral, voix de marque' },
      { icon: '🗓️', title: 'Planification', desc: 'Calendrier de contenu' }
    ]},
    toolsSection: { title: '16 outils puissants', subtitle: 'Une plateforme', desc: 'De la création à l\'analytique', freeTitle: 'Outils gratuits', freeDesc: 'Sans carte', premiumTitle: 'Outils Premium', premiumDesc: 'Fonctionnalités IA', freeItems: ['Générateur de bio', 'QR codes', 'Hashtags'], premiumItems: ['Sous-titres', 'Scripts vidéo', 'Analyse concurrentielle', 'Tendances', 'Et plus...'] },
    pricing: { title: 'Tarifs simples,', highlight: 'transparents', subtitle: 'Commencez gratuitement', free: { name: 'Gratuit', price: '$0', period: '/mois', credits: '50 crédits/mois', features: ['Outils gratuits', 'Support basique', 'Pubs pour crédits'], cta: 'Commencer gratuitement' }, pro: { name: 'Pro', price: '$4.99', period: '/mois', credits: '1000 crédits/mois', badge: 'RECOMMANDÉ', features: ['Tous les outils IA', 'Support prioritaire', 'Sans pub', 'Illimité'], cta: 'Passer à Pro' } },
    cta: { title: 'Prêt à devenir viral?', subtitle: 'Rejoignez des milliers de créateurs', button: 'Essai gratuit - 50 crédits' },
    footer: { desc: 'Outils IA pour créateurs de contenu.', product: 'Produit', info: 'Info', about: 'À propos', contact: 'Contact', privacy: 'Confidentialité', copyright: '© 2025 Media Tool Kit.' }
  }
}

const langs: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' }
]

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | 'privacy' | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = texts[language]

  useEffect(() => { checkUser() }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUser(user)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold text-white">Media Tool Kit</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-gray-300 hover:text-white transition">{t.nav.features}</a>
              <a href="#tools" onClick={(e) => scrollToSection(e, 'tools')} className="text-gray-300 hover:text-white transition">{t.nav.tools}</a>
              <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-gray-300 hover:text-white transition">{t.nav.pricing}</a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/80 rounded-lg text-sm font-medium text-gray-300 border border-gray-700">
                  <span>🌐</span>
                  <span>{language.toUpperCase()}</span>
                </button>
                <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {langs.map((l) => (
                    <button key={l.code} onClick={() => setLanguage(l.code)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg ${language === l.code ? 'text-purple-400' : 'text-gray-300'}`}>
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              </div>

              {user ? (
                <Link href="/dashboard" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition shadow-lg">{t.nav.dashboard}</Link>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white transition">{t.nav.signIn}</Link>
                  <Link href="/register" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition shadow-lg">{t.nav.getStarted}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span></span>
            <span className="text-sm font-medium text-purple-300">{t.hero.badge}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {t.hero.title}<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">{t.hero.highlight}</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">{t.hero.subtitle}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-lg shadow-2xl shadow-purple-500/50 transition transform hover:scale-105">{t.hero.cta}</Link>
            <a href="#features" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-bold text-lg transition">{t.hero.cta2}</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center"><div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">16+</div><div className="text-gray-400 text-sm">{t.stats.tools}</div></div>
            <div className="text-center"><div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">10K+</div><div className="text-gray-400 text-sm">{t.stats.users}</div></div>
            <div className="text-center"><div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">50K+</div><div className="text-gray-400 text-sm">{t.stats.contents}</div></div>
            <div className="text-center"><div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">4.9</div><div className="text-gray-400 text-sm">{t.stats.rating}</div></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.features.title} <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.features.highlight}</span></h2>
            <p className="text-xl text-gray-400">{t.features.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map((item: any, i: number) => (
              <div key={i} className="group bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-2xl p-8 transition-all hover:scale-105">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4"><span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.toolsSection.title}</span><br />{t.toolsSection.subtitle}</h2>
            <p className="text-xl text-gray-400">{t.toolsSection.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center"><span className="text-2xl">🎁</span></div>
                <div><h3 className="text-2xl font-bold">{t.toolsSection.freeTitle}</h3><p className="text-green-400">{t.toolsSection.freeDesc}</p></div>
              </div>
              <ul className="space-y-3">{t.toolsSection.freeItems.map((item: string, i: number) => (<li key={i} className="flex items-center gap-2 text-gray-300"><span className="text-green-400">✓</span>{item}</li>))}</ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"><span className="text-2xl">⭐</span></div>
                <div><h3 className="text-2xl font-bold">{t.toolsSection.premiumTitle}</h3><p className="text-purple-400">{t.toolsSection.premiumDesc}</p></div>
              </div>
              <ul className="space-y-3">{t.toolsSection.premiumItems.map((item: string, i: number) => (<li key={i} className="flex items-center gap-2 text-gray-300"><span className="text-purple-400">✓</span>{item}</li>))}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.pricing.title} <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.pricing.highlight}</span></h2>
            <p className="text-xl text-gray-400">{t.pricing.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2">{t.pricing.free.name}</h3>
              <div className="text-4xl font-bold mb-2">{t.pricing.free.price}<span className="text-lg text-gray-400">{t.pricing.free.period}</span></div>
              <p className="text-gray-400 mb-6">{t.pricing.free.credits}</p>
              <ul className="space-y-3 mb-8">{t.pricing.free.features.map((f: string, i: number) => (<li key={i} className="flex items-center gap-2 text-gray-300"><span className="text-green-400">✓</span>{f}</li>))}</ul>
              <Link href="/register" className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-center rounded-lg font-semibold transition">{t.pricing.free.cta}</Link>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-2xl p-8 relative">
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">{t.pricing.pro.badge}</div>
              <h3 className="text-2xl font-bold mb-2">{t.pricing.pro.name}</h3>
              <div className="text-4xl font-bold mb-2">{t.pricing.pro.price}<span className="text-lg text-gray-400">{t.pricing.pro.period}</span></div>
              <p className="text-gray-400 mb-6">{t.pricing.pro.credits}</p>
              <ul className="space-y-3 mb-8">{t.pricing.pro.features.map((f: string, i: number) => (<li key={i} className="flex items-center gap-2 text-gray-300"><span className="text-purple-400">✓</span>{f}</li>))}</ul>
              <Link href="/pricing" className="block w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-center rounded-lg font-semibold transition shadow-lg">{t.pricing.pro.cta}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-6">{t.cta.title}</h2>
          <p className="text-xl text-gray-400 mb-8">{t.cta.subtitle}</p>
          <Link href="/register" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-lg shadow-2xl shadow-purple-500/50 transition transform hover:scale-105">{t.cta.button}</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"><span className="text-xl font-bold text-white">M</span></div>
                <span className="text-xl font-bold text-white">Media Tool Kit</span>
              </Link>
              <p className="text-gray-400 mb-4">{t.footer.desc}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2">
                <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-gray-400 hover:text-white transition">{t.nav.features}</a></li>
                <li><a href="#tools" onClick={(e) => scrollToSection(e, 'tools')} className="text-gray-400 hover:text-white transition">{t.nav.tools}</a></li>
                <li><a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-gray-400 hover:text-white transition">{t.nav.pricing}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.footer.info}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveModal('about')} className="text-gray-400 hover:text-white transition">{t.footer.about}</button></li>
                <li><button onClick={() => setActiveModal('contact')} className="text-gray-400 hover:text-white transition">{t.footer.contact}</button></li>
                <li><button onClick={() => setActiveModal('privacy')} className="text-gray-400 hover:text-white transition">{t.footer.privacy}</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400"><p>{t.footer.copyright}</p></div>
        </div>
      </footer>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl p-8">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition">✕</button>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{activeModal === 'about' ? t.footer.about : activeModal === 'contact' ? t.footer.contact : t.footer.privacy}</h2>
              <p className="text-gray-400">Media Tool Kit - AI-powered content creation tools.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
