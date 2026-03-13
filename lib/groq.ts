// Media Tool Kit - Groq AI Helper
// Hem eski hem yeni API'lerle uyumlu

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

interface AIResponse {
  success: boolean
  data?: any
  error?: string
}

// Ana AI çağrı fonksiyonu (YENİ İSİM)
export async function callAI(
  systemPrompt: string,
  userPrompt: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<AIResponse> {
  const { temperature = 0.7, maxTokens = 4000 } = options

  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error('GROQ_API_KEY not found')
      return { success: false, error: 'API yapılandırma hatası' }
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API Error:', response.status, errorText)
      return { success: false, error: `AI servisi hatası: ${response.status}` }
    }

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content

    if (!content) {
      return { success: false, error: 'AI boş yanıt döndü' }
    }

    try {
      const parsed = JSON.parse(content)
      return { success: true, data: parsed }
    } catch (e) {
      return { success: true, data: { text: content } }
    }

  } catch (error: any) {
    console.error('AI Call Error:', error)
    return { success: false, error: error.message || 'Bir hata oluştu' }
  }
}

// ESKİ İSİM - Geriye uyumluluk için
export async function callGroqAI(
  systemPrompt: string,
  userPrompt: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const result = await callAI(systemPrompt, userPrompt, options)
  if (result.success && result.data) {
    return JSON.stringify(result.data)
  }
  throw new Error(result.error || 'AI hatası')
}

// JSON Parse helper (ESKİ - geriye uyumluluk)
export function parseJSONResponse(text: string): any {
  try {
    // Markdown code block temizle
    let cleaned = text.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7)
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3)
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3)
    }
    return JSON.parse(cleaned.trim())
  } catch (e) {
    console.error('JSON parse error:', e)
    return null
  }
}

// Kredi kontrolü
export async function checkCredits(
  supabase: any,
  userId: string | null,
  requiredCredits: number,
  language: string = 'tr'
): Promise<{ ok: boolean; balance?: number; error?: string }> {
  
  if (!userId) {
    return { 
      ok: false, 
      error: language === 'tr' ? 'Giriş yapmanız gerekiyor' : 'Please log in' 
    }
  }

  try {
    const { data, error } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      console.error('Credit check error:', error)
      return { 
        ok: false, 
        error: language === 'tr' ? 'Kredi bilgisi alınamadı' : 'Could not get credit info' 
      }
    }

    if (data.balance < requiredCredits) {
      return { 
        ok: false, 
        error: language === 'tr' 
          ? `Yetersiz kredi. Gereken: ${requiredCredits}, Mevcut: ${data.balance}`
          : `Insufficient credits. Required: ${requiredCredits}, Available: ${data.balance}`,
        balance: data.balance 
      }
    }

    return { ok: true, balance: data.balance }
  } catch (err: any) {
    console.error('Credit error:', err)
    return { 
      ok: false, 
      error: language === 'tr' ? 'Kredi kontrolü başarısız' : 'Credit check failed' 
    }
  }
}

// Kredi düş
export async function deductCredits(
  supabase: any,
  userId: string,
  amount: number
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('credits')
      .select('balance, total_used')
      .eq('user_id', userId)
      .single()

    if (!data) return false

    await supabase
      .from('credits')
      .update({
        balance: data.balance - amount,
        total_used: (data.total_used || 0) + amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    return true
  } catch (err) {
    console.error('Deduct credits error:', err)
    return false
  }
}
