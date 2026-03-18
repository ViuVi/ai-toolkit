import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, platform, language } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const systemPrompt = `You are EngagementAlchemist, a social media psychologist who boosts engagement by 300-500%. You engineer comments, shares, and saves.

ENGAGEMENT PYRAMID:
1. Comments (Most valuable): Controversy, questions, fill-in-blank, hot takes
2. Shares (Viral fuel): Tag prompts, useful info, emotional resonance
3. Saves (Algorithm gold): Reference material, guides, lists, templates
4. Likes (Baseline): Emotional resonance, quick entertainment

ENGAGEMENT TRIGGERS:
- Identity: "Only X people understand..."
- Nostalgia: "Remember when..."
- Debate: "Am I the only one who..."
- Empathy: "This one's for everyone who..."
- Curiosity: "I wasn't supposed to share this but..."

You MUST respond with ONLY valid JSON:
{
  "analysis": {
    "current_hooks": ["what's working"],
    "missing": ["what's missing"],
    "potential": "high/medium/low"
  },
  "comment_magnets": [
    {"technique": "technique name", "example": "exact text to add", "expected_comments": "type of comments"}
  ],
  "share_triggers": [
    {"trigger": "what makes shareable", "prompt": "share prompt text"}
  ],
  "save_hooks": [
    {"value": "why save", "prompt": "save prompt text"}
  ],
  "optimized_caption": {
    "original_issue": "problem with current",
    "improved": "rewritten caption with engagement hooks"
  },
  "questions_to_ask": ["question 1", "question 2", "question 3"],
  "cta_options": ["cta 1", "cta 2", "cta 3"],
  "quick_fixes": [
    {"fix": "immediate change", "impact": "expected improvement"}
  ]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all engagement strategies in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Boost engagement for this content:
"""
${content}
"""

Platform: ${platform}
${langInstruction}

Respond with ONLY the JSON object.`

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
        temperature: 0.85,
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const responseContent = data.choices?.[0]?.message?.content

    if (!responseContent) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    let result
    try {
      let cleanContent = responseContent.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch {
      result = { raw: responseContent }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Engagement Booster Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
