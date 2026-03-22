'use client'
import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if dismissed before
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const now = new Date()
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) return // Don't show for 7 days after dismissal
    }

    // Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Wait a bit before showing prompt
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // For iOS, show custom prompt after a delay
    if (iOS && !standalone) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString())
  }

  if (isStandalone || !showPrompt) return null

  return (
    <div className="pwa-install-prompt animate-fade-in">
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-2xl">📱</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white mb-1">Install MediaToolKit</h3>
            {isIOS ? (
              <p className="text-sm text-gray-400">
                Tap <span className="inline-flex items-center"><svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L12 14M12 14L8 10M12 14L16 10M4 18L20 18"></path></svg></span> then "Add to Home Screen"
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                Get quick access from your home screen
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
            {!isIOS && (
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-sm font-semibold text-white"
              >
                Install
              </button>
            )}
          </div>
        </div>

        {/* iOS Instructions */}
        {isIOS && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs">1</span>
                <span>Tap Share</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs">2</span>
                <span>Add to Home Screen</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
