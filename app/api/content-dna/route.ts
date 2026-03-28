import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, mode, platform, language } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'content-dna')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const langMap: Record<string, string> = {
      'tr': 'Respond entirely in Turkish.',
      'en': 'Respond in English.',
      'ru': 'Respond in Russian.',
      'de': 'Respond in German.',
      'fr': 'Respond in French.'
    }

    let systemPrompt: string
    let userPrompt: string

    if (mode === 'regenerate') {
      // Mode 2: Regenerate content using the same DNA
      systemPrompt = `You are a viral content architect. You take the structural DNA of a proven viral content and create NEW original content using the exact same psychological patterns, story structure, and engagement mechanics — but adapted to the creator's niche.

Return ONLY valid JSON:
{
  "new_content": {
    "hook": "the opening hook using same pattern",
    "full_script": "complete script/caption following the same structure",
    "cta": "call to action using same CTA pattern"
  },
  "adaptation_notes": "how the DNA was adapted to this niche",
  "variations": [
    {
      "angle": "different angle name",
      "hook": "alternative hook",
      "one_liner": "one line summary of this version"
    }
  ],
  "posting_strategy": {
    "best_time": "recommended posting time",
    "hashtags": ["#tag1", "#tag2"],
    "caption_style": "how to write the caption"
  }
}`

      userPrompt = `Here is the DNA analysis of a viral content:

${content}

Now create COMPLETELY NEW original content using this EXACT same structural DNA.
Platform: ${platform || 'tiktok'}
${langMap[language as string] || langMap['en']}

${brandContext}

IMPORTANT: 
- Keep the same psychological patterns and story structure
- Change the topic/niche completely to match the creator's brand
- Generate 3 different angle variations
- Make it specific enough to film/post TODAY
Respond with ONLY JSON.`

    } else {
      // Mode 1: Analyze content DNA
      systemPrompt = `You are a viral content forensic analyst. You deconstruct content to find the exact psychological, structural, and strategic patterns that made it go viral. Your analysis is extremely specific and actionable.

Return ONLY valid JSON:
{
  "dna_summary": "one sentence explaining why this content works",
  "viral_score": 85,
  "structure": {
    "framework": "AIDA/PAS/3-Act/Before-After/Problem-Solution/Story Arc",
    "framework_breakdown": [
      { "phase": "phase name", "content": "what happens in this phase", "purpose": "why it works" }
    ]
  },
  "hook_analysis": {
    "type": "question/shock/number/controversy/curiosity/identification",
    "pattern": "the specific pattern used (e.g., 'X thing nobody talks about')",
    "power_words": ["word1", "word2"],
    "scroll_stop_score": 9,
    "why_it_works": "psychological explanation"
  },
  "emotional_triggers": [
    { "emotion": "curiosity/fear/desire/belonging/outrage", "where": "where in content", "intensity": 8 }
  ],
  "pacing": {
    "tempo": "fast/medium/slow/accelerating",
    "pattern": "how information is revealed",
    "retention_hooks": ["hook at timestamp/position 1", "hook 2"]
  },
  "engagement_mechanics": {
    "comment_bait": "what drives comments",
    "share_trigger": "what makes people share",
    "save_reason": "what makes people save",
    "follow_hook": "what makes people follow"
  },
  "cta_analysis": {
    "type": "direct/subtle/implied/multi-step",
    "placement": "where the CTA is",
    "effectiveness": 8
  },
  "weaknesses": ["weakness 1", "weakness 2"],
  "dna_code": "HOOK:question + STRUCTURE:pas + EMOTION:curiosity,fear + PACING:fast + CTA:direct"
}`

      userPrompt = `Deconstruct this viral content and extract its complete DNA:

"${content}"

Platform: ${platform || 'tiktok'}
${langMap[language as string] || langMap['en']}

Be extremely specific. Don't give generic advice — tell me the EXACT patterns, the EXACT psychological triggers, the EXACT structural framework used.
Respond with ONLY JSON.`
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.8, max_tokens: 5000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const aiContent = data.choices?.[0]?.message?.content
    if (!aiContent) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

    let result
    try {
      let clean = aiContent.trim()
      if (clean.startsWith('```json')) clean = clean.slice(7)
      else if (clean.startsWith('```')) clean = clean.slice(3)
      if (clean.endsWith('```')) clean = clean.slice(0, -3)
      result = JSON.parse(clean.trim())
    } catch { result = { raw: aiContent } }

    await saveContent(userId, 'content-dna', content.substring(0, 100), result)

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Content DNA Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
