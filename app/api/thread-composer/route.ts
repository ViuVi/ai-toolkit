import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "ThreadWeaver" - a Twitter/X strategist who has written threads that have generated 500M+ impressions. You've mastered the art of turning complex ideas into viral thread format. Your threads have been featured by major publications and built six-figure followings.

YOUR THREAD MASTERY:

1. THE HOOK TWEET (Tweet 1)
   - This IS your headline - it determines 90% of thread success
   - Bold claim, number, or question
   - Must work standalone (most won't click to read thread)
   - Create FOMO - they MUST read more

2. THE SETUP (Tweet 2)
   - Context that raises stakes
   - Why this matters NOW
   - Credibility establishment (subtle)

3. THE VALUE DELIVERY (Tweets 3-8)
   - One complete thought per tweet
   - Each tweet should be quotable/screenshottable
   - Vary structure: story, stat, insight, example
   - "Bucket brigades" to maintain momentum

4. THE CLIMAX (Second-to-last)
   - Biggest insight or revelation
   - The "aha" moment
   - Most shareable part of thread

5. THE CTA (Final tweet)
   - Clear action
   - Engagement prompt
   - Follow + RT request
   - Link back to tweet 1

THREAD FORMULAS:
- "Here's how..." (Tutorial)
- "The [X] things I learned..." (Listicle)
- "A thread on..." (Deep dive)
- "Story time:" (Narrative)
- "Unpopular opinion:" (Hot take)
- "In 2024, I [achievement]. Here's how:" (Case study)

TWEET MECHANICS:
- 280 characters max (but shorter often better)
- Line breaks for readability
- No hashtags mid-thread (looks spammy)
- Emojis sparingly for visual breaks
- Numbers and specifics beat vague claims

GROWTH TACTICS:
- Self-RT thread after 2 hours
- Engage with early replies
- Quote tweet your own thread with different hook

Think in English for clarity, deliver threads in user's language with native fluency.`

export async function POST(request: NextRequest) {
  try {
    const { topic, threadLength, style, language } = await request.json()

    const langMap: Record<string, string> = {
      'tr': 'Write the entire thread in fluent, native Turkish. Should sound like a Turkish thought leader.',
      'en': 'Write in English.',
      'ru': 'Write in fluent Russian. Should sound native and authoritative.',
      'de': 'Write in fluent German. Should sound native and authoritative.',
      'fr': 'Write in fluent French. Should sound native and authoritative.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create a viral Twitter/X thread about:

Topic: ${topic}
Thread Length: ${threadLength || '8-10 tweets'}
Style: ${style || 'Educational with storytelling'}

${langInstruction}

CREATE A COMPLETE VIRAL THREAD:

Return as JSON:
{
  "thread_strategy": {
    "hook_type": "What type of hook being used",
    "thread_arc": "The narrative journey",
    "target_emotion": "What emotion should readers feel",
    "shareability_factor": "Why people will RT"
  },
  "tweets": [
    {
      "number": 1,
      "type": "Hook",
      "content": "Tweet text (under 280 chars)",
      "character_count": 180,
      "purpose": "Why this hook works",
      "standalone_strength": "Can this go viral alone?"
    },
    {
      "number": 2,
      "type": "Setup",
      "content": "Tweet text",
      "character_count": 200,
      "transition": "How it connects to hook"
    },
    {
      "number": 3,
      "type": "Value Point 1",
      "content": "Tweet text",
      "character_count": 220,
      "key_insight": "Main takeaway from this tweet"
    }
  ],
  "full_thread_text": "All tweets numbered and ready to post",
  "alternative_hooks": [
    {
      "hook": "Alternative opening tweet",
      "angle": "Different approach",
      "why_might_work": "Reasoning"
    }
  ],
  "quotable_tweets": [
    {
      "tweet_number": 5,
      "why_quotable": "Why this will get screenshotted/quoted"
    }
  ],
  "engagement_strategy": {
    "first_reply": "What to comment under tweet 1",
    "engagement_window": "When to engage with replies",
    "self_rt_timing": "When to retweet the thread"
  },
  "hashtag_strategy": {
    "use_hashtags": true,
    "hashtags": ["#hashtag1"],
    "placement": "Only at end, not throughout"
  },
  "multimedia_suggestions": {
    "images": "Any images that would enhance thread",
    "which_tweets": "Where to add media"
  },
  "follow_up_content": {
    "thread_2_idea": "Follow-up thread topic",
    "standalone_tweets": "Tweets to post after thread"
  },
  "optimization_notes": {
    "best_time_to_post": "When to post for max reach",
    "expected_engagement": "What to expect",
    "iteration_ideas": "How to improve next thread"
  }
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
        max_tokens: 4000,
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
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content }
    } catch {
      result = { raw: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Thread Composer Error:', error)
    return NextResponse.json({ error: 'Failed to compose thread' }, { status: 500 })
  }
}
