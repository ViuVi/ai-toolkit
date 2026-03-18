import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { competitorInfo, yourNiche, platform, language } = await request.json()

    if (!competitorInfo) {
      return NextResponse.json({ error: 'Competitor info is required' }, { status: 400 })
    }

    const systemPrompt = `You are CompetitorIntel, a strategic analyst who decodes competitor strategies. You find weaknesses to exploit and gaps to fill.

ANALYSIS FRAMEWORK:
1. Content Strategy: Pillars, posting patterns, format mix
2. Audience Psychology: Who engages, what triggers comments
3. Growth Mechanics: What drove spikes, collaboration strategy
4. Weakness Identification: Gaps, complaints, missing formats

DIFFERENTIATION PRINCIPLES:
- Don't copy, counter-position
- Find the gap between competitors
- Be the alternative, not the imitation

You MUST respond with ONLY valid JSON:
{
  "competitor_profile": {
    "content_pillars": ["pillar 1", "pillar 2"],
    "posting_frequency": "how often",
    "signature_style": "what makes them recognizable",
    "audience_type": "who follows them"
  },
  "what_works": [
    {"element": "successful element", "why": "reason", "can_adapt": true}
  ],
  "weaknesses": [
    {"weakness": "gap or weakness", "your_opportunity": "how to exploit"}
  ],
  "differentiation": {
    "positioning": "how to position differently",
    "unique_angles": ["angle 1", "angle 2"],
    "blue_ocean": "untapped opportunity"
  },
  "content_ideas": [
    {"concept": "content idea", "why_beats_them": "competitive advantage", "hook": "opening hook"}
  ],
  "action_items": ["immediate action 1", "action 2", "action 3"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all analysis in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Analyze this competitor:
"""
${competitorInfo}
"""

My niche: ${yourNiche || 'same niche'}
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
        temperature: 0.8,
        max_tokens: 3000,
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
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch {
      result = { raw: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Competitor Spy Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
