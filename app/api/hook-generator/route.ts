import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "HookMaster" - a legendary viral content strategist who has generated over 500 million views across TikTok, Instagram, and YouTube. You've studied the psychology behind every viral video from 2020-2024 and understand exactly what makes someone stop scrolling.

YOUR EXPERTISE:
- Pattern interrupts that hijack attention in 0.3 seconds
- Curiosity gaps that create irresistible tension
- Emotional triggers that bypass rational thinking
- Platform-specific hooks optimized for each algorithm

PROVEN HOOK FORMULAS YOU USE:
1. "The Contradiction" - Start with something that seems wrong: "The healthiest food is actually killing you"
2. "The Secret" - Imply hidden knowledge: "Nobody talks about this, but..."
3. "The Challenge" - Provoke the viewer: "I bet you can't watch this without..."
4. "The Shock Stat" - Lead with surprising data: "97% of people don't know..."
5. "The Story Tease" - Open a narrative loop: "I was about to quit when..."
6. "The Direct Call" - Speak to specific pain: "If you're struggling with X, stop scrolling"
7. "The Transformation" - Show before/after: "I went from X to Y in just..."
8. "The Controversy" - Take a bold stance: "Unpopular opinion: X is overrated"

CRITICAL RULES:
- First 3 words are EVERYTHING - they must create instant intrigue
- Never be generic or predictable
- Each hook must feel like discovering a secret
- Hooks should feel authentic, not clickbaity
- Always match the platform's native language style

THINK IN ENGLISH for best quality, then respond in the user's language.`

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, count, language } = await request.json()

    const langInstruction: Record<string, string> = {
      'tr': 'Respond entirely in Turkish. Make hooks sound natural in Turkish, not translated.',
      'en': 'Respond in English.',
      'ru': 'Respond entirely in Russian. Make hooks sound natural in Russian.',
      'de': 'Respond entirely in German. Make hooks sound natural in German.',
      'fr': 'Respond entirely in French. Make hooks sound natural in French.'
    }[language] || 'Respond in English.'

    const platformContext = {
      'tiktok': 'TikTok hooks must be punchy, trendy, and work with fast-paced editing. Use current TikTok speech patterns.',
      'instagram': 'Instagram Reels hooks should be slightly more polished but still attention-grabbing. Consider the visual-first nature.',
      'youtube': 'YouTube Shorts hooks need to promise value quickly. Viewers expect slightly more substance.',
      'twitter': 'Twitter/X hooks must work as text-first. Brevity and wit are essential.'
    }[platform] || ''

    const toneContext = {
      'professional': 'Keep hooks authoritative and credible, but never boring.',
      'casual': 'Make hooks feel like talking to a friend who knows secrets.',
      'humorous': 'Add wit and unexpected twists, but ensure the hook still drives curiosity.',
      'dramatic': 'Use power words and create maximum tension and intrigue.'
    }[tone] || ''

    const userPrompt = `Create ${count || 5} viral hooks for this topic: "${topic}"

Platform: ${platform} - ${platformContext}
Tone: ${tone} - ${toneContext}

${langInstruction}

THINK STEP BY STEP:
1. First, identify the core emotional trigger in this topic
2. Find the curiosity gap - what would make someone NEED to know more?
3. Craft hooks using the proven formulas
4. Ensure each hook is unique and attacks from a different angle

Return as JSON:
{
  "hooks": [
    {
      "text": "The hook text",
      "formula": "Which formula used",
      "why_it_works": "Brief psychological explanation",
      "opening_words": "First 3 words highlighted"
    }
  ],
  "best_posting_times": ["time1", "time2"],
  "pro_tip": "One expert tip for this specific topic"
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
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse JSON from response
    let result
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { hooks: [], raw: content }
    } catch {
      result = { hooks: [], raw: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Hook Generator Error:', error)
    return NextResponse.json({ error: 'Failed to generate hooks' }, { status: 500 })
  }
}
