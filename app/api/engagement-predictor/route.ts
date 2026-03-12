import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJSONWithGroq, checkAndDeductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 5

export async function POST(request: NextRequest) {
  try {
    const { content, platform, niche, userId, language = 'en' } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: language === 'tr' ? 'İçerik gerekli' : 'Content required' },
        { status: 400 }
      )
    }

    if (userId) {
      const creditCheck = await checkAndDeductCredits(supabase, userId, CREDIT_COST, language)
      if (!creditCheck.success) {
        return NextResponse.json({ error: creditCheck.error }, { status: 403 })
      }
    }

    const platformInfo = platform || 'Instagram'
    const nicheInfo = niche || 'general'

    const systemPrompt = language === 'tr'
      ? `Sen sosyal medya analisti ve etkileşim uzmanısın.
         İçeriklerin potansiyel performansını analiz ediyorsun.
         Detaylı ve uygulanabilir öneriler sunuyorsun.`
      : `You are a social media analyst and engagement expert.
         You analyze potential performance of content.
         You provide detailed and actionable recommendations.`

    const userPrompt = language === 'tr'
      ? `Şu içeriğin ${platformInfo} platformunda ${nicheInfo} nişinde etkileşim potansiyelini analiz et:

İçerik:
"""
${content}
"""

Şunları değerlendir:
1. Hook kalitesi (ilk izlenim)
2. Değer önerisi
3. CTA etkinliği
4. Görsel/format uyumu
5. Viral potansiyel

JSON formatında yanıt ver:
{
  "analysis": {
    "overall_score": 1-100 arası puan,
    "viral_potential": "düşük/orta/yüksek",
    "predicted_engagement_rate": "tahmini oran",
    "scores": {
      "hook_quality": {"score": 1-10, "feedback": "geri bildirim"},
      "value_proposition": {"score": 1-10, "feedback": "geri bildirim"},
      "cta_effectiveness": {"score": 1-10, "feedback": "geri bildirim"},
      "visual_format": {"score": 1-10, "feedback": "geri bildirim"},
      "viral_elements": {"score": 1-10, "feedback": "geri bildirim"}
    },
    "strengths": ["güçlü yön 1", "güçlü yön 2"],
    "weaknesses": ["zayıf yön 1", "zayıf yön 2"],
    "improvements": [
      {"area": "alan", "suggestion": "öneri", "impact": "etki"}
    ],
    "best_posting_time": "en iyi paylaşım zamanı",
    "hashtag_suggestions": ["hashtag1", "hashtag2"]
  }
}`
      : `Analyze the engagement potential of this content on ${platformInfo} in ${nicheInfo} niche:

Content:
"""
${content}
"""

Evaluate:
1. Hook quality (first impression)
2. Value proposition
3. CTA effectiveness
4. Visual/format fit
5. Viral potential

Respond in JSON format:
{
  "analysis": {
    "overall_score": score from 1-100,
    "viral_potential": "low/medium/high",
    "predicted_engagement_rate": "estimated rate",
    "scores": {
      "hook_quality": {"score": 1-10, "feedback": "feedback"},
      "value_proposition": {"score": 1-10, "feedback": "feedback"},
      "cta_effectiveness": {"score": 1-10, "feedback": "feedback"},
      "visual_format": {"score": 1-10, "feedback": "feedback"},
      "viral_elements": {"score": 1-10, "feedback": "feedback"}
    },
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "improvements": [
      {"area": "area", "suggestion": "suggestion", "impact": "impact"}
    ],
    "best_posting_time": "best posting time",
    "hashtag_suggestions": ["hashtag1", "hashtag2"]
  }
}`

    const result = await generateJSONWithGroq(systemPrompt, userPrompt, {
      temperature: 0.6,
      maxTokens: 2500
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Engagement Predictor Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
