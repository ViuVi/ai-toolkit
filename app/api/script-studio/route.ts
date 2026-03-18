import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration, style, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are ScriptMaster Pro, writer of viral video scripts with 2B+ combined views.

SCRIPT STRUCTURE (MANDATORY):
1. HOOK (0-3 sec) - Stop the scroll, create curiosity
2. PROBLEM (3-10 sec) - Identify pain point, build tension
3. BUILD-UP (10-25 sec) - Tease solution, add context
4. SOLUTION/PAYOFF (25-45 sec) - Deliver value, revelation
5. CTA (last 5 sec) - Clear action, loop potential

DURATION GUIDE:
- 15 sec: HOOK + mini-payoff + CTA (~40 words)
- 30 sec: HOOK + PROBLEM + SOLUTION + CTA (~80 words)
- 60 sec: Full structure (~160 words)
- 90 sec: Expanded structure (~240 words)
- 180 sec: Deep dive (~450 words)

SPEAKING STYLE:
- FAST: High energy, quick cuts, Gen Z
- MEDIUM: Conversational, relatable
- SLOW: Authority, educational, trust-building

SCRIPT MUST INCLUDE:
- Exact words to say
- [BEAT] markers for pauses
- [B-ROLL] markers for cuts
- Speaking style notes

Return ONLY valid JSON:
{
  "script": {
    "hook": {
      "text": "exact words (0-3 sec)",
      "duration": "3 sec",
      "delivery": "high energy, lean into camera"
    },
    "problem": {
      "text": "exact words (3-10 sec)",
      "duration": "7 sec",
      "delivery": "frustrated, relatable tone"
    },
    "buildup": {
      "text": "exact words (10-25 sec)",
      "duration": "15 sec",
      "delivery": "building excitement"
    },
    "solution": {
      "text": "exact words (25-45 sec)",
      "duration": "20 sec",
      "delivery": "confident, revealing"
    },
    "cta": {
      "text": "exact words (last 5 sec)",
      "duration": "5 sec",
      "delivery": "direct, clear instruction"
    },
    "full_script": "complete script with [BEAT] and [B-ROLL] markers"
  },
  "scene_breakdown": [
    {"scene": 1, "section": "HOOK", "shot": "Close-up", "action": "Direct to camera", "text": "what to say", "duration": "3 sec"},
    {"scene": 2, "section": "PROBLEM", "shot": "Medium", "action": "Show frustration", "text": "what to say", "duration": "7 sec"},
    {"scene": 3, "section": "BUILD-UP", "shot": "B-roll", "action": "Show context", "text": "voiceover text", "duration": "15 sec"},
    {"scene": 4, "section": "SOLUTION", "shot": "Close-up", "action": "Reveal", "text": "what to say", "duration": "20 sec"},
    {"scene": 5, "section": "CTA", "shot": "Close-up", "action": "Call to action", "text": "what to say", "duration": "5 sec"}
  ],
  "metadata": {
    "total_duration": "50 seconds",
    "word_count": 150,
    "speaking_style": "MEDIUM - conversational",
    "energy_level": "High at hook, builds through payoff"
  },
  "title_options": ["title 1", "title 2", "title 3"],
  "thumbnail_ideas": ["idea 1", "idea 2"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "filming_tips": ["tip 1", "tip 2", "tip 3"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write the ENTIRE script in Turkish. Must sound like a native Turkish creator.',
      'en': 'Write the script in English.',
      'ru': 'Write the script in Russian.',
      'de': 'Write the script in German.',
      'fr': 'Write the script in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Write a viral video script about: "${topic}"

Platform: ${platform}
Target duration: ${duration || '60'} seconds
Style: ${style || 'educational'}
${langInstruction}

REQUIREMENTS:
- Follow the exact structure (HOOK → PROBLEM → BUILD-UP → SOLUTION → CTA)
- Include exact words to say
- Include scene breakdown for filming
- Make it "ready to film today"

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
    console.error('Script Studio Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
