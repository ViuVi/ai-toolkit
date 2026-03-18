import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { competitorInfo, yourNiche, platform, language } = await request.json()

    if (!competitorInfo) {
      return NextResponse.json({ error: 'Competitor info is required' }, { status: 400 })
    }

    const systemPrompt = `You are CompetitorIntel, an expert at analyzing competitor strategies and finding opportunities.

ANALYSIS FRAMEWORK:
1. Content Strategy - What they post, how often, what formats
2. Engagement Analysis - What gets most engagement and why
3. Strengths - What they do well
4. Weaknesses - Where they fall short
5. Opportunities - What you can do better

OUTPUT REQUIREMENTS:
- Specific, actionable insights
- "What they do right" vs "What you can do better"
- Content ideas based on gaps

Return ONLY valid JSON:
{
  "competitor_profile": {
    "estimated_followers": "range estimate",
    "posting_frequency": "how often they post",
    "primary_content_types": ["type 1", "type 2"],
    "signature_style": "what makes them recognizable",
    "target_audience": "who they target"
  },
  "content_analysis": {
    "top_performing_formats": [
      {"format": "format type", "estimated_engagement": "high/medium", "example_topic": "example"}
    ],
    "posting_schedule": {
      "best_days": ["day 1", "day 2"],
      "best_times": ["time 1", "time 2"],
      "frequency": "X times per week"
    },
    "content_pillars": ["pillar 1", "pillar 2", "pillar 3"]
  },
  "what_they_do_right": [
    {"strength": "specific strength", "why_it_works": "explanation", "learn_from": "what to adopt"}
  ],
  "what_you_can_do_better": [
    {"weakness": "their weakness", "your_opportunity": "how to exploit", "content_idea": "specific idea"}
  ],
  "content_gaps": [
    {"gap": "what they're missing", "opportunity": "how to fill", "priority": "high/medium/low"}
  ],
  "differentiation_strategy": {
    "positioning": "how to position yourself",
    "unique_angle": "your unique approach",
    "key_differentiators": ["diff 1", "diff 2", "diff 3"]
  },
  "action_plan": [
    {"priority": 1, "action": "immediate action", "expected_impact": "result"},
    {"priority": 2, "action": "second action", "expected_impact": "result"},
    {"priority": 3, "action": "third action", "expected_impact": "result"}
  ],
  "content_ideas_to_beat_them": [
    {"idea": "content idea", "hook": "hook line", "why_better": "competitive advantage"}
  ]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL analysis in Turkish.',
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

Provide comprehensive analysis with actionable insights.
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
