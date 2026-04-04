import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/lib/LanguageContext'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'MediaToolkit - AI Tools for Content Creators',
    template: '%s | MediaToolkit'
  },
  description: 'The ultimate AI toolkit for content creators. Generate viral hooks, scripts, captions with 16+ AI-powered tools.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MediaToolkit',
  },
  openGraph: {
    type: 'website',
    title: 'MediaToolkit - AI Tools for Content Creators',
    description: 'The ultimate AI toolkit for content creators. Generate viral hooks, scripts, captions with 16+ AI-powered tools.',
    siteName: 'MediaToolkit',
    url: 'https://mediatoolkit.site',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediaToolkit - AI Tools for Content Creators',
    description: 'The ultimate AI toolkit for content creators.',
  },
}

export const viewport: Viewport = {
  themeColor: '#a855f7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="google-adsense-account" content="ca-pub-1643908908416119" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(reg => console.log('SW registered:', reg.scope))
                  .catch(err => console.log('SW registration failed:', err));
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
