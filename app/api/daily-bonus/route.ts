import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DAILY_BONUS = 10

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
  return user
}

// GET: Check if daily bonus was claimed today + streak
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count } = await supabaseAdmin
      .from('credit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('reason', 'daily_bonus')
      .gte('created_at', todayStart.toISOString())

    // Calculate streak
    let streak = 0
    const { data: recentBonuses } = await supabaseAdmin
      .from('credit_logs')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('reason', 'daily_bonus')
      .order('created_at', { ascending: false })
      .limit(30)

    if (recentBonuses && recentBonuses.length > 0) {
      streak = 1
      for (let i = 1; i < recentBonuses.length; i++) {
        const prev = new Date(recentBonuses[i - 1].created_at)
        const curr = new Date(recentBonuses[i].created_at)
        prev.setHours(0, 0, 0, 0)
        curr.setHours(0, 0, 0, 0)
        const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
        if (diffDays <= 1.5) streak++
        else break
      }
    }

    return NextResponse.json({ claimed: (count || 0) > 0, streak })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST: Claim daily bonus
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    // Check if already claimed today
    const { count } = await supabaseAdmin
      .from('credit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('reason', 'daily_bonus')
      .gte('created_at', todayStart.toISOString())

    if ((count || 0) > 0) {
      return NextResponse.json({ error: 'Already claimed today', claimed: true }, { status: 429 })
    }

    // Get current balance
    const { data: userData } = await supabaseAdmin
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    if (!userData) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const newBalance = userData.balance + DAILY_BONUS

    // Update balance
    await supabaseAdmin
      .from('credits')
      .update({ balance: newBalance })
      .eq('user_id', user.id)

    // Log the bonus
    try {
      await supabaseAdmin.from('credit_logs').insert({
        user_id: user.id,
        amount: DAILY_BONUS,
        reason: 'daily_bonus',
        balance_after: newBalance
      })
    } catch {}

    // Calculate streak
    let streak = 1
    const { data: recentBonuses } = await supabaseAdmin
      .from('credit_logs')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('reason', 'daily_bonus')
      .order('created_at', { ascending: false })
      .limit(30)

    if (recentBonuses && recentBonuses.length > 1) {
      for (let i = 1; i < recentBonuses.length; i++) {
        const prev = new Date(recentBonuses[i - 1].created_at)
        const curr = new Date(recentBonuses[i].created_at)
        prev.setHours(0, 0, 0, 0)
        curr.setHours(0, 0, 0, 0)
        const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
        if (diffDays <= 1.5) streak++
        else break
      }
    }

    return NextResponse.json({ success: true, reward: DAILY_BONUS, newBalance, streak })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
