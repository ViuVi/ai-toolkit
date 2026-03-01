import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const HF_API = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct'

export async function POST(request: NextRequest) {
  try {
    const { brandName, contentSamples, targetAudience, industry, userId, language = 'en' } = await request.json()

    if (!brandName || !contentSamples || contentSamples.filter((s: string) => s.trim()).length === 0) {
      return NextResponse.json({ 
        error: language === 'tr' ? 'Marka adı ve içerik örnekleri gerekli' : 'Brand name and content samples required' 
      }, { status: 400 })
    }

    if (userId) {
      const { data: credits } = await supabase.from('credits').select('balance').eq('user_id', userId).single()
      if (!credits || credits.balance < 2) {
        return NextResponse.json({ error: language === 'tr' ? 'Yetersiz kredi' : 'Insufficient credits' }, { status: 403 })
      }
    }

    const samples = contentSamples.filter((s: string) => s.trim()).join('\n\n---\n\n')

    const prompt = language === 'tr'
      ? `Sen marka stratejisti ve içerik analistisin. "${brandName}" markasının içeriklerini analiz et.

${targetAudience ? `Hedef Kitle: ${targetAudience}` : ''}
${industry ? `Sektör: ${industry}` : ''}

İÇERİK ÖRNEKLERİ:
${samples}

Bu içerikleri analiz ederek marka sesini tanımla.

JSON formatında yanıt ver:
{
  "voiceCharacteristics": ["özellik 1", "özellik 2", "özellik 3", "özellik 4"],
  "toneProfile": {
    "primary": "birincil ton",
    "secondary": "ikincil ton",
    "energy": "enerji seviyesi"
  },
  "writingStyle": {
    "formality": "1-10 arası formalite",
    "complexity": "1-10 arası karmaşıklık",
    "warmth": "1-10 arası sıcaklık"
  },
  "personality": ["kişilik 1", "kişilik 2", "kişilik 3"],
  "doList": ["yapın 1", "yapın 2", "yapın 3"],
  "dontList": ["yapmayın 1", "yapmayın 2", "yapmayın 3"],
  "samplePhrases": ["örnek ifade 1", "örnek ifade 2", "örnek ifade 3"],
  "recommendations": ["öneri 1", "öneri 2", "öneri 3"],
  "summary": "Marka sesi özeti (2-3 cümle)"
}`
      : `You are a brand strategist and content analyst. Analyze "${brandName}" brand's content.

${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${industry ? `Industry: ${industry}` : ''}

CONTENT SAMPLES:
${samples}

Analyze these contents and define the brand voice.

Respond in JSON:
{
  "voiceCharacteristics": ["characteristic 1", "characteristic 2", "characteristic 3", "characteristic 4"],
  "toneProfile": {
    "primary": "primary tone",
    "secondary": "secondary tone",
    "energy": "energy level"
  },
  "writingStyle": {
    "formality": "1-10 formality",
    "complexity": "1-10 complexity",
    "warmth": "1-10 warmth"
  },
  "personality": ["personality 1", "personality 2", "personality 3"],
  "doList": ["do 1", "do 2", "do 3"],
  "dontList": ["don't 1", "don't 2", "don't 3"],
  "samplePhrases": ["sample phrase 1", "sample phrase 2", "sample phrase 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "summary": "Brand voice summary (2-3 sentences)"
}`

    const response = await fetch(HF_API, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 1200, temperature: 0.7, return_full_text: false } })
    })

    let analysis: any = null
    if (response.ok) {
      const result = await response.json()
      const text = result[0]?.generated_text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try { analysis = JSON.parse(match[0]) } catch {}
      }
    }

    // Fallback
    if (!analysis) {
      analysis = {
        voiceCharacteristics: language === 'tr' 
          ? ["Otantik", "Samimi", "Profesyonel", "Güvenilir"]
          : ["Authentic", "Friendly", "Professional", "Trustworthy"],
        toneProfile: {
          primary: language === 'tr' ? "Samimi" : "Friendly",
          secondary: language === 'tr' ? "Profesyonel" : "Professional",
          energy: language === 'tr' ? "Orta" : "Medium"
        },
        writingStyle: { formality: "5", complexity: "4", warmth: "7" },
        personality: language === 'tr' 
          ? ["Yardımsever", "Uzman", "Yaklaşılabilir"]
          : ["Helpful", "Expert", "Approachable"],
        doList: language === 'tr'
          ? ["Aktif dil kullanın", "Kişisel hikayeler paylaşın", "Sorularla etkileşim kurun"]
          : ["Use active voice", "Share personal stories", "Engage with questions"],
        dontList: language === 'tr'
          ? ["Jargon kullanmayın", "Aşırı resmi olmayın", "Uzun paragraflardan kaçının"]
          : ["Avoid jargon", "Don't be overly formal", "Skip long paragraphs"],
        samplePhrases: language === 'tr'
          ? [`"${brandName} olarak..."`, `"Sizinle paylaşmak istiyoruz..."`, `"Birlikte başarabiliriz..."`]
          : [`"At ${brandName}, we..."`, `"We want to share with you..."`, `"Together, we can..."`],
        recommendations: language === 'tr'
          ? ["Tutarlılığı koruyun", "Hedef kitlenizle konuşun", "Değer odaklı içerik üretin"]
          : ["Maintain consistency", "Speak to your audience", "Create value-driven content"],
        summary: language === 'tr'
          ? `${brandName}, samimi ama profesyonel bir ses tonuyla hedef kitlesine değer sunmayı amaçlıyor.`
          : `${brandName} aims to deliver value with a friendly yet professional voice.`
      }
    }

    if (userId) {
      const { data: c } = await supabase.from('credits').select('balance, total_used').eq('user_id', userId).single()
      if (c) await supabase.from('credits').update({ balance: c.balance - 2, total_used: c.total_used + 2 }).eq('user_id', userId)
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Brand Voice Error:', error)
    return NextResponse.json({ error: 'Error occurred' }, { status: 500 })
  }
}
