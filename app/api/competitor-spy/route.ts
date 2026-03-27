import { NextRequest, NextResponse } from 'next/server'
import { checkAndDeductCredits } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { competitorInfo, platform, analysisType, language, userId } = await request.json()

    if (!competitorInfo) {
      return NextResponse.json({ error: 'Competitor info is required' }, { status: 400 })
    }

    const creditResult = await checkAndDeductCredits(userId, 'competitor-spy')
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

    const systemPrompt = `You are a competitive analysis expert for social media.

You MUST return ONLY valid JSON:
{
  "competitor_analysis": {
    "content_strategy": "their approach",
    "posting_patterns": "frequency and timing",
    "engagement_tactics": ["tactic 1", "tactic 2"],
    "top_performing_content": ["type 1", "type 2"],
    "weaknesses": ["weakness 1", "weakness 2"]
  },
  "opportunities": [
    {
      "gap": "content gap found",
      "your_angle": "how to exploit it",
      "priority": "high/medium/low"
    }
  ],
  "content_ideas": [
    {
      "idea": "content idea",
      "why": "why it works",
      "hook": "suggested hook"
    }
  ],
  "differentiation_strategy": "how to stand out",
  "action_plan": ["step 1", "step 2", "step 3"]
}`

    const userPrompt = `Analyze this competitor: "${competitorInfo}"

Platform: ${platform || 'tiktok'}
Analysis focus: ${analysisType || 'full analysis'}
${langMap[language as string] || langMap['en']}

Find actionable opportunities to outperform them.
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
        temperature: 0.8,
        max_tokens: 4000,
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

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Competitor Spy Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
