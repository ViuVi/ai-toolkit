import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { callGroqAI, parseJSONResponse, checkCredits } from '@/lib/groq'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CREDIT_COST = 2

export async function POST(request: NextRequest) {
  try {
    const { brandName, contentSamples, targetAudience, industry, userId, language = 'en' } = await request.json()

    if (!brandName || !contentSamples || contentSamples.filter((s: string) => s.trim()).length === 0) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Marka adı ve içerik örnekleri gerekli' : 'Brand name and content samples required' 
      }, { status: 400 })
    }

    const creditCheck = await checkCredits(supabase, userId, CREDIT_COST, language)
    if (!creditCheck.ok) {
      return NextResponse.json({ error: creditCheck.error }, { status: 403 })
    }

    const samples = contentSamples.filter((s: string) => s.trim()).join('\n\n---\n\n')

    const systemPrompt = language === 'tr'
      ? `Sen marka stratejisti ve içerik analistisin. Marka sesini analiz ediyorsun. Sadece JSON formatında yanıt ver.`
      : `You are a brand strategist and content analyst. You analyze brand voice. Respond only in JSON format.`

    const userPrompt = language === 'tr'
      ? `"${brandName}" markasının içeriklerini analiz et.
${targetAudience ? 'Hedef Kitle: ' + targetAudience : ''}
${industry ? 'Sektör: ' + industry : ''}

İçerik örnekleri:
${samples}

JSON formatında yanıt ver:
{
  "brandVoice": {
    "tone": "marka tonu açıklaması",
    "personality": ["kişilik özelliği 1", "kişilik özelliği 2"],
    "vocabulary": ["sık kullanılan kelimeler"],
    "doList": ["yapılması gerekenler"],
    "dontList": ["yapılmaması gerekenler"],
    "examplePhrases": ["örnek cümle 1", "örnek cümle 2"]
  }
}

Sadece JSON döndür.`
      : `Analyze the content of "${brandName}" brand.
${targetAudience ? 'Target Audience: ' + targetAudience : ''}
${industry ? 'Industry: ' + industry : ''}

Content samples:
${samples}

Respond in JSON format:
{
  "brandVoice": {
    "tone": "brand tone description",
    "personality": ["personality trait 1", "personality trait 2"],
    "vocabulary": ["frequently used words"],
    "doList": ["things to do"],
    "dontList": ["things to avoid"],
    "examplePhrases": ["example phrase 1", "example phrase 2"]
  }
}

Return only JSON.`

    const aiResponse = await callGroqAI(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 2000
    })

    const parsed = parseJSONResponse(aiResponse)

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Brand Voice Error:', error)
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 })
  }
}
