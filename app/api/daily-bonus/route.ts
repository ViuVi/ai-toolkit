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

// GET: Check if daily bonus was claimed today
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const today = new Date().toISOString().split('T')[0]

    const { data: userData } = await supabaseAdmin
      .from('credits')
      .select('daily_bonus_date, daily_streak')
      .eq('user_id', user.id)
      .single()

    const claimed = userData?.daily_bonus_date === today
    const streak = userData?.daily_streak || 0

    return NextResponse.json({ claimed, streak })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST: Claim daily bonus
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const today = new Date().toISOString().split('T')[0]

    const { data: userData } = await supabaseAdmin
      .from('credits')
      .select('balance, daily_bonus_date, daily_streak')
      .eq('user_id', user.id)
      .single()

    if (!userData) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Already claimed today
    if (userData.daily_bonus_date === today) {
      return NextResponse.json({ error: 'Already claimed today', claimed: true }, { status: 429 })
    }

    // Calculate streak
    let newStreak = 1
    if (userData.daily_bonus_date) {
      const lastDate = new Date(userData.daily_bonus_date)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        newStreak = (userData.daily_streak || 0) + 1
      }
    }

    const newBalance = userData.balance + DAILY_BONUS

    // Update balance + daily bonus date + streak
    await supabaseAdmin
      .from('credits')
      .update({
        balance: newBalance,
        daily_bonus_date: today,
        daily_streak: newStreak
      })
      .eq('user_id', user.id)

    // Also log to credit_logs if table exists
    try {
      await supabaseAdmin.from('credit_logs').insert({
        user_id: user.id,
        amount: DAILY_BONUS,
        reason: 'daily_bonus',
        balance_after: newBalance
      })
    } catch {}

    return NextResponse.json({ success: true, reward: DAILY_BONUS, newBalance, streak: newStreak })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
