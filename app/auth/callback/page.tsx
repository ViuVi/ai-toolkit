'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=auth_failed')
          return
        }

        if (session?.user) {
          // Kullanıcı için kredi kaydı var mı kontrol et
          const { data: existingCredits } = await supabase
            .from('credits')
            .select('id')
            .eq('user_id', session.user.id)
            .single()

          // Yoksa oluştur (yeni kullanıcı)
          if (!existingCredits) {
            // Referral kodu var mı kontrol et
            const referralCode = typeof window !== 'undefined' 
              ? localStorage.getItem('referralCode') 
              : null

            // Yeni kullanıcı referral ile geldiyse 200 kredi, değilse 100 kredi
            const initialCredits = referralCode ? 200 : 100

            // Referral kodu oluştur
            const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase()

            await supabase.from('credits').insert({
              user_id: session.user.id,
              balance: initialCredits,
              total_used: 0,
              plan: 'free',
              referral_code: newReferralCode
            })

            // Eğer referral kodu varsa, davet edene de bonus ver
            if (referralCode) {
              try {
                await fetch('/api/referral', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    referralCode: referralCode,
                    newUserId: session.user.id
                  })
                })
                // Referral kodunu temizle
                localStorage.removeItem('referralCode')
              } catch (e) {
                console.error('Referral error:', e)
              }
            }
          }

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
