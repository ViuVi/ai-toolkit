// Media Tool Kit - Groq AI Helper
// Basitleştirilmiş versiyon

export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
export const GROQ_MODEL = 'llama-3.3-70b-versatile'

// Basit AI çağrısı
export async function callGroqAI(
  systemPrompt: string,
  userPrompt: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<{ success: boolean; data?: any; error?: string }> {
  const { temperature = 0.7, maxTokens = 2000 } = options

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return { success: false, error: 'API key not configured' }
  }

  try {
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
      return { success: false, error: `API error: ${response.status}` }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return { success: false, error: 'Empty response' }
    }

    try {
      const parsed = JSON.parse(content)
      return { success: true, data: parsed }
    } catch {
      return { success: true, data: { text: content } }
    }
  } catch (error: any) {
    console.error('Groq Error:', error)
    return { success: false, error: error.message }
  }
}
