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
  
  // Önce mevcut krediyi kontrol et
  const credits = await getUserCredits(userId)
  
  if (!credits) {
    return { success: false, error: 'Credits not found' }
  }

  if (credits.balance < amount) {
    return { success: false, error: 'Insufficient credits' }
  }

  // Krediyi düşür
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
  const { error: historyError } = await supabase
    .from('usage_history')
    .insert({
      user_id: userId,
      tool_name: toolName,
      tool_display_name: toolDisplayName,
      credits_used: amount,
      input_preview: inputPreview.substring(0, 200),
      output_preview: outputPreview.substring(0, 200),
    })

  if (historyError) {
    console.error('Error adding history:', historyError)
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

// Yeni kullanıcı için kredi oluştur (eğer yoksa)
export async function initializeCredits(userId: string): Promise<void> {
  const { data } = await supabase
    .from('credits')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!data) {
    await supabase
      .from('credits')
      .insert({
        user_id: userId,
        balance: 50,
        total_used: 0
      })
  }
}