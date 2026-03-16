import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "EngagementAlchemist" - a social media psychologist who has helped creators increase their engagement rates by 300-500%. You understand the deep psychology of why people comment, share, and save content.

YOUR ENGAGEMENT PHILOSOPHY:
Engagement isn't luck - it's engineered. Every comment, share, and save can be strategically designed into your content.

THE ENGAGEMENT PYRAMID:

1. COMMENTS (Most valuable)
   - Controversy (respectful debate)
   - Questions (especially binary choices)
   - Fill-in-the-blank prompts
   - Hot takes that demand response
   - Relatable confessions

2. SHARES (Viral fuel)
   - "Tag someone who..." prompts
   - Content that makes sharer look good
   - Inside jokes for communities
   - Useful information (save + share)
   - Emotional resonance

3. SAVES (Algorithm gold)
   - Reference material
   - Step-by-step guides
   - Lists and frameworks
   - Templates and swipe files
   - "Save for later" worthy insights

4. LIKES (Baseline)
   - Emotional resonance
   - Visual appeal
   - Quick entertainment
   - Agreement/validation

ENGAGEMENT TRIGGERS:
- Identity: "Only X people understand..."
- Nostalgia: "Remember when..."
- Debate: "Am I the only one who..."
- Empathy: "This one's for everyone who..."
- Curiosity: "I wasn't supposed to share this but..."
- Urgency: "Before this gets taken down..."

Think in English for strategy, deliver engagement tactics in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { content, platform, currentEngagement, goals, language } = await request.json()

    const langInstruction = {
      'tr': 'Provide all engagement strategies and examples in fluent Turkish.',
      'en': 'Provide in English.',
      'ru': 'Provide all content in fluent Russian.',
      'de': 'Provide all content in fluent German.',
      'fr': 'Provide all content in fluent French.'
    }[language] || 'Provide in English.'

    const userPrompt = `Boost engagement for this content:

CONTENT:
"""
${content}
"""

Platform: ${platform}
Current Engagement Level: ${currentEngagement || 'Not specified'}
Goals: ${goals || 'Increase overall engagement'}

${langInstruction}

CREATE AN ENGAGEMENT OPTIMIZATION STRATEGY:

Return as JSON:
{
  "content_analysis": {
    "current_engagement_hooks": ["What's working"],
    "missing_elements": ["What's missing"],
    "engagement_potential": "Assessment"
  },
  "comment_magnets": [
    {
      "technique": "Technique name",
      "implementation": "How to add to this content",
      "example_text": "Exact text to use",
      "expected_comment_types": ["Type of comments expected"],
      "placement": "Where in content to place"
    }
  ],
  "share_triggers": [
    {
      "trigger": "What makes this shareable",
      "enhancement": "How to amplify it",
      "share_prompt": "Text that encourages sharing",
      "who_will_share": "Audience segment most likely to share"
    }
  ],
  "save_hooks": [
    {
      "value_prop": "Why someone would save",
      "save_prompt": "Text encouraging saves",
      "content_addition": "What to add for save-worthiness"
    }
  ],
  "caption_rewrites": {
    "original_issue": "What's wrong with current approach",
    "optimized_caption": "Rewritten caption with engagement hooks",
    "engagement_elements_added": ["Element 1", "Element 2"]
  },
  "questions_to_ask": [
    {
      "question": "Engagement question",
      "placement": "In caption/comments/content",
      "response_expectation": "What kind of answers expected"
    }
  ],
  "cta_options": [
    {
      "cta": "Call to action text",
      "psychology": "Why this works",
      "best_placement": "Where to put it"
    }
  ],
  "community_building": {
    "inside_jokes": "How to create community references",
    "recurring_elements": "What to repeat for recognition",
    "audience_involvement": "How to make audience feel part of it"
  },
  "response_strategy": {
    "first_hour": "How to engage in first hour",
    "comment_responses": "How to respond to boost algorithm",
    "controversy_handling": "If debate happens"
  },
  "posting_optimization": {
    "best_time": "When to post for engagement",
    "first_comment": "What you should comment first",
    "story_support": "Story to drive traffic"
  },
  "quick_fixes": [
    {
      "fix": "Immediate change to make",
      "impact": "Expected improvement",
      "effort": "Low/Medium/High"
    }
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
        temperature: 0.85,
        max_tokens: 3500,
      }),
    })

    const data = await response.json()
    const content_response = data.choices?.[0]?.message?.content

    if (!content_response) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    let result
    try {
      const jsonMatch = content_response.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content_response }
    } catch {
      result = { raw: content_response }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Engagement Booster Error:', error)
    return NextResponse.json({ error: 'Failed to generate engagement strategies' }, { status: 500 })
  }
}
