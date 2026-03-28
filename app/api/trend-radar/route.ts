import { NextRequest, NextResponse } from 'next/server'
import { checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, timeframe, language, userId } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const creditResult = await checkAndDeductCredits(userId, 'trend-radar')
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

    const systemPrompt = `You are a social media trend analyst who spots viral patterns.

You MUST return ONLY valid JSON:
{
  "trends": [
    {
      "trend": "trend name/description",
      "platform": "where it's trending",
      "growth": "rising/peak/declining",
      "potential": "high/medium/low",
      "how_to_use": "actionable advice",
      "example_content": "example idea"
    }
  ],
  "emerging_sounds": ["sound 1", "sound 2"],
  "hashtag_trends": ["#tag1", "#tag2"],
  "content_formats": ["format 1", "format 2"],
  "prediction": "what will trend next"
}`

    const userPrompt = `Analyze current trends for: "${niche}"

Platform: ${platform || 'all'}
Timeframe: ${timeframe || 'this week'}
${langMap[language as string] || langMap['en']}

Focus on actionable trends creators can use NOW.
Respond with ONLY JSON.
${brandContext}`

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
        temperature: 0.8,
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    let result
    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch {
      result = { raw: content }
    }

    
    // Auto-save to content library
    await saveContent(userId, 'trend-radar', niche || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Trend Radar Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
