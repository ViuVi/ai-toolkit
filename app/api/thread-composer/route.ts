import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, threadLength, style, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const numTweets = parseInt(threadLength) || 10

    const systemPrompt = `You are ThreadWeaver, master of viral Twitter/X threads with 500M+ impressions.

THREAD STRUCTURE:
1. HOOK TWEET - Stop the scroll, create FOMO, make them click
2. SETUP - Context, stakes, credibility
3. VALUE TWEETS - One insight per tweet, each quotable
4. CLIMAX - Biggest reveal, aha moment
5. CTA - Clear action, retweet request, follow prompt

THREAD FORMULAS:
- "Here's how I..." (Case study)
- "X lessons from..." (Listicle)
- "The [topic] thread:" (Deep dive)
- "I spent [time] studying [topic]. Here's what I learned:" (Research)
- "Unpopular opinion:" (Controversial)
- "Thread 🧵" (Simple opener)

TWEET RULES:
- Each tweet under 280 characters
- Each tweet must stand alone (quotable)
- No hashtags mid-thread (looks spammy)
- Use numbers and specifics
- Line breaks for readability

ENGAGEMENT TACTICS:
- Ask for RT in final tweet
- Self-reply with additional value
- Pin best threads
- Quote tweet your own thread with different angle

Return ONLY valid JSON:
{
  "thread_strategy": {
    "format": "CASE STUDY/LISTICLE/DEEP DIVE/RESEARCH/CONTROVERSIAL",
    "hook_type": "curiosity/controversy/story/authority/fomo",
    "target_emotion": "emotion to evoke",
    "retweet_potential": "high/medium/low"
  },
  "tweets": [
    {
      "number": 1,
      "type": "HOOK",
      "text": "tweet text under 280 chars",
      "char_count": 180,
      "purpose": "what this tweet does"
    },
    {
      "number": 2,
      "type": "SETUP",
      "text": "tweet text",
      "char_count": 200,
      "purpose": "establishes context"
    }
  ],
  "hook_alternatives": [
    {"text": "alternative hook 1", "angle": "different approach"},
    {"text": "alternative hook 2", "angle": "different approach"}
  ],
  "cta_tweet": {
    "text": "final CTA tweet with RT and follow request",
    "char_count": 150
  },
  "self_replies": [
    {"text": "bonus tweet to add as reply", "purpose": "additional value"}
  ],
  "full_thread": "Tweet 1:\n[text]\n\nTweet 2:\n[text]\n\nTweet 3:\n[text]...",
  "posting_strategy": {
    "best_time": "when to post",
    "engagement_window": "when to engage with replies",
    "self_rt_timing": "when to retweet own thread"
  },
  "repurpose_ideas": [
    {"platform": "platform", "format": "how to repurpose"}
  ]
}`

    const langMap: Record<string, string> = {
      'tr': 'Write the ENTIRE thread in Turkish.',
      'en': 'Write the thread in English.',
      'ru': 'Write the thread in Russian.',
      'de': 'Write the thread in German.',
      'fr': 'Write the thread in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create a viral Twitter/X thread about: "${topic}"

Thread length: ${numTweets} tweets
Style: ${style || 'educational with storytelling'}
${langInstruction}

REQUIREMENTS:
- Each tweet MUST be under 280 characters
- Include character count for each tweet
- Make each tweet quotable/standalone
- Include hook alternatives and CTA

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
        max_tokens: 5000,
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
