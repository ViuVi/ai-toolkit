import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const userId = user.id

    const { data: usage } = await supabaseAdmin
      .from('tool_usage').select('tool_name, credits_used, created_at')
      .eq('user_id', userId).order('created_at', { ascending: false }).limit(50)

    const totalUses = usage?.length || 0
    const totalCredits = usage?.reduce((sum: number, u: any) => sum + (u.credits_used || 0), 0) || 0

    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    const thisWeek = usage?.filter((u: any) => new Date(u.created_at) > weekAgo) || []

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyData = days.map(day => ({ day, count: 0 }))
    thisWeek.forEach((u: any) => {
      const d = new Date(u.created_at).getDay()
      weeklyData[d].count++
    })

    return NextResponse.json({
      totalUses,
      totalCredits,
      thisMonth: thisWeek.length,
      weeklyData,
      recentTools: usage?.slice(0, 5) || []
    })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
