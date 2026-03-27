import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const GROQ_API_KEY = process.env.GROQ_API_KEY

// Server-side Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TOOL_NAME = 'hook-generator'
const CREDIT_COST = 3

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, tone, language, userId } = await request.json()

    // User ID kontrolü
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Kredi kontrolü ve düşürme
    const { data: userData, error: fetchError } = await supabaseAdmin
      .from('credits')
      .select('balance, plan')
      .eq('user_id', userId)
      .single()

    if (fetchError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Agency plan sınırsız, diğerleri için kredi kontrolü
    if (userData.plan !== 'agency' && userData.balance < CREDIT_COST) {
      return NextResponse.json({ 
        error: 'Yetersiz kredi', 
        code: 'INSUFFICIENT_CREDITS',
        required: CREDIT_COST,
        current: userData.balance
      }, { status: 402 })
    }

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are HookMaster, the world's best viral hook writer. You have written hooks for videos with 1B+ combined views.

HOOK PATTERNS YOU MUST USE:
1. CURIOSITY GAP - Creates "I need to know" feeling
   Example: "Nobody talks about this but..."
2. CONTROVERSIAL - Challenges common beliefs
   Example: "Stop doing this immediately..."
3. STORYTELLING - Opens a narrative loop
   Example: "I was about to quit when..."
4. AUTHORITY - Positions expertise
   Example: "After 10 years I learned..."
5. SHOCK VALUE - Unexpected statement
   Example: "This is why you're failing..."
6. DIRECT BENEFIT - Clear value proposition
   Example: "How to get 10K followers in 30 days"
7. QUESTION - Engages viewer's mind
   Example: "Why does nobody talk about this?"
8. FEAR OF MISSING OUT - Creates urgency
   Example: "Everyone is doing this except you..."

RULES:
- Each hook MUST be under 12 words
- No fluff, no filler words
- Must stop the scroll instantly
- Score based on psychological impact

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
      'tr': 'Write ALL 20 hooks in Turkish. They must sound native, not translated.',
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
- Use ALL 8 pattern types (at least 2 of each)
- Score curiosity_score and virality_score from 1-10
- Keep each hook under 12 words
- Make them scroll-stopping

Respond with ONLY the JSON object, no other text.`

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

    // AI başarılı olduktan sonra krediyi düşür (agency hariç)
    if (userData.plan !== 'agency') {
      const newBalance = userData.balance - CREDIT_COST
      await supabaseAdmin
        .from('credits')
        .update({ 
          balance: newBalance, 
          total_used: (userData.total_used || 0) + CREDIT_COST,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      // Kullanım kaydı
      await supabaseAdmin.from('tool_usage').insert({
        user_id: userId,
        tool_name: TOOL_NAME,
        credits_used: CREDIT_COST
      }).catch(() => {})
    }

    let result
    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch {
      result = { raw: content, hooks: [] }
    }

    return NextResponse.json({ 
      result,
      creditsUsed: userData.plan === 'agency' ? 0 : CREDIT_COST,
      newBalance: userData.plan === 'agency' ? userData.balance : userData.balance - CREDIT_COST
    })
  } catch (error) {
    console.error('Hook Generator Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
