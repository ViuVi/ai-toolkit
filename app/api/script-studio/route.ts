import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, duration, platform, style, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'script-studio')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const langMap: Record<string, string> = {
      'tr': 'Write the ENTIRE script in Turkish.',
      'en': 'Write in English.',
      'ru': 'Write in Russian.',
      'de': 'Write in German.',
      'fr': 'Write in French.'
    }

    const systemPrompt = `You are ScriptMaster, expert at writing viral video scripts.

You MUST return ONLY valid JSON:
{
  "script": {
    "hook": "attention-grabbing opening (first 3 seconds)",
    "intro": "context setting",
    "main_points": [
      { "point": "key point", "script": "what to say", "visual_cue": "what to show" }
    ],
    "climax": "peak moment",
    "cta": "call to action",
    "outro": "closing"
  },
  "full_script": "complete script text for voiceover",
  "duration_estimate": "estimated length",
  "tips": ["production tip 1", "tip 2"]
}`

    const durationMap: Record<string, string> = {
      '15': '15 seconds - ultra short, hook + 1 point + CTA',
      '30': '30 seconds - short form, hook + 2 points + CTA',
      '60': '60 seconds - standard, hook + 3-4 points + CTA',
      '180': '3 minutes - detailed, hook + 5-6 points + CTA'
    }

    const userPrompt = `Create a viral video script for: "${topic}"

Duration: ${durationMap[duration] || '60 seconds'}
Platform: ${platform || 'tiktok'}
Style: ${style || 'educational'}
${langMap[language as string] || langMap['en']}

Make it engaging with pattern interrupts and visual cues.
Respond with ONLY JSON.
${brandContext}`

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

    
    // Auto-save to content library
    await saveContent(userId, 'script-studio', topic || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Script Studio Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
