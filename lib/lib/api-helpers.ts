import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tool başına kredi maliyetleri
export const TOOL_COSTS: Record<string, number> = {
  'hook-generator': 3,
  'caption-generator': 3,
  'hashtag-research': 3,
  'posting-optimizer': 3,
  'trend-radar': 4,
  'thread-composer': 4,
  'engagement-booster': 4,
  'video-finder': 5,
  'viral-analyzer': 5,
  'ab-tester': 5,
  'carousel-planner': 5,
  'script-studio': 6,
  'steal-video': 8,
  'competitor-spy': 8,
  'content-repurposer': 8,
  'content-planner': 10
}

interface CreditResult {
  success: boolean
  newBalance?: number
  error?: string
}

// Kredi kontrolü ve düşürme
export async function checkAndDeductCredits(userId: string, toolName: string): Promise<CreditResult> {
  if (!userId) {
    return { success: false, error: 'User ID required' }
  }

  const cost = TOOL_COSTS[toolName] || 5

  try {
    // Kullanıcı kredisini al
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from('credits')
      .select('balance, plan')
      .eq('user_id', userId)
      .single()

    if (fetchError || !userData) {
      return { success: false, error: 'User not found' }
    }

    // Agency plan sınırsız
    if (userData.plan === 'agency') {
      // Kullanım kaydı
      try {
        await supabaseAdmin.from('tool_usage').insert({
          user_id: userId,
          tool_name: toolName,
          credits_used: 0
        })
      } catch {}
      return { success: true, newBalance: userData.balance }
    }

    // Kredi kontrolü
    if (userData.balance < cost) {
      return { 
        success: false, 
        error: `Insufficient credits. This tool requires ${cost} credits.`
      }
    }

    // Krediyi düşür
    const newBalance = userData.balance - cost

    const { error: updateError } = await supabaseAdmin
      .from('credits')
      .update({ balance: newBalance })
      .eq('user_id', userId)

    if (updateError) {
      return { success: false, error: 'Failed to update credits' }
    }

    // Kullanım kaydı
    try {
      await supabaseAdmin.from('tool_usage').insert({
        user_id: userId,
        tool_name: toolName,
        credits_used: cost
      })
    } catch {}

    return { success: true, newBalance }
  } catch (err) {
    console.error('Credit check error:', err)
    return { success: false, error: 'Credit system error' }
  }
}

// Yetersiz kredi response
export function insufficientCreditsResponse(toolName: string) {
  const cost = TOOL_COSTS[toolName] || 5
  return NextResponse.json(
    { error: `Insufficient credits. This tool requires ${cost} credits.` },
    { status: 402 }
  )
}
