// Checkout API Route - Creates Lemon Squeezy checkout session
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createCheckout, VARIANT_IDS } from '@/lib/lemonsqueezy'

// Supabase admin client (service role key ile)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { variantId, billingPeriod } = body

    // Auth header'dan token al
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Token ile kullanıcıyı doğrula
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // Variant ID belirle
    let selectedVariantId = variantId
    if (!selectedVariantId) {
      // Billing period'a göre seç
      if (billingPeriod === 'yearly' && VARIANT_IDS.PRO_YEARLY) {
        selectedVariantId = VARIANT_IDS.PRO_YEARLY
      } else {
        selectedVariantId = VARIANT_IDS.PRO_MONTHLY
      }
    }

    if (!selectedVariantId) {
      return NextResponse.json(
        { error: 'No variant ID configured' },
        { status: 400 }
      )
    }

    // Checkout URL oluştur
    const checkoutUrl = await createCheckout(
      selectedVariantId,
      user.email!,
      user.id
    )

    return NextResponse.json({ checkoutUrl })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    )
  }
}
