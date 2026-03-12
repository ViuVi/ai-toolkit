// Groq AI Helper - Merkezi AI Fonksiyonu
// Llama 3.1 70B - Hızlı ve Kaliteli

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile' // Güncel model adı

interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GroqOptions {
  temperature?: number
  maxTokens?: number
  topP?: number
}

export async function generateWithGroq(
  systemPrompt: string,
  userPrompt: string,
  options: GroqOptions = {}
): Promise<string> {
  const {
    temperature = 0.8,
    maxTokens = 2000,
    topP = 0.9
  } = options

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
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
      top_p: topP
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Groq API Error Response:', errorText)
    console.error('Groq API Status:', response.status)
    console.error('Request body was:', JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt.substring(0, 100) + '...' },
        { role: 'user', content: userPrompt.substring(0, 100) + '...' }
      ],
      temperature,
      max_tokens: maxTokens,
      top_p: topP
    }))
    throw new Error(`Groq API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// JSON response için helper
export async function generateJSONWithGroq(
  systemPrompt: string,
  userPrompt: string,
  options: GroqOptions = {}
): Promise<any> {
  const fullSystemPrompt = `${systemPrompt}\n\nIMPORTANT: You MUST respond with valid JSON only. No markdown, no code blocks, no explanation. Just pure JSON.`
  
  const response = await generateWithGroq(fullSystemPrompt, userPrompt, options)
  
  // JSON'u parse et
  try {
    // Markdown code block varsa temizle
    let cleaned = response.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7)
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3)
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3)
    }
    cleaned = cleaned.trim()
    
    return JSON.parse(cleaned)
  } catch (e) {
    // JSON parse başarısız olursa, içinden JSON bulmaya çalış
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch (e2) {
        console.error('JSON parse error:', e2)
        throw new Error('Invalid JSON response from AI')
      }
    }
    throw new Error('No valid JSON in response')
  }
}

// Kredi kontrolü ve düşürme
export async function checkAndDeductCredits(
  supabase: any,
  userId: string,
  requiredCredits: number,
  language: string = 'en'
): Promise<{ success: boolean; error?: string; currentBalance?: number }> {
  if (!userId) {
    return { success: true } // Giriş yapmamış kullanıcı (demo?)
  }

  const { data: creditsData, error } = await supabase
    .from('credits')
    .select('balance, total_used')
    .eq('user_id', userId)
    .single()

  if (error || !creditsData) {
    return { 
      success: false, 
      error: language === 'tr' ? 'Kredi bilgisi bulunamadı' : 'Credits not found' 
    }
  }

  if (creditsData.balance < requiredCredits) {
    return { 
      success: false, 
      error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits',
      currentBalance: creditsData.balance
    }
  }

  // Krediyi düş
  const { error: updateError } = await supabase
    .from('credits')
    .update({ 
      balance: creditsData.balance - requiredCredits,
      total_used: (creditsData.total_used || 0) + requiredCredits,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('Credit update error:', updateError)
    return { 
      success: false, 
      error: language === 'tr' ? 'Kredi güncellenemedi' : 'Failed to update credits' 
    }
  }

  return { 
    success: true, 
    currentBalance: creditsData.balance - requiredCredits 
  }
}
