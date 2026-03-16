import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "ContentAlchemist" - a creative strategist who specializes in ethical content transformation. You've helped 1000+ creators build unique brands by studying what works and making it their own.

YOUR PHILOSOPHY:
"Good artists copy, great artists steal" - but stealing means TRANSFORMING, not copying. You extract the DNA of viral content and help creators inject it into their unique voice.

THE REVERSE ENGINEERING FRAMEWORK:

1. STRUCTURAL ANALYSIS
   - What's the content architecture?
   - How is tension built and released?
   - What's the rhythm and pacing?
   - Where are the "dopamine hits"?

2. PSYCHOLOGICAL HOOKS
   - What emotional buttons does it push?
   - What curiosity gaps are created?
   - What identity does it appeal to?
   - What fear or desire does it tap into?

3. FORMULA EXTRACTION
   - Strip away the topic, what's the underlying formula?
   - "This is really a [FORMULA TYPE] video disguised as [TOPIC]"
   - Identify the repeatable framework

4. TRANSFORMATION STRATEGY
   - How can this formula apply to completely different niches?
   - What's your creator's unique angle?
   - How to make it feel original while using proven structure?

5. ETHICAL BOUNDARIES
   - Transform, don't copy
   - Add unique value
   - Credit inspiration when appropriate
   - Make it unmistakably yours

THE TRANSFORMATION LEVELS:
- Level 1: Same topic, different angle (weakest)
- Level 2: Same format, different topic (good)
- Level 3: Same psychology, different execution (great)
- Level 4: Same deep formula, completely unique surface (mastery)

Always aim for Level 3-4 transformations.

Think strategically in English, deliver actionable frameworks in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { videoDescription, creatorNiche, platform, language } = await request.json()

    const langInstruction: Record<string, string> = {
      'tr': 'Provide all analysis and adapted content ideas in fluent Turkish. Scripts and hooks should sound native.',
      'en': 'Provide in English.',
      'ru': 'Provide all analysis and adapted content in fluent Russian.',
      'de': 'Provide all analysis and adapted content in fluent German.',
      'fr': 'Provide all analysis and adapted content in fluent French.'
    }[language] || 'Provide in English.'

    const userPrompt = `REVERSE ENGINEER THIS VIRAL CONTENT:

Video/Content Description:
"""
${videoDescription}
"""

Creator's Niche: ${creatorNiche || 'Not specified'}
Target Platform: ${platform}

${langInstruction}

PERFORM DEEP EXTRACTION:

1. What makes this content work at its CORE?
2. What's the formula beneath the surface?
3. How can someone in "${creatorNiche}" use this same formula?
4. What would a Level 4 transformation look like?

Return as JSON:
{
  "content_dna": {
    "core_formula": "The underlying framework (e.g., 'Problem → Wrong Solution → Real Solution → CTA')",
    "psychological_triggers": ["Trigger 1", "Trigger 2", "Trigger 3"],
    "structure_breakdown": [
      {"section": "Hook", "duration": "0-3s", "purpose": "What it does", "technique": "How it does it"},
      {"section": "Setup", "duration": "3-10s", "purpose": "...", "technique": "..."}
    ],
    "why_it_went_viral": "The key insight",
    "repeatable_elements": ["Element 1", "Element 2"]
  },
  "transformation_blueprint": {
    "your_niche_angle": "How to apply this to ${creatorNiche}",
    "unique_twist": "What makes your version different",
    "adaptation_strategy": "Step-by-step transformation guide"
  },
  "ready_to_use_content": {
    "adapted_hook": "Your version of their hook for your niche",
    "content_outline": [
      "Beat 1: Your adapted version",
      "Beat 2: Your adapted version"
    ],
    "full_script_draft": "A complete adapted script ready to film",
    "alternative_angles": [
      "Different way to use same formula 1",
      "Different way to use same formula 2"
    ]
  },
  "thumbnail_strategy": {
    "original_approach": "What made their thumbnail work",
    "your_version": "How to apply this to your content"
  },
  "caption_template": "Adapted caption structure for your version",
  "hashtag_strategy": ["Relevant hashtags for your adapted content"],
  "ethical_notes": "How to credit inspiration appropriately",
  "viral_probability": "Based on formula strength + your niche fit"
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
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw_analysis: content }
    } catch {
      result = { raw_analysis: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Steal Video Error:', error)
    return NextResponse.json({ error: 'Failed to analyze video' }, { status: 500 })
  }
}
