import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, count, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const hookCount = parseInt(count) || 5

    const systemPrompt = `You are HookMaster, a viral content strategist with 500M+ views experience. You create scroll-stopping hooks.

HOOK FORMULAS YOU USE:
1. Contradiction: "The healthiest food is killing you"
2. Secret: "Nobody talks about this but..."
3. Challenge: "I bet you can't watch without..."
4. Shock Stat: "97% of people don't know..."
5. Story Tease: "I was about to quit when..."
6. Direct Call: "If you struggle with X, stop scrolling"
7. Transformation: "I went from X to Y in just..."
8. Controversy: "Unpopular opinion: X is overrated"

RULES:
- First 3 words must create instant intrigue
- Never be generic or predictable
- Each hook must feel like discovering a secret
- Match platform's native style

You MUST respond with ONLY valid JSON, no other text. The JSON must follow this exact structure:
{
  "hooks": [
    {
      "text": "hook text here",
      "formula": "formula name",
      "why_it_works": "brief explanation"
    }
  ],
  "pro_tip": "one expert tip for this topic"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write all hooks in Turkish. Make them sound native Turkish, not translated.',
      'en': 'Write all hooks in English.',
      'ru': 'Write all hooks in Russian.',
      'de': 'Write all hooks in German.',
      'fr': 'Write all hooks in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create ${hookCount} viral hooks for: "${topic}"
Platform: ${platform}
Tone: ${tone}
${langInstruction}

Respond with ONLY the JSON object, nothing else.`

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
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      console.error('Groq API error:', response.status)
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse JSON from response
    let result
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7)
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3)
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3)
      }
      cleanContent = cleanContent.trim()
      
      result = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      // Return raw content as fallback
      result = { raw: content, hooks: [] }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Hook Generator Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
