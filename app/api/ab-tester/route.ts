import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { contentA, contentB, platform, testType, language } = await request.json()

    if (!contentA || !contentB) {
      return NextResponse.json({ error: 'Both content versions are required' }, { status: 400 })
    }

    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'ab-tester')
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

    const systemPrompt = `You are an A/B testing expert for social media content.

You MUST return ONLY valid JSON:
{
  "winner": "A" or "B",
  "confidence": 85,
  "analysis": {
    "version_a": {
      "score": 7.5,
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1"]
    },
    "version_b": {
      "score": 8.2,
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1"]
    }
  },
  "comparison": {
    "hook_power": { "a": 7, "b": 8, "winner": "B" },
    "clarity": { "a": 8, "b": 7, "winner": "A" },
    "emotional_impact": { "a": 7, "b": 9, "winner": "B" },
    "call_to_action": { "a": 6, "b": 8, "winner": "B" }
  },
  "recommendation": "detailed recommendation",
  "improved_version": "best version combining strengths of both"
}`

    const userPrompt = `Compare these two content versions:

VERSION A:
"${contentA}"

VERSION B:
"${contentB}"

Platform: ${platform || 'tiktok'}
Test focus: ${testType || 'overall performance'}
${langMap[language as string] || langMap['en']}

Analyze and pick a clear winner with reasoning.
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
      // Remove markdown code fences (various formats)
      cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')
      // Find first { and last } to extract JSON
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
    await saveContent(userId, 'ab-tester', contentA || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('AB Tester Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
