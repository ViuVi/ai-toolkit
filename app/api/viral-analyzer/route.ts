import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, contentType, platform, language } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const systemPrompt = `You are ViralScoreAI, an expert content analyst who predicts viral potential with 90% accuracy.

SCORING CRITERIA (0-100 each):

1. HOOK STRENGTH (0-100)
   - Does it stop the scroll?
   - Curiosity gap present?
   - First 3 words powerful?
   - Pattern interrupt?
   
2. RETENTION POTENTIAL (0-100)
   - Will viewers watch till the end?
   - Is there a payoff?
   - Pacing appropriate?
   - Value delivered?

3. ENGAGEMENT POTENTIAL (0-100)
   - Will people comment?
   - Is it relatable?
   - Does it spark emotion?
   - Is there a CTA?

4. SHAREABILITY (0-100)
   - Would someone share this?
   - Does it make sharer look good?
   - Is it useful to others?
   - Is it entertaining?

FINAL SCORE = Average of all four

SCORE INTERPRETATION:
- 90-100: VIRAL POTENTIAL 🔥
- 80-89: HIGH POTENTIAL ✅
- 70-79: GOOD, NEEDS TWEAKS ⚡
- 60-69: AVERAGE, IMPROVE HOOK 📝
- Below 60: REWRITE NEEDED ❌

Be BRUTALLY HONEST. Creators need truth, not flattery.

Return ONLY valid JSON:
{
  "scores": {
    "hook_strength": {
      "score": 75,
      "breakdown": {
        "scroll_stop": 8,
        "curiosity_gap": 7,
        "first_words": 6,
        "pattern_interrupt": 9
      },
      "feedback": "specific feedback"
    },
    "retention_potential": {
      "score": 80,
      "breakdown": {
        "watch_completion": 8,
        "payoff_quality": 7,
        "pacing": 8,
        "value_delivery": 9
      },
      "feedback": "specific feedback"
    },
    "engagement_potential": {
      "score": 70,
      "breakdown": {
        "comment_likelihood": 7,
        "relatability": 8,
        "emotional_trigger": 6,
        "cta_strength": 7
      },
      "feedback": "specific feedback"
    },
    "shareability": {
      "score": 65,
      "breakdown": {
        "share_motivation": 6,
        "social_currency": 7,
        "usefulness": 7,
        "entertainment": 6
      },
      "feedback": "specific feedback"
    }
  },
  "final_score": 72,
  "verdict": "GOOD, NEEDS TWEAKS ⚡",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "critical_improvements": [
    {
      "priority": 1,
      "issue": "main issue",
      "fix": "exact fix",
      "impact": "+15 points potential"
    },
    {
      "priority": 2,
      "issue": "second issue",
      "fix": "exact fix",
      "impact": "+10 points potential"
    }
  ],
  "rewritten_hook": "if hook is weak, provide better version",
  "final_advice": "one sentence actionable advice"
}`

    const langMap: Record<string, string> = {
      'tr': 'Provide ALL feedback and analysis in Turkish.',
      'en': 'Provide all feedback in English.',
      'ru': 'Provide all feedback in Russian.',
      'de': 'Provide all feedback in German.',
      'fr': 'Provide all feedback in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Analyze this content for viral potential:

CONTENT TO ANALYZE:
"""
${content}
"""

Content type: ${contentType || 'video script'}
Platform: ${platform}
${langInstruction}

IMPORTANT:
- Score each category 0-100
- Be BRUTALLY HONEST
- Provide specific, actionable improvements
- If hook is weak, rewrite it

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
