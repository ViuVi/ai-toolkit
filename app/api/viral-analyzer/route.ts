import { NextRequest, NextResponse } from 'next/server'
import { checkAndDeductCredits } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, platform, contentType, language, userId } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const creditResult = await checkAndDeductCredits(userId, 'viral-analyzer')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const langMap: Record<string, string> = {
      'tr': 'Respond entirely in Turkish.',
      'en': 'Respond in English.',
      'ru': 'Respond in Russian.',
      'de': 'Respond in German.',
      'fr': 'Respond in French.'
    }

    const systemPrompt = `You are a viral content analyst who predicts content performance.

You MUST return ONLY valid JSON:
{
  "viral_score": 7.5,
  "breakdown": {
    "hook_strength": 8,
    "emotional_impact": 7,
    "shareability": 8,
    "trend_alignment": 6,
    "uniqueness": 7
  },
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": [
    {
      "area": "what to improve",
      "suggestion": "how to improve",
      "impact": "high/medium/low"
    }
  ],
  "predicted_performance": "10K-50K views",
  "best_posting_time": "recommendation"
}`

    const userPrompt = `Analyze this content for viral potential:

"${content}"

Platform: ${platform || 'tiktok'}
Content type: ${contentType || 'video'}
${langMap[language as string] || langMap['en']}

Be specific and actionable in feedback.
Respond with ONLY JSON.`

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
        temperature: 0.7,
        max_tokens: 2500,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const content2 = data.choices?.[0]?.message?.content

    if (!content2) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    let result
    try {
      let cleanContent = content2.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch {
      result = { raw: content2 }
    }

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Viral Analyzer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
