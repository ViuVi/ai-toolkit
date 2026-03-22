import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Kullanıcının referral kodunu ve istatistiklerini al
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Kullanıcının referral kodunu al
    const { data: userData, error: userError } = await supabase
      .from('credits')
      .select('referral_code')
      .eq('user_id', userId)
      .single()

    if (userError) {
      // Eğer referral kodu yoksa oluştur
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      await supabase
        .from('credits')
        .update({ referral_code: newCode })
        .eq('user_id', userId)
      
      return NextResponse.json({ 
        referralCode: newCode,
        referralCount: 0,
        totalEarned: 0
      })
    }

    // Referral istatistiklerini al
    const { data: referrals, error: refError } = await supabase
      .from('referrals')
      .select('id, created_at')
      .eq('referrer_id', userId)

    const referralCount = referrals?.length || 0
    const totalEarned = referralCount * 50 // Her referral 50 kredi

    return NextResponse.json({
      referralCode: userData?.referral_code || '',
      referralCount,
      totalEarned
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Referral kodu kullan (kayıt sırasında)
export async function POST(request: Request) {
  try {
    const { referralCode, newUserId } = await request.json()

    if (!referralCode || !newUserId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Referral kodunun sahibini bul
    const { data: referrer, error: findError } = await supabase
      .from('credits')
      .select('user_id')
      .eq('referral_code', referralCode.toUpperCase())
      .single()

    if (findError || !referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    // Kendine referral yapamaz
    if (referrer.user_id === newUserId) {
      return NextResponse.json({ error: 'Cannot use own referral code' }, { status: 400 })
    }

    // Daha önce referral kullanılmış mı?
    const { data: existing } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', newUserId)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already used a referral code' }, { status: 400 })
    }

    // Bonus miktarı
    const bonusAmount = 50

    // Referral kaydı oluştur
    const { error: insertError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.user_id,
        referred_id: newUserId,
        referral_code: referralCode.toUpperCase(),
        bonus_given: true
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save referral' }, { status: 500 })
    }

    // Referrer'a bonus ver
    await supabase.rpc('increment_credits', { 
      user_id_input: referrer.user_id, 
      amount: bonusAmount 
    }).catch(() => {
      // Fallback: direkt update
      return supabase
        .from('credits')
        .update({ balance: supabase.rpc('', {}) })
        .eq('user_id', referrer.user_id)
    })

    // Direkt SQL ile bonus ver (daha güvenilir)
    await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', referrer.user_id)
      .single()
      .then(async ({ data }) => {
        if (data) {
          await supabase
            .from('credits')
            .update({ balance: (data.balance || 0) + bonusAmount })
            .eq('user_id', referrer.user_id)
        }
      })

    // Yeni kullanıcıya da bonus ver
    await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', newUserId)
      .single()
      .then(async ({ data }) => {
        if (data) {
          await supabase
            .from('credits')
            .update({ balance: (data.balance || 0) + bonusAmount })
            .eq('user_id', newUserId)
        }
      })

    return NextResponse.json({ 
      success: true, 
      message: `+${bonusAmount} credits bonus applied!`,
      bonus: bonusAmount
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
