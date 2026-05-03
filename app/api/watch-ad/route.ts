import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const AD_REWARDS = { free: 10, pro: 50 }
const MAX_ADS_PER_DAY = 5

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const userId = user.id

    const { data: userData, error: userError } = await supabaseAdmin
      .from('credits').select('balance, plan, ad_watches_today, ad_watches_date').eq('user_id', userId).single()
    if (userError || !userData) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Check daily limit using credits table fields
    const today = new Date().toISOString().split('T')[0]
    let adsToday = 0
    
    if (userData.ad_watches_date === today) {
      adsToday = userData.ad_watches_today || 0
    }
    // If different day, reset count

    if (adsToday >= MAX_ADS_PER_DAY) {
      return NextResponse.json({ error: 'Daily ad limit reached', code: 'AD_LIMIT', adsRemaining: 0 }, { status: 429 })
    }

    const reward = AD_REWARDS[userData.plan as keyof typeof AD_REWARDS] || AD_REWARDS.free
    const newBalance = userData.balance + reward
    const newAdsToday = adsToday + 1

    // Update balance + ad watch count atomically
    await supabaseAdmin
      .from('credits')
      .update({ 
        balance: newBalance, 
        ad_watches_today: newAdsToday, 
        ad_watches_date: today 
      })
      .eq('user_id', userId)

    // Also log to credit_logs if table exists
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
      adsRemaining: MAX_ADS_PER_DAY - newAdsToday 
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
