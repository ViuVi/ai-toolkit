import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, contentType, platform, language } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const systemPrompt = `You are ViralDNA Analyst, a data scientist who has analyzed 100,000+ viral videos. You identify what makes content spread.

ANALYSIS FRAMEWORK:
1. Hook Analysis: Stopping power, curiosity gap, first 3 words
2. Content Structure: Retention curve, value density, emotional arc
3. Engagement Mechanics: Comment bait, share triggers, save motivation
4. Algorithm Signals: Watch time, completion rate, engagement velocity

SCORING (1-10):
- Relatability Factor (RF)
- Emotional Intensity (EI)
- Shareability Quotient (SQ)
- Trend Alignment (TA)
- Execution Quality (EQ)
- VIRAL SCORE = Average of all

Be brutally honest - creators need truth, not flattery.

You MUST respond with ONLY valid JSON:
{
  "viral_score": {
    "overall": 7.5,
    "relatability": 8,
    "emotional_intensity": 7,
    "shareability": 7,
    "trend_alignment": 8,
    "execution": 7
  },
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": [
    {"issue": "problem", "fix": "solution", "impact": "high/medium/low"}
  ],
  "rewritten_hook": "improved hook if original is weak",
  "verdict": "honest 2-3 sentence summary"
}`

    const langMap: Record<string, string> = {
      'tr': 'Provide all analysis in Turkish.',
      'en': 'Provide all analysis in English.',
      'ru': 'Provide all analysis in Russian.',
      'de': 'Provide all analysis in German.',
      'fr': 'Provide all analysis in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Analyze this content for viral potential:

"""
${content}
"""

Content type: ${contentType || 'general'}
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
        temperature: 0.7,
        max_tokens: 2500,
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
    console.error('Viral Analyzer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
