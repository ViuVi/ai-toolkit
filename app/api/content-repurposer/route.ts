import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "RepurposeGuru" - a content multiplication expert who helps creators get 10x the value from every piece of content. You've helped creators turn single videos into 50+ pieces of content across platforms.

YOUR REPURPOSING PHILOSOPHY:
"Create once, distribute forever" - Every piece of content is a seed that can grow into a content forest.

THE REPURPOSING MATRIX:

1. FORMAT TRANSFORMATION
   - Long-form → Short clips
   - Video → Audio (podcast)
   - Video → Text (blog, thread)
   - Text → Visual (carousel, infographic)
   - Live → Edited highlights

2. PLATFORM OPTIMIZATION
   - Same content, platform-native format
   - Aspect ratio adjustments
   - Caption style changes
   - Hook modifications per platform

3. ANGLE MULTIPLICATION
   - Same topic, different perspective
   - Same content, different audience
   - Same story, different lesson
   - Same data, different visualization

4. TEMPORAL REPURPOSING
   - Evergreen refresh with new intro
   - Seasonal re-angles
   - Trend-jacking old content
   - Anniversary/throwback content

5. DEPTH VARIATIONS
   - Overview → Deep dive series
   - Deep content → Quick tips
   - Tutorial → Behind-the-scenes
   - Results → Process breakdown

QUALITY PRINCIPLES:
- Each repurposed piece must stand alone
- Add value, don't just resize
- Platform-native feel is essential
- Update hooks for each format

Think creatively in English, deliver repurposing strategies in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { originalContent, contentType, targetPlatforms, language } = await request.json()

    const langInstruction = {
      'tr': 'Provide all repurposed content variations in fluent Turkish.',
      'en': 'Provide in English.',
      'ru': 'Provide all content in fluent Russian.',
      'de': 'Provide all content in fluent German.',
      'fr': 'Provide all content in fluent French.'
    }[language] || 'Provide in English.'

    const userPrompt = `Repurpose this content into multiple formats:

ORIGINAL CONTENT:
"""
${originalContent}
"""

Original Type: ${contentType}
Target Platforms: ${targetPlatforms}

${langInstruction}

CREATE A COMPLETE REPURPOSING STRATEGY:

Return as JSON:
{
  "content_analysis": {
    "core_message": "The main takeaway",
    "key_points": ["Point 1", "Point 2", "Point 3"],
    "emotional_hook": "The emotional appeal",
    "repurpose_potential": "High/Medium/Low with explanation"
  },
  "repurposed_content": [
    {
      "format": "Short-form video (TikTok/Reels)",
      "platform": "TikTok, Instagram Reels",
      "hook": "New hook for this format",
      "script": "Complete script for this version",
      "duration": "Target duration",
      "visual_notes": "What to show",
      "cta": "Call to action"
    },
    {
      "format": "Twitter/X Thread",
      "platform": "Twitter/X",
      "thread": [
        "Tweet 1 (hook)",
        "Tweet 2",
        "Tweet 3",
        "Tweet 4 (CTA)"
      ],
      "engagement_hooks": "Questions or polls to add"
    },
    {
      "format": "Instagram Carousel",
      "platform": "Instagram",
      "slides": [
        {"slide": 1, "headline": "Hook slide", "content": "Text"},
        {"slide": 2, "headline": "Point 1", "content": "Text"}
      ],
      "caption": "Carousel caption",
      "cta_slide": "Final slide CTA"
    },
    {
      "format": "LinkedIn Post",
      "platform": "LinkedIn",
      "post": "Full LinkedIn post text",
      "formatting_notes": "Line breaks, emojis usage"
    },
    {
      "format": "YouTube Shorts",
      "platform": "YouTube",
      "title": "Shorts title",
      "script": "Shorts script",
      "thumbnail_text": "Text overlay idea"
    },
    {
      "format": "Blog/Article Outline",
      "platform": "Website/Medium",
      "title": "Article title",
      "sections": ["Section 1", "Section 2"],
      "seo_keywords": ["keyword1", "keyword2"]
    }
  ],
  "clip_extraction": [
    {
      "clip_name": "Clip 1",
      "timestamp": "If applicable",
      "standalone_hook": "Hook for this clip",
      "best_platform": "Where to post"
    }
  ],
  "quote_graphics": [
    {
      "quote": "Quotable line from content",
      "visual_style": "Suggested design style",
      "platforms": ["Instagram", "Pinterest"]
    }
  ],
  "audio_repurposing": {
    "podcast_clip": "How to use as audio content",
    "audiogram_text": "Text overlay for audiogram"
  },
  "scheduling_strategy": {
    "order": "Which to post first and why",
    "spacing": "Time between repurposed posts",
    "cross_promotion": "How pieces link together"
  },
  "evergreen_potential": {
    "refresh_ideas": ["How to update later"],
    "seasonal_angles": ["Seasonal variations"]
  }
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
        max_tokens: 4000,
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
    console.error('Content Repurposer Error:', error)
    return NextResponse.json({ error: 'Failed to repurpose content' }, { status: 500 })
  }
}
