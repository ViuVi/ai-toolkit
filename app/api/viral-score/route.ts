import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, checkAndDeductCredits, getBrandContext, saveContent } from '@/lib/api-helpers'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { content, platform, scores, language } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const auth = await authenticateRequest(request)
    if (auth.error) return auth.error
    const userId = auth.userId

    const creditResult = await checkAndDeductCredits(userId, 'viral-score')
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

    const systemPrompt = `You are a viral content optimization expert. You receive content with its current engagement scores and must provide specific, actionable improvements.

Return ONLY valid JSON:
{
  "optimized_content": "the rewritten, optimized version of the content",
  "changes_made": [
    { "what": "change description", "why": "reasoning", "impact": "+15% engagement" }
  ],
  "hook_alternatives": ["alt hook 1", "alt hook 2", "alt hook 3"],
  "predicted_score_after": 85,
  "platform_specific_tips": ["tip 1", "tip 2"],
  "hashtag_suggestions": ["#tag1", "#tag2", "#tag3"]
}`

    const userPrompt = `Optimize this content for maximum virality:

"${content}"

Platform: ${platform || 'tiktok'}
Current scores: ${JSON.stringify(scores || {})}
${langMap[language as string] || langMap['en']}
${brandContext}

Make it scroll-stopping. Respond with ONLY JSON.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        temperature: 0.8, max_tokens: 3000,
      }),
    })

    if (!response.ok) return NextResponse.json({ error: 'AI service error' }, { status: 500 })

    const data = await response.json()
    const aiContent = data.choices?.[0]?.message?.content
    if (!aiContent) return NextResponse.json({ error: 'No response from AI' }, { status: 500 })

        let result
    try {
      let cleanContent = aiContent.trim()
      cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '')
      const firstBrace = cleanContent.indexOf('{')
      const lastBrace = cleanContent.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1)
      }
      result = JSON.parse(cleanContent)
    } catch {
      result = { raw: aiContent }
    }

    await saveContent(userId, 'viral-score', content.substring(0, 100), result)

    return NextResponse.json({ result, newBalance: creditResult.newBalance })
  } catch (error) {
    console.error('Viral Score Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
