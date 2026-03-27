import { supabase } from './supabase'

export interface UserCredits {
  balance: number
  total_used: number
}

export interface UsageRecord {
  id: string
  tool_name: string
  tool_display_name: string
  credits_used: number
  input_preview: string
  output_preview: string
  created_at: string
}

// Kullanıcının kredilerini al
export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const { data, error } = await supabase
    .from('credits')
    .select('balance, total_used')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching credits:', error)
    return null
  }

  return data
}

// Kredi kullan
export async function useCredits(
  userId: string, 
  amount: number,
  toolName: string,
  toolDisplayName: string,
  inputPreview: string,
  outputPreview: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  
  const credits = await getUserCredits(userId)
  
  if (!credits) {
    return { success: false, error: 'Credits not found' }
  }

  if (credits.balance < amount) {
    return { success: false, error: 'Insufficient credits' }
  }

  const newBalance = credits.balance - amount
  const newTotalUsed = credits.total_used + amount

  const { error: updateError } = await supabase
    .from('credits')
    .update({ 
      balance: newBalance, 
      total_used: newTotalUsed,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('Error updating credits:', updateError)
    return { success: false, error: 'Failed to update credits' }
  }

  // Kullanım geçmişine ekle
  try {
    await supabase
      .from('usage_history')
      .insert({
        user_id: userId,
        tool_name: toolName,
        tool_display_name: toolDisplayName,
        credits_used: amount,
        input_preview: inputPreview.substring(0, 200),
        output_preview: outputPreview.substring(0, 200),
      })
  } catch (e) {
    console.error('Error adding history:', e)
  }

  return { success: true, newBalance }
}

// Kullanım geçmişini al
export async function getUsageHistory(userId: string, limit: number = 10): Promise<UsageRecord[]> {
  const { data, error } = await supabase
    .from('usage_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching history:', error)
    return []
  }

  return data || []
}

// Yeni kullanıcı için kredi oluştur
export async function initializeCredits(userId: string, isReferral: boolean = false): Promise<void> {
  const { data } = await supabase
    .from('credits')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!data) {
    const initialCredits = isReferral ? 200 : 100
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    
    await supabase
      .from('credits')
      .insert({
        user_id: userId,
        balance: initialCredits,
        total_used: 0,
        plan: 'free',
        referral_code: referralCode
      })
  }
}

// Kredi ekle (reklam, referral bonus vs)
export async function addCredits(userId: string, amount: number, reason: string): Promise<boolean> {
  const { data, error: fetchError } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single()

  if (fetchError || !data) return false

  const { error } = await supabase
    .from('credits')
    .update({ balance: data.balance + amount })
    .eq('user_id', userId)

  if (error) {
    console.error('Add credits error:', error)
    return false
  }

  return true
}
