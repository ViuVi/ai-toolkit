import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Referral bonus miktarı
const REFERRAL_BONUS = 100

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data: userData } = await supabase
      .from('credits')
      .select('referral_code')
      .eq('user_id', userId)
      .single()

    if (!userData?.referral_code) {
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      await supabase.from('credits').update({ referral_code: newCode }).eq('user_id', userId)
      return NextResponse.json({ referralCode: newCode, referralCount: 0, totalEarned: 0 })
    }

    const { data: referrals } = await supabase
      .from('referrals')
      .select('id')
      .eq('referrer_id', userId)

    return NextResponse.json({
      referralCode: userData.referral_code,
      referralCount: referrals?.length || 0,
      totalEarned: (referrals?.length || 0) * REFERRAL_BONUS
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { referralCode, newUserId } = await request.json()

    if (!referralCode || !newUserId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { data: referrer } = await supabase
      .from('credits')
      .select('user_id, balance')
      .eq('referral_code', referralCode.toUpperCase())
      .single()

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 })
    }

    if (referrer.user_id === newUserId) {
      return NextResponse.json({ error: 'Cannot use own code' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', newUserId)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already used' }, { status: 400 })
    }

    // Referral kaydı oluştur
    await supabase.from('referrals').insert({
      referrer_id: referrer.user_id,
      referred_id: newUserId,
      referral_code: referralCode.toUpperCase(),
      bonus_given: true
    })

    // Davet edene +100 kredi
    await supabase
      .from('credits')
      .update({ balance: (referrer.balance || 0) + REFERRAL_BONUS })
      .eq('user_id', referrer.user_id)

    // Milestone bonusları kontrol et
    const { data: allReferrals } = await supabase
      .from('referrals')
      .select('id')
      .eq('referrer_id', referrer.user_id)

    const totalReferrals = (allReferrals?.length || 0) + 1 // +1 for this new one
    let milestoneBonus = 0

    if (totalReferrals === 5) milestoneBonus = 250
    else if (totalReferrals === 10) milestoneBonus = 500
    else if (totalReferrals === 25) milestoneBonus = 1000

    if (milestoneBonus > 0) {
      const { data: currentCredits } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', referrer.user_id)
        .single()
      
      if (currentCredits) {
        await supabase
          .from('credits')
          .update({ balance: currentCredits.balance + milestoneBonus })
          .eq('user_id', referrer.user_id)
      }
    }

    // Davet edilene +100 kredi
    const { data: newUser } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', newUserId)
      .single()

    if (newUser) {
      await supabase
        .from('credits')
        .update({ balance: (newUser.balance || 0) + REFERRAL_BONUS })
        .eq('user_id', newUserId)
    }

    return NextResponse.json({ success: true, bonus: REFERRAL_BONUS })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
