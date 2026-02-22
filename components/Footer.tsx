'use client'

import Link from 'next/link'
import { useLanguage, Language } from '@/lib/LanguageContext'

const footerTexts: Record<Language, Record<string, string>> = {
  en: { description: 'AI tools that actually make your life easier.', product: 'Product', company: 'Company', legal: 'Legal', features: 'Features', pricing: 'Pricing', about: 'About', blog: 'Blog', privacy: 'Privacy', terms: 'Terms', copyright: '© 2024 Media Tool Kit. All rights reserved.' },
  tr: { description: 'Hayatınızı gerçekten kolaylaştıran AI araçları.', product: 'Ürün', company: 'Şirket', legal: 'Yasal', features: 'Özellikler', pricing: 'Fiyatlar', about: 'Hakkımızda', blog: 'Blog', privacy: 'Gizlilik', terms: 'Şartlar', copyright: '© 2024 Media Tool Kit. Tüm hakları saklıdır.' },
  ru: { description: 'AI инструменты для упрощения жизни.', product: 'Продукт', company: 'Компания', legal: 'Правовая информация', features: 'Функции', pricing: 'Цены', about: 'О нас', blog: 'Блог', privacy: 'Конфиденциальность', terms: 'Условия', copyright: '© 2024 Media Tool Kit. Все права защищены.' },
  de: { description: 'KI-Tools die das Leben vereinfachen.', product: 'Produkt', company: 'Unternehmen', legal: 'Rechtliches', features: 'Funktionen', pricing: 'Preise', about: 'Über uns', blog: 'Blog', privacy: 'Datenschutz', terms: 'AGB', copyright: '© 2024 Media Tool Kit. Alle Rechte vorbehalten.' },
  fr: { description: 'Outils IA qui simplifient la vie.', product: 'Produit', company: 'Entreprise', legal: 'Mentions légales', features: 'Fonctionnalités', pricing: 'Tarifs', about: 'À propos', blog: 'Blog', privacy: 'Confidentialité', terms: 'CGU', copyright: '© 2024 Media Tool Kit. Tous droits réservés.' },
}

export default function Footer() {
  const { language } = useLanguage()
  const txt = footerTexts[language]

  return (
    <footer className="bg-gray-800/50 border-t border-gray-800 py-10 sm:py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-white">M</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Media Tool Kit</span>
            </Link>
            <p className="text-gray-400 text-sm sm:text-base">{txt.description}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{txt.product}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-white transition text-sm sm:text-base">{txt.features}</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition text-sm sm:text-base">{txt.pricing}</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition text-sm sm:text-base">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{txt.company}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition text-sm sm:text-base">{txt.about}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition text-sm sm:text-base">{txt.blog}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{txt.legal}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition text-sm sm:text-base">{txt.privacy}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition text-sm sm:text-base">{txt.terms}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center">
          <p className="text-gray-500 text-sm sm:text-base">{txt.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
