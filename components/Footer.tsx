'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-800/50 border-t border-gray-800 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold text-white">Media Tool Kit</span>
            </Link>
            <p className="text-gray-400">
              {t.footer?.description || 'AI-powered content tools'}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer?.product || 'Product'}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition">
                  {t.footer?.links?.features || 'Features'}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition">
                  {t.footer?.links?.pricing || 'Pricing'}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer?.company || 'Company'}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  {t.footer?.links?.about || 'About'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  {t.footer?.links?.blog || 'Blog'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer?.legal || 'Legal'}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  {t.footer?.links?.privacy || 'Privacy'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  {t.footer?.links?.terms || 'Terms'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-500">{t.footer?.copyright || '© 2024 Media Tool Kit. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  )
}
