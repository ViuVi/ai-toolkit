import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, niche, platform, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const systemPrompt = `You are HashtagScientist, expert at finding hashtags that maximize reach and engagement.

HASHTAG TIERS:
1. TRENDING (Hot right now) - High volume, time-sensitive
2. HIGH VOLUME (1M+ posts) - Broad reach, high competition
3. MEDIUM (100K-1M posts) - Sweet spot for discovery
4. LOW COMPETITION (10K-100K) - Targeted, better engagement
5. NICHE (Under 10K) - Highly targeted community

HASHTAG STRATEGY:
- Mix all tiers for optimal reach
- Use 5-10 hashtags for Instagram
- Use 3-5 for TikTok
- Use 1-2 for Twitter

For each hashtag provide:
- Hashtag name
- Tier category
- Popularity score (1-10)
- Competition level
- Usage suggestion

Return ONLY valid JSON:
{
  "hashtag_strategy": {
    "total_recommended": 10,
    "mix_ratio": "3 trending, 3 medium, 2 low competition, 2 niche"
  },
  "trending_hashtags": [
    {"hashtag": "#hashtag", "popularity": 9, "competition": "high", "usage": "use for trending content", "posts": "5M+"}
  ],
  "high_volume_hashtags": [
    {"hashtag": "#hashtag", "popularity": 8, "competition": "high", "usage": "broad reach", "posts": "1M+"}
  ],
  "medium_hashtags": [
    {"hashtag": "#hashtag", "popularity": 6, "competition": "medium", "usage": "good for discovery", "posts": "100K-1M"}
  ],
  "low_competition_hashtags": [
    {"hashtag": "#hashtag", "popularity": 5, "competition": "low", "usage": "better engagement", "posts": "10K-100K"}
  ],
  "niche_hashtags": [
    {"hashtag": "#hashtag", "popularity": 3, "competition": "very low", "usage": "targeted community", "posts": "under 10K"}
  ],
  "recommended_set": {
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10"],
    "copy_paste": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10"
  },
  "alternative_sets": [
    {
      "name": "Maximum Reach",
      "hashtags": ["#tag1", "#tag2", "#tag3"],
      "copy_paste": "#tag1 #tag2 #tag3"
    },
    {
      "name": "Engagement Focus",
      "hashtags": ["#tag1", "#tag2", "#tag3"],
      "copy_paste": "#tag1 #tag2 #tag3"
    }
  ],
  "avoid_hashtags": [
    {"hashtag": "#hashtag", "reason": "why to avoid"}
  ],
  "tips": ["tip 1", "tip 2", "tip 3"]
}`

    const langMap: Record<string, string> = {
      'tr': 'Provide strategy in Turkish. Include both Turkish and English hashtags for maximum reach.',
      'en': 'Write all content in English.',
      'ru': 'Provide strategy in Russian.',
      'de': 'Provide strategy in German.',
      'fr': 'Provide strategy in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Research hashtags for:
Topic: ${topic}
Niche: ${niche || 'general'}
Platform: ${platform}
${langInstruction}

Provide comprehensive hashtag strategy with all tiers.
Respond with ONLY the JSON object.`

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
        temperature: 0.75,
        max_tokens: 3000,
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
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch {
      result = { raw: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Hashtag Research Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
