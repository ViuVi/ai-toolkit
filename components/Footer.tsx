'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'

const footerTexts: Record<string, Record<string, string>> = {
  en: {
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    faq: 'FAQ',
    blog: 'Blog',
    home: 'Home',
    dashboard: 'Dashboard',
    rights: 'All rights reserved.'
  },
  tr: {
    privacy: 'Gizlilik',
    terms: 'Şartlar',
    contact: 'İletişim',
    faq: 'SSS',
    blog: 'Blog',
    home: 'Ana Sayfa',
    dashboard: 'Dashboard',
    rights: 'Tüm hakları saklıdır.'
  },
  ru: {
    privacy: 'Конфиденциальность',
    terms: 'Условия',
    contact: 'Контакты',
    faq: 'ЧЗВ',
    blog: 'Блог',
    home: 'Главная',
    dashboard: 'Панель',
    rights: 'Все права защищены.'
  },
  de: {
    privacy: 'Datenschutz',
    terms: 'AGB',
    contact: 'Kontakt',
    faq: 'FAQ',
    blog: 'Blog',
    home: 'Startseite',
    dashboard: 'Dashboard',
    rights: 'Alle Rechte vorbehalten.'
  },
  fr: {
    privacy: 'Confidentialité',
    terms: 'Conditions',
    contact: 'Contact',
    faq: 'FAQ',
    blog: 'Blog',
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    rights: 'Tous droits réservés.'
  }
}

export default function Footer() {
  const { language } = useLanguage()
  const t = footerTexts[language] || footerTexts.en
  const router = useRouter()

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/')
  }

  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/5 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <a href="/" onClick={handleHomeClick} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">M</div>
            <span className="font-semibold">MediaToolkit</span>
          </a>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
            <a href="/" onClick={handleHomeClick} className="hover:text-white transition cursor-pointer">{t.home}</a>
            <Link href="/dashboard" className="hover:text-white transition">{t.dashboard}</Link>
            <Link href="/privacy" className="hover:text-white transition">{t.privacy}</Link>
            <Link href="/terms" className="hover:text-white transition">{t.terms}</Link>
            <Link href="/contact" className="hover:text-white transition">{t.contact}</Link>
            <Link href="/faq" className="hover:text-white transition">{t.faq}</Link>
            <Link href="/blog" className="hover:text-white transition">{t.blog}</Link>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">© 2026 MediaToolkit. {t.rights}</div>
        </div>
      </div>
    </footer>
  )
}
