import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "ScriptMaster Pro" - a veteran video script writer who has crafted scripts for videos totaling 2 billion+ views. You've worked with Netflix documentary teams, top YouTubers, and viral TikTok creators.

YOUR SCRIPT PHILOSOPHY:
Every second of a script must EARN the viewer's next second. Attention is the currency - spend it wisely.

THE VIRAL SCRIPT ARCHITECTURE:

1. THE HOOK (0-3 seconds)
   - Pattern interrupt: Say something unexpected
   - Curiosity injection: Open a loop that MUST be closed
   - Emotional spike: Trigger immediate feeling
   - Identity call-out: "If you're someone who..."

2. THE SETUP (3-15 seconds)
   - Context that raises stakes
   - "Why should I care?" answered immediately
   - Tease the transformation coming

3. THE MEAT (15-45 seconds)
   - Deliver value in digestible chunks
   - Use "bucket brigades": transitional phrases that keep momentum
   - "Here's the thing...", "But wait...", "Now this is where it gets interesting..."
   - Each point should feel like a mini-revelation

4. THE CLIMAX (final 10%)
   - Biggest insight or emotional peak
   - The "aha moment" they'll remember
   - Shareable soundbite potential

5. THE CTA (last 3-5 seconds)
   - Clear, specific action
   - Urgency without desperation
   - Loop back to hook for retention

PROVEN SCRIPT FORMULAS:
- "Problem-Agitate-Solve": Name pain → Make it worse → Deliver relief
- "Story-Lesson-Application": Tell story → Extract insight → Show how to apply
- "Myth-Bust": Common belief → Why it's wrong → Better alternative
- "Behind the Scenes": Exclusive access feel → Insider knowledge → Action step

PACING RULES:
- New visual/beat every 2-3 seconds for short-form
- Vary sentence length: short punches mixed with flowing explanations
- Strategic pauses noted as [BEAT]
- B-roll suggestions for visual variety

LANGUAGE MASTERY:
- Power words: "Secret", "Discover", "Unlock", "Transform", "Proven"
- Avoid: "Very", "Really", "Just", "Thing", "Stuff"
- Active voice always
- Second person "you" for connection

Think in English for structure, deliver in user's language with native fluency.`

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration, style, language } = await request.json()

    const langMap: Record<string, string> = {
      'tr': 'Write the entire script in fluent, conversational Turkish. It should sound like a native Turkish creator speaking naturally, not a translation. Use Turkish idioms and speech patterns.',
      'en': 'Write in conversational English.',
      'ru': 'Write in fluent, conversational Russian with native speech patterns.',
      'de': 'Write in fluent, conversational German with native speech patterns.',
      'fr': 'Write in fluent, conversational French with native speech patterns.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const durationGuideMap: Record<string, string> = {
      '15': '15 seconds: Ultra-tight. One powerful idea, maximum impact. ~40 words.',
      '30': '30 seconds: Hook + one key point + CTA. ~80 words.',
      '60': '60 seconds: Full mini-story arc. Hook + 2-3 points + strong close. ~160 words.',
      '180': '3 minutes: Deep dive format. Multiple sections, story weaving, comprehensive value. ~450 words.'
    }
    const durationGuide = durationGuideMap[duration as string] || '60 seconds format'

    const styleGuideMap: Record<string, string> = {
      'educational': 'Teacher energy - confident expertise delivered accessibly. "Let me show you..." vibe.',
      'entertaining': 'Entertainment first, value embedded. Personality-driven, reactions welcome.',
      'storytelling': 'Narrative arc essential. Character, conflict, resolution. Emotional journey.',
      'tutorial': 'Clear step-by-step. Visual cues noted. "First... Then... Finally..." structure.'
    }
    const styleGuide = styleGuideMap[style as string] || ''

    const platformNotesMap: Record<string, string> = {
      'tiktok': 'TikTok energy: Fast cuts implied, trend-aware language, hook in first 1 second.',
      'reels': 'Reels: Slightly more polished than TikTok, but same urgency. Visual-first scripting.',
      'shorts': 'YouTube Shorts: Can be slightly more substantive. Searchability matters.',
      'youtube': 'Long-form YouTube: Deeper storytelling, chapter-ready structure, retention focus.'
    }
    const platformNotes = platformNotesMap[platform as string] || ''

    const userPrompt = `Write a viral video script about: "${topic}"

Duration: ${duration} seconds
${durationGuide}

Platform: ${platform}
${platformNotes}

Style: ${style}
${styleGuide}

${langInstruction}

BEFORE WRITING, ANALYZE:
1. What's the ONE core message?
2. What emotion should viewers feel at the end?
3. What would make them watch again or share?

Return as JSON:
{
  "script": {
    "hook": {
      "text": "Opening hook text (first 3 seconds)",
      "visual_note": "What should be on screen",
      "duration": "X seconds"
    },
    "sections": [
      {
        "type": "setup/main_point/climax/cta",
        "text": "Script text for this section",
        "visual_note": "B-roll or visual suggestion",
        "duration": "X seconds"
      }
    ],
    "full_script": "Complete script ready to read"
  },
  "total_duration": "Estimated total",
  "word_count": 123,
  "key_moments": ["Timestamp: key moment description"],
  "thumbnail_ideas": ["Idea 1", "Idea 2"],
  "title_options": ["Title 1", "Title 2", "Title 3"],
  "viral_potential_score": "8/10",
  "why_this_works": "Brief explanation of psychological hooks used"
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
        max_tokens: 3000,
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
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { script: { full_script: content } }
    } catch {
      result = { script: { full_script: content } }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Script Studio Error:', error)
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 })
  }
}
