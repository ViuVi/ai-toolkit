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
    const { content, contentType, platform, goal, userId, language = 'tr' } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })
    }

    // TEST MODE: const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    // TEST MODE: if (!creditCheck.ok) {
      // TEST MODE: return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    // TEST MODE: }

    const systemPrompt = `Sen A/B test ve içerik optimizasyon uzmanısın. Verilen içeriğin 5 farklı versiyonunu oluştur ve karşılaştır.

JSON formatında yanıt ver:
{
  "original_analysis": {
    "strengths": ["Güçlü yön 1", "Güçlü yön 2"],
    "weaknesses": ["Zayıf yön 1", "Zayıf yön 2"],
    "predicted_performance": "Düşük/Orta/İyi"
  },
  "versions": [
    {
      "version": "A",
      "name": "Versiyon adı (örn: Merak Uyandırıcı)",
      "strategy": "Bu versiyonda ne değişti",
      "content": "Tam içerik metni",
      "hook": "Hook kısmı",
      "changes_made": ["Değişiklik 1", "Değişiklik 2"],
      "predicted_score": 85,
      "best_for": "En iyi hangi amaç için",
      "risk_level": "Düşük/Orta/Yüksek"
    },
    {
      "version": "B",
      "name": "Şok Edici",
      "strategy": "Şok faktörü eklendi",
      "content": "Tam içerik metni",
      "hook": "Şok edici hook",
      "changes_made": ["Değişiklik 1", "Değişiklik 2"],
      "predicted_score": 78,
      "best_for": "Viral potansiyel",
      "risk_level": "Orta"
    },
    {
      "version": "C",
      "name": "Hikaye Odaklı",
      "strategy": "Storytelling yaklaşımı",
      "content": "Tam içerik metni",
      "hook": "Hikaye hook",
      "changes_made": ["Değişiklik 1", "Değişiklik 2"],
      "predicted_score": 82,
      "best_for": "Bağ kurma",
      "risk_level": "Düşük"
    },
    {
      "version": "D",
      "name": "Soru Soran",
      "strategy": "Soru ile etkileşim",
      "content": "Tam içerik metni",
      "hook": "Soru hook",
      "changes_made": ["Değişiklik 1", "Değişiklik 2"],
      "predicted_score": 80,
      "best_for": "Yorum almak",
      "risk_level": "Düşük"
    },
    {
      "version": "E",
      "name": "FOMO Yaratan",
      "strategy": "Kaçırma korkusu",
      "content": "Tam içerik metni",
      "hook": "FOMO hook",
      "changes_made": ["Değişiklik 1", "Değişiklik 2"],
      "predicted_score": 88,
      "best_for": "Aksiyon aldırmak",
      "risk_level": "Orta"
    }
  ],
  "comparison_matrix": {
    "engagement_potential": { "A": 85, "B": 78, "C": 82, "D": 80, "E": 88 },
    "viral_potential": { "A": 70, "B": 90, "C": 65, "D": 60, "E": 85 },
    "brand_safety": { "A": 95, "B": 60, "C": 90, "D": 95, "E": 75 },
    "conversion_potential": { "A": 80, "B": 65, "C": 75, "D": 70, "E": 90 }
  },
  "recommendation": {
    "winner": "E",
    "reason": "Neden bu versiyon kazandı",
    "runner_up": "A",
    "test_suggestion": "Gerçek test için öneri"
  },
  "testing_tips": [
    "A/B test ipucu 1",
    "A/B test ipucu 2",
    "A/B test ipucu 3"
  ]
}`

    const userPrompt = `İçerik Tipi: ${contentType || 'Post'}
Platform: ${platform || 'Instagram'}
Hedef: ${goal || 'Etkileşim artırmak'}

ORİJİNAL İÇERİK:
"""
${content}
"""

Bu içeriğin 5 farklı versiyonunu oluştur. Her versiyon farklı bir psikolojik tetikleyici veya strateji kullansın.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.85, maxTokens: 5000 })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // TEST MODE: await deductCredits(supabase, userId, CREDIT_COST)

    return NextResponse.json({ 
      success: true, 
      result: result.data,
      creditsUsed: CREDIT_COST 
    })

  } catch (error: any) {
    console.error('A/B Tester Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
