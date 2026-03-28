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
    // Auth from token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const userId = user.id

    const { data: userData, error: userError } = await supabaseAdmin
      .from('credits').select('balance, plan').eq('user_id', userId).single()
    if (userError || !userData) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const { count } = await supabaseAdmin
      .from('credit_logs').select('*', { count: 'exact', head: true })
      .eq('user_id', userId).eq('reason', 'ad_watch').gte('created_at', todayStart.toISOString())

    if ((count || 0) >= MAX_ADS_PER_DAY) {
      return NextResponse.json({ error: 'Daily ad limit reached', code: 'AD_LIMIT' }, { status: 429 })
    }

    const reward = AD_REWARDS[userData.plan as keyof typeof AD_REWARDS] || AD_REWARDS.free
    const newBalance = userData.balance + reward

    await supabaseAdmin.from('credits').update({ balance: newBalance }).eq('user_id', userId)
    try { await supabaseAdmin.from('credit_logs').insert({ user_id: userId, amount: reward, reason: 'ad_watch', balance_after: newBalance }) } catch {}

    return NextResponse.json({ success: true, reward, newBalance, adsRemaining: MAX_ADS_PER_DAY - (count || 0) - 1 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
