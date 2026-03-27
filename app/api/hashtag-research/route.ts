import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'hashtag-research'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are HashtagMaster, expert at hashtag strategy.

Return ONLY valid JSON:
{
  "primary_hashtags": [{"tag": "#tag", "reach": "high/medium/low", "competition": "high/medium/low"}],
  "niche_hashtags": [{"tag": "#tag", "relevance": "why relevant"}],
  "trending_hashtags": [{"tag": "#tag", "trend_duration": "days"}],
  "avoid_hashtags": [{"tag": "#tag", "reason": "why avoid"}],
  "hashtag_sets": [
    {"name": "High Reach", "tags": ["#tag1", "#tag2"], "use_case": "when to use"}
  ],
  "strategy_tip": "overall tip"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Research hashtags for: "${topic}"
Platform: ${platform}
${langMap[language] || langMap['en']}
Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.75, max_tokens: 3000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Hashtag Research Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
