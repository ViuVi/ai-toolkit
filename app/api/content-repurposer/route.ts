import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'content-repurposer'

export async function POST(request: NextRequest) {
  try {
    const { content, sourceType, targetPlatforms, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const systemPrompt = `You are ContentRepurposer, expert at transforming content for multiple platforms.

Return ONLY valid JSON:
{
  "original_summary": "brief summary of original",
  "repurposed": [
    {
      "platform": "TikTok",
      "format": "short video script",
      "content": "adapted content",
      "hook": "platform-specific hook",
      "hashtags": ["#tag"],
      "tips": ["adaptation tip"]
    }
  ],
  "content_calendar": [{"day": 1, "platform": "platform", "content_type": "type"}],
  "maximizing_tips": ["tip for getting most out of repurposing"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Repurpose this ${sourceType || 'content'}: "${content}"
Target platforms: ${targetPlatforms?.join(', ') || 'TikTok, Instagram, Twitter, LinkedIn'}
${langMap[language] || langMap['en']}
Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.8, max_tokens: 5000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content2 = data.choices?.[0]?.message?.content
    if (!content2) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content2), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Content Repurposer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
