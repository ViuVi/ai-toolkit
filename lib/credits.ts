import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const CREDITS = {
  FREE_INITIAL: 100,
  REFERRAL_INITIAL: 200,
  REFERRAL_BONUS: 100,
  MONTHLY_FREE: 100,
  AD_REWARD: 10,
  PRO_MONTHLY: 1000
}

export interface CreditCheckResult {
  success: boolean
  balance?: number
  error?: string
  code?: 'INSUFFICIENT_CREDITS' | 'USER_NOT_FOUND' | 'DB_ERROR'
}

export async function checkCredits(userId: string, cost: number): Promise<CreditCheckResult> {
  const { data, error } = await supabaseAdmin
    .from('credits')
    .select('balance, plan')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return { success: false, error: 'User credits not found', code: 'USER_NOT_FOUND' }
  }

  if (data.plan === 'agency') {
    return { success: true, balance: data.balance }
  }

  if (data.balance < cost) {
    return { 
      success: false, 
      error: `Yetersiz kredi. Bu araç ${cost} kredi gerektiriyor, mevcut: ${data.balance}`,
      code: 'INSUFFICIENT_CREDITS',
      balance: data.balance
    }
  }

  return { success: true, balance: data.balance }
}

export async function useCredits(userId: string, cost: number, toolName: string): Promise<CreditCheckResult> {
  const { data: userData, error: fetchError } = await supabaseAdmin
    .from('credits')
    .select('balance, total_used, plan')
    .eq('user_id', userId)
    .single()

  if (fetchError || !userData) {
    return { success: false, error: 'User not found', code: 'USER_NOT_FOUND' }
  }

  if (userData.plan === 'agency') {
    try {
      await supabaseAdmin.from('tool_usage').insert({
        user_id: userId,
        tool_name: toolName,
        credits_used: 0
      })
    } catch {}
    return { success: true, balance: userData.balance }
  }

  if (userData.balance < cost) {
    return { 
      success: false, 
      error: `Yetersiz kredi.`,
      code: 'INSUFFICIENT_CREDITS',
      balance: userData.balance
    }
  }

  const newBalance = userData.balance - cost
  const newTotalUsed = (userData.total_used || 0) + cost

  const { error: updateError } = await supabaseAdmin
    .from('credits')
    .update({ 
      balance: newBalance, 
      total_used: newTotalUsed
    })
    .eq('user_id', userId)

  if (updateError) {
    return { success: false, error: 'Failed to update credits', code: 'DB_ERROR' }
  }

  try {
    await supabaseAdmin.from('tool_usage').insert({
      user_id: userId,
      tool_name: toolName,
      credits_used: cost
    })
  } catch {}

  return { success: true, balance: newBalance }
}

export async function initializeUserCredits(userId: string, isReferral: boolean = false): Promise<boolean> {
  const { data: existing } = await supabaseAdmin
    .from('credits')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (existing) return true

  const initialCredits = isReferral ? CREDITS.REFERRAL_INITIAL : CREDITS.FREE_INITIAL
  const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase()

  const { error } = await supabaseAdmin.from('credits').insert({
    user_id: userId,
    balance: initialCredits,
    total_used: 0,
    plan: 'free',
    referral_code: referralCode
  })

  return !error
}

export async function addCredits(userId: string, amount: number): Promise<boolean> {
  const { data, error: fetchError } = await supabaseAdmin
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single()

  if (fetchError || !data) return false

  const { error } = await supabaseAdmin
    .from('credits')
    .update({ balance: data.balance + amount })
    .eq('user_id', userId)

  return !error
}
