import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { decision, userId, language = 'en' } = await request.json()

    if (!decision) {
      return NextResponse.json({ error: 'Decision is required' }, { status: 400 })
    }

    // Kredi kontrolü
    if (userId) {
      const { data: credits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (!credits || credits.balance < 3) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
      }
    }

    console.log('⚖️ Analyzing decision in language:', language)

    // Llama 3.1 ile karar analizi
    const analysis = await analyzeWithLlama(decision, language)

    // Kredi düşür
    if (userId) {
      const { data: currentCredits } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (currentCredits) {
        await supabase
          .from('credits')
          .update({
            balance: currentCredits.balance - 3,
            total_used: currentCredits.total_used + 3,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'decision-helper',
            tool_display_name: language === 'tr' ? 'Karar Yardımcısı' : 'Decision Helper',
            credits_used: 3,
            input_preview: decision.substring(0, 200),
            output_preview: 'Decision analyzed',
          })
      }
    }

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('❌ Decision Helper Error:', error)
    return NextResponse.json({ 
      error: language === 'tr' ? 'Bir hata oluştu' : 'An error occurred' 
    }, { status: 500 })
  }
}

async function analyzeWithLlama(decision: string, language: string): Promise<any> {
  
  const prompt = language === 'tr'
    ? `Karar: "${decision}"

Bu karar için detaylı bir analiz yap. Şu formatı kullan:

SEÇENEKİ: [İlk seçenek açıkça belirt]
ARTILAR:
- [Artı 1]
- [Artı 2]
- [Artı 3]
EKSİLER:
- [Eksi 1]
- [Eksi 2]
RİSK: [Düşük/Orta/Yüksek]

SEÇENEKİI: [İkinci seçenek açıkça belirt]
ARTILAR:
- [Artı 1]
- [Artı 2]
- [Artı 3]
EKSİLER:
- [Eksi 1]
- [Eksi 2]
RİSK: [Düşük/Orta/Yüksek]

ÖNEMLİ FAKTÖRLER:
- [Faktör 1]
- [Faktör 2]

ÖNERİ: [Detaylı önerilen ve mantıklı tavsiye]

DÜŞÜNÜLECEK SORULAR:
1. [Soru 1]
2. [Soru 2]
3. [Soru 3]`
    : `Decision: "${decision}"

Provide a detailed analysis for this decision. Use this format:

OPTION 1: [Clearly state first option]
PROS:
- [Pro 1]
- [Pro 2]
- [Pro 3]
CONS:
- [Con 1]
- [Con 2]
RISK: [Low/Medium/High]

OPTION 2: [Clearly state second option]
PROS:
- [Pro 1]
- [Pro 2]
- [Pro 3]
CONS:
- [Con 1]
- [Con 2]
RISK: [Low/Medium/High]

KEY FACTORS:
- [Factor 1]
- [Factor 2]

RECOMMENDATION: [Detailed and thoughtful advice]

QUESTIONS TO CONSIDER:
1. [Question 1]
2. [Question 2]
3. [Question 3]`

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1500,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Llama API failed')
    }

    const result = await response.json()
    
    // Model yükleniyorsa
    if (result.error && result.error.includes('loading')) {
      console.log('Model loading, waiting...')
      await new Promise(resolve => setTimeout(resolve, 20000))
      return analyzeWithLlama(decision, language) // Retry
    }

    const generatedText = result[0]?.generated_text || result.generated_text || ''
    console.log('Generated analysis:', generatedText.substring(0, 300))
    
    // Parse et
    const analysis = parseAnalysis(generatedText, decision, language)
    return analysis

  } catch (error) {
    console.error('Llama analysis failed:', error)
    return getIntelligentFallback(decision, language)
  }
}

function parseAnalysis(text: string, decision: string, language: string): any {
  const options = extractOptions(decision, language)
  
  // OPTION 1 ve OPTION 2'yi bul
  const opt1Match = text.match(/(?:OPTION 1|SEÇENEKİ):([^\n]+)/i)
  const opt2Match = text.match(/(?:OPTION 2|SEÇENEKİI):([^\n]+)/i)
  
  // PROS/ARTILAR bul
  const prosPattern = language === 'tr'
    ? /ARTILAR:\s*((?:[-•*]\s*.+\n?)+)/gi
    : /PROS:\s*((?:[-•*]\s*.+\n?)+)/gi
  const prosMatches = [...text.matchAll(prosPattern)]
  
  // CONS/EKSİLER bul
  const consPattern = language === 'tr'
    ? /EKSİLER:\s*((?:[-•*]\s*.+\n?)+)/gi
    : /CONS:\s*((?:[-•*]\s*.+\n?)+)/gi
  const consMatches = [...text.matchAll(consPattern)]
  
  // RİSK bul
  const risk1Match = text.match(/RİSK:\s*(Düşük|Orta|Yüksek|Low|Medium|High)/i)
  const risk2Matches = [...text.matchAll(/RİSK:\s*(Düşük|Orta|Yüksek|Low|Medium|High)/gi)]
  
  const optionA = {
    option: opt1Match?.[1]?.trim() || options[0],
    pros: extractBulletPoints(prosMatches[0]?.[1] || ''),
    cons: extractBulletPoints(consMatches[0]?.[1] || ''),
    riskLevel: risk1Match?.[1] || (language === 'tr' ? 'Orta' : 'Medium')
  }
  
  const optionB = {
    option: opt2Match?.[1]?.trim() || options[1],
    pros: extractBulletPoints(prosMatches[1]?.[1] || ''),
    cons: extractBulletPoints(consMatches[1]?.[1] || ''),
    riskLevel: risk2Matches[1]?.[1] || (language === 'tr' ? 'Orta' : 'Medium')
  }
  
  // Eğer parse başarısızsa fallback
  if (optionA.pros.length === 0 && optionB.pros.length === 0) {
    return getIntelligentFallback(decision, language)
  }
  
  return {
    options: [optionA, optionB],
    keyFactors: extractKeyFactors(text, decision, language),
    recommendation: extractRecommendation(text, language),
    questionsToConsider: extractQuestions(text, language)
  }
}

function extractOptions(decision: string, language: string): string[] {
  if (language === 'tr') {
    const patterns = [
      /(.+?)\s+(?:yoksa|veya|ya da|mi|mı)\s+(.+?)(?:\?|$)/i,
      /(.+?)\s+ve\s+(.+?)\s+arasında/i,
    ]
    
    for (const pattern of patterns) {
      const match = decision.match(pattern)
      if (match && match[1] && match[2]) {
        return [match[1].trim(), match[2].trim()]
      }
    }
    
    return ['Seçenek A', 'Seçenek B']
  }
  
  const patterns = [
    /(.+?)\s+(?:or|vs\.?|versus)\s+(.+?)(?:\?|$)/i,
    /between\s+(.+?)\s+and\s+(.+?)(?:\?|$)/i,
    /should\s+i\s+(.+?)\s+or\s+(.+?)(?:\?|$)/i
  ]
  
  for (const pattern of patterns) {
    const match = decision.match(pattern)
    if (match && match[1] && match[2]) {
      return [match[1].trim(), match[2].trim()]
    }
  }
  
  return ['Option A', 'Option B']
}

function extractBulletPoints(text: string): string[] {
  if (!text) return []
  return text
    .split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 5)
    .slice(0, 5)
}

function extractKeyFactors(text: string, decision: string, language: string): string[] {
  const factorPattern = language === 'tr'
    ? /(?:ÖNEMLİ FAKTÖRLER|FAKTÖRLER):\s*((?:[-•*]\s*.+\n?)+)/i
    : /(?:KEY FACTORS|FACTORS):\s*((?:[-•*]\s*.+\n?)+)/i
  
  const match = text.match(factorPattern)
  if (match) {
    const factors = extractBulletPoints(match[1])
    if (factors.length > 0) return factors.slice(0, 4)
  }
  
  // Akıllı fallback - içeriğe göre faktörler üret
  const keywords = {
    money: language === 'tr' ? '💰 Finansal etki önemli' : '💰 Financial impact matters',
    career: language === 'tr' ? '💼 Kariyer gelişimi söz konusu' : '💼 Career development at stake',
    time: language === 'tr' ? '⏰ Zaman faktörü kritik' : '⏰ Timing is critical',
    family: language === 'tr' ? '👨‍👩‍👧 Aile ve ilişkiler etkileniyor' : '👨‍👩‍👧 Family and relationships affected'
  }
  
  const factors = []
  const lowerDecision = decision.toLowerCase()
  
  if (lowerDecision.match(/para|maaş|ücret|money|salary|cost/)) factors.push(keywords.money)
  if (lowerDecision.match(/iş|kariyer|job|career|work/)) factors.push(keywords.career)
  if (lowerDecision.match(/zaman|süre|time|deadline/)) factors.push(keywords.time)
  if (lowerDecision.match(/aile|family|relationship/)) factors.push(keywords.family)
  
  return factors.length > 0 ? factors : [
    language === 'tr' ? '🎯 Uzun vadeli hedeflerinizi düşünün' : '🎯 Consider long-term goals',
    language === 'tr' ? '⚖️ Artı ve eksileri dengeleyin' : '⚖️ Balance pros and cons'
  ]
}

function extractRecommendation(text: string, language: string): string {
  const recPattern = language === 'tr'
    ? /(?:ÖNERİ|TAVSİYE):\s*(.+?)(?:\n\n|DÜŞÜNÜLECEK|$)/is
    : /(?:RECOMMENDATION|ADVICE):\s*(.+?)(?:\n\n|QUESTIONS|$)/is
  
  const match = text.match(recPattern)
  if (match && match[1] && match[1].length > 20) {
    return match[1].trim()
  }
  
  return language === 'tr'
    ? 'Her iki seçeneği de dikkatlice değerlendirin. Uzun vadeli hedeflerinizle en çok örtüşen ve denemeden pişman olacağınız seçeneği tercih edin. Çoğu karar geri alınabilir - önemli olan harekete geçmektir.'
    : 'Carefully evaluate both options. Choose the one that aligns most with your long-term goals and that you would regret not trying. Most decisions are reversible - what matters is taking action.'
}

function extractQuestions(text: string, language: string): string[] {
  const questionPattern = /\d+\.\s+(.+?\?)/g
  const matches = [...text.matchAll(questionPattern)]
  
  const questions = matches
    .map(m => m[1].trim())
    .slice(0, 5)
  
  if (questions.length >= 3) {
    return questions
  }
  
  return language === 'tr'
    ? [
        'İç sesiniz ne diyor?',
        '5 yıl sonra hangi seçeneği denememiş olmaktan pişman olursunuz?',
        'Her seçenekte en çok neden korkuyorsunuz?',
        'En yakın arkadaşınıza ne tavsiye ederdiniz?'
      ]
    : [
        'What does your gut tell you?',
        'Which option would you regret not trying in 5 years?',
        'What are you most afraid of with each option?',
        'What would you advise your best friend?'
      ]
}

function getIntelligentFallback(decision: string, language: string): any {
  const options = extractOptions(decision, language)
  const lowerDecision = decision.toLowerCase()
  
  // İçerik analizi yap
  const isCareerRelated = lowerDecision.match(/iş|kariyer|job|career|work|company/)
  const isMoneyRelated = lowerDecision.match(/para|maaş|money|salary|income/)
  const isRiskyContext = lowerDecision.match(/risk|startup|girişim|change/)
  
  if (language === 'tr') {
    const optionAPros = isCareerRelated 
      ? ['Kariyer gelişimi fırsatı', 'Yeni beceriler kazanma', 'Profesyonel ağ genişletme', 'Deneyim kazanımı']
      : ['Yeni deneyimler sunar', 'Kişisel gelişim fırsatı', 'Uzun vadeli kazanımlar', 'Hedeflerinizle uyumlu olabilir']
    
    const optionBPros = isMoneyRelated
      ? ['Finansal güvenlik', 'Sabit gelir', 'Öngörülebilir', 'Düşük stres']
      : ['Alternatif bakış açısı', 'Farklı fırsatlar', 'Yeni bir başlangıç', 'Değişim şansı']
    
    return {
      options: [
        {
          option: options[0],
          pros: optionAPros,
          cons: ['Adaptasyon süreci gerekir', 'Belirsizlik içerir', 'Zaman ve enerji yatırımı'],
          riskLevel: isRiskyContext ? 'Yüksek' : 'Orta'
        },
        {
          option: options[1],
          pros: optionBPros,
          cons: ['Konfor alanından çıkmayı gerektirir', 'Sonuçlar garanti değil', 'Fırsat maliyeti var'],
          riskLevel: 'Orta'
        }
      ],
      keyFactors: extractKeyFactors('', decision, language),
      recommendation: 'Her iki seçeneği de dikkatlice değerlendirin. Uzun vadeli hedeflerinizle en çok örtüşen seçeneği tercih edin. Unutmayın: Çoğu karar geri alınabilir ve "yanlış" bir seçimden ders çıkarmak hareketsizlikten daha iyidir.',
      questionsToConsider: [
        'İç sesiniz ne diyor?',
        '5 yıl sonra hangi seçeneği denememiş olmaktan pişman olursunuz?',
        'Her seçenekte en çok neden korkuyorsunuz?',
        'En yakın arkadaşınıza bu durumda ne tavsiye ederdiniz?'
      ]
    }
  }
  
  // English fallback
  const optionAPros = isCareerRelated
    ? ['Career advancement opportunity', 'Develop new skills', 'Expand professional network', 'Gain valuable experience']
    : ['Opens new experiences', 'Personal growth opportunity', 'Long-term benefits potential', 'May align with goals']
  
  const optionBPros = isMoneyRelated
    ? ['Financial security', 'Stable income', 'Predictable path', 'Lower stress']
    : ['Alternative perspective', 'Different opportunities', 'Fresh start', 'Chance for change']
  
  return {
    options: [
      {
        option: options[0],
        pros: optionAPros,
        cons: ['Requires adaptation period', 'Involves uncertainty', 'Time and energy investment needed'],
        riskLevel: isRiskyContext ? 'High' : 'Medium'
      },
      {
        option: options[1],
        pros: optionBPros,
        cons: ['Requires leaving comfort zone', 'Results not guaranteed', 'Opportunity cost exists'],
        riskLevel: 'Medium'
      }
    ],
    keyFactors: extractKeyFactors('', decision, language),
    recommendation: 'Carefully evaluate both options. Choose the one that aligns most with your long-term goals. Remember: Most decisions are reversible, and learning from a "wrong" choice is better than inaction.',
    questionsToConsider: [
      'What does your gut tell you?',
      'Which option would you regret not trying in 5 years?',
      'What are you most afraid of with each option?',
      'What would you advise your best friend in this situation?'
    ]
  }
}