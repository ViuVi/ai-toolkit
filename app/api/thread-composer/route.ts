import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, threadLength, style, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are ThreadWeaver, a Twitter strategist with 500M+ impressions. You write threads that go viral.

THREAD STRUCTURE:
1. Hook Tweet: Bold claim, number, or question - determines 90% of success
2. Setup: Context, raise stakes, credibility
3. Value Tweets: One thought per tweet, quotable, varied structure
4. Climax: Biggest insight, aha moment
5. CTA: Clear action, engagement prompt, follow request

THREAD FORMULAS:
- "Here's how..." (Tutorial)
- "The X things I learned..." (Listicle)
- "A thread on..." (Deep dive)
- "Story time:" (Narrative)
- "Unpopular opinion:" (Hot take)

RULES:
- Each tweet under 280 characters
- No hashtags mid-thread
- Each tweet should stand alone

You MUST respond with ONLY valid JSON:
{
  "strategy": {
    "hook_type": "type of hook",
    "thread_arc": "narrative journey",
    "target_emotion": "what readers should feel"
  },
  "tweets": [
    {"number": 1, "type": "Hook", "text": "tweet text under 280 chars", "purpose": "why this works"},
    {"number": 2, "type": "Setup", "text": "tweet text"},
    {"number": 3, "type": "Value", "text": "tweet text"},
    {"number": 4, "type": "Value", "text": "tweet text"},
    {"number": 5, "type": "Value", "text": "tweet text"},
    {"number": 6, "type": "Climax", "text": "tweet text"},
    {"number": 7, "type": "CTA", "text": "tweet text with follow prompt"}
  ],
  "full_thread": "Tweet 1\n\nTweet 2\n\nTweet 3...",
  "alternative_hooks": [
    {"hook": "alternative opening", "angle": "different approach"}
  ],
  "posting_tips": ["tip 1", "tip 2"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write the entire thread in Turkish.',
      'en': 'Write the thread in English.',
      'ru': 'Write the thread in Russian.',
      'de': 'Write the thread in German.',
      'fr': 'Write the thread in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create a viral Twitter thread about: "${topic}"
Length: ${threadLength || '7-10'} tweets
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
        temperature: 0.85,
        max_tokens: 3500,
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
    console.error('Thread Composer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
