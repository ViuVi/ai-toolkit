import { NextRequest, NextResponse } from 'next/server'
import { checkAndDeductCredits } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, tweetCount, style, language, userId } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const creditResult = await checkAndDeductCredits(userId, 'thread-composer')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

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
Respond with ONLY JSON.`

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
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch { result = { raw: content } }

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Thread Composer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
