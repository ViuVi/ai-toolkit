import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { originalContent, content, sourceFormat, contentType, targetPlatforms, language } = await request.json()
    const finalContent = originalContent || content || ''
    const finalFormat = sourceFormat || sourceFormat2 || 'blog'

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Authenticate from token
    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'content-repurposer')
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 })
    }

    const brandContext = await getBrandContext(userId)

    const langMap: Record<string, string> = {
      'tr': 'Write ALL repurposed content in Turkish.',
      'en': 'Write in English.',
      'ru': 'Write in Russian.',
      'de': 'Write in German.',
      'fr': 'Write in French.'
    }

    const systemPrompt = `You are a content repurposing expert. Return ONLY valid JSON:
{
  "repurposed": [
    {
      "platform": "tiktok",
      "format": "short video script",
      "content": "repurposed content",
      "hook": "platform-specific hook",
      "hashtags": ["#tag1", "#tag2"],
      "tips": "production tips"
    }
  ],
  "content_atoms": ["key message 1", "key message 2"],
  "distribution_plan": {
    "day1": "platform and content",
    "day2": "platform and content"
  },
  "additional_ideas": ["idea 1", "idea 2"]
}`

    const platforms = targetPlatforms?.join(', ') || 'tiktok, instagram, twitter, linkedin'
    
    const userPrompt = `Repurpose this content for multiple platforms:

Original (${sourceFormat || 'blog post'}):
"${content}"

Target platforms: ${platforms}
${langMap[language as string] || langMap['en']}

Create unique versions optimized for each platform.
Respond with ONLY JSON.
${brandContext}`

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
    const content2 = data.choices?.[0]?.message?.content
    if (!content2) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

        let result
    try {
      let cleanContent = content2.trim()
      cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')
      const firstBrace = cleanContent.indexOf('{')
      const lastBrace = cleanContent.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1)
      }
      result = JSON.parse(cleanContent)
    } catch {
      result = { raw: content2 }
    }

    
    // Auto-save to content library
    await saveContent(userId, 'content-repurposer', content || '', result)
    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Content Repurposer Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
