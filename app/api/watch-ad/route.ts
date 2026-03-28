// Watch Ad API — Server-side credit reward
// Free users: +10 credits per ad, Pro users: +50 credits per ad
// Rate limit: max 5 ads per day per user
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const AD_REWARDS = {
  free: 10,
  pro: 50
}

const MAX_ADS_PER_DAY = 5

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's current credits and plan
    const { data: userData, error: userError } = await supabaseAdmin
      .from('credits')
      .select('balance, plan')
      .eq('user_id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Rate limit check: count ads watched today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count, error: countError } = await supabaseAdmin
      .from('credit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('reason', 'ad_watch')
      .gte('created_at', todayStart.toISOString())

    if (countError) {
      console.error('Error checking ad limit:', countError)
    }

    const adsToday = count || 0
    if (adsToday >= MAX_ADS_PER_DAY) {
      return NextResponse.json({ 
        error: 'Daily ad limit reached', 
        code: 'AD_LIMIT',
        adsToday,
        maxAds: MAX_ADS_PER_DAY
      }, { status: 429 })
    }

    // Calculate reward based on plan
    const plan = userData.plan || 'free'
    const reward = AD_REWARDS[plan as keyof typeof AD_REWARDS] || AD_REWARDS.free
    const newBalance = userData.balance + reward

    // Update credits
    const { error: updateError } = await supabaseAdmin
      .from('credits')
      .update({ balance: newBalance })
      .eq('user_id', userId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
    }

    // Log the ad watch
    try {
      await supabaseAdmin.from('credit_logs').insert({
        user_id: userId,
        amount: reward,
        reason: 'ad_watch',
        balance_after: newBalance
      })
    } catch {}

    return NextResponse.json({ 
      success: true, 
      reward,
      newBalance,
      adsRemaining: MAX_ADS_PER_DAY - adsToday - 1
    })

  } catch (error: any) {
    console.error('Watch ad error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
