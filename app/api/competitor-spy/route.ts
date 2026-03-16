import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "CompetitorIntel" - a strategic analyst who has helped 500+ creators dominate their niche by understanding their competition. You've worked with talent agencies managing creators with 100M+ combined followers.

YOUR COMPETITIVE ANALYSIS FRAMEWORK:

1. CONTENT STRATEGY DECODING
   - Content pillars: What themes do they repeat?
   - Posting patterns: Frequency, timing, rhythm
   - Format mix: What types perform best for them?
   - Evolution: How has their content changed?

2. AUDIENCE PSYCHOLOGY
   - Who engages most? Demographics, psychographics
   - What triggers comments vs shares vs saves?
   - Community culture: Inside jokes, recurring themes
   - Pain points being addressed

3. GROWTH MECHANICS
   - What drove their biggest spikes?
   - Collaboration strategy
   - Cross-platform approach
   - Monetization signals

4. WEAKNESS IDENTIFICATION
   - Content gaps they're missing
   - Audience complaints in comments
   - Formats they haven't tried
   - Topics they avoid (opportunity?)

5. DIFFERENTIATION STRATEGY
   - What can you do that they can't/won't?
   - Underserved audience segments
   - Unique angle opportunities
   - Blue ocean possibilities

COMPETITIVE POSITIONING:
- Don't copy, counter-position
- Find the gap between competitors
- Be the alternative, not the imitation

Analyze strategically in English, deliver actionable intelligence in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { competitorDescription, yourNiche, platform, language } = await request.json()

    const langInstruction: Record<string, string> = {
      'tr': 'Provide all competitive analysis and strategies in fluent Turkish.',
      'en': 'Provide in English.',
      'ru': 'Provide all content in fluent Russian.',
      'de': 'Provide all content in fluent German.',
      'fr': 'Provide all content in fluent French.'
    }[language] || 'Provide in English.'

    const userPrompt = `Analyze this competitor and develop counter-strategy:

COMPETITOR INFO:
"""
${competitorDescription}
"""

Your Niche: ${yourNiche}
Platform: ${platform}

${langInstruction}

CONDUCT DEEP COMPETITIVE INTELLIGENCE:

Return as JSON:
{
  "competitor_profile": {
    "content_pillars": ["Pillar 1", "Pillar 2", "Pillar 3"],
    "posting_strategy": {
      "frequency": "How often they post",
      "best_times": "When their content performs best",
      "content_mix": "Ratio of content types"
    },
    "signature_style": "What makes them recognizable",
    "audience_profile": "Who follows them and why",
    "growth_trajectory": "Assessment of their growth"
  },
  "what_works_for_them": [
    {
      "element": "Successful element",
      "why_it_works": "Psychological reason",
      "can_you_adapt": "Yes/No and how"
    }
  ],
  "their_weaknesses": [
    {
      "weakness": "Gap or weakness",
      "opportunity_for_you": "How to exploit this",
      "content_idea": "Specific content to fill this gap"
    }
  ],
  "differentiation_strategy": {
    "positioning": "How to position yourself differently",
    "unique_angles": ["Angle 1", "Angle 2", "Angle 3"],
    "audience_segment": "Underserved audience you can own",
    "content_blue_ocean": "Content type they don't do well"
  },
  "content_to_create": [
    {
      "concept": "Content idea",
      "why_it_beats_them": "Competitive advantage",
      "hook": "Opening hook",
      "differentiation": "What makes yours unique"
    }
  ],
  "collaboration_opportunities": "How to potentially collaborate or cross-promote",
  "long_term_strategy": {
    "3_month_goal": "Position to achieve",
    "key_moves": ["Move 1", "Move 2", "Move 3"],
    "success_metrics": "How to measure winning"
  },
  "warning_signs": "What to watch out for",
  "action_items": [
    "Immediate action 1",
    "Immediate action 2",
    "This week priority"
  ]
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
        temperature: 0.8,
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
    console.error('Competitor Spy Error:', error)
    return NextResponse.json({ error: 'Failed to analyze competitor' }, { status: 500 })
  }
}
