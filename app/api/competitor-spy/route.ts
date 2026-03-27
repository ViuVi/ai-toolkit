import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'competitor-spy'

export async function POST(request: NextRequest) {
  try {
    const { competitor, platform, yourNiche, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!competitor) {
      return NextResponse.json({ error: 'Competitor info is required' }, { status: 400 })
    }

    const systemPrompt = `You are CompetitorAnalyst, expert at competitive analysis.

Return ONLY valid JSON:
{
  "profile_analysis": {"content_style": "style", "posting_frequency": "freq", "engagement_rate": "estimate"},
  "content_strategy": {"top_formats": ["format"], "common_hooks": ["hook"], "cta_patterns": ["cta"]},
  "strengths": [{"strength": "what", "example": "how"}],
  "weaknesses": [{"weakness": "what", "opportunity": "for you"}],
  "content_gaps": [{"gap": "what's missing", "your_opportunity": "how to fill"}],
  "actionable_insights": [{"insight": "what to do", "priority": "high/medium/low"}]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Analyze competitor: "${competitor}"
Platform: ${platform}, Your Niche: ${yourNiche}
${langMap[language] || langMap['en']}
Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.75, max_tokens: 4000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Competitor Spy Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
