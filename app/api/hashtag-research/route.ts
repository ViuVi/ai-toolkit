import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "HashtagScientist" - a data-driven hashtag strategist who has optimized hashtag strategies for accounts that have gained 50M+ followers combined. You understand exactly how hashtags work in each platform's algorithm.

YOUR HASHTAG MASTERY:

1. THE HASHTAG PYRAMID STRATEGY
   - Tier 1 (Mega): 10M+ posts - brand awareness, low conversion
   - Tier 2 (Large): 1M-10M posts - reach expansion  
   - Tier 3 (Medium): 100K-1M posts - sweet spot for discovery
   - Tier 4 (Niche): 10K-100K posts - highly targeted, best engagement
   - Tier 5 (Micro): Under 10K - own the space, build community

2. PLATFORM-SPECIFIC RULES
   - Instagram: 5-10 strategic hashtags (algorithm changed from 30)
   - TikTok: 3-5 hashtags max, FYP tags less important now
   - YouTube: Tags in description, hashtags in title (max 3)
   - Twitter/X: 1-2 hashtags integrated in text, not listed

3. HASHTAG TYPES
   - Community: Where your audience hangs out
   - Content: What the post is about
   - Trending: Current events and challenges
   - Branded: Your own tags for tracking
   - Location: Geographic targeting

4. STRATEGIC PRINCIPLES
   - Mix tiers for optimal reach + relevance
   - Rotate sets to avoid shadowban patterns
   - Match hashtag intent with content intent
   - Use research-backed tags, not guesses

5. WHAT TO AVOID
   - Banned or flagged hashtags
   - Irrelevant popular tags (hurts algorithm trust)
   - Same set every post (spam signal)
   - Hashtags with bot activity

Analyze in English for accuracy, deliver in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { topic, niche, platform, contentType, language } = await request.json()

    const langInstruction: Record<string, string> = {
      'tr': 'Provide hashtag strategy and explanations in Turkish, but keep hashtags in their most effective language (often English for reach, Turkish for local targeting).',
      'en': 'Provide in English.',
      'ru': 'Provide strategy in Russian, hashtags in optimal language for reach.',
      'de': 'Provide strategy in German, hashtags in optimal language for reach.',
      'fr': 'Provide strategy in French, hashtags in optimal language for reach.'
    }[language] || 'Provide in English.'

    const userPrompt = `Create an optimized hashtag strategy for:

Topic/Content: ${topic}
Niche: ${niche}
Platform: ${platform}
Content Type: ${contentType || 'General post'}

${langInstruction}

DEVELOP COMPREHENSIVE HASHTAG STRATEGY:

Return as JSON:
{
  "primary_hashtag_set": {
    "hashtags": ["#hashtag1", "#hashtag2"],
    "total_count": 8,
    "tier_breakdown": {
      "mega": ["#tag"],
      "large": ["#tag"],
      "medium": ["#tag"],
      "niche": ["#tag"],
      "micro": ["#tag"]
    },
    "copy_paste_ready": "#hashtag1 #hashtag2 #hashtag3..."
  },
  "alternative_sets": [
    {
      "name": "Set B - Higher reach focus",
      "hashtags": ["#tag1", "#tag2"],
      "copy_paste_ready": "..."
    },
    {
      "name": "Set C - Niche engagement focus", 
      "hashtags": ["#tag1", "#tag2"],
      "copy_paste_ready": "..."
    }
  ],
  "trending_hashtags": [
    {
      "hashtag": "#trending",
      "relevance": "How it connects to your content",
      "urgency": "Time-sensitive or evergreen"
    }
  ],
  "community_hashtags": [
    {
      "hashtag": "#community",
      "why": "Why this community matters",
      "engagement_potential": "High/Medium/Low"
    }
  ],
  "avoid_these": [
    {
      "hashtag": "#problematic",
      "reason": "Why to avoid"
    }
  ],
  "branded_hashtag_suggestions": [
    {
      "hashtag": "#YourBrand...",
      "purpose": "What it's for",
      "how_to_build": "Strategy to grow it"
    }
  ],
  "placement_strategy": {
    "where_to_put": "In caption, comment, or both",
    "formatting": "How to format for best results",
    "platform_specific": "Any platform-specific tips"
  },
  "rotation_schedule": {
    "frequency": "How often to change sets",
    "why": "Algorithm reasoning"
  },
  "performance_tracking": {
    "metrics_to_watch": ["Metric 1", "Metric 2"],
    "how_to_optimize": "Iteration strategy"
  },
  "pro_tips": [
    "Expert tip 1",
    "Expert tip 2"
  ]
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
        temperature: 0.75,
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
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content }
    } catch {
      result = { raw: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Hashtag Research Error:', error)
    return NextResponse.json({ error: 'Failed to research hashtags' }, { status: 500 })
  }
}
