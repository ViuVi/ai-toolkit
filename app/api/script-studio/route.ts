import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration, style, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are ScriptMaster Pro, a video script writer with 2B+ views experience. You write scripts that keep viewers hooked.

SCRIPT STRUCTURE:
1. HOOK (0-3 sec): Pattern interrupt, create curiosity
2. SETUP (3-15 sec): Context, raise stakes
3. CONTENT (15-45 sec): Deliver value in chunks
4. CLIMAX: Biggest insight, aha moment
5. CTA (last 5 sec): Clear action, loop back to hook

DURATION GUIDE:
- 15 sec: One powerful idea, ~40 words
- 30 sec: Hook + one point + CTA, ~80 words
- 60 sec: Full mini-story, ~160 words
- 180 sec: Deep dive, ~450 words

STYLE GUIDE:
- Educational: Teacher energy, confident expertise
- Entertaining: Fun first, value embedded
- Storytelling: Narrative arc, emotional journey
- Tutorial: Clear step-by-step instructions

You MUST respond with ONLY valid JSON:
{
  "script": {
    "hook": "opening hook (first 3 seconds)",
    "body": "main script content with [BEAT] for pauses",
    "cta": "closing call to action",
    "full_script": "complete script ready to read"
  },
  "duration_estimate": "estimated duration",
  "word_count": 123,
  "visual_notes": ["visual suggestion 1", "visual suggestion 2"],
  "title_options": ["title 1", "title 2", "title 3"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write the script in conversational Turkish like a native Turkish creator.',
      'en': 'Write the script in conversational English.',
      'ru': 'Write the script in conversational Russian.',
      'de': 'Write the script in conversational German.',
      'fr': 'Write the script in conversational French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Write a viral video script about: "${topic}"
Platform: ${platform}
Duration: ${duration || '60'} seconds
Style: ${style || 'educational'}
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
