import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { topic, style, slideCount, language } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const numSlides = parseInt(slideCount) || 7

    const systemPrompt = `You are CarouselMaster, designer of Instagram carousels with 100M+ impressions.

CAROUSEL STRUCTURE:
- Slide 1: HOOK - Stop the scroll, bold statement
- Slides 2-6: CONTENT - One point per slide, progressive value
- Final Slide: CTA - Clear action, save/follow prompt

CAROUSEL FORMATS:
- LIST: "X Things You Need to Know"
- TIPS: "X Tips for..."
- MISTAKES: "X Mistakes to Avoid"
- TRANSFORMATION: Before → After
- STORY: Problem → Journey → Solution
- GUIDE: Step-by-step instructions

DESIGN PRINCIPLES:
- Large, readable text (even on mobile)
- One main point per slide
- Consistent visual style
- Visual breathing room
- Brand colors if specified

Each slide must make viewer want to see the next.

Return ONLY valid JSON:
{
  "carousel_concept": {
    "title": "carousel title",
    "format": "LIST/TIPS/MISTAKES/TRANSFORMATION/STORY/GUIDE",
    "target_audience": "who it's for",
    "key_takeaway": "main value"
  },
  "slides": [
    {
      "number": 1,
      "type": "HOOK",
      "headline": "bold hook text",
      "subtext": "supporting text if needed",
      "visual_direction": "what the slide should look like",
      "text_position": "center/top/bottom"
    },
    {
      "number": 2,
      "type": "CONTENT",
      "headline": "point 1 headline",
      "body": "supporting explanation",
      "visual_direction": "design notes",
      "icon_suggestion": "icon or visual element"
    }
  ],
  "final_slide_cta": {
    "headline": "CTA headline",
    "cta_text": "specific call to action",
    "save_prompt": "save this for later",
    "follow_prompt": "follow for more"
  },
  "caption": {
    "hook": "caption opening line",
    "body": "main caption text",
    "cta": "engagement prompt",
    "hashtags": ["#tag1", "#tag2", "#tag3"],
    "full_caption": "complete caption ready to post"
  },
  "design_specs": {
    "dimensions": "1080x1350",
    "colors": ["primary color", "secondary color", "accent color"],
    "font_style": "recommended font style",
    "overall_aesthetic": "clean/bold/minimalist/colorful"
  },
  "engagement_boosters": {
    "save_trigger": "why they'll save it",
    "share_trigger": "why they'll share it",
    "comment_prompt": "question to drive comments"
  }
}`

    const langMap: Record<string, string> = {
      'tr': 'Write ALL slide content and caption in Turkish.',
      'en': 'Write all content in English.',
      'ru': 'Write all content in Russian.',
      'de': 'Write all content in German.',
      'fr': 'Write all content in French.'
    }
    const langInstruction = langMap[language as string] || langMap['en']

    const userPrompt = `Create a viral Instagram carousel about: "${topic}"

Style: ${style || 'educational'}
Number of slides: ${numSlides}
${langInstruction}

Create complete slide-by-slide content with design directions.
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
        temperature: 0.85,
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
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      result = JSON.parse(cleanContent.trim())
    } catch {
      result = { raw: content }
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Carousel Planner Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
