// Monthly Credit Reset — Vercel Cron Job
// Runs on the 1st of every month at 00:00 UTC
// Free users get 100 credits, Pro users get 1000 credits
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Verify this is called by Vercel Cron (not a random user)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Reset free users to 100 credits
    const { data: freeUsers, error: freeError } = await supabaseAdmin
      .from('credits')
      .update({ 
        balance: 100, 
        total_used: 0,
        updated_at: new Date().toISOString() 
      })
      .eq('plan', 'free')
      .select('user_id')

    if (freeError) {
      console.error('Error resetting free credits:', freeError)
    }

    // Reset pro users to 1000 credits
    const { data: proUsers, error: proError } = await supabaseAdmin
      .from('credits')
      .update({ 
        balance: 1000, 
        total_used: 0,
        updated_at: new Date().toISOString() 
      })
      .eq('plan', 'pro')
      .select('user_id')

    if (proError) {
      console.error('Error resetting pro credits:', proError)
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      freeUsersReset: freeUsers?.length || 0,
      proUsersReset: proUsers?.length || 0
    }

    console.log('📅 Monthly credit reset completed:', result)

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
