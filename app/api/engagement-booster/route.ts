import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, niche, contentType, platform, goal, language } = await request.json()
    const finalContent = content || niche || ''

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'engagement-booster')
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

    const systemPrompt = `You are an engagement optimization expert. Return ONLY valid JSON:
{
  "current_score": 6.5,
  "optimized_versions": [
    {
      "version": "optimized content",
      "changes": ["change 1", "change 2"],
      "expected_lift": "+35%"
    }
  ],
  "engagement_hooks": ["hook 1", "hook 2"],
  "cta_suggestions": ["cta 1", "cta 2"],
  "reply_starters": ["comment prompt 1", "comment prompt 2"],
  "hashtag_strategy": { "primary": ["#tag"], "secondary": ["#tag2"] }
}`

    const userPrompt = `Optimize this content for maximum engagement:
"${content}"

Platform: ${platform || 'instagram'}
Goal: ${goal || 'more comments and shares'}
${langMap[language as string] || langMap['en']}
Respond with ONLY JSON.
${brandContext}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.8, max_tokens: 3000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content2 = data.choices?.[0]?.message?.content
    if (!content2) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

        let result
    try {
      let cleanContent = content2.trim()
      cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')
      const firstBrace = cleanContent.indexOf('{')
      const lastBrace = cleanContent.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1)
      }
      result = JSON.parse(cleanContent)
    } catch {
      result = { raw: content2 }
    }

    
    // Auto-save to content library
    await saveContent(userId, 'engagement-booster', content || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Engagement Booster Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
