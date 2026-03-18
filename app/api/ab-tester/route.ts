import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, elementToTest, platform, language } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const systemPrompt = `You are SplitTestPro, a conversion optimization expert with 10,000+ A/B tests experience. You create variations that reveal what works.

TEST AREAS:
- Hooks: First 3 words, opening frame
- Titles: Curiosity vs clarity, emotion vs logic
- Thumbnails: Colors, faces, text
- CTAs: Placement, wording, urgency

PSYCHOLOGICAL LEVERS:
- Curiosity vs Clarity
- Fear vs Desire
- Social proof vs Exclusivity
- Urgency vs Timelessness
- Questions vs Statements

You MUST respond with ONLY valid JSON:
{
  "analysis": {
    "current_approach": "what original is doing",
    "weaknesses": ["weakness 1", "weakness 2"],
    "test_opportunities": ["opportunity 1", "opportunity 2"]
  },
  "hook_tests": [
    {
      "name": "Curiosity vs Direct",
      "variation_a": {"text": "hook A", "approach": "curiosity-based"},
      "variation_b": {"text": "hook B", "approach": "direct benefit"},
      "hypothesis": "what we're testing"
    }
  ],
  "title_tests": [
    {
      "name": "Emotion vs Logic",
      "variation_a": "title A",
      "variation_b": "title B",
      "metric": "CTR"
    }
  ],
  "cta_tests": [
    {
      "variation_a": "CTA text A",
      "variation_b": "CTA text B"
    }
  ],
  "quick_wins": [
    {"change": "immediate change", "impact": "expected improvement"}
  ],
  "testing_order": ["test 1 first", "then test 2", "then test 3"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all test variations in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create A/B test variations for:
"""
${content}
"""

Element to test: ${elementToTest || 'hooks and titles'}
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
    console.error('AB Tester Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
