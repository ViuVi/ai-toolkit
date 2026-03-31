import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { videoDescription, platform, goal, language } = await request.json()

    if (!videoDescription) {
      return NextResponse.json({ error: 'Video description is required' }, { status: 400 })
    }

    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'steal-video')
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

    const systemPrompt = `You are a content strategist who reverse-engineers viral videos.

You MUST return ONLY valid JSON:
{
  "analysis": {
    "hook_breakdown": "how they grab attention",
    "structure": "content flow analysis",
    "retention_tactics": ["tactic 1", "tactic 2"],
    "viral_elements": ["element 1", "element 2"]
  },
  "your_versions": [
    {
      "angle": "unique angle",
      "hook": "your hook",
      "outline": "brief content outline",
      "differentiator": "what makes it unique"
    }
  ],
  "script_template": "FULL detailed script with hook, intro, main body (at least 5 sentences), CTA. Write it as a complete ready-to-read script, not a summary.",
  "shot_list": [
    { "shot": "shot description", "description": "what to film/show", "duration": "3s" }
  ],
  "caption": "ready-to-post caption with emojis and CTA",
  "production_tips": ["tip 1", "tip 2"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}`

    const userPrompt = `Analyze and create unique versions of this viral content:

"${videoDescription}"

Platform: ${platform || 'tiktok'}
Goal: ${goal || 'recreate with unique spin'}
${langMap[language as string] || langMap['en']}

Create 3 unique versions that won't look copied.
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
        temperature: 0.9,
        max_tokens: 4000,
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
    }

    
    // Auto-save to content library
    await saveContent(userId, 'steal-video', videoDescription || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Steal Video Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
