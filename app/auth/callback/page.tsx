'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const CREDITS = {
  FREE_INITIAL: 100,
  REFERRAL_INITIAL: 200,
  REFERRAL_BONUS: 100
}

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
          const userId = session.user.id

          const { data: existingCredits, error: checkError } = await supabase
            .from('credits')
            .select('id')
            .eq('user_id', userId)
            .single()

          if (checkError || !existingCredits) {
            const referralCode = typeof window !== 'undefined' 
              ? localStorage.getItem('referralCode') 
              : null

            const initialCredits = referralCode ? CREDITS.REFERRAL_INITIAL : CREDITS.FREE_INITIAL
            const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase()

            await supabase.from('credits').insert({
              user_id: userId,
              balance: initialCredits,
              total_used: 0,
              plan: 'free',
              referral_code: newReferralCode
            })

            if (referralCode) {
              try {
                const { data: referrer } = await supabase
                  .from('credits')
                  .select('user_id, balance')
                  .eq('referral_code', referralCode.toUpperCase())
                  .single()

                if (referrer && referrer.user_id !== userId) {
                  await supabase
                    .from('credits')
                    .update({ balance: referrer.balance + CREDITS.REFERRAL_BONUS })
                    .eq('user_id', referrer.user_id)

                  try {
                    await supabase.from('referrals').insert({
                      referrer_id: referrer.user_id,
                      referred_id: userId,
                      referral_code: referralCode.toUpperCase(),
                      bonus_given: true
                    })
                  } catch {}
                }

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
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Giriş yapılıyor...</p>
        <p className="text-gray-400 text-sm mt-2">Lütfen bekleyin</p>
      </div>
    </div>
  )
}
