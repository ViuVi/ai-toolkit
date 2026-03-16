import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "SplitTestPro" - a conversion optimization expert who has run 10,000+ A/B tests for content creators and generated millions in additional revenue through optimization. You understand the psychology behind what makes people click, watch, and engage.

YOUR A/B TESTING METHODOLOGY:

1. VARIABLE ISOLATION
   - Test ONE variable at a time
   - Clear hypothesis for each test
   - Measurable success metrics

2. HIGH-IMPACT TEST AREAS
   - Hooks: First 3 words, opening frame
   - Thumbnails: Colors, faces, text
   - Titles: Curiosity, specificity, emotion
   - CTAs: Placement, wording, urgency
   - Posting times: Day and hour

3. PSYCHOLOGICAL LEVERS TO TEST
   - Curiosity vs. Clarity
   - Fear vs. Desire
   - Social proof vs. Exclusivity
   - Urgency vs. Timelessness
   - Questions vs. Statements

4. TESTING BEST PRACTICES
   - Significant difference (not subtle)
   - Adequate sample size
   - Same audience segment
   - Same posting conditions

5. WINNER ANALYSIS
   - Why did the winner work?
   - What can be applied elsewhere?
   - How to iterate further?

Always provide contrasting variations that test a specific hypothesis.
Think analytically in English, deliver test variations in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { content, elementToTest, platform, language } = await request.json()

    const langInstruction: Record<string, string> = {
      'tr': 'Provide all A/B test variations in fluent Turkish.',
      'en': 'Provide in English.',
      'ru': 'Provide all content in fluent Russian.',
      'de': 'Provide all content in fluent German.',
      'fr': 'Provide all content in fluent French.'
    }[language] || 'Provide in English.'

    const userPrompt = `Create A/B test variations for:

ORIGINAL CONTENT:
"""
${content}
"""

Element to Test: ${elementToTest || 'hooks and titles'}
Platform: ${platform}

${langInstruction}

GENERATE STRATEGIC A/B TESTS:

Return as JSON:
{
  "content_analysis": {
    "current_approach": "What the original is doing",
    "potential_weaknesses": ["Weakness 1", "Weakness 2"],
    "test_opportunities": ["Opportunity 1", "Opportunity 2"]
  },
  "hook_tests": [
    {
      "test_name": "Curiosity vs Direct",
      "hypothesis": "What we're testing and why",
      "variation_a": {
        "hook": "Hook text A",
        "approach": "The psychological approach",
        "expected_result": "What we expect"
      },
      "variation_b": {
        "hook": "Hook text B",
        "approach": "The contrasting approach",
        "expected_result": "What we expect"
      },
      "winner_indicator": "How to know which won"
    }
  ],
  "title_tests": [
    {
      "test_name": "Test name",
      "hypothesis": "What we're testing",
      "variation_a": {
        "title": "Title A",
        "psychology": "Why this might work"
      },
      "variation_b": {
        "title": "Title B",
        "psychology": "Why this might work"
      },
      "metric_to_track": "CTR, watch time, etc."
    }
  ],
  "thumbnail_concepts": [
    {
      "test_name": "Visual test",
      "variation_a": {
        "concept": "Description of thumbnail A",
        "elements": ["Element 1", "Element 2"],
        "psychology": "Why this might work"
      },
      "variation_b": {
        "concept": "Description of thumbnail B",
        "elements": ["Element 1", "Element 2"],
        "psychology": "Why this might work"
      }
    }
  ],
  "cta_tests": [
    {
      "test_name": "CTA test",
      "variation_a": "CTA text A",
      "variation_b": "CTA text B",
      "placement_test": "Different placement options"
    }
  ],
  "caption_tests": [
    {
      "test_name": "Caption approach",
      "variation_a": "Short caption approach",
      "variation_b": "Long caption approach",
      "what_to_measure": "Metric"
    }
  ],
  "testing_protocol": {
    "test_order": ["Which test to run first", "Second", "Third"],
    "sample_size": "How many views before deciding",
    "success_threshold": "What constitutes a winner",
    "timeline": "Recommended testing timeline"
  },
  "quick_wins": [
    {
      "change": "Small change to make now",
      "expected_impact": "Potential improvement",
      "risk_level": "Low/Medium/High"
    }
  ],
  "advanced_tests": [
    {
      "test": "More complex test idea",
      "when_to_run": "After basics are optimized",
      "setup_required": "What's needed"
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
        temperature: 0.8,
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
    console.error('A/B Tester Error:', error)
    return NextResponse.json({ error: 'Failed to generate tests' }, { status: 500 })
  }
}
