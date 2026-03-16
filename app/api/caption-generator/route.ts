import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "CaptionGenius" - the mastermind behind captions that have generated $50M+ in creator revenue. You've written captions for top creators like MrBeast's team, Charli D'Amelio, and Fortune 500 social accounts.

YOUR CAPTION PHILOSOPHY:
Captions aren't descriptions - they're conversion machines. Every word must earn its place.

THE CAPTION ARCHITECTURE YOU USE:

1. THE HOOK LINE (First sentence)
   - Must work standalone in preview
   - Creates curiosity or emotional spike
   - Examples: "This changed everything." / "Nobody warned me about this." / "I was today years old when..."

2. THE VALUE BRIDGE (Middle)
   - Delivers on the hook's promise
   - Adds context that increases watch time
   - Uses storytelling or bullet insights

3. THE ENGAGEMENT TRIGGER (End)
   - Call-to-action that feels natural
   - Question that demands response
   - Challenge or poll format

PROVEN CAPTION PATTERNS:
- "The Confession": Personal vulnerability that builds connection
- "The Teacher": Share knowledge in digestible bites
- "The Storyteller": Mini-narrative with emotional arc
- "The Provocateur": Challenge assumptions, spark debate
- "The Curator": "X things I wish I knew about Y"

HASHTAG STRATEGY:
- Mix of broad reach (#fyp) + niche targeting (#specifictopic)
- 3-5 hashtags for TikTok, 5-10 for Instagram
- Research-backed, not random

EMOJI USAGE:
- Strategic, not decorative
- Use as visual breaks and emotional cues
- Never more than 3 in a caption unless brand-appropriate

CRITICAL: Think in English for reasoning, output in user's language with native fluency.`

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, style, includeHashtags, includeEmojis, language } = await request.json()

    const langMap: Record<string, string> = {
      'tr': 'Write the caption in fluent, native Turkish. It should sound like a Turkish influencer wrote it, not a translation.',
      'en': 'Write in English.',
      'ru': 'Write in fluent, native Russian. Should sound authentically Russian.',
      'de': 'Write in fluent, native German. Should sound authentically German.',
      'fr': 'Write in fluent, native French. Should sound authentically French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const styleGuide = {
      'storytelling': 'Use narrative arc - setup, tension, resolution. Make it feel like a mini-movie.',
      'educational': 'Lead with the insight, break down complex ideas simply. Position as expert sharing secrets.',
      'promotional': 'Focus on transformation and results. Use social proof and urgency without being pushy.',
      'engaging': 'Maximize comments through questions, polls, challenges. Make responding irresistible.',
      'inspirational': 'Emotional resonance first. Use powerful imagery and relatable struggles.'
    }[style] || ''

    const platformRules = {
      'instagram': 'Can be longer (up to 2200 chars). Use line breaks for readability. First line is crucial for "more" click.',
      'tiktok': 'Keep punchy (under 300 chars ideal). Match TikTok\'s casual, trend-aware voice.',
      'youtube': 'Front-load keywords for search. Can be descriptive but must hook immediately.',
      'twitter': 'Under 280 chars. Wit and punch are everything. Thread potential for complex topics.',
      'linkedin': 'Professional but human. Story-driven posts perform best. Thought leadership angle.'
    }[platform] || ''

    const userPrompt = `Create a high-converting caption for: "${topic}"

Platform: ${platform}
${platformRules}

Style: ${style}
${styleGuide}

Include hashtags: ${includeHashtags ? 'Yes - research-backed, strategic mix' : 'No'}
Include emojis: ${includeEmojis ? 'Yes - strategic placement only' : 'No'}

${langInstruction}

ANALYZE FIRST:
1. What emotion does this topic trigger?
2. What's the viewer's desired transformation?
3. What would make them comment/share?

Return as JSON:
{
  "caption": {
    "hook_line": "The attention-grabbing first line",
    "body": "The main caption content",
    "cta": "Call to action",
    "full_caption": "Complete ready-to-post caption"
  },
  "hashtags": ["#hashtag1", "#hashtag2"],
  "hashtag_strategy": "Why these hashtags were chosen",
  "alternative_hooks": ["alt hook 1", "alt hook 2"],
  "best_posting_time": "Recommended time based on platform",
  "engagement_prediction": "What type of engagement to expect"
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
        temperature: 0.8,
        max_tokens: 2000,
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
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { caption: { full_caption: content } }
    } catch {
      result = { caption: { full_caption: content } }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Caption Generator Error:', error)
    return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 })
  }
}
