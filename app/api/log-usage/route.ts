import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { userId, toolName, creditsUsed } = await request.json()

    if (!userId || !toolName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await supabase.from('tool_usage').insert({
      user_id: userId,
      tool_name: toolName,
      credits_used: creditsUsed || 0
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
