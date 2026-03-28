import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const TOOL_CREDITS: Record<string, number> = {
  'hook-generator': 3,
  'caption-generator': 3,
  'script-studio': 6,
  'video-finder': 5,
  'trend-radar': 4,
  'steal-video': 8,
  'content-planner': 10,
  'viral-analyzer': 5,
  'hashtag-research': 3,
  'competitor-spy': 8,
  'ab-tester': 5,
  'carousel-planner': 5,
  'thread-composer': 4,
  'engagement-booster': 4,
  'posting-optimizer': 3,
  'content-repurposer': 8
}

interface UserData {
  balance: number
  plan: string
  total_used: number
}

interface CreditCheckResult {
  success: boolean
  userData?: UserData
  error?: string
  response?: NextResponse
}

export async function checkCredits(userId: string | undefined, toolName: string): Promise<CreditCheckResult> {
  const cost = TOOL_CREDITS[toolName] || 5

  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized',
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { data, error } = await supabaseAdmin
    .from('credits')
    .select('balance, plan, total_used')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return {
      success: false,
      error: 'User not found',
      response: NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  }

  const userData: UserData = {
    balance: data.balance ?? 0,
    plan: data.plan ?? 'free',
    total_used: data.total_used ?? 0
  }

  if (userData.plan === 'agency') {
    return { success: true, userData }
  }

  if (userData.balance < cost) {
    return {
      success: false,
      error: 'Insufficient credits',
      userData,
      response: NextResponse.json({
        error: 'Yetersiz kredi',
        code: 'INSUFFICIENT_CREDITS',
        required: cost,
        current: userData.balance
      }, { status: 402 })
    }
  }

  return { success: true, userData }
}

export async function deductCredits(userId: string, toolName: string, userData: UserData): Promise<number> {
  const cost = TOOL_CREDITS[toolName] || 5
  
  if (userData.plan === 'agency') {
    try {
      await supabaseAdmin.from('tool_usage').insert({
        user_id: userId,
        tool_name: toolName,
        credits_used: 0
      })
    } catch {}
    return userData.balance
  }

  const newBalance = userData.balance - cost
  const newTotalUsed = userData.total_used + cost

  await supabaseAdmin
    .from('credits')
    .update({ balance: newBalance, total_used: newTotalUsed })
    .eq('user_id', userId)

  try {
    await supabaseAdmin.from('tool_usage').insert({
      user_id: userId,
      tool_name: toolName,
      credits_used: cost
    })
  } catch {}

  try {
    await supabaseAdmin.from('usage_history').insert({
      user_id: userId,
      tool_name: toolName,
      tool_display_name: toolName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      credits_used: cost,
      status: 'completed'
    })
  } catch {}

  return newBalance
}

// Combined check + deduct (used by all tool API routes)
export async function checkAndDeductCredits(userId: string, toolName: string): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  if (!userId) {
    return { success: false, error: 'User ID required' }
  }

  const cost = TOOL_CREDITS[toolName] || 5

  try {
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from('credits')
      .select('balance, plan, total_used')
      .eq('user_id', userId)
      .single()

    if (fetchError || !userData) {
      return { success: false, error: 'User not found' }
    }

    if (userData.plan === 'agency') {
      try {
        await supabaseAdmin.from('tool_usage').insert({
          user_id: userId,
          tool_name: toolName,
          credits_used: 0
        })
      } catch {}
      return { success: true, newBalance: userData.balance }
    }

    if (userData.balance < cost) {
      return { success: false, error: `Insufficient credits. This tool requires ${cost} credits.` }
    }

    const newBalance = userData.balance - cost

    const { error: updateError } = await supabaseAdmin
      .from('credits')
      .update({ balance: newBalance, total_used: (userData.total_used || 0) + cost })
      .eq('user_id', userId)

    if (updateError) {
      return { success: false, error: 'Failed to update credits' }
    }

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

export function parseAIResponse(content: string): any {
  try {
    let clean = content.trim()
    if (clean.startsWith('```json')) clean = clean.slice(7)
    else if (clean.startsWith('```')) clean = clean.slice(3)
    if (clean.endsWith('```')) clean = clean.slice(0, -3)
    return JSON.parse(clean.trim())
  } catch {
    return { raw: content }
  }
}

// Brand Kit — fetch user's brand profile and build context string for AI prompts
export async function getBrandContext(userId: string): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin
      .from('brand_profiles')
      .select('brand_name, niche, target_audience, tone, content_style, platforms, keywords, description')
      .eq('user_id', userId)
      .single()

    if (error || !data || !data.niche) return ''

    const parts: string[] = []
    parts.push(`\n--- CREATOR BRAND PROFILE ---`)
    if (data.brand_name) parts.push(`Brand: ${data.brand_name}`)
    if (data.niche) parts.push(`Niche: ${data.niche}`)
    if (data.target_audience) parts.push(`Target Audience: ${data.target_audience}`)
    if (data.tone) parts.push(`Brand Tone: ${data.tone}`)
    if (data.content_style) parts.push(`Content Style: ${data.content_style}`)
    if (data.platforms?.length) parts.push(`Main Platforms: ${data.platforms.join(', ')}`)
    if (data.keywords?.length) parts.push(`Key Topics: ${data.keywords.join(', ')}`)
    if (data.description) parts.push(`About: ${data.description}`)
    parts.push(`--- END BRAND PROFILE ---`)
    parts.push(`IMPORTANT: Tailor ALL output to match this creator's brand voice, niche, and target audience.`)

    return parts.join('\n')
  } catch {
    return ''
  }
}
