'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase } from '@/lib/supabase'

const texts: any = {
  tr: {
    nav: { tools: 'Araçlar', pricing: 'Fiyatlar', reviews: 'Yorumlar', login: 'Giriş Yap', getStarted: 'Başla', dashboard: 'Dashboard' },
    hero: { badge: '10.000+ içerik üreticisi tarafından güveniliyor', title1: 'Viral İçerik', title2: 'Üret', title3: 'AI ile 10 Kat Hızlı', subtitle: 'İçerik üreticileri için en kapsamlı AI araç seti. Hook, script, caption üret ve viral trendleri keşfet — hepsi tek yerde.', cta: 'Ücretsiz Başla', explore: 'Araçları Keşfet' },
    stats: { tools: 'AI Araç', content: 'İçerik Üretildi', languages: 'Dil', powered: 'AI Destekli' },
    tools: { title: 'Güçlü AI Araçları', subtitle: 'Viral içerik üretmek için ihtiyacın olan her şey', viewAll: 'Tüm 16 aracı gör' },
    howItWorks: { title: 'Nasıl Çalışır?', subtitle: 'Fikirden viral içeriğe dakikalar içinde', step1: 'Trendleri Keşfet', step1Desc: 'AI destekli trend analizi ile nişindeki viral içerikleri bul', step2: 'İçerik Üret', step2Desc: 'Engagement için optimize edilmiş hook, script ve caption oluştur', step3: 'Viral Ol', step3Desc: 'Mükemmel zamanda paylaş ve içeriğinin patlamasını izle' },
    testimonials: { title: 'Üreticiler Tarafından Seviliyor', subtitle: 'Kullanıcılarımız ne diyor' },
    pricing: { title: 'Basit Fiyatlandırma', subtitle: 'Ücretsiz başla, ihtiyacın olduğunda yükselt', starter: 'Başlangıç', pro: 'Pro', agency: 'Agency', free: 'Ücretsiz', month: '/ay', credits: 'kredi', features: { starter: ['Tüm 16 Araç', '100 Kredi/ay', 'Reklam ile +10 Kredi', 'Temel Destek'], pro: ['Tüm 16 Araç', '1000 Kredi/ay', 'Öncelikli Destek', 'Filigran Yok', 'Reklamsız'], agency: ['Sınırsız Kredi', 'Takım Erişimi (5 kişi)', 'API Erişimi', 'Özel Destek'] }, cta: { starter: 'Ücretsiz Başla', pro: 'Pro\'ya Geç', agency: 'İletişime Geç' }, popular: 'EN POPÜLER' },
    cta: { title: 'Viral Olmaya Hazır mısın?', subtitle: 'MediaToolkit ile daha hızlı büyüyen 10.000+ üreticiye katıl', button: 'Ücretsiz Başla' },
    footer: { privacy: 'Gizlilik', terms: 'Şartlar', contact: 'İletişim', rights: 'Tüm hakları saklıdır.' }
  },
  en: {
    nav: { tools: 'Tools', pricing: 'Pricing', reviews: 'Reviews', login: 'Log in', getStarted: 'Get Started', dashboard: 'Dashboard' },
    hero: { badge: 'Trusted by 10,000+ content creators', title1: 'Create', title2: 'Viral Content', title3: '10x Faster with AI', subtitle: 'The ultimate AI toolkit for content creators. Generate hooks, scripts, captions, and discover viral trends — all in one place.', cta: 'Start Creating Free', explore: 'Explore Tools' },
    stats: { tools: 'AI Tools', content: 'Content Created', languages: 'Languages', powered: 'AI Powered' },
    tools: { title: 'Powerful AI Tools', subtitle: 'Everything you need to create viral content', viewAll: 'View all 16 tools' },
    howItWorks: { title: 'How It Works', subtitle: 'From idea to viral content in minutes', step1: 'Discover Trends', step1Desc: 'Find viral content in your niche with AI-powered trend analysis', step2: 'Generate Content', step2Desc: 'Create hooks, scripts, and captions optimized for engagement', step3: 'Go Viral', step3Desc: 'Post at the perfect time and watch your content explode' },
    testimonials: { title: 'Loved by Creators', subtitle: 'See what our users are saying' },
    pricing: { title: 'Simple Pricing', subtitle: 'Start free, upgrade when you need', starter: 'Starter', pro: 'Pro', agency: 'Agency', free: 'Free', month: '/mo', credits: 'credits', features: { starter: ['All 16 Tools', '100 Credits/month', 'Watch Ads for +10 Credits', 'Basic Support'], pro: ['All 16 Tools', '1000 Credits/month', 'Priority Support', 'No Watermarks', 'Ad-Free'], agency: ['Unlimited Credits', 'Team Access (5 seats)', 'API Access', 'Dedicated Support'] }, cta: { starter: 'Start Free', pro: 'Go Pro', agency: 'Contact Us' }, popular: 'MOST POPULAR' },
    cta: { title: 'Ready to Go Viral?', subtitle: 'Join 10,000+ creators who are growing faster with MediaToolkit', button: 'Start Creating Free' },
    footer: { privacy: 'Privacy', terms: 'Terms', contact: 'Contact', rights: 'All rights reserved.' }
  },
  ru: {
    nav: { tools: 'Инструменты', pricing: 'Цены', reviews: 'Отзывы', login: 'Войти', getStarted: 'Начать', dashboard: 'Панель' },
    hero: { badge: 'Доверяют 10,000+ создателей контента', title1: 'Создавайте', title2: 'Вирусный контент', title3: 'в 10 раз быстрее с ИИ', subtitle: 'Лучший набор ИИ-инструментов для создателей контента.', cta: 'Начать бесплатно', explore: 'Инструменты' },
    stats: { tools: 'ИИ инструментов', content: 'Контента создано', languages: 'Языков', powered: 'ИИ' },
    tools: { title: 'Мощные ИИ инструменты', subtitle: 'Всё для создания вирусного контента', viewAll: 'Все 16 инструментов' },
    howItWorks: { title: 'Как это работает', subtitle: 'От идеи до вирусного контента за минуты', step1: 'Найдите тренды', step1Desc: 'ИИ-анализ трендов', step2: 'Создайте контент', step2Desc: 'Хуки, скрипты, подписи', step3: 'Станьте вирусным', step3Desc: 'Публикуйте в лучшее время' },
    testimonials: { title: 'Любимый создателями', subtitle: 'Отзывы пользователей' },
    pricing: { title: 'Простые цены', subtitle: 'Начните бесплатно', starter: 'Старт', pro: 'Про', agency: 'Агентство', free: 'Бесплатно', month: '/мес', credits: 'кредитов', features: { starter: ['Все 16 инструментов', '100 кредитов/мес', 'Реклама +10 кредитов', 'Базовая поддержка'], pro: ['Все 16 инструментов', '1000 кредитов/мес', 'Приоритет', 'Без водяных знаков', 'Без рекламы'], agency: ['Безлимит', 'Команда (5 мест)', 'API', 'Выделенная поддержка'] }, cta: { starter: 'Бесплатно', pro: 'Про', agency: 'Связаться' }, popular: 'ПОПУЛЯРНЫЙ' },
    cta: { title: 'Готовы стать вирусным?', subtitle: 'Присоединяйтесь к 10,000+ создателей', button: 'Начать бесплатно' },
    footer: { privacy: 'Конфиденциальность', terms: 'Условия', contact: 'Контакты', rights: 'Все права защищены.' }
  },
  de: {
    nav: { tools: 'Tools', pricing: 'Preise', reviews: 'Bewertungen', login: 'Anmelden', getStarted: 'Starten', dashboard: 'Dashboard' },
    hero: { badge: 'Vertraut von 10.000+ Content-Erstellern', title1: 'Erstelle', title2: 'Viralen Content', title3: '10x schneller mit KI', subtitle: 'Das ultimative KI-Toolkit für Content-Ersteller.', cta: 'Kostenlos starten', explore: 'Tools erkunden' },
    stats: { tools: 'KI-Tools', content: 'Inhalte erstellt', languages: 'Sprachen', powered: 'KI-Betrieben' },
    tools: { title: 'Leistungsstarke KI-Tools', subtitle: 'Alles für viralen Content', viewAll: 'Alle 16 Tools' },
    howItWorks: { title: 'So funktioniert es', subtitle: 'Von der Idee zum viralen Content', step1: 'Trends entdecken', step1Desc: 'KI-gestützte Trendanalyse', step2: 'Content erstellen', step2Desc: 'Hooks, Skripte, Captions', step3: 'Viral gehen', step3Desc: 'Zur perfekten Zeit posten' },
    testimonials: { title: 'Geliebt von Erstellern', subtitle: 'Was unsere Nutzer sagen' },
    pricing: { title: 'Einfache Preise', subtitle: 'Kostenlos starten', starter: 'Starter', pro: 'Pro', agency: 'Agentur', free: 'Kostenlos', month: '/Monat', credits: 'Credits', features: { starter: ['Alle 16 Tools', '100 Credits/Monat', 'Werbung +10 Credits', 'Basis-Support'], pro: ['Alle 16 Tools', '1000 Credits/Monat', 'Priorität', 'Keine Wasserzeichen', 'Werbefrei'], agency: ['Unbegrenzt', 'Team (5 Plätze)', 'API', 'Dedizierter Support'] }, cta: { starter: 'Kostenlos', pro: 'Pro werden', agency: 'Kontakt' }, popular: 'BELIEBTESTE' },
    cta: { title: 'Bereit viral zu gehen?', subtitle: 'Schließe dich 10.000+ Erstellern an', button: 'Kostenlos starten' },
    footer: { privacy: 'Datenschutz', terms: 'AGB', contact: 'Kontakt', rights: 'Alle Rechte vorbehalten.' }
  },
  fr: {
    nav: { tools: 'Outils', pricing: 'Tarifs', reviews: 'Avis', login: 'Connexion', getStarted: 'Commencer', dashboard: 'Tableau de bord' },
    hero: { badge: 'Approuvé par 10 000+ créateurs de contenu', title1: 'Créez du', title2: 'Contenu Viral', title3: '10x plus vite avec l\'IA', subtitle: 'La boîte à outils IA ultime pour les créateurs de contenu.', cta: 'Commencer gratuitement', explore: 'Explorer les outils' },
    stats: { tools: 'Outils IA', content: 'Contenus créés', languages: 'Langues', powered: 'IA' },
    tools: { title: 'Outils IA Puissants', subtitle: 'Tout pour créer du contenu viral', viewAll: 'Voir les 16 outils' },
    howItWorks: { title: 'Comment ça marche', subtitle: 'De l\'idée au contenu viral en minutes', step1: 'Découvrir les tendances', step1Desc: 'Analyse des tendances par IA', step2: 'Générer du contenu', step2Desc: 'Hooks, scripts, légendes', step3: 'Devenir viral', step3Desc: 'Publier au bon moment' },
    testimonials: { title: 'Adoré par les créateurs', subtitle: 'Ce que disent nos utilisateurs' },
    pricing: { title: 'Tarification Simple', subtitle: 'Commencez gratuitement', starter: 'Débutant', pro: 'Pro', agency: 'Agence', free: 'Gratuit', month: '/mois', credits: 'crédits', features: { starter: ['Tous les 16 outils', '100 crédits/mois', 'Pub +10 crédits', 'Support basique'], pro: ['Tous les 16 outils', '1000 crédits/mois', 'Priorité', 'Sans filigrane', 'Sans pub'], agency: ['Illimité', 'Équipe (5 places)', 'API', 'Support dédié'] }, cta: { starter: 'Gratuit', pro: 'Passer Pro', agency: 'Contacter' }, popular: 'POPULAIRE' },
    cta: { title: 'Prêt à devenir viral?', subtitle: 'Rejoignez 10 000+ créateurs', button: 'Commencer gratuitement' },
    footer: { privacy: 'Confidentialité', terms: 'Conditions', contact: 'Contact', rights: 'Tous droits réservés.' }
  }
}

const tools = [
  { icon: '🔍', name: 'Viral Video Finder', nameKey: 'videoFinder', desc: 'Discover trending content in your niche' },
  { icon: '🎣', name: 'Hook Generator Pro', nameKey: 'hookGen', desc: 'Create scroll-stopping hooks' },
  { icon: '🎬', name: 'Script Studio', nameKey: 'scriptStudio', desc: 'Write viral video scripts' },
  { icon: '✍️', name: 'Caption Generator', nameKey: 'captionGen', desc: 'Craft engaging captions' },
  { icon: '🎯', name: 'Steal This Video', nameKey: 'stealVideo', desc: 'Reverse engineer viral content' },
  { icon: '📅', name: 'Content Calendar', nameKey: 'calendar', desc: '30-day content planning' },
  { icon: '📡', name: 'Trend Radar', nameKey: 'trendRadar', desc: 'Catch trends before they peak' },
  { icon: '🚀', name: 'Engagement Booster', nameKey: 'engagement', desc: 'Maximize your engagement' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'TikTok Creator', text: 'MediaToolkit helped me go from 1K to 100K followers in 3 months!', avatar: '👩‍🦰' },
  { name: 'Alex K.', role: 'Social Media Manager', text: 'I save 10+ hours every week. The content calendar is a game-changer.', avatar: '👨‍💼' },
  { name: 'Maria L.', role: 'Instagram Influencer', text: 'The hook generator is insane. My reels finally get the views they deserve.', avatar: '👩‍🎤' },
]

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Session kontrolü
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden scroll-smooth">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">M</div>
            <span className="text-xl font-bold">MediaToolkit</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#tools" onClick={(e) => scrollToSection(e, 'tools')} className="text-gray-400 hover:text-white transition">{t.nav.tools}</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-gray-400 hover:text-white transition">{t.nav.pricing}</a>
            <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="text-gray-400 hover:text-white transition">{t.nav.reviews}</a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition">🌐 {language.toUpperCase()}</button>
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:opacity-90 transition">{t.nav.dashboard}</Link>
            ) : (
              <>
                <Link href="/login" className="text-gray-400 hover:text-white transition">{t.nav.login}</Link>
                <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:opacity-90 transition">{t.nav.getStarted}</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {t.hero.badge}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            {t.hero.title1} <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">{t.hero.title2}</span>
            <br />{t.hero.title3}
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">{t.hero.subtitle}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2">
              {t.hero.cta} <span>→</span>
            </Link>
            <a href="#tools" onClick={(e) => scrollToSection(e, 'tools')} className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-semibold text-lg hover:bg-white/10 transition">
              {t.hero.explore}
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/5">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">16+</div>
              <div className="text-gray-500 mt-1">{t.stats.tools}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">50K+</div>
              <div className="text-gray-500 mt-1">{t.stats.content}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">5</div>
              <div className="text-gray-500 mt-1">{t.stats.languages}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
              <div className="text-gray-500 mt-1">{t.stats.powered}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.tools.title}</h2>
            <p className="text-xl text-gray-400">{t.tools.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, i) => (
              <div key={i} className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-300">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition">{tool.name}</h3>
                <p className="text-gray-500 text-sm">{tool.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/login" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
              {t.tools.viewAll} <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.howItWorks.title}</h2>
            <p className="text-xl text-gray-400">{t.howItWorks.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="text-6xl font-bold text-white/5 mb-4">01</div>
              <h3 className="text-xl font-semibold mb-2">{t.howItWorks.step1}</h3>
              <p className="text-gray-500">{t.howItWorks.step1Desc}</p>
            </div>
            <div className="relative">
              <div className="text-6xl font-bold text-white/5 mb-4">02</div>
              <h3 className="text-xl font-semibold mb-2">{t.howItWorks.step2}</h3>
              <p className="text-gray-500">{t.howItWorks.step2Desc}</p>
            </div>
            <div className="relative">
              <div className="text-6xl font-bold text-white/5 mb-4">03</div>
              <h3 className="text-xl font-semibold mb-2">{t.howItWorks.step3}</h3>
              <p className="text-gray-500">{t.howItWorks.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.testimonials.title}</h2>
            <p className="text-xl text-gray-400">{t.testimonials.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl">{item.avatar}</div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.role}</div>
                  </div>
                </div>
                <p className="text-gray-400">"{item.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[1,2,3,4,5].map(n => <span key={n} className="text-yellow-400">★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.pricing.title}</h2>
            <p className="text-xl text-gray-400">{t.pricing.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="p-6 rounded-2xl border bg-white/[0.02] border-white/5">
              <h3 className="text-xl font-semibold mb-2">{t.pricing.starter}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <div className="text-sm text-gray-400 mb-6">100 {t.pricing.credits}</div>
              <ul className="space-y-3 mb-8">
                {t.pricing.features.starter.map((f: string, j: number) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full py-3 rounded-full text-center font-semibold transition bg-white/5 border border-white/10 text-white hover:bg-white/10">
                {t.pricing.cta.starter}
              </Link>
            </div>

            {/* Pro */}
            <div className="relative p-6 rounded-2xl border bg-gradient-to-b from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold">{t.pricing.popular}</div>
              <h3 className="text-xl font-semibold mb-2">{t.pricing.pro}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-gray-500">{t.pricing.month}</span>
              </div>
              <div className="text-sm text-gray-400 mb-6">1000 {t.pricing.credits}</div>
              <ul className="space-y-3 mb-8">
                {t.pricing.features.pro.map((f: string, j: number) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full py-3 rounded-full text-center font-semibold transition bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90">
                {t.pricing.cta.pro}
              </Link>
            </div>

            {/* Agency */}
            <div className="p-6 rounded-2xl border bg-white/[0.02] border-white/5">
              <h3 className="text-xl font-semibold mb-2">{t.pricing.agency}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$14.99</span>
                <span className="text-gray-500">{t.pricing.month}</span>
              </div>
              <div className="text-sm text-gray-400 mb-6">Unlimited {t.pricing.credits}</div>
              <ul className="space-y-3 mb-8">
                {t.pricing.features.agency.map((f: string, j: number) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block w-full py-3 rounded-full text-center font-semibold transition bg-white/5 border border-white/10 text-white hover:bg-white/10">
                {t.pricing.cta.agency}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-white/5 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.cta.title}</h2>
            <p className="text-xl text-gray-400 mb-8">{t.cta.subtitle}</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:opacity-90 transition">
              {t.cta.button} <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">M</div>
              <span className="font-semibold">MediaToolkit</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition">{t.footer.privacy}</Link>
              <Link href="/terms" className="hover:text-white transition">{t.footer.terms}</Link>
              <Link href="/contact" className="hover:text-white transition">{t.footer.contact}</Link>
            </div>
            <div className="text-sm text-gray-500">© 2025 MediaToolkit. {t.footer.rights}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
