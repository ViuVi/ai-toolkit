import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

const SYSTEM_PROMPT = `You are "CarouselMaster" - the designer behind Instagram carousels that have generated 100M+ impressions. You understand the psychology of swipe behavior and how to create carousels that get saved, shared, and drive followers.

YOUR CAROUSEL ARCHITECTURE:

1. THE HOOK SLIDE (Slide 1)
   - This is your thumbnail - it must STOP the scroll
   - Bold statement, intriguing question, or pattern interrupt
   - Minimal text, maximum impact
   - Promise value that requires swiping

2. THE VALUE SLIDES (Slides 2-8)
   - One clear point per slide
   - Consistent visual rhythm
   - Each slide earns the next swipe
   - Mix of text and visual breathing room

3. THE PAYOFF SLIDE (Second-to-last)
   - Deliver the promised value
   - The "aha moment"
   - Shareable insight

4. THE CTA SLIDE (Final)
   - Clear action to take
   - Save prompt (increases algorithm favor)
   - Follow prompt
   - Engagement question

CAROUSEL PSYCHOLOGY:
- Swipe = micro-commitment = invested reader
- Saved carousels = algorithm gold
- Educational carousels outperform inspirational
- Numbered lists create completion desire
- "Swipe for more" is implicit, don't overuse

VISUAL PRINCIPLES:
- Consistent color palette
- Readable fonts (even on mobile)
- White space is your friend
- Brand elements subtle but present

HIGH-PERFORMING FORMATS:
- "X Things You Need to Know"
- "Stop Doing This, Start Doing That"
- "The Complete Guide to..."
- "Mistakes I Made So You Don't Have To"
- "Save This For Later"

Think strategically in English, deliver carousel content in user's language.`

export async function POST(request: NextRequest) {
  try {
    const { topic, style, slideCount, language } = await request.json()

    const langInstruction = {
      'tr': 'Create all carousel slide content in fluent Turkish. Make it sound native and engaging.',
      'en': 'Create in English.',
      'ru': 'Create all content in fluent Russian.',
      'de': 'Create all content in fluent German.',
      'fr': 'Create all content in fluent French.'
    }[language] || 'Create in English.'

    const userPrompt = `Design a high-converting Instagram carousel about:

Topic: ${topic}
Style: ${style || 'Educational'}
Number of Slides: ${slideCount || '8'}

${langInstruction}

CREATE A COMPLETE CAROUSEL:

Return as JSON:
{
  "carousel_concept": {
    "hook_angle": "The main angle/promise",
    "target_audience": "Who this is for",
    "desired_action": "What viewers should do after",
    "save_worthiness": "Why someone would save this"
  },
  "slides": [
    {
      "slide_number": 1,
      "type": "Hook",
      "headline": "Main text (big, bold)",
      "subtext": "Supporting text if any",
      "visual_direction": "Design notes",
      "psychology": "Why this works as hook"
    },
    {
      "slide_number": 2,
      "type": "Value",
      "headline": "Point 1 headline",
      "body_text": "Explanation text",
      "visual_direction": "Design notes",
      "swipe_motivation": "Why they'll swipe to next"
    }
  ],
  "caption": {
    "hook_line": "Caption opening that complements carousel",
    "body": "Caption body text",
    "cta": "Call to action",
    "full_caption": "Complete ready-to-paste caption"
  },
  "hashtags": ["#hashtag1", "#hashtag2"],
  "design_specs": {
    "recommended_dimensions": "1080x1350 or 1080x1080",
    "color_palette": ["#color1", "#color2"],
    "font_recommendations": {
      "headlines": "Font style for headlines",
      "body": "Font style for body"
    },
    "visual_style": "Overall aesthetic direction"
  },
  "alternative_hooks": [
    {
      "hook": "Alternative hook slide",
      "angle": "Different approach"
    }
  ],
  "engagement_boosters": {
    "save_prompt": "Text to encourage saves",
    "share_prompt": "Text to encourage shares",
    "comment_prompt": "Question to drive comments"
  },
  "posting_strategy": {
    "best_time": "Recommended posting time",
    "story_support": "Story to post alongside",
    "engagement_window": "When to engage with comments"
  },
  "series_potential": {
    "follow_up_ideas": ["Related carousel 1", "Related carousel 2"],
    "series_name": "If this becomes a series"
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
        max_tokens: 3500,
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
    console.error('Carousel Planner Error:', error)
    return NextResponse.json({ error: 'Failed to create carousel' }, { status: 500 })
  }
}
