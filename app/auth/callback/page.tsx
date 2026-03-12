'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL'den hash'i al ve session'ı ayarla
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=auth_failed')
          return
        }

        if (session?.user) {
          // Kullanıcı için kredi kaydı var mı kontrol et
          const { data: existingCredits } = await supabase
            .from('user_credits')
            .select('id')
            .eq('user_id', session.user.id)
            .single()

          // Yoksa oluştur (yeni Google kullanıcısı)
          if (!existingCredits) {
            await supabase.from('user_credits').insert({
              user_id: session.user.id,
              credits: 50,
              plan: 'free'
            })
          }

          // Dashboard'a yönlendir
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error('Callback error:', err)
        router.push('/login?error=callback_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Giriş yapılıyor...</p>
        <p className="text-gray-400 text-sm mt-2">Lütfen bekleyin</p>
      </div>
    </div>
  )
}
