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

    // Karar analizi yap
    const analysis = analyzeDecision(decision, language)

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
            tool_display_name: 'Decision Helper',
            credits_used: 3,
            input_preview: decision.substring(0, 200),
            output_preview: 'Decision analyzed',
          })
      }
    }

    return NextResponse.json({ analysis })

  } catch (error) {
    console.log('❌ Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}

function analyzeDecision(decision: string, language: string): any {
  const decisionLower = decision.toLowerCase()
  
  // Seçenekleri tespit et
  const options = extractOptions(decision, language)
  
  // Her seçenek için farklı artı/eksiler
  const optionAnalysis = options.map((option, index) => ({
    option,
    pros: generatePros(option, decisionLower, language, index),
    cons: generateCons(option, decisionLower, language, index),
    riskLevel: assessRisk(decisionLower, index, language),
  }))

  // Genel analiz
  const factors = analyzeFactors(decisionLower, language)
  const recommendation = generateRecommendation(options, decisionLower, language)
  const questions = generateClarifyingQuestions(language)

  return {
    options: optionAnalysis,
    keyFactors: factors,
    recommendation,
    questionsToConsider: questions,
  }
}

function extractOptions(decision: string, language: string): string[] {
  // Türkçe kalıplar
  if (language === 'tr') {
    const yoksa = decision.match(/(.+?)\s+(?:yoksa|veya|ya da|mi yoksa|mı yoksa)\s+(.+?)(?:\?|$)/i)
    const arasinda = decision.match(/(.+?)\s+(?:arasında|arasında karar|seçmek)\s+(.+?)(?:\?|$)/i)
    const mi = decision.match(/(.+?)\s+(?:mı|mi|mu|mü)\s+(.+?)(?:\?|$)/i)
    
    if (yoksa) return [yoksa[1].trim(), yoksa[2].trim()]
    if (arasinda) return [arasinda[1].trim(), arasinda[2].trim()]
    if (mi) return [mi[1].trim(), mi[2].trim()]
    
    // Genel ayrıştırma
    const parts = decision.split(/(?:yoksa|veya|ya da|mı|mi|arasında)/i).filter(p => p.trim().length > 3)
    if (parts.length >= 2) return [parts[0].trim(), parts[1].trim()]
    
    return [
      decision.length > 50 ? decision.substring(0, 50) + '...' : decision,
      'Alternatif seçenek'
    ]
  }
  
  // İngilizce kalıplar
  const orMatch = decision.match(/(.+?)\s+(?:or|vs\.?|versus)\s+(.+?)(?:\?|$)/i)
  const betweenMatch = decision.match(/between\s+(.+?)\s+and\s+(.+?)(?:\?|$)/i)
  const shouldMatch = decision.match(/should\s+i\s+(.+?)\s+or\s+(.+?)(?:\?|$)/i)
  
  if (orMatch) return [orMatch[1].trim(), orMatch[2].trim()]
  if (betweenMatch) return [betweenMatch[1].trim(), betweenMatch[2].trim()]
  if (shouldMatch) return [shouldMatch[1].trim(), shouldMatch[2].trim()]
  
  return [
    decision.length > 50 ? decision.substring(0, 50) + '...' : decision,
    'The alternative option'
  ]
}

function generatePros(option: string, context: string, language: string, optionIndex: number): string[] {
  const shuffle = <T>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5)
  
  if (language === 'tr') {
    const prosPool = [
      // İş/Kariyer
      ...(context.includes('iş') || context.includes('kariyer') || context.includes('şirket') ? [
        'Kariyer gelişimi fırsatı sunar',
        'Yeni beceriler kazanma imkanı',
        'Profesyonel ağını genişletir',
        'Gelir artışı potansiyeli var',
        'Sektör deneyimi kazandırır',
      ] : []),
      // Eğitim
      ...(context.includes('üniversite') || context.includes('eğitim') || context.includes('yüksek lisans') ? [
        'Akademik bilgi birikimi sağlar',
        'Uzun vadeli kariyer avantajı',
        'Uzmanlık alanı geliştirme',
        'Networking fırsatları',
      ] : []),
      // Genel
      'Bu seçenek yeni deneyimler sunar',
      'Kişisel gelişim fırsatı barındırır',
      'Uzun vadeli kazanımlar sağlayabilir',
      'Risk-kazanç dengesi makul görünüyor',
      'Hedeflerinle uyumlu olabilir',
      'Değişim için iyi bir başlangıç noktası',
    ]
    
    // Her seçenek için farklı artılar
    const selectedPros = shuffle(prosPool)
    return optionIndex === 0 
      ? selectedPros.slice(0, 4)
      : selectedPros.slice(4, 8)
  }
  
  // English
  const prosPoolEN = [
    ...(context.includes('job') || context.includes('career') || context.includes('work') ? [
      'Offers career advancement opportunities',
      'Chance to develop new skills',
      'Expands professional network',
      'Potential for income growth',
      'Builds industry experience',
    ] : []),
    ...(context.includes('business') || context.includes('startup') || context.includes('company') ? [
      'Potential for significant returns',
      'Building something of your own',
      'Learning entrepreneurship firsthand',
      'Freedom and flexibility',
    ] : []),
    'Opens doors to new experiences',
    'Opportunity for personal growth',
    'Potential long-term benefits',
    'Reasonable risk-reward balance',
    'Aligns with your stated goals',
    'Good starting point for change',
    'Could lead to unexpected opportunities',
  ]
  
  const selectedPros = shuffle(prosPoolEN)
  return optionIndex === 0 
    ? selectedPros.slice(0, 4)
    : selectedPros.slice(4, 8)
}

function generateCons(option: string, context: string, language: string, optionIndex: number): string[] {
  const shuffle = <T>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5)
  
  if (language === 'tr') {
    const consPool = [
      ...(context.includes('iş') || context.includes('kariyer') ? [
        'Adaptasyon süreci gerektirir',
        'Mevcut ilişkileri bırakmak zor olabilir',
        'Öğrenme eğrisi var',
        'Başlangıçta belirsizlik yaşanabilir',
      ] : []),
      'Zaman ve enerji yatırımı gerektirir',
      'Konfor alanından çıkmayı gerektirir',
      'Sonuçlar garanti değil',
      'Fırsat maliyeti göz önünde bulundurulmalı',
      'Başlangıç zorlukları olabilir',
      'Bazı fedakarlıklar gerektirebilir',
      'Planlama ve hazırlık gerektirir',
    ]
    
    const selectedCons = shuffle(consPool)
    return optionIndex === 0 
      ? selectedCons.slice(0, 3)
      : selectedCons.slice(3, 6)
  }
  
  // English
  const consPoolEN = [
    ...(context.includes('job') || context.includes('career') ? [
      'Requires adjustment period',
      'Leaving familiar relationships',
      'Learning curve challenges',
      'Initial uncertainty expected',
    ] : []),
    'Requires time and energy investment',
    'Stepping out of comfort zone',
    'Results are not guaranteed',
    'Opportunity cost to consider',
    'Initial challenges expected',
    'May require some sacrifices',
    'Needs planning and preparation',
    'Potential stress during transition',
  ]
  
  const selectedCons = shuffle(consPoolEN)
  return optionIndex === 0 
    ? selectedCons.slice(0, 3)
    : selectedCons.slice(3, 6)
}

function assessRisk(context: string, optionIndex: number, language: string): string {
  const risks = language === 'tr' 
    ? ['Düşük', 'Orta', 'Yüksek']
    : ['Low', 'Medium', 'High']
  
  // Bağlama göre risk değerlendirmesi
  if (context.includes('safe') || context.includes('stable') || context.includes('güvenli') || context.includes('kalmalı')) {
    return optionIndex === 0 ? risks[0] : risks[1]
  }
  if (context.includes('risky') || context.includes('startup') || context.includes('riskli') || context.includes('girişim')) {
    return optionIndex === 0 ? risks[2] : risks[1]
  }
  
  // Farklı seçeneklere farklı risk ata
  return optionIndex === 0 ? risks[1] : risks[Math.floor(Math.random() * 3)]
}

function analyzeFactors(decision: string, language: string): string[] {
  const factors = []
  
  if (language === 'tr') {
    if (decision.includes('para') || decision.includes('maaş') || decision.includes('ücret') || decision.includes('gelir')) {
      factors.push('💰 Finansal etki önemli bir faktör')
    }
    if (decision.includes('aile') || decision.includes('ilişki') || decision.includes('eş') || decision.includes('çocuk')) {
      factors.push('👨‍👩‍👧 Aile ve ilişkiler bu kararda rol oynuyor')
    }
    if (decision.includes('kariyer') || decision.includes('iş') || decision.includes('meslek')) {
      factors.push('💼 Kariyer yörüngesi söz konusu')
    }
    if (decision.includes('zaman') || decision.includes('süre') || decision.includes('hız')) {
      factors.push('⏰ Zamanlama önemli bir faktör')
    }
    if (decision.includes('sağlık') || decision.includes('stres') || decision.includes('mutluluk')) {
      factors.push('🏥 Sağlık ve esenlik göz önünde')
    }
    
    if (factors.length === 0) {
      factors.push('🎯 Bu önemli bir yaşam kararı gibi görünüyor')
      factors.push('⚖️ Birden fazla faktör değerlendirilmeli')
    }
  } else {
    if (decision.includes('money') || decision.includes('salary') || decision.includes('income') || decision.includes('cost')) {
      factors.push('💰 Financial impact is a key consideration')
    }
    if (decision.includes('family') || decision.includes('relationship') || decision.includes('partner') || decision.includes('spouse')) {
      factors.push('👨‍👩‍👧 Family and relationships are involved')
    }
    if (decision.includes('career') || decision.includes('job') || decision.includes('work') || decision.includes('profession')) {
      factors.push('💼 Career trajectory is at stake')
    }
    if (decision.includes('time') || decision.includes('deadline') || decision.includes('urgent')) {
      factors.push('⏰ Timing is a factor')
    }
    if (decision.includes('health') || decision.includes('stress') || decision.includes('happiness') || decision.includes('wellbeing')) {
      factors.push('🏥 Health and wellbeing considerations')
    }
    
    if (factors.length === 0) {
      factors.push('🎯 This appears to be a significant life decision')
      factors.push('⚖️ Multiple factors need to be weighed')
    }
  }
  
  return factors
}

function generateRecommendation(options: string[], context: string, language: string): string {
  if (language === 'tr') {
    return `Açıklamanıza dayanarak, bu karar ${options.length} ana seçenek arasında bir tercih gerektiriyor.

**Şunu seçmeyi düşünün:**
1. Uzun vadeli hedeflerinizle en çok örtüşen seçeneği
2. Denemeden pişman olacağınız seçeneği
3. Sonuç ne olursa olsun en çok öğrenme fırsatı sunan seçeneği

**Kendinize sorun:**
"En yakın arkadaşım bu durumda olsa ona ne tavsiye ederdim?"

**Unutmayın:** Çoğu karar geri alınabilir. Hareketsizliğin maliyeti genellikle "yanlış" bir seçim yapıp ondan ders çıkarmanın maliyetinden daha yüksektir.

Mükemmel karar diye bir şey yoktur - sadece o anki en iyi kararınız vardır.`
  }

  return `Based on your description, this decision involves weighing ${options.length} main options.

**Consider choosing the option that:**
1. Aligns most closely with your long-term goals
2. You would regret NOT trying more than failing at
3. Offers the best learning opportunity regardless of outcome

**Ask yourself:**
"If I were advising my best friend in this exact situation, what would I tell them?"

**Remember:** Most decisions are reversible. The cost of inaction often exceeds the cost of making a "wrong" choice that you can learn from.

There's no perfect decision - only your best decision with the information you have right now.`
}

function generateClarifyingQuestions(language: string): string[] {
  if (language === 'tr') {
    return [
      'İç sesin sana ne söylüyor?',
      'Başarısızlığın imkansız olduğunu bilsen hangisini seçerdin?',
      '10 yıl sonra hangi seçeneği denememiş olmaktan pişman olursun?',
      'Her seçenekte en çok neyden korkuyorsun?',
      'Para ve zaman faktör olmasaydı hangisini seçerdin?',
    ]
  }
  
  return [
    'What does your gut instinct tell you?',
    'Which would you choose if you knew you couldn\'t fail?',
    'Which option would you regret not trying 10 years from now?',
    'What are you most afraid of with each option?',
    'If money and time weren\'t factors, which would you choose?',
  ]
}