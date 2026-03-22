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

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: usage } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })

    const totalUses = usage?.length || 0
    const totalCreditsSpent = usage?.reduce((sum, u) => sum + (u.credits_used || 0), 0) || 0

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyUsage = days.map(day => ({ day, count: 0 }))
    
    usage?.forEach(u => {
      const dayIndex = new Date(u.created_at).getDay()
      weeklyUsage[dayIndex].count++
    })

    return NextResponse.json({
      totalUses,
      totalCreditsSpent,
      weeklyUsage,
      recentTools: usage?.slice(0, 5) || []
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
