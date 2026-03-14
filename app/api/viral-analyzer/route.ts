import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callAI, checkCredits, deductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 5

export async function POST(request: NextRequest) {
  try {
    const { content, platform, niche, userId, language = 'tr' } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })
    }

    // Kredi kontrolü
    // TEST MODE: const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    // TEST MODE: if (!creditCheck.ok) {
      // TEST MODE: return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    // TEST MODE: }

    const systemPrompt = `Sen viral içerik analistisin. İçeriklerin viral potansiyelini 0-100 arasında puanla ve detaylı analiz yap.

JSON formatında yanıt ver:
{
  "score": 75,
  "verdict": "İyi potansiyel" veya "Viral olabilir" veya "Düşük potansiyel",
  "breakdown": {
    "hook_power": { "score": 85, "analysis": "Hook analizi" },
    "emotional_trigger": { "score": 70, "analysis": "Duygusal tetikleyici analizi" },
    "shareability": { "score": 80, "analysis": "Paylaşılabilirlik analizi" },
    "controversy": { "score": 60, "analysis": "Tartışma potansiyeli" },
    "timing_relevance": { "score": 75, "analysis": "Güncellik analizi" }
  },
  "strengths": ["Güçlü yön 1", "Güçlü yön 2", "Güçlü yön 3"],
  "weaknesses": ["Zayıf yön 1", "Zayıf yön 2"],
  "improvements": [
    { "priority": "high", "suggestion": "Öneri 1", "impact": "+15 puan" },
    { "priority": "medium", "suggestion": "Öneri 2", "impact": "+10 puan" },
    { "priority": "low", "suggestion": "Öneri 3", "impact": "+5 puan" }
  ],
  "best_posting_times": ["09:00-11:00", "19:00-21:00"],
  "predicted_engagement": {
    "likes": "5K-15K",
    "comments": "200-500",
    "shares": "500-2K"
  },
  "similar_viral_content": "Bu tarz içerikler şu dönemde viral oldu: ..."
}`

    const userPrompt = `Platform: ${platform || 'Instagram'}
Niş: ${niche || 'Genel'}

İÇERİK:
"""
${content}
"""

Bu içeriğin viral potansiyelini analiz et.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.6 })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Kredi düş
    // TEST MODE: await deductCredits(supabase, userId, CREDIT_COST)

    return NextResponse.json({ 
      success: true, 
      result: result.data,
      creditsUsed: CREDIT_COST 
    })

  } catch (error: any) {
    console.error('Viral Analyzer Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
