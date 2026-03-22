import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/lib/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'MediaToolKit - AI Tools for Content Creators',
    template: '%s | MediaToolKit'
  },
  description: 'The ultimate AI toolkit for content creators. Generate viral hooks, scripts, captions with 16+ AI-powered tools.',
  keywords: 'AI tools, content creator, viral content, TikTok, Instagram, YouTube, hook generator, caption generator',
  metadataBase: new URL('https://mediatoolkit.site'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mediatoolkit.site',
    siteName: 'MediaToolKit',
    title: 'MediaToolKit - AI Tools for Content Creators',
    description: 'Generate viral hooks, scripts, captions with 16+ AI-powered tools.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediaToolKit - AI Tools for Content Creators',
    description: 'Generate viral hooks, scripts, captions with 16+ AI-powered tools.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
