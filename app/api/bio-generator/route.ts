import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { niche, platform, tone, keywords, language } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Niche is required' }, { status: 400 })
    }

    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'bio-generator')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const charLimits: Record<string, number> = {
      instagram: 150, tiktok: 80, youtube: 1000, twitter: 160, linkedin: 2600
    }

    const langMap: Record<string, string> = {
      'tr': 'Write ALL bios in Turkish.',
      'en': 'Write all bios in English.',
      'ru': 'Write all bios in Russian.',
      'de': 'Write all bios in German.',
      'fr': 'Write all bios in French.'
    }

    const systemPrompt = `You are a social media bio expert. You write compelling, conversion-focused bios that make people follow.

Return ONLY valid JSON:
{
  "bios": [
    {
      "text": "the bio text",
      "style": "professional/creative/minimal/bold/fun",
      "char_count": 120,
      "has_cta": true,
      "has_emoji": true,
      "hook_type": "authority/curiosity/value/social-proof"
    }
  ],
  "best_bio": {
    "text": "the single best bio",
    "reason": "why this wins"
  },
  "tips": ["tip for this platform bio"]
}`

    const limit = charLimits[platform] || 150

    const userPrompt = `Generate 10 viral bios for: "${niche}"

Platform: ${platform || 'instagram'}
Character limit: ${limit} characters MAX per bio
Tone: ${tone || 'professional'}
Keywords to include: ${keywords || 'none specified'}
${langMap[language as string] || langMap['en']}

RULES:
- Every bio MUST be under ${limit} characters
- Mix styles: some with emojis, some minimal, some with CTA
- Include relevant emojis but don't overdo it
- Add a call-to-action where appropriate (link in bio, DM me, etc.)
- Make each bio unique and scroll-stopping
${brandContext}

Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.9, max_tokens: 3000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

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
    } }

    await saveContent(userId, 'bio-generator', `${niche} - ${platform}`, result)

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Bio Generator Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
