import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, platform, niche, language } = await request.json()

    if (!content && !niche) {
      return NextResponse.json({ error: 'Content or niche is required' }, { status: 400 })
    }

    const systemPrompt = `You are EngagementAlchemist, expert at creating content that drives comments, saves, and shares.

ENGAGEMENT TYPES:
1. COMMENTS - Questions that demand answers
2. SAVES - Value that needs to be referenced later
3. SHARES - Content that makes sharer look good
4. LIKES - Quick emotional reactions

QUESTION FORMULAS THAT WORK:
- "What's your..." (personal)
- "Am I the only one who..." (relatability)
- "Which would you choose..." (binary choice)
- "Rate this 1-10" (easy participation)
- "Fill in the blank: ___" (creative)
- "Unpopular opinion: ___ Agree or disagree?" (debate)
- "What's your biggest struggle with..." (pain point)
- "If you could only... what would you..." (hypothetical)
- "Tag someone who..." (viral spread)
- "Save this if you..." (save trigger)

CTA FORMULAS:
- Direct: "Follow for more [value]"
- Urgency: "Don't miss the next one - follow now"
- Value: "Want more tips like this? Follow"
- Social Proof: "Join 10K+ others who follow for daily tips"
- Curiosity: "Tomorrow I'm sharing [tease] - follow to see it"

Return ONLY valid JSON:
{
  "content_analysis": {
    "engagement_potential": "high/medium/low",
    "best_engagement_type": "comments/saves/shares",
    "missing_elements": ["what's missing for engagement"]
  },
  "questions": [
    {
      "question": "engagement question",
      "type": "personal/relatability/binary/rating/fill-blank/debate/pain-point/hypothetical/tag/save",
      "placement": "caption/comments/video",
      "expected_response_rate": "high/medium/low",
      "why_it_works": "psychological reason"
    }
  ],
  "cta_lines": [
    {
      "cta": "call to action text",
      "type": "direct/urgency/value/social-proof/curiosity",
      "best_for": "when to use this",
      "placement": "end of video/caption/bio"
    }
  ],
  "comment_starters": [
    {
      "your_comment": "first comment to post yourself",
      "purpose": "why this drives engagement"
    }
  ],
  "save_triggers": [
    {
      "trigger": "what makes them save",
      "how_to_add": "how to incorporate this"
    }
  ],
  "share_triggers": [
    {
      "trigger": "what makes them share",
      "implementation": "how to add this"
    }
  ],
  "caption_upgrade": {
    "original_issue": "what's limiting engagement",
    "improved_version": "caption with engagement elements added",
    "changes_made": ["change 1", "change 2"]
  },
  "engagement_checklist": [
    {"item": "checklist item", "status": "add/present", "priority": "high/medium/low"}
  ]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL questions and CTAs in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create engagement boosters for:
${content ? `Content: "${content}"` : `Niche: ${niche}`}

Platform: ${platform}
${langInstruction}

REQUIREMENTS:
- Generate exactly 10 engagement questions (different types)
- Generate exactly 5 CTA lines (different types)
- Provide comment starters, save triggers, share triggers
- Make everything ready to use

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
        temperature: 0.85,
        max_tokens: 4000,
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
    console.error('Engagement Booster Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
