'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | 'privacy' | null>(null)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    checkUser()
  }, [])

  // Smooth scroll function
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
    }
  }

  const features = [
    {
      icon: '📹',
      title: 'Video Tools',
      titleTr: 'Video Araçları',
      description: 'Subtitle generator, script writer and more',
      descriptionTr: 'Alt yazı ekleme, script yazma ve daha fazlası',
    },
    {
      icon: '✍️',
      title: 'Content Creation',
      titleTr: 'İçerik Üretimi',
      description: 'Hooks, captions, and platform adapters',
      descriptionTr: 'Hook, caption ve platform adaptörleri',
    },
    {
      icon: '📊',
      title: 'Analytics',
      titleTr: 'Analiz',
      description: 'Competitor analysis, trends, engagement',
      descriptionTr: 'Rakip analizi, trendler, etkileşim',
    },
    {
      icon: '⚡',
      title: 'Optimization',
      titleTr: 'Optimizasyon',
      description: 'Hashtags, bio generator, QR codes',
      descriptionTr: 'Hashtag, bio oluşturma, QR kod',
    },
    {
      icon: '🚀',
      title: 'AI-Powered',
      titleTr: 'Yapay Zeka',
      description: 'Viral score predictor, brand voice analyzer',
      descriptionTr: 'Viral tahmin, marka sesi analizi',
    },
    {
      icon: '🗓️',
      title: 'Planning',
      titleTr: 'Planlama',
      description: 'Content calendar, post scheduler',
      descriptionTr: 'İçerik takvimi, paylaşım planlayıcı',
    },
  ]

  const stats = [
    { number: '16+', label: 'Tools', labelTr: 'Araç' },
    { number: '10K+', label: 'Users', labelTr: 'Kullanıcı' },
    { number: '50K+', label: 'Contents Created', labelTr: 'Oluşturulan İçerik' },
    { number: '4.9', label: 'Rating', labelTr: 'Puan' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Önceki Tasarım */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Media
                </span>
                <span className="text-xl font-bold text-white">
                  Tool Kit
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-gray-300 hover:text-white transition">
                {language === 'tr' ? 'Özellikler' : 'Features'}
              </a>
              <a href="#tools" onClick={(e) => scrollToSection(e, 'tools')} className="text-gray-300 hover:text-white transition">
                {language === 'tr' ? 'Araçlar' : 'Tools'}
              </a>
              <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-gray-300 hover:text-white transition">
                {language === 'tr' ? 'Fiyatlandırma' : 'Pricing'}
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex items-center bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    language === 'en' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('tr')}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    language === 'tr' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  TR
                </button>
              </div>

              {user ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition shadow-lg"
                >
                  {language === 'tr' ? 'Panel' : 'Dashboard'}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white transition"
                  >
                    {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition shadow-lg"
                  >
                    {language === 'tr' ? 'Başla' : 'Get Started'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm font-medium text-purple-300">
              {language === 'tr' ? '16 Profesyonel Araç Mevcut' : '16 Professional Tools Available'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {language === 'tr' ? 'Viral İçerikler Üret' : 'Create Viral Content'}
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {language === 'tr' ? '10x Daha Hızlı' : '10x Faster'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            {language === 'tr' 
              ? 'İçerik üreticileri için yapay zeka destekli araçlar. Caption oluştur, trendleri analiz et, paylaşımları planla ve viral potansiyeli tahmin et - hepsi tek platformda.'
              : 'AI-powered tools for content creators. Generate captions, analyze trends, schedule posts, and predict viral potential - all in one platform.'
            }
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-lg shadow-2xl shadow-purple-500/50 transition transform hover:scale-105"
            >
              {language === 'tr' ? 'Ücretsiz Dene' : 'Start Free Trial'}
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-bold text-lg transition transform hover:scale-105"
            >
              {language === 'tr' ? 'Araçları Keşfet' : 'Explore Tools'}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{language === 'tr' ? stat.labelTr : stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {language === 'tr' ? 'Viral Olman İçin' : 'Everything You Need to'}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {language === 'tr' ? ' Gereken Her Şey' : ' Go Viral'}
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              {language === 'tr' 
                ? 'Modern içerik üreticileri için tasarlanmış profesyonel araçlar'
                : 'Professional tools designed for modern content creators'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition">
                  {language === 'tr' ? feature.titleTr : feature.title}
                </h3>
                <p className="text-gray-400">
                  {language === 'tr' ? feature.descriptionTr : feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Showcase */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {language === 'tr' ? '16 Güçlü Araç' : '16 Powerful Tools'}
              </span>
              <br />
              {language === 'tr' ? 'Tek Platform' : 'One Platform'}
            </h2>
            <p className="text-xl text-gray-400">
              {language === 'tr' 
                ? 'İçerik üretiminden analize, her şeyi kapsıyoruz'
                : "From content creation to analytics, we've got you covered"
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tools */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{language === 'tr' ? 'Ücretsiz Araçlar' : 'Free Tools'}</h3>
                  <p className="text-green-400">{language === 'tr' ? 'Kredi kartı gerekmez' : 'No credit card required'}</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {language === 'tr' ? 'Bio Oluşturucu' : 'Bio Generator'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {language === 'tr' ? 'QR Kod Oluşturucu' : 'QR Code Generator'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {language === 'tr' ? 'Post Planlayıcı' : 'Post Scheduler'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {language === 'tr' ? 'İçerik Takvimi' : 'Content Calendar'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {language === 'tr' ? 'Viral Skor Tahmin' : 'Viral Score Predictor'}
                </li>
              </ul>
            </div>

            {/* Premium Tools */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{language === 'tr' ? 'Premium Araçlar' : 'Premium Tools'}</h3>
                  <p className="text-purple-400">{language === 'tr' ? 'Yapay zeka destekli özellikler' : 'AI-powered features'}</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {language === 'tr' ? 'Alt Yazı Ekleyici' : 'Subtitle Generator'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {language === 'tr' ? 'Video Script Yazıcı' : 'Video Script Writer'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {language === 'tr' ? 'Rakip Analizi' : 'Competitor Analysis'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {language === 'tr' ? 'Trend Dedektörü' : 'Trend Detector'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {language === 'tr' ? 've 7 tane daha...' : 'And 7 more...'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {language === 'tr' ? 'Basit, Şeffaf' : 'Simple, Transparent'}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {language === 'tr' ? ' Fiyatlandırma' : ' Pricing'}
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              {language === 'tr' 
                ? 'Ücretsiz başla, ihtiyacın olduğunda yükselt'
                : 'Start free, upgrade when you need more'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2">{language === 'tr' ? 'Ücretsiz' : 'Free'}</h3>
              <div className="text-4xl font-bold mb-6">
                $0
                <span className="text-lg text-gray-400">/{language === 'tr' ? 'ay' : 'month'}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {language === 'tr' ? '50 kredi/ay' : '50 credits/month'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {language === 'tr' ? '5 ücretsiz araç' : '5 free tools'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  {language === 'tr' ? 'Temel destek' : 'Basic support'}
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-center rounded-lg font-semibold transition"
              >
                {language === 'tr' ? 'Başla' : 'Get Started'}
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-2xl p-8 relative">
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                {language === 'tr' ? 'POPÜLER' : 'POPULAR'}
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">
                $29
                <span className="text-lg text-gray-400">/{language === 'tr' ? 'ay' : 'month'}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {language === 'tr' ? '500 kredi/ay' : '500 credits/month'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {language === 'tr' ? 'Tüm 16 araç' : 'All 16 tools'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {language === 'tr' ? 'Öncelikli destek' : 'Priority support'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  {language === 'tr' ? 'API erişimi' : 'API access'}
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-center rounded-lg font-semibold transition shadow-lg"
              >
                {language === 'tr' ? 'Ücretsiz Dene' : 'Start Free Trial'}
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2">{language === 'tr' ? 'Kurumsal' : 'Enterprise'}</h3>
              <div className="text-4xl font-bold mb-6">
                {language === 'tr' ? 'Özel' : 'Custom'}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-blue-400">✓</span>
                  {language === 'tr' ? 'Sınırsız kredi' : 'Unlimited credits'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-blue-400">✓</span>
                  {language === 'tr' ? 'Özel entegrasyonlar' : 'Custom integrations'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-blue-400">✓</span>
                  {language === 'tr' ? 'Özel destek' : 'Dedicated support'}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-blue-400">✓</span>
                  {language === 'tr' ? 'Takım yönetimi' : 'Team management'}
                </li>
              </ul>
              <a
                href="mailto:contact@mediatoolkit.com"
                className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-center rounded-lg font-semibold transition"
              >
                {language === 'tr' ? 'İletişime Geç' : 'Contact Sales'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-6">
            {language === 'tr' ? 'Viral Olmaya Hazır mısın?' : 'Ready to Go Viral?'}
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            {language === 'tr'
              ? 'Harika içerikler üretmek için Media Tool Kit kullanan binlerce içerik üreticiye katıl'
              : 'Join thousands of creators using Media Tool Kit to create amazing content'
            }
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-lg shadow-2xl shadow-purple-500/50 transition transform hover:scale-105"
          >
            {language === 'tr' ? 'Ücretsiz Dene - 50 Kredi Bedava' : 'Start Free Trial - 50 Credits Free'}
          </Link>
        </div>
      </section>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              ✕
            </button>
            
            {/* About Modal */}
            {activeModal === 'about' && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {language === 'tr' ? 'Hakkımda' : 'About'}
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    {language === 'tr' 
                      ? 'Media Tool Kit, içerik üreticilerinin işini kolaylaştırmak için geliştirdiğim bireysel bir projedir. Sosyal medya içerik üretimini herkes için daha kolay, hızlı ve etkili hale getirmek amacıyla bu platformu oluşturdum.'
                      : 'Media Tool Kit is a personal project I developed to make content creators\' work easier. I created this platform to make social media content creation easier, faster, and more effective for everyone.'
                    }
                  </p>
                  <p>
                    {language === 'tr'
                      ? '16+ farklı AI destekli araçla hook oluşturmadan hashtag optimizasyonuna, video script yazımından rakip analizine kadar tüm ihtiyaçlarınızı tek bir platformda karşılıyorum.'
                      : 'With 16+ different AI-powered tools, I cover all your needs from hook generation to hashtag optimization, video script writing to competitor analysis - all in one platform.'
                    }
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400">16+</div>
                      <div className="text-sm text-gray-400">{language === 'tr' ? 'AI Araç' : 'AI Tools'}</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-pink-400">7/24</div>
                      <div className="text-sm text-gray-400">{language === 'tr' ? 'Erişim' : 'Access'}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                    <p className="text-sm">
                      {language === 'tr'
                        ? '💡 Bu proje sürekli geliştirilmektedir. Önerileriniz ve geri bildirimleriniz için her zaman açığım!'
                        : '💡 This project is continuously being developed. I\'m always open to your suggestions and feedback!'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contact Modal */}
            {activeModal === 'contact' && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📬</span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {language === 'tr' ? 'İletişim' : 'Contact'}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-300">
                    {language === 'tr'
                      ? 'Sorularınız, önerileriniz veya geri bildirimleriniz için benimle iletişime geçebilirsiniz.'
                      : 'Feel free to reach out to me for questions, suggestions, or feedback.'
                    }
                  </p>
                  
                  <div className="space-y-4">
                    <a 
                      href="mailto:ahmetemresozer@gmail.com"
                      className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition"
                    >
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                        📧
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">{language === 'tr' ? 'E-posta' : 'Email'}</div>
                        <div className="font-medium">ahmetemresozer@gmail.com</div>
                      </div>
                    </a>
                    
                    <a 
                      href="https://instagram.com/emreesozeer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center text-2xl">
                        📸
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Instagram</div>
                        <div className="font-medium">@emreesozeer</div>
                      </div>
                    </a>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                    <p className="text-sm text-gray-300">
                      {language === 'tr'
                        ? '💡 Geri bildirimleriniz projenin gelişmesi için çok değerli. Teşekkürler!'
                        : '💡 Your feedback is valuable for improving this project. Thank you!'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Privacy Modal */}
            {activeModal === 'privacy' && (
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
                  </h2>
                </div>
                
                <div className="space-y-6 text-gray-300 text-sm">
                  <div>
                    <h3 className="font-bold text-white mb-2">{language === 'tr' ? '1. Veri Toplama' : '1. Data Collection'}</h3>
                    <p>
                      {language === 'tr'
                        ? 'Hizmetleri sunmak için yalnızca gerekli veriler toplanmaktadır: e-posta adresi, kullanım istatistikleri ve oluşturulan içerikler. Verileriniz asla üçüncü taraflarla paylaşılmaz veya satılmaz.'
                        : 'Only necessary data is collected to provide services: email address, usage statistics, and created content. Your data is never shared with or sold to third parties.'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-white mb-2">{language === 'tr' ? '2. Veri Güvenliği' : '2. Data Security'}</h3>
                    <p>
                      {language === 'tr'
                        ? 'Verileriniz SSL şifrelemesi ile korunmaktadır. Güvenli sunucularda saklanan verileriniz en üst düzey güvenlik önlemleriyle muhafaza edilir.'
                        : 'Your data is protected with SSL encryption. Your data stored on secure servers is maintained with the highest security measures.'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-white mb-2">{language === 'tr' ? '3. Çerezler' : '3. Cookies'}</h3>
                    <p>
                      {language === 'tr'
                        ? 'Daha iyi bir kullanıcı deneyimi sunmak için çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.'
                        : 'Cookies are used to provide a better user experience. You can manage cookies through your browser settings.'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-white mb-2">{language === 'tr' ? '4. Haklarınız' : '4. Your Rights'}</h3>
                    <p>
                      {language === 'tr'
                        ? 'KVKK kapsamında verilerinize erişim, düzeltme ve silme hakkına sahipsiniz. Bu haklarınızı kullanmak için iletişim adresinden ulaşabilirsiniz.'
                        : 'Under GDPR, you have the right to access, correct, and delete your data. Contact me to exercise these rights.'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-white mb-2">{language === 'tr' ? '5. İçerik Kullanımı' : '5. Content Usage'}</h3>
                    <p>
                      {language === 'tr'
                        ? 'AI araçlarıyla oluşturduğunuz içerikler tamamen size aittir. Bu içerikleri ticari veya kişisel amaçlarla özgürce kullanabilirsiniz.'
                        : 'Content created with AI tools belongs entirely to you. You can freely use this content for commercial or personal purposes.'
                      }
                    </p>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-700/50 rounded-xl">
                    <p className="text-xs text-gray-400">
                      {language === 'tr'
                        ? 'Son güncelleme: Ocak 2025. Sorularınız için ahmetemresozer@gmail.com adresine yazabilirsiniz.'
                        : 'Last updated: January 2025. For questions, email ahmetemresozer@gmail.com'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & About */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">M</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Media
                  </span>
                  <span className="text-xl font-bold text-white">
                    Tool Kit
                  </span>
                </div>
              </Link>
              <p className="text-gray-400 mb-4">
                {language === 'tr'
                  ? 'Modern içerik üreticiler için yapay zeka destekli araçlar. 10x daha hızlı viral içerikler üretin.'
                  : 'AI-powered content creation tools for modern creators. Create viral content 10x faster.'
                }
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">{language === 'tr' ? 'Ürün' : 'Product'}</h4>
              <ul className="space-y-2">
                <li><a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-gray-400 hover:text-white transition">{language === 'tr' ? 'Özellikler' : 'Features'}</a></li>
                <li><a href="#tools" onClick={(e) => scrollToSection(e, 'tools')} className="text-gray-400 hover:text-white transition">{language === 'tr' ? 'Araçlar' : 'Tools'}</a></li>
                <li><a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-gray-400 hover:text-white transition">{language === 'tr' ? 'Fiyatlandırma' : 'Pricing'}</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4">{language === 'tr' ? 'Bilgi' : 'Info'}</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveModal('about')} className="text-gray-400 hover:text-white transition">{language === 'tr' ? 'Hakkımızda' : 'About'}</button></li>
                <li><button onClick={() => setActiveModal('contact')} className="text-gray-400 hover:text-white transition">{language === 'tr' ? 'İletişim' : 'Contact'}</button></li>
                <li><button onClick={() => setActiveModal('privacy')} className="text-gray-400 hover:text-white transition">{language === 'tr' ? 'Gizlilik' : 'Privacy'}</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{language === 'tr' ? '© 2025 Media Tool Kit. Tüm hakları saklıdır.' : '© 2025 Media Tool Kit. All rights reserved.'}</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}