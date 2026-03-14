import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callAI, checkCredits, deductCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 8

export async function POST(request: NextRequest) {
  try {
    const { competitorHandle, platform, niche, userId, language = 'tr' } = await request.json()

    if (!competitorHandle?.trim()) {
      return NextResponse.json({ error: 'Rakip hesap adı gerekli' }, { status: 400 })
    }

    // TEST MODE: const creditCheck = await checkCredits(supabase, userId, CREDIT_COST)
    // TEST MODE: if (!creditCheck.ok) {
      // TEST MODE: return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    // TEST MODE: }

    const systemPrompt = `Sen sosyal medya analisti ve rekabet uzmanısın. Verilen rakip hesabı analiz et ve stratejik öneriler sun.

NOT: Gerçek verilere erişimin yok, ancak bu nişte ve platformda başarılı hesapların genel stratejilerini analiz ederek gerçekçi bir analiz oluştur.

JSON formatında yanıt ver:
{
  "competitor_profile": {
    "handle": "@rakip",
    "estimated_followers": "100K-500K aralığı tahmini",
    "niche": "Niş alanı",
    "account_type": "Creator/Business/Personal",
    "content_style": "İçerik stili açıklaması"
  },
  "content_strategy": {
    "posting_frequency": "Günde/haftada kaç post",
    "best_performing_types": ["Carousel", "Reels", "Stories"],
    "content_pillars": ["Pillar 1", "Pillar 2", "Pillar 3"],
    "tone_of_voice": "Ses tonu analizi",
    "visual_style": "Görsel stil analizi"
  },
  "engagement_analysis": {
    "estimated_engagement_rate": "3-5%",
    "comment_sentiment": "Pozitif/Karışık/Negatif",
    "community_strength": "Güçlü/Orta/Zayıf",
    "response_strategy": "Yorum yanıtlama stratejisi"
  },
  "top_performing_content": [
    {
      "type": "İçerik tipi",
      "topic": "Konu",
      "why_it_works": "Neden işe yarıyor",
      "estimated_engagement": "Tahmini etkileşim"
    }
  ],
  "growth_tactics": [
    { "tactic": "Büyüme taktiği 1", "effectiveness": "Yüksek/Orta" },
    { "tactic": "Büyüme taktiği 2", "effectiveness": "Yüksek/Orta" }
  ],
  "weaknesses": [
    { "weakness": "Zayıf nokta 1", "your_opportunity": "Senin fırsatın" },
    { "weakness": "Zayıf nokta 2", "your_opportunity": "Senin fırsatın" }
  ],
  "what_to_copy": [
    { "element": "Kopyalanabilecek şey", "how_to_adapt": "Nasıl uyarlamalısın" }
  ],
  "what_to_avoid": [
    { "element": "Kaçınılması gereken", "reason": "Neden" }
  ],
  "differentiation_opportunities": [
    "Farklılaşma fırsatı 1",
    "Farklılaşma fırsatı 2",
    "Farklılaşma fırsatı 3"
  ],
  "action_plan": {
    "immediate": ["Hemen yapılacak 1", "Hemen yapılacak 2"],
    "short_term": ["1-2 hafta içinde yapılacak 1", "1-2 hafta içinde yapılacak 2"],
    "long_term": ["1-3 ay içinde yapılacak 1", "1-3 ay içinde yapılacak 2"]
  }
}`

    const userPrompt = `Rakip Hesap: @${competitorHandle.replace('@', '')}
Platform: ${platform || 'Instagram'}
Niş: ${niche || 'Belirtilmedi'}

Bu rakibi analiz et. Bu nişteki başarılı hesapların genel stratejilerini baz alarak detaylı bir rekabet analizi oluştur. Kullanıcıya rakibini geçmesi için uygulanabilir stratejiler sun.`

    const result = await callAI(systemPrompt, userPrompt, { temperature: 0.7 })

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
    console.error('Competitor Spy Error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
