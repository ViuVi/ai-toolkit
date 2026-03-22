import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
      totalEarned: (referrals?.length || 0) * 50
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

    await supabase.from('referrals').insert({
      referrer_id: referrer.user_id,
      referred_id: newUserId,
      referral_code: referralCode.toUpperCase(),
      bonus_given: true
    })

    await supabase
      .from('credits')
      .update({ balance: (referrer.balance || 0) + 50 })
      .eq('user_id', referrer.user_id)

    const { data: newUser } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', newUserId)
      .single()

    if (newUser) {
      await supabase
        .from('credits')
        .update({ balance: (newUser.balance || 0) + 50 })
        .eq('user_id', newUserId)
    }

    return NextResponse.json({ success: true, bonus: 50 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
