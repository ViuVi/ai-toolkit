import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "ViralDNA Analyst" - a data scientist who has reverse-engineered 100,000+ viral videos to crack the code of what makes content spread. You've consulted for TikTok's creator program and Instagram's algorithm team (hypothetically, for training purposes).

YOUR ANALYTICAL FRAMEWORK:

1. THE HOOK ANALYSIS
   - First frame appeal: Would this stop a fast scroll?
   - Curiosity coefficient: How strong is the "need to know"?
   - Pattern interrupt score: Does it break expectations?

2. THE CONTENT STRUCTURE
   - Retention curve prediction: Where would viewers drop off?
   - Value density: Information per second ratio
   - Emotional arc: Does it build to a peak?

3. THE ENGAGEMENT MECHANICS
   - Comment bait: What would viewers say?
   - Share trigger: Why would someone send this to a friend?
   - Save motivation: Is this reference-worthy?

4. THE ALGORITHM SIGNALS
   - Watch time optimization: Replay potential?
   - Completion rate prediction
   - Engagement velocity factors

5. THE VIRAL COEFFICIENTS (Your proprietary scoring)
   - Relatability Factor (RF): 1-10
   - Emotional Intensity (EI): 1-10
   - Shareability Quotient (SQ): 1-10
   - Trend Alignment (TA): 1-10
   - Execution Quality (EQ): 1-10
   - VIRAL SCORE = (RF + EI + SQ + TA + EQ) / 5

CRITICAL ANALYSIS POINTS:
- What's the "screenshot moment"?
- What's the quotable line?
- What controversy or discussion could this spark?
- How does this compare to top performers in niche?

Be brutally honest in analysis - creators need truth, not flattery.
Think analytically in English, deliver insights in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { content, contentType, platform, niche, language } = await request.json()

    const langMap: Record<string, string> = {
      'tr': 'Provide all analysis and recommendations in clear, professional Turkish.',
      'en': 'Provide analysis in English.',
      'ru': 'Provide all analysis in clear, professional Russian.',
      'de': 'Provide all analysis in clear, professional German.',
      'fr': 'Provide all analysis in clear, professional French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const contentTypeContext = {
      'video_idea': 'Analyze this as a concept/idea before production.',
      'script': 'Analyze this script for viral potential.',
      'caption': 'Analyze this caption for engagement potential.',
      'hook': 'Analyze this hook for stopping power.',
      'full_content': 'Analyze this complete piece of content.'
    }[contentType] || ''

    const userPrompt = `Perform a comprehensive viral potential analysis:

CONTENT TO ANALYZE:
"""
${content}
"""

Content Type: ${contentType} - ${contentTypeContext}
Platform: ${platform}
Niche: ${niche || 'General'}

${langInstruction}

CONDUCT DEEP ANALYSIS:

1. First, identify every strength this content has
2. Then, find every weakness or missed opportunity
3. Compare mentally to viral content in this niche
4. Calculate viral coefficients
5. Provide specific, actionable improvements

Return as JSON:
{
  "viral_score": {
    "overall": 7.5,
    "relatability": 8,
    "emotional_intensity": 7,
    "shareability": 7,
    "trend_alignment": 8,
    "execution_quality": 7,
    "verdict": "High potential with specific fixes"
  },
  "hook_analysis": {
    "stopping_power": "Score and explanation",
    "curiosity_gap": "Score and explanation",
    "first_3_words_impact": "Analysis"
  },
  "strengths": [
    "Specific strength 1 with why it works",
    "Specific strength 2 with why it works"
  ],
  "weaknesses": [
    "Specific weakness 1 with why it hurts",
    "Specific weakness 2 with why it hurts"  
  ],
  "critical_improvements": [
    {
      "issue": "What's wrong",
      "fix": "Exactly how to fix it",
      "impact": "Expected improvement"
    }
  ],
  "rewritten_hook": "If the hook is weak, provide a stronger version",
  "engagement_prediction": {
    "expected_comments": "Type of comments this will get",
    "share_likelihood": "Low/Medium/High with reason",
    "save_likelihood": "Low/Medium/High with reason"
  },
  "competitor_comparison": "How this stacks up against top content in niche",
  "algorithm_notes": "Platform-specific algorithm considerations",
  "final_verdict": "Honest, actionable summary in 2-3 sentences"
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
        temperature: 0.7,
        max_tokens: 2500,
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
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_analysis: content_response }
    } catch {
      result = { raw_analysis: content_response }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Viral Analyzer Error:', error)
    return NextResponse.json({ error: 'Failed to analyze content' }, { status: 500 })
  }
}
