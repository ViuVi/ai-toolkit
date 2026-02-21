'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { language } = useLanguage()

  const texts = {
    description: language === 'tr' ? 'AI destekli içerik üretim platformu' : language === 'ru' ? 'Платформа для создания контента на базе ИИ' : language === 'de' ? 'KI-gestützte Content-Erstellungsplattform' : language === 'fr' ? "Plateforme de création de contenu alimentée par l'IA" : 'AI-powered content creation platform',
    features: language === 'tr' ? 'Özellikler' : language === 'ru' ? 'Функции' : language === 'de' ? 'Funktionen' : language === 'fr' ? 'Fonctionnalités' : 'Features',
    pricing: language === 'tr' ? 'Fiyatlar' : language === 'ru' ? 'Цены' : language === 'de' ? 'Preise' : language === 'fr' ? 'Tarifs' : 'Pricing',
    about: language === 'tr' ? 'Hakkımızda' : language === 'ru' ? 'О нас' : language === 'de' ? 'Über uns' : language === 'fr' ? 'À propos' : 'About',
    privacy: language === 'tr' ? 'Gizlilik' : language === 'ru' ? 'Конфиденциальность' : language === 'de' ? 'Datenschutz' : language === 'fr' ? 'Confidentialité' : 'Privacy',
    terms: language === 'tr' ? 'Şartlar' : language === 'ru' ? 'Условия' : language === 'de' ? 'Bedingungen' : language === 'fr' ? 'Conditions' : 'Terms',
    rights: language === 'tr' ? 'Tüm hakları saklıdır.' : language === 'ru' ? 'Все права защищены.' : language === 'de' ? 'Alle Rechte vorbehalten.' : language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold text-white">Media Tool Kit</span>
            </Link>
            <p className="text-gray-400">{texts.description}</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">{language === 'tr' ? 'Ürün' : 'Product'}</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition">{texts.features}</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition">{texts.pricing}</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">{language === 'tr' ? 'Şirket' : 'Company'}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">{texts.about}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">{language === 'tr' ? 'Kariyer' : 'Careers'}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">{language === 'tr' ? 'Yasal' : 'Legal'}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">{texts.privacy}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">{texts.terms}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          © {new Date().getFullYear()} Media Tool Kit. {texts.rights}
        </div>
      </div>
    </footer>
  )
}
