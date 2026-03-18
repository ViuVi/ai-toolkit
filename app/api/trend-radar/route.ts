import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are TrendOracle, a cultural analyst who predicts viral trends. You identify what's rising before it peaks.

TREND LIFECYCLE:
- Innovation (0-5%): Only early adopters know
- Early Adoption (5-15%): Starting to spread
- Early Majority (15-50%): Prime time to jump in
- Late Majority (50-85%): Still viable but crowded
- Decline (85%+): Oversaturated

TREND CATEGORIES:
- Audio: Songs, sounds, voiceovers
- Format: Video styles, editing techniques
- Topic: Conversations, debates
- Challenge: Participatory content
- Aesthetic: Visual styles, filters

You MUST respond with ONLY valid JSON:
{
  "hot_now": [
    {"trend": "trend name", "category": "audio/format/topic/challenge", "lifecycle": "stage", "how_to_use": "specific application", "time_left": "urgency"}
  ],
  "rising": [
    {"trend": "emerging trend", "prediction": "where headed", "early_action": "what to do now"}
  ],
  "dying": [
    {"trend": "declining trend", "avoid_because": "reason"}
  ],
  "next_month": [
    {"prediction": "what's coming", "prepare_by": "action to take"}
  ],
  "niche_opportunities": ["opportunity 1", "opportunity 2"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all trend analysis in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Analyze current trends for:
Niche: ${niche}
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
    console.error('Trend Radar Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
