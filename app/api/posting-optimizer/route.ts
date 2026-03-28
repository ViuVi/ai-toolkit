import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, timezone, audienceType, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'posting-optimizer')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const langMap: Record<string, string> = {
      'tr': 'Respond entirely in Turkish.',
      'en': 'Respond in English.',
      'ru': 'Respond in Russian.',
      'de': 'Respond in German.',
      'fr': 'Respond in French.'
    }

    const systemPrompt = `You are a social media timing expert. Return ONLY valid JSON:
{
  "best_times": {
    "monday": ["9:00 AM", "7:00 PM"],
    "tuesday": ["10:00 AM", "8:00 PM"],
    "wednesday": ["9:00 AM", "6:00 PM"],
    "thursday": ["11:00 AM", "7:00 PM"],
    "friday": ["10:00 AM", "5:00 PM"],
    "saturday": ["11:00 AM", "3:00 PM"],
    "sunday": ["12:00 PM", "8:00 PM"]
  },
  "peak_hours": ["9-11 AM", "7-9 PM"],
  "avoid_times": ["2-4 AM", "during major events"],
  "content_calendar_tip": "weekly strategy advice",
  "frequency_recommendation": "how often to post",
  "platform_specific": { "insight": "platform-specific tip" }
}`

    const userPrompt = `Optimize posting schedule for: "${niche}"
Platform: ${platform || 'instagram'}
Timezone: ${timezone || 'UTC'}
Audience: ${audienceType || 'general'}
${langMap[language as string] || langMap['en']}
Respond with ONLY JSON.
${brandContext}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.7, max_tokens: 2500,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    let result
    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch { result = { raw: content } }

    
    // Auto-save to content library
    await saveContent(userId, 'posting-optimizer', niche || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Posting Optimizer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
