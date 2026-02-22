'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-800/50 border-t border-gray-800 py-10 sm:py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          {/* Brand - Full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-white">M</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Media Tool Kit</span>
            </Link>
            <p className="text-gray-400 text-sm sm:text-base">
              {t.footer?.description || 'AI-powered content tools'}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t.footer?.product || 'Product'}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  {t.footer?.links?.features || 'Features'}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  {t.footer?.links?.pricing || 'Pricing'}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t.footer?.company || 'Company'}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  {t.footer?.links?.about || 'About'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  {t.footer?.links?.blog || 'Blog'}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t.footer?.legal || 'Legal'}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  {t.footer?.links?.privacy || 'Privacy'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition text-sm sm:text-base">
                  {t.footer?.links?.terms || 'Terms'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center">
          <p className="text-gray-500 text-sm sm:text-base">{t.footer?.copyright || '© 2024 Media Tool Kit. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  )
}
