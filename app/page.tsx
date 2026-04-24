'use client'
import { useState, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase } from '@/lib/supabase'

const texts: Record<string, any> = {
  en: {
    nav: { tools: 'Tools', pricing: 'Pricing', blog: 'Blog', login: 'Log in', getStarted: 'Get Started', dashboard: 'Dashboard' },
    hero: { badge: 'Trusted by 700+ content creators', title1: 'Create', title2: 'Viral Content', title3: '10x Faster with AI', subtitle: 'The ultimate AI toolkit for content creators. Generate hooks, scripts, captions, and discover viral trends.', cta: 'Start Creating Free', explore: 'Explore Tools' },
    stats: { tools: 'AI Tools', content: 'Content Created', languages: 'Languages', users: 'Users' },
    tools: { title: 'Powerful AI Tools', subtitle: 'Everything you need to create viral content', viewAll: 'View all 20 tools' },
    howItWorks: { title: 'How It Works', subtitle: 'Viral content in 3 steps', step1: 'Find Trends', step1Desc: 'Discover viral content in your niche with AI', step2: 'Generate Content', step2Desc: 'Create hooks, scripts, and captions', step3: 'Go Viral', step3Desc: 'Watch your content explode' },
    testimonials: { title: 'Loved by Creators', subtitle: 'What our users say' },
    pricing: { title: 'Simple Pricing', subtitle: 'Start free, upgrade when you need', starter: 'Starter', pro: 'Pro', agency: 'Agency', free: 'Free', month: '/mo', credits: 'credits', popular: 'POPULAR', features: { starter: ['All 20 Tools', '100 Credits/month', 'Watch Ads +10 Credits'], pro: ['All 20 Tools', '1000 Credits/month', 'Ad-Free', 'Priority Support'], agency: ['Unlimited Credits', 'Team Access', 'API Access'] }, cta: { starter: 'Start Free', pro: 'Go Pro', agency: 'Contact Us' } },
    cta: { title: 'Ready to Go Viral?', subtitle: 'Join 700+ content creators', button: 'Start Creating Free' },
    footer: { rights: 'All rights reserved.' }
  },
  tr: {
    nav: { tools: 'Araçlar', pricing: 'Fiyatlar', blog: 'Blog', login: 'Giriş', getStarted: 'Başla', dashboard: 'Dashboard' },
    hero: { badge: '700+ içerik üreticisi güveniyor', title1: 'Viral İçerik', title2: 'Üret', title3: 'AI ile 10 Kat Hızlı', subtitle: 'İçerik üreticileri için en kapsamlı AI araç seti.', cta: 'Ücretsiz Başla', explore: 'Araçları Keşfet' },
    stats: { tools: 'AI Araç', content: 'İçerik', languages: 'Dil', users: 'Kullanıcı' },
    tools: { title: 'Güçlü AI Araçları', subtitle: 'Viral içerik için ihtiyacın olan her şey', viewAll: 'Tüm 20 aracı gör' },
    howItWorks: { title: 'Nasıl Çalışır?', subtitle: '3 adımda viral içerik', step1: 'Trend Bul', step1Desc: 'AI ile viral içerikleri keşfet', step2: 'İçerik Üret', step2Desc: 'Hook, script ve caption oluştur', step3: 'Viral Ol', step3Desc: 'İçeriğinin patlamasını izle' },
    testimonials: { title: 'Kullanıcılarımız', subtitle: 'Ne diyorlar?' },
    pricing: { title: 'Basit Fiyatlandırma', subtitle: 'Ücretsiz başla', starter: 'Başlangıç', pro: 'Pro', agency: 'Agency', free: 'Ücretsiz', month: '/ay', credits: 'kredi', popular: 'POPÜLER', features: { starter: ['Tüm 20 Araç', '100 Kredi/ay', 'Reklam +10 Kredi'], pro: ['Tüm 20 Araç', '1000 Kredi/ay', 'Reklamsız', 'Öncelikli Destek'], agency: ['Sınırsız Kredi', 'Takım Erişimi', 'API'] }, cta: { starter: 'Ücretsiz Başla', pro: 'Pro Al', agency: 'İletişim' } },
    cta: { title: 'Viral Olmaya Hazır mısın?', subtitle: '700+ içerik üreticisine katıl', button: 'Ücretsiz Başla' },
    footer: { rights: 'Tüm hakları saklıdır.' }
  },
  ru: {
    nav: { tools: 'Инструменты', pricing: 'Цены', blog: 'Блог', login: 'Войти', getStarted: 'Начать', dashboard: 'Панель' },
    hero: { badge: '700+ создателей доверяют', title1: 'Создавай', title2: 'Вирусный контент', title3: 'в 10 раз быстрее с ИИ', subtitle: 'Набор ИИ-инструментов для создателей контента.', cta: 'Начать бесплатно', explore: 'Инструменты' },
    stats: { tools: 'ИИ-инструментов', content: 'Контент', languages: 'Языков', users: 'Пользователей' },
    tools: { title: 'Мощные ИИ-инструменты', subtitle: 'Всё для вирусного контента', viewAll: 'Все 20 инструментов' },
    howItWorks: { title: 'Как это работает', subtitle: 'Вирусный контент за 3 шага', step1: 'Найти тренды', step1Desc: 'ИИ-анализ трендов', step2: 'Создать контент', step2Desc: 'Хуки, скрипты, подписи', step3: 'Стать вирусным', step3Desc: 'Смотри как контент взлетает' },
    testimonials: { title: 'Пользователи', subtitle: 'Что говорят' },
    pricing: { title: 'Простые цены', subtitle: 'Начни бесплатно', starter: 'Старт', pro: 'Про', agency: 'Агентство', free: 'Бесплатно', month: '/мес', credits: 'кредитов', popular: 'ПОПУЛЯРНЫЙ', features: { starter: ['Все 20 инструментов', '100 кредитов/мес', 'Реклама +10'], pro: ['Все 20 инструментов', '1000 кредитов/мес', 'Без рекламы', 'Приоритет'], agency: ['Безлимит', 'Команда', 'API'] }, cta: { starter: 'Бесплатно', pro: 'Про', agency: 'Связаться' } },
    cta: { title: 'Готов стать вирусным?', subtitle: 'Присоединяйся к 700+ создателям', button: 'Начать бесплатно' },
    footer: { rights: 'Все права защищены.' }
  },
  de: {
    nav: { tools: 'Tools', pricing: 'Preise', blog: 'Blog', login: 'Anmelden', getStarted: 'Starten', dashboard: 'Dashboard' },
    hero: { badge: '700+ Content-Ersteller vertrauen uns', title1: 'Erstelle', title2: 'Viralen Content', title3: '10x schneller mit KI', subtitle: 'Das ultimative KI-Toolkit für Content-Ersteller.', cta: 'Kostenlos starten', explore: 'Tools erkunden' },
    stats: { tools: 'KI-Tools', content: 'Inhalte', languages: 'Sprachen', users: 'Nutzer' },
    tools: { title: 'Leistungsstarke KI-Tools', subtitle: 'Alles für viralen Content', viewAll: 'Alle 20 Tools' },
    howItWorks: { title: 'So funktioniert es', subtitle: 'Viraler Content in 3 Schritten', step1: 'Trends finden', step1Desc: 'KI-Trendanalyse', step2: 'Content erstellen', step2Desc: 'Hooks, Skripte, Captions', step3: 'Viral gehen', step3Desc: 'Content explodiert' },
    testimonials: { title: 'Nutzer', subtitle: 'Was sie sagen' },
    pricing: { title: 'Einfache Preise', subtitle: 'Kostenlos starten', starter: 'Starter', pro: 'Pro', agency: 'Agentur', free: 'Kostenlos', month: '/Mo', credits: 'Credits', popular: 'BELIEBT', features: { starter: ['Alle 20 Tools', '100 Credits/Monat', 'Werbung +10'], pro: ['Alle 20 Tools', '1000 Credits/Monat', 'Werbefrei', 'Priorität'], agency: ['Unbegrenzt', 'Team', 'API'] }, cta: { starter: 'Kostenlos', pro: 'Pro', agency: 'Kontakt' } },
    cta: { title: 'Bereit viral zu gehen?', subtitle: '700+ Ersteller dabei', button: 'Kostenlos starten' },
    footer: { rights: 'Alle Rechte vorbehalten.' }
  },
  fr: {
    nav: { tools: 'Outils', pricing: 'Tarifs', blog: 'Blog', login: 'Connexion', getStarted: 'Commencer', dashboard: 'Tableau de bord' },
    hero: { badge: '700+ créateurs nous font confiance', title1: 'Créez du', title2: 'Contenu Viral', title3: '10x plus vite avec l\'IA', subtitle: 'La boîte à outils IA ultime pour les créateurs.', cta: 'Commencer gratuitement', explore: 'Explorer' },
    stats: { tools: 'Outils IA', content: 'Contenus', languages: 'Langues', users: 'Utilisateurs' },
    tools: { title: 'Outils IA Puissants', subtitle: 'Tout pour le contenu viral', viewAll: 'Voir les 20 outils' },
    howItWorks: { title: 'Comment ça marche', subtitle: 'Contenu viral en 3 étapes', step1: 'Trouver les tendances', step1Desc: 'Analyse IA', step2: 'Générer du contenu', step2Desc: 'Hooks, scripts, légendes', step3: 'Devenir viral', step3Desc: 'Le contenu explose' },
    testimonials: { title: 'Utilisateurs', subtitle: 'Ce qu\'ils disent' },
    pricing: { title: 'Tarifs Simples', subtitle: 'Commencez gratuitement', starter: 'Starter', pro: 'Pro', agency: 'Agence', free: 'Gratuit', month: '/mois', credits: 'crédits', popular: 'POPULAIRE', features: { starter: ['Tous les 20 outils', '100 crédits/mois', 'Pub +10'], pro: ['Tous les 20 outils', '1000 crédits/mois', 'Sans pub', 'Priorité'], agency: ['Illimité', 'Équipe', 'API'] }, cta: { starter: 'Gratuit', pro: 'Pro', agency: 'Contact' } },
    cta: { title: 'Prêt à devenir viral?', subtitle: '700+ créateurs', button: 'Commencer gratuitement' },
    footer: { rights: 'Tous droits réservés.' }
  }
}

const tools = [
  { icon: '🎣', name: 'Hook Generator', desc: 'Create scroll-stopping hooks', href: '/tools/hook-generator' },
  { icon: '✍️', name: 'Caption Generator', desc: 'Craft engaging captions', href: '/tools/caption-generator' },
  { icon: '🎬', name: 'Script Studio', desc: 'Write viral video scripts', href: '/tools/script-studio' },
  { icon: '📊', name: 'Viral Analyzer', desc: 'Analyze viral potential', href: '/tools/viral-analyzer' },
  { icon: '🎯', name: 'Steal This Video', desc: 'Reverse engineer viral content', href: '/tools/steal-video' },
  { icon: '📅', name: 'Content Planner', desc: '30-day content calendar', href: '/tools/content-planner' },
  { icon: '📡', name: 'Trend Radar', desc: 'Catch trends early', href: '/tools/trend-radar' },
  { icon: '🕵️', name: 'Competitor Spy', desc: 'Analyze competitors', href: '/tools/competitor-spy' },
  { icon: '#️⃣', name: 'Hashtag Research', desc: 'Find the best hashtags', href: '/tools/hashtag-research' },
  { icon: '♻️', name: 'Content Repurposer', desc: 'Repurpose for all platforms', href: '/tools/content-repurposer' },
  { icon: '⚔️', name: 'A/B Tester', desc: 'Compare content versions', href: '/tools/ab-tester' },
  { icon: '🎠', name: 'Carousel Planner', desc: 'Plan carousel posts', href: '/tools/carousel-planner' },
  { icon: '🧵', name: 'Thread Composer', desc: 'Write viral threads', href: '/tools/thread-composer' },
  { icon: '🚀', name: 'Engagement Booster', desc: 'Boost your engagement', href: '/tools/engagement-booster' },
  { icon: '⏰', name: 'Posting Optimizer', desc: 'Best posting times', href: '/tools/posting-optimizer' },
  { icon: '⚡', name: 'Viral Score Predictor', desc: 'Real-time viral scoring', href: '/tools/viral-score' },
  { icon: '📝', name: 'Bio Generator', desc: 'Platform-perfect bios', href: '/tools/bio-generator' },
  { icon: '💡', name: 'Video Idea Generator', desc: 'Shoot-ready video ideas', href: '/tools/video-ideas' },
  { icon: '📱', name: 'QR Code Generator', desc: 'Custom QR codes (Free)', href: '/tools/qr-generator' },
  { icon: '🔗', name: 'Link in Bio Builder', desc: 'Bio page creator (Free)', href: '/tools/link-in-bio' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'TikTok Creator', text: 'Went from 1K to 100K followers in 3 months!', avatar: '👩‍🦰' },
  { name: 'Alex K.', role: 'Social Media Manager', text: 'I save 10+ hours every week with these tools.', avatar: '👨‍💼' },
  { name: 'Maria L.', role: 'Instagram Influencer', text: 'The hook generator is absolutely insane!', avatar: '👩‍🎤' },
]

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const { language, setLanguage } = useLanguage()
  const t = texts[language] || texts.en

  // Sayfa yüklendiğinde scroll pozisyonunu restore et, sonra sayfayı göster
  useLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem('homeScrollPosition')
    if (savedPosition && parseInt(savedPosition) > 0) {
      window.scrollTo({ top: parseInt(savedPosition), behavior: 'instant' })
    }
    // Scroll tamamlandıktan sonra sayfayı göster
    setIsReady(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      // Ana sayfa scroll pozisyonunu kaydet
      sessionStorage.setItem('homeScrollPosition', window.scrollY.toString())
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })
  }, [])

  return (
    <div className={`min-h-screen bg-[#0a0a0f] text-white transition-opacity duration-100 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg sm:text-xl font-bold">M</div>
            <span className="text-lg sm:text-xl font-bold hidden sm:block">MediaToolkit</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#tools" className="text-gray-400 hover:text-white transition text-sm">{t.nav.tools}</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition text-sm">{t.nav.pricing}</a>
            <Link href="/blog" className="text-gray-400 hover:text-white transition text-sm">{t.nav.blog}</Link>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative group">
              <button className="px-2 py-1.5 text-sm text-gray-400 hover:text-white transition">🌐 {language.toUpperCase()}</button>
              <div className="absolute right-0 mt-2 w-28 bg-[#1a1a2e] border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 z-50">
                {['en','tr','ru','de','fr'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as any)} className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 ${language === l ? 'text-purple-400' : 'text-gray-400'}`}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium hover:opacity-90 transition">
                {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-gray-400 hover:text-white transition text-sm hidden sm:block">{t.nav.login}</Link>
                <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium hover:opacity-90 transition">
                  {t.nav.getStarted}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {t.hero.badge}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
            {t.hero.title1}{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">{t.hero.title2}</span>
            <br />{t.hero.title3}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">{t.hero.subtitle}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2">
              {t.hero.cta} <span>→</span>
            </Link>
            <a href="#tools" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-semibold text-lg hover:bg-white/10 transition text-center">
              {t.hero.explore}
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/5">
            {[
              { value: '20+', label: t.stats.tools },
              { value: '35K+', label: t.stats.content },
              { value: '5', label: t.stats.languages },
              { value: '700+', label: t.stats.users },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t.tools.title}</h2>
            <p className="text-lg sm:text-xl text-gray-400">{t.tools.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, i) => (
              <Link key={i} href={isLoggedIn ? tool.href : '/register'} className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-purple-500/30 transition-all">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition">{tool.name}</h3>
                <p className="text-gray-500 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href={isLoggedIn ? '/dashboard' : '/register'} className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
              {t.tools.viewAll} <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t.howItWorks.title}</h2>
            <p className="text-lg sm:text-xl text-gray-400">{t.howItWorks.subtitle}</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { num: '01', title: t.howItWorks.step1, desc: t.howItWorks.step1Desc },
              { num: '02', title: t.howItWorks.step2, desc: t.howItWorks.step2Desc },
              { num: '03', title: t.howItWorks.step3, desc: t.howItWorks.step3Desc },
            ].map((step, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="text-6xl font-bold text-white/5 mb-4">{step.num}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t.testimonials.title}</h2>
            <p className="text-lg sm:text-xl text-gray-400">{t.testimonials.subtitle}</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
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
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t.pricing.title}</h2>
            <p className="text-lg sm:text-xl text-gray-400">{t.pricing.subtitle}</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
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
              <Link href={isLoggedIn ? "/dashboard" : "/register"} className="block w-full py-3 rounded-full text-center font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition">
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
              <Link href={isLoggedIn ? "/pricing" : "/register"} className="block w-full py-3 rounded-full text-center font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition">
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
              <div className="text-sm text-gray-400 mb-6">Unlimited</div>
              <ul className="space-y-3 mb-8">
                {t.pricing.features.agency.map((f: string, j: number) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={isLoggedIn ? "/pricing" : "/register"} className="block w-full py-3 rounded-full text-center font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition">
                {t.pricing.cta.agency}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-white/5 rounded-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t.cta.title}</h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-8">{t.cta.subtitle}</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold text-lg hover:opacity-90 transition">
              {t.cta.button} <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">M</div>
              <span className="font-semibold">MediaToolkit</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" onClick={() => sessionStorage.setItem('homeScrollPosition', window.scrollY.toString())} className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" onClick={() => sessionStorage.setItem('homeScrollPosition', window.scrollY.toString())} className="hover:text-white transition">Terms</Link>
              <Link href="/contact" onClick={() => sessionStorage.setItem('homeScrollPosition', window.scrollY.toString())} className="hover:text-white transition">Contact</Link>
              <Link href="/faq" onClick={() => sessionStorage.setItem('homeScrollPosition', window.scrollY.toString())} className="hover:text-white transition">FAQ</Link>
              <Link href="/blog" onClick={() => sessionStorage.setItem('homeScrollPosition', window.scrollY.toString())} className="hover:text-white transition">Blog</Link>
            </div>
            <div className="text-sm text-gray-500">© 2026 MediaToolkit. {t.footer.rights}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
