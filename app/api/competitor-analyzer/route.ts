import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callGroqAI, parseJSONResponse, checkCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 5

export async function POST(request: NextRequest) {
  try {
    const { competitors, yourBrand, industry, userId, language = 'en' } = await request.json()

    if (!competitors || competitors.length === 0) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Rakip bilgisi gerekli' : 'Competitor information required' 
      }, { status: 400 })
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const competitorList = competitors.join(', ')

    const systemPrompt = language === 'tr'
      ? `Sen rekabet analisti ve strateji uzmanısın. Rakip analizleri yapıyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a competitive analyst and strategy expert. You perform competitor analysis. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `${yourBrand ? yourBrand + ' için ' : ''}${industry || 'genel'} sektöründe şu rakipleri analiz et: ${competitorList}

JSON formatında yanıt ver:
{
  "analysis": {
    "competitors": [
      {"name": "rakip adı", "strengths": ["güçlü yön"], "weaknesses": ["zayıf yön"], "strategy": "strateji özeti"}
    ],
    "opportunities": ["fırsat 1", "fırsat 2"],
    "threats": ["tehdit 1", "tehdit 2"],
    "recommendations": ["öneri 1", "öneri 2"],
    "differentiators": ["farklılaşma noktası 1", "farklılaşma noktası 2"]
  }
}

Sadece JSON döndür.`
      : `Analyze these competitors ${yourBrand ? 'for ' + yourBrand : ''} in ${industry || 'general'} industry: ${competitorList}

Respond in JSON format:
{
  "analysis": {
    "competitors": [
      {"name": "competitor name", "strengths": ["strength"], "weaknesses": ["weakness"], "strategy": "strategy summary"}
    ],
    "opportunities": ["opportunity 1", "opportunity 2"],
    "threats": ["threat 1", "threat 2"],
    "recommendations": ["recommendation 1", "recommendation 2"],
    "differentiators": ["differentiation point 1", "differentiation point 2"]
  }
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 2500
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Competitor Analyzer Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
