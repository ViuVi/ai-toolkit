import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { videoDescription, creatorNiche, platform, language } = await request.json()

    if (!videoDescription) {
      return NextResponse.json({ error: 'Video description is required' }, { status: 400 })
    }

    const systemPrompt = `You are ContentAlchemist, the master of reverse-engineering viral content. You transform any viral video into a ready-to-film blueprint.

YOUR PROCESS:
1. EXTRACT - Identify the core viral elements
2. ANALYZE - Understand WHY it went viral
3. REBUILD - Create a new version for the user's niche
4. DELIVER - Provide everything needed to film TODAY

SCRIPT STRUCTURE (MANDATORY):
- HOOK (0-3 sec): Pattern interrupt, curiosity spike
- BUILD-UP (3-15 sec): Context, stakes, tension
- PAYOFF (15-45 sec): Value delivery, revelation
- CTA (last 5 sec): Clear action, loop potential

SHOT LIST FORMAT:
- Scene 1: [Shot type] - [Description] - [Duration]
- Scene 2: [Shot type] - [Description] - [Duration]
etc.

SHOT TYPES:
- Close-up (face, product, detail)
- Medium shot (waist up)
- Wide shot (full body, environment)
- B-roll (supporting footage)
- Text overlay
- POV shot

OUTPUT MUST BE "READY TO FILM IMMEDIATELY"

Return ONLY valid JSON:
{
  "analysis": {
    "original_topic": "what the video is about",
    "viral_reason": "why it went viral",
    "hook_type": "pattern used",
    "structure": "how it's organized",
    "emotional_trigger": "emotion it triggers"
  },
  "your_version": {
    "topic": "adapted for your niche",
    "angle": "your unique twist",
    "target_emotion": "emotion you'll trigger"
  },
  "hook": {
    "text": "your rewritten hook (exact words to say)",
    "duration": "3 seconds",
    "visual": "what's on screen"
  },
  "script": {
    "hook": "HOOK section (0-3 sec) - exact words",
    "buildup": "BUILD-UP section (3-15 sec) - exact words",
    "payoff": "PAYOFF section (15-45 sec) - exact words",
    "cta": "CTA section (last 5 sec) - exact words",
    "full_script": "complete script ready to read"
  },
  "shot_list": [
    {"scene": 1, "name": "Hook", "shot_type": "Close-up", "description": "Face, direct to camera", "duration": "3 sec", "notes": "High energy, lean in"},
    {"scene": 2, "name": "Problem", "shot_type": "Medium shot", "description": "Show the problem", "duration": "5 sec", "notes": "Frustrated expression"},
    {"scene": 3, "name": "Solution", "shot_type": "B-roll", "description": "Show the solution", "duration": "10 sec", "notes": "Quick cuts"},
    {"scene": 4, "name": "Result", "shot_type": "Before/After", "description": "Transformation", "duration": "5 sec", "notes": "Satisfying reveal"},
    {"scene": 5, "name": "CTA", "shot_type": "Close-up", "description": "Direct to camera", "duration": "3 sec", "notes": "Confident, clear"}
  ],
  "caption": {
    "text": "ready-to-post caption",
    "cta": "engagement call to action"
  },
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "filming_tips": ["tip 1", "tip 2", "tip 3"],
  "estimated_duration": "30-45 seconds"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write EVERYTHING in Turkish - script, caption, tips. Must sound native.',
      'en': 'Write everything in English.',
      'ru': 'Write everything in Russian.',
      'de': 'Write everything in German.',
      'fr': 'Write everything in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Reverse engineer this viral content and create a ready-to-film version:

VIRAL VIDEO DESCRIPTION:
"""
${videoDescription}
"""

MY NICHE: ${creatorNiche || 'general content creation'}
PLATFORM: ${platform}
${langInstruction}

IMPORTANT:
- The script must have exact words to say
- The shot list must be detailed enough to film today
- Everything must be adapted to MY niche
- Output must feel "ready to film immediately"

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
    console.error('Steal Video Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
