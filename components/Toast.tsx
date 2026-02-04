'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      default: return 'ℹ'
    }
  }

  const getColors = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 border-green-500/50 text-green-400'
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400'
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md ${getColors(toast.type)}`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
            onClick={() => removeToast(toast.id)}
          >
            <span className="text-lg">{getIcon(toast.type)}</span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}