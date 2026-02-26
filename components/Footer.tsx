'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { t } from '@/lib/translations'

export default function Footer() {
  const { language } = useLanguage()
  const f = t.footer[language]

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold text-white">Media Tool Kit</span>
            </div>
            <p className="text-gray-400">{f.desc}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{f.product}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white">{f.features}</a></li>
              <li><a href="#pricing" className="hover:text-white">{f.pricing}</a></li>
              <li><a href="#" className="hover:text-white">{f.api}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{f.company}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">{f.about}</a></li>
              <li><a href="#" className="hover:text-white">{f.blog}</a></li>
              <li><a href="#" className="hover:text-white">{f.careers}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{f.legal}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">{f.privacy}</a></li>
              <li><a href="#" className="hover:text-white">{f.terms}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">{f.copyright}</div>
      </div>
    </footer>
  )
}
