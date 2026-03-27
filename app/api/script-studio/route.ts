import { NextRequest, NextResponse } from 'next/server'
import { checkCredits, deductCredits, parseAIResponse, TOOL_CREDITS } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const TOOL_NAME = 'script-studio'

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration, style, language, userId } = await request.json()

    const creditCheck = await checkCredits(userId, TOOL_NAME)
    if (!creditCheck.success) return creditCheck.response

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are ScriptMaster, expert at viral video scripts.

Return ONLY valid JSON:
{
  "script": {
    "hook": "opening hook (3 sec)",
    "intro": "context setup",
    "main_points": ["point 1", "point 2", "point 3"],
    "climax": "key revelation",
    "cta": "call to action",
    "full_script": "complete script text"
  },
  "timing": {"total_duration": "60s", "hook": "3s", "intro": "10s", "main": "35s", "cta": "12s"},
  "visual_cues": ["cue 1", "cue 2"],
  "engagement_tips": ["tip 1", "tip 2"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write in Turkish.', 'en': 'Write in English.',
      'ru': 'Write in Russian.', 'de': 'Write in German.', 'fr': 'Write in French.'
    }

    const userPrompt = `Create a ${duration || '60s'} video script for: "${topic}"
Platform: ${platform}, Style: ${style}
${langMap[language] || langMap['en']}
Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.8, max_tokens: 4000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    const newBalance = await deductCredits(userId, TOOL_NAME, creditCheck.userData!)

    return NextResponse.json({ result: parseAIResponse(content), creditsUsed: TOOL_CREDITS[TOOL_NAME], newBalance })
  } catch (error) {
    console.error('Script Studio Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
