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

    // Son 30 günlük kullanım
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Tool kullanım sayıları
    const { data: toolStats, error: toolError } = await supabase
      .from('tool_usage')
      .select('tool_name, credits_used, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })

    if (toolError) {
      console.error('Error fetching tool stats:', toolError)
      return NextResponse.json({ error: toolError.message }, { status: 500 })
    }

    // İstatistikleri hesapla
    const stats = {
      totalUses: toolStats?.length || 0,
      totalCreditsSpent: toolStats?.reduce((sum, t) => sum + (t.credits_used || 0), 0) || 0,
      recentTools: toolStats?.slice(0, 5) || [],
      toolBreakdown: {} as Record<string, { count: number; credits: number }>,
      weeklyUsage: [] as { day: string; count: number }[]
    }

    // Tool bazında breakdown
    toolStats?.forEach(t => {
      if (!stats.toolBreakdown[t.tool_name]) {
        stats.toolBreakdown[t.tool_name] = { count: 0, credits: 0 }
      }
      stats.toolBreakdown[t.tool_name].count++
      stats.toolBreakdown[t.tool_name].credits += t.credits_used || 0
    })

    // Son 7 günlük kullanım
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyData: Record<string, number> = {}
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = days[date.getDay()]
      weeklyData[dayName] = 0
    }

    toolStats?.forEach(t => {
      const date = new Date(t.created_at)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays < 7) {
        const dayName = days[date.getDay()]
        if (weeklyData[dayName] !== undefined) {
          weeklyData[dayName]++
        }
      }
    })

    stats.weeklyUsage = Object.entries(weeklyData).map(([day, count]) => ({ day, count }))

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
