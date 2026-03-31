import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Kredi kontrolü ve düşürme
    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'hook-generator')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const systemPrompt = `You are HookMaster, the world's best viral hook writer. You have written hooks for videos with 1B+ combined views.

HOOK PATTERNS YOU MUST USE:
1. CURIOSITY GAP - Creates "I need to know" feeling
2. CONTROVERSIAL - Challenges common beliefs
3. STORYTELLING - Opens a narrative loop
4. AUTHORITY - Positions expertise
5. SHOCK VALUE - Unexpected statement
6. DIRECT BENEFIT - Clear value proposition
7. QUESTION - Engages viewer's mind
8. FEAR OF MISSING OUT - Creates urgency

RULES:
- Each hook MUST be under 12 words
- No fluff, no filler words
- Must stop the scroll instantly

You MUST return ONLY valid JSON with exactly this structure:
{
  "hooks": [
    {
      "text": "hook text here (max 12 words)",
      "pattern": "CURIOSITY GAP/CONTROVERSIAL/STORYTELLING/AUTHORITY/SHOCK VALUE/DIRECT BENEFIT/QUESTION/FOMO",
      "curiosity_score": 8,
      "virality_score": 9,
      "why_it_works": "brief explanation"
    }
  ],
  "best_hook": {
    "text": "the single best hook",
    "reason": "why this is the winner"
  },
  "topic_insight": "key insight about this topic for hooks"
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL 20 hooks in Turkish. They must sound native.',
      'en': 'Write all hooks in English.',
      'ru': 'Write all hooks in Russian.',
      'de': 'Write all hooks in German.',
      'fr': 'Write all hooks in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const platformContext: Record<string, string> = {
      'tiktok': 'TikTok style: trendy, fast, casual',
      'instagram': 'Instagram Reels: polished but punchy',
      'youtube': 'YouTube Shorts: value-focused, curiosity-driven',
      'twitter': 'Twitter/X: witty, provocative, shareable'
    }

    const userPrompt = `Generate exactly 20 viral hooks for: "${topic}"

Platform: ${platform} - ${platformContext[platform] || ''}
Tone: ${tone || 'engaging'}
${langInstruction}

IMPORTANT:
- Generate EXACTLY 20 different hooks
- Use ALL 8 pattern types
- Score curiosity_score and virality_score from 1-10
- Keep each hook under 12 words

Respond with ONLY the JSON object, no other text.
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
        temperature: 0.9,
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
      cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')
      const firstBrace = cleanContent.indexOf('{')
      const lastBrace = cleanContent.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1)
      }
      result = JSON.parse(cleanContent)
    } catch {
      result = { raw: content }
    }
    }

    
    // Auto-save to content library
    await saveContent(userId, 'hook-generator', topic || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Hook Generator Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
