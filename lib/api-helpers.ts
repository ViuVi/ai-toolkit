import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tool kredi maliyetleri
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

export interface CreditCheckResult {
  success: boolean
  userData?: {
    balance: number
    plan: string
    total_used: number
  }
  error?: string
  response?: NextResponse
}

/**
 * Kredi kontrolü yap
 * @param userId - Kullanıcı ID
 * @param toolName - Tool adı (kredi maliyeti için)
 * @returns CreditCheckResult
 */
export async function checkAndUseCredits(
  userId: string | undefined,
  toolName: string
): Promise<CreditCheckResult> {
  const cost = TOOL_CREDITS[toolName] || 5

  // User ID kontrolü
  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized',
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Kullanıcı bilgilerini al
  const { data: userData, error: fetchError } = await supabaseAdmin
    .from('credits')
    .select('balance, plan, total_used')
    .eq('user_id', userId)
    .single()

  if (fetchError || !userData) {
    return {
      success: false,
      error: 'User not found',
      response: NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  }

  // Agency plan sınırsız
  if (userData.plan === 'agency') {
    return { success: true, userData }
  }

  // Kredi kontrolü
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

/**
 * Krediyi düşür (başarılı işlem sonrası çağrılmalı)
 * @param userId - Kullanıcı ID
 * @param toolName - Tool adı
 * @param currentBalance - Mevcut bakiye
 * @param currentTotalUsed - Mevcut toplam kullanım
 * @returns Yeni bakiye
 */
export async function deductCredits(
  userId: string,
  toolName: string,
  currentBalance: number,
  currentTotalUsed: number
): Promise<number> {
  const cost = TOOL_CREDITS[toolName] || 5
  const newBalance = currentBalance - cost
  const newTotalUsed = currentTotalUsed + cost

  // Krediyi düşür
  await supabaseAdmin
    .from('credits')
    .update({
      balance: newBalance,
      total_used: newTotalUsed,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  // Kullanım kaydı
  await supabaseAdmin.from('tool_usage').insert({
    user_id: userId,
    tool_name: toolName,
    credits_used: cost,
    created_at: new Date().toISOString()
  }).catch(() => {})

  return newBalance
}

/**
 * Groq API çağrısı helper
 */
export async function callGroqAPI(
  systemPrompt: string,
  userPrompt: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<{ success: boolean; content?: string; error?: string }> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 4000,
      }),
    })

    if (!response.ok) {
      return { success: false, error: 'AI service error' }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return { success: false, error: 'No response from AI' }
    }

    return { success: true, content }
  } catch (error) {
    console.error('Groq API error:', error)
    return { success: false, error: 'AI service error' }
  }
}

/**
 * JSON parse helper - AI response'dan JSON çıkar
 */
export function parseAIResponse(content: string): any {
  try {
    let cleanContent = content.trim()
    if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
    else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
    if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
    return JSON.parse(cleanContent.trim())
  } catch {
    return { raw: content }
  }
}
