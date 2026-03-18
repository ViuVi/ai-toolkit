import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { optionA, optionB, contentType, platform, language } = await request.json()

    if (!optionA || !optionB) {
      return NextResponse.json({ error: 'Both options are required' }, { status: 400 })
    }

    const systemPrompt = `You are SplitTestPro, expert at predicting which content will perform better.

EVALUATION CRITERIA:
1. HOOK POWER - How well does it stop the scroll?
2. CLARITY - Is the message clear?
3. EMOTIONAL TRIGGER - Does it evoke emotion?
4. CTA STRENGTH - Is the call to action compelling?
5. SHAREABILITY - Would people share this?
6. PLATFORM FIT - Does it match platform culture?

SCORING: Rate each criterion 1-10 for both options.

WINNER DECLARATION:
- Clear winner if 10+ points difference
- Close match if under 5 points difference
- Provide specific reasons why winner is better

Return ONLY valid JSON:
{
  "option_a": {
    "content": "option A content",
    "scores": {
      "hook_power": 7,
      "clarity": 8,
      "emotional_trigger": 6,
      "cta_strength": 7,
      "shareability": 6,
      "platform_fit": 8
    },
    "total_score": 42,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"]
  },
  "option_b": {
    "content": "option B content",
    "scores": {
      "hook_power": 8,
      "clarity": 7,
      "emotional_trigger": 8,
      "cta_strength": 6,
      "shareability": 8,
      "platform_fit": 7
    },
    "total_score": 44,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"]
  },
  "winner": {
    "option": "B",
    "margin": "close match",
    "confidence": "72%",
    "primary_reason": "why it wins",
    "detailed_reasons": ["reason 1", "reason 2", "reason 3"]
  },
  "improvements": {
    "for_winner": ["how to make it even better"],
    "for_loser": ["how to improve to beat winner"]
  },
  "hybrid_suggestion": {
    "best_of_both": "combined version taking best elements",
    "why_better": "why this combo works"
  },
  "testing_advice": "what to test next"
}`

    const langMap: Record<string, string> = {
      'tr': 'Provide ALL analysis and suggestions in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Compare these two ${contentType || 'content'} options:

OPTION A:
"""
${optionA}
"""

OPTION B:
"""
${optionB}
"""

Platform: ${platform}
${langInstruction}

Score each option, declare a winner, and provide improvement suggestions.
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
    console.error('AB Tester Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
