import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { product, role, userId, language } = await request.json()

    if (!product) {
      return NextResponse.json({ error: 'Product description is required' }, { status: 400 })
    }

    if (userId) {
      const { data: credits, error: creditsError } = await supabase
        .from('credits')
        .select('balance, total_used')
        .eq('user_id', userId)
        .single()

      if (creditsError || !credits) {
        return NextResponse.json({ error: 'Credits not found' }, { status: 403 })
      }

      if (credits.balance < 2) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
      }
    }

    const prompt = language === 'tr'
      ? `Bir ürün yöneticisi gibi davran. Ürün: ${product}. Kullanıcı rolü: ${role || 'genel kullanıcı'}. 10 adımlık bir onboarding kontrol listesi hazırla. Her adım kısa ve eyleme dönük olsun. Türkçe yaz ve numaralı liste kullan.`
      : `Act as a product manager. Product: ${product}. User role: ${role || 'general user'}. Create a 10-step onboarding checklist. Each step should be short and action-oriented. Write in English and use a numbered list.`

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/microsoft/Phi-3-mini-4k-instruct',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 280,
            temperature: 0.5,
          },
        }),
      }
    )

    const rawText = await response.text()
    let result: any = null
    try {
      result = rawText ? JSON.parse(rawText) : null
    } catch {
      result = null
    }

    if (!response.ok || result?.error) {
      const errorMessage = result?.error || rawText || 'Hugging Face request failed'
      if (errorMessage.includes('loading')) {
        return NextResponse.json({ error: 'Model is loading. Please try again in 20 seconds.' }, { status: 503 })
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status || 500 })
    }

    const checklist = Array.isArray(result)
      ? result[0]?.generated_text
      : result?.generated_text
    const output = checklist || 'Could not generate checklist'

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
            balance: currentCredits.balance - 2,
            total_used: currentCredits.total_used + 2,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        await supabase
          .from('usage_history')
          .insert({
            user_id: userId,
            tool_name: 'onboarding-checklist',
            tool_display_name: 'Onboarding Checklist',
            credits_used: 2,
            input_preview: `${product} ${role || ''}`.trim().substring(0, 200),
            output_preview: output.substring(0, 200),
          })
      }
    }

    return NextResponse.json({ checklist: output })
  } catch (error) {
    console.log('❌ Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
