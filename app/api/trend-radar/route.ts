import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "TrendOracle" - a cultural analyst who predicts viral trends before they explode. You've accurately predicted 85% of major social media trends over the past 3 years. Brands pay you $50,000/month for your insights.

YOUR TREND ANALYSIS FRAMEWORK:

1. TREND LIFECYCLE MAPPING
   - Innovation (0-5%): Only early adopters know
   - Early Adoption (5-15%): Starting to spread
   - Early Majority (15-50%): Prime time to jump in
   - Late Majority (50-85%): Still viable but crowded
   - Decline (85%+): Oversaturated, move on

2. TREND CATEGORIES
   - Audio Trends: Songs, sounds, voiceovers
   - Format Trends: Video styles, editing techniques
   - Topic Trends: Conversations, debates, news
   - Challenge Trends: Participatory content
   - Aesthetic Trends: Visual styles, filters

3. TREND VELOCITY INDICATORS
   - Speed of spread
   - Cross-platform migration
   - Brand adoption (usually signals peak)
   - Parody/meta content appearing

4. TREND OPPORTUNITY SCORING
   - Relevance to niche
   - Ease of participation
   - Time remaining in cycle
   - Differentiation potential

YOUR UNIQUE INSIGHTS:
- Spot patterns across platforms
- Identify micro-trends before mainstream
- Predict what's next based on cultural signals
- Connect seemingly unrelated trends

Be specific with examples. Generic trend advice is worthless.
Analyze in English, deliver insights in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, timeframe, language } = await request.json()

    const langInstruction: Record<string, string> = {
      'tr': 'Provide all trend analysis and recommendations in fluent Turkish.',
      'en': 'Provide in English.',
      'ru': 'Provide all content in fluent Russian.',
      'de': 'Provide all content in fluent German.',
      'fr': 'Provide all content in fluent French.'
    }[language] || 'Provide in English.'

    const userPrompt = `Analyze current and emerging trends for:

Niche: ${niche}
Platform: ${platform}
Timeframe Focus: ${timeframe || 'Next 2 weeks'}

${langInstruction}

DELIVER COMPREHENSIVE TREND INTELLIGENCE:

Return as JSON:
{
  "hot_right_now": [
    {
      "trend": "Trend name/description",
      "category": "Audio/Format/Topic/Challenge/Aesthetic",
      "lifecycle_stage": "Innovation/Early Adoption/Early Majority/Late Majority",
      "time_remaining": "Estimated time before oversaturation",
      "how_to_use": "Specific way to incorporate this trend",
      "example_concept": "Concrete video idea using this trend",
      "niche_relevance": "How it applies to ${niche}"
    }
  ],
  "rising_trends": [
    {
      "trend": "Emerging trend",
      "current_stage": "Where it is now",
      "prediction": "Where it's headed",
      "early_mover_advantage": "What you can do NOW",
      "risk_level": "Low/Medium/High"
    }
  ],
  "dying_trends": [
    {
      "trend": "Declining trend",
      "why_dying": "Explanation",
      "avoid_because": "Why to skip this"
    }
  ],
  "audio_trends": [
    {
      "sound": "Sound/song name",
      "usage": "How creators are using it",
      "your_angle": "Unique way to use for ${niche}"
    }
  ],
  "format_trends": [
    {
      "format": "Format description",
      "why_working": "Psychology behind it",
      "template": "How to replicate"
    }
  ],
  "predictions_next_month": [
    {
      "prediction": "What's coming",
      "confidence": "High/Medium/Low",
      "prepare_by": "How to get ready"
    }
  ],
  "niche_specific_opportunities": {
    "untapped": "What no one in ${niche} is doing yet",
    "cross_pollination": "Trends from other niches to adapt",
    "first_mover_ideas": ["Idea 1", "Idea 2"]
  },
  "action_plan": {
    "this_week": "What to post this week",
    "next_week": "What to prepare for next week",
    "this_month": "Monthly trend strategy"
  }
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.85,
        max_tokens: 3500,
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    let result
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content }
    } catch {
      result = { raw: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Trend Radar Error:', error)
    return NextResponse.json({ error: 'Failed to analyze trends' }, { status: 500 })
  }
}
