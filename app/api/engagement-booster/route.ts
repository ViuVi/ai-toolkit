import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'engagement-booster'

export async function POST(request: NextRequest) {
  try {
    const { content, platform, goal, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const systemPrompt = `You are EngagementExpert, specialist in boosting social media engagement.

Return ONLY valid JSON:
{
  "engagement_score": 65,
  "analysis": {"current_cta": "existing", "emotion_level": "low/medium/high", "shareability": "score"},
  "optimized_versions": [
    {"version": "optimized content", "changes": ["what changed"], "expected_lift": "+25%"}
  ],
  "cta_suggestions": [{"cta": "text", "type": "comment/share/save", "placement": "where"}],
  "hook_improvements": [{"original": "old", "improved": "new", "why": "reason"}],
  "engagement_tips": ["tip1", "tip2"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Boost engagement for: "${content}"
Platform: ${platform}, Goal: ${goal || 'more comments'}
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
    const content2 = data.choices?.[0]?.message?.content
    if (!content2) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content2), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Engagement Booster Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
