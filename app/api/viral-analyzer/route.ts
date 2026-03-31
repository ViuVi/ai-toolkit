import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, platform, contentType, language } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'viral-analyzer')
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
      let cleanContent = content.trim()
      cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')
      const firstBrace = cleanContent.indexOf('{')
      const lastBrace = cleanContent.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1)
      }
      result = JSON.parse(cleanContent)
    } catch {
      result = { raw: content }
    }

    
    // Auto-save to content library
    await saveContent(userId, 'viral-analyzer', content || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Viral Analyzer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
