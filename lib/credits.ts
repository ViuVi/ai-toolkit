import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (service role key ile)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tool başına kredi maliyetleri
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

// Kredi sabitleri
export const CREDITS = {
  FREE_INITIAL: 100,        // Referanssız üye başlangıç kredisi
  REFERRAL_INITIAL: 200,    // Referanslı üye başlangıç kredisi
  REFERRAL_BONUS: 100,      // Davet edene bonus
  MONTHLY_FREE: 100,        // Aylık ücretsiz kredi
  AD_REWARD: 10,            // Reklam izleme ödülü
  PRO_MONTHLY: 1000,        // Pro plan aylık kredi
  AGENCY_UNLIMITED: 999999  // Agency plan (sınırsız)
}

export interface CreditCheckResult {
  success: boolean
  balance?: number
  error?: string
  code?: 'INSUFFICIENT_CREDITS' | 'USER_NOT_FOUND' | 'DB_ERROR'
}

// Kullanıcının kredisini kontrol et
export async function checkCredits(userId: string, toolName: string): Promise<CreditCheckResult> {
  const cost = TOOL_CREDITS[toolName] || 5

  const { data, error } = await supabaseAdmin
    .from('credits')
    .select('balance, plan')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return { success: false, error: 'User credits not found', code: 'USER_NOT_FOUND' }
  }

  // Agency plan sınırsız
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

// Kredi kullan ve düşür
export async function useCredits(userId: string, toolName: string): Promise<CreditCheckResult> {
  const cost = TOOL_CREDITS[toolName] || 5

  // Önce mevcut durumu kontrol et
  const { data: userData, error: fetchError } = await supabaseAdmin
    .from('credits')
    .select('balance, total_used, plan')
    .eq('user_id', userId)
    .single()

  if (fetchError || !userData) {
    return { success: false, error: 'User not found', code: 'USER_NOT_FOUND' }
  }

  // Agency plan kredi düşmez
  if (userData.plan === 'agency') {
    // Sadece kullanım kaydı tut
    await supabaseAdmin.from('tool_usage').insert({
      user_id: userId,
      tool_name: toolName,
      credits_used: 0
    })
    return { success: true, balance: userData.balance }
  }

  // Kredi kontrolü
  if (userData.balance < cost) {
    return { 
      success: false, 
      error: `Yetersiz kredi. Bu araç ${cost} kredi gerektiriyor.`,
      code: 'INSUFFICIENT_CREDITS',
      balance: userData.balance
    }
  }

  // Krediyi düşür
  const newBalance = userData.balance - cost
  const newTotalUsed = (userData.total_used || 0) + cost

  const { error: updateError } = await supabaseAdmin
    .from('credits')
    .update({ 
      balance: newBalance, 
      total_used: newTotalUsed,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('Credit update error:', updateError)
    return { success: false, error: 'Failed to update credits', code: 'DB_ERROR' }
  }

  // Kullanım kaydı
  await supabaseAdmin.from('tool_usage').insert({
    user_id: userId,
    tool_name: toolName,
    credits_used: cost
  })

  return { success: true, balance: newBalance }
}

// Yeni kullanıcı için kredi oluştur
export async function initializeUserCredits(userId: string, isReferral: boolean = false): Promise<boolean> {
  // Zaten var mı kontrol et
  const { data: existing } = await supabaseAdmin
    .from('credits')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (existing) {
    return true // Zaten var
  }

  const initialCredits = isReferral ? CREDITS.REFERRAL_INITIAL : CREDITS.FREE_INITIAL
  const referralCode = generateReferralCode()

  const { error } = await supabaseAdmin.from('credits').insert({
    user_id: userId,
    balance: initialCredits,
    total_used: 0,
    plan: 'free',
    referral_code: referralCode,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })

  if (error) {
    console.error('Initialize credits error:', error)
    return false
  }

  return true
}

// Referral kodu oluştur
function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Kredi ekle (reklam izleme, referral bonus vs)
export async function addCredits(userId: string, amount: number, reason: string): Promise<boolean> {
  const { data, error: fetchError } = await supabaseAdmin
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single()

  if (fetchError || !data) return false

  const { error } = await supabaseAdmin
    .from('credits')
    .update({ 
      balance: data.balance + amount,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (error) {
    console.error('Add credits error:', error)
    return false
  }

  // Log
  await supabaseAdmin.from('credit_logs').insert({
    user_id: userId,
    amount: amount,
    reason: reason,
    created_at: new Date().toISOString()
  }).catch(() => {}) // Log hatası kritik değil

  return true
}

// User ID'yi auth header'dan al
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.replace('Bearer ', '')
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  
  if (error || !user) {
    return null
  }

  return user.id
}
