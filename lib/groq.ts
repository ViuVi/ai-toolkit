// Groq AI Helper - Merkezi AI Fonksiyonu
// Media Tool Kit - Optimized Version

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

interface GroqOptions {
  temperature?: number
  maxTokens?: number
}

// Ana AI çağrı fonksiyonu
export async function callGroqAI(
  systemPrompt: string,
  userPrompt: string,
  options: GroqOptions = {}
): Promise<string> {
  const { temperature = 0.8, maxTokens = 2000 } = options

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured')
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
      max_tokens: maxTokens
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Groq API Error:', response.status, errorText)
    throw new Error(`AI service error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('Empty response from AI')
  }

  return content
}

// JSON parse helper
export function parseJSONResponse(text: string): any {
  console.log('Raw AI Response:', text.substring(0, 500))
  
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
  
  cleaned = cleaned.trim()

  // Direkt parse dene
  try {
    const result = JSON.parse(cleaned)
    console.log('Parsed JSON:', JSON.stringify(result).substring(0, 200))
    return result
  } catch (e) {
    console.log('Direct parse failed, trying to extract JSON...')
    
    // JSON object bul
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        const result = JSON.parse(match[0])
        console.log('Extracted JSON object:', JSON.stringify(result).substring(0, 200))
        return result
      } catch (e2) {
        console.error('JSON object parse failed:', e2)
      }
    }
    
    // Array bul
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/)
    if (arrayMatch) {
      try {
        const result = JSON.parse(arrayMatch[0])
        console.log('Extracted JSON array:', JSON.stringify(result).substring(0, 200))
        return result
      } catch (e2) {
        console.error('JSON array parse failed:', e2)
      }
    }
    
    console.error('Could not parse response:', cleaned.substring(0, 300))
    throw new Error('Could not parse AI response as JSON')
  }
}

// Kredi kontrolü ve düşürme
export async function checkCredits(
  supabase: any,
  userId: string | null,
  cost: number,
  language: string = 'en'
): Promise<{ ok: boolean; error?: string; balance?: number }> {
  
  // userId yoksa geç (demo mod)
  if (!userId) {
    return { ok: true }
  }

  try {
    // Kredi sorgula
    const { data, error } = await supabase
      .from('credits')
      .select('balance, total_used')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      console.error('Credit query error:', error)
      return {
        ok: false,
        error: language === 'tr' ? 'Kredi bilgisi bulunamadı' : 'Credits not found'
      }
    }

    // Yeterli kredi var mı?
    if (data.balance < cost) {
      return {
        ok: false,
        error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits',
        balance: data.balance
      }
    }

    // Krediyi düş
    const { error: updateError } = await supabase
      .from('credits')
      .update({
        balance: data.balance - cost,
        total_used: (data.total_used || 0) + cost,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Credit update error:', updateError)
      return {
        ok: false,
        error: language === 'tr' ? 'Kredi güncellenemedi' : 'Failed to update credits'
      }
    }

    return {
      ok: true,
      balance: data.balance - cost
    }

  } catch (err) {
    console.error('Credit check error:', err)
    return {
      ok: false,
      error: language === 'tr' ? 'Bir hata oluştu' : 'An error occurred'
    }
  }
}
