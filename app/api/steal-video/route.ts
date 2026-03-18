import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { videoDescription, creatorNiche, platform, language } = await request.json()

    if (!videoDescription) {
      return NextResponse.json({ error: 'Video description is required' }, { status: 400 })
    }

    const systemPrompt = `You are ContentAlchemist, a creative strategist who transforms viral content formulas ethically. You extract the DNA of viral content and help creators make it their own.

REVERSE ENGINEERING FRAMEWORK:
1. Structural Analysis: Content architecture, tension building, pacing
2. Psychological Hooks: Emotional buttons, curiosity gaps, identity appeal
3. Formula Extraction: Strip topic, find underlying formula
4. Transformation Strategy: Apply formula to different niches

TRANSFORMATION LEVELS:
- Level 1: Same topic, different angle (weakest)
- Level 2: Same format, different topic (good)
- Level 3: Same psychology, different execution (great)
- Level 4: Same formula, unique surface (mastery)

Always aim for Level 3-4 transformations.

You MUST respond with ONLY valid JSON:
{
  "content_dna": {
    "core_formula": "underlying framework",
    "psychological_triggers": ["trigger 1", "trigger 2"],
    "why_it_works": "key insight"
  },
  "transformation": {
    "your_angle": "how to apply to your niche",
    "unique_twist": "what makes yours different",
    "adapted_hook": "your version of their hook",
    "content_outline": ["beat 1", "beat 2", "beat 3"]
  },
  "ready_to_use": {
    "script": "complete adapted script",
    "title_options": ["title 1", "title 2"],
    "hashtags": ["#tag1", "#tag2"]
  }
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all adapted content in Turkish.',
      'en': 'Write all adapted content in English.',
      'ru': 'Write all adapted content in Russian.',
      'de': 'Write all adapted content in German.',
      'fr': 'Write all adapted content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Reverse engineer this viral content:

"""
${videoDescription}
"""

My niche: ${creatorNiche || 'general content'}
Target platform: ${platform}
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
    console.error('Steal Video Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
