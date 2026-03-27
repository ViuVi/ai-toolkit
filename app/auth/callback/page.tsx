'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Kredi sabitleri
const CREDITS = {
  FREE_INITIAL: 100,      // Referanssız üye başlangıç
  REFERRAL_INITIAL: 200,  // Referanslı üye başlangıç
  REFERRAL_BONUS: 100     // Davet edene bonus
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

          // Kullanıcı için kredi kaydı var mı kontrol et
          const { data: existingCredits, error: checkError } = await supabase
            .from('credits')
            .select('id, balance')
            .eq('user_id', userId)
            .single()

          // Yoksa oluştur (yeni kullanıcı)
          if (checkError || !existingCredits) {
            // Referral kodu var mı kontrol et
            const referralCode = typeof window !== 'undefined' 
              ? localStorage.getItem('referralCode') 
              : null

            // Yeni kullanıcı referral ile geldiyse 200 kredi, değilse 100 kredi
            const initialCredits = referralCode ? CREDITS.REFERRAL_INITIAL : CREDITS.FREE_INITIAL

            // Benzersiz referral kodu oluştur
            const newReferralCode = generateReferralCode()

            // Kredi kaydı oluştur
            const { error: insertError } = await supabase.from('credits').insert({
              user_id: userId,
              balance: initialCredits,
              total_used: 0,
              plan: 'free',
              referral_code: newReferralCode,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

            if (insertError) {
              console.error('Credit insert error:', insertError)
            }

            // Eğer referral kodu varsa, davet edene bonus ver
            if (referralCode) {
              try {
                // Davet edenin bilgilerini bul
                const { data: referrer } = await supabase
                  .from('credits')
                  .select('user_id, balance')
                  .eq('referral_code', referralCode.toUpperCase())
                  .single()

                if (referrer && referrer.user_id !== userId) {
                  // Davet edene +100 kredi bonus
                  await supabase
                    .from('credits')
                    .update({ balance: referrer.balance + CREDITS.REFERRAL_BONUS })
                    .eq('user_id', referrer.user_id)

                  // Referral kaydı oluştur
                  await supabase.from('referrals').insert({
                    referrer_id: referrer.user_id,
                    referred_id: userId,
                    referral_code: referralCode.toUpperCase(),
                    bonus_given: true,
                    created_at: new Date().toISOString()
                  }).catch(() => {})
                }

                // Referral kodunu temizle
                localStorage.removeItem('referralCode')
              } catch (e) {
                console.error('Referral process error:', e)
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

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}
