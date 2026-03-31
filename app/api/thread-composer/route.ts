import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, tweetCount, style, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'thread-composer')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const langMap: Record<string, string> = {
      'tr': 'Write the ENTIRE thread in Turkish.',
      'en': 'Write in English.',
      'ru': 'Write in Russian.',
      'de': 'Write in German.',
      'fr': 'Write in French.'
    }

    const systemPrompt = `You are a viral Twitter/X thread writer. Return ONLY valid JSON:
{
  "thread": {
    "hook_tweet": "attention-grabbing first tweet",
    "tweets": [
      { "number": 1, "content": "tweet content (max 280 chars)", "purpose": "hook/value/cta" }
    ],
    "closing_tweet": "strong CTA tweet"
  },
  "engagement_tips": ["tip1", "tip2"],
  "best_posting_time": "recommendation"
}`

    const userPrompt = `Create a ${tweetCount || 10}-tweet thread about: "${topic}"
Style: ${style || 'educational'}
${langMap[language as string] || langMap['en']}
Each tweet max 280 characters. Make it viral-worthy.
Respond with ONLY JSON.
${brandContext}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.8, max_tokens: 3500,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

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
    await saveContent(userId, 'thread-composer', topic || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Thread Composer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
